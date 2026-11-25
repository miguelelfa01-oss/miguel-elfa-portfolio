(()=>{
 const key='miguel-quote-entry-v1',force=new URLSearchParams(location.search).has('entrance');
 let seen=false;try{seen=sessionStorage.getItem(key)==='seen'}catch{}
 if(seen&&!force)return;
 const entry=document.createElement('div');entry.className='quote-entry';entry.setAttribute('role','region');entry.setAttribute('aria-label','Opening quote');
 const japanese=document.createElement('p');japanese.className='quote-japanese';japanese.lang='ja';japanese.setAttribute('aria-label','継続は力なり');
 [...'継続は力なり'].forEach((glyph,i)=>{const span=document.createElement('span');span.className='quote-glyph';span.textContent=glyph;span.style.setProperty('--i',i);span.setAttribute('aria-hidden','true');japanese.append(span)});
 japanese.insertAdjacentHTML('beforeend','<span class="quote-complete" aria-hidden="true"><span>継続</span>は<em>力</em>なり</span>');entry.append(japanese);entry.insertAdjacentHTML('beforeend','<div class="quote-meaning"><p><span class="quote-phrase">Continuance</span> <span class="quote-phrase">is</span> <em class="quote-phrase">power.</em></p></div><span class="quote-signature" aria-label="Miguel Elfa"><span>MIGUEL</span><span>ELFA</span></span>');
 const echoes=document.createElement('div');echoes.className='quote-echoes';echoes.setAttribute('aria-hidden','true');
 ['left','right'].forEach(side=>{const edge=document.createElement('div');edge.className='quote-edge '+side;[...'継続は力なり'].forEach((glyph,i)=>{const beat=document.createElement('span');beat.textContent=glyph;beat.style.setProperty('--i',i);edge.append(beat)});echoes.append(edge)});entry.prepend(echoes);
 document.body.append(entry);document.body.classList.add('quote-entering');
 let closing=false;
 function finish(){if(closing)return;closing=true;clearTimeout(timer);try{sessionStorage.setItem(key,'seen')}catch{}const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const signature=entry.querySelector('.quote-signature'),target=document.querySelector('header .brand');
 if(!reduced&&target){const from=signature.getBoundingClientRect(),to=target.getBoundingClientRect();const font=getComputedStyle(signature);const size=parseFloat(font.fontSize);const endSize=parseFloat(getComputedStyle(target).fontSize);document.body.classList.add('quote-handoff');signature.classList.add('quote-signature-flight');signature.style.left=from.left+'px';signature.style.top=from.top+'px';signature.style.fontSize=size+'px';document.body.append(signature);signature.animate([{transform:'translate(0,0) scale(1)'},{transform:'translate('+(to.left+3-from.left)+'px,'+(to.top+5-from.top)+'px) scale('+(endSize/size)+')'}],{duration:550,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});setTimeout(()=>{signature.remove();document.body.classList.remove('quote-handoff')},560)}
 entry.classList.add('is-leaving');document.body.classList.remove('quote-entering');setTimeout(()=>entry.remove(),reduced?220:600);document.removeEventListener('keydown',escape)}
 function escape(event){if(event.key==='Escape')finish()}
 const timer=setTimeout(finish,2450);document.addEventListener('keydown',escape);
})();
