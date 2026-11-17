(function(){
const INK='#783E19',CREAM='#FBF0DA',BROWN='#5A2A10',BLUSH='#F0B8C0',PINK='#EBA3AE',BABY='#A7C3E8',CHERRY='#C8443F',BUTTER='#F3E08A',GOLD='#C9A44A',OLIVE='#7E9A3E';
const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const f=n=>(+n).toFixed(1);
let UID=0;
const rnd=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const defs=u=>'<defs><filter id="'+u+'nz" filterUnits="userSpaceOnUse" x="0" y="0" width="160" height="160"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .17 0 0 0 0 .07 0 0 0 1.4 -.6"/></filter><pattern id="'+u+'gr" patternUnits="userSpaceOnUse" width="160" height="160"><rect width="160" height="160" filter="url(#'+u+'nz)"/></pattern><linearGradient id="'+u+'sv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF6" stop-opacity=".35"/><stop offset=".4" stop-color="#FFFDF6" stop-opacity="0"/><stop offset="1" stop-color="'+BROWN+'" stop-opacity=".22"/></linearGradient><linearGradient id="'+u+'sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+BROWN+'" stop-opacity=".12"/><stop offset=".25" stop-color="'+BROWN+'" stop-opacity="0"/><stop offset=".75" stop-color="'+BROWN+'" stop-opacity="0"/><stop offset="1" stop-color="'+BROWN+'" stop-opacity=".2"/></linearGradient><pattern id="'+u+'st" patternUnits="userSpaceOnUse" width="24" height="10"><rect width="24" height="10" fill="'+CREAM+'"/><rect width="12" height="10" fill="'+BABY+'"/></pattern><pattern id="'+u+'pd" patternUnits="userSpaceOnUse" width="18" height="18"><rect width="18" height="18" fill="'+BLUSH+'"/><circle cx="4.5" cy="4.5" r="2.4" fill="'+CREAM+'"/><circle cx="13.5" cy="13.5" r="2.4" fill="'+CREAM+'"/></pattern><filter id="'+u+'bl" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="5"/></filter><clipPath id="'+u+'cf"><rect x="0" y="306" width="390" height="200"/></clipPath></defs>';
const S=' stroke="'+INK+'" stroke-width="2" stroke-linejoin="round"';
const paint=(u,p,fill,o)=>{o=o||{};return '<path d="'+p+'" fill="'+fill+'"/>'+(o.sv===false?'':'<path d="'+p+'" fill="url(#'+u+'sv)"/>')+'<path d="'+p+'" fill="url(#'+u+'sh)"/><path d="'+p+'" fill="url(#'+u+'gr)" opacity=".5"/>'+(o.line===false?'':'<path d="'+p+'" fill="none"'+S+'/>');};
const FRONT='M36,300 H354 V346 Q354,356 344,356 H46 Q36,356 36,346Z';
const RIM='M36,300 H354 V307 H36Z';
const INNER='M54,224 H336 L354,300 H36Z';
const SIDES='M54,224 L68,234 L70,300 L36,300Z M336,224 L322,234 L320,300 L354,300Z';
const BACKF='M54,224 H336 L322,234 H68Z';
const shadow=u=>'<ellipse cx="198" cy="358" rx="172" ry="11" fill="'+BROWN+'" opacity=".3" filter="url(#'+u+'bl)"/>';
const svg=(u,inner)=>'<svg viewBox="0 0 390 470" width="390" height="470" style="display:block;overflow:visible">'+defs(u)+inner+'</svg>';
function scallopRow(x0,x1,y,n,dir,fill){const dx=(x1-x0)/n,r=dx/2;let p='M'+x0+','+y;for(let i=0;i<n;i++)p+='a'+f(r)+','+f(r)+' 0 0 '+(dir>0?0:1)+' '+f(dx)+',0';p+=(dir>0?'V'+(y-2):'V'+(y+2))+'H'+x0+'Z';return '<path d="'+p+'" fill="'+fill+'"/><path d="'+p.replace(/V[^H]*H[^Z]*Z$/,'')+'" fill="none" stroke="'+INK+'" stroke-width="1.6"/>';}
const eyelets=(x0,x1,y,n,fill)=>{let s='';const dx=(x1-x0)/n;for(let i=0;i<n;i++)s+='<circle cx="'+f(x0+dx*(i+.5))+'" cy="'+y+'" r="2" fill="'+fill+'" stroke="'+INK+'" stroke-opacity=".55" stroke-width=".8"/>';return s;};
function label(x,y,txt,rot){return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+')"><ellipse rx="34" ry="19" fill="'+BUTTER+'" stroke="'+INK+'" stroke-width="1.6"/><ellipse rx="29.5" ry="15" fill="none" stroke="'+GOLD+'" stroke-width="1.4"/><text y="6" text-anchor="middle" font-family="La Belle Aurore" font-size="19" fill="'+INK+'">'+txt+'</text></g>';}
function shred(seed,y0,y1,n,xs){const R=rnd(seed),cols=[PINK,CREAM,BUTTER,BLUSH];let s='';for(let i=0;i<n;i++){const x=xs[0]+R()*(xs[1]-xs[0]),y=y0+R()*(y1-y0),a=R()*180,l=14+R()*12,c=cols[i%4];const p='M'+f(-l/2)+',0 q'+f(l/4)+','+f(-5)+' '+f(l/2)+',0 t'+f(l/2)+',0';s+='<g transform="translate('+f(x)+','+f(y)+') rotate('+f(a)+')"><path d="'+p+'" fill="none" stroke="'+INK+'" stroke-width="4.2" stroke-linecap="round"/><path d="'+p+'" fill="none" stroke="'+c+'" stroke-width="2.4" stroke-linecap="round"/></g>';}return s;}
const hp=(x,y,w,h)=>{const q=(a,b)=>f(x+a*w)+','+f(y+b*h);return 'M'+q(.5,.2)+'C'+q(.44,.04)+' '+q(.28,-.01)+' '+q(.16,.03)+'C'+q(.03,.08)+' '+q(-.01,.24)+' '+q(.02,.37)+'C'+q(.06,.57)+' '+q(.3,.77)+' '+q(.5,.99)+'C'+q(.7,.77)+' '+q(.94,.57)+' '+q(.98,.37)+'C'+q(1.01,.24)+' '+q(.97,.08)+' '+q(.84,.03)+'C'+q(.72,-.01)+' '+q(.56,.04)+' '+q(.5,.2)+'Z';};
function box(v,part,opt){opt=opt||{};
 const u='bx'+(UID++)+'_';
 if(v==='heart'){
  const H=hp(22,176,346,170),W=hp(22,200,346,170),I=hp(52,192,286,140),side=mix(CHERRY,INK,.25),liner=mix(CREAM,BLUSH,.4);
  const ruf='<path d="'+I+'" fill="none" stroke="'+INK+'" stroke-width="11" stroke-dasharray="0 7.5" stroke-linecap="round"/><path d="'+I+'" fill="none" stroke="'+liner+'" stroke-width="9" stroke-dasharray="0 7.5" stroke-linecap="round"/>';
  const all=paint(u,W,side)+paint(u,H,CHERRY)+ruf+paint(u,I,CREAM,{line:false})+'<path d="'+hp(70,205,250,116)+'" fill="none" stroke="'+INK+'" stroke-opacity=".35" stroke-width="1" stroke-dasharray="3 3"/>';
  if(part==='back')return svg(u,'<ellipse cx="198" cy="366" rx="150" ry="12" fill="'+BROWN+'" opacity=".3" filter="url(#'+u+'bl)"/>'+all);
  return svg(u,'<g clip-path="url(#'+u+'cf)">'+all+'</g>');
 }
 const C={stripe:{wall:opt.wall||'url(#'+u+'st)',in:opt.inner||CREAM,inD:mix(opt.inner||CREAM,INK,.12)},lid:{wall:'url(#'+u+'pd)',in:CREAM,inD:mix(CREAM,INK,.12)},kraft:{wall:'#D4AE6E',in:'#B48A4E',inD:'#9C7440'}}[v];
 if(part==='back'){
  let s=shadow(u)+paint(u,INNER,C.inD)+'<path d="'+SIDES+'" fill="'+C.in+'" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/><path d="'+BACKF+'" fill="'+C.in+'" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/>';
  if(v==='stripe')s+=scallopRow(60,330,226,18,-1,mix(CREAM,BLUSH,.3));
  if(v==='lid'){const L='M70,112 Q70,104 78,104 H312 Q320,104 320,112 L334,226 H56Z';s=shadow(u)+paint(u,L,'url(#'+u+'pd)')+'<path d="M58,214 H332 L334,226 H56Z" fill="'+mix(BLUSH,INK,.2)+'" stroke="'+INK+'" stroke-width="1.4"/>'+'<path d="M178,104 H202 L204,226 H176Z" fill="'+BABY+'" stroke="'+INK+'" stroke-width="1.6" stroke-linejoin="round"/><path d="M190,104 V226" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="1.4"/>'+s+'<path d="M64,236 Q100,222 140,240 Q180,226 220,240 Q262,224 326,236 L340,286 H50Z" fill="'+mix(CREAM,BLUSH,.35)+'" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/><path d="M90,236 L84,282 M150,240 L156,284 M240,240 L232,284 M300,234 L306,282" stroke="'+INK+'" stroke-opacity=".3" stroke-width="1"/>';}
  if(v==='kraft')s+=shred(3,232,298,70,[50,340]);
  return svg(u,s);
 }
 let s=paint(u,FRONT,C.wall)+(opt.trim?'<path d="M36,348 H354" stroke="'+opt.trim+'" stroke-width="3"/><path d="M36,345 H354 M36,351 H354" stroke="'+INK+'" stroke-opacity=".35" stroke-width=".8"/>':'')+(opt.dots?(()=>{let d='';for(let i=0;i<9;i++)d+='<circle cx="'+(56+i*35)+'" cy="334" r="3.2" fill="'+opt.dots+'" stroke="'+INK+'" stroke-opacity=".4" stroke-width=".8"/>';return d;})():'')+'<path d="'+RIM+'" fill="'+(v==='kraft'?'#E2C48C':(opt.rim||CREAM))+'" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/>';
 if(v==='stripe')s+=scallopRow(36,354,307,22,1,mix(CREAM,BLUSH,.3))+eyelets(36,354,311,22,mix(CREAM,BLUSH,.3)).replace(/fill="[^"]*"/g,'fill="#FCF7EF"');
 if(v==='lid')s+='<path d="M178,300 H202 V356 H178Z" fill="'+BABY+'" stroke="'+INK+'" stroke-width="1.6"/><path d="M190,300 V356" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="1.4"/>'+label(190,330,'Sweet',-2);
 if(v==='kraft')s=shred(8,294,306,18,[50,340])+s+'<g transform="translate(300,330) rotate(-8)"><circle r="20" fill="'+CREAM+'" stroke="'+INK+'" stroke-width="1.5"/><circle r="16" fill="none" stroke="'+CHERRY+'" stroke-width="1.2" stroke-dasharray="2 2"/><text y="5" text-anchor="middle" font-family="La Belle Aurore" font-size="14" fill="'+INK+'">Sweet</text></g><path d="M44,320 H130" stroke="'+INK+'" stroke-opacity=".25" stroke-width="1"/><path d="M44,326 H110" stroke="'+INK+'" stroke-opacity=".25" stroke-width="1"/>';
 return svg(u,s);
}
window.SweetBox={boxRaw:box,box:(v,p,o)=>{const s=box(v,p,o);return window.SweetCandy&&window.SweetCandy.hand?window.SweetCandy.hand(s):s;}};
})();
