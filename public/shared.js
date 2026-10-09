/* Gardaşlar Arıcılık: iki sayfanın ortak kodu
   Ürün kataloğu, sepet (tarayıcıda saklanır), menüler, bildirim ve görsel yer tutucular. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => "₺" + n.toLocaleString("tr-TR");
  const esc = (s) => String(s).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]);

  /* ---------- ÜRÜN KATALOĞU (fiyatlar ve görseller temsilidir) ----------
     cat: bal | petek | ari | malzeme | hediye
     hk: hasat takvimindeki bal türü, prof: [tatlılık, aroma, koyuluk] 1-5 */
  const CATS = { bal: "Ballar", petek: "Petek Bal", ari: "Arı Ürünleri", malzeme: "Arıcılık Malzemeleri", hediye: "Hediye Kutuları" };
  const P = [
    { id: 1, cat: "bal", n: "Yayla Çiçek Balı", hk: "cicek", ic: "jar", col: "#E9A93A", tone: "Açık amber", prof: [4, 3, 2], kr: "Orta", tag: "Çok satan", feat: 1,
      d: "Kekik, geven ve yonca ağırlıklı yayla çiçeklerinden. Yumuşak, çiçeksi ve dengeli.", s: [{ w: "450 g", p: 390 }, { w: "850 g", p: 690, o: 790 }] },
    { id: 2, cat: "bal", n: "Kestane Balı", hk: "kestane", ic: "jar", col: "#5E2E0C", tone: "Koyu kahve", prof: [2, 5, 5], kr: "Yavaş", feat: 1,
      d: "Koyu renkli, hafif acımsı ve keskin aromalı. Mineral açısından zengin.", s: [{ w: "450 g", p: 490 }, { w: "850 g", p: 890 }] },
    { id: 3, cat: "bal", n: "Karakovan Balı", hk: "karakovan", ic: "jar", col: "#B8650F", tone: "Amber", prof: [4, 4, 3], kr: "Orta", tag: "Sınırlı", feat: 1,
      d: "Kütük kovanlarda, temel petek kullanılmadan arının kendi ördüğü petekten.", s: [{ w: "500 g", p: 1150 }] },
    { id: 4, cat: "bal", n: "Çam Balı", hk: "cam", ic: "jar", col: "#8A4B12", tone: "Koyu amber", prof: [2, 3, 4], kr: "Çok yavaş",
      d: "Çam ağaçlarının salgısından. Az tatlı, uzun süre kristalleşmez.", s: [{ w: "450 g", p: 420 }, { w: "850 g", p: 760 }] },
    { id: 5, cat: "bal", n: "Ayçiçek Balı", hk: "aycicek", ic: "jar", col: "#F2C21B", tone: "Parlak sarı", prof: [5, 2, 1], kr: "Hızlı",
      d: "Tatlı ve hafif. Çabuk kristalleşir, kremamsı bir kıvam alır.", s: [{ w: "450 g", p: 320 }, { w: "850 g", p: 560 }] },
    { id: 6, cat: "bal", n: "Kekik Balı", hk: "kekik", ic: "jar", col: "#D59A2E", tone: "Amber", prof: [3, 5, 3], kr: "Orta",
      d: "Kekik çiçeklerinden, belirgin ve baharatlı bir aroma.", s: [{ w: "450 g", p: 520 }] },
    { id: 7, cat: "bal", n: "Narenciye Balı", hk: "narenciye", ic: "jar", col: "#F0CF6E", tone: "Çok açık", prof: [4, 4, 1], kr: "Hızlı",
      d: "Portakal ve limon çiçeklerinden, ferah kokulu bahar balı.", s: [{ w: "450 g", p: 440 }] },
    { id: 8, cat: "petek", n: "Kasa Petek Bal", hk: "cicek", ic: "comb", col: "#E9A93A", tone: "Açık amber", prof: [4, 3, 2], kr: "Orta", feat: 1,
      d: "Ahşap kasada, arının sırladığı haliyle bütün petek.", s: [{ w: "1 kg", p: 990 }, { w: "2 kg", p: 1890 }] },
    { id: 9, cat: "petek", n: "Kesme Petek", hk: "cicek", ic: "comb", col: "#E9A93A", tone: "Açık amber", prof: [4, 3, 2], kr: "Orta",
      d: "Kahvaltılık boyda kesilmiş petek, cam kapta.", s: [{ w: "450 g", p: 520 }] },
    { id: 10, cat: "petek", n: "Karakovan Petek", hk: "karakovan", ic: "comb", col: "#B8650F", tone: "Amber", prof: [4, 4, 3], kr: "Orta", tag: "Sınırlı",
      d: "Kütük kovandan çıkan doğal petek. Yılda bir kez hasat edilir.", s: [{ w: "1 kg", p: 1450 }] },
    { id: 11, cat: "ari", n: "Taze Polen", hk: "polen", ic: "dish", feat: 1,
      d: "Yayla çiçeklerinden toplanan, düşük ısıda kurutulmuş arı poleni.", s: [{ w: "250 g", p: 420 }, { w: "500 g", p: 790 }] },
    { id: 12, cat: "ari", n: "Arı Sütü", hk: "arisutu", ic: "bottle",
      d: "Soğuk zincirle, buz kalıbıyla gönderilir. Buzdolabında saklayın.", s: [{ w: "20 g", p: 690 }] },
    { id: 13, cat: "ari", n: "Propolis Damla", hk: "propolis", ic: "bottle",
      d: "Su bazlı, alkolsüz propolis ekstresi. Damlalıklı şişede.", s: [{ w: "20 ml", p: 290 }, { w: "50 ml", p: 590 }] },
    { id: 14, cat: "ari", n: "Ham Propolis", hk: "propolis", ic: "dish", feat: 1,
      d: "Kovan içinden kazınan, işlenmemiş doğal reçine.", s: [{ w: "50 g", p: 360 }] },
    { id: 15, cat: "ari", n: "Saf Balmumu", ic: "wax",
      d: "Kendi kovanlarımızın süzülmüş balmumu. Mum ve kozmetik yapımı için.", s: [{ w: "250 g", p: 240 }, { w: "1 kg", p: 820 }] },
    { id: 16, cat: "malzeme", n: "Langstroth Kovan", ic: "hive", tag: "Arıcılara", feat: 1,
      d: "Çam ağacından, 10 çerçeveli standart ahşap kovan. Dip tahtası ve kapak dahil.", s: [{ w: "Boyasız", p: 2450 }, { w: "Boyalı", p: 2750 }] },
    { id: 17, cat: "malzeme", n: "Telli Çerçeve", ic: "frame",
      d: "Langstroth ölçüsünde, paslanmaz tel gerili hazır çerçeve.", s: [{ w: "10'lu paket", p: 380 }, { w: "50'li paket", p: 1750 }] },
    { id: 18, cat: "malzeme", n: "Petek Temel", ic: "wax",
      d: "Saf balmumundan preslenmiş temel petek levha.", s: [{ w: "1 kg", p: 690 }] },
    { id: 19, cat: "malzeme", n: "Arıcı Maskesi", ic: "hat",
      d: "Geniş kenarlı şapka ve tül yüz koruması. Hafif ve havadar.", s: [{ w: "Standart", p: 290 }] },
    { id: 20, cat: "malzeme", n: "Arıcı Eldiveni", ic: "glove",
      d: "Keçi derisinden, uzun bilekli ve havalandırmalı.", s: [{ w: "M", p: 260 }, { w: "L", p: 260 }, { w: "XL", p: 260 }] },
    { id: 21, cat: "malzeme", n: "Arıcı Tulumu", ic: "suit",
      d: "Fermuarlı başlıklı tam boy tulum. Kalın pamuklu kumaş.", s: [{ w: "M", p: 1290 }, { w: "L", p: 1290 }, { w: "XL", p: 1290 }] },
    { id: 22, cat: "malzeme", n: "Paslanmaz Körük", ic: "smoker",
      d: "Isı kalkanlı, deri körüklü paslanmaz duman makinesi.", s: [{ w: "Orta boy", p: 540 }] },
    { id: 23, cat: "malzeme", n: "Kovan Maşası", ic: "tool",
      d: "Paslanmaz çelik, çerçeve ayırma ve kazıma için çift uçlu.", s: [{ w: "Standart", p: 140 }] },
    { id: 24, cat: "malzeme", n: "Çift Katlı Bal Süzgeci", ic: "strainer",
      d: "Kovaya oturan, iki kat paslanmaz elekli süzgeç.", s: [{ w: "Standart", p: 420 }] },
    { id: 25, cat: "malzeme", n: "Ana Arı Kafesi", ic: "cage",
      d: "Ana arı taşıma ve tanıtma kafesi, şeker bölmeli.", s: [{ w: "10'lu paket", p: 120 }] },
    { id: 26, cat: "malzeme", n: "Yeni Başlayan Arıcı Seti", ic: "hive", tag: "Set",
      d: "Kovan, 10 telli çerçeve, maske, eldiven, körük ve maşa bir arada.", s: [{ w: "Tam set", p: 4250, o: 4900 }] },
    { id: 27, cat: "hediye", n: "Tadım Kutusu", ic: "gift", tag: "Hediye", feat: 1,
      d: "Çiçek, kestane ve çam balından 3 x 250 g, ahşap kutuda.", s: [{ w: "3 x 250 g", p: 1290, o: 1450 }] },
    { id: 28, cat: "hediye", n: "Kahvaltı Seti", ic: "gift",
      d: "Kesme petek, çiçek balı ve polen. Kahvaltı sofrası için hazır.", s: [{ w: "3 parça", p: 1690 }] },
    { id: 29, cat: "hediye", n: "Kurumsal Hediye Kutusu", ic: "gift",
      d: "Logolu kutu ve kartla. 10 adet üzeri siparişte indirim için yazın.", s: [{ w: "Kutu başı", p: 990 }] },
  ];

  /* ---------- HASAT TAKVİMİ (Türkiye geneli için yaklaşık) ---------- */
  const HONEY = [
    { k: "narenciye", n: "Narenciye balı", col: "#F0CF6E", ak: [4], hs: [5], note: "Akdeniz kıyısında portakal çiçeğiyle başlayan ilk bal." },
    { k: "arisutu", n: "Arı sütü", col: "#E3CF94", ak: [], hs: [5, 6], note: "Bahar gelişiminde, kovanların en güçlü olduğu haftalarda üretilir." },
    { k: "polen", n: "Polen", col: "#E39B1B", ak: [], hs: [4, 5, 6, 7], note: "Kovan girişindeki polen tuzaklarıyla bahar boyunca toplanır." },
    { k: "kekik", n: "Kekik balı", col: "#D59A2E", ak: [6], hs: [7], note: "Kekik çiçeklenince kısa ve yoğun bir akım olur." },
    { k: "cicek", n: "Yayla çiçek balı", col: "#E9A93A", ak: [6, 7], hs: [8], note: "Yayla çiçekleri yaz boyunca açar, hasat ağustosta yapılır." },
    { k: "aycicek", n: "Ayçiçek balı", col: "#F2C21B", ak: [7], hs: [8], note: "Ayçiçek tarlalarının çiçeklendiği temmuzun ürünü." },
    { k: "kestane", n: "Kestane balı", col: "#5E2E0C", ak: [6, 7], hs: [8, 9], note: "Kestane ağaçları haziranda çiçeklenir, bal yaz sonunda alınır." },
    { k: "karakovan", n: "Karakovan balı", col: "#B8650F", ak: [6, 7, 8], hs: [9], note: "Kütük kovanlardan yılda bir kez, sonbahar başında kesilir." },
    { k: "propolis", n: "Propolis", col: "#4A2A0A", ak: [], hs: [8, 9, 10], note: "Arılar kışa hazırlanırken kovanı propolisle kaplar." },
    { k: "cam", n: "Çam balı", col: "#8A4B12", ak: [8, 9, 10], hs: [9, 10, 11], note: "Çam ağaçlarındaki salgıdan; Ege'de sonbahar boyunca alınır." },
  ];
  const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const NOW = new Date().getMonth() + 1;
  // Bu ay: hasatta | taze (hasattan sonraki 2 ay) | akım | sezon dışı
  function status(h, m = NOW) {
    if (h.hs.includes(m)) return "hasat";
    if (h.hs.some((x) => (m - x + 12) % 12 <= 2 && (m - x + 12) % 12 > 0)) return "taze";
    if (h.ak.includes(m)) return "akim";
    return "dis";
  }
  const fresh = (p) => { const h = HONEY.find((x) => x.k === p.hk); return !!h && ["hasat", "taze"].includes(status(h)); };

  /* ---------- İKONLAR (ürün fotoğrafı gelene kadar) ---------- */
  const IC = {
    jar: '<rect x="30" y="10" width="40" height="14" rx="4"/><rect x="22" y="24" width="56" height="68" rx="13"/><rect x="31" y="48" width="38" height="24" rx="3"/>',
    comb: '<rect x="14" y="20" width="72" height="62" rx="4"/><path d="M8 20h84"/><path d="M30 38l7-4 7 4v8l-7 4-7-4zM44 38l7-4 7 4v8l-7 4-7-4zM58 38l7-4 7 4v8l-7 4-7-4zM37 50l7-4 7 4v8l-7 4-7-4zM51 50l7-4 7 4v8l-7 4-7-4z"/>',
    frame: '<path d="M8 18h84M16 18v66h68V18"/><path d="M16 36h68M16 52h68M16 68h68" stroke-dasharray="3 4"/>',
    dish: '<path d="M14 62h72a36 18 0 0 1-72 0z"/><circle cx="36" cy="54" r="5"/><circle cx="48" cy="50" r="5"/><circle cx="60" cy="54" r="5"/><circle cx="54" cy="44" r="5"/><circle cx="42" cy="42" r="5"/>',
    bottle: '<circle cx="50" cy="16" r="8"/><rect x="43" y="24" width="14" height="12"/><rect x="34" y="36" width="32" height="54" rx="7"/><rect x="40" y="56" width="20" height="20" rx="2"/>',
    wax: '<rect x="18" y="34" width="64" height="44" rx="5"/><path d="M18 46h64"/><path d="M38 56l6-3 6 3v7l-6 3-6-3zM50 56l6-3 6 3v7l-6 3-6-3z"/>',
    hive: '<path d="M12 30 50 12l38 18"/><rect x="18" y="30" width="64" height="22"/><rect x="18" y="52" width="64" height="22"/><rect x="18" y="74" width="64" height="12"/><path d="M40 86h20"/>',
    hat: '<ellipse cx="50" cy="38" rx="38" ry="8"/><path d="M32 38q0-22 18-22t18 22"/><path d="M22 44l4 42q24 8 48 0l4-42"/><path d="M36 48v34M50 48v38M64 48v34" stroke-dasharray="2 4"/>',
    glove: '<path d="M36 86V50q0-7 6-7V22q0-6 5-6t5 6v18-22q0-6 5-6t5 6v22-18q0-6 5-6t5 6v38q0 14-8 22v8z"/><path d="M34 76h36"/>',
    suit: '<path d="M38 14h24v14l16 10-6 12-8-6v46H52V64h-4v26H36V44l-8 6-6-12 16-10z"/><path d="M50 30v30"/>',
    smoker: '<rect x="26" y="40" width="32" height="48" rx="4"/><path d="M30 40q2-18 16-18l8 8-4 10"/><path d="M58 50l26-6v34l-26-4"/><path d="M48 14q-6-4 0-8M56 16q-4-6 2-10" />',
    tool: '<path d="M20 78 66 32l14-6-6 14-46 46z"/><circle cx="68" cy="38" r="3"/>',
    strainer: '<path d="M10 34h80l-14 40H24z"/><path d="M22 46h56M26 58h48M30 70h40"/><path d="M4 34h8M88 34h8"/>',
    cage: '<rect x="30" y="28" width="40" height="52" rx="3"/><path d="M30 42h40M30 56h40M30 70h40M43 28v52M57 28v52"/><path d="M38 28v-8h24v8"/>',
    gift: '<rect x="20" y="42" width="60" height="44"/><rect x="16" y="30" width="68" height="12"/><path d="M50 30v56"/><path d="M50 30q-14-18-20-8t20 8q14-18 20-8t-20 8"/>',
  };
  const icon = (k, cls = "pic") => `<svg class="${cls}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${IC[k] || IC.jar}</svg>`;

  /* ---------- FOTOĞRAF YER TUTUCULARI ---------- */
  const CAM = '<svg class="cam" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="4"/></svg>';
  const SRC = { "09": "/media/foto3.jpg", 12: "/media/foto2.jpg", 13: "/media/foto1.jpg", 14: "/media/foto4.jpg", 19: "/media/foto3.jpg", 20: "/media/foto1.jpg", 22: "/media/foto2.jpg", 23: "/media/foto4.jpg", S1: "/media/foto2.jpg" };
  function photo(el) {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    const n = el.dataset.n, d = el.dataset.d || "";
    if (SRC[n]) { el.insertAdjacentHTML("afterbegin", `<img class="real" src="${SRC[n]}" alt="${esc(d)}" decoding="async">`); el.classList.remove("lite"); return; }
    const lab = /^\d+$/.test(n) ? "FOTOĞRAF " + n : n.startsWith("P") ? "ÜRÜN FOTO " + n.slice(1) : n.startsWith("V") ? "VİDEO " + n.slice(1) : "GÖRSEL " + n;
    el.insertAdjacentHTML("beforeend", (el.dataset.ic ? icon(el.dataset.ic) : CAM) + (el.dataset.nolbl ? "" : `<span class="lbl"><b>${lab}</b>${d ? `<span>${esc(d)}</span>` : ""}</span>`));
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", lab + (d ? ": " + d : ""));
  }
  const decorate = (root = document) => $$(".photo", root).forEach(photo);

  /* ---------- BİLDİRİM ---------- */
  let tt;
  function say(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(() => (t.hidden = true), 2600); }

  /* ---------- SEPET (bu tarayıcıda saklanır) ---------- */
  const KEY = "ga-cart-v1", FREE = 750;
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || "[]").filter((c) => P.some((p) => p.id === c.id)); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const byId = (id) => P.find((p) => p.id === id);
  function count() { const n = cart.reduce((a, c) => a + c.q, 0); const c = $("#cartCount"); if (c) { c.textContent = n; c.hidden = !n; } }
  function add(id, si = 0, q = 1) {
    const p = byId(id); if (!p) return;
    const ex = cart.find((c) => c.id === id && c.si === si);
    ex ? (ex.q += q) : cart.push({ id, si, q });
    save(); count(); renderCart();
    say(`${p.n}${p.s.length > 1 ? " (" + p.s[si].w + ")" : ""} sepete eklendi`);
  }
  function renderCart() {
    const box = $("#citems"); if (!box) return;
    let tot = 0;
    if (!cart.length) box.innerHTML = '<p class="empty">Sepetiniz boş. Yayladan bir kavanoz ekleyin.</p>';
    else {
      box.innerHTML = cart.map((c, i) => {
        const p = byId(c.id), s = p.s[c.si]; tot += s.p * c.q;
        return `<div class="ci"><div class="photo lite" data-n="P${p.id}" data-ic="${p.ic}" data-nolbl="1"></div><div><b>${p.n}</b><small>${s.w}</small>
        <div class="qty"><button data-q="-1" data-i="${i}" aria-label="Azalt">−</button><span>${c.q}</span><button data-q="1" data-i="${i}" aria-label="Arttır">+</button></div></div>
        <span class="price" style="font-size:18px">${fmt(s.p * c.q)}</span></div>`;
      }).join("");
      decorate(box);
    }
    $("#ctotal").textContent = fmt(tot);
    const left = FREE - tot;
    $("#ship").innerHTML = (left > 0 ? `Ücretsiz kargo için <b>${fmt(left)}</b> daha ekleyin.` : "Kargonuz ücretsiz.") + `<div class="bar2"><i style="width:${Math.min(100, (tot / FREE) * 100)}%"></i></div>`;
  }

  /* ---------- MENÜLER ---------- */
  function wire() {
    const ms = $("#msheet"), cs = $("#csheet");
    $("#burger").onclick = () => (ms.hidden = false);
    $("#mclose").onclick = () => (ms.hidden = true);
    ms.addEventListener("click", (e) => { if (e.target === ms || e.target.tagName === "A") ms.hidden = true; });
    $("#cartBtn").onclick = () => { renderCart(); cs.hidden = false; };
    $("#cclose").onclick = () => (cs.hidden = true);
    cs.addEventListener("click", (e) => { if (e.target === cs) cs.hidden = true; });
    $("#citems").addEventListener("click", (e) => {
      const b = e.target.closest("[data-q]"); if (!b) return;
      const c = cart[+b.dataset.i]; c.q += +b.dataset.q;
      if (c.q <= 0) cart.splice(+b.dataset.i, 1);
      save(); count(); renderCart();
    });
    $("#checkout").onclick = () => say(cart.length ? "Ödeme adımı sonraki aşamada eklenecek" : "Önce sepete ürün ekleyin");
    $$("[data-toast]").forEach((b) => b.addEventListener("click", () => say(b.dataset.toast)));
    addEventListener("keydown", (e) => { if (e.key === "Escape") { ms.hidden = true; cs.hidden = true; } });
    count();
    decorate(document);
  }

  window.GA = { $, $$, fmt, esc, P, CATS, HONEY, MONTHS, NOW, status, fresh, icon, decorate, say, add, byId, reduce: matchMedia("(prefers-reduced-motion: reduce)").matches };
  const boot = () => { wire(); window.GA.ready = true; dispatchEvent(new Event("ga-ready")); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
