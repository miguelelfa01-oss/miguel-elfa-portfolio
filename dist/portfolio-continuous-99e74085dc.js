// Local motion study: authored interface concept, not a functional AralLoop demo.
const model=document.createElement('div');
model.id='interface-model';
model.setAttribute('role','img');
model.setAttribute('aria-label','Illustrative AralLoop interface unfolding into question, answer-choice, and source-review layers. Not a working app demo.');
model.innerHTML=`<div class="model-origin" aria-hidden="true">
 <div class="interface-layer question-layer"><small>AralLoop / Practice concept</small><strong>Which organelle produces most of the ATP in a eukaryotic cell?</strong><p>Take a moment. Choose your answer.</p></div>
 <div class="interface-layer choices-layer"><div class="sample-choice">Nucleus</div><div class="sample-choice selected">Mitochondrion</div><div class="sample-choice">Golgi apparatus</div><small>Selection shown for illustration, not graded.</small></div>
 <div class="interface-layer source-layer"><small>After you try</small><strong>Back to your material.</strong><p>The source-review concept connects an explanation with the uploaded study material.</p><div class="source-rule"></div><p>No document is loaded in this visual study.</p></div>
 <span class="model-label">Interface motion study · Illustrative content</span>
</div>`;
document.querySelector('.visual-stage').prepend(model);
new ResizeObserver(()=>{model.style.setProperty('--fit',Math.min(model.clientWidth/780,model.clientHeight/580));}).observe(model);

const chapters=[...document.querySelectorAll('.chapter')],stage=document.querySelector('.visual-stage'),media=matchMedia('(prefers-reduced-motion: reduce)');
let queued=false;let textWipes=[];
function paint(){queued=false;const h=innerHeight;const featured=document.querySelector('.featured');const bounds=featured.getBoundingClientRect();const reveal=Math.max(0,Math.min(1,(h*.92-bounds.top)/(h*.42)));const travel=Math.max(-1,Math.min(1,(h*.4-bounds.top)/h));const r=chapters.map(s=>s.getBoundingClientRect());featured.style.setProperty('--featured-reveal',media.matches?1:reveal);featured.style.setProperty('--featured-travel',media.matches?0:travel);let active=0;r.forEach((v,i)=>{if(v.top<h*.55)active=i});const workStart=r[0].top,workEnd=r[2].top;const p=Math.max(0,Math.min(1,(h*.45-workStart)/Math.max(1,workEnd-workStart)));stage.style.setProperty('--spread',media.matches?0:Math.sin(p*Math.PI));stage.style.setProperty('--camera',media.matches?0:Math.sin(p*Math.PI));stage.style.setProperty('--title-reveal',media.matches?1:Math.max(0,Math.min(1,(h-workStart)/(h*.65))));document.querySelector('.opening').style.setProperty('--intro',media.matches?0:Math.min(1,scrollY/h));stage.classList.toggle('is-visible',r[0].top<85&&r[4].bottom>h*.4);const nextScene=active<3?'work':active===3?'about':'contact';
 if(nextScene!==stage.dataset.scene){textWipes.forEach(a=>a.cancel());textWipes=[];const prior=stage.dataset.scene;stage.dataset.scene=nextScene;
 if(!media.matches&&((prior==='about'&&nextScene==='contact')||(prior==='contact'&&nextScene==='about')||(prior==='work'&&nextScene==='about')||(prior==='about'&&nextScene==='work'))){const sceneSelectors={work:'#interface-model',about:'.about-visual',contact:'.contact-visual'};const outgoing=stage.querySelector(sceneSelectors[prior]),incoming=stage.querySelector(sceneSelectors[nextScene]);textWipes.push(outgoing.animate([{opacity:1,visibility:'visible',clipPath:'inset(0)'},{opacity:1,visibility:'visible',clipPath:'inset(0 0 100% 0)'}],{duration:180,easing:'cubic-bezier(.4,0,.2,1)'}));textWipes.push(incoming.animate([{opacity:1,visibility:'visible',clipPath:'inset(100% 0 0 0)'},{opacity:1,visibility:'visible',clipPath:'inset(0)'}],{duration:180,easing:'cubic-bezier(.4,0,.2,1)'}));}}
 document.querySelectorAll('.chapter-nav a').forEach((a,i)=>{if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});const about=Math.max(0,Math.min(1,(h*.8-r[3].top)/(h*.6)));stage.style.setProperty('--about',about);}
function requestPaint(){if(!queued){queued=true;requestAnimationFrame(paint)}}
addEventListener('scroll',requestPaint,{passive:true});addEventListener('resize',requestPaint);media.addEventListener('change',requestPaint);paint();

// Brief tactile feedback without delaying anchor navigation.
document.querySelectorAll('header nav a,.enter,.chapter-nav a,.social a,summary').forEach(control=>control.addEventListener('click',()=>{if(media.matches)return;control.animate([{transform:'translateY(0)'},{transform:'translateY(2px)',offset:.35},{transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(.16,1,.3,1)'});}));


const buildNotes={idea:'I start with a problem I want to solve, then shape the workflow and visual direction.',ai:'AI helps me explore options and implement the build. I make decisions, give feedback, and keep learning the code.',test:'I click through the flows, review the interface, and refine what feels confusing or does not work.'};
let buildReveal=null;document.querySelectorAll('[data-build]').forEach(button=>button.addEventListener('click',()=>{if(button.getAttribute('aria-pressed')==='true')return;document.querySelectorAll('[data-build]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const note=document.querySelector('.build-detail');note.textContent=buildNotes[button.dataset.build];buildReveal?.cancel();if(!media.matches)buildReveal=note.animate([{clipPath:'inset(0 100% 0 0)',opacity:.5},{clipPath:'inset(0)',opacity:1}],{duration:170,easing:'cubic-bezier(.16,1,.3,1)'});}));

// One short, stationary reveal when the process controls enter the reading area.
const buildExplorer=document.querySelector('.build-explorer');
if(buildExplorer&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(!entries.some(entry=>entry.isIntersecting))return;observer.disconnect();if(media.matches)return;const parts=[buildExplorer.querySelector('h3'),...buildExplorer.querySelectorAll('[data-build]'),buildExplorer.querySelector('.build-detail')];parts.forEach((part,i)=>part.animate([{clipPath:'inset(100% 0 0 0)',opacity:.25},{clipPath:'inset(0)',opacity:1}],{duration:220,delay:i*45,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));},{threshold:.25});observer.observe(buildExplorer);}
