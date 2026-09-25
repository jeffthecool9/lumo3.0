import React,{useState} from 'react';
import {type User} from 'firebase/auth';
import {ArrowRight,Check,LockKeyhole,ShieldCheck,LoaderCircle} from 'lucide-react';
import {Modal} from './Modal';
import {AuthPanel} from './AuthPanel';
import {api,type PublicConfig} from './api';
export function Gate({config,user,onClose,onSignedIn,intent='trial'}:{config:PublicConfig|null;user:User|null;onClose:()=>void;onSignedIn:()=>void;intent?:'login'|'trial'}){
  const verified=!!user&&(user.emailVerified||!!user.phoneNumber);
  const [mode,setMode]=useState<'trial'|'paid'>('trial');const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [consent,setConsent]=useState(false);
  const date=new Date(Date.now()+7*86400000).toLocaleDateString('en-MY',{day:'numeric',month:'long',year:'numeric'});
  if(!verified)return <Modal title="Sign in to Lumo" onClose={onClose} className="auth-modal" hideHeading><AuthPanel config={config} user={user} initialMode={intent==='login'?'login':'register'} onSuccess={onSignedIn}/></Modal>;
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{const result=await api('/billing/checkout',{mode});location.assign(result.url);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  return <Modal title="Your next chapter starts here." onClose={onClose} className="checkout-modal">
    <p className="muted">Your account is verified. Choose how to start your workspace.</p>
    <div className="gate-steps"><span className="done"><span><Check size={12}/></span>Verified account</span><i/><span className="current"><span>2</span>Secure checkout</span><i/><span><span>3</span>Create</span></div>
    <div className="segmented"><button className={mode==='trial'?'selected':''} onClick={()=>setMode('trial')}>7-day trial</button><button className={mode==='paid'?'selected':''} onClick={()=>setMode('paid')}>Subscribe now</button></div>
    <div className="checkout-summary"><span>Lumo Starter</span><strong>{mode==='trial'?'RM0':'RM99'}<small> today</small></strong><p>{mode==='trial'?`Then RM99/month. If started today, first billing is ${date}.`:'RM99 billed monthly, starting today.'}</p><ul><li><Check/>1 private assistant</li><li><Check/>{mode==='trial'?'3 plan generations + 50 test replies':'30 plan generations + 500 test replies/month'}</li><li><Check/>Cancel renewal in Usage & Billing</li></ul></div>
    <p className="fine">Credit or debit card required. Renews automatically until cancelled. AI budget: {mode==='trial'?'US$0.50 total':'US$5/month'}; first reached limit applies. No overage charges.</p>
    <form onSubmit={submit} className="gate-form"><label className="check-label"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/><span>I agree to the <a href="/terms" target="_blank" rel="noreferrer">terms</a>, <a href="/privacy" target="_blank" rel="noreferrer">privacy notice</a>, and automatic RM99 monthly renewal{mode==='trial'?' after seven days':''}.</span></label>{!config?.billing&&<div className="notice"><LockKeyhole size={17}/><span>Secure checkout is being connected. No payment or trial has started.</span></div>}{error&&<p role="alert" className="error">{error}</p>}<button className="auth-primary" disabled={busy||!config?.billing||!consent}>{busy?<LoaderCircle className="spin" size={17}/>:<LockKeyhole size={17}/>}Continue to Stripe<ArrowRight size={17}/></button></form><div className="secure-line"><ShieldCheck size={14}/>Card details stay with Stripe.</div>
  </Modal>;
}
