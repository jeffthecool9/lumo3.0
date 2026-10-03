import React, {useEffect, useRef, useState} from 'react';
import {ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCheck, ChevronDown, Globe2, LockKeyhole, Menu, MessageSquare, Moon, Pause, Play, Plus, RotateCcw, Send, ShieldCheck, Sparkles, Sun, Target, Users, X} from 'lucide-react';
import {Brand, BrandMark} from './Brand';
import {readDraft, saveDraft} from './api';
import {businesses, demoReply} from './landing-data';
import './story-landing.css';

const chapters = [
  {title: 'Your facts.\nNot a guess.', text: 'Approved products, RM prices and policies. Give every answer a reliable starting point.', label: 'Ground the answer', icon: BookOpen},
  {title: 'One chat.\nAll their languages.', text: 'English, BM, 中文. Understand the buyer, even when they switch halfway through.', label: 'Understand the buyer', icon: Globe2},
  {title: 'More than a reply.\nA next step.', text: 'Capture the need, budget and timing. Give your team the context to move the sale forward.', label: 'Move the sale forward', icon: Target},
];
const questions = [
  ['What can I use today?', 'Build and review a sales conversation plan, manage business knowledge and products, and rehearse privately in the workspace. The public conversation below is a preset demo. Live WhatsApp replies, website embeds, customer checkout and automatic follow-ups are not available yet.'],
  ['Is this only for appointments?', 'No. Lumo is designed for lead generation and sales conversations across products and services. A quote, purchase link, human follow-up or appointment can be the next step. Your team confirms prices, stock and availability whenever these are not in approved records.'],
  ['How does the trial and monthly plan work?', 'Subscriptions open at launch. An eligible business can start a seven-day card-required trial: RM0 today, then RM99/month unless renewal is cancelled before expiry. Checkout will show the exact first payment date. Cancel in Usage & Billing; access continues until the trial or paid period ends. Saved work remains available afterwards. Checkout is not active in this preview.'],
  ['Are there AI usage limits?', 'Yes. The trial includes up to 3 generations, 50 test replies and a US$0.50 AI budget total. Each paid month includes up to 30 generations, 500 test replies and a US$5 AI budget. The first limit reached applies, so longer conversations can use the budget before the reply allowance. No automatic overage charges.'],
  ['Does Lumo guarantee accurate answers or sales?', 'No AI can guarantee either. Lumo is designed to use your approved business facts, ask for clarification and hand off uncertain answers. Review and approve your flow, then test it before use. The public demo uses preset replies; live multilingual quality and integrations need verification before launch.'],
];

function goTo(id: string, focus = false) {
  document.getElementById(id)?.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
  if (focus) document.getElementById('business-idea')?.focus({preventScroll: true});
}

function Conversation({compact = false}: {compact?: boolean}) {
  return <div className={`ls-conversation ${compact ? 'compact' : ''}`}>
    <div className="ls-message visitor">Hi, tote ni berapa? 有黑色吗？</div>
    <div className="ls-message agent"><BrandMark/><p>RM129 for the canvas tote. Let me check black with our team. Nak pakai sendiri or as a gift?</p></div>
    <div className="ls-message visitor">Gift. Budget below RM150, need by Friday.</div>
    <div className="ls-message agent"><BrandMark/><p>Boleh. May I take your contact so our team can confirm the colour and delivery timing?</p></div>
  </div>;
}

function LeadSummary() {
  return <div className="ls-lead-summary"><div className="ls-lead-person"><span><Users size={25}/></span><div><h3>A buyer. Not just a message.</h3><p>Illustrative enquiry / Everyday Studio</p></div></div>
    <dl>{[['Looking for', 'Canvas tote, black'], ['Budget', 'Below RM150'], ['Purchase timing', 'By Friday'], ['Next step', 'Confirm colour & delivery']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="ls-handoff"><ShieldCheck size={18}/><span>Stock and delivery need team confirmation.</span></div>
  </div>;
}

function Scene({stage}: {stage: number}) {
  return <div className="ls-scene" key={stage}>
    <div className="ls-tool-bar"><BrandMark/><span>Everyday Studio</span><span className="ls-tool-status"><LockKeyhole size={13}/>Sample workspace</span></div>
    {stage === 0 ? <div className="ls-facts"><div className="ls-product-photo"><img src={businesses[2].image} alt={businesses[2].alt} loading="lazy"/><span><BookOpen size={17}/>Business knowledge</span></div><h3>The source behind the answer.</h3><div className="ls-fact-row"><span>Canvas tote</span><strong>RM129</strong><Check size={17}/></div><div className="ls-fact-row"><span>Stock & delivery</span><strong>Ask the team</strong><ShieldCheck size={17}/></div><div className="ls-fact-row"><span>Unlisted discounts</span><strong>Never invent</strong><Check size={17}/></div><p className="ls-source-note"><CheckCheck size={17}/>Approved facts before fluent replies.</p></div> : stage === 1 ? <><div className="ls-language-strip"><span>EN</span><ArrowRight size={14}/><span>BM</span><ArrowRight size={14}/><span>中文</span><strong>Same conversation.</strong></div><Conversation/></> : <LeadSummary/>}
    <div className="ls-tool-bottom">Illustrative product story. No customer messages are sent.</div>
  </div>;
}

function HeroFilm() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {setReduced(media.matches); setPlaying(!media.matches);};
    change(); media.addEventListener('change', change);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold: .2});
    if (host.current) observer.observe(host.current);
    return () => {media.removeEventListener('change', change); observer.disconnect();};
  }, []);
  useEffect(() => {
    if (!playing || !visible || reduced) return;
    const timer = setInterval(() => setFrame(n => (n + 1) % 3), 4200);
    return () => clearInterval(timer);
  }, [playing, visible, reduced]);
  return <div className="ls-film" ref={host} aria-label="Three-part sample sales conversation">
    <div className="ls-film-heading"><span><span className="ls-dot"/>A LITTLE ENQUIRY. A BIGGER OPPORTUNITY.</span><div>{['Enquiry', 'Conversation', 'Next step'].map((label, i) => <button key={label} aria-pressed={frame === i} onClick={() => {setFrame(i); setPlaying(false);}}><span>0{i + 1}</span>{label}</button>)}<button className="ls-icon" onClick={() => {if (reduced) setFrame(n => (n + 1) % 3); else setPlaying(p => !p);}} aria-label={reduced ? 'Next sample scene' : playing ? 'Pause sample story' : 'Play sample story'} title={reduced ? 'Next sample scene' : playing ? 'Pause story' : 'Play story'}>{reduced ? <ArrowRight size={16}/> : playing ? <Pause size={16}/> : <Play size={16}/>}</button></div></div>
    <div className="ls-film-stage" key={frame}>
      <div className="ls-film-caption"><span className="ls-kicker">{['THE FIRST MESSAGE', 'THE RIGHT QUESTION', 'THE USEFUL HANDOFF'][frame]}</span><h2>{['“Berapa? 有黑色吗？”', 'Understand before\nyou recommend.', 'Your team picks up.\nNot from scratch.'][frame]}</h2><p>{['A price question can be the start of a sale.', 'One need. One budget. One buying timeline.', 'The details that help a person close.'][frame]}</p></div>
      <div className="ls-film-proof">{frame === 0 ? <div className="ls-first-enquiry"><img src={businesses[2].image} alt="A retail business receiving a product enquiry"/><div><span>PRODUCT ENQUIRY</span><p>Hi, tote ni berapa?<br/>有黑色吗？</p><small>English + BM + 中文</small></div><MessageSquare size={27}/></div> : frame === 1 ? <Conversation compact/> : <LeadSummary/>}</div>
    </div>
    <div className="ls-film-footer"><span>Preset example, not live automation.</span><a href="#playground">Try the conversation<ArrowUpRight size={16}/></a></div>
  </div>;
}

function DemoChat() {
  const [businessIndex, setBusinessIndex] = useState(2);
  const [messages, setMessages] = useState<{role: 'user' | 'bot'; text: string}[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const business = businesses[businessIndex];
  const exhausted = messages.length >= 16;
  useEffect(() => () => {if (timer.current) clearTimeout(timer.current);}, []);
  useEffect(() => {if (log.current) log.current.scrollTop = log.current.scrollHeight;}, [messages, typing]);
  function reset(index = businessIndex) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null; setBusinessIndex(index); setMessages([]); setInput(''); setTyping(false);
  }
  function send(text = input) {
    const value = text.trim().slice(0, 500);
    if (!value || typing || exhausted) return;
    const previous = messages.filter(m => m.role === 'user').at(-1)?.text;
    setMessages(m => [...m, {role: 'user', text: value}]); setInput(''); setTyping(true);
    timer.current = setTimeout(() => {
      setMessages(m => [...m, {role: 'bot', text: demoReply(business.id, value, previous)}]); setTyping(false); timer.current = null;
    }, 600);
  }
  return <section className="ls-demo ls-wrap" id="playground">
    <div className="ls-demo-intro" data-reveal><span className="ls-kicker">BUILT AROUND HOW MALAYSIA CHATS</span><h2>“Can ah?”<br/>“Boleh.”<br/><span>“可以。”</span></h2><p>Your customers mix languages.<br/>Your sales conversation should keep up.</p><div className="ls-demo-tabs" role="group" aria-label="Choose sample business">{businesses.map((b, i) => <button aria-pressed={businessIndex === i} key={b.id} onClick={() => reset(i)}><b.icon size={18}/>{b.label}<ArrowUpRight size={16}/></button>)}</div><span className="ls-muted ls-demo-small"><LockKeyhole size={14}/>No account. No card. Preset replies.</span></div>
    <div className="ls-demo-window" data-reveal><div className="ls-demo-window-head"><BrandMark/><div><strong>{business.name}</strong><span>Lumo sample sales agent</span></div><button className="ls-icon" title="Restart sample conversation" aria-label="Restart sample conversation" onClick={() => reset()}><RotateCcw size={18}/></button></div>
      <div ref={log} className="ls-demo-log" role="log" aria-label="Sample conversation" aria-live="polite"><span className="ls-chat-date">TRY A BUYING QUESTION</span><div className="ls-message agent"><BrandMark/><p>{business.greeting}</p></div>{messages.map((m, i) => <div className={`ls-message ${m.role === 'user' ? 'visitor' : 'agent'}`} key={i}>{m.role === 'bot' && <BrandMark/>}<p>{m.text}</p></div>)}{typing && <div className="ls-message agent"><BrandMark/><p className="ls-typing" aria-label="Preparing preset reply"><span/><span/><span/></p></div>}</div>
      <div className="ls-suggestions">{business.questions.map(q => <button key={q} disabled={typing || exhausted} onClick={() => send(q)}>{q}<ArrowUpRight size={13}/></button>)}</div>
      <form className="ls-chat-input" onSubmit={e => {e.preventDefault(); send();}}><input aria-label="Message the sample chatbot" placeholder={exhausted ? 'Restart to try another conversation' : 'Ask in English, BM or 中文...'} value={input} maxLength={500} disabled={typing || exhausted} onChange={e => setInput(e.target.value)}/><button className="ls-icon" type="submit" disabled={!input.trim() || typing || exhausted} aria-label="Send sample message" title="Send sample message"><Send size={18}/></button></form><p className="ls-demo-disclosure">Preset demo. No real leads, orders or messages are sent.</p>
    </div>
  </section>;
}

export function StoryLanding({onStart, onLogin, signedIn, theme, onTheme}: {onStart: () => void; onLogin: () => void; signedIn: boolean; theme: 'dark' | 'light'; onTheme: () => void}) {
  const [prompt, setPrompt] = useState(readDraft);
  const [menu, setMenu] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [businessIndex, setBusinessIndex] = useState(2);
  const [faq, setFaq] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const business = businesses[businessIndex];
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('is-visible'); reveal.unobserve(entry.target);}}), {threshold: .08});
    page.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));
    const story = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) setChapter(Number((entry.target as HTMLElement).dataset.chapter));}), {rootMargin: '-35% 0px -40% 0px', threshold: 0});
    page.querySelectorAll('[data-chapter]').forEach(el => story.observe(el));
    let frame = 0;
    const update = () => {if (frame) return; frame = requestAnimationFrame(() => {const max = document.documentElement.scrollHeight - innerHeight; if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`; frame = 0;});};
    window.addEventListener('scroll', update, {passive: true}); window.addEventListener('resize', update); update();
    return () => {reveal.disconnect(); story.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); cancelAnimationFrame(frame);};
  }, []);
  useEffect(() => {const escape = (event: KeyboardEvent) => {if (event.key === 'Escape') setMenu(false);}; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape);}, []);
  function updatePrompt(value: string) {setPrompt(value); saveDraft(value);}
  function useExample(index: number) {updatePrompt(businesses[index].prompt); goTo('builder', true);}
  const begin = () => goTo('builder', true);
  return <div className="lumo-story" ref={root}>
    <a className="ls-skip" href="#business-idea">Skip to builder</a><div className="ls-progress" ref={progress}/>
    <header className="ls-header"><div className="ls-header-inner"><Brand/><nav aria-label="Main navigation"><a href="#how-it-works">The Lumo difference</a><a href="#playground">Try Lumo</a><a href="#pricing">Pricing</a></nav><div className="ls-header-actions"><button className="ls-icon" onClick={onTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon size={19}/> : <Sun size={19}/>}</button><button className="ls-login" onClick={onLogin}>{signedIn ? 'Workspace' : 'Log in'}</button><button className="ls-button ls-nav-cta" onClick={begin}>Build your agent<ArrowUpRight size={17}/></button><button className="ls-icon ls-menu" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="ls-mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <X size={22}/> : <Menu size={22}/>}</button></div></div>{menu && <nav id="ls-mobile-nav" className="ls-mobile-nav" aria-label="Mobile navigation">{[['The Lumo difference', '#how-it-works'], ['Try Lumo', '#playground'], ['Pricing', '#pricing']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight size={18}/></a>)}<button onClick={() => {setMenu(false); begin();}}>Build your agent<ArrowUpRight size={18}/></button></nav>}</header>
    <main>
      <section className="ls-hero" id="hero"><span className="ls-kicker"><span className="ls-dot"/>MADE FOR MALAYSIAN BUSINESSES</span><h1>Lumo. Your AI<br/><span>sales agent.</span></h1><p className="ls-hero-sub">Turn enquiries into sales opportunities.<br/>English, BM, 中文. Even in the same chat.</p>
        <form className="ls-composer" id="builder" onSubmit={e => {e.preventDefault(); saveDraft(prompt); onStart();}}><label className="ls-sr" htmlFor="business-idea">Describe your business and sales goals</label><textarea id="business-idea" rows={2} value={prompt} required minLength={10} maxLength={3000} placeholder="Tell Lumo what you sell and how you want to win customers..." onChange={e => updatePrompt(e.target.value)}/><div className="ls-composer-bottom"><span><Sparkles size={16}/>Your facts. Your voice. Your rules.</span><button className="ls-button" type="submit">Build my agent<ArrowUpRight size={19}/></button></div></form>
        <div className="ls-hero-links"><span><Check size={15}/>No code needed</span><a href="#playground">Try a sample first<ArrowUpRight size={15}/></a></div>
      </section>
      <section className="ls-film-band"><div className="ls-wrap"><HeroFilm/></div></section>
      <section className="ls-difference" id="how-it-works"><div className="ls-wrap"><div className="ls-section-top"><span>THE LUMO DIFFERENCE</span><span>LESS COPY-PASTE. MORE CONTEXT.</span></div><div className="ls-story-layout"><div className="ls-chapters">{chapters.map((item, i) => <article id={`chapter-${i}`} data-chapter={i} key={item.label} className={chapter === i ? 'active' : ''}><span className="ls-chapter-number">0{i + 1}<item.icon size={22}/></span><h2>{item.title}</h2><p>{item.text}</p><a className="ls-text-link" href="/sample">See the workspace<ArrowUpRight size={18}/></a><div className="ls-mobile-scene"><Scene stage={i}/></div></article>)}</div><div className="ls-sticky-scene"><Scene stage={chapter}/><div className="ls-chapter-nav" aria-label="Product story chapters">{chapters.map((c, i) => <button key={c.label} aria-current={chapter === i ? 'step' : undefined} onClick={() => goTo(`chapter-${i}`)}><span>0{i + 1}</span>{c.label}</button>)}</div></div></div></div></section>
      <DemoChat/>
      <section className="ls-business-band" id="use-cases"><div className="ls-wrap"><div className="ls-section-top"><span>SELL PRODUCTS. SELL SERVICES.</span><span>APPOINTMENTS ARE JUST ONE NEXT STEP.</span></div><div className="ls-business-heading" data-reveal><h2>Your business.<br/>Your way to sell.</h2><div role="group" aria-label="Business examples" className="ls-business-selector">{businesses.map((b, i) => <button aria-pressed={businessIndex === i} key={b.id} onClick={() => setBusinessIndex(i)}><b.icon size={20}/>{b.label}<ArrowUpRight size={18}/></button>)}</div></div><div className="ls-business-feature" key={business.id}><div className="ls-business-media"><img src={business.image} alt={business.alt} loading="lazy"/><span><business.icon size={18}/>{business.name} / Sample business</span></div><div className="ls-business-copy"><span className="ls-kicker">{business.category}</span><h3>{business.headline}</h3><p>{business.description}</p><button className="ls-text-link" onClick={() => useExample(businessIndex)}>Use this starting point<ArrowUpRight size={18}/></button></div></div></div></section>
      <section className="ls-pricing ls-wrap" id="pricing"><div className="ls-section-top"><span>A CLEAR START</span><span>NO AUTOMATIC OVERAGE CHARGES.</span></div><div className="ls-price-layout"><div className="ls-price-title" data-reveal><span className="ls-kicker">LUMO STARTER / LAUNCH PLAN</span><h2>One business.<br/>One sales workspace.</h2><p>Build, review and privately rehearse.<br/>Keep the facts and the next action together.</p><a className="ls-text-link" href="/sample">Explore before you decide<ArrowUpRight size={18}/></a><div className="ls-launch-status"><span className="ls-dot"/>Preview available. Subscriptions open at launch.</div></div><div className="ls-price-details" data-reveal><div className="ls-price"><span>RM</span><strong>99</strong><span>/ month</span></div><div className="ls-allowances"><div><strong>30</strong><span>Plan generations<br/>or AI revisions / month</span></div><div><strong>500</strong><span>Private test<br/>replies / month</span></div></div><p className="ls-price-note ls-limit-note">US$5 AI budget/month. Usage stops at the first allowance or budget limit reached.</p><ul>{['Approved business knowledge & products', 'Editable flows, approval & version history', 'Lead workspace & guided setup'].map(item => <li key={item}><Check size={17}/>{item}</li>)}</ul><button className="ls-button" onClick={begin}>Start with your business<ArrowUpRight size={18}/></button><p className="ls-price-note">At launch: 7-day card-required trial. RM0 today, then RM99/month. Renews automatically until cancelled. Billing date shown at checkout.</p><details className="ls-budget"><summary>Trial allowances & AI budget limits<ChevronDown size={16}/></summary><p>Trial: 3 generations, 50 replies, US$0.50 AI budget total. Paid: US$5 AI budget/month. The first reached allowance or budget limit applies; you may reach the budget before all replies are used. No live WhatsApp, customer checkout or automated follow-ups in this release.</p></details></div></div></section>
      <section className="ls-faq ls-wrap" id="faq"><div><span className="ls-kicker">THE DETAILS, WHEN YOU NEED THEM</span><h2>Clear answers.</h2></div><div>{questions.map(([q, a], i) => <div className="ls-faq-item" key={q}><h3><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} aria-controls={`ls-answer-${i}`}><span>{q}</span><Plus size={19} className={faq === i ? 'expanded' : ''}/></button></h3><p id={`ls-answer-${i}`} hidden={faq !== i}>{a}</p></div>)}</div></section>
      <section className="ls-close"><div className="ls-wrap"><span className="ls-kicker">THE NEXT CONVERSATION STARTS HERE</span><h2>Less “just checking”.<br/>More buying intent.</h2><button className="ls-button" onClick={begin}>Build your Lumo agent<ArrowUpRight size={20}/></button><a href="#playground">Or try a conversation<ArrowRight size={17}/></a></div><div className="ls-big-brand" aria-hidden="true">Lumo</div></section>
    </main><footer className="ls-footer ls-wrap"><Brand/><span>Built around how Malaysia chats.</span><nav aria-label="Footer navigation"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="#hero" aria-label="Back to top" title="Back to top"><ArrowDown size={18} className="ls-up"/></a></nav><small>&copy; {new Date().getFullYear()} Lumo</small></footer>
  </div>;
}
