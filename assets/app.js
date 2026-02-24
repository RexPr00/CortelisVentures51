const langRootLinks = `
<a href="index.html">English</a>
<a href="de/index.html">Deutsch</a>
<a href="fr/index.html">Français</a>
<a href="es/index.html">Español</a>
<a href="it/index.html">Italiano</a>
<a href="tr/index.html">Türkçe</a>
<a href="pt/index.html">Português</a>
<a href="jp/index.html">日本語</a>
<a href="sk/index.html">Slovenčina</a>
<a href="be/index.html">Nederlands</a>`;
const langInnerLinks = `
<a href="../index.html">English</a>
<a href="../de/index.html">Deutsch</a>
<a href="../fr/index.html">Français</a>
<a href="../es/index.html">Español</a>
<a href="../it/index.html">Italiano</a>
<a href="../tr/index.html">Türkçe</a>
<a href="../pt/index.html">Português</a>
<a href="../jp/index.html">日本語</a>
<a href="../sk/index.html">Slovenčina</a>
<a href="../be/index.html">Nederlands</a>`;

const focusables = 'a[href], button:not([disabled]), input:not([disabled])';
function trapFocus(container, e){
  const items = [...container.querySelectorAll(focusables)];
  if(!items.length) return;
  const first = items[0], last = items[items.length-1];
  if(e.key === 'Tab' && e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  if(e.key === 'Tab' && !e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}

document.querySelectorAll('[data-lang-toggle]').forEach(btn=>{
  btn.addEventListener('click',()=> btn.closest('.lang').classList.toggle('open'));
});
document.addEventListener('click',(e)=>{
  document.querySelectorAll('.lang').forEach(l=>{ if(!l.contains(e.target)) l.classList.remove('open'); });
});

const drawer = document.querySelector('.mobile-drawer');
const openDrawer = document.querySelector('.drawer-toggle');
const closeDrawer = document.querySelector('.drawer-close');
if(drawer && openDrawer && closeDrawer){
  const open = ()=>{ drawer.classList.add('open'); document.body.classList.add('locked'); closeDrawer.focus(); };
  const close = ()=>{ drawer.classList.remove('open'); document.body.classList.remove('locked'); openDrawer.focus(); };
  openDrawer.addEventListener('click', open);
  closeDrawer.addEventListener('click', close);
  document.addEventListener('click', e=>{ if(drawer.classList.contains('open') && !drawer.contains(e.target) && !openDrawer.contains(e.target)) close(); });
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && drawer.classList.contains('open')) close();
    if(drawer.classList.contains('open')) trapFocus(drawer, e);
  });
}

document.querySelectorAll('.faq-item').forEach(item=>{
  item.querySelector('.faq-q').addEventListener('click',()=>{
    document.querySelectorAll('.faq-item').forEach(x=> x===item ? x.classList.toggle('open') : x.classList.remove('open'));
  });
});

const modalBg = document.querySelector('.modal-backdrop');
if(modalBg){
  const openBtn = document.querySelectorAll('[data-open-privacy]');
  const closeBtn = modalBg.querySelectorAll('[data-close-privacy]');
  const open = ()=>{ modalBg.classList.add('open'); document.body.classList.add('locked'); modalBg.querySelector('.modal-x').focus(); };
  const close = ()=>{ modalBg.classList.remove('open'); document.body.classList.remove('locked'); };
  openBtn.forEach(b=>b.addEventListener('click', (e)=>{e.preventDefault(); open();}));
  closeBtn.forEach(b=>b.addEventListener('click', close));
  modalBg.addEventListener('click',e=>{ if(e.target === modalBg) close(); });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && modalBg.classList.contains('open')) close();
    if(modalBg.classList.contains('open')) trapFocus(modalBg.querySelector('.modal'), e);
  });
}

const amountButtons = document.querySelectorAll('.seg-btn');
const slider = document.querySelector('#months');
if(amountButtons.length && slider){
  const lowEl = document.querySelector('[data-low]');
  const baseEl = document.querySelector('[data-base]');
  const highEl = document.querySelector('[data-high]');
  const valEl = document.querySelector('[data-month-val]');
  const locale = document.documentElement.lang || 'en';
  let amount = Number(document.querySelector('.seg-btn.active')?.dataset.amount || 10000);
  const format = (n)=> new Intl.NumberFormat(locale, {style:'currency', currency: locale==='en'?'USD':'EUR', maximumFractionDigits:0}).format(n);
  const update = ()=>{
    const m = Number(slider.value);
    const calc = (r)=> amount * Math.pow(1+r,m);
    lowEl.textContent = format(calc(0.08));
    baseEl.textContent = format(calc(0.115));
    highEl.textContent = format(calc(0.15));
    valEl.textContent = `${m}`;
  };
  amountButtons.forEach(btn=>btn.addEventListener('click',()=>{
    amountButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    amount = Number(btn.dataset.amount);
    update();
  }));
  slider.addEventListener('input',update);
  update();
}

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; io.unobserve(e.target);} });
},{threshold:0.12});
document.querySelectorAll('section').forEach(s=>{ s.style.opacity=.01; s.style.transform='translateY(20px)'; s.style.transition='opacity .55s ease, transform .55s ease'; io.observe(s); });
