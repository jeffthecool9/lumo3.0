import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import {z} from 'zod';
import {config,readiness} from './config.js';
import {AppError} from './policy.js';
const serviceAccountSchema=z.object({
  type:z.literal('service_account'),project_id:z.string().min(1),
  client_email:z.email(),private_key:z.string().min(1),
});
type CredentialConfig=Pick<typeof config,'FIREBASE_PROJECT_ID'|'FIREBASE_CLIENT_EMAIL'|'FIREBASE_PRIVATE_KEY'|'FIREBASE_SERVICE_ACCOUNT_JSON'>;

export function firebaseCertificate(settings:CredentialConfig){
  try{
    if(settings.FIREBASE_SERVICE_ACCOUNT_JSON){
      const account=serviceAccountSchema.parse(JSON.parse(settings.FIREBASE_SERVICE_ACCOUNT_JSON));
      if(account.project_id!==settings.FIREBASE_PROJECT_ID)throw new Error('Project mismatch');
      return {projectId:account.project_id,clientEmail:account.client_email,privateKey:normalizePrivateKey(account.private_key)};
    }
    if(settings.FIREBASE_CLIENT_EMAIL||settings.FIREBASE_PRIVATE_KEY){
      if(!settings.FIREBASE_CLIENT_EMAIL||!settings.FIREBASE_PRIVATE_KEY)throw new Error('Incomplete credentials');
      return {projectId:settings.FIREBASE_PROJECT_ID,clientEmail:z.email().parse(settings.FIREBASE_CLIENT_EMAIL.trim()),privateKey:normalizePrivateKey(settings.FIREBASE_PRIVATE_KEY)};
    }
    return null;
  }catch{
    throw new AppError(503,'Server sign-in credentials are invalid. The operator needs to update the Firebase configuration.');
  }
}
function normalizePrivateKey(value:string){
  const key=value.replace(/\\r\\n/g,'\n').replace(/\\n/g,'\n').replace(/\r\n/g,'\n').trim();
  if(!key.startsWith('-----BEGIN PRIVATE KEY-----\n')||!key.endsWith('\n-----END PRIVATE KEY-----'))throw new Error('Invalid private key');
  return key+'\n';
}
export function firebaseAdmin(){
  if(!readiness.authServer)throw new AppError(503,'Server sign-in verification is not connected yet. Your subscription has not started.');
  try{
    const existing=getApps().find(a=>a.name==='lumo-server');
    if(existing)return getAuth(existing);
    const certificate=firebaseCertificate(config);
    const app=initializeApp({projectId:config.FIREBASE_PROJECT_ID,credential:certificate?cert(certificate):applicationDefault()},'lumo-server');
    return getAuth(app);
  }catch(error){
    if(error instanceof AppError)throw error;
    throw new AppError(503,'Server sign-in verification could not start. The operator needs to check the Firebase credentials.');
  }
}
export function hasVerifiedIdentity(user:Pick<DecodedIdToken,'email'|'email_verified'|'phone_number'>){
  return Boolean((user.email&&user.email_verified)||user.phone_number);
}
export async function verifyAccount(token:string){
  const verifier=firebaseAdmin();
  let user:DecodedIdToken;
  try{user=await verifier.verifyIdToken(token,true);}catch(error){
    const code=(error as {code?:string})?.code;
    if(['auth/id-token-expired','auth/id-token-revoked','auth/invalid-id-token','auth/argument-error','auth/user-disabled','auth/user-not-found'].includes(code??'')){
      throw new AppError(401,'Your session expired or is invalid. Please sign in again.');
    }
    throw new AppError(503,'Sign-in verification is temporarily unavailable. Please try again shortly.');
  }
  if(!hasVerifiedIdentity(user))throw new AppError(403,'Verify your email before continuing.');
  return user;
}
