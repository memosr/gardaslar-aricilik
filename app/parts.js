// İki sayfanın ortak HTML parçaları: duyuru, menü, alt bilgi, sepet ve mobil menü.

const chev =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>';
const close =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const logo = (bg, fg) =>
  `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 36 11v18L20 38 4 29V11z" fill="${bg}"/><path d="M20 10 28 14.5v9L20 28l-8-4.5v-9z" fill="none" stroke="${fg}" stroke-width="2"/><circle cx="20" cy="19" r="2.6" fill="${fg}"/></svg>`;

export function top(active = "home") {
  const on = (k) => (active === k ? ' class="on" aria-current="page"' : "");
  return `
<div class="announce">
  <div class="wrap">
    <div class="msg"><span>750 ₺ üzeri siparişlerde kargo ücretsiz</span><span>Her parti laboratuvar analizli</span><span>Üreticiden doğrudan kapınıza</span></div>
    <div class="side"><span>+90 5XX XXX XX XX</span><span>TR | EN</span></div>
  </div>
</div>

<header class="header" id="siteHeader">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Gardaşlar Arıcılık ana sayfa">
      ${logo("#FFC629", "#241C05")}
      <span><b>Gardaşlar</b><small>Arıcılık · 1987</small></span>
    </a>
    <ul class="menu">
      <li><button aria-haspopup="true">Kurumsal ${chev}</button>
        <div class="drop"><a href="/#kurumsal">Hakkımızda</a><a href="/#kurumsal">Vizyon ve Misyon</a><a href="/#tarihce">Tarihçe</a><a href="/#parti">Kalite ve Analiz</a></div></li>
      <li><a href="/magaza"${on("shop")}>Mağaza ${chev}</a>
        <div class="drop mega">
          <div><h4>Ballar</h4><a href="/magaza#bal">Süzme Ballar</a><a href="/magaza#petek">Petek Bal</a><a href="/magaza#hediye">Hediye Kutuları</a><a href="/magaza#takvim">Hasat Takvimi</a></div>
          <div><h4>Arı Ürünleri</h4><a href="/magaza#ari">Polen</a><a href="/magaza#ari">Propolis</a><a href="/magaza#ari">Arı Sütü</a><a href="/magaza#ari">Balmumu</a></div>
          <div><h4>Arıcılık Malzemeleri</h4><a href="/magaza#malzeme">Kovan ve Çerçeve</a><a href="/magaza#malzeme">Koruyucu Giyim</a><a href="/magaza#malzeme">El Aletleri</a><a href="/magaza#malzeme">Başlangıç Seti</a></div>
          <div class="photo" data-n="M1" data-d="Menü görseli: kavanozlar yan yana, dikey"></div>
        </div></li>
      <li><a href="/#galeri">Galeri</a></li>
      <li><a href="/#blog">Bal Rehberi</a></li>
      <li><a href="/#iletisim">İletişim</a></li>
    </ul>
    <div class="icons">
      <button class="ic hide-sm" aria-label="Ara" data-toast="Arama özelliği sonraki aşamada"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>
      <button class="ic hide-sm" aria-label="Hesabım" data-toast="Üyelik sistemi sonraki aşamada"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></button>
      <button class="ic" aria-label="Favoriler" data-toast="Favori listesi sonraki aşamada"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg><span class="count" id="favCount" hidden>0</span></button>
      <button class="ic" aria-label="Sepet" id="cartBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="count" id="cartCount" hidden>0</span></button>
      <button class="ic burger" aria-label="Menüyü aç" id="burger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    </div>
  </div>
</header>`;
}

export function bottom() {
  return `
<footer>
  <div class="wrap">
    <div class="ft">
      <div class="about">
        <a class="brand" href="/">${logo("#241C05", "#FFC629")}<span><b>Gardaşlar</b><small>Arıcılık · 1987</small></span></a>
        <p>Üç kuşaktır yayla arıcılığı. Katkısız, analizli, üreticiden sofranıza.</p>
        <div class="social">
          <a href="/#iletisim" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
          <a href="/#iletisim" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg></a>
          <a href="/#iletisim" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg></a>
        </div>
      </div>
      <div><h4>Kurumsal</h4><a href="/#kurumsal">Hakkımızda</a><a href="/#kurumsal">Vizyon ve Misyon</a><a href="/#tarihce">Tarihçe</a><a href="/#parti">Kalite</a></div>
      <div><h4>Mağaza</h4><a href="/magaza#bal">Ballar</a><a href="/magaza#ari">Arı Ürünleri</a><a href="/magaza#malzeme">Arıcılık Malzemeleri</a><a href="/magaza#takvim">Hasat Takvimi</a></div>
      <div><h4>Yardım</h4><a href="/#iletisim">Sipariş Takibi</a><a href="/#iletisim">Kargo ve İade</a><a href="/magaza#sss">Sık Sorulanlar</a><a href="/#iletisim">İletişim</a></div>
      <div><h4>Sözleşmeler</h4><a href="/#iletisim">KVKK Aydınlatma</a><a href="/#iletisim">Mesafeli Satış</a><a href="/#iletisim">Çerez Politikası</a></div>
    </div>
    <div class="ft-bot"><span>© 2026 Gardaşlar Arıcılık · Tüm hakları saklıdır</span><div class="pay"><span>VISA</span><span>MASTERCARD</span><span>TROY</span></div></div>
  </div>
</footer>

<a class="wa" href="/#iletisim" aria-label="WhatsApp ile yazın"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg></a>

<div class="sheet left" id="msheet" hidden>
  <div class="panel">
    <div class="sheet-head"><h3>Menü</h3><button class="ic" id="mclose" aria-label="Kapat">${close}</button></div>
    <nav class="mnav">
      <small>Mağaza</small><a href="/magaza">Tüm Ürünler</a><a href="/magaza#takvim">Hasat Takvimi</a><a href="/magaza#bal">Ballar</a><a href="/magaza#ari">Arı Ürünleri</a><a href="/magaza#malzeme">Arıcılık Malzemeleri</a>
      <small>Kurumsal</small><a href="/#kurumsal">Hakkımızda</a><a href="/#tarihce">Tarihçe</a><a href="/#parti">Parti Sorgula</a>
      <small>Diğer</small><a href="/#galeri">Galeri</a><a href="/#blog">Bal Rehberi</a><a href="/#iletisim">İletişim</a>
    </nav>
  </div>
</div>

<div class="sheet right" id="csheet" hidden>
  <div class="panel">
    <div class="sheet-head"><h3>Sepetim</h3><button class="ic" id="cclose" aria-label="Kapat">${close}</button></div>
    <div class="ship" id="ship"></div>
    <div class="cart-items" id="citems"></div>
    <div class="cart-foot"><div class="sum"><span>Toplam</span><span id="ctotal">₺0</span></div><button class="btn" id="checkout" style="justify-content:center">Siparişi Tamamla</button></div>
  </div>
</div>
<div class="toast" id="toast" hidden role="status"></div>`;
}
