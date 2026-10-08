/* Gardaşlar Arıcılık: sayfa etkileşimleri (slider, sepet, parti sorgu, galeri) */
(function(){
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toast=$('#toast');let tt;
  const say=m=>{toast.textContent=m;toast.hidden=false;clearTimeout(tt);tt=setTimeout(()=>toast.hidden=true,2600)};
  $$('[data-toast]').forEach(b=>b.addEventListener('click',()=>say(b.dataset.toast)));

  const CAM='<svg class="cam" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="4"/></svg>';
  const JAR='<svg class="jar" viewBox="0 0 100 130" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="22" y="8" width="56" height="20" rx="5"/><rect x="14" y="28" width="72" height="96" rx="16"/><rect x="26" y="60" width="48" height="34" rx="4"/></svg>';
  const SRC={'09':'/media/foto3.jpg','12':'/media/foto2.jpg','13':'/media/foto1.jpg','14':'/media/foto4.jpg','19':'/media/foto3.jpg','20':'/media/foto1.jpg','22':'/media/foto2.jpg','23':'/media/foto4.jpg'};
  function photo(el){
    if(el.dataset.done) return; el.dataset.done=1;
    const n=el.dataset.n, d=el.dataset.d||'';
    if(SRC[n]){el.insertAdjacentHTML('afterbegin',`<img class="real" src="${SRC[n]}" alt="${d}" decoding="async">`);el.classList.remove('lite');return}
    const lab = /^\d+$/.test(n)?'FOTOĞRAF '+n:n.startsWith('P')?'ÜRÜN FOTO '+n.slice(1):n.startsWith('V')?'VİDEO '+n.slice(1):'GÖRSEL '+n;
    el.insertAdjacentHTML('beforeend',(el.dataset.jar?JAR:CAM)+`<span class="lbl"><b>${lab}</b>${d?`<span>${d}</span>`:''}</span>`);
    el.setAttribute('role','img'); el.setAttribute('aria-label',lab+(d?': '+d:''));
  }
  const decorate=root=>root.querySelectorAll('.photo').forEach(photo);
  decorate(document);
  $$('.vid-ph,.banner .photo,.cat .photo').forEach(p=>p.classList.add('has-copy'));

  /* MENÜLER */
  const ms=$('#msheet'),cs=$('#csheet');
  $('#burger').onclick=()=>ms.hidden=false; $('#mclose').onclick=()=>ms.hidden=true;
  ms.addEventListener('click',e=>{if(e.target===ms||e.target.tagName==='A')ms.hidden=true});
  $('#cartBtn').onclick=()=>{renderCart();cs.hidden=false}; $('#cclose').onclick=()=>cs.hidden=true;
  cs.addEventListener('click',e=>{if(e.target===cs)cs.hidden=true});

  /* VİDEO */
  const vid=$('#bgvid');
  vid.addEventListener('loadeddata',()=>{$('.vid-ph').hidden=true});
  vid.querySelector('source').addEventListener('error',()=>{vid.hidden=true});
  if(reduce){vid.removeAttribute('autoplay');vid.pause()}
  /* SLIDER */
  const hero=$('#hero'),slides=$$('.slide'),dots=$('#dots');let cur=0,timer;
  slides.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Slayt ${i+1}`);b.onclick=()=>go(i);dots.appendChild(b)});
  function go(i){slides[cur].classList.remove('on');cur=(i+slides.length)%slides.length;slides[cur].classList.add('on');
    [...dots.children].forEach((d,j)=>{d.removeAttribute('aria-current');if(j===cur){void d.offsetWidth;d.setAttribute('aria-current','true')}});
    $('#snum').textContent=String(cur+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');restart()}
  function restart(){clearInterval(timer);if(!reduce)timer=setInterval(()=>{if(!hero.classList.contains('paused'))go(cur+1)},6000)}
  $('#prev').onclick=()=>go(cur-1);$('#next').onclick=()=>go(cur+1);
  hero.addEventListener('mouseenter',()=>hero.classList.add('paused'));hero.addEventListener('mouseleave',()=>hero.classList.remove('paused'));
  go(0);

  /* ÜRÜNLER */
  const P=[
    {id:1,n:'Yayla Çiçek Balı',t:'bal',w:'850 g cam kavanoz',p:690,o:790,tag:'Çok satan',r:'4,9',c:214},
    {id:2,n:'Kestane Balı',t:'bal',w:'850 g cam kavanoz',p:890,tag:'Yeni hasat',r:'4,8',c:96},
    {id:3,n:'Karakovan Balı',t:'bal',w:'500 g cam kavanoz',p:1150,tag:'Sınırlı',r:'5,0',c:41},
    {id:4,n:'Kasa Petek Bal',t:'petek',w:'1 kg ahşap kasa',p:990,r:'4,9',c:132},
    {id:5,n:'Kesme Petek',t:'petek',w:'450 g',p:520,r:'4,7',c:58},
    {id:6,n:'Taze Polen',t:'ari',w:'250 g',p:420,r:'4,8',c:77},
    {id:7,n:'Ham Propolis',t:'ari',w:'50 g',p:360,r:'4,7',c:39},
    {id:8,n:'Gardaşlar Hediye Kutusu',t:'ari',w:'3 x 250 g',p:1290,o:1450,tag:'Hediye',r:'5,0',c:64}
  ];
  const fmt=n=>'₺'+n.toLocaleString('tr-TR');
  const favs=new Set(), cart=new Map();
  const rail=$('#rail');
  function renderP(f){
    const list=P.filter(x=>f==='hepsi'||x.t===f);
    rail.innerHTML=list.map(x=>`<article class="pcard">
      <div class="photo lite" data-n="P${x.id}" data-d="${x.n}, beyaz fon, 1:1" data-jar="1">${x.tag?`<span class="tagline">${x.tag}</span>`:''}
        <button class="fav" aria-pressed="${favs.has(x.id)}" aria-label="${x.n} favorilere ekle" data-fav="${x.id}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg></button></div>
      <div class="b"><span class="meta">${x.w}</span><h3>${x.n}</h3>
      <div class="row"><span class="price">${x.o?`<s>${fmt(x.o)}</s>`:''}${fmt(x.p)}</span><button class="addc" data-add="${x.id}">+ Sepete</button></div></div></article>`).join('');
    decorate(rail); rail.scrollLeft=0;
  }
  renderP('hepsi');
  $$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.setAttribute('aria-pressed',x===t));renderP(t.dataset.f)});
  const step=()=>rail.querySelector('.pcard').offsetWidth+18;
  $('#rprev').onclick=()=>rail.scrollBy({left:-step(),behavior:'smooth'});
  $('#rnext').onclick=()=>rail.scrollBy({left:step(),behavior:'smooth'});
  rail.addEventListener('click',e=>{
    const a=e.target.closest('[data-add]'),f=e.target.closest('[data-fav]');
    if(a){const id=+a.dataset.add;cart.set(id,(cart.get(id)||0)+1);updCount();const x=P.find(p=>p.id===id);say(x.n+' sepete eklendi')}
    if(f){const id=+f.dataset.fav;favs.has(id)?favs.delete(id):favs.add(id);f.setAttribute('aria-pressed',favs.has(id));
      const c=$('#favCount');c.textContent=favs.size;c.hidden=!favs.size}
  });
  function updCount(){let n=0;cart.forEach(v=>n+=v);const c=$('#cartCount');c.textContent=n;c.hidden=!n}
  const FREE=750;
  function renderCart(){
    const box=$('#citems');let tot=0;
    if(!cart.size){box.innerHTML='<p class="empty">Sepetiniz boş. Yayladan bir kavanoz ekleyin.</p>'}
    else{box.innerHTML=[...cart].map(([id,q])=>{const x=P.find(p=>p.id===id);tot+=x.p*q;
      return `<div class="ci"><div class="photo lite" data-n="P${x.id}"></div><div><b>${x.n}</b><small>${x.w}</small>
      <div class="qty"><button data-q="-1" data-id="${id}" aria-label="Azalt">−</button><span>${q}</span><button data-q="1" data-id="${id}" aria-label="Arttır">+</button></div></div>
      <span class="price" style="font-size:18px">${fmt(x.p*q)}</span></div>`}).join('');decorate(box)}
    $('#ctotal').textContent=fmt(tot);
    const left=FREE-tot;
    $('#ship').innerHTML=(left>0?`Ücretsiz kargo için <b>${fmt(left)}</b> daha ekleyin.`:'Kargonuz ücretsiz.')+`<div class="bar2"><i style="width:${Math.min(100,tot/FREE*100)}%"></i></div>`;
  }
  $('#citems').addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(!b)return;const id=+b.dataset.id,q=(cart.get(id)||0)+(+b.dataset.q);
    q>0?cart.set(id,q):cart.delete(id);updCount();renderCart()});
  $('#checkout').onclick=()=>say(cart.size?'Ödeme adımı sonraki aşamada eklenecek':'Önce sepete ürün ekleyin');

  /* PARTİ SORGULA */
  const LOTS={
    '26-08':{name:'Yayla Çiçek Balı',place:'Yayla arılığı · 1.450 m',date:'14 Ağustos 2026',m:[16.8,4.2,612,18.4]},
    '26-09':{name:'Kestane Balı',place:'Kestane ormanı arılığı · 620 m',date:'3 Eylül 2026',m:[17.4,6.1,744,22.1]},
    '25-07':{name:'Karakovan Balı',place:'Kütük kovanlar · 1.300 m',date:'28 Temmuz 2025',m:[17.9,9.8,820,16.2]}
  };
  const LIM=[['Nem','%',20,'max'],['HMF','mg/kg',40,'max'],['Prolin','mg/kg',300,'min'],['Diastaz','DN',8,'min']];
  function showLot(code){
    const L=LOTS[code.trim()];const box=$('#report');
    if(!L){box.innerHTML=`<div class="report-head"><div><b>Parti bulunamadı</b><span>"${code.replace(/[<>&"]/g,'')}" için kayıt yok. Numarayı etiketin arkasından kontrol edin.</span></div></div>`;return}
    box.innerHTML=`<div class="report-head"><div><b>${L.name}</b><span>Parti ${code} · ${L.place}</span><span>Hasat: ${L.date}</span></div><span class="ok">Kodekse uygun</span></div>`+
      LIM.map(([k,u,lim,type],i)=>{const v=L.m[i];const max=type==='max'?lim:Math.max(v,lim)*1.25;
        return `<div class="mrow"><span class="k">${k}</span><div class="bar"><i style="width:0" data-w="${Math.min(100,v/max*100)}"></i><b style="left:${lim/max*100}%"></b></div><span class="v">${String(v).replace('.',',')}<small>${u}</small></span></div>`}).join('')+
      `<p class="report-foot">Çizgi: Türk Gıda Kodeksi Bal Tebliği sınırı · Değerler örnektir</p>`;
    requestAnimationFrame(()=>box.querySelectorAll('.bar i').forEach(i=>i.style.width=i.dataset.w+'%'));
  }
  $('#lotForm').addEventListener('submit',e=>{e.preventDefault();showLot($('#lotIn').value)});
  $$('[data-lot]').forEach(b=>b.onclick=()=>{$('#lotIn').value=b.dataset.lot;showLot(b.dataset.lot)});
  showLot('26-08');

  /* PETEK */
  const cv=$('#comb'),ctx=cv.getContext('2d');let cells=[],W,H,R,t0=performance.now();
  function build(){const b=cv.getBoundingClientRect();if(!b.width)return;const dpr=Math.min(devicePixelRatio||1,2);W=b.width;H=b.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    R=W/7.5;const w=Math.sqrt(3)*R,h=1.5*R;cells=[];let s=7;const rnd=()=>(s=(s*9301+49297)%233280)/233280;const cx=W/2,cy=H/2,mx=W*.48;
    for(let r=-1;r*h<H+R;r++)for(let c=-1;c*w<W+w;c++){const x=c*w+(r%2?w/2:0),y=r*h,d=Math.hypot(x-cx,y-cy);if(d>mx)continue;const k=rnd();
      cells.push({x,y,state:d>mx*.8?0:k<.15?0:k<.55?2:1,delay:d/mx*1200+rnd()*400,lvl:.55+rnd()*.45})}}
  function hex(x,y,r){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a))}ctx.closePath()}
  function draw(now){if(!W)return;const amber='#B37A00',wax='#FFE07A',bg='';ctx.clearRect(0,0,W,H);
    cells.forEach(c=>{const p=reduce?1:Math.min(1,Math.max(0,(now-t0-c.delay)/900)),e=1-Math.pow(1-p,3);
      hex(c.x,c.y,R*.94);ctx.fillStyle='rgba(255,255,255,.45)';ctx.fill();ctx.lineWidth=R*.1;ctx.strokeStyle='#241C05';ctx.globalAlpha=.22;ctx.stroke();ctx.globalAlpha=1;
      if(c.state){ctx.save();hex(c.x,c.y,R*.84);ctx.clip();const top=c.y+R-2*R*c.lvl*e;const g=ctx.createLinearGradient(0,top,0,c.y+R);g.addColorStop(0,wax);g.addColorStop(1,amber);ctx.fillStyle=g;ctx.fillRect(c.x-R,top,2*R,2*R);
        if(c.state===2&&e>.98){ctx.fillStyle='#FFF6D1';ctx.globalAlpha=.85;ctx.fillRect(c.x-R,c.y-R,2*R,2*R);ctx.globalAlpha=.3;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(c.x-R*.2,c.y-R*.25,R*.3,R*.16,-.5,0,7);ctx.fill()}ctx.restore();ctx.globalAlpha=1}});
    if(!reduce&&now-t0<3000)requestAnimationFrame(draw)}
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){build();t0=performance.now();requestAnimationFrame(draw);io.disconnect()}});io.observe(cv);
  build();draw(performance.now()+5000);
  addEventListener('resize',()=>{build();draw(performance.now()+5000)});

  /* TARİHÇE */
  const ERA=[
    {y:1987,n:'16',t:'İlk beş kovan',d:'İki kardeş, dedelerinden kalan beş kütük kovanı fenni kovana aktardı. İlk hasat yalnızca aileye ve komşulara yetti.',ph:'Eski kütük kovanlar veya ilk yıllardan aile fotoğrafı'},
    {y:1998,n:'17',t:'Yaylaya göç',d:'Gezginci arıcılığa başladık. Kovanlarımız her yaz 1.450 metredeki yaylaya taşınmaya başladı.',ph:'Kamyonla kovan taşıma veya yayla çadırı'},
    {y:2012,n:'18',t:'Kendi süzme evimiz',d:'Hijyenik dolum tesisimizi kurduk. O günden beri her parti laboratuvar analizinden geçiyor.',ph:'Süzme tesisi iç mekân'},
    {y:2026,n:'19',t:'Üçüncü kuşak',d:'420 kovan ve çevrim içi mağazamızla balımızı doğrudan sofranıza getiriyoruz.',ph:'Bugünkü ekip, toplu aile fotoğrafı'}
  ];
  let ei=ERA.length-1;
  $('#years').innerHTML=ERA.map((e,i)=>`<button data-i="${i}">${e.y}</button>`).join('');
  function showEra(i){ei=i;const e=ERA[i];
    $$('#years button').forEach((b,j)=>b.setAttribute('aria-pressed',j===i));
    $('#era').innerHTML=`<div class="photo" data-n="${e.n}" data-d="${e.ph}"></div><div><div class="yr">${e.y}</div><h3>${e.t}</h3><p>${e.d}</p><p class="step">Dönem ${i+1} / ${ERA.length}</p></div>`;
    decorate($('#era'));$('#trackFill').style.width=((i+1)/ERA.length*100)+'%'}
  $('#years').addEventListener('click',e=>{const b=e.target.closest('button');if(b)showEra(+b.dataset.i)});
  showEra(0);

  /* HASAT TAKVİMİ */
  const M=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const rows=[['Çiçek balı',[5,6,7],[8]],['Kestane balı',[6,7],[8,9]],['Yayla balı',[6,7,8],[9]],['Polen',[4,5,6,7],[]],['Propolis',[],[8,9,10]]];
  const now=new Date().getMonth()+1;
  let h='<span></span>'+M.map(m=>`<span class="m">${m}</span>`).join('');
  rows.forEach(([n,on,pk])=>{h+=`<span class="rw">${n}</span>`;for(let i=1;i<=12;i++)h+=`<span class="c ${pk.includes(i)?'peak':on.includes(i)?'on':''} ${i===now?'now':''}" title="${n} · ${M[i-1]}"></span>`});
  $('#cal').innerHTML=h;

  /* GALERİ */
  const G=[['20','Yaylada kovan sırası, geniş açı','w2 h2'],['21','Arı yakın plan, makro',''],['22','Süzme günü',''],['23','Çerçeve kontrolü, arıcı elleri','w2'],['28','Kestane çiçeği',''],['29','Gün batımında arılık',''],['30','Petek kesimi','w2']];
  $('#gallery').innerHTML=G.map((g,i)=>`<button class="gitem ${g[2]}" data-i="${i}" aria-label="Fotoğraf ${g[0]} büyüt"><div class="photo${i%3===2?' lite':''}" data-n="${g[0]}" data-d="${g[1]}"></div></button>`).join('');
  decorate($('#gallery'));
  let gi=0;const lb=$('#lb');
  function openLb(i){gi=(i+G.length)%G.length;const g=G[gi];$('#lbFrame').innerHTML=`<div class="photo" data-n="${g[0]}" data-d="${g[1]}"></div>`;decorate($('#lbFrame'));$('#lbCap').textContent=`${gi+1} / ${G.length}`;lb.hidden=false}
  $('#gallery').addEventListener('click',e=>{const b=e.target.closest('.gitem');if(b){openLb(+b.dataset.i);$('#lbClose').focus()}});
  $('#lbPrev').onclick=()=>openLb(gi-1);$('#lbNext').onclick=()=>openLb(gi+1);$('#lbClose').onclick=()=>lb.hidden=true;
  lb.addEventListener('click',e=>{if(e.target===lb)lb.hidden=true});
  addEventListener('keydown',e=>{if(e.key==='Escape'){lb.hidden=true;ms.hidden=true;cs.hidden=true}if(!lb.hidden){if(e.key==='ArrowRight')openLb(gi+1);if(e.key==='ArrowLeft')openLb(gi-1)}});

  /* FORMLAR */
  $('#newsForm').addEventListener('submit',e=>{e.preventDefault();const v=$('#nEmail').value.trim();
    if(!/^\S+@\S+\.\S+$/.test(v)){say('Geçerli bir e-posta adresi yazın');return}say('Teşekkürler. Bülten altyapısı sonraki aşamada bağlanacak');e.target.reset()});
  $('#cForm').addEventListener('submit',e=>{e.preventDefault();if(!$('#ad').value.trim()||!$('#mesaj').value.trim()){say('Lütfen adınızı ve mesajınızı yazın');return}
    say('Form hazır. Gönderim altyapısı sonraki aşamada bağlanacak')});

})();
