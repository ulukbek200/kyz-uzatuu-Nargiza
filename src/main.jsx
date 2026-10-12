import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import layers from './layers.json';
import './styles.css';

const EVENT_DATE='2026-10-17T11:00:00+06:00';
const MAP_URL='https://2gis.kg/bishkek/geo/70030076631653740/75.683211,41.088004';
const replaced=new Set([5,7,8,9,10,13,14,17,19,20,21,22,23,24,25,26,27,28,29,31,32,33,40,41,42,47,48]);

function Layer({x,y,width,height,z=3,animation,duration=3,distance=100,spin,transform,children,className='',layerKey}) {
 const ref=useRef(null);
 const [visible,setVisible]=useState(!animation);
 useEffect(()=>{
  if(!animation)return;
  const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect();}},{threshold:0});
  observer.observe(ref.current);return()=>observer.disconnect();
 },[animation]);
 return <div ref={ref} data-layer={layerKey} className={`layer ${animation?'reveal':''} ${visible?'visible':''} ${className}`} data-animation={animation} style={{left:`calc(50% - 160px + ${x}px)`,top:y>=3944?y-560:y,width,height:height||undefined,zIndex:z,'--duration':`${duration}s`,'--distance':`${distance}px`}}>
  <div className={spin?'layer-content spinning':'layer-content'} style={transform&&!spin?{transform}:undefined}>{children}</div>
 </div>;
}

function OriginalLayer({layer}) {
 if(!layer.asset)return null;
 if(layer.key===11)return <Layer {...layer} layerKey={layer.key}><div className="replacement-hero"><img src="/assets/nargiza-portrait.jpg" alt="Наргиза"/></div></Layer>;
 if(layer.key===4)return <Layer {...layer} layerKey={layer.key}><div className="replacement-address" aria-hidden="true"/></Layer>;
 const photo=layer.key===36?'nargiza-detail-side.jpg':layer.key===37?'nargiza-detail-front.jpg':null;
 if(photo)return <Layer {...layer} layerKey={layer.key}><img src={`/assets/${photo}`} alt="" className="photo-cover" width={layer.width} height={layer.height}/></Layer>;
 return <Layer {...layer} layerKey={layer.key}><img src={`/assets/${layer.asset}`} alt="" aria-hidden="true" draggable="false" className={layer.type==='shape'?'photo-cover':''} width={layer.width} height={layer.height}/></Layer>;
}

function Calendar(){
 const weekdays=['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
 return <section className="calendar" aria-label="17 октября 2026 года, суббота">
  <h2 className="script">Октябрь</h2><div className="calendar-year">2026</div>
  <div className="calendar-grid">{weekdays.map(d=><span className="weekday" key={d}>{d}</span>)}
   {Array.from({length:35},(_,i)=>{const day=i-2;return <span key={i} className={day===17?'chosen-day':''}>{day>0&&day<=31?day:''}{day===17&&<svg className="heart" viewBox="0 0 50 49" aria-hidden="true"><path d="M25 45C18 38 2 28 3 15C4 2 20 0 25 12C32-1 48 4 47 17C46 29 32 40 25 45Z"/></svg>}</span>;})}
  </div>
 </section>;
}

function Countdown(){
 const [remaining,setRemaining]=useState(()=>Math.max(0,new Date(EVENT_DATE)-Date.now()));
 useEffect(()=>{const timer=setInterval(()=>setRemaining(Math.max(0,new Date(EVENT_DATE)-Date.now())),1000);return()=>clearInterval(timer);},[]);
 const values=[Math.floor(remaining/86400000),Math.floor(remaining/3600000)%24,Math.floor(remaining/60000)%60,Math.floor(remaining/1000)%60];
 return <div className="countdown" role="timer" aria-label={`Тойго чейин: ${values[0]} күн, ${values[1]} саат, ${values[2]} мүнөт`}>
  {values.map((v,i)=><div className="countdown-circle" key={i}><span>{String(v).padStart(2,'0')}</span></div>)}
 </div>;
}

function Music(){
 const audio=useRef(null);const stopped=useRef(false);const [playing,setPlaying]=useState(false);const [available,setAvailable]=useState(true);
 useEffect(()=>{
  const player=audio.current;
  const start=(event)=>{
   if(event?.target?.closest?.('.music-toggle'))return;
   if(!stopped.current&&player.paused)player.play().catch(()=>{});
  };
  const gestures=['pointerdown','click','keydown'];
  start();
  gestures.forEach(event=>document.addEventListener(event,start));
  return()=>gestures.forEach(event=>document.removeEventListener(event,start));
 },[]);
 function toggle(){const player=audio.current;if(!player.paused){stopped.current=true;player.pause();}else{stopped.current=false;player.play().catch(()=>setAvailable(false));}}
 return <><audio ref={audio} src="/assets/asset-39.mp3" autoPlay loop preload="auto" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setAvailable(false)}/>
  <button className={`music-toggle ${playing?'playing':''}`} onPointerDown={e=>e.stopPropagation()} onClick={toggle} aria-label={playing?'Музыканы токтотуу':'Музыканы ойнотуу'} aria-pressed={playing} title={available?'Музыка':'Музыка жеткиликсиз'}><span aria-hidden="true">{playing?'Ⅱ':'♪'}</span></button></>;
}

function App(){
 return <>
  <div className="page-background" aria-hidden="true"/>
  <main className="invitation" aria-label="Наргиза — Кыз узатуу">
   {layers.filter(l=>!replaced.has(l.key)).map(layer=><OriginalLayer key={layer.key} layer={layer}/>)}

   <Layer x={12} y={571} width={297} height={107} animation="fadeindown" duration={4} className="hero-name"><h1 className="script">Наргиза</h1></Layer>
   <Layer x={149} y={669} width={155} height={37} animation="fadeinup" duration={3}><p className="event-kind">Кыз узатуу</p></Layer>

   <Layer x={5} y={932} width={310} height={314} animation="fadein" duration={6} className="invitation-copy">
    <h2 className="script">Урматтуу жана<br/>кадырлуу коноктор!</h2>
    <p>Жашообуздагы эң толкунданткан жана өзгөчө күндүн күбөсү болууга сиздерди чакырабыз.</p>
    <p>Үмүт үкөлөп, мээрим төгүп өстүргөн кызыбыз <span className="daughter-name">Наргиза</span> өзүнүн жаңы турмуш жолуна аттанууда.</p>
    <p>Кызыбызды узатуу салтанатынын кадырлуу коногу болуп, ак батаңыздарды берип кетүүңүздөрдү өтүнөбүз!</p>
   </Layer>

   <Layer x={45} y={1441} width={238} height={266} animation="zoomin" duration={5}><Calendar/></Layer>
   <Layer x={3} y={1887} width={314} height={89} animation="zoomin" duration={5}><Countdown/></Layer>

   <Layer x={9} y={2218} width={302} height={270} animation="fadeinup" duration={3} className="address-copy">
    <p>Нарын облусу,<br/>Ат-Башы району,</p><p className="script village">Калинин айылы</p>
   </Layer>
   <Layer x={53} y={2512} width={227} height={50}><a className="map-button" href={MAP_URL} target="_blank" rel="noreferrer">КАРТАГА КИРҮҮ <span aria-hidden="true">♧</span></a></Layer>

   <Layer x={-31} y={2647} width={261} height={369} animation="fadein" duration={6} className="schedule-icon first-icon"><img src="/assets/asset-28.png" alt=""/></Layer>
   <Layer x={25} y={2810} width={150} height={96} animation="fadein" duration={6} className="schedule-copy"><time dateTime={EVENT_DATE}>11:00</time><p>КОНУКТОРДУН<br/>ЧОГУЛУУСУ</p></Layer>
   <Layer x={70} y={2820} width={286} height={405} animation="fadein" duration={6} className="schedule-icon second-icon"><img src="/assets/asset-15.png" alt=""/></Layer>
   <Layer x={140} y={3010} width={137} height={100} animation="fadein" duration={6} className="schedule-copy"><p className="schedule-title">Кыз узатуу</p><p>АК БАТА</p></Layer>
   <Layer x={2} y={3077} width={317} height={448} animation="fadein" duration={6} className="schedule-icon third-icon"><img src="/assets/asset-26.png" alt=""/></Layer>
   <Layer x={40} y={3274} width={240} height={90} animation="fadein" duration={6} className="schedule-copy"><p className="schedule-title">Жакшы тилектер</p><p>ЖАҢЫ ТУРМУШ ЖОЛУНА</p></Layer>
   <Layer x={15} y={4281} width={290} height={60} animation="fadeinleft" duration={4} className="hosts-intro"><p>Сиздерди терең урматтоо менен<br/>тосуп алуучулар:</p></Layer>
   <Layer x={2} y={4341} width={316} height={130} className="hosts"><p><span>Атасы</span> <strong className="script">Назарбек,</strong></p><p><span>апасы</span> <strong className="script">Доктургуль.</strong></p></Layer>
   <Layer x={-43} y={4980} width={403} height={132} className="footer"><p>Наргиза · Кыз узатуу</p><p>17 октября 2026 года · 11:00</p><p>Калинин айылы</p></Layer>
  </main>
  <Music/>
 </>;
}

createRoot(document.getElementById('root')).render(<App/>);
