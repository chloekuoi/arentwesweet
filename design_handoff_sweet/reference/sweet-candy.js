(function(){
const INK='#783E19',CREAM='#FBF0DA',BROWN='#5A2A10';
const P={cherry:'#C8443F',pink:'#EBA3AE',olive:'#7E9A3E',baby:'#A7C3E8',blush:'#F0B8C0',navy:'#1F2A44',dusty:'#93AFCF',shelf:'#6F9E96',butter:'#F3E08A',gold:'#C9A44A',cream:CREAM,choc:INK};
const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const BODY='M118,61 C150,53 210,53 242,61 C254,64 259,82 259,100 C259,118 254,136 242,139 C210,147 150,147 118,139 C106,136 101,118 101,100 C101,82 106,64 118,61Z';
const BSH='M101,104 C102,120 107,135 118,139 C150,147 210,147 242,139 C253,136 258,120 259,104 C240,128 200,132 180,132 C160,132 120,128 101,104Z';
const LCAP='M101,100 C101,82 106,64 118,61 C113,74 112,88 112,100 C112,112 113,126 118,139 C106,136 101,118 101,100Z';
const RCAP='M259,100 C259,82 254,64 242,61 C247,74 248,88 248,100 C248,112 247,126 242,139 C254,136 259,118 259,100Z';
const HL='M126,66 C160,59 206,59 236,65 C208,66 160,67 128,71Z';
const WR='M104,80 Q112,87 121,85 M103,95 Q112,100 122,97 M104,114 Q112,111 120,118 M256,83 Q248,88 240,85 M257,101 Q249,99 239,103 M255,117 Q247,113 241,120';
const LEND='M108,91 C92,88 76,80 60,70 Q50,60 44,70 Q32,72 36,84 Q26,92 34,100 Q26,110 36,116 Q32,130 44,130 Q52,140 60,130 C76,120 92,112 108,109Z';
const REND='M252,91 C270,87 286,77 302,66 Q314,58 318,70 Q332,70 328,82 Q340,90 330,98 Q340,108 330,114 Q336,128 322,127 Q316,140 304,132 C288,122 270,112 252,109Z';
const LLIP='M50,70 Q42,78 44,86 Q38,94 42,100 Q38,108 44,114 Q42,124 52,128';
const RLIP='M310,68 Q318,76 318,84 Q324,92 320,100 Q326,108 320,114 Q322,124 312,128';
const LF='M104,96 Q78,84 50,72 M104,99 Q74,94 40,88 M104,101 Q74,104 40,110 M104,104 Q80,118 52,128 M104,100 Q90,99 76,97';
const RF='M256,96 Q284,82 312,68 M256,99 Q290,92 324,86 M256,101 Q290,106 322,112 M256,104 Q282,118 308,130 M256,100 Q272,102 286,101';
const PUD='M62,153 C60,143 112,139 180,140 C248,139 300,143 298,152 C297,159 262,161 238,160 C232,168 220,169 216,160 C186,162 150,162 126,160 C120,167 108,168 104,160 C84,160 63,158 62,153Z';
const BOXF='M111,62 H249 Q257,62 257,70 V140 Q257,148 249,148 H111 Q103,148 103,140 V70 Q103,62 111,62Z';
const BOXT='M115,46 H245 Q252,46 257,62 H103 Q108,46 115,46Z';
const BOXSH='M103,122 V140 Q103,148 111,148 H249 Q257,148 257,140 V122 Q220,133 180,133 Q140,133 103,122Z';
const BOXPL='M103,70 Q109,84 104,96 M103,134 Q109,120 104,108 M257,70 Q251,84 256,96 M257,134 Q251,120 256,108 M108,46 Q114,54 110,62 M252,46 Q246,54 250,62';
const BOXSEAM='M103,80 C130,76 150,81 180,78 C210,75 232,81 257,78';
const mir=p=>p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g,(m,x,y)=>(360-+x)+','+y);
const LENDR='M106,94 C94,88 84,78 72,64 Q66,52 56,58 Q46,50 42,62 Q30,62 32,76 Q20,82 28,94 Q16,102 28,110 Q18,122 32,128 Q30,142 44,140 Q50,152 62,144 Q72,150 76,138 C88,126 96,116 106,110Z';
const RENDR=mir(LENDR);
const LFR='M102,100 Q76,92 46,66 M102,101 Q70,99 32,94 M102,103 Q70,110 30,118 M102,105 Q78,122 46,138 M102,104 Q86,114 68,142 M102,99 Q86,84 60,58';
const RFR=mir(LFR);
const LLIPR='M56,58 Q48,64 44,72 M32,76 Q30,86 32,94 M28,110 Q30,118 34,126 M44,140 Q52,140 60,144';
const RLIPR=mir(LLIPR);
const mapP=(p,f)=>p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g,(m,x,y)=>{const q=f(+x,+y);return q[0].toFixed(1)+','+q[1].toFixed(1);});
const SHAPES=[{key:'classic',name:'Classic',note:'Current candy, for reference'},{key:'bonbon',name:'Bonbon',note:'Shorter, plumper body with fuller fans and bigger bows'},{key:'roll',name:'Long roll',note:'Slim, stretched body with longer pleated ends and neat bows'},{key:'pinked',name:'Pinked ends',note:'Fan ends cut with pinking shears and a stitched hem'},{key:'flared',name:'Twist & flare',note:'Twisted necks that open into tall flared fans'}];
const SH={bonbon:{bx:.8,by:1.16,ex:.88,ey:1.12,bw:1.16},roll:{bx:1.14,by:.84,ex:1.12,ey:.9,bw:.9},pinked:{pink:1},flared:{bx:.94,ex:.86,ey:1.34,twist:1,bw:1.04}};
const PINK=(()=>{const n=16,pts=[],lip=[];for(let i=0;i<=n;i++){const t=.36+(Math.PI-.72)*i/n,r=i%2?.86:1;pts.push([62-28*r*Math.sin(t),100-32*r*Math.cos(t)]);lip.push([62-22*Math.sin(t),100-25*Math.cos(t)]);}const f=a=>a[0].toFixed(1)+','+a[1].toFixed(1);const L='M108,91 C92,88 76,80 '+f(pts[0])+' '+pts.slice(1).map(p=>'L'+f(p)).join(' ')+' C76,120 92,112 108,109Z';return{L,LIP:'M'+lip.map(f).join(' L')};})();
const TWL='M100,93 Q103,100 99,107 M94,91 Q98,100 93,109 M88,89 Q92,100 87,111';
const FABRICS=[{key:'cherry_print',name:'Cherry print',note:'Little cherries on cream'},{key:'pink_stripe',name:'Pink stripe',note:'Candy-pink awning stripe'},{key:'ticking',name:'Ticking stripe',note:'French navy pinstripe'},{key:'madras',name:'Picnic plaid',note:'Cherry, navy and cream check'},{key:'candy_cane',name:'Candy cane',note:'Cherry bias stripe'}];
const FABRIC_ALTS=[{key:'cherry_print',name:'Cherry print',note:'Little cherries on cream'},{key:'ditsy_floral',name:'Ditsy floral',note:'Tiny cream flowers on blush'},{key:'ticking',name:'Ticking stripe',note:'French navy pinstripe'},{key:'pink_scallop',name:'Scallop print',note:'Pink fish-scale scallops'},{key:'heart_print',name:'Heart print',note:'Cream hearts on baby blue'},{key:'madras',name:'Picnic plaid',note:'Cherry, navy and cream check'},{key:'star_night',name:'Starry navy',note:'Gold stars on navy'},{key:'candy_cane',name:'Candy cane',note:'Cherry bias stripe'}];
const RIBBONS=[{key:'blue_stitch',name:'Stitched blue',note:'Baby blue with a saddle stitch'},{key:'blush',name:'Blush',note:'Satin'},{key:'sage',name:'Sage',note:'Thin olive satin'},{key:'navy_velvet',name:'Navy velvet',note:'Velvet'},{key:'bakers_twine',name:"Baker's twine",note:'Thin cherry-and-cream twist'}];
const RIB={baby_blue:{base:P.baby,hi:mix(P.baby,'#ffffff',.6),w:4.4},sage:{base:P.olive,hi:mix(P.olive,'#ffffff',.45),w:3},blush:{base:P.blush,hi:mix(P.blush,'#ffffff',.6),w:4.2},navy_velvet:{base:P.navy,nap:mix(P.navy,'#ffffff',.18),w:5.6}};
Object.assign(RIB,{
 cherry_stripe:{base:P.cherry,st:'stripe',w:4.8},
 pink_dot:{base:P.pink,st:'dots',w:5},
 blue_stitch:{base:P.baby,st:'stitch',w:4.6},
 gingham:{base:CREAM,st:'check',w:5.2},
 navy_gold:{base:P.navy,st:'edge',w:5.6},
 bakers_twine:{base:CREAM,st:'twine',w:3},
 french_stripe:{base:'#93AFCF',st:'center',w:5},
 olive_scallop:{base:P.olive,st:'scallop',w:4.8}
});
const RIBBON_ALTS=[{key:'cherry_stripe',name:'Candy stripe',note:'Cherry grosgrain with cream pinstripes'},{key:'pink_dot',name:'Polka-dot',note:'Pink satin with cream dots'},{key:'blue_stitch',name:'Stitched blue',note:'Baby blue with a saddle stitch'},{key:'gingham',name:'Gingham',note:'Cream with cherry checks'},{key:'navy_gold',name:'Navy + gold',note:'Velvet with gilded edges'},{key:'bakers_twine',name:"Baker's twine",note:'Thin cherry-and-cream twist'},{key:'french_stripe',name:'French stripe',note:'Dusty blue with a cherry centre'},{key:'olive_scallop',name:'Sage picot',note:'Olive with looped cream edges'}];
function ribPaint(p,r,w,sw){sw=sw||1;const L=(c,wd,ex)=>'<path d="'+p+'" fill="none" stroke="'+c+'" stroke-width="'+(+wd).toFixed(2)+'" stroke-linejoin="round" '+(ex||'stroke-linecap="round"')+'/>';
 let s=L(INK,w+2.4*sw);
 if(!r.st)return s+L(r.base,w)+(r.hi?'<path d="'+p+'" fill="none" stroke="'+r.hi+'" stroke-width="'+sw+'" stroke-linecap="round" opacity=".9" transform="translate(-.5,-.6)"/>':L(r.nap,w*.35,'stroke-linecap="round" opacity=".55"'));
 const B='stroke-linecap="butt"';
 if(r.st==='stripe')return s+L(r.base,w)+L(CREAM,w*.56,B)+L(r.base,w*.26,B);
 if(r.st==='dots')return s+L(r.base,w)+L(CREAM,w*.42,'stroke-linecap="round" stroke-dasharray="0 '+(w*1.15).toFixed(2)+'"');
 if(r.st==='stitch')return s+L(r.base,w)+L(CREAM,Math.max(.8,w*.2),B+' stroke-dasharray="'+(w*.5).toFixed(2)+' '+(w*.4).toFixed(2)+'"');
 if(r.st==='check')return s+L(r.base,w)+L(P.cherry,w,B+' stroke-dasharray="'+(w*.55).toFixed(2)+' '+(w*.55).toFixed(2)+'" opacity=".5"')+L(P.cherry,w*.34,B+' opacity=".55"');
 if(r.st==='edge')return s+L(P.gold,w)+L(r.base,w*.62)+L(mix(P.navy,'#ffffff',.18),w*.22,'stroke-linecap="round" opacity=".55"');
 if(r.st==='twine')return s+L(r.base,w)+L(P.cherry,w,B+' stroke-dasharray="'+(w*.7).toFixed(2)+' '+(w*.7).toFixed(2)+'"');
 if(r.st==='center')return s+L(r.base,w)+L(P.cherry,w*.3,B);
 if(r.st==='scallop')return L(INK,w+2.4*sw+w*.5,'stroke-linecap="round" stroke-dasharray="0 '+(w*.62).toFixed(2)+'"')+L(CREAM,w+w*.5,'stroke-linecap="round" stroke-dasharray="0 '+(w*.62).toFixed(2)+'"')+s+L(r.base,w);
 return s+L(r.base,w);}
const STICKERS=[{key:'butter_oval',name:'Butter oval'},{key:'pink_heart',name:'Pink heart'},{key:'scallop_seal',name:'Scallop seal'},{key:'blue_banner',name:'Blue banner'},{key:'cream_tag',name:'Gift tag'}];
function scallopPath(R,n){let p='';for(let i=0;i<n;i++){const a0=i/n*2*Math.PI,a1=(i+1)/n*2*Math.PI,c=R*Math.sin(Math.PI/n)*1.05;p+=(i?'':'M'+(R*Math.cos(a0)).toFixed(1)+','+(R*Math.sin(a0)).toFixed(1))+'A'+c.toFixed(1)+','+c.toFixed(1)+' 0 0 1 '+(R*Math.cos(a1)).toFixed(1)+','+(R*Math.sin(a1)).toFixed(1);}return p+'Z';}
function stickerBody(k,name){const f=fit(name),T=(y,fs,t)=>'<text y="'+y+'" text-anchor="middle" font-family="La Belle Aurore" font-size="'+fs+'" fill="'+INK+'">'+t+'</text>',two=(y1,y2)=>T(y1,10,'for')+T(y2,f.fs,esc(f.s));
 if(k==='pink_heart'){const h='M0,-14 C-6,-30 -34,-27 -32,-7 C-30,9 -12,19 0,30 C12,19 30,9 32,-7 C34,-27 6,-30 0,-14Z';return '<path d="'+h+'" fill="'+P.pink+'" stroke="'+INK+'" stroke-width="1.7" stroke-linejoin="round"/><path d="'+h+'" transform="scale(.82) translate(0,1)" fill="none" stroke="'+CREAM+'" stroke-width="1.3" stroke-dasharray="2.4 2"/>'+two(-3,13);}
 if(k==='scallop_seal')return '<path d="'+scallopPath(31,14)+'" fill="'+CREAM+'" stroke="'+INK+'" stroke-width="1.7" stroke-linejoin="round"/><circle r="24" fill="none" stroke="'+P.cherry+'" stroke-width="1.5"/><circle r="21" fill="none" stroke="'+P.cherry+'" stroke-width=".7" stroke-dasharray="1.6 1.6"/>'+two(-5,12);
 if(k==='blue_banner'){const s='for '+(String(name||'').trim()||'you');let fs=Math.min(13,60/(s.length*.6));let t=s;if(fs<9){fs=9;t=s.slice(0,Math.floor(60/(9*.6))-1)+'…';}const bp='M-42,-13 H42 L34,0 L42,13 H-42 L-34,0Z';return '<path d="M-36,13 L-30,20 L-24,13Z M36,13 L30,20 L24,13Z" fill="'+mix(P.baby,INK,.25)+'" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/><path d="'+bp+'" fill="'+P.baby+'" stroke="'+INK+'" stroke-width="1.7" stroke-linejoin="round"/><path d="M-32,-8.5 H32 M-32,8.5 H32" stroke="'+CREAM+'" stroke-width="1.1" stroke-dasharray="2.4 2"/>'+T(4,fs.toFixed(1),esc(t));}
 if(k==='cream_tag'){const tg='M-22,-22 L-12,-32 H12 L22,-22 V30 Q22,34 18,34 H-18 Q-22,34 -22,30Z';return '<path d="'+tg+'" fill="'+CREAM+'" stroke="'+INK+'" stroke-width="1.7" stroke-linejoin="round"/><path d="M-17,-19 L-9,-27 H9 L17,-19 V29 H-17Z" fill="none" stroke="'+P.baby+'" stroke-width="1.3"/><circle cy="-22" r="3.2" fill="'+CREAM+'" stroke="'+P.gold+'" stroke-width="1.6"/><path d="M0,-22 C-4,-36 -14,-40 -20,-46" fill="none" stroke="'+INK+'" stroke-width="2.6" stroke-linecap="round"/><path d="M0,-22 C-4,-36 -14,-40 -20,-46" fill="none" stroke="'+P.cherry+'" stroke-width="1.2" stroke-linecap="round"/>'+two(-4,14);}
 return '<ellipse rx="26" ry="32" fill="'+P.butter+'" stroke="'+INK+'" stroke-width="1.7"/><ellipse rx="22" ry="28" fill="none" stroke="'+P.gold+'" stroke-width="1.5"/>'+two(-6,12)+'<path d="M0,19 L2.2,21.6 L0,24.2 L-2.2,21.6Z" fill="'+P.gold+'"/>';}
function stickerSwatch(k,name){return hand('<svg viewBox="-48 -50 96 92" width="100%" height="100%" style="display:block;overflow:visible"><defs></defs>'+stickerBody(k,name||'Mia')+'</svg>');}
let UID=0;
const HANDF=id=>'<filter id="'+id+'" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1200" height="1100" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="7" result="t7"/><feDisplacementMap in="SourceGraphic" in2="t7" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="w7"/><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="2" seed="3" result="t3"/><feDisplacementMap in="w7" in2="t3" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>';
function hand(svg){if(!svg||svg.indexOf('data-hand')>-1)return svg;const id='hd'+(UID++);const o=svg.indexOf('>')+1,end=svg.lastIndexOf('</svg>');return svg.slice(0,o).replace('<svg','<svg data-hand="1"')+'<defs>'+HANDF(id)+'</defs><g filter="url(#'+id+')">'+svg.slice(o,end)+'</g></svg>';}
const rnd=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const sAt=(x,y,sx,sy)=>`translate(${x},${y}) scale(${sx},${sy}) translate(${-x},${-y})`;
function ging(s,c,col,bg){let r=`<rect width="${s}" height="${s}" fill="${bg}"/>`;for(let x=0;x<s;x+=2*c)r+=`<rect x="${x}" width="${c}" height="${s}" fill="${col}" opacity=".55"/>`;for(let y=0;y<s;y+=2*c)r+=`<rect y="${y}" width="${s}" height="${c}" fill="${col}" opacity=".55"/>`;return r;}
const motif=(x,y,c,d,rot)=>`<g transform="translate(${x},${y}) rotate(${rot})"><path d="M0,0 L-5,-3.2 L-5,3.2Z M0,0 L5,-3.2 L5,3.2Z" fill="${c}"/><path d="M0,0 L-2,4.8 M0,0 L2.6,4.2" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/><circle r="1.3" fill="${d}"/></g>`;
function fab(id,key,rot,sc){
 const tr=[];if(rot)tr.push(`rotate(${rot})`);if(sc&&sc!==1)tr.push(`scale(${sc})`);
 let s,i;
 if(key==='pink_stripe'){s=18;i=`<rect width="18" height="18" fill="${CREAM}"/><rect width="18" height="9" fill="${P.pink}"/>`;}
 else if(key==='sage_gingham'){s=12;i=ging(s,6,P.olive,CREAM);}
 else if(key==='pink_polka'){s=14;i=`<rect width="14" height="14" fill="${CREAM}"/><circle cx="3.5" cy="3.5" r="2.4" fill="${P.pink}"/><circle cx="10.5" cy="10.5" r="2.4" fill="${P.pink}"/>`;}
 else if(key==='dusty_blue_gingham'){s=16;i=ging(s,8,P.dusty,CREAM);}
 else if(key==='cherry_print'){s=30;const ch=(x,y,a)=>'<g transform="translate('+x+','+y+') rotate('+a+')"><path d="M-2.6,1 Q-1,-6 2,-8 M2.8,1.6 Q2.6,-4 2,-8" fill="none" stroke="'+mix(P.olive,INK,.2)+'" stroke-width=".9"/><path d="M2,-8 Q5.5,-10 7,-7.5 Q4,-6.5 2,-8Z" fill="'+P.olive+'"/><circle cx="-2.6" cy="2.4" r="2.6" fill="'+P.cherry+'"/><circle cx="2.9" cy="3" r="2.6" fill="'+P.cherry+'"/><circle cx="-3.3" cy="1.6" r=".7" fill="#FFF6E8"/><circle cx="2.2" cy="2.2" r=".7" fill="#FFF6E8"/></g>';i='<rect width="30" height="30" fill="'+CREAM+'"/>'+ch(8,9,-10)+ch(23,24,14);}
 else if(key==='ditsy_floral'){s=24;const fl=(x,y,c)=>{let p='';for(let k=0;k<5;k++){const a=k*Math.PI*2/5;p+='<circle cx="'+(x+2*Math.cos(a)).toFixed(2)+'" cy="'+(y+2*Math.sin(a)).toFixed(2)+'" r="1.6" fill="'+c+'"/>';}return p+'<circle cx="'+x+'" cy="'+y+'" r="1.1" fill="'+P.butter+'"/>';};i='<rect width="24" height="24" fill="'+P.blush+'"/>'+fl(6,6,CREAM)+fl(18,18,CREAM)+'<ellipse cx="11" cy="8" rx="2" ry=".9" transform="rotate(-30 11 8)" fill="'+P.olive+'"/><ellipse cx="13" cy="16" rx="2" ry=".9" transform="rotate(30 13 16)" fill="'+P.olive+'"/><circle cx="18" cy="5" r=".9" fill="'+CREAM+'"/><circle cx="5" cy="17" r=".9" fill="'+CREAM+'"/>';}
 else if(key==='ticking'){s=16;i='<rect width="16" height="16" fill="'+CREAM+'"/><rect x="2" width="2.4" height="16" fill="'+P.navy+'" opacity=".8"/><rect x="5.6" width="1" height="16" fill="'+P.navy+'" opacity=".7"/><rect x="11" width="1" height="16" fill="'+P.dusty+'"/>';}
 else if(key==='pink_scallop'){s=16;i='<rect width="16" height="16" fill="'+CREAM+'"/><path d="M0,8 A8,8 0 0 1 16,8 M-8,16 A8,8 0 0 1 8,16 M8,16 A8,8 0 0 1 24,16 M-8,0 A8,8 0 0 1 8,0 M8,0 A8,8 0 0 1 24,0" fill="none" stroke="'+P.pink+'" stroke-width="1.8"/><circle cx="8" cy="5" r=".9" fill="'+P.pink+'"/><circle cx="0" cy="13" r=".9" fill="'+P.pink+'"/><circle cx="16" cy="13" r=".9" fill="'+P.pink+'"/>';}
 else if(key==='heart_print'){s=22;const hh=(x,y,a)=>'<path transform="translate('+x+','+y+') rotate('+a+')" d="M0,2.6 C-3.6,-.4 -2.4,-3.4 0,-1.6 C2.4,-3.4 3.6,-.4 0,2.6Z" fill="'+CREAM+'"/>';i='<rect width="22" height="22" fill="'+P.baby+'"/>'+hh(5.5,5.5,-12)+hh(16.5,16.5,10)+'<circle cx="16.5" cy="5" r=".8" fill="'+CREAM+'"/><circle cx="5.5" cy="16.5" r=".8" fill="'+CREAM+'"/>';}
 else if(key==='madras'){s=32;i='<rect width="32" height="32" fill="'+CREAM+'"/><rect width="32" height="10" y="3" fill="'+P.cherry+'" opacity=".55"/><rect height="32" width="10" x="3" fill="'+P.cherry+'" opacity=".55"/><rect width="32" height="2" y="20" fill="'+P.navy+'" opacity=".55"/><rect height="32" width="2" x="20" fill="'+P.navy+'" opacity=".55"/><rect width="32" height="1" y="25" fill="'+P.olive+'" opacity=".6"/><rect height="32" width="1" x="25" fill="'+P.olive+'" opacity=".6"/>';}
 else if(key==='star_night'){s=26;i='<rect width="26" height="26" fill="'+P.navy+'"/><path d="'+star(7,7,3.2)+'" fill="'+P.gold+'"/><path d="'+star(19.5,18.5,2.4)+'" fill="'+P.butter+'"/><circle cx="19" cy="6" r=".9" fill="'+CREAM+'"/><circle cx="6" cy="19" r=".9" fill="'+CREAM+'"/><circle cx="13" cy="13" r=".6" fill="'+CREAM+'"/>';}
 else if(key==='candy_cane'){s=14;i='<rect width="14" height="14" fill="'+CREAM+'"/><rect width="5" height="14" fill="'+P.cherry+'"/><rect x="7" width="1.2" height="14" fill="'+P.pink+'"/>';tr.push('rotate(40)');}
 else {s=40;const dk=mix(P.baby,INK,.35);i=ging(s,10,P.cherry,CREAM)+motif(15,15,P.baby,dk,-15)+motif(35,34,P.baby,dk,12);}
 const t=tr.length?` patternTransform="${tr.join(' ')}"`:'';
 return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${s}" height="${s}"${t}>${i}</pattern>`;
}
function fit(name){const W=38,k=.62;let s=String(name||'').trim()||'you',fs=13;if(s.length*k*fs>W)fs=Math.max(10,W/(s.length*k));if(s.length*k*fs>W){while(s.length>1&&(s.length+1)*k*10>W)s=s.slice(0,-1);s+='…';}return {s,fs:+fs.toFixed(1)};}
const star=(cx,cy,R)=>{let p='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?R*.45:R;p+=(i?'L':'M')+(cx+q*Math.cos(a)).toFixed(1)+','+(cy+q*Math.sin(a)).toFixed(1);}return p+'Z';};
const POSE={
 r2:{all:{t:'rotate(-5 180 140)'},endL:{t:'rotate(6 108 100) '+sAt(108,100,1.12,1.32)},endR:{t:'rotate(-6 252 100) '+sAt(252,100,1.12,1.32)},bowL:{t:'translate(-20,-24) rotate(-32 101 99)',o:.95},bowR:{t:'translate(24,-30) rotate(36 259 99)',o:.95}},
 r3:{body:{t:sAt(180,147,1.28,.28),o:.5},endL:{t:'translate(-38,40) '+sAt(108,100,1.15,.42),o:.42},endR:{t:'translate(38,40) '+sAt(252,100,1.15,.42),o:.42},bowL:{t:'translate(-74,-86) rotate(-80 101 99)',o:.22},bowR:{t:'translate(82,-96) rotate(92 259 99)',o:.22},label:{t:'translate(0,-118) rotate(-18 180 100) '+sAt(180,100,1.45,1.45)},sh:{o:.55}},
 flat:{body:{t:sAt(180,147,1.3,.22),o:.9},endL:{t:'translate(-28,38) '+sAt(108,100,1.05,.3),o:.85},endR:{t:'translate(28,38) '+sAt(252,100,1.05,.3),o:.85},bowL:{o:0},bowR:{o:0},label:{o:0},sh:{o:.6}},
 melt:{body:{t:sAt(180,147,1.12,.68)},endL:{t:'translate(0,15) rotate(-30 106 100)'},endR:{t:'translate(0,15) rotate(30 254 100)'},bowL:{t:'translate(2,16) rotate(-38 101 99)'},bowR:{t:'translate(-2,16) rotate(40 259 99)'},label:{t:'translate(8,22) rotate(16 180 100) '+sAt(180,100,1,.86)}}
};
const CROP={body:'94 48 172 104',endL:'16 54 100 92',endR:'244 50 104 96',bowL:'62 74 72 92',bowR:'242 52 80 116',label:'146 62 68 76'};
function candy(o){return hand(candy0(o));}
function candy0(o){
 o=o||{};
 const fk=FABRICS.concat(FABRIC_ALTS).some(f=>f.key===o.fab)?o.fab:'cherry_print',rk=RIB[o.rib]?o.rib:'blue_stitch',r=RIB[rk];
 const SG=SH[o.shape]||{},bx=SG.bx||1,by=SG.by||1,ex=SG.ex||1,ey=SG.ey||1,dx=79*(1-bx),lift=by>1?(147-100)*(by-1):0;
 const bP=p=>bx===1&&by===1?p:mapP(p,(x,y)=>[180+(x-180)*bx,100+(y-100)*by]);
 const eL=p=>mapP(p,(x,y)=>[108+(x-108)*ex+dx,100+(y-100)*ey]),eR=p=>mapP(p,(x,y)=>[252+(x-252)*ex-dx,100+(y-100)*ey]);
 const LE=SG.pink?PINK.L:LEND,LL=SG.pink?PINK.LIP:LLIP,LFo=SG.twist?LF+' '+TWL:LF;
 const u='sw'+(UID++)+'_',pose=o.pose||'',PO=POSE[pose]||{},anim=pose==='anim',only=o.only||'',ls=o.labelScale||1;
 const d=`<filter id="${u}nz" filterUnits="userSpaceOnUse" x="0" y="0" width="160" height="160"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .17 0 0 0 0 .07 0 0 0 1.4 -.62"/></filter><pattern id="${u}gr" patternUnits="userSpaceOnUse" width="160" height="160"><rect width="160" height="160" filter="url(#${u}nz)"/></pattern>`+fab(u+'fb',fk,0)+fab(u+'fl',fk,14)+fab(u+'fr',fk,-12)+`<linearGradient id="${u}el" x1="1" x2="0"><stop offset=".3" stop-color="${BROWN}" stop-opacity=".26"/><stop offset=".3" stop-color="${BROWN}" stop-opacity="0"/></linearGradient><linearGradient id="${u}er" x1="0" x2="1"><stop offset=".3" stop-color="${BROWN}" stop-opacity=".26"/><stop offset=".3" stop-color="${BROWN}" stop-opacity="0"/></linearGradient><filter id="${u}b3" x="-30%" y="-400%" width="160%" height="900%"><feGaussianBlur stdDeviation="3.4"/></filter><filter id="${u}b1" x="-30%" y="-400%" width="160%" height="900%"><feGaussianBlur stdDeviation="1.3"/></filter>`;
 const S=` stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"`;
 const ln=(p,op,w)=>`<path d="${p}" fill="none" stroke="${INK}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
 const gr=p=>`<path d="${p}" fill="url(#${u}gr)" opacity=".6"/>`;
 const an=k=>anim?` style="transform-box:fill-box;transform-origin:${k==='all'?'50% 90%':'center'};animation:sw-${k} ${o.dur||1.5}s ease-in-out forwards"`:'';
 const G=(k,inner)=>{if(only&&only!==k)return '';const p=PO[k]||{};let a='';if(p.t&&!only)a+=` transform="${p.t}"`;if(p.o!=null&&!only)a+=` opacity="${p.o}"`;return `<g data-l="${k}"${a}${an(k)}>${inner}</g>`;};
 const end=(k,p,fp,fd,lip,folds)=>G(k,`${o.ruffle?`<path d="${p}" transform="translate(${k==='endL'?-5:5},5)" fill="url(#${u}${fp})"/><path d="${p}" transform="translate(${k==='endL'?-5:5},5)" fill="${BROWN}" opacity=".3"/><path d="${p}" transform="translate(${k==='endL'?-5:5},5)" fill="none"${S}/>`:''}<path d="${p}" fill="url(#${u}${fp})"/><path d="${p}" fill="url(#${u}${fd})"/>${ln(folds,.5,1.1)}${ln(lip,.55,1)}${gr(p)}<path d="${p}" fill="none"${S}/>`);
 const body=o.box?G('body',`<path d="${BOXT}" fill="url(#${u}fb)"/><path d="${BOXT}" fill="#FFFDF6" opacity=".42"/><path d="${BOXF}" fill="url(#${u}fb)"/><path d="${BOXSH}" fill="${BROWN}" opacity=".22"/><path d="M103,70 V140 Q103,148 111,148 H114 V62 H111 Q103,62 103,70Z" fill="${BROWN}" opacity=".16"/><path d="M257,70 V140 Q257,148 249,148 H246 V62 H249 Q257,62 257,70Z" fill="${BROWN}" opacity=".22"/><path d="M103,62 H257 V68 H103Z" fill="${BROWN}" opacity=".12"/>${ln(BOXPL,.5,1.1)}<path d="${BOXSEAM}" fill="none" stroke="${BROWN}" stroke-opacity=".3" stroke-width="2.4" transform="translate(0,2)"/><path d="${BOXSEAM}" fill="none" stroke="#FFFDF6" stroke-opacity=".9" stroke-width="1.4"/>${ln(BOXSEAM,.55,1)}${gr(BOXF)}${gr(BOXT)}<path d="${BOXT}" fill="none"${S}/><path d="${BOXF}" fill="none"${S}/>`):G('body',`<path d="${bP(BODY)}" fill="url(#${u}fb)"/><path d="${bP(BSH)}" fill="${BROWN}" opacity=".22"/><path d="${bP(LCAP)}" fill="${BROWN}" opacity=".2"/><path d="${bP(RCAP)}" fill="${BROWN}" opacity=".26"/><path d="${bP(HL)}" fill="#FFFDF6" opacity=".9"/>${ln(bP(WR),.5,1.1)}${gr(bP(BODY))}<path d="${bP(BODY)}" fill="none"${S}/>`);
 const f=fit(o.name);
 const label=G('label',`<g transform="translate(180,${o.box?106:100}) rotate(-3) scale(${ls*(o.box?1.18:1)})">${stickerBody(o.sticker,o.name)}</g>`);
 const rp=p=>ribPaint(p,r,r.w);
 const knot=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="${r.w*.8+.6}" ry="${r.w+.6}" fill="${r.base}" stroke="${INK}" stroke-width="1.5"/>`;
 const bs=(x,y,s)=>{const k=(o.ruffle?1.28:1)*(SG.bw||1),tx=x<180?dx:-dx;return k===1&&!tx?s:`<g transform="translate(${x+tx},${y}) scale(${k}) translate(${-x},${-y})">${s}</g>`;};
 const bowL=G('bowL',bs(101,99,rp('M101,89 Q106,100 101,111')+rp('M100,101 C95,116 86,126 88,140 C90,150 82,158 73,160')+rp('M102,102 C108,116 114,124 111,137 C108,147 115,153 123,154')+rp('M100,99 C92,86 80,82 79,89 C78,96 90,100 100,99')+knot(101,99)));
 const bowR=G('bowR',bs(259,99,rp('M259,89 Q254,100 259,111')+rp('M260,101 C266,120 282,126 287,143 C290,155 301,160 310,156')+rp('M259,98 C264,86 258,76 265,66 C269,60 277,60 279,66')+rp('M260,99 C268,84 284,80 285,90 C286,98 272,100 260,99')+knot(259,99)));
 let pre='',post='',extra='';
 if(pose==='melt'){
  pre=`<path d="${PUD}" fill="url(#${u}fb)"/><path d="${PUD}" fill="${BROWN}" opacity=".2"/><path d="${PUD}" fill="none"${S}/>`;
  post=[[140,144,156],[198,145,163],[230,142,153]].map(([x,y0,y1])=>{const fp=`M${x-4.5},${y0} C${x-4.5},${y1-5} ${x-3},${y1} ${x},${y1} C${x+3},${y1} ${x+4.5},${y1-5} ${x+4.5},${y0}`;return `<path d="${fp}Z" fill="url(#${u}fb)"/><path d="${fp}Z" fill="${BROWN}" opacity=".22"/><path d="${fp}" fill="none"${S}/>`;}).join('');
 }
 if(pose==='r2')extra=`<path d="M40,58 q-9,10 0,20 M28,50 q-14,18 0,36 M320,58 q9,10 0,20 M332,50 q14,18 0,36" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`;
 if(pose==='r3')extra=`<path d="M124,-40 A56,56 0 0 1 150,-68 M236,4 A56,56 0 0 1 210,32" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`;
 const sh=only?'':`<g data-l="sh"${PO.sh&&PO.sh.o!=null?` opacity="${PO.sh.o}"`:''}${anim?` style="animation:sw-sh ${o.dur||1.5}s ease forwards"`:''}><ellipse cx="180" cy="150" rx="${pose==='melt'?132:112}" ry="7" fill="${BROWN}" opacity=".32" filter="url(#${u}b3)"/><ellipse cx="180" cy="149" rx="${pose==='melt'?114:84}" ry="2.6" fill="${BROWN}" opacity=".3" filter="url(#${u}b1)"/></g>`;
 const all=PO.all||lift?` transform="${lift?`translate(0,${-lift}) `:''}${PO.all?PO.all.t:''}"`:'';
 const vb=only?CROP[only]:'0 0 360 200';
 return `<svg viewBox="${vb}" width="100%"${only?' height="100%"':''} style="display:block;overflow:visible"><defs>${d}</defs>${sh}<g${all}${an('all')}>${pre}${o.ruffle?end('endL',LENDR,'fl','el',LLIPR,LFR)+end('endR',RENDR,'fr','er',RLIPR,RFR):end('endL',eL(LE),'fl','el',eL(LL),eL(LFo))+end('endR',eR(mir(LE)),'fr','er',eR(mir(LL)),eR(mir(LFo)))}${body}${post}${label}${bowL}${bowR}</g>${extra}</svg>`;
}
function fabricSwatch(k){const u='fs'+(UID++);return `<svg viewBox="0 0 70 70" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block"><defs>${fab(u,k,0,k==='red_gingham'?.8:1)}</defs><rect width="70" height="70" fill="url(#${u})"/></svg>`;}
function ribbonSwatch(k){return hand(ribbonSwatch0(k));}
function ribbonSwatch0(k){const r=RIB[k]||RIB.blue_stitch,w=r.w*1.8,p='M8,42 C20,22 36,46 50,30 C60,18 76,18 84,30 C90,40 84,50 76,46 C70,43 72,36 78,36';
 return '<svg viewBox="0 0 96 64" width="100%" height="100%" style="display:block;overflow:visible">'+ribPaint(p,r,w,1.2)+'</svg>';}
function confetti(o){return hand(confetti0(o));}
function confetti0(o){
 const R=rnd(o.seed||7),cols=[P.cherry,P.pink,P.olive,P.baby,P.blush,P.butter,P.dusty,P.navy];let s='';
 const piece=(el,ang,dist)=>{const dx=Math.cos(ang)*dist,dy=Math.sin(ang)*dist*.9,rot=Math.round(R()*540-270);
  if(o.anim){const dl=((o.delay||0)+R()*.18).toFixed(2);return `<g transform="translate(${o.cx},${o.cy})"><g style="--dx:${dx.toFixed(1)}px;--dy:${dy.toFixed(1)}px;--r:${rot}deg;animation:sw-conf ${o.dur||1}s cubic-bezier(.15,.75,.3,1) ${dl}s both">${el}</g></g>`;}
  return `<g transform="translate(${(o.cx+dx).toFixed(1)},${(o.cy+dy).toFixed(1)}) rotate(${rot})">${el}</g>`;};
 for(let i=0;i<o.n;i++){const c=cols[i%cols.length],t=i%3;
  const el=t===0?`<rect x="-6" y="-3" width="12" height="6" rx="1" fill="${c}" stroke="${INK}" stroke-width="1"/>`:t===1?`<circle r="3.6" fill="${c}" stroke="${INK}" stroke-width="1"/>`:`<path d="M-8,0 q4,-5 8,0 t8,0" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="M-8,0 q4,-5 8,0 t8,0" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`;
  s+=piece(el,-Math.PI/2+(R()-.5)*Math.PI*1.9,o.min+R()*(o.spread-o.min));}
 for(let i=0;i<(o.stars||0);i++){const Rr=6+R()*7;const el=`<path d="${star(0,0,Rr)}" fill="${P.gold}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/><path d="${star(-Rr*.15,-Rr*.2,Rr*.35)}" fill="${mix(P.gold,'#ffffff',.55)}"/>`;
  s+=piece(el,-Math.PI/2+(R()-.5)*Math.PI*1.5,o.min*.8+R()*(o.spread*.85-o.min*.8));}
 return `<svg width="${o.w}" height="${o.h}" viewBox="0 0 ${o.w} ${o.h}" style="position:absolute;left:0;top:0;pointer-events:none;overflow:visible">${s}</svg>`;
}

const CARDS=[{key:'card_1',name:'Heart'},{key:'card_2',name:'Airmail'},{key:'card_3',name:'Recipe card'},{key:'card_4',name:'Gilt frame'}];
const rr=(x,y,w,h,r)=>{r=Math.max(0,Math.min(r,w/2,h/2));return 'M'+(x+r)+','+y+'H'+(x+w-r)+'A'+r+','+r+' 0 0 1 '+(x+w)+','+(y+r)+'V'+(y+h-r)+'A'+r+','+r+' 0 0 1 '+(x+w-r)+','+(y+h)+'H'+(x+r)+'A'+r+','+r+' 0 0 1 '+x+','+(y+h-r)+'V'+(y+r)+'A'+r+','+r+' 0 0 1 '+(x+r)+','+y+'Z';};
const notch=(x,y,w,h,r)=>'M'+(x+r)+','+y+'H'+(x+w-r)+'A'+r+','+r+' 0 0 0 '+(x+w)+','+(y+r)+'V'+(y+h-r)+'A'+r+','+r+' 0 0 0 '+(x+w-r)+','+(y+h)+'H'+(x+r)+'A'+r+','+r+' 0 0 0 '+x+','+(y+h-r)+'V'+(y+r)+'A'+r+','+r+' 0 0 0 '+(x+r)+','+y+'Z';
function scal(x,y,w,h,s){const nx=Math.max(3,Math.round(w/s)),ny=Math.max(2,Math.round(h/s)),dx=+(w/nx).toFixed(2),dy=+(h/ny).toFixed(2),a=dx/2,b=dy/2;let p='M'+x+','+y;for(let i=0;i<nx;i++)p+='a'+a+','+a+' 0 0 1 '+dx+',0';for(let i=0;i<ny;i++)p+='a'+b+','+b+' 0 0 1 0,'+dy;for(let i=0;i<nx;i++)p+='a'+a+','+a+' 0 0 1 -'+dx+',0';for(let i=0;i<ny;i++)p+='a'+b+','+b+' 0 0 1 0,-'+dy;return p+'Z';}
const paperDefs=u=>'<filter id="'+u+'nz" filterUnits="userSpaceOnUse" x="0" y="0" width="160" height="160"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="11"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .17 0 0 0 0 .07 0 0 0 1.4 -.62"/></filter><pattern id="'+u+'gr" patternUnits="userSpaceOnUse" width="160" height="160"><rect width="160" height="160" filter="url(#'+u+'nz)"/></pattern><linearGradient id="'+u+'sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFDF6" stop-opacity=".5"/><stop offset=".32" stop-color="#FFFDF6" stop-opacity="0"/><stop offset=".68" stop-color="'+BROWN+'" stop-opacity="0"/><stop offset="1" stop-color="'+BROWN+'" stop-opacity=".22"/></linearGradient>';

const hp=(x,y,w,h)=>{const q=(a,b)=>(x+a*w).toFixed(1)+','+(y+b*h).toFixed(1);return 'M'+q(.5,.2)+'C'+q(.44,.04)+' '+q(.28,-.01)+' '+q(.16,.03)+'C'+q(.03,.08)+' '+q(-.01,.24)+' '+q(.02,.37)+'C'+q(.06,.57)+' '+q(.3,.77)+' '+q(.5,.99)+'C'+q(.7,.77)+' '+q(.94,.57)+' '+q(.98,.37)+'C'+q(1.01,.24)+' '+q(.97,.08)+' '+q(.84,.03)+'C'+q(.72,-.01)+' '+q(.56,.04)+' '+q(.5,.2)+'Z';};
function heartGeo(w,h,sw){
 const s=Math.max(2.6,w*.028),x=s+1,y=s+1,W=w-2*s-2,H=h-2*s-2,k=w/274,outer=hp(x,y,W,H),rf=mix(CREAM,P.blush,.4);
 const ruffle='<path d="'+outer+'" fill="none" stroke="'+INK+'" stroke-width="'+(2*s+sw*1.1)+'" stroke-dasharray="0 '+(s*1.5).toFixed(2)+'" stroke-linecap="round"/><path d="'+outer+'" fill="none" stroke="'+rf+'" stroke-width="'+(2*s)+'" stroke-dasharray="0 '+(s*1.5).toFixed(2)+'" stroke-linecap="round"/><path d="'+outer+'" fill="none" stroke="'+rf+'" stroke-width="'+(s*1.1)+'"/>';
 const by=y+H*.2,bow='<g transform="translate('+(w/2)+','+(by+3*k)+') scale('+(k*1.35)+')"><path d="M-1,1 C-4,5 -7,8 -10,10 M1,1 C4,5 7,8 10,10" fill="none" stroke="'+INK+'" stroke-width="'+(sw*1.6/k)+'" stroke-linecap="round"/><path d="M-1,1 C-4,5 -7,8 -10,10 M1,1 C4,5 7,8 10,10" fill="none" stroke="'+P.pink+'" stroke-width="'+(sw*.7/k)+'" stroke-linecap="round"/><path d="M0,0 C-6,-9 -19,-11 -19,-3 C-19,5 -7,4 0,0Z M0,0 C6,-9 19,-11 19,-3 C19,5 7,4 0,0Z" fill="'+P.pink+'" stroke="'+INK+'" stroke-width="'+(sw*.55/k)+'" stroke-linejoin="round"/><path d="M-4,-2 C-9,-5 -14,-5 -15,-2 M4,-2 C9,-5 14,-5 15,-2" fill="none" stroke="'+INK+'" stroke-opacity=".4" stroke-width="'+(sw*.35/k)+'"/><ellipse rx="3.2" ry="3.6" fill="'+P.pink+'" stroke="'+INK+'" stroke-width="'+(sw*.55/k)+'"/></g>';
 const sprig=(sx,sy,m)=>'<g transform="translate('+sx+','+sy+') scale('+(m*k)+','+k+')"><path d="M0,0 C1,10 4,20 10,30" fill="none" stroke="'+INK+'" stroke-opacity=".7" stroke-width="'+(sw*.4/k)+'"/>'+[[1.5,9,-40],[4,17,-30],[7,24,-20]].map(([a,b,r])=>'<ellipse cx="'+(a+3)+'" cy="'+b+'" rx="3.2" ry="1.6" transform="rotate('+r+' '+(a+3)+' '+b+')" fill="'+P.olive+'"/><ellipse cx="'+(a-2.5)+'" cy="'+(b+2)+'" rx="2.8" ry="1.4" transform="rotate('+(-r-10)+' '+(a-2.5)+' '+(b+2)+')" fill="'+mix(P.olive,CREAM,.25)+'"/>').join('')+'<circle cx="0" cy="-1" r="2.4" fill="'+P.cherry+'" stroke="'+INK+'" stroke-width="'+(sw*.3/k)+'"/></g>';
 const mh=(cx,cy,r)=>'<path d="M'+cx+','+(cy+r*.9)+' C'+(cx-r*1.4)+','+(cy-r*.1)+' '+(cx-r*.7)+','+(cy-r*1.2)+' '+cx+','+(cy-r*.35)+' C'+(cx+r*.7)+','+(cy-r*1.2)+' '+(cx+r*1.4)+','+(cy-r*.1)+' '+cx+','+(cy+r*.9)+'Z" fill="'+P.pink+'" stroke="'+INK+'" stroke-width="'+(sw*.45)+'"/>';
 const inner='<path d="'+hp(x+W*.06,y+H*.07,W*.88,H*.86)+'" fill="none" stroke="'+INK+'" stroke-opacity=".5" stroke-width="'+(sw*.45)+'" stroke-dasharray="'+(sw*2.2)+' '+(sw*1.7)+'"/>'+mh(w/2,y+H*.86,4.5*k)+bow;
 return{outer,fill:CREAM,pre:ruffle,inner,line:[.55,.7],pad:[Math.max(h*.3,(h*.2+24*w/274)),w*.2,h*.22,w*.2],shW:.22};
}

function card2alt(st,w,h,sw){
 const id='cg'+(UID++),r=Math.min(h/2-1,w*.2),i=Math.max(4,w*.028);
 if(st==='card_2a'){const b=Math.max(7,w*.045),rr2=Math.max(4,w*.035);
  const pre='<defs><pattern id="'+id+'" patternUnits="userSpaceOnUse" width="18" height="18" patternTransform="rotate(45)"><rect width="18" height="18" fill="'+CREAM+'"/><rect width="6" height="18" fill="'+P.cherry+'"/><rect x="9" width="6" height="18" fill="#A7C3E8"/></pattern></defs>';
  return{outer:rr(1,1,w-2,h-2,rr2),fill:'url(#'+id+')',pre,inner:'<path d="'+rr(b,b,w-2*b,h-2*b,2)+'" fill="'+CREAM+'" stroke="'+INK+'" stroke-width="'+(sw*.6)+'"/><path d="'+rr(b+sw*2.2,b+sw*2.2,w-2*b-sw*4.4,h-2*b-sw*4.4,1)+'" fill="none" stroke="'+INK+'" stroke-opacity=".35" stroke-width="'+(sw*.4)+'"/>',pad:[b+12,b+14]};}
 if(st==='card_2b'){const hb=Math.max(6,h*.14),mx=w*.11;let rules='';for(let y=hb+h*.2;y<h-6;y+=h*.135)rules+='M'+(sw*2)+','+y.toFixed(1)+'H'+(w-sw*2);
  return{outer:rr(1,1,w-2,h-2,Math.max(3,w*.02)),fill:CREAM,inner:'<path d="M1,'+hb+'H'+(w-1)+'V1H1Z" fill="none"/><rect x="1.5" y="1.5" width="'+(w-3)+'" height="'+hb+'" fill="'+mix(CREAM,P.pink,.55)+'"/><path d="M1,'+(hb+1.5)+'H'+(w-1)+'" stroke="'+INK+'" stroke-width="'+(sw*.55)+'"/><path d="'+rules+'" stroke="#A7C3E8" stroke-width="'+(sw*.5)+'"/><path d="M'+mx+','+(hb+2)+'V'+(h-2)+'" stroke="'+P.cherry+'" stroke-opacity=".55" stroke-width="'+(sw*.5)+'"/>',pad:[mx+8,hb+8]};}
 if(st==='card_2c'){const b=Math.max(8,w*.055),c=Math.max(4,w*.022);
  const pre='<defs><pattern id="'+id+'" patternUnits="userSpaceOnUse" width="'+(c*2)+'" height="'+(c*2)+'"><rect width="'+(c*2)+'" height="'+(c*2)+'" fill="'+CREAM+'"/><rect width="'+c+'" height="'+(c*2)+'" fill="'+P.pink+'" opacity=".6"/><rect width="'+(c*2)+'" height="'+c+'" fill="'+P.pink+'" opacity=".6"/></pattern></defs>';
  return{outer:rr(1,1,w-2,h-2,Math.max(5,w*.06)),fill:'url(#'+id+')',pre,inner:'<path d="'+rr(b,b,w-2*b,h-2*b,Math.max(3,w*.03))+'" fill="'+CREAM+'" stroke="'+INK+'" stroke-width="'+(sw*.6)+'"/>',pad:[b+12,b+11]};}
 const blue='#B9CCE0';
 return{outer:rr(1,1,w-2,h-2,r),fill:blue,inner:'<path d="'+rr(i,i,w-2*i,h-2*i,r-i+1)+'" fill="none" stroke="'+CREAM+'" stroke-width="'+(sw*1.1)+'"/><path d="'+rr(i*1.8,i*1.8,w-3.6*i,h-3.6*i,r-i*1.8+1)+'" fill="none" stroke="'+INK+'" stroke-opacity=".4" stroke-width="'+(sw*.4)+'" stroke-dasharray="'+(sw*1.6)+' '+(sw*1.4)+'"/>',pad:[r*.42+i*1.8+10,i*1.8+12]};
}
function cardGeo(st,w,h,sw){
 if(/^card_2[a-d]$/.test(st))return card2alt(st,w,h,sw);
 if(st==='card_2')return card2alt('card_2a',w,h,sw);
 if(st==='card_3')return card2alt('card_2b',w,h,sw);
 if(st==='card_1')return heartGeo(w,h,sw);
 if(st==='card_2'){const r=Math.min(h/2-1,w*.2),i=Math.max(4,w*.028);return{outer:rr(1,1,w-2,h-2,r),fill:P.butter,inner:'<path d="'+rr(i,i,w-2*i,h-2*i,r-i+1)+'" fill="none" stroke="'+P.gold+'" stroke-width="'+(sw*.9)+'"/><path d="'+rr(i*1.8,i*1.8,w-3.6*i,h-3.6*i,r-i*1.8+1)+'" fill="none" stroke="'+INK+'" stroke-opacity=".4" stroke-width="'+(sw*.4)+'"/>',pad:[r*.42+i*1.8+10,i*1.8+12]};}
 if(st==='card_3'){const s=Math.max(7,w*.05),i=s*1.25;return{outer:scal(s/2+1,s/2+1,w-s-2,h-s-2,s),fill:P.pink,inner:'<path d="'+rr(i,i,w-2*i,h-2*i,3)+'" fill="'+CREAM+'" stroke="'+INK+'" stroke-width="'+(sw*.55)+'"/><path d="'+rr(i+sw*2,i+sw*2,w-2*i-sw*4,h-2*i-sw*4,2)+'" fill="none" stroke="'+INK+'" stroke-opacity=".45" stroke-width="'+(sw*.4)+'" stroke-dasharray="'+(sw*1.6)+' '+(sw*1.4)+'"/>',pad:[i+12,i+10]};}
 if(st==='card_4'){const r=Math.max(5,w*.07),i=Math.max(3.5,w*.026),d=Math.max(2.5,w*.014);const dm=(x,y)=>'<path d="M'+x+','+(y-d)+' L'+(x+d)+','+y+' L'+x+','+(y+d)+' L'+(x-d)+','+y+'Z" fill="'+P.gold+'" stroke="'+INK+'" stroke-width="'+(sw*.4)+'"/>';return{outer:notch(1,1,w-2,h-2,r),fill:CREAM,inner:'<path d="'+notch(i,i,w-2*i,h-2*i,r)+'" fill="none" stroke="'+P.baby+'" stroke-width="'+(sw*1.7)+'"/><path d="'+notch(i+sw*1.4,i+sw*1.4,w-2*i-sw*2.8,h-2*i-sw*2.8,r)+'" fill="none" stroke="'+INK+'" stroke-opacity=".45" stroke-width="'+(sw*.4)+'"/>'+dm(w/2,i)+dm(w/2,h-i),pad:[r+i+8,r*.5+i+12]};}
 const m=Math.max(5,w*.05);return{outer:rr(1,1,w-2,h-2,Math.max(3,w*.03)),fill:P.blush,inner:'<path d="'+rr(m,m,w-2*m,h-2*m,3)+'" fill="'+CREAM+'" stroke="'+INK+'" stroke-width="'+(sw*.55)+'"/>'+[[m*.5,m*.5],[w-m*.5,m*.5],[m*.5,h-m*.5],[w-m*.5,h-m*.5]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="'+Math.max(1.2,m*.16)+'" fill="'+P.gold+'" stroke="'+INK+'" stroke-width="'+(sw*.35)+'"/>').join(''),pad:[m+14,m+12]};
}
function cardPad(st,w,h){const p=cardGeo(st,w,h,2).pad;return p.length===4?p:[p[1],p[0],p[1],p[0]];}
function noteCard(o){return hand(noteCard0(o));}
function noteCard0(o){const st=o.style||'card_1',w=o.w,h=o.h,sw=o.sw||(w<120?1.2:2),u='nc'+(UID++)+'_',g=cardGeo(st,w,h,sw);
 const sh=o.shadow?'<ellipse cx="'+w/2+'" cy="'+(h+1)+'" rx="'+(w*(g.shW||.47))+'" ry="'+Math.max(3,h*.03)+'" fill="'+BROWN+'" opacity=".34" filter="url(#'+u+'b)"/><ellipse cx="'+w/2+'" cy="'+h+'" rx="'+(w*(g.shW?g.shW*.7:.42))+'" ry="1.8" fill="'+BROWN+'" opacity=".4" filter="url(#'+u+'b1)"/>':'';
 return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" style="display:block;overflow:visible"><defs>'+paperDefs(u)+'<filter id="'+u+'b" x="-20%" y="-400%" width="140%" height="900%"><feGaussianBlur stdDeviation="3.2"/></filter><filter id="'+u+'b1" x="-20%" y="-400%" width="140%" height="900%"><feGaussianBlur stdDeviation="1.1"/></filter></defs>'+sh+(g.pre||'')+'<path d="'+g.outer+'" fill="'+g.fill+'"/>'+g.inner+'<path d="'+g.outer+'" fill="url(#'+u+'sh)"/><path d="'+g.outer+'" fill="url(#'+u+'gr)" opacity=".5"/><path d="'+g.outer+'" fill="none" stroke="'+INK+'" stroke-opacity="'+(g.line?g.line[0]:1)+'" stroke-width="'+(g.line?sw*g.line[1]:sw)+'" stroke-linejoin="round"/></svg>';}
function linkTag(host){return hand(linkTag0(host));}
function linkTag0(host){const u='lt'+(UID++)+'_';host=String(host||'').replace(/^www\./,'');if(host.length>13)host=host.slice(0,12)+'…';
 const tg='M-22,8 L-10,-4 H10 L22,8 V80 Q22,84 18,84 H-18 Q-22,84 -22,80Z',str='M14,10 C26,32 40,30 59,52';
 return '<svg width="100" height="150" viewBox="0 0 100 150" style="display:block;overflow:visible"><defs>'+paperDefs(u)+'</defs><g transform="translate(60,46) rotate(9)"><path d="'+tg+'" fill="'+P.baby+'"/><path d="'+tg+'" fill="url(#'+u+'sh)"/><path d="'+tg+'" fill="url(#'+u+'gr)" opacity=".5"/><path d="M-17,12 L-7,2 H7 L17,12 V78 H-17Z" fill="none" stroke="'+CREAM+'" stroke-width="1.2" stroke-dasharray="3 2.5"/><path d="'+tg+'" fill="none" stroke="'+INK+'" stroke-width="1.8" stroke-linejoin="round"/><circle cy="6" r="3.8" fill="'+CREAM+'" stroke="'+P.gold+'" stroke-width="1.8"/><circle cy="6" r="3.8" fill="none" stroke="'+INK+'" stroke-width=".9"/><text y="32" text-anchor="middle" font-family="Work Sans" font-weight="700" font-size="9" letter-spacing="1.6" fill="'+INK+'">LINK</text><g transform="translate(0,48) rotate(-35)" fill="none" stroke="'+INK+'" stroke-width="1.8"><rect x="-10" y="-3.6" width="11" height="7.2" rx="3.6"/><rect x="-1" y="-3.6" width="11" height="7.2" rx="3.6"/></g><text y="69" text-anchor="middle" font-family="Work Sans" font-weight="600" font-size="6" fill="'+INK+'">'+esc(host||'a link')+'</text></g><path d="'+str+'" fill="none" stroke="'+INK+'" stroke-width="2.8" stroke-linecap="round"/><path d="'+str+'" fill="none" stroke="'+P.cherry+'" stroke-width="1.3" stroke-linecap="round"/><circle cx="14" cy="10" r="4.6" fill="'+CREAM+'" stroke="'+INK+'" stroke-width="1.4"/><circle cx="14" cy="10" r="1.8" fill="'+INK+'"/></svg>';}
window.SweetCandy={SHAPES,STICKERS,stickerSwatch,P,INK,CREAM,FABRICS,FABRIC_ALTS,RIBBONS,RIBBON_ALTS,CARDS,candy,fabricSwatch,ribbonSwatch,confetti,noteCard,cardPad,linkTag,hand,candyRaw:candy0};
})();
