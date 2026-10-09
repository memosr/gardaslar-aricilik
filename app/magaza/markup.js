// Mağaza sayfasının orta bölümleri. İçerik public/magaza.js ile doldurulur.
const ico = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="5" height="5" rx="1.2"/><rect x="4" y="14" width="5" height="5" rx="1.2"/><path d="M12 7.5h8M12 16.5h8"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m5 12 4.5 4.5L19 7"/></svg>',
};

const markup = `
<main class="shop" id="shopTop">

  <!-- HASAT TAKVİMİ -->
  <section class="season" id="takvim">
    <div class="wrap">
      <nav class="crumbs" aria-label="Konum"><a href="/">Ana Sayfa</a><span aria-hidden="true">/</span><span>Mağaza</span></nav>
      <div class="season-top">
        <div class="season-head">
          <p class="eyebrow">Mağaza · Hasat Takvimi</p>
          <h1>Hangi bal, ne zaman <em>en taze?</em></h1>
          <p class="lede">Her bal kendi çiçeğinin mevsiminde olgunlaşır. Çerçeveli sütun içinde bulunduğumuz ay. Bir satıra tıklayın, o balın ayrıntısını ve ürünlerini görün.</p>
        </div>
        <div class="now-card" id="nowCard" aria-live="polite"></div>
      </div>
      <div class="hcal-wrap" tabindex="0" aria-label="Hasat takvimi tablosu, yana kaydırılabilir">
        <div class="hcal" id="hcal" role="table" aria-label="Bal türlerine göre 12 aylık hasat takvimi"></div>
      </div>
      <div class="hcal-foot">
        <div class="legend3"><span><i class="c-ak"></i>Akım (çiçeklenme)</span><span><i class="c-hs"></i>Hasat</span><span><i class="c-tz"></i>Yeni hasat stokta</span><span><i class="c-now"></i>Bu ay</span></div>
        <p class="tiny">Takvim Türkiye geneli için yaklaşıktır. Kendi arılıklarımızın tarihleri bölgeye ve yıla göre birkaç hafta kayabilir.</p>
      </div>
    </div>
  </section>

  <!-- ÜRÜNLER -->
  <section class="store" id="urunler">
    <div class="wrap">
      <div class="store-head">
        <div><p class="eyebrow">Ürünler</p><h2>Yayladan <em>kapınıza</em></h2></div>
        <div class="catpills" id="catPills" role="group" aria-label="Kategori"></div>
      </div>

      <div class="store-grid">
        <div class="fwrap" id="fwrap">
          <aside class="filters" aria-label="Filtreler">
            <div class="f-head"><h3>Filtreler</h3><button class="ic f-close" id="fClose" aria-label="Filtreleri kapat">${ico.close}</button></div>
            <fieldset><legend>Kategori</legend><div class="fcats" id="fCats"></div></fieldset>
            <fieldset><legend>Durum</legend>
              <label class="tg" for="fFresh"><input type="checkbox" id="fFresh"><span class="box">${ico.check}</span><span>Yeni hasat</span></label>
              <label class="tg" for="fSale"><input type="checkbox" id="fSale"><span class="box">${ico.check}</span><span>İndirimde</span></label>
            </fieldset>
            <fieldset><legend>Fiyat</legend>
              <input type="range" id="fMax" min="100" max="5000" step="50" value="5000" aria-label="En yüksek fiyat">
              <div class="range-val"><span>₺100</span><b id="fMaxVal">₺5.000 ve altı</b></div>
            </fieldset>
            <button class="btn line f-reset" id="fReset" type="button">Filtreleri temizle</button>
            <div class="f-help">
              <b>Arıcı mısınız?</b>
              <p>Kovan, çerçeve ve malzemede toplu siparişe özel fiyat veriyoruz.</p>
              <a class="link" href="#toptan">Toptan fiyat iste</a>
            </div>
            <button class="btn f-apply" id="fApply" type="button">Sonuçları göster</button>
          </aside>
        </div>

        <div class="results">
          <div class="toolbar">
            <button class="btn line f-open" id="fOpen" type="button">${ico.filter}<span>Filtreler</span><i id="fBadge" hidden></i></button>
            <label class="search" for="q">${ico.search}<input id="q" type="search" placeholder="Ürün ara: kestane, eldiven, polen…" autocomplete="off"></label>
            <label class="sort" for="sort"><span>Sırala</span>
              <select id="sort">
                <option value="rec">Önerilen</option>
                <option value="asc">Fiyat: düşükten yükseğe</option>
                <option value="desc">Fiyat: yüksekten düşüğe</option>
                <option value="az">Ada göre (A-Z)</option>
              </select>
            </label>
            <div class="view" role="group" aria-label="Görünüm">
              <button data-v="grid" aria-pressed="true" aria-label="Izgara görünümü">${ico.grid}</button>
              <button data-v="list" aria-pressed="false" aria-label="Liste görünümü">${ico.list}</button>
            </div>
          </div>
          <div class="active-row"><span class="count" id="count"></span><div class="chips" id="chips"></div></div>
          <div class="sgrid" id="sgrid"></div>
          <p class="mini-note">Ürün görselleri ve fiyatlar temsilidir. Ödeme sistemi sonraki aşamada bağlanacak.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ARICILARA ÖZEL -->
  <section class="pro" id="toptan">
    <div class="wrap">
      <div class="pro-card">
        <div class="pro-copy">
          <p class="eyebrow">Arıcılara özel</p>
          <h2>Kovan ve malzemede <em>toplu sipariş.</em></h2>
          <ul>
            <li>${ico.check}<span>10 kovan ve üzeri siparişte özel fiyat</span></li>
            <li>${ico.check}<span>Kendi kullandığımız, sahada denenmiş malzemeler</span></li>
            <li>${ico.check}<span>Yeni başlayanlara kurulum ve bakım desteği</span></li>
          </ul>
          <a class="btn" href="/#iletisim">Toptan Fiyat İste</a>
        </div>
        <div class="photo pro-photo" data-n="S1" data-d="Çiçekli bahçede kovanlar"></div>
      </div>
    </div>
  </section>

  <!-- SSS -->
  <section class="faq" id="sss">
    <div class="wrap faq-grid">
      <div><p class="eyebrow">Sık Sorulanlar</p><h2>Sipariş öncesi <em>merak edilenler</em></h2></div>
      <div class="faq-list">
        <details open><summary>Kargo ne kadar sürer?</summary><p>Siparişler 1-2 iş günü içinde kargoya verilir. 750 ₺ ve üzeri siparişlerde kargo ücretsizdir.</p></details>
        <details><summary>Cam kavanoz kırılırsa ne olur?</summary><p>Kavanozlar köpüklü kutularda gönderilir. Kırık ulaşan ürünü fotoğrafını göndermeniz halinde yeniden yollarız.</p></details>
        <details><summary>Balım kristalleşti, bozuldu mu?</summary><p>Hayır. Kristalleşme gerçek balın doğal halidir. Kavanozu 40 °C'yi geçmeyen ılık suda bekletirseniz tekrar akışkan olur.</p></details>
        <details><summary>Arı sütü nasıl gönderiliyor?</summary><p>Arı sütü buz kalıbıyla, yalıtımlı kutuda ve hafta başında gönderilir. Teslim aldığınızda buzdolabına koyun.</p></details>
        <details><summary>Arıcılık malzemelerinde değişim var mı?</summary><p>Kullanılmamış malzemeyi 14 gün içinde iade edebilir veya beden değişimi yapabilirsiniz.</p></details>
      </div>
    </div>
  </section>
</main>

<div class="qv" id="qv" hidden>
  <div class="qv-box" role="dialog" aria-modal="true" aria-labelledby="qvTitle">
    <button class="ic qv-close" id="qvClose" aria-label="Kapat">${ico.close}</button>
    <div id="qvBody"></div>
  </div>
</div>
<div class="fx" id="fx" aria-hidden="true"></div>
`;

export default markup;
