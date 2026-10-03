import React, {useState} from 'react';
import {ArrowUpRight, BookOpen, Check, GitBranch, Target} from 'lucide-react';
import {BrandMark} from './Brand';

const views = [
  {name:'Business Knowledge', tab:'knowledge', icon:BookOpen, copy:'Your facts. Before any answer.'},
  {name:'Conversation Plan', tab:'plan', icon:GitBranch, copy:'A clear path. With your approval.'},
  {name:'Leads', tab:'leads', icon:Target, copy:'The buyer context your team needs.'},
];
export function ProductShowcase() {
  const [active,setActive]=useState(0);
  function keyboard(event:React.KeyboardEvent<HTMLButtonElement>,index:number) {
    let next=index;
    if(event.key==='ArrowRight') next=(index+1)%3;
    else if(event.key==='ArrowLeft') next=(index+2)%3;
    else if(event.key==='Home') next=0;
    else if(event.key==='End') next=2;
    else return;
    event.preventDefault();setActive(next);document.getElementById(`showcase-tab-${next}`)?.focus();
  }
  return <section className="ls-showcase ls-wrap" id="workspace-preview">
    <div className="ls-section-top"><span>BEHIND EVERY GOOD CONVERSATION</span><span>ILLUSTRATIVE WORKSPACE</span></div>
    <div className="ls-showcase-heading"><h2 data-motion="headline">Not just a bot.<br/>Your sales workspace.</h2><div role="tablist" aria-label="Workspace views">{views.map((view,index) => <button role="tab" id={`showcase-tab-${index}`} aria-selected={active===index} aria-controls={`showcase-panel-${index}`} tabIndex={active===index ? 0 : -1} key={view.tab} onClick={() => setActive(index)} onKeyDown={event => keyboard(event,index)}><view.icon size={18}/>{view.name}</button>)}</div></div>
    <div className="ls-workspace-visual">{views.map((view,index) => <div role="tabpanel" tabIndex={0} id={`showcase-panel-${index}`} aria-labelledby={`showcase-tab-${index}`} hidden={active!==index} key={view.tab}>
      <div className="ls-workspace-top"><BrandMark/><strong>Everyday Studio</strong><span>Sample only</span><view.icon size={20}/></div>
      {index===0 ? <div className="ls-knowledge-visual"><div><span>APPROVED BUSINESS KNOWLEDGE</span><h3>Canvas tote</h3><strong className="ls-workspace-price">RM129</strong><p>Gift-ready essentials. Prices from approved records.</p></div><dl>{[['Price','RM129 / approved'],['Colour & stock','Confirm with the team'],['Delivery','Confirm before promising'],['Discounts','Never invent unlisted offers']].map(([label,value]) => <div key={label}><dt>{label}</dt><dd><Check size={15}/>{value}</dd></div>)}</dl></div> : index===1 ? <div className="ls-plan-visual"><span>DRAFT → REVIEW → APPROVE → PRIVATE TEST</span><ol>{[['Welcome','Answer the enquiry in the buyer’s language.'],['Understand','Ask about need, budget and buying timeline.'],['Guide','Use approved facts. Clarify anything missing.'],['Hand off','Ask permission and pass useful context to your team.']].map(([title,detail],i) => <li key={title}><span>0{i+1}</span><div><strong>{title}</strong><p>{detail}</p></div><Check size={17}/></li>)}</ol></div> : <div className="ls-leads-visual"><span>QUALIFIED ENQUIRY / ILLUSTRATIVE CONTACT</span><h3>A gift. A budget. A deadline.</h3><dl>{[['Interest','Canvas tote, black'],['Budget','Below RM150'],['Timing','By Friday'],['Next action','Confirm colour & delivery'],['Contact','Ask permission first']].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>No real lead has been created.</p></div>}
    </div>)}</div>
    <div className="ls-showcase-footer"><p>{views[active].copy}</p><a className="ls-text-link" href={`/sample?tab=${views[active].tab}`}>Explore workspace<ArrowUpRight size={18}/></a></div>
  </section>;
}
