import React from 'react';
import {ArrowLeft,BookOpen,CalendarDays,Clock,CreditCard,GraduationCap,GitBranch,LayoutDashboard,Link2,LogOut,MessageSquare,PanelLeftClose,Settings,ShoppingBag,Users,X} from 'lucide-react';
import {Brand} from './Brand';
export const workspaceTabs=[
  {id:'tutorial',label:'Tutorial',icon:GraduationCap,group:'START HERE'},
  {id:'knowledge',label:'Business details',icon:BookOpen,group:''},{id:'catalogue',label:'Products & prices',icon:ShoppingBag,group:''},
  {id:'plan',label:'Sales flow',icon:GitBranch,group:''},{id:'chat',label:'Practice chat',icon:MessageSquare,group:''},
  {id:'overview',label:'Overview',icon:LayoutDashboard,group:'DAILY SALES'},
  {id:'leads',label:'Leads',icon:Users,group:''},{id:'inbox',label:'Conversations',icon:MessageSquare,group:''},{id:'followups',label:'Follow-ups',icon:Clock,group:''},{id:'appointments',label:'Appointments',icon:CalendarDays,group:''},
  {id:'connections',label:'Connections',icon:Link2,group:'ACCOUNT'},{id:'billing',label:'Usage & billing',icon:CreditCard,group:''},{id:'settings',label:'Settings',icon:Settings,group:''},
] as const;
export type WorkspaceTab=typeof workspaceTabs[number]['id'];
export function WorkspaceNavigation({tab,collapsed,mobileOpen,name,sample,onNavigate,onCollapse,onClose,onSignOut}:{tab:WorkspaceTab;collapsed:boolean;mobileOpen:boolean;name:string;sample:boolean;onNavigate:(tab:WorkspaceTab)=>void;onCollapse:()=>void;onClose:()=>void;onSignOut:()=>void}){
  return <><button aria-label="Close workspace navigation" className={`ws-scrim ${mobileOpen?'visible':''}`} onClick={onClose}/><aside id="workspace-navigation" aria-label="Workspace sidebar" className={`ws-navigation ${collapsed?'collapsed':''} ${mobileOpen?'mobile-open':''}`}><div className="ws-brand-row"><Brand compact={collapsed}/><button className="icon-button ws-collapse" title="Collapse sidebar" aria-label="Collapse sidebar" onClick={onCollapse}><PanelLeftClose size={17}/></button><button className="icon-button ws-close" aria-label="Close menu" onClick={onClose}><X size={18}/></button></div><div className="ws-business"><span>{name.charAt(0)}</span><div><strong>{name}</strong><small>{sample?'Sample business':'Business workspace'}</small></div></div><nav aria-label="Workspace navigation">{workspaceTabs.map(t=><React.Fragment key={t.id}>{t.group&&<span className="ws-nav-group">{t.group}</span>}<button title={t.label} aria-label={t.label} aria-current={tab===t.id?'page':undefined} className={tab===t.id?'active':''} onClick={()=>onNavigate(t.id)}><t.icon size={18}/><span>{t.label}</span></button></React.Fragment>)}</nav><div className="ws-nav-bottom"><a href="/" title="Back to Lumo" aria-label="Back to Lumo"><ArrowLeft size={17}/><span>Back to Lumo</span></a>{!sample&&<button title="Sign out" aria-label="Sign out" onClick={onSignOut}><LogOut size={17}/><span>Sign out</span></button>}<span className="ws-sample-label">{sample?'Sample data only':'Private workspace'}</span></div></aside></>;
}
