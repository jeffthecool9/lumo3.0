import {initializeApp,getApps} from 'firebase/app';
import {getAuth,type Auth} from 'firebase/auth';
export interface PublicConfig {
  auth:boolean;authServer:boolean;database:boolean;billing:boolean;ai:boolean;
  firebase:{apiKey:string;authDomain:string;projectId:string;appId:string};
  stripePublishableKey:string;testMode:boolean;
}
export let auth:Auth|null=null;
export function connectAuth(config:PublicConfig){
  if(config.auth&&!auth){const app=getApps().find(a=>a.name==='lumo-web')??initializeApp(config.firebase,'lumo-web');auth=getAuth(app);auth.useDeviceLanguage();}
  return auth;
}
export async function api<T=any>(url:string,body?:unknown,method?:string):Promise<T>{
  const token=await auth?.currentUser?.getIdToken();
  const res=await fetch(`/api${url}`,{method:method??(body===undefined?'GET':'POST'),headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const json=await res.json().catch(()=>({error:'The service is unavailable. Please retry.'}));
  if(!res.ok)throw new Error(json.error??'The request could not finish.');return json;
}
export const draftKey='lumo-business-prompt';
export function readDraft(){try{return localStorage.getItem(draftKey)??'';}catch{return '';}}
export function saveDraft(value:string){try{localStorage.setItem(draftKey,value);}catch{}}
