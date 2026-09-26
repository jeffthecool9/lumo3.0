import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import {config,readiness} from './config.js';
import {AppError} from './policy.js';
export function firebaseAdmin(){
  if(!readiness.authServer)throw new AppError(503,'Server sign-in verification is not connected yet. Your subscription has not started.');
  const app=getApps().find(a=>a.name==='lumo-server')??initializeApp({projectId:config.FIREBASE_PROJECT_ID,credential:
    config.FIREBASE_CLIENT_EMAIL&&config.FIREBASE_PRIVATE_KEY
      ?cert({projectId:config.FIREBASE_PROJECT_ID,clientEmail:config.FIREBASE_CLIENT_EMAIL,privateKey:config.FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n')})
      :applicationDefault()},'lumo-server');
  return getAuth(app);
}
export function hasVerifiedIdentity(user:Pick<DecodedIdToken,'email'|'email_verified'|'phone_number'>){
  return Boolean((user.email&&user.email_verified)||user.phone_number);
}
export async function verifyAccount(token:string){
  const verifier=firebaseAdmin();
  let user:DecodedIdToken;
  try{user=await verifier.verifyIdToken(token,true);}catch{throw new AppError(401,'Your session expired. Please sign in again.');}
  if(!hasVerifiedIdentity(user))throw new AppError(403,'Verify your email before continuing.');
  return user;
}
