(function(){
const INK='#783E19',CREAM='#FBF0DA',BROWN='#5A2A10',BG='#FCF7EF',BLUSH='#F0B8C0',PINK='#EBA3AE',GOLD='#C9A44A',EDGE='#E6D3B3',PEDGE='#D9939F';
const PI=Math.PI,f=n=>n.toFixed(1),pt=(r,a)=>f(r*Math.cos(a))+','+f(r*Math.sin(a));
let UID=0;
function scallop(R,n){let p='M'+pt(R,0);for(let i=0;i<n;i++){const a0=i/n*2*PI,a1=(i+1)/n*2*PI,c=R*Math.sin(PI/n);p+='A'+f(c)+','+f(c)+' 0 0 1 '+pt(R,a1);}return p+'Z';}
function petal(R,n){let p='M'+pt(R,0);for(let i=0;i<n;i++){const a0=i/n*2*PI,a1=(i+1)/n*2*PI,am=(a0+a1)/2;p+='Q'+pt(R*1.1,a0+(a1-a0)*.12)+' '+pt(R*1.11,am)+'Q'+pt(R*1.1,a1-(a1-a0)*.12)+' '+pt(R,a1);}return p+'Z';}
const NS=' vector-effect="non-scaling-stroke"';
const ring=(r,n,rad,fill,op)=>{let s='';for(let i=0;i<n;i++){const a=(i+.5)/n*2*PI;s+='<circle cx="'+f(r*Math.cos(a))+'" cy="'+f(r*Math.sin(a))+'" r="'+rad+'" fill="'+fill+'" stroke="'+INK+'" stroke-opacity="'+(op||.6)+'" stroke-width=".9"'+NS+'/>';}return s;};
const hearts=(r,n,s,fill)=>{let o='';for(let i=0;i<n;i++){const a=(i+.5)/n*2*PI,x=r*Math.cos(a),y=r*Math.sin(a),rot=a*180/PI+90;o+='<path transform="translate('+f(x)+','+f(y)+') rotate('+f(rot)+') scale('+s+')" d="M0,3 C-5,-1 -3,-5 0,-2.5 C3,-5 5,-1 0,3Z" fill="'+fill+'" stroke="'+INK+'" stroke-opacity=".6" stroke-width=".9"'+NS+'/>';}return o;};
const dash=(r,op,da)=>'<circle r="'+r+'" fill="none" stroke="'+INK+'" stroke-opacity="'+op+'" stroke-width=".9" stroke-dasharray="'+(da||'3 3')+'"'+NS+'/>';
const spokes=(r0,r1,n,op)=>{let p='';for(let i=0;i<n;i++){const a=i/n*2*PI;p+='M'+pt(r0,a)+'L'+pt(r1,a);}return '<path d="'+p+'" stroke="'+INK+'" stroke-opacity="'+op+'" stroke-width=".8"'+NS+'/>';};
function layer(u,path,fill,edge,inner){
 return '<path d="'+path+'" transform="translate(0,9)" fill="'+edge+'" stroke="'+INK+'" stroke-width="1.6"'+NS+'/>'+
  '<path d="'+path+'" fill="'+fill+'"/>'+inner+
  '<path d="'+path+'" fill="url(#'+u+'sh)"/><path d="'+path+'" fill="url(#'+u+'gr)" opacity=".55"/>'+
  '<path d="'+path+'" fill="none" stroke="'+INK+'" stroke-width="1.8" stroke-linejoin="round"'+NS+'/>';
}
function doily(v){
 const u='dl'+(UID++)+'_';let body='';
 if(v==='b'){const R=170;body=layer(u,petal(R,36),CREAM,EDGE,dash(R*.98,.45,'2 3')+ring(R*.86,36,4.2,BG)+'<circle r="'+R*.76+'" fill="none" stroke="'+INK+'" stroke-opacity=".5" stroke-width=".9"'+NS+'/>'+spokes(R*.62,R*.76,48,.35)+'<path d="'+scallop(R*.62,24)+'" fill="none" stroke="'+INK+'" stroke-opacity=".45" stroke-width=".9"'+NS+'/>'+ring(R*.5,18,3,BG,.45));}
 else if(v==='c'){const R=178;body=layer(u,scallop(R,30),BLUSH,PEDGE,ring(R*.9,30,3.6,BG)+hearts(R*.76,16,2.4,BG)+dash(R*.64,.5));}
 else if(v==='d'){const R=186,r=146;body=layer(u,scallop(R,32),BLUSH,PEDGE,ring(R*.9,32,3.4,BG))+'<g transform="translate(0,-10)">'+layer(u,petal(r,30),CREAM,EDGE,ring(r*.86,30,3.6,BG)+dash(r*.74,.45,'2 3'))+'</g>';}
 else {const R=176;body=layer(u,scallop(R,28),CREAM,EDGE,ring(R*.88,28,4.6,BG)+dash(R*.76,.5)+'<path d="'+scallop(R*.66,22)+'" fill="none" stroke="'+INK+'" stroke-opacity=".35" stroke-width=".9"'+NS+'/>');}
 const defs='<filter id="'+u+'nz" filterUnits="userSpaceOnUse" x="-200" y="-200" width="160" height="160"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .17 0 0 0 0 .07 0 0 0 1.4 -.62"/></filter><pattern id="'+u+'gr" patternUnits="userSpaceOnUse" x="-200" y="-200" width="160" height="160"><rect x="-200" y="-200" width="160" height="160" filter="url(#'+u+'nz)"/></pattern><radialGradient id="'+u+'sh" cx=".45" cy=".35" r=".7"><stop offset="0" stop-color="#FFFDF6" stop-opacity=".45"/><stop offset=".55" stop-color="#FFFDF6" stop-opacity="0"/><stop offset="1" stop-color="'+BROWN+'" stop-opacity=".16"/></radialGradient><filter id="'+u+'bl" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>';
 return '<svg viewBox="-200 -72 400 150" width="100%" style="display:block;overflow:visible"><defs>'+defs+'</defs><ellipse cx="4" cy="10" rx="186" ry="56" fill="'+BROWN+'" opacity=".16" filter="url(#'+u+'bl)"/><g transform="scale(1,.31)">'+body+'</g></svg>';
}

function kraftBox(part){
 const K='#D4AE6E',KD='#B48A4E',KL='#E2C48C',u='kb'+(UID++)+'_';
 const defs='<defs><filter id="'+u+'nz" filterUnits="userSpaceOnUse" x="0" y="0" width="160" height="160"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .17 0 0 0 0 .07 0 0 0 1.4 -.6"/></filter><pattern id="'+u+'gr" patternUnits="userSpaceOnUse" width="160" height="160"><rect width="160" height="160" filter="url(#'+u+'nz)"/></pattern><filter id="'+u+'bl" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="5"/></filter></defs>';
 const S=' stroke="'+INK+'" stroke-width="2" stroke-linejoin="round"';
 const sh=(p,c)=>'<path d="'+p+'" fill="'+c+'"/><path d="'+p+'" fill="url(#'+u+'gr)" opacity=".5"/><path d="'+p+'" fill="none"'+S+'/>';
 if(part==='back'){
  const tl='M40,270 C24,236 30,196 50,174 C58,160 74,170 82,156 C94,146 108,162 118,154 C132,150 136,170 146,180 C150,196 140,214 150,226 L96,282 Z';
  const tr='M350,270 C366,236 360,198 342,176 C334,160 318,170 308,158 C296,148 284,162 272,156 C258,152 254,172 244,182 C240,198 250,214 240,226 L294,282 Z';
  return '<svg viewBox="0 0 390 470" width="390" height="470" style="display:block;overflow:visible">'+defs+'<ellipse cx="196" cy="350" rx="176" ry="12" fill="'+BROWN+'" opacity=".28" filter="url(#'+u+'bl)"/>'+sh('M44,198 H346 L356,282 H34Z',KD)+'<path d="M44,198 L60,210 L62,282 L34,282Z M346,198 L330,210 L328,282 L356,282Z" fill="'+K+'" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/><path d="M60,210 H330" stroke="'+INK+'" stroke-opacity=".5" stroke-width="1.2"/>'+
   '<path d="'+tl+'" fill="'+BLUSH+'"/><path d="M58,182 Q78,214 74,262 M100,162 Q104,200 92,250 M128,170 Q120,206 116,240" fill="none" stroke="'+PINK+'" stroke-width="2.2" stroke-linecap="round"/><path d="'+tl+'" fill="url(#'+u+'gr)" opacity=".4"/><path d="'+tl+'" fill="none"'+S+'/>'+
   '<path d="'+tr+'" fill="'+BLUSH+'"/><path d="M332,184 Q312,214 316,262 M290,164 Q286,200 298,250 M262,172 Q270,206 274,240" fill="none" stroke="'+PINK+'" stroke-width="2.2" stroke-linecap="round"/><path d="'+tr+'" fill="url(#'+u+'gr)" opacity=".4"/><path d="'+tr+'" fill="none"'+S+'/></svg>';
 }
 return '<svg viewBox="0 0 390 470" width="390" height="470" style="display:block;overflow:visible">'+defs+sh('M34,282 H356 L350,348 H40Z',K)+'<path d="M35,282 H355 L354,291 H36Z" fill="'+KL+'" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M40,348 H350" stroke="'+BROWN+'" stroke-opacity=".3" stroke-width="3"/></svg>';
}
window.SweetDoily={doily,kraftBox};
})();
