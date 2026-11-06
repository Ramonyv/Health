import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AnimatePresence,motion,MotionConfig,useReducedMotion,useMotionValue,useSpring} from 'motion/react';
import {ChevronDown,ChevronLeft,ChevronRight,Plus,X,Info,Wind,Activity,MapPin,ClipboardList,Copy,Check,Globe2} from 'lucide-react';
import {organs,type Organ} from './organs';
import {answersFor,matchAnswer,matchLocalizedAnswer,translatedAnswer,translatedQuestion,searchUrl,type Answer} from './medicalKnowledge';
import {nutritionTopicsFor,type Nutrient} from './nutrition';
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
const portfolioUrl='https://ramanyv.work/';
const languages=[['en','English'],['hi','हिन्दी'],['zh','中文（普通话）'],['es','Español'],['fr','Français']] as const;
const savedLanguage=()=>languages.some(([code])=>code===localStorage.getItem('healthtrack-language'))?localStorage.getItem('healthtrack-language')||'en':'en';
const chatCopy:Record<string,{heading:React.ReactNode;placeholder:string;source:string;urgent:string;fallback:string;search:string}>={en:{heading:<>Let's understand what<br/>you're experiencing.</>,placeholder:'Ask a health question',source:'Source',urgent:'Seek urgent medical care now. ',fallback:'I don’t have a sourced answer for that question. Explore related topics on MedlinePlus, or search there for your exact question.',search:'Search MedlinePlus'},hi:{heading:<>आइए समझें कि आप क्या<br/>महसूस कर रहे हैं।</>,placeholder:'अपना स्वास्थ्य प्रश्न पूछें',source:'स्रोत',urgent:'तुरंत चिकित्सा सहायता लें। ',fallback:'इस प्रश्न का स्रोत-आधारित उत्तर मेरे पास नहीं है। MedlinePlus पर संबंधित विषय देखें या अपना प्रश्न वहाँ खोजें।',search:'MedlinePlus पर खोजें'},zh:{heading:<>一起了解您正在<br/>经历的情况。</>,placeholder:'询问健康问题',source:'来源',urgent:'请立即寻求紧急医疗救助。',fallback:'我没有这个问题的可靠来源答案。请在 MedlinePlus 上查看相关主题或搜索您的问题。',search:'搜索 MedlinePlus'},es:{heading:<>Entendamos lo que<br/>está experimentando.</>,placeholder:'Haga una pregunta de salud',source:'Fuente',urgent:'Busque atención médica urgente ahora. ',fallback:'No tengo una respuesta con fuente para esa pregunta. Consulte temas relacionados o busque su pregunta en MedlinePlus.',search:'Buscar en MedlinePlus'},fr:{heading:<>Comprenons ce que<br/>vous ressentez.</>,placeholder:'Posez une question de santé',source:'Source',urgent:'Consultez en urgence. ',fallback:'Je n’ai pas de réponse sourcée à cette question. Consultez les sujets liés ou recherchez votre question sur MedlinePlus.',search:'Rechercher sur MedlinePlus'}};
function LanguageSwitcher(){
  const [open,setOpen]=useState(false);
  const [selected,setSelected]=useState(savedLanguage);
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{document.documentElement.lang=selected==='zh'?'zh-CN':selected},[selected]);
  useEffect(()=>{if(!open)return;const close=(event:PointerEvent)=>{if(!ref.current?.contains(event.target as Node))setOpen(false)};const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape)}},[open]);
  const choose=(code:string)=>{localStorage.setItem('healthtrack-language',code);setSelected(code);setOpen(false);window.dispatchEvent(new Event('healthtrack-language-change'))};
  return <div className="language-wrap" ref={ref}><button className="language-button" onClick={()=>setOpen(!open)} aria-label="Choose language" aria-expanded={open} aria-controls="language-menu"><Globe2 size={17}/><span>{selected==='en'?'EN':selected.toUpperCase()}</span><ChevronDown size={13}/></button>{open&&<div className="language-menu" id="language-menu" role="menu" aria-label="Languages"><p>Chat language</p>{languages.map(([code,label])=><button role="menuitem" key={code} onClick={()=>choose(code)} aria-current={selected===code?'true':undefined}>{label}{selected===code&&<Check size={14}/>}</button>)}<small>Translations are educational and may contain errors. Check the original MedlinePlus source.</small></div>}</div>
}
function Header(){
  const [profile,setProfile]=useState(false);
  const [navOpen,setNavOpen]=useState(false);
  const reduceMotion=useReducedMotion();
  const [menuScale,setMenuScale]=useState(.78);
  useEffect(()=>{const update=()=>setMenuScale(Math.min(.78,Math.max(.46,(window.innerHeight-94)/680)));update();window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)},[]);
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
  return <header><img className="logo" src="/assets/Logo2.svg" alt="HealthTrack"/><motion.nav className={'main-nav'+(navOpen?' is-expanded':'')} aria-label="Main navigation" ref={navRef} initial={false} animate={{width:navOpen?(window.innerWidth>=1500?560:window.innerWidth<=640?Math.min(window.innerWidth-24,360):window.innerWidth<=1000?400:540):window.innerWidth<=640?54:72}} transition={reduceMotion?{duration:0}:{type:'spring',stiffness:340,damping:31,mass:.8}}><AnimatePresence>{navOpen&&<motion.div className="nav-items" initial={reduceMotion?false:{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:12}} transition={{duration:reduceMotion?0:.22,delay:reduceMotion?0:.08}}><button className="nav-current" aria-current="page" onClick={()=>setNavOpen(false)}>Explore</button>{['Medicines','Conditions','Health Tips'].map(x=><span className="nav-label" key={x} title="Outside this portfolio demo">{x}</span>)}</motion.div>}</AnimatePresence><button className="nav-menu-button" aria-label={navOpen?'Close navigation menu':'Open navigation menu'} aria-expanded={navOpen} onClick={()=>setNavOpen(!navOpen)}><span className="nav-lines" aria-hidden="true"><i/><i/></span></button></motion.nav><LanguageSwitcher/><div className="profile-wrap" ref={menuRef}><button className="profile" aria-label="Open profile menu" aria-expanded={profile} aria-controls="profile-menu" onClick={()=>setProfile(!profile)}><img src="/assets/avatar.png" alt=""/><motion.span className="profile-chevron" animate={{rotate:profile?180:0}} transition={{type:"spring",stiffness:360,damping:24}}><ChevronDown size={15}/></motion.span></button><AnimatePresence>{profile&&<motion.div className="profile-menu" initial={reduceMotion?{opacity:0,scale:menuScale}:{opacity:0,scale:menuScale*.8,y:-12,filter:"blur(8px)"}} animate={{opacity:1,scale:menuScale,y:0,filter:"blur(0px)"}} exit={reduceMotion?{opacity:0,scale:menuScale}:{opacity:0,scale:menuScale*.9,y:-10,filter:"blur(5px)"}} transition={{scale:{type:"spring",stiffness:390,damping:25,mass:.7},y:{type:"spring",stiffness:390,damping:25,mass:.7},opacity:{duration:.18},filter:{duration:.2}}} id="profile-menu" role="menu" aria-label="Profile menu"><a className="profile-cover" href={portfolioUrl} aria-label="Visit Raman Designs portfolio"><img className="profile-orbit outer" src="/assets/profile-menu/ellipse-outer.svg" alt=""/><img className="profile-orbit inner" src="/assets/profile-menu/ellipse-inner.svg" alt=""/><motion.img className="profile-portrait" src="/assets/profile-menu/portrait.png" alt="Raman Designs" initial={reduceMotion?false:{opacity:0,scale:.9,y:12}} animate={{opacity:1,scale:1,y:0}} transition={{type:"spring",stiffness:290,damping:26,delay:.08}}/></a><a className="profile-identity" href={portfolioUrl}><strong>ramandesigns9</strong><span>ramandesigns9@gmail.com</span></a><div className="profile-credits"><div><strong>Credits</strong><span>30.0 left</span></div><a href={portfolioUrl}>Upgrade</a></div><div className="profile-actions"><a href={portfolioUrl}><img src="/assets/profile-menu/settings.svg" alt=""/>Settings</a><div className="profile-divider"/><a href={portfolioUrl}><img src="/assets/profile-menu/profile.svg" alt=""/>View profile</a><a href={portfolioUrl}><img src="/assets/profile-menu/theme.svg" alt=""/>Theme <span>System <img src="/assets/profile-menu/chevron.svg" alt=""/></span></a><a href={portfolioUrl}><img src="/assets/profile-menu/help.svg" alt=""/>Help &amp; documentation <img className="trailing" src="/assets/profile-menu/external.svg" alt=""/></a><a href={portfolioUrl}><img src="/assets/profile-menu/ios.svg" alt=""/>Download iOS app <img className="trailing" src="/assets/profile-menu/external.svg" alt=""/></a><a href={portfolioUrl}><img src="/assets/profile-menu/logout.svg" alt=""/>Log out</a></div><div className="profile-footer"><a href={portfolioUrl}>Terms</a><a href={portfolioUrl}>Privacy</a><div className="profile-social"><a href={portfolioUrl} aria-label="Discord"><img src="/assets/profile-menu/discord.svg" alt=""/></a><a href={portfolioUrl} aria-label="X"><img src="/assets/profile-menu/x-mark.svg" alt=""/></a><a href={portfolioUrl} aria-label="YouTube"><img src="/assets/profile-menu/youtube.svg" alt=""/></a></div></div></motion.div>}</AnimatePresence></div></header>
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
const animatedOrgans: Record<string,string> = {Lungs:'/assets/2x/lungs-breathing.gif',Heart:'/assets/2x/heart-pumping.gif',Eye:'/assets/2x/eye-blink.gif'};
const nearbySpecialists: Record<string,string> = {Brain:'neurologists',Heart:'cardiologists',Lungs:'pulmonologists',Kidney:'nephrologists',Intestines:'gastroenterologists',Stomach:'gastroenterologists',Liver:'gastroenterologists',Skin:'dermatologists',Spine:'orthopedic doctors',Bladder:'urologists',Knee:'orthopedic doctors',Head:'primary care doctors',Eye:'eye doctors',Ear:'ear nose and throat doctors',Throat:'ear nose and throat doctors',Tooth:'dentists',Shoulder:'orthopedic doctors'};
const nearbyUrl = (specialty:string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${specialty} near me`)}`;
function NutrientCard({nutrient}:{nutrient:Nutrient}){return <a className="nutrient-card" href={nutrient.url} target="_blank" rel="noopener noreferrer" style={{'--nutrient-accent':nutrient.color} as React.CSSProperties} aria-label={`Learn about ${nutrient.name} on MedlinePlus`}><span className="nutrient-box" aria-hidden="true"><span className="nutrient-box-face"><strong>{nutrient.name}</strong><small>Nutrition</small><i/></span></span><strong>{nutrient.name}</strong><span>{nutrient.role}</span><small>MedlinePlus ↗</small></a>}
type Message={role:'user'|'assistant';text:string;answer?:Answer;link?:string;urgent?:boolean};
function VisitNote({organ,messages}:{organ:string;messages:Message[]}){
  const [open,setOpen]=useState(false);
  const [note,setNote]=useState('');
  const [copied,setCopied]=useState(false);
  const [copyHint,setCopyHint]=useState('');
  const noteRef=useRef<HTMLTextAreaElement>(null);
  const sectionRef=useRef<HTMLElement>(null);
  useEffect(()=>{if(open)sectionRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'})},[open]);
  const start=()=>{
    const concerns=[...new Set(messages.filter(m=>m.role==='user'&&!m.text.startsWith('Learn about')).map(m=>m.text))];
    const sources=[...new Set(messages.flatMap(m=>m.answer?[m.answer.url]:[]))];
    setNote(`HealthTrack visit note — ${organ}\n\nWhat I want to discuss:\n${concerns.length?concerns.map(item=>`- ${item}`).join('\n'):'- '}\n\nWhen it started and how it has changed:\n\n\nMedicines, vitamins, and supplements I take:\n\n\nQuestions for my clinician:\n- What should I watch for?\n- What information would help you assess this?\n\nMedlinePlus topics I explored:\n${sources.join('\n')}`);
    setCopied(false);
    setCopyHint('');
    setOpen(true);
  };
  const copy=async()=>{try{await navigator.clipboard.writeText(note);setCopied(true);setCopyHint('')}catch{noteRef.current?.select();setCopied(false);setCopyHint('Text selected. Use your device’s Copy command.')}};
  return <section ref={sectionRef} className="visit-note" aria-label="Prepare for a doctor visit"><button className="visit-note-trigger" onClick={()=>open?setOpen(false):start()} aria-expanded={open}><ClipboardList size={15}/><span>{open?'Close visit note':'Prepare a visit note'}</span><ChevronRight size={15} className={open?'turned':''}/></button>{open&&<div className="visit-note-body"><p>Edit this note before sharing it with a health professional. HealthTrack does not save it.</p><textarea ref={noteRef} aria-label="Editable visit note" value={note} onChange={e=>{setNote(e.target.value);setCopied(false);setCopyHint('')}} rows={11}/><div className="visit-note-actions"><a href="https://medlineplus.gov/ency/patientinstructions/000860.htm" target="_blank" rel="noopener noreferrer">Visit preparation tips · MedlinePlus</a><button onClick={copy} disabled={!note.trim()}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copied':'Copy note'}</button></div>{copyHint&&<p role="status" className="visit-note-copy-hint">{copyHint}</p>}</div>}</section>;
}
function OrganAssistantPanel({organ,onClose}:{organ:Organ;onClose:()=>void}){const reduceMotion=useReducedMotion();const animationSrc=reduceMotion?undefined:animatedOrgans[organ.name];const entries=answersFor(organ.name);const [messages,setMessages]=useState<Message[]>([{role:'assistant',text:entries[0].text,answer:entries[0]}]);const [typing,setTyping]=useState(false);const [input,setInput]=useState('');const [showNearby,setShowNearby]=useState(true);const [focusedField,setFocusedField]=useState<'chat'|'note'|null>(null);const [viewport,setViewport]=useState({height:window.innerHeight,bottom:0});const baseHeight=useRef(window.innerHeight);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const chat=useRef<HTMLDivElement>(null);const close=useRef<HTMLButtonElement>(null);const [answerLanguage,setAnswerLanguage]=useState(savedLanguage);
useEffect(()=>{const update=()=>setAnswerLanguage(savedLanguage());window.addEventListener('healthtrack-language-change',update);return()=>window.removeEventListener('healthtrack-language-change',update)},[]);
useEffect(()=>{close.current?.focus();return()=>{if(timer.current)clearTimeout(timer.current)}},[]);
useEffect(()=>{const visual=window.visualViewport;if(!visual)return;const update=()=>setViewport({height:visual.height,bottom:Math.max(0,baseHeight.current-visual.height-visual.offsetTop)});update();visual.addEventListener('resize',update);visual.addEventListener('scroll',update);return()=>{visual.removeEventListener('resize',update);visual.removeEventListener('scroll',update)}},[]);
const keyboardVisible=focusedField!==null&&viewport.bottom>120;
useEffect(()=>{if(keyboardVisible&&focusedField==='chat')chat.current?.scrollTo({top:chat.current.scrollHeight,behavior:'auto'})},[keyboardVisible,focusedField]);
useEffect(()=>{if(messages.length>1||typing)chat.current?.scrollTo({top:chat.current.scrollHeight,behavior:'smooth'})},[messages,typing]);
const lastAnswered = [...messages].reverse().find(message=>message.answer)?.answer;
const lastIndex = entries.findIndex(entry=>entry.question===lastAnswered?.question);
const next = [...entries.slice(lastIndex+1),...entries.slice(0,lastIndex+1)].find(entry=>!messages.some(message=>message.answer?.question===entry.question));
const send=(text:string,answer?:Answer)=>{if(!text.trim()||typing)return;const question=text.trim();const found=answer??matchLocalizedAnswer(organ.name,question,answerLanguage)??matchAnswer(organ.name,question);const urgent=/(severe chest pain|crushing chest|cannot breathe|can't breathe|sudden severe headache|sudden vision loss|stroke|unconscious|dolor (intenso|fuerte|repentino) (de|en el) pecho|no puedo respirar|mal de pecho|douleur thoracique intense|difficulté à respirer|सीने में तेज दर्द|साँस नहीं|सांस नहीं|अचानक तेज सिरदर्द|胸痛|无法呼吸|呼吸困难|突发剧烈头痛|突然失明)/i.test(question);setMessages(m=>[...m,{role:'user',text:question}]);setInput('');setTyping(true);timer.current=setTimeout(()=>{setMessages(m=>[...m,found?{role:'assistant',text:found.text,answer:found,urgent}:{role:'assistant',text:'',link:searchUrl(question),urgent}]);setTyping(false)},700)};
return <motion.aside className={'assistant'+(keyboardVisible?' keyboard-active':'')+(keyboardVisible&&focusedField==='chat'?' composer-focused':'')} style={keyboardVisible?{'--keyboard-bottom':`${viewport.bottom}px`,'--keyboard-height':`${viewport.height}px`} as React.CSSProperties:undefined} onFocusCapture={e=>{if(e.target instanceof HTMLInputElement)setFocusedField('chat');else if(e.target instanceof HTMLTextAreaElement)setFocusedField('note')}} onBlurCapture={e=>{if(!(e.relatedTarget instanceof HTMLInputElement)&&!(e.relatedTarget instanceof HTMLTextAreaElement))setFocusedField(null)}} aria-label={`${organ.name} assistant`} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:30}} transition={{duration:.32,ease:'easeOut'}}><div className={"panel-art"+(animationSrc?" animated-organ":"")}><img src={animationSrc??organ.image.replace("/assets/", "/assets/2x/")} alt={animationSrc?`Animated ${organ.name.toLowerCase()}`:organ.name}/><button ref={close} className="close" aria-label="Close assistant" onClick={onClose}><X size={20}/></button></div><div className="panel-content" ref={chat}><h2>{chatCopy[answerLanguage].heading}</h2><div className="symptoms">{organ.symptoms.map((s,i)=><button disabled={typing} key={s} onClick={()=>send(answerLanguage==='en'?s:translatedQuestion(organ.name,entries[i+1],answerLanguage),entries[i+1])}>{i===2?<Wind size={14}/>:<Activity size={14}/>} {answerLanguage==='en'?s:translatedQuestion(organ.name,entries[i+1],answerLanguage)}</button>)}<button disabled={typing} className="learn" onClick={()=>send(answerLanguage==='en'?`Learn about the ${organ.name.toLowerCase()}`:translatedQuestion(organ.name,entries[0],answerLanguage),entries[0])}><Info size={14}/>{answerLanguage==='en'?`Learn about the ${organ.name.toLowerCase()}`:translatedQuestion(organ.name,entries[0],answerLanguage)}</button></div><VisitNote organ={organ.name} messages={messages}/>{messages.some(m=>m.role==='user')&&<section className="nutrition-section" aria-label="Explore nutrition topics"><div className="nutrition-grid">{nutritionTopicsFor(organ.name).map(nutrient=><NutrientCard key={nutrient.name} nutrient={nutrient}/>)}</div><p>Explore food nutrients, not treatment recommendations. Ask a health professional before taking supplements.</p></section>}<div className="messages" aria-live="polite">{messages.map((m,i)=><div key={i} className={'message '+(m.role==='assistant'?'bot':'user')}>{m.role==='assistant'&&<small>MEDLINEPLUS · {organ.name.toUpperCase()}</small>}{m.role==='assistant'?(m.urgent?chatCopy[answerLanguage].urgent:'')+(m.answer?translatedAnswer(organ.name,m.answer,answerLanguage):m.link?chatCopy[answerLanguage].fallback:m.text):m.text}{m.answer&&<><br/><a className="source-link" href={m.answer.url} target="_blank" rel="noopener noreferrer">{chatCopy[answerLanguage].source}: MedlinePlus, National Library of Medicine · {m.answer.source}</a></>}{m.link&&<><br/><a href={m.link} target="_blank" rel="noopener noreferrer">{chatCopy[answerLanguage].search}</a></>}</div>)}{typing&&<div className="typing" aria-label="Assistant is typing"><i/><i/><i/></div>}{next&&!typing&&<button className="followup" onClick={()=>send(translatedQuestion(organ.name,next,answerLanguage),next)}>{translatedQuestion(organ.name,next,answerLanguage)}</button>}</div></div><div className="chat-bottom">
  <div className={'chat-composer-card'+(showNearby?'':' is-plain')}>
    {showNearby&&<div className="nearby-prompt">
      <a className="nearby-doctors" href={nearbyUrl(nearbySpecialists[organ.name])} target="_blank" rel="noopener noreferrer" aria-label={`Find ${nearbySpecialists[organ.name]} near you in Google Maps`}>
        <span className="doctor-portraits" aria-hidden="true"><img src="/assets/doctor-portraits/doctor-1.png" alt=""/><img src="/assets/doctor-portraits/doctor-2.png" alt=""/><img src="/assets/doctor-portraits/doctor-3.png" alt=""/></span>
        <span className="nearby-label">Find <strong>{nearbySpecialists[organ.name]}</strong> near you</span>
      </a>
      <button className="nearby-dismiss" type="button" aria-label="Dismiss nearby doctors suggestion" onClick={()=>setShowNearby(false)}><X size={15}/></button>
    </div>}
    <form onSubmit={e=>{e.preventDefault();send(input)}}><input aria-label={`Ask about ${organ.name.toLowerCase()}`} placeholder={chatCopy[answerLanguage].placeholder}  value={input} onChange={e=>setInput(e.target.value)} maxLength={500}/><button aria-label="Send message" disabled={typing||!input.trim()}><img src="/assets/ai-assistant.svg" alt=""/></button></form>
  </div>
</div></motion.aside>}
function App(){const [selected,setSelected]=useState(organs[2]);const [open,setOpen]=useState(false);const lastFocus=useRef<HTMLElement|null>(null);const select=(o:Organ)=>{lastFocus.current=document.activeElement as HTMLElement;setSelected(o);setOpen(true)};const close=()=>{setOpen(false);lastFocus.current?.focus()};useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[]);return <MotionConfig reducedMotion="user"><div className={'app '+(open?'panel-open':'')}><div className="workspace"><Header/><AnatomyHero selected={selected} open={open} onSelect={select}/></div><AnimatePresence>{open&&<OrganAssistantPanel key={selected.name} organ={selected} onClose={close}/>}</AnimatePresence></div></MotionConfig>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
