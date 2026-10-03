import React from 'react';
import {ArrowRight,BookOpen,Check,MessageSquare,ShoppingBag,GitBranch} from 'lucide-react';
import {setupSteps,type SetupTab} from '../shared/onboarding';
import type {WorkspaceTab} from './WorkspaceNavigation';
import './tutorial.css';
const icons=[BookOpen,ShoppingBag,GitBranch,MessageSquare];
export function Tutorial({complete,onNavigate,onReplay}:{complete:boolean[];onNavigate:(tab:WorkspaceTab)=>void;onReplay:()=>void}){
 const count=complete.filter(Boolean).length;
 const first=complete.findIndex(v=>!v);
 return <section className="tutorial"><div className="page-heading"><div><span className="overline">YOUR LUMO JOURNEY</span><h1>Tutorial</h1></div><button className="button secondary small" onClick={onReplay}>Welcome tour</button></div><div className="guide-progress"><strong>{count} of 4 ready</strong><progress aria-label="Assistant setup progress" value={count} max={4}/></div><ol className="guide-steps">{setupSteps.map((step,i)=>{const Icon=icons[i];return <li key={step.id} className={complete[i]?'complete':first===i?'current':''}><span className="guide-number">{complete[i]?<Check size={18}/>:i+1}</span><div className="guide-task"><span className="guide-icon" aria-hidden="true"><Icon size={19}/></span><h2>{step.title}</h2><span>{complete[i]?'Ready':first===i?'Next step':'Not ready'}</span></div><button aria-label={complete[i]?`Review ${step.title}`:step.action} className={`button ${first===i?'primary':'secondary'} small`} onClick={()=>onNavigate(step.id)}>{complete[i]?'Review':step.action}<ArrowRight size={16}/></button></li>;})}</ol><div className="guide-finish"><div><h2>Customer channels</h2><span className="badge neutral">Not activated</span></div><button className="button secondary small" onClick={()=>onNavigate('connections')}>View connections<ArrowRight size={16}/></button></div><div className="guide-links"><button onClick={()=>onNavigate('leads')}>Leads<ArrowRight size={16}/></button><button onClick={()=>onNavigate('followups')}>Follow-ups<ArrowRight size={16}/></button><button onClick={()=>onNavigate('billing')}>Usage & billing<ArrowRight size={16}/></button></div></section>;
}
export function SetupNext({next,current,onNavigate}:{next:{id:SetupTab;action:string}|null;current:WorkspaceTab;onNavigate:(tab:WorkspaceTab)=>void}){
 const onStep=next?.id===current;
 return <div className="setup-next"><span>{next?'Assistant setup':'Private setup ready'}</span><button className="text-button" onClick={()=>onNavigate(onStep?'tutorial':next?.id??'tutorial')}>{onStep?'Back to tutorial':next?.action??'Review setup'}<ArrowRight size={15}/></button><button className="icon-button" title="Open tutorial" aria-label="Open tutorial" onClick={()=>onNavigate('tutorial')}><BookOpen size={17}/></button></div>;
}
