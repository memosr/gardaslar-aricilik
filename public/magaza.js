/* Gardaşlar Arıcılık: mağaza sayfası
   Hasat takvimi tablosu, filtreli ürün listesi, hızlı bakış, ara ara geçen arılar ve düşen bal damlaları. */
function shopInit() {
  const { $, $$, fmt, esc, P, CATS, HONEY, MONTHS, NOW, status, fresh, icon, decorate, reduce } = GA;
  const SHORT = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const ST = { hasat: "Hasatta", taze: "Yeni hasat", akim: "Çiçeklenme", dis: "Stoktan" };
  const CAT_IC = { bal: "jar", petek: "comb", ari: "dish", malzeme: "hive", hediye: "gift" };
  const range = (ms) => {
    if (!ms.length) return "Yıl boyu";
    const a = ms[0], b = ms[ms.length - 1];
    return a === b ? MONTHS[a - 1] : `${MONTHS[a - 1]}–${MONTHS[b - 1]}`;
  };
  const priceOf = (p, si = 0) => p.s[si] || p.s[0];
  const minPrice = (p) => Math.min(...p.s.map((s) => s.p));
  const onSale = (p) => p.s.some((s) => s.o);

  /* ---------------- STATE ---------------- */
  const st = { cats: new Set(), q: "", sort: "rec", max: 5000, fresh: false, sale: false, hk: null, view: "grid" };
  const sel = {}; // ürün id → seçili boy
  let honeySel = null;

  /* ================= HASAT TAKVİMİ TABLOSU ================= */
  const hcal = $("#hcal");
  const SEASONS = [["Kış", 2], ["İlkbahar", 3], ["Yaz", 3], ["Sonbahar", 3], ["Kış", 1]];
  const prodsFor = (k) => P.filter((p) => p.hk === k);
  const cellState = (h, m) => h.hs.includes(m) ? "hs" : h.ak.includes(m) ? "ak" : h.hs.some((x) => { const d = (m - x + 12) % 12; return d > 0 && d <= 2; }) ? "tz" : "";
  const CELL_T = { hs: "Hasat", ak: "Akım", tz: "Yeni hasat stokta", "": "Sezon dışı" };
  function buildCal() {
    const d = new Date(), dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(), dayPct = ((d.getDate() - 0.5) / dim) * 100;
    let h = `<div class="hc-row hc-season" role="row"><span class="hc-lab" role="columnheader"></span>${SEASONS.map(([n, span]) => `<span class="hc-sea" style="grid-column:span ${span}" role="columnheader">${n}</span>`).join("")}<span role="columnheader"></span></div>`;
    h += `<div class="hc-row hc-months" role="row"><span class="hc-lab" role="columnheader">Bal türü</span>${SHORT.map((s, i) => `<span class="hc-m${i + 1 === NOW ? " now" : ""}" role="columnheader">${s}${i + 1 === NOW ? `<i class="today" style="left:${dayPct}%" title="Bugün"></i>` : ""}</span>`).join("")}<span class="hc-st" role="columnheader">Bu ay</span></div>`;
    h += HONEY.map((x) => {
      const s = status(x), n = prodsFor(x.k).length;
      const cells = Array.from({ length: 12 }, (_, i) => { const m = i + 1, c = cellState(x, m); return `<span class="hc-c ${c}${m === NOW ? " now" : ""}" role="cell" title="${x.n} · ${MONTHS[i]}: ${CELL_T[c]}"></span>`; }).join("");
      return `<div class="hc-row hc-honey" role="row" data-k="${x.k}">
        <button class="hc-lab" role="rowheader" data-k="${x.k}" aria-pressed="false"><span class="sw" style="background:${x.col}"></span><span class="nm"><b>${x.n}</b><small>Hasat: ${range(x.hs)}</small></span></button>
        ${cells}
        <span class="hc-st" role="cell"><span class="pill ${s}">${ST[s]}</span>${n ? `<button class="hc-go" data-go="${x.k}">${n} ürün →</button>` : ""}</span></div>`;
    }).join("");
    hcal.innerHTML = h;
    // bu ay sütunu görünür olsun (telefonda yana kaydır)
    const wrap = hcal.parentElement, nowCell = hcal.querySelector(".hc-m.now");
    if (wrap.scrollWidth > wrap.clientWidth && nowCell) wrap.scrollLeft = Math.max(0, nowCell.offsetLeft - 156 - 46 * 4);
  }
  hcal.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) { st.hk = go.dataset.go; st.cats.clear(); apply(true); return; }
    const row = e.target.closest(".hc-honey"); if (row) pickHoney(row.dataset.k);
  });

  /* ---- bu ay / seçili bal kartı ---- */
  function renderNow() {
    const card = $("#nowCard");
    if (!honeySel) {
      const hs = HONEY.filter((h) => status(h) === "hasat"), tz = HONEY.filter((h) => status(h) === "taze");
      const nFresh = P.filter(fresh).length;
      card.innerHTML = `<span class="k">Bugün · ${MONTHS[NOW - 1]}</span>
        <h3>${hs.length ? "Hasat zamanı" : "Taze stoklar"}</h3>
        <dl class="facts"><dt>Hasatta</dt><dd>${hs.map((h) => h.n).join(", ") || "Yok"}</dd><dt>Yeni hasat</dt><dd>${tz.map((h) => h.n).join(", ") || "Yok"}</dd></dl>
        <div class="acts"><button class="btn" data-act="fresh" ${nFresh ? "" : "disabled"}>Taze ürünleri göster (${nFresh})</button></div>`;
    } else {
      const h = HONEY.find((x) => x.k === honeySel), s = status(h), n = prodsFor(h.k).length;
      card.innerHTML = `<span class="k">Seçili bal</span>
        <h3><span class="sw" style="background:${h.col}"></span>${h.n}</h3>
        <p>${h.note}</p>
        <dl class="facts"><dt>Akım</dt><dd>${h.ak.length ? range(h.ak) : "Yok"}</dd><dt>Hasat</dt><dd>${range(h.hs)}</dd><dt>Bu ay</dt><dd><span class="pill ${s}">${ST[s]}</span></dd></dl>
        <div class="acts">${n ? `<button class="btn" data-act="show">Ürünlerini göster (${n})</button>` : ""}<button class="btn line" data-act="clear">Seçimi kaldır</button></div>`;
    }
  }
  $("#nowCard").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act;
    if (a === "clear") pickHoney(null);
    if (a === "show") { st.hk = honeySel; st.cats.clear(); apply(true); }
    if (a === "fresh") { st.fresh = true; $("#fFresh").checked = true; apply(true); }
  });
  function pickHoney(k) {
    honeySel = honeySel === k ? null : k;
    hcal.classList.toggle("has-sel", !!honeySel);
    $$(".hc-honey", hcal).forEach((r) => r.classList.toggle("sel", r.dataset.k === honeySel));
    $$(".hc-honey .hc-lab", hcal).forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === honeySel));
    renderNow();
  }

  /* ================= ÜRÜNLER ================= */
  const counts = Object.fromEntries(Object.keys(CATS).map((c) => [c, P.filter((p) => p.cat === c).length]));
  $("#catPills").innerHTML = `<button class="cp" data-c="" aria-pressed="true">${icon("hive", "")}<span>Tümü</span><small>${P.length}</small></button>` +
    Object.entries(CATS).map(([c, n]) => `<button class="cp" data-c="${c}" aria-pressed="false">${icon(CAT_IC[c], "")}<span>${n}</span><small>${counts[c]}</small></button>`).join("");
  $("#fCats").innerHTML = Object.entries(CATS).map(([c, n]) => `<label class="tg" for="fc-${c}"><input type="checkbox" id="fc-${c}" value="${c}"><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m5 12 4.5 4.5L19 7"/></svg></span><span>${n}</span><span class="n">${counts[c]}</span></label>`).join("");

  function filtered() {
    const q = st.q.trim().toLocaleLowerCase("tr");
    let L = P.filter((p) =>
      (!st.cats.size || st.cats.has(p.cat)) &&
      (!st.hk || p.hk === st.hk) &&
      (!st.fresh || fresh(p)) &&
      (!st.sale || onSale(p)) &&
      minPrice(p) <= st.max &&
      (!q || (p.n + " " + p.d + " " + CATS[p.cat]).toLocaleLowerCase("tr").includes(q))
    );
    const pr = (p) => priceOf(p, sel[p.id] || 0).p;
    if (st.sort === "asc") L.sort((a, b) => pr(a) - pr(b));
    else if (st.sort === "desc") L.sort((a, b) => pr(b) - pr(a));
    else if (st.sort === "az") L.sort((a, b) => a.n.localeCompare(b.n, "tr"));
    else L.sort((a, b) => (b.feat || 0) + (fresh(b) ? 0.5 : 0) - ((a.feat || 0) + (fresh(a) ? 0.5 : 0)));
    return L;
  }

  function card(p) {
    const si = sel[p.id] || 0, s = priceOf(p, si), isFresh = fresh(p);
    const badges = [p.tag ? `<span class="badge2 hot">${p.tag}</span>` : "", isFresh ? `<span class="badge2 fresh">Yeni hasat</span>` : "", s.o ? `<span class="badge2 sale">%${Math.round((1 - s.p / s.o) * 100)} indirim</span>` : ""].join("");
    const tone = p.col ? `<span class="tone"><i style="background:${p.col}"></i><span>${p.tone}</span></span>` : "";
    const sizes = p.s.length > 1 ? `<div class="sizes" role="group" aria-label="Seçenek">${p.s.map((x, i) => `<button class="sz" data-sz="${i}" aria-pressed="${i === si}">${x.w}</button>`).join("")}</div>` : `<div class="sizes"><span class="sz" style="cursor:default">${s.w}</span></div>`;
    return `<article class="scard" data-id="${p.id}">
      <div class="media"><div class="photo lite" data-n="P${p.id}" data-d="${esc(p.n)}" data-ic="${p.ic}"></div><div class="badges">${badges}</div><button class="qbtn" data-qv="${p.id}">Hızlı bak</button></div>
      <div class="body"><div class="meta"><span>${CATS[p.cat]}</span>${tone}</div><h3>${p.n}</h3><p class="desc">${p.d}</p>${sizes}
      <div class="foot"><span class="price">${s.o ? `<s>${fmt(s.o)}</s>` : ""}${fmt(s.p)}</span><button class="add2" data-add="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>Sepete ekle</button></div></div></article>`;
  }

  const grid = $("#sgrid");
  function render() {
    const L = filtered();
    grid.classList.toggle("list", st.view === "list");
    grid.innerHTML = L.length ? L.map(card).join("") : `<div class="empty2"><b>Bu filtrelere uyan ürün yok</b><span>Filtreleri gevşetin veya temizleyin.</span><button class="btn line" data-clear-all>Filtreleri temizle</button></div>`;
    decorate(grid);
    $("#count").textContent = `${L.length} ürün`;
    // aktif filtre çipleri
    const chips = [];
    st.cats.forEach((c) => chips.push([`cat:${c}`, CATS[c]]));
    if (st.hk) chips.push(["hk", "Bal: " + HONEY.find((h) => h.k === st.hk).n]);
    if (st.fresh) chips.push(["fresh", "Yeni hasat"]);
    if (st.sale) chips.push(["sale", "İndirimde"]);
    if (st.max < 5000) chips.push(["max", fmt(st.max) + " ve altı"]);
    if (st.q.trim()) chips.push(["q", `"${esc(st.q.trim())}"`]);
    $("#chips").innerHTML = chips.map(([k, t]) => `<button class="chip2" data-chip="${k}">${t}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`).join("") + (chips.length > 1 ? `<button class="chip2 clear" data-clear-all>Tümünü temizle</button>` : "");
    const b = $("#fBadge"); b.textContent = chips.length; b.hidden = !chips.length;
    // kategori düğmeleri ve kutuları eşitle
    $$(".cp").forEach((x) => x.setAttribute("aria-pressed", x.dataset.c ? st.cats.size === 1 && st.cats.has(x.dataset.c) : !st.cats.size));
    $$("#fCats input").forEach((i) => (i.checked = st.cats.has(i.value)));
  }
  function apply(scroll) {
    render();
    if (scroll) $("#urunler").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  /* ---- olaylar ---- */
  $("#catPills").addEventListener("click", (e) => { const b = e.target.closest(".cp"); if (!b) return; st.cats.clear(); if (b.dataset.c) st.cats.add(b.dataset.c); st.hk = null; render(); });
  $("#fCats").addEventListener("change", (e) => { const v = e.target.value; e.target.checked ? st.cats.add(v) : st.cats.delete(v); render(); });
  $("#fFresh").addEventListener("change", (e) => { st.fresh = e.target.checked; render(); });
  $("#fSale").addEventListener("change", (e) => { st.sale = e.target.checked; render(); });
  $("#fMax").addEventListener("input", (e) => { st.max = +e.target.value; $("#fMaxVal").textContent = fmt(st.max) + " ve altı"; render(); });
  let qt; $("#q").addEventListener("input", (e) => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value; render(); }, 150); });
  $("#sort").addEventListener("change", (e) => { st.sort = e.target.value; render(); });
  $$(".view button").forEach((b) => b.addEventListener("click", () => { st.view = b.dataset.v; $$(".view button").forEach((x) => x.setAttribute("aria-pressed", x === b)); render(); }));
  function clearAll() {
    Object.assign(st, { q: "", max: 5000, fresh: false, sale: false, hk: null }); st.cats.clear();
    $("#q").value = ""; $("#fMax").value = 5000; $("#fMaxVal").textContent = "₺5.000 ve altı"; $("#fFresh").checked = false; $("#fSale").checked = false;
    render();
  }
  $("#fReset").addEventListener("click", clearAll);
  document.addEventListener("click", (e) => { if (e.target.closest("[data-clear-all]")) clearAll(); });
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-chip]"); if (!b) return;
    const k = b.dataset.chip;
    if (k.startsWith("cat:")) st.cats.delete(k.slice(4));
    if (k === "hk") st.hk = null;
    if (k === "fresh") { st.fresh = false; $("#fFresh").checked = false; }
    if (k === "sale") { st.sale = false; $("#fSale").checked = false; }
    if (k === "max") { st.max = 5000; $("#fMax").value = 5000; $("#fMaxVal").textContent = "₺5.000 ve altı"; }
    if (k === "q") { st.q = ""; $("#q").value = ""; }
    render();
  });
  grid.addEventListener("click", (e) => {
    const sz = e.target.closest("[data-sz]"), add = e.target.closest("[data-add]"), qv = e.target.closest("[data-qv]");
    if (sz) { const id = +sz.closest(".scard").dataset.id; sel[id] = +sz.dataset.sz; const c = sz.closest(".scard"); c.outerHTML = card(GA.byId(id)); decorate(grid); }
    if (add) { const id = +add.dataset.add; GA.add(id, sel[id] || 0); add.classList.add("done"); add.lastChild.textContent = "Eklendi"; setTimeout(() => { add.classList.remove("done"); add.lastChild.textContent = "Sepete ekle"; }, 1400); }
    if (qv) openQV(+qv.dataset.qv, qv);
  });
  // mobil filtre paneli
  const fw = $("#fwrap");
  $("#fOpen").addEventListener("click", () => fw.classList.add("open"));
  const closeF = () => fw.classList.remove("open");
  $("#fClose").addEventListener("click", closeF);
  $("#fApply").addEventListener("click", () => { closeF(); $("#urunler").scrollIntoView(); });
  fw.addEventListener("click", (e) => { if (e.target === fw) closeF(); });

  /* ================= HIZLI BAKIŞ ================= */
  const qvEl = $("#qv"); let qvState = null, lastFocus = null;
  function openQV(id, from) {
    lastFocus = from || document.activeElement;
    qvState = { id, si: sel[id] || 0, q: 1 };
    renderQV(); qvEl.hidden = false; $("#qvClose").focus();
  }
  function renderQV() {
    const p = GA.byId(qvState.id), s = priceOf(p, qvState.si), h = HONEY.find((x) => x.k === p.hk);
    const prof = p.prof ? `<div class="prof">${["Tatlılık", "Aroma", "Koyuluk"].map((t, i) => `<div><span>${t}</span><span class="dots5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= p.prof[i] ? "on" : ""}"></i>`).join("")}</span></div>`).join("")}</div>` : "";
    const facts = [
      ["Kategori", CATS[p.cat]],
      p.tone ? ["Renk", `<span class="tone"><i style="background:${p.col}"></i>${p.tone}</span>`] : null,
      p.kr ? ["Kristalleşme", p.kr] : null,
      h ? ["Hasat", `${range(h.hs)} · <span class="pill ${status(h)}">${ST[status(h)]}</span>`] : null,
      ["Kargo", "1-2 iş gününde kargoda"],
    ].filter(Boolean).map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("");
    $("#qvBody").innerHTML = `<div class="qv-grid"><div class="photo lite" data-n="P${p.id}" data-d="${esc(p.n)}" data-ic="${p.ic}"></div>
      <div class="qv-info"><p class="eyebrow">${CATS[p.cat]}</p><h2 id="qvTitle">${p.n}</h2><p class="desc">${p.d}</p>${prof}
      <dl class="qv-facts">${facts}</dl>
      ${GA.PROLIN[p.hk] ? (() => { const lot = GA.LOT_PRO[p.hk]; return `<div class="qv-pro"><div class="qv-pro-h"><span>Prolin · olgunluk göstergesi</span><a href="/#prolin">Bu ne demek?</a></div>${GA.prolinGauge({ v: lot ? lot.v : null, hk: p.hk, lot: lot ? lot.lot : null, compact: true })}<p class="tiny">${lot ? `İşaret son partinin örnek analizini gösterir.` : "Bu ürünün parti analizi yakında eklenecek."} Tipik aralık yaklaşıktır; kodeks alt sınırı 300 mg/kg (kesikli çizgi).</p></div>`; })() : ""}
      ${p.s.length > 1 ? `<div class="sizes" role="group" aria-label="Seçenek">${p.s.map((x, i) => `<button class="sz" data-qsz="${i}" aria-pressed="${i === qvState.si}">${x.w}</button>`).join("")}</div>` : ""}
      <div class="qv-buy"><span class="price" style="font-size:30px">${s.o ? `<s>${fmt(s.o)}</s>` : ""}${fmt(s.p * qvState.q)}</span>
      <div class="stepper"><button data-qq="-1" aria-label="Azalt">−</button><output>${qvState.q}</output><button data-qq="1" aria-label="Arttır">+</button></div>
      <button class="add2" data-qadd>Sepete ekle</button></div></div></div>`;
    decorate($("#qvBody"));
  }
  $("#qvBody").addEventListener("click", (e) => {
    const sz = e.target.closest("[data-qsz]"), qq = e.target.closest("[data-qq]");
    if (sz) { qvState.si = +sz.dataset.qsz; sel[qvState.id] = qvState.si; renderQV(); }
    if (qq) { qvState.q = Math.max(1, Math.min(20, qvState.q + +qq.dataset.qq)); renderQV(); }
    if (e.target.closest("[data-qadd]")) { GA.add(qvState.id, qvState.si, qvState.q); closeQV(); render(); }
  });
  function closeQV() { qvEl.hidden = true; lastFocus && lastFocus.focus && lastFocus.focus(); }
  $("#qvClose").addEventListener("click", closeQV);
  qvEl.addEventListener("click", (e) => { if (e.target === qvEl) closeQV(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!qvEl.hidden) closeQV(); closeF(); } });

  /* ---- adres çubuğundaki bölüm (#bal, #ari, #takvim …) ---- */
  function fromHash() {
    const h = location.hash.slice(1);
    if (CATS[h]) { st.cats.clear(); st.cats.add(h); st.hk = null; render(); setTimeout(() => $("#urunler").scrollIntoView(), 60); }
  }
  addEventListener("hashchange", fromHash);

  buildCal(); renderNow(); render(); fromHash();

  /* ================= ARILAR VE BAL DAMLALARI ================= */
  if (reduce) return;
  const fx = $("#fx");
  const BEE = `<svg viewBox="0 0 40 30"><defs><clipPath id="bb"><ellipse cx="19" cy="18.5" rx="12" ry="8"/></clipPath></defs>
    <path d="M8 18.2 3 18.8 8 19.8z" fill="#241C05"/>
    <g clip-path="url(#bb)"><ellipse cx="19" cy="18.5" rx="12" ry="8" fill="#FFC629"/><rect x="14" y="8" width="3.2" height="22" fill="#241C05"/><rect x="20.5" y="8" width="3.2" height="22" fill="#241C05"/></g>
    <ellipse cx="19" cy="18.5" rx="12" ry="8" fill="none" stroke="#241C05" stroke-width="1.4"/>
    <circle cx="32" cy="17.5" r="5" fill="#241C05"/><circle cx="34" cy="16.3" r="1.3" fill="#fff"/>
    <path d="M33.5 13c1-3 3-4.5 5-4.6M31.5 13c0-3 1-5 2.6-6" fill="none" stroke="#241C05" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse class="wing" cx="17" cy="7" rx="6.5" ry="7" fill="#fff" fill-opacity=".8" stroke="#241C05" stroke-opacity=".45"/>
    <ellipse class="wing w2" cx="23" cy="7.5" rx="5.5" ry="6" fill="#fff" fill-opacity=".7" stroke="#241C05" stroke-opacity=".45"/></svg>`;
  const DROP = `<svg viewBox="0 0 12 16"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD25A"/><stop offset="1" stop-color="#C77D06"/></linearGradient></defs>
    <path d="M6 0C6 0 0 7.5 0 10.5A6 6 0 0 0 12 10.5C12 7.5 6 0 6 0Z" fill="url(#dg)"/><ellipse cx="4" cy="10" rx="1.4" ry="2.2" fill="#fff" opacity=".55"/></svg>`;
  let bees = 0;

  // Arı: bir kenardan girer, dalgalı bir yolla karşıya geçip çıkar. Aynı anda en fazla 2.
  function spawnBee() {
    if (document.hidden || bees >= 2) return;
    bees++;
    const b = document.createElement("div"); b.className = "fbee"; b.innerHTML = BEE; fx.appendChild(b);
    const W = innerWidth, H = innerHeight, dir = Math.random() < 0.5 ? 1 : -1;
    const y0 = H * (0.25 + Math.random() * 0.5), A = 30 + Math.random() * 40, f1 = 1 + Math.random(), ph = Math.random() * 6;
    const dur = 9000 + Math.random() * 4000, t0 = performance.now();
    const pos = (t) => [dir > 0 ? -50 + (W + 100) * t : W + 50 - (W + 100) * t, y0 + A * Math.sin(t * Math.PI * 2 * f1 + ph) + 18 * Math.sin(t * Math.PI * 7 + ph)];
    (function step(now) {
      const t = Math.min(1, (now - t0) / dur), [x, y] = pos(t), [x2, y2] = pos(Math.min(1, t + 0.004));
      const a = (Math.atan2(y2 - y, Math.abs(x2 - x) || 0.01) * 180) / Math.PI * 0.7;
      b.style.transform = `translate(${x - 16}px,${y - 12}px) scaleX(${dir}) rotate(${a}deg)`;
      t < 1 ? requestAnimationFrame(step) : (b.remove(), bees--);
    })(t0);
  }
  // Bal damlası: başlığın altında belirir, biraz sarkar, sonra düşüp kaybolur.
  function spawnDrop() {
    if (document.hidden) return;
    const hb = $("#siteHeader").getBoundingClientRect().bottom;
    const d = document.createElement("div"); d.className = "drip"; d.innerHTML = DROP;
    const x = innerWidth * (0.06 + Math.random() * 0.88);
    d.style.left = x + "px"; d.style.top = Math.max(0, hb - 3) + "px";
    fx.appendChild(d);
    const fall = innerHeight - hb + 40;
    const an = d.animate([
      { transform: "translateY(0) scale(.15,.1)", opacity: 0 },
      { transform: "translateY(0) scale(.7,.6)", opacity: 1, offset: 0.25 },
      { transform: "translateY(2px) scale(.85,1.15)", opacity: 1, offset: 0.42, easing: "cubic-bezier(.5,0,1,.6)" },
      { transform: `translateY(${fall * 0.7}px) scale(.8,1.35)`, opacity: 0.95, offset: 0.85 },
      { transform: `translateY(${fall}px) scale(.8,1.35)`, opacity: 0 },
    ], { duration: 2600, fill: "forwards" });
    an.onfinish = () => d.remove();
  }
  const DELAYS = [3000, 5000, 10000];
  (function dropLoop() { setTimeout(() => { spawnDrop(); dropLoop(); }, DELAYS[Math.floor(Math.random() * DELAYS.length)]); })();
  (function beeLoop(first) { setTimeout(() => { spawnBee(); beeLoop(); }, first ? 2500 : 9000 + Math.random() * 9000); })(true);
}
window.GA && GA.ready ? shopInit() : addEventListener("ga-ready", shopInit, { once: true });
