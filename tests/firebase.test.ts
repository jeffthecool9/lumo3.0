import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {config,readiness} from '../server/config';
import {firebaseAdmin,firebaseCertificate,verifyAccount} from '../server/firebase';

const sdk=vi.hoisted(()=>({
  getApps:vi.fn(),initializeApp:vi.fn(),cert:vi.fn(),applicationDefault:vi.fn(),
  getAuth:vi.fn(),verifyIdToken:vi.fn(),
}));
vi.mock('firebase-admin/app',()=>({
  getApps:sdk.getApps,initializeApp:sdk.initializeApp,cert:sdk.cert,applicationDefault:sdk.applicationDefault,
}));
vi.mock('firebase-admin/auth',()=>({getAuth:sdk.getAuth}));

const key='-----BEGIN PRIVATE KEY-----\nTEST-ONLY\n-----END PRIVATE KEY-----\n';
const settings={
  FIREBASE_PROJECT_ID:'lumo-test',FIREBASE_CLIENT_EMAIL:'server@lumo-test.iam.gserviceaccount.com',
  FIREBASE_PRIVATE_KEY:key,FIREBASE_SERVICE_ACCOUNT_JSON:'',
};
const original={...config};
const originalReady=readiness.authServer;
beforeEach(()=>{
  vi.resetAllMocks();
  Object.assign(config,settings);
  readiness.authServer=true;
  sdk.getApps.mockReturnValue([]);
  sdk.initializeApp.mockReturnValue({name:'lumo-server'});
  sdk.getAuth.mockReturnValue({verifyIdToken:sdk.verifyIdToken});
});
afterEach(()=>{
  Object.assign(config,original);
  readiness.authServer=originalReady;
});

describe('Firebase server credentials',()=>{
  it.each([key,key.replace(/\n/g,'\\n'),key.replace(/\n/g,'\r\n'),key.replace(/\n/g,'\\r\\n')])('normalizes PEM line endings',value=>{
    expect(firebaseCertificate({...settings,FIREBASE_PRIVATE_KEY:value})?.privateKey).toBe(key);
  });
  it('accepts a matching service-account JSON secret',()=>{
    const json=JSON.stringify({type:'service_account',project_id:'lumo-test',client_email:settings.FIREBASE_CLIENT_EMAIL,private_key:key});
    expect(firebaseCertificate({...settings,FIREBASE_SERVICE_ACCOUNT_JSON:json})).toEqual({
      projectId:'lumo-test',clientEmail:settings.FIREBASE_CLIENT_EMAIL,privateKey:key,
    });
  });
  it.each([
    {FIREBASE_SERVICE_ACCOUNT_JSON:'not-json PRIVATE-DATA'},
    {FIREBASE_SERVICE_ACCOUNT_JSON:JSON.stringify({type:'service_account',project_id:'other-project',client_email:settings.FIREBASE_CLIENT_EMAIL,private_key:key})},
    {FIREBASE_PRIVATE_KEY:'PRIVATE-DATA'},
    {FIREBASE_CLIENT_EMAIL:''},
  ])('rejects invalid credentials without exposing their values',override=>{
    try{firebaseCertificate({...settings,...override});throw new Error('Expected rejection');}
    catch(error){expect(error).toMatchObject({status:503});expect((error as Error).message).not.toContain('PRIVATE-DATA');}
  });
  it('uses application default credentials when inline credentials are absent',()=>{
    Object.assign(config,{FIREBASE_CLIENT_EMAIL:'',FIREBASE_PRIVATE_KEY:''});
    firebaseAdmin();
    expect(sdk.applicationDefault).toHaveBeenCalledOnce();
    expect(sdk.cert).not.toHaveBeenCalled();
  });
  it('reuses the named app rather than initializing twice',()=>{
    const app={name:'lumo-server'};
    sdk.getApps.mockReturnValue([app]);
    firebaseAdmin();
    expect(sdk.getAuth).toHaveBeenCalledWith(app);
    expect(sdk.initializeApp).not.toHaveBeenCalled();
  });
  it('returns unavailable for a failed Admin SDK initialization',()=>{
    sdk.cert.mockImplementation(()=>{throw new Error('PRIVATE-DATA');});
    expect(()=>firebaseAdmin()).toThrow('Server sign-in verification could not start');
  });
  it('does not initialize an unconfigured server',()=>{
    readiness.authServer=false;
    expect(()=>firebaseAdmin()).toThrow('not connected');
    expect(sdk.initializeApp).not.toHaveBeenCalled();
  });
});

describe('Google and Gmail server verification',()=>{
  it('accepts a verified Google identity and checks token revocation',async()=>{
    const user={uid:'owner',email:'owner@gmail.com',email_verified:true,firebase:{sign_in_provider:'google.com'}};
    sdk.verifyIdToken.mockResolvedValue(user);
    expect(await verifyAccount('signed-token')).toEqual(user);
    expect(sdk.verifyIdToken).toHaveBeenCalledWith('signed-token',true);
  });
  it('requires verification for an unverified Gmail password account',async()=>{
    sdk.verifyIdToken.mockResolvedValue({uid:'owner',email:'owner@gmail.com',email_verified:false});
    await expect(verifyAccount('signed-token')).rejects.toMatchObject({status:403});
  });
  it.each(['auth/id-token-expired','auth/id-token-revoked','auth/invalid-id-token','auth/argument-error','auth/user-disabled','auth/user-not-found'])('rejects %s',async code=>{
    sdk.verifyIdToken.mockRejectedValue({code});
    await expect(verifyAccount('bad-token')).rejects.toMatchObject({status:401});
  });
  it('distinguishes a Firebase outage from an invalid user session',async()=>{
    sdk.verifyIdToken.mockRejectedValue({code:'auth/internal-error',message:'PRIVATE-DATA'});
    await expect(verifyAccount('signed-token')).rejects.toMatchObject({status:503,message:'Sign-in verification is temporarily unavailable. Please try again shortly.'});
  });
});
