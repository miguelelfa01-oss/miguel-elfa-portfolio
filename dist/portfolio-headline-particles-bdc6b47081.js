// Hover-only particle rendering; the real headline remains the accessible source.
(()=>{
 const heading=document.querySelector('.opening h1'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 if(!heading)return;
 const canvas=document.createElement('canvas');canvas.className='headline-particles';canvas.setAttribute('aria-hidden','true');heading.append(canvas);
 const ctx=canvas.getContext('2d'),mask=document.createElement('canvas'),pen=mask.getContext('2d');let particles=[],pointer=null,frame=0,width=0,height=0;
 function build(){const bounds=heading.getBoundingClientRect();width=Math.ceil(bounds.width);height=Math.ceil(bounds.height);mask.width=width;mask.height=height;const ratio=devicePixelRatio||1;canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);pen.clearRect(0,0,width,height);pen.textBaseline='alphabetic';
 heading.querySelectorAll('.opening-line>span').forEach((line,index)=>{const style=getComputedStyle(line),node=line.firstChild;if(!node||node.nodeType!==Node.TEXT_NODE)return;pen.font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;pen.fillStyle=index?'#bd70ff':'#f2eff7';for(let i=0;i<node.length;i++){const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const rect=range.getBoundingClientRect(),metrics=pen.measureText(node.textContent[i]);const ascent=metrics.fontBoundingBoxAscent||parseFloat(style.fontSize)*.9,descent=metrics.fontBoundingBoxDescent||parseFloat(style.fontSize)*.2;pen.fillText(node.textContent[i],rect.left-bounds.left,rect.top-bounds.top+(rect.height-ascent-descent)/2+ascent);}});
 const data=pen.getImageData(0,0,width,height).data,step=3;particles=[];for(let y=0;y<height;y+=step)for(let x=0;x<width;x+=step){const i=(y*width+x)*4;if(data[i+3]>100)particles.push({x,y,dx:0,dy:0,color:'rgb('+data[i]+','+data[i+1]+','+data[i+2]+')'});}}
 function request(){if(!frame)frame=requestAnimationFrame(draw)}
 function draw(){frame=0;ctx.clearRect(0,0,width,height);let moving=false;for(const p of particles){let tx=0,ty=0;if(pointer){const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy);if(d<70){const f=(1-d/70)*25;tx=dx/(d||1)*f;ty=dy/(d||1)*f;}}p.dx+=(tx-p.dx)*.18;p.dy+=(ty-p.dy)*.18;if(Math.abs(tx-p.dx)+Math.abs(ty-p.dy)>.1)moving=true;ctx.fillStyle=p.color;ctx.fillRect(p.x+p.dx,p.y+p.dy,2.3,2.3);}if(moving)request();else if(!pointer)heading.classList.remove('particles-active');}
 function move(event){if(reduced.matches||!fine.matches)return;if(!heading.classList.contains('particles-active')){build();heading.classList.add('particles-active')}const r=heading.getBoundingClientRect();pointer={x:event.clientX-r.left,y:event.clientY-r.top};request();}
 heading.addEventListener('pointerenter',move);heading.addEventListener('pointermove',move);heading.addEventListener('pointerleave',()=>{pointer=null;request()});
 function reset(){pointer=null;heading.classList.remove('particles-active');if(frame)cancelAnimationFrame(frame);frame=0;}
 addEventListener('resize',reset);addEventListener('scroll',reset,{passive:true});reduced.addEventListener('change',reset);
})();
