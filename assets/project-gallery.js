/** Dependency-free progressive enhancement for the generated project section. */
for (const root of document.querySelectorAll('.project-showcase')) {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const cards = [...root.querySelectorAll('.ps-card')];
 const states = new Map();
 const dialog = root.querySelector('.ps-dialog');
 let active = null;
 let returnFocus = null;
 const close = () => { if(dialog.open) dialog.close(); };
 const renderDialog = () => {
  const {state,index} = active;
  const slide = state.slides[index];
  const img = dialog.querySelector('.ps-dialog-stage img');
  img.src = slide.querySelector('a').href;
  img.alt = slide.querySelector('img').alt;
  dialog.querySelector('.ps-dialog-caption').textContent = `${slide.dataset.caption} · ${index+1} / ${state.slides.length}`;
  dialog.querySelector('.ps-dialog-note').textContent = slide.dataset.note;
 };
 const moveDialog = delta => { active.index = (active.index+delta+active.state.slides.length)%active.state.slides.length; renderDialog(); };
 const open = (state,index,trigger) => {
  if (!dialog.showModal) return false;
  active={state,index};returnFocus=trigger;
  dialog.querySelector('#ps-dialog-title').textContent = state.card.querySelector('h3').textContent;
  dialog.querySelector('.ps-dialog-summary').textContent = state.card.querySelector('.ps-summary').textContent;
  dialog.querySelector('.ps-dialog-boundary').textContent = state.card.querySelector('.ps-details dd:last-child').textContent;
  dialog.querySelector('.ps-dialog-source').href = state.card.querySelector('.ps-links a').href;
  renderDialog();dialog.showModal();document.documentElement.classList.add('ps-scroll-locked');
  dialog.querySelector('.ps-close').focus();return true;
 };
 dialog.querySelector('.ps-close').addEventListener('click',close);
 dialog.addEventListener('close',()=>{document.documentElement.classList.remove('ps-scroll-locked');returnFocus?.focus({preventScroll:true});active=null;});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 dialog.querySelector('.ps-dialog-prev').addEventListener('click',()=>moveDialog(-1));
 dialog.querySelector('.ps-dialog-next').addEventListener('click',()=>moveDialog(1));
 dialog.addEventListener('keydown',event=>{if(event.key==='Tab'){const items=[...dialog.querySelectorAll('button:not([disabled]),a[href]')];const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveDialog(event.key==='ArrowLeft'?-1:1);}if(event.key==='Home'||event.key==='End'){event.preventDefault();active.index=event.key==='Home'?0:active.state.slides.length-1;renderDialog();}});
 for (const card of cards) {
  const track=card.querySelector('.ps-track');
  const carousel=card.querySelector('.ps-carousel');
  const slides=[...card.querySelectorAll('.ps-slide')];
  const dots=[...card.querySelectorAll('[data-slide]')];
  const state={card,track,slides,index:0};states.set(card.dataset.project,state);
  const update=()=>{
   if(!track.clientWidth)return;
   const next=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/track.clientWidth)));
   state.index=next;
   dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===next)));
   slides.forEach((slide,i)=>{slide.inert=i!==next;});
   card.querySelector('.ps-slide-status').textContent=`${slides[next].dataset.caption}, screenshot ${next+1} of ${slides.length}`;
  };
  const go=index=>{
   const next=(index+slides.length)%slides.length;
   state.index=next;
   track.scrollTo({left:next*track.clientWidth,behavior:reduced.matches?'instant':'smooth'});
  };
  let frame=0;
  track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);},{passive:true});
  new ResizeObserver(()=>{track.scrollTo({left:state.index*track.clientWidth,behavior:'instant'});}).observe(track);
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>go(i)));
  card.querySelector('[data-prev]').addEventListener('click',()=>go(state.index-1));
  card.querySelector('[data-next]').addEventListener('click',()=>go(state.index+1));
  carousel.addEventListener('keydown',event=>{
   if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();go(state.index+(event.key==='ArrowLeft'?-1:1));}
   if(event.key==='Home'||event.key==='End'){event.preventDefault();go(event.key==='Home'?0:slides.length-1);}
  });
  // Touch uses native scrolling. Mouse dragging is enhanced without blocking links.
  let drag=null,suppressClick=false;
  track.addEventListener('dragstart',event=>event.preventDefault());
  track.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;suppressClick=false;drag={x:event.clientX,start:track.scrollLeft,moved:false,id:event.pointerId};});
  track.addEventListener('pointermove',event=>{
   if(!drag)return;const delta=event.clientX-drag.x;
   if(Math.abs(delta)>5&&!drag.moved){drag.moved=true;track.setPointerCapture(drag.id);track.classList.add('ps-dragging');}
   if(drag.moved){event.preventDefault();track.scrollLeft=drag.start-delta;}
  });
  const endDrag=()=>{if(!drag)return;const moved=drag.moved;drag=null;track.classList.remove('ps-dragging');if(moved){suppressClick=true;go(Math.round(track.scrollLeft/track.clientWidth));}};
  track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',endDrag);track.addEventListener('pointerleave',()=>{if(drag&&!drag.moved)drag=null;});
  track.addEventListener('click',event=>{
   const anchor=event.target.closest('[data-image-open]');if(!anchor)return;
   if(suppressClick){event.preventDefault();suppressClick=false;return;}
   if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   if(open(state,Number(anchor.dataset.imageOpen),anchor))event.preventDefault();
  });
  card.querySelector('[data-gallery-open]').addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;if(open(state,state.index,event.currentTarget))event.preventDefault();});
  card.querySelector('.ps-controls').hidden=false;update();
 }
 const filterGroup=root.querySelector('.ps-filters');
 filterGroup.hidden=false;
 filterGroup.addEventListener('click',event=>{
  const button=event.target.closest('[data-filter]');if(!button)return;
  filterGroup.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});
  const count=cards.filter(c=>!c.hidden).length;
  root.querySelector('.ps-filter-status').textContent=`${count} ${count===1?'project':'projects'} · real product screens`;
 });
 root.classList.add('ps-enhanced');
}
