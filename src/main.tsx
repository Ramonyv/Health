import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AnimatePresence,motion,MotionConfig,useReducedMotion,useMotionValue,useSpring} from 'motion/react';
import {ChevronDown,ChevronLeft,ChevronRight,Plus,X,Info,Wind,Activity,MapPin} from 'lucide-react';
import {organs,type Organ} from './organs';
import {answersFor,matchAnswer,searchUrl,type Answer} from './medicalKnowledge';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import './style.css';
const views = ['Front','Back','Side'];
// Hotspot positions are percentages of the supplied 476 × 927 anatomy artwork.
const organPositions: Record<string, [number, number][]> = {
  Brain:[[50,12],[50,12],[56,12]], Heart:[[45,30],[56,30],[55,30]],
  Lungs:[[45,20],[50,25],[54,23]], Kidney:[[46,43],[48,43],[53,43]],
  Intestines:[[50,49],[50,49],[55,49]], Stomach:[[44,39],[51,40],[55,39]],
  Liver:[[57,37],[55,38],[57,37]], Skin:[[63,49],[63,49],[63,49]],
  Spine:[[50,42],[50,41],[55,42]], Bladder:[[50,57],[50,57],[54,57]],
  Knee:[[45,73],[47,73],[56,73]], Head:[[50,12],[50,12],[56,12]],
  Eye:[[53,9],[50,9],[62,9]], Ear:[[60,11],[59,11],[60,11]],
  Throat:[[50,21],[50,21],[57,21]], Tooth:[[50,14],[50,14],[62,14]],
  Shoulder:[[65,25],[64,25],[59,25]],
};
function Header(){
  const [profile,setProfile]=useState(false);
  const [navOpen,setNavOpen]=useState(false);
  const reduceMotion=useReducedMotion();
  const [menuScale,setMenuScale]=useState(.78);
  useEffect(()=>{const update=()=>setMenuScale(Math.min(.78,Math.max(.46,(window.innerHeight-94)/680)));update();window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)},[]);
  const [notice,setNotice]=useState('');
  const menuRef=useRef<HTMLDivElement>(null);
  const navRef=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(!profile&&!navOpen)return;
    const onPointer=(event:PointerEvent)=>{if(profile&&!menuRef.current?.contains(event.target as Node))setProfile(false);if(navOpen&&!navRef.current?.contains(event.target as Node))setNavOpen(false)};
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){setProfile(false);setNavOpen(false)}};
    document.addEventListener('pointerdown',onPointer);
    document.addEventListener('keydown',onKey);
    return()=>{document.removeEventListener('pointerdown',onPointer);document.removeEventListener('keydown',onKey)};
  },[profile,navOpen]);
  const demoAction=(label:string)=>setNotice(`${label} is shown for this portfolio demo.`);
  return <header><img className="logo" src="/assets/Logo2.svg" alt="HealthTrack"/><motion.nav className={'main-nav'+(navOpen?' is-expanded':'')} aria-label="Main navigation" ref={navRef} initial={false} animate={{width:navOpen?(window.innerWidth>=1500?560:window.innerWidth<=640?Math.min(window.innerWidth-24,360):window.innerWidth<=1000?400:540):window.innerWidth<=640?54:72}} transition={reduceMotion?{duration:0}:{type:'spring',stiffness:340,damping:31,mass:.8}}><AnimatePresence>{navOpen&&<motion.div className="nav-items" initial={reduceMotion?false:{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:12}} transition={{duration:reduceMotion?0:.22,delay:reduceMotion?0:.08}}><button className="nav-current" aria-current="page" onClick={()=>setNavOpen(false)}>Explore</button>{['Medicines','Conditions','Health Tips'].map(x=><span className="nav-label" key={x} title="Outside this portfolio demo">{x}</span>)}</motion.div>}</AnimatePresence><button className="nav-menu-button" aria-label={navOpen?'Close navigation menu':'Open navigation menu'} aria-expanded={navOpen} onClick={()=>setNavOpen(!navOpen)}><span className="nav-lines" aria-hidden="true"><i/><i/></span></button></motion.nav><div className="profile-wrap" ref={menuRef}><button className="profile" aria-label="Open profile menu" aria-expanded={profile} aria-controls="profile-menu" onClick={()=>{setProfile(!profile);setNotice('')}}><img src="/assets/avatar.png" alt=""/><motion.span className="profile-chevron" animate={{rotate:profile?180:0}} transition={{type:"spring",stiffness:360,damping:24}}><ChevronDown size={15}/></motion.span></button><AnimatePresence>{profile&&<motion.div className="profile-menu" initial={reduceMotion?{opacity:0,scale:menuScale}:{opacity:0,scale:menuScale*.8,y:-12,filter:"blur(8px)"}} animate={{opacity:1,scale:menuScale,y:0,filter:"blur(0px)"}} exit={reduceMotion?{opacity:0,scale:menuScale}:{opacity:0,scale:menuScale*.9,y:-10,filter:"blur(5px)"}} transition={{scale:{type:"spring",stiffness:390,damping:25,mass:.7},y:{type:"spring",stiffness:390,damping:25,mass:.7},opacity:{duration:.18},filter:{duration:.2}}} id="profile-menu" role="menu" aria-label="Profile menu"><div className="profile-cover"><img className="profile-orbit outer" src="/assets/profile-menu/ellipse-outer.svg" alt=""/><img className="profile-orbit inner" src="/assets/profile-menu/ellipse-inner.svg" alt=""/><motion.img className="profile-portrait" src="/assets/profile-menu/portrait.png" alt="Raman Designs" initial={reduceMotion?false:{opacity:0,scale:.9,y:12}} animate={{opacity:1,scale:1,y:0}} transition={{type:"spring",stiffness:290,damping:26,delay:.08}}/></div><div className="profile-identity"><strong>ramandesigns9</strong><span>ramandesigns9@gmail.com</span></div><div className="profile-credits"><div><strong>Credits</strong><span>30.0 left</span></div><button onClick={()=>demoAction('Upgrade')}>Upgrade</button></div><div className="profile-actions"><button onClick={()=>demoAction('Settings')}><img src="/assets/profile-menu/settings.svg" alt=""/>Settings</button><div className="profile-divider"/><button onClick={()=>demoAction('View profile')}><img src="/assets/profile-menu/profile.svg" alt=""/>View profile</button><button onClick={()=>demoAction('Theme')}><img src="/assets/profile-menu/theme.svg" alt=""/>Theme <span>System <img src="/assets/profile-menu/chevron.svg" alt=""/></span></button><button onClick={()=>demoAction('Help & documentation')}><img src="/assets/profile-menu/help.svg" alt=""/>Help &amp; documentation <img className="trailing" src="/assets/profile-menu/external.svg" alt=""/></button><button onClick={()=>demoAction('Download iOS app')}><img src="/assets/profile-menu/ios.svg" alt=""/>Download iOS app <img className="trailing" src="/assets/profile-menu/external.svg" alt=""/></button><button onClick={()=>demoAction('Log out')}><img src="/assets/profile-menu/logout.svg" alt=""/>Log out</button></div><div className="profile-footer"><span>Terms</span><span>Privacy</span><div className="profile-social"><img src="/assets/profile-menu/discord.svg" alt="Discord"/><img src="/assets/profile-menu/x-mark.svg" alt="X"/><img src="/assets/profile-menu/youtube.svg" alt="YouTube"/></div></div>{notice&&<div className="profile-demo-notice" role="status">{notice}</div>}</motion.div>}</AnimatePresence></div></header>
}
function OrganCarousel({selected,open,onSelect}:{selected:Organ;open:boolean;onSelect:(o:Organ)=>void}){const ref=useRef<HTMLDivElement>(null);const drag=useRef({x:0,scroll:0,active:false,moved:false});
useEffect(()=>{const el=ref.current!;const wheel=(e:WheelEvent)=>{e.preventDefault();el.scrollLeft+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?16:1)};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel)},[]);
useEffect(()=>{const el=ref.current;if(!el)return;const center=(behavior:ScrollBehavior)=>{const card=el.querySelector<HTMLButtonElement>('.organ-card.selected');if(card)el.scrollTo({left:card.offsetLeft-(el.clientWidth-card.clientWidth)/2,behavior})};center(matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth');const timer=setTimeout(()=>center('smooth'),360);return()=>clearTimeout(timer)},[selected,open]);
const move=(n:number)=>ref.current?.scrollBy({left:n*125,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
return <div className="carousel"><button className="arrow previous" aria-label="Previous organs" onClick={()=>move(-1)}><ChevronLeft size={16}/></button><div className="organ-track" ref={ref} onPointerDown={e=>{if(e.pointerType!=='mouse')return;drag.current={x:e.clientX,scroll:ref.current!.scrollLeft,active:true,moved:false}}} onPointerMove={e=>{const d=drag.current;if(!d.active)return;if(Math.abs(e.clientX-d.x)>5){d.moved=true;e.currentTarget.setPointerCapture(e.pointerId);ref.current!.scrollLeft=d.scroll-(e.clientX-d.x)}}} onPointerUp={()=>{drag.current.active=false}} onPointerCancel={()=>{drag.current.active=false}} onClickCapture={e=>{if(drag.current.moved){e.preventDefault();e.stopPropagation();drag.current.moved=false}}} aria-label="Explore 17 body parts">{organs.map(o=><button className={'organ-card '+(o===selected?'selected':'')} key={o.name} aria-label={`Explore ${o.name}`} aria-pressed={o===selected} onClick={()=>onSelect(o)}><img draggable={false} src={o.image} alt=""/><span>{o.name}</span></button>)}</div><button className="arrow next" aria-label="Next organs" onClick={()=>move(1)}><ChevronRight size={16}/></button></div>}
type HoverArea={name:string;x:number;y:number};
const hoverAreas: HoverArea[][] = [
  [
    {name:'Head',x:50,y:9},{name:'Throat',x:50,y:16},{name:'Shoulder',x:66,y:21},
    {name:'Shoulder',x:34,y:21},{name:'Lungs',x:43,y:26},{name:'Lungs',x:58,y:26},
    {name:'Heart',x:52,y:28},{name:'Liver',x:43,y:32},{name:'Stomach',x:56,y:35},
    {name:'Intestines',x:51,y:42},{name:'Bladder',x:50,y:49},
    {name:'Arm',x:21,y:36},{name:'Arm',x:79,y:36},{name:'Hip',x:50,y:55},
    {name:'Knee',x:40,y:67},{name:'Knee',x:60,y:67},
    {name:'Leg',x:40,y:82},{name:'Leg',x:60,y:82}
  ],
  [
    {name:'Head',x:50,y:9},{name:'Neck',x:50,y:16},{name:'Shoulder',x:35,y:21},
    {name:'Shoulder',x:65,y:21},{name:'Upper back',x:48,y:26},{name:'Spine',x:50,y:35},
    {name:'Kidney',x:43,y:39},{name:'Kidney',x:57,y:39},
    {name:'Arm',x:21,y:36},{name:'Arm',x:79,y:36},{name:'Hip',x:50,y:48},
    {name:'Knee',x:40,y:66},{name:'Knee',x:60,y:66},
    {name:'Leg',x:40,y:82},{name:'Leg',x:60,y:82}
  ],
  [
    {name:'Head',x:53,y:9},{name:'Throat',x:57,y:16},{name:'Shoulder',x:48,y:21},
    {name:'Lungs',x:57,y:26},{name:'Stomach',x:57,y:35},{name:'Intestines',x:57,y:43},
    {name:'Hip',x:50,y:53},{name:'Knee',x:53,y:66},{name:'Leg',x:53,y:82}
  ]
];
function AnatomyHero({selected,open,onSelect}:{selected:Organ;open:boolean;onSelect:(o:Organ)=>void}){
  const [view,setView]=useState(0);
  const reduceMotion=useReducedMotion();
  const [hovered,setHovered]=useState<HoverArea|null>(null);
  const compositionRef=useRef<HTMLDivElement>(null);
  const alphaMasks=useRef<Record<number,{pixels:Uint8ClampedArray;width:number;height:number}>>({});
  const pointerX=useMotionValue(0),pointerY=useMotionValue(0);
  const tooltipX=useSpring(pointerX,{stiffness:360,damping:32});
  const tooltipY=useSpring(pointerY,{stiffness:360,damping:32});
  useEffect(()=>{
    views.forEach((v,i)=>{
      const img=new Image();
      img.src=`/assets/Anatomy/${v} View.png`;
      img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;const context=canvas.getContext('2d');if(!context)return;context.drawImage(img,0,0);alphaMasks.current[i]={pixels:context.getImageData(0,0,canvas.width,canvas.height).data,width:canvas.width,height:canvas.height}}
    });
  },[]);
  useEffect(()=>setHovered(null),[view]);
  const selectOrgan=(organ:Organ)=>{if(organ.name==='Spine')setView(1);onSelect(organ)};
  const [left,top]=(open?organPositions[selected.name]:organPositions.Shoulder)[view];
  const showArea=(event:React.PointerEvent<HTMLDivElement>)=>{
    if(event.pointerType!=='mouse'&&event.pointerType!=='pen')return;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
    const mask=alphaMasks.current[view];
    if(!mask||x<0||x>=1||y<0||y>=1){setHovered(null);return}
    const px=Math.min(mask.width-1,Math.floor(x*mask.width)),py=Math.min(mask.height-1,Math.floor(y*mask.height));
    if(mask.pixels[(py*mask.width+px)*4+3]<30){setHovered(null);return}
    const area=hoverAreas[view].reduce((best,item)=>{
      const distance=(item.x-x*100)**2*1.4+(item.y-y*100)**2;
      return distance<best.distance?{area:item,distance}:best
    },{area:hoverAreas[view][0],distance:Infinity}).area;
    const comp=compositionRef.current?.getBoundingClientRect();
    if(!comp)return;
    const posX=event.clientX-comp.left,posY=event.clientY-comp.top;
    const targetX=Math.max(8,Math.min(posX+(posX>comp.width*.6?-170:18),comp.width-162));
    const targetY=Math.max(8,Math.min(posY+(posY>comp.height*.72?-158:18),comp.height-150));
    if(!hovered||reduceMotion){tooltipX.jump(targetX);tooltipY.jump(targetY)}else{pointerX.set(targetX);pointerY.set(targetY)}
    setHovered(current=>current?.name===area.name&&current.x===area.x&&current.y===area.y?current:area);
  };
  return <main className="hero"><div className="composition" ref={compositionRef}><h1>Select body<br/>part <span>and</span> tell us<br/>whats <span>wrong</span></h1><div className="orbit"/><div className="anatomy" onPointerMove={showArea} onPointerLeave={()=>setHovered(null)}>{views.map((v,i)=><img key={v} src={`/assets/Anatomy/${v} View.png`} alt={i===view?`${v} view of human anatomy`:''} aria-hidden={i!==view} className={i===view?'visible':''}/>)}<button className={'hotspot'+(open?' expanded':'')} style={{left:`${left}%`,top:`${top}%`}} onClick={()=>selectOrgan(open?selected:organs[16])} aria-label={`Explore ${open?selected.name:'shoulder'}`}>{open&&<img className="hotspot-organ" src={selected.image} alt=""/>}<span className="hotspot-plus"><Plus size={open?25:17} strokeWidth={2.5}/></span></button></div><AnimatePresence>{hovered&&<motion.div className="anatomy-tooltip" aria-hidden="true" style={{left:tooltipX,top:tooltipY}} initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.96}} transition={{duration:.16,ease:'easeOut'}}><div className="anatomy-tooltip-preview"><img src={`/assets/Anatomy/${views[view]} View.png`} alt="" style={{left:`calc(50% - ${hovered.x*2.4}px)`,top:`calc(50% - ${hovered.y*4.67}px)`}}/></div><strong>{hovered.name}</strong></motion.div>}</AnimatePresence><OrganCarousel selected={selected} open={open} onSelect={selectOrgan}/><div className="view-switcher" role="group" aria-label="Anatomy view">{views.map((v,i)=><button key={v} aria-label={`${v} view`} aria-pressed={view===i} title={`${v} view`} onClick={()=>setView(i)}><i/></button>)}</div></div></main>
}
const animatedOrgans: Record<string,string> = {Lungs:'/assets/2x/lungs-breathing.gif',Heart:'/assets/2x/heart-pumping.gif'};
const nearbySpecialists: Record<string,string> = {Brain:'neurologists',Heart:'cardiologists',Lungs:'pulmonologists',Kidney:'nephrologists',Intestines:'gastroenterologists',Stomach:'gastroenterologists',Liver:'gastroenterologists',Skin:'dermatologists',Spine:'orthopedic doctors',Bladder:'urologists',Knee:'orthopedic doctors',Head:'primary care doctors',Eye:'eye doctors',Ear:'ear nose and throat doctors',Throat:'ear nose and throat doctors',Tooth:'dentists',Shoulder:'orthopedic doctors'};
const nearbyUrl = (specialty:string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${specialty} near me`)}`;
type Message={role:'user'|'assistant';text:string;answer?:Answer;link?:string};
function OrganAssistantPanel({organ,onClose}:{organ:Organ;onClose:()=>void}){const reduceMotion=useReducedMotion();const animationSrc=reduceMotion?undefined:animatedOrgans[organ.name];const entries=answersFor(organ.name);const [messages,setMessages]=useState<Message[]>([{role:'assistant',text:entries[0].text,answer:entries[0]}]);const [typing,setTyping]=useState(false);const [input,setInput]=useState('');const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const chat=useRef<HTMLDivElement>(null);const close=useRef<HTMLButtonElement>(null);
useEffect(()=>{close.current?.focus();return()=>{if(timer.current)clearTimeout(timer.current)}},[]);
useEffect(()=>{chat.current?.scrollTo({top:chat.current.scrollHeight,behavior:'smooth'})},[messages,typing]);
const lastAnswered = [...messages].reverse().find(message=>message.answer)?.answer;
const lastIndex = entries.findIndex(entry=>entry.question===lastAnswered?.question);
const next = [...entries.slice(lastIndex+1),...entries.slice(0,lastIndex+1)].find(entry=>!messages.some(message=>message.answer?.question===entry.question));
const send=(text:string,answer?:Answer)=>{if(!text.trim()||typing)return;const question=text.trim();const found=answer??matchAnswer(organ.name,question);const urgent=/\b(severe chest pain|crushing chest|cannot breathe|can't breathe|sudden severe headache|sudden vision loss|stroke|unconscious)\b/i.test(question);setMessages(m=>[...m,{role:'user',text:question}]);setInput('');setTyping(true);timer.current=setTimeout(()=>{setMessages(m=>[...m,found?{role:'assistant',text:(urgent?'Seek urgent medical care now. ':'')+found.text,answer:found}:{role:'assistant',text:(urgent?'Seek urgent medical care now. ':'')+`I don't have a sourced answer for that question. Explore ${organ.name.toLowerCase()} topics on MedlinePlus, or search there for your exact question.`,link:searchUrl(question)}]);setTyping(false)},700)};
return <motion.aside className="assistant" aria-label={`${organ.name} assistant`} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:30}} transition={{duration:.32,ease:'easeOut'}}><div className={"panel-art"+(animationSrc?" animated-organ":"")}><img src={animationSrc??organ.image.replace("/assets/", "/assets/2x/")} alt={animationSrc?`Animated ${organ.name.toLowerCase()}`:organ.name}/><button ref={close} className="close" aria-label="Close assistant" onClick={onClose}><X size={20}/></button></div><div className="panel-content" ref={chat}><h2>Let's understand what<br/>you're experiencing.</h2><div className="symptoms">{organ.symptoms.map((s,i)=><button disabled={typing} key={s} onClick={()=>send(s,entries[i+1])}>{i===2?<Wind size={14}/>:<Activity size={14}/>} {s}</button>)}<button disabled={typing} className="learn" onClick={()=>send(`Learn about the ${organ.name.toLowerCase()}`,entries[0])}><Info size={14}/>Learn about the {organ.name.toLowerCase()}</button></div><div className="messages" aria-live="polite">{messages.map((m,i)=><div key={i} className={'message '+(m.role==='assistant'?'bot':'user')}>{m.role==='assistant'&&<small>MEDLINEPLUS · {organ.name.toUpperCase()}</small>}{m.text}{m.answer&&<><br/><a href={m.answer.url} target="_blank" rel="noopener noreferrer">Source: MedlinePlus, National Library of Medicine · {m.answer.source}</a></>}{m.link&&<><br/><a href={m.link} target="_blank" rel="noopener noreferrer">Search MedlinePlus</a></>}</div>)}{typing&&<div className="typing" aria-label="Assistant is typing"><i/><i/><i/></div>}{next&&!typing&&<button className="followup" onClick={()=>send(next.question,next)}>{next.question}</button>}</div></div><div className="chat-bottom"><a className="nearby-doctors" href={nearbyUrl(nearbySpecialists[organ.name])} target="_blank" rel="noopener noreferrer" aria-label={`Find ${nearbySpecialists[organ.name]} near you in Google Maps`}><span className="nearby-doctors-icon"><MapPin size={17}/></span><span>Find <strong>{nearbySpecialists[organ.name]}</strong> near you</span><ChevronRight size={16} aria-hidden="true"/></a><p>Educational information · For sudden or severe symptoms, seek urgent care</p><form onSubmit={e=>{e.preventDefault();send(input)}}><input aria-label={`Ask about ${organ.name.toLowerCase()}`} placeholder={`Ask anything about your ${organ.name.toLowerCase()}`} value={input} onChange={e=>setInput(e.target.value)} maxLength={500}/><button aria-label="Send message" disabled={typing||!input.trim()}><img src="/assets/ai-assistant.svg" alt=""/></button></form></div></motion.aside>}
function App(){const [selected,setSelected]=useState(organs[2]);const [open,setOpen]=useState(false);const lastFocus=useRef<HTMLElement|null>(null);const select=(o:Organ)=>{lastFocus.current=document.activeElement as HTMLElement;setSelected(o);setOpen(true)};const close=()=>{setOpen(false);lastFocus.current?.focus()};useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[]);return <MotionConfig reducedMotion="user"><div className={'app '+(open?'panel-open':'')}><div className="workspace"><Header/><AnatomyHero selected={selected} open={open} onSelect={select}/></div><AnimatePresence>{open&&<OrganAssistantPanel key={selected.name} organ={selected} onClose={close}/>}</AnimatePresence></div></MotionConfig>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
