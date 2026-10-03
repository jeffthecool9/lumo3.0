import React, {useEffect, useRef, useState} from 'react';
import {ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCheck, ChevronDown, Globe2, LockKeyhole, Menu, MessageSquare, Moon, Plus, RotateCcw, Send, ShieldCheck, Sparkles, Sun, Target, Users, X} from 'lucide-react';
import {Brand, BrandMark} from './Brand';
import {readDraft, saveDraft} from './api';
import {businesses, demoReply} from './landing-data';
import {salesStops} from './scroll-motion';
import {useLandingMotion} from './landing-motion';
import './story-landing.css';
import './cinematic.css';

const stages = [
  {label:'The enquiry', title:'A question. An opportunity.', detail:'Start where your customer starts.', icon:MessageSquare},
  {label:'Your facts', title:'Good answers start with facts.', detail:'Products, RM prices and policies you approve.', icon:BookOpen},
  {label:'Their language', title:'One buyer. All their languages.', detail:'English, BM, 中文. Even in the same chat.', icon:Globe2},
  {label:'Buying intent', title:'Know what matters to the buyer.', detail:'The need. The budget. The buying timeline.', icon:Target},
  {label:'The next step', title:'Your team takes it from here.', detail:'Useful context, not another cold conversation.', icon:Users},
];
const questions = [
  ['What can I use today?', 'Build and review a sales conversation plan, manage business knowledge and products, and rehearse privately in the workspace. The public conversation is a preset demo. Live WhatsApp replies, website embeds, customer checkout and automatic follow-ups are not available yet.'],
  ['Is this only for appointments?', 'No. Lumo is designed for lead generation and sales conversations across products and services. A quote, purchase link, human follow-up or appointment can be the next step. Your team confirms prices, stock and availability whenever these are not in approved records.'],
  ['How does the trial and monthly plan work?', 'Subscriptions open at launch. An eligible business can start a seven-day card-required trial: RM0 today, then RM99/month unless renewal is cancelled before expiry. Checkout will show the exact first payment date. Cancel in Usage & Billing; access continues until the trial or paid period ends. Saved work remains available afterwards. Checkout is not active in this preview.'],
  ['Are there AI usage limits?', 'Yes. The trial includes up to 3 generations, 50 test replies and a US$0.50 AI budget total. Each paid month includes up to 30 generations, 500 test replies and a US$5 AI budget. The first limit reached applies, so longer conversations can use the budget before the reply allowance. No automatic overage charges.'],
  ['Does Lumo guarantee accurate answers or sales?', 'No AI can guarantee either. Lumo is designed to use your approved business facts, ask for clarification and hand off uncertain answers. Review and approve your flow, then test it before use. The public demo uses preset replies; live multilingual quality and integrations need verification before launch.'],
];

function goTo(id: string, focus = false) {
  document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
  if (focus) document.getElementById('business-idea')?.focus({preventScroll:true});
}

function BusinessImage({index, className = ''}: {index:number; className?:string}) {
  const [failed, setFailed] = useState(false);
  const business = businesses[index];
  useEffect(() => setFailed(false), [index]);
  return <div className={`ls-business-image ${className}`}>
    {failed ? <div className="ls-image-fallback"><business.icon size={46}/><strong>{business.name}</strong></div> : <img src={business.image} alt={business.alt} loading="lazy" onError={() => setFailed(true)}/>}
  </div>;
}

function BuyerConversation() {
  return <div className="ls-conversation">
    <div className="ls-message visitor">Hi, tote ni berapa? 有黑色吗？</div>
    <div className="ls-message agent"><BrandMark/><p><strong className="ls-cited-price">RM129 <CheckCheck size={14}/></strong> for the canvas tote. Let me check black with our team. Nak pakai sendiri or as a gift?</p></div>
    <div className="ls-message visitor">Gift. Budget below RM150, need by Friday.</div>
    <div className="ls-message agent"><BrandMark/><p>Boleh. May I take your contact so our team can confirm the colour and delivery timing?</p></div>
  </div>;
}

function LeadSummary() {
  return <div className="ls-lead-summary"><div className="ls-lead-person"><span><Users size={25}/></span><div><h3>A buyer. Not just a message.</h3><p>Illustrative enquiry / Everyday Studio</p></div></div>
    <dl>{[['Looking for','Canvas tote, black'],['Budget','Below RM150'],['Purchase timing','By Friday'],['Next step','Confirm colour & delivery']].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="ls-handoff"><ShieldCheck size={18}/><span>Stock and delivery need team confirmation.</span></div>
  </div>;
}

function SalesEvidence({index}: {index:number}) {
  return <div className={`ls-evidence ls-evidence-${index}`}>
    {index === 0 ? <div className="ls-enquiry-evidence"><BusinessImage index={2}/><div><span className="ls-evidence-label">EVERYDAY STUDIO / PRODUCT ENQUIRY</span><MessageSquare size={30}/><p>Hi, tote ni berapa?<br/>有黑色吗？</p><span>English + BM + 中文</span></div></div> :
      index === 1 ? <div className="ls-source-evidence"><div className="ls-source-record"><BookOpen size={27}/><span className="ls-evidence-label">APPROVED PRODUCT RECORD</span><h3>Canvas tote</h3><strong className="ls-source-price">RM129</strong><div><Check size={16}/>Price in your business knowledge</div><p>Stock & delivery: ask the team.<br/>Unlisted discounts: never invent.</p></div><div className="ls-answer-record"><BrandMark/><span className="ls-evidence-label">THE ANSWER</span><p>“RM129 for the canvas tote.”</p><span className="ls-source-link"><CheckCheck size={18}/>From the approved record</span></div></div> :
      index === 2 ? <div className="ls-chat-evidence"><div className="ls-language-strip"><span>EN</span><ArrowRight size={14}/><span>BM</span><ArrowRight size={14}/><span>中文</span><strong>Same conversation.</strong></div><BuyerConversation/></div> :
      index === 3 ? <div className="ls-intent-evidence"><div className="ls-intent-quote"><MessageSquare size={24}/><p>“Gift. Budget below RM150,<br/>need by Friday.”</p></div><div className="ls-intent-fields">{[['Need','Canvas tote, black'],['Budget','Below RM150'],['Timing','By Friday']].map(([label,value],i) => <div key={label}><span>0{i+1} / {label}</span><strong>{value}</strong><Check size={19}/></div>)}</div></div> :
      <div className="ls-handoff-evidence"><LeadSummary/><div className="ls-human-step"><ShieldCheck size={24}/><div><strong>Ready for a human follow-up</strong><p>Confirm the colour and delivery.<br/>Contact details only with permission.</p></div><a href="/sample?tab=leads" className="ls-text-link">Explore leads<ArrowUpRight size={18}/></a></div></div>}
  </div>;
}

function SalesStory() {
  function select(index:number) {
    const section = document.getElementById('how-it-works');
    if (!section) return;
    if (innerWidth <= 800 || innerHeight <= 650 || matchMedia('(prefers-reduced-motion: reduce)').matches) {goTo(`chapter-${index}`); return;}
    const header = document.querySelector('.ls-header')?.getBoundingClientRect().height ?? 80;
    const start = section.getBoundingClientRect().top + scrollY - header;
    window.scrollTo({top:start + (section.offsetHeight - innerHeight + header) * salesStops[index], behavior:'smooth'});
  }
  return <section className="ls-sales-story ls-difference" id="how-it-works">
    <div className="ls-sales-pin"><div className="ls-wrap ls-sales-inner">
      <div className="ls-section-top"><span>ONE ENQUIRY. MORE POSSIBILITIES.</span><span>EVERYDAY STUDIO / ILLUSTRATIVE STORY</span></div>
      <div className="ls-sales-stage">{stages.map((stage,index) => <article className="ls-sales-panel" id={`chapter-${index}`} key={stage.label} data-scene={index}>
        <div className="ls-sales-caption"><span className="ls-sales-number">0{index+1}<stage.icon size={20}/></span><h2>{stage.title}</h2><p>{stage.detail}</p></div>
        <SalesEvidence index={index}/>
      </article>)}</div>
      <nav className="ls-sales-nav" aria-label="Product story chapters">{stages.map((stage,index) => <button key={stage.label} data-story-step={index} aria-current={index === 0 ? 'step' : undefined} onClick={() => select(index)}><span>0{index+1}</span>{stage.label}<ArrowDown size={14}/></button>)}</nav>
      <div className="ls-sales-track" aria-hidden="true"><span/></div><p className="ls-story-disclosure">Illustrative product story. No customer messages are sent.</p>
    </div></div>
  </section>;
}

function DemoChat({businessIndex,onInteraction}: {businessIndex:number; onInteraction:() => void}) {
  const [messages,setMessages] = useState<{role:'user'|'bot'; text:string}[]>([]);
  const [input,setInput] = useState('');
  const [typing,setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const business = businesses[businessIndex];
  const exhausted = messages.length >= 16;
  useEffect(() => () => {if (timer.current) clearTimeout(timer.current);}, []);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null; setMessages([]); setInput(''); setTyping(false);
  }, [businessIndex]);
  useEffect(() => {if (log.current) log.current.scrollTop = log.current.scrollHeight;}, [messages,typing]);
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null; setMessages([]); setInput(''); setTyping(false);
  }
  function send(text = input) {
    const value = text.trim().slice(0,500);
    if (!value || typing || exhausted) return;
    onInteraction();
    const previous = messages.filter(m => m.role === 'user').at(-1)?.text;
    setMessages(m => [...m,{role:'user',text:value}]); setInput(''); setTyping(true);
    timer.current = setTimeout(() => {
      setMessages(m => [...m,{role:'bot',text:demoReply(business.id,value,previous)}]); setTyping(false); timer.current = null;
    },600);
  }
  return <div className="ls-demo-window">
    <div className="ls-demo-window-head"><BrandMark/><div><strong>{business.name}</strong><span>Lumo sample sales agent</span></div><span className="ls-preset-badge">Preset demo</span><button className="ls-icon" title="Restart sample conversation" aria-label="Restart sample conversation" onClick={reset}><RotateCcw size={18}/></button></div>
    <div ref={log} className="ls-demo-log" role="log" aria-label="Sample conversation" aria-live="polite"><span className="ls-chat-date">ENGLISH, BM, 中文. YOUR WAY.</span><div className="ls-message agent"><BrandMark/><p>{business.greeting}</p></div>{messages.map((m,i) => <div className={`ls-message ${m.role === 'user' ? 'visitor' : 'agent'}`} key={i}>{m.role === 'bot' && <BrandMark/>}<p>{m.text}</p></div>)}{typing && <div className="ls-message agent"><BrandMark/><p className="ls-typing" aria-label="Preparing preset reply"><span/><span/><span/></p></div>}</div>
    <div className="ls-suggestions">{business.questions.map(q => <button key={q} disabled={typing || exhausted} onClick={() => send(q)}>{q}<ArrowUpRight size={13}/></button>)}</div>
    <form className="ls-chat-input" onSubmit={e => {e.preventDefault(); send();}}><input aria-label="Message the sample chatbot" placeholder={exhausted ? 'Restart to try another conversation' : 'Ask in English, BM or 中文...'} value={input} maxLength={500} disabled={typing || exhausted} onChange={e => setInput(e.target.value)}/><button className="ls-icon" type="submit" disabled={!input.trim() || typing || exhausted} aria-label="Send sample message" title="Send sample message"><Send size={18}/></button></form><p className="ls-demo-disclosure">Preset demo. No real leads, orders or messages are sent.</p>
  </div>;
}

export function StoryLanding({onStart,onLogin,signedIn,theme,onTheme}: {onStart:() => void; onLogin:() => void; signedIn:boolean; theme:'dark'|'light'; onTheme:() => void}) {
  const [prompt,setPrompt] = useState(readDraft);
  const [menu,setMenu] = useState(false);
  const [businessIndex,setBusinessIndex] = useState(2);
  const [interacted,setInteracted] = useState(false);
  const [faq,setFaq] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const business = businesses[businessIndex];
  useLandingMotion(root);
  useEffect(() => {const escape = (event:KeyboardEvent) => {if (event.key === 'Escape') setMenu(false);}; window.addEventListener('keydown',escape); return () => window.removeEventListener('keydown',escape);}, []);
  function updatePrompt(value:string) {setPrompt(value); saveDraft(value);}
  function useExample() {updatePrompt(business.prompt); goTo('builder',true);}
  const begin = () => goTo('builder',true);
  return <div className="lumo-story ls-product-led" ref={root}>
    <a className="ls-skip" href="#business-idea">Skip to builder</a><div className="ls-progress"/>
    <header className="ls-header"><div className="ls-header-inner"><Brand/><nav aria-label="Main navigation"><a href="#how-it-works">The Lumo difference</a><a href="#playground">Try Lumo</a><a href="#pricing">Pricing</a></nav><div className="ls-header-actions"><button className="ls-icon" onClick={onTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon size={19}/> : <Sun size={19}/>}</button><button className="ls-login" onClick={onLogin}>{signedIn ? 'Workspace' : 'Log in'}</button><button className="ls-button ls-nav-cta" onClick={() => goTo('playground')}>Try a conversation<ArrowUpRight size={17}/></button><button className="ls-icon ls-menu" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="ls-mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <X size={22}/> : <Menu size={22}/>}</button></div></div>{menu && <nav id="ls-mobile-nav" className="ls-mobile-nav" aria-label="Mobile navigation">{[['The Lumo difference','#how-it-works'],['Try Lumo','#playground'],['Pricing','#pricing']].map(([label,href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight size={18}/></a>)}<button onClick={() => {setMenu(false); begin();}}>Build your agent<ArrowUpRight size={18}/></button></nav>}</header>
    <main>
      <section className="ls-hero" id="hero">
        <div className="ls-hero-echo" aria-hidden="true"><span>Berapa?</span><span>可以吗？</span><span>Can ah?</span></div>
        <div className="ls-hero-title"><span className="ls-kicker"><span className="ls-dot"/>MADE FOR MALAYSIAN BUSINESSES</span><h1>Lumo. Your Malaysian<br/>AI <span>sales agent.</span></h1><p className="ls-hero-sub">Answer enquiries. Understand buyers.<br className="ls-mobile-break"/> Move the sale forward.</p></div>
        <div className={`ls-hero-demo ${interacted ? 'has-interacted' : ''}`} id="playground"><DemoChat businessIndex={businessIndex} onInteraction={() => setInteracted(true)}/></div>
        <div className="ls-hero-links"><span><LockKeyhole size={14}/>No account. No card. Preset replies.</span><button onClick={begin}>Build your own<ArrowUpRight size={15}/></button></div>
      </section>
      <section className="ls-manifesto ls-wrap" aria-label="The Lumo difference"><span className="ls-kicker">FROM THE FIRST QUESTION TO THE NEXT STEP</span><h2 data-motion="statement"><span>Not just replies.</span><br/><span>Sales conversations.</span></h2><a href="#how-it-works" className="ls-story-cue">Follow one enquiry<ArrowDown size={20}/></a></section>
      <SalesStory/>
      <section className="ls-business-band" id="use-cases"><div className="ls-wrap"><div className="ls-section-top"><span>SELL PRODUCTS. SELL SERVICES.</span><span>APPOINTMENTS ARE JUST ONE NEXT STEP.</span></div><div className="ls-business-heading"><h2 data-motion="headline">Your business.<br/>Your way to sell.</h2><div role="group" aria-label="Business examples" className="ls-business-selector">{businesses.map((b,i) => <button aria-pressed={businessIndex === i} key={b.id} onClick={() => setBusinessIndex(i)}><b.icon size={20}/>{b.label}<ArrowUpRight size={18}/></button>)}</div></div>
        <div className="ls-business-feature"><div className="ls-business-media" data-motion="image">{businesses.map((b,i) => <div className="ls-business-layer" aria-hidden={businessIndex !== i} data-active={businessIndex === i} key={b.id}><BusinessImage index={i}/></div>)}<span><business.icon size={18}/>{business.name} / Sample business</span></div><div className="ls-business-copy" key={business.id}><span className="ls-kicker">{business.category}</span><h3>{business.headline}</h3><p>{business.description}</p><div className="ls-example-proof"><span className="ls-evidence-label">SAMPLE CUSTOMER</span><p>{business.questions[0]}</p><span className="ls-evidence-label">APPROVED STARTING POINT</span><p>{business.fact}</p><strong><ArrowRight size={16}/>{['Consultation or team quote','Qualified quote request','Purchase guidance or team handoff'][businessIndex]}</strong></div><div className="ls-example-actions"><button className="ls-text-link" onClick={() => goTo('playground')}>Try this conversation<ArrowUpRight size={18}/></button><button className="ls-text-link" onClick={useExample}>Use this example<ArrowUpRight size={18}/></button></div></div></div>
      </div></section>
      <section className="ls-build-section ls-wrap" id="builder"><div><span className="ls-kicker">YOUR BUSINESS. YOUR LUMO.</span><h2 data-motion="headline">Make the next<br/>conversation yours.</h2><p>What do you sell?<br/>Who do you want to reach?</p></div><div><form className="ls-composer" onSubmit={e => {e.preventDefault(); saveDraft(prompt); onStart();}}><label htmlFor="business-idea">Describe your business and sales goals</label><textarea id="business-idea" rows={4} value={prompt} required minLength={10} maxLength={3000} placeholder="We sell... Our customers usually ask... We want to..." onChange={e => updatePrompt(e.target.value)}/><div className="ls-composer-bottom"><span><Sparkles size={16}/>Your facts. Your voice. Your rules.</span><button className="ls-button" type="submit">Build my agent<ArrowUpRight size={19}/></button></div></form><button className="ls-builder-example" onClick={useExample}>Use the {business.name} example<ArrowUpRight size={16}/></button><p className="ls-build-note">Sign in to continue. Review your plan before private testing.</p></div></section>
      <section className="ls-pricing ls-wrap" id="pricing"><div className="ls-section-top"><span>A CLEAR START</span><span>NO AUTOMATIC OVERAGE CHARGES.</span></div><div className="ls-price-layout"><div className="ls-price-title"><span className="ls-kicker">LUMO STARTER / LAUNCH PLAN</span><h2 data-motion="headline">One business.<br/>One sales workspace.</h2><p>Build, review and privately rehearse.<br/>Keep the facts and the next action together.</p><a className="ls-text-link" href="/sample">Explore before you decide<ArrowUpRight size={18}/></a><div className="ls-launch-status"><span className="ls-dot"/>Preview available. Subscriptions open at launch.</div></div><div className="ls-price-details"><div className="ls-price" data-motion="numbers"><span>RM</span><strong>99</strong><span>/ month</span></div><div className="ls-allowances" data-motion="numbers"><div><strong>30</strong><span>Plan generations<br/>or AI revisions / month</span></div><div><strong>500</strong><span>Private test<br/>replies / month</span></div></div><p className="ls-price-note ls-limit-note">US$5 AI budget/month. Usage stops at the first allowance or budget limit reached.</p><ul>{['Approved business knowledge & products','Editable flows, approval & version history','Lead workspace & guided setup'].map(item => <li key={item}><Check size={17}/>{item}</li>)}</ul><button className="ls-button" onClick={begin}>Start with your business<ArrowUpRight size={18}/></button><p className="ls-price-note">At launch: 7-day card-required trial. RM0 today, then RM99/month. Renews automatically until cancelled. Billing date shown at checkout.</p><details className="ls-budget"><summary>Trial allowances & AI budget limits<ChevronDown size={16}/></summary><p>Trial: 3 generations, 50 replies, US$0.50 AI budget total. Paid: US$5 AI budget/month. The first reached allowance or budget limit applies; you may reach the budget before all replies are used. No live WhatsApp, customer checkout or automated follow-ups in this release.</p></details></div></div></section>
      <section className="ls-faq ls-wrap" id="faq"><div><span className="ls-kicker">THE DETAILS, WHEN YOU NEED THEM</span><h2 data-motion="headline">Clear answers.</h2></div><div>{questions.map(([q,a],i) => <div className="ls-faq-item" key={q}><h3><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} aria-controls={`ls-answer-${i}`}><span>{q}</span><Plus size={19} className={faq === i ? 'expanded' : ''}/></button></h3><p id={`ls-answer-${i}`} hidden={faq !== i}>{a}</p></div>)}</div></section>
      <section className="ls-close" data-motion="finale"><div className="ls-wrap"><span className="ls-kicker">THE NEXT CONVERSATION STARTS HERE</span><h2>Less “just checking”.<br/>More buying intent.</h2><button className="ls-button" onClick={begin}>Build your Lumo agent<ArrowUpRight size={20}/></button><a href="#playground">Or try a conversation<ArrowRight size={17}/></a></div><div className="ls-big-brand" data-motion="wordmark" aria-hidden="true">Lumo</div></section>
    </main><footer className="ls-footer ls-wrap"><Brand/><span>Built around how Malaysia chats.</span><nav aria-label="Footer navigation"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="#hero" aria-label="Back to top" title="Back to top"><ArrowDown size={18} className="ls-up"/></a></nav><small>&copy; {new Date().getFullYear()} Lumo</small></footer>
  </div>;
}
