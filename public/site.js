/* Gardaşlar Arıcılık: ana sayfa etkileşimleri (video, slider, vitrin, parti sorgu, tarihçe, galeri) */
function homeInit(){
  const {$,$$,fmt,decorate,say,reduce}=GA;
  const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  $$('.vid-ph,.banner .photo,.cat .photo').forEach(p=>p.classList.add('has-copy'));

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

  /* VİTRİN: ortak katalogdan */
  const rail=$('#rail');
  function renderP(f){
    const list=GA.P.filter(x=>f==='hepsi'?x.feat:x.cat===f).slice(0,8);
    rail.innerHTML=list.map(x=>{const s=x.s[x.s.length>1&&x.cat!=='malzeme'?x.s.length-1:0],si=x.s.indexOf(s);return `<article class="pcard">
      <div class="photo lite" data-n="P${x.id}" data-d="${x.n}, beyaz fon, 1:1" data-ic="${x.ic}">${x.tag?`<span class="tagline">${x.tag}</span>`:''}</div>
      <div class="b"><span class="meta">${s.w} · ${GA.CATS[x.cat]}</span><h3>${x.n}</h3>
      <div class="row"><span class="price">${s.o?`<s>${fmt(s.o)}</s>`:''}${fmt(s.p)}</span><button class="addc" data-add="${x.id}" data-si="${si}">+ Sepete</button></div></div></article>`}).join('');
    decorate(rail); rail.scrollLeft=0;
  }
  renderP('hepsi');
  $$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.setAttribute('aria-pressed',x===t));renderP(t.dataset.f)});
  const step=()=>rail.querySelector('.pcard').offsetWidth+18;
  $('#rprev').onclick=()=>rail.scrollBy({left:-step(),behavior:'smooth'});
  $('#rnext').onclick=()=>rail.scrollBy({left:step(),behavior:'smooth'});
  rail.addEventListener('click',e=>{const a=e.target.closest('[data-add]');if(a)GA.add(+a.dataset.add,+a.dataset.si)});

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

  /* HASAT TAKVİMİ (özet; ayrıntılısı mağazada) */
  const M=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const now=GA.NOW;
  let h='<span></span>'+M.map(m=>`<span class="m">${m}</span>`).join('');
  GA.HONEY.forEach(r=>{h+=`<span class="rw">${r.n}</span>`;for(let i=1;i<=12;i++)h+=`<span class="c ${r.hs.includes(i)?'peak':r.ak.includes(i)?'on':''} ${i===now?'now':''}" title="${r.n} · ${M[i-1]}"></span>`});
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
  addEventListener('keydown',e=>{if(e.key==='Escape')lb.hidden=true;if(!lb.hidden){if(e.key==='ArrowRight')openLb(gi+1);if(e.key==='ArrowLeft')openLb(gi-1)}});

  /* FORMLAR */
  $('#newsForm').addEventListener('submit',e=>{e.preventDefault();const v=$('#nEmail').value.trim();
    if(!/^\S+@\S+\.\S+$/.test(v)){say('Geçerli bir e-posta adresi yazın');return}say('Teşekkürler. Bülten altyapısı sonraki aşamada bağlanacak');e.target.reset()});
  $('#cForm').addEventListener('submit',e=>{e.preventDefault();if(!$('#ad').value.trim()||!$('#mesaj').value.trim()){say('Lütfen adınızı ve mesajınızı yazın');return}
    say('Form hazır. Gönderim altyapısı sonraki aşamada bağlanacak')});

}
window.GA&&GA.ready?homeInit():addEventListener("ga-ready",homeInit,{once:true});
