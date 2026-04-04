# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** `frontend.simulasyon.com` *(Canlıya alındığında güncellenecek)*

Bu dokümanda, **AI Destekli Borsa ve Kripto Simülasyonu** web uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) görevleri listelenmektedir. Her grup üyesi (UraniumZ ekibi), kendisine atanan sayfaların tasarımı, gerçek zamanlı verilerin (Kafka/Redis) arayüze entegrasyonu ve kullanıcı etkileşimlerinden sorumludur.

## Grup Üyelerinin Web Frontend Görevleri

1. [Furkan Alp Günay'ın Web Frontend Görevleri](./Furkan-Alp-Gunay/Furkan-Alp-Gunay-Web-Frontend-Gorevleri.md)
2. [Enes Çoban'ın Web Frontend Görevleri](./Enes-Coban/Enes-Coban-Web-Frontend-Gorevleri.md)
3. [Cem Karaca'nın Web Frontend Görevleri](./Cem-Karaca/Cem-Karaca-Web-Frontend-Gorevleri.md)
4. [Salih Arda Katırcıoğlu'nun Web Frontend Görevleri](./Salih-Arda-Katircioglu/Salih-Arda-Katircioglu-Web-Frontend-Gorevleri.md)
5. [Yakup Efe Çelebi'nin Web Frontend Görevleri](./Yakup-Efe-Celebi/Yakup-Efe-Celebi-Web-Frontend-Gorevleri.md)

---

## Genel Web Frontend Prensipleri



**1. Responsive (Duyarlı) Tasarım**
* **Mobile-First Approach:** Önce mobil cihazlar için optimize edilmiş ticaret panelleri, ardından tablet ve geniş ekranlı masaüstü görünümleri.
* **Breakpoints:** Mobile (< 768px), Tablet (768px - 1024px), Desktop (> 1024px). Geniş ekranlarda (Desktop) çoklu grafik ve derinlik tablosu gösterimi.
* **Flexible Layouts:** Alım-satım panelleri ve AI analiz modülleri için CSS Grid ve Flexbox mimarisi.
* **Touch-Friendly:** Mobilde hızlı emir girebilmek için minimum 44x44px dokunmatik hedef (touch target) alanları.

**2. Tasarım Sistemi ve Finansal Temalar**
* **CSS Framework:** Tailwind CSS, Bootstrap veya Material-UI.
* **Renk Paleti & Tema:** Borsa standartlarına uygun yeşil/kırmızı tonlar, AI modülleri için fütüristik renkler. Göz yormaması için zorunlu **Dark Mode (Karanlık Tema)** desteği (CSS variables ile).
* **Tipografi:** Rakamların ve fiyatların hizalı görünmesi için Monospaced (eşit aralıklı) font destekli tipografi.
* **Component Library:** Emir defteri, fiyat grafiği, portföy özeti gibi tekrar kullanılabilir (reusable) UI bileşenleri.

**3. Performans Optimizasyonu**
* **Canlı Grafik Performansı:** Saniyede birden fazla güncellenen borsa grafikleri için DOM manipülasyonu yerine Canvas/WebGL tabanlı kütüphaneler (örn. Lightweight Charts).
* **Code Splitting & Lazy Loading:** Sadece kullanıcının girdiği sayfaların (Route-based) ve ağır grafik bileşenlerinin sonradan yüklenmesi.
* **Minification & Compression:** Gzip/Brotli sıkıştırma, CSS ve JS küçültme (minification).
* **Caching:** Hızlı açılış için tarayıcı önbellekleme ve PWA (Service Worker) altyapısı.

**4. SEO (Search Engine Optimization)**
* **Meta Tags & Dinamik Başlıklar:** Her hisse/kripto detay sayfası için dinamik title ve description yönetimi (Örn: "BTC/USDT Anlık Fiyat ve AI Analizi").
* **Semantic HTML:** Ekran okuyucular ve arama motorları için doğru HTML5 etiketleri (nav, main, article).
* **Sitemap & Robots.txt:** Arama motoru tarama kuralları.

**5. Erişilebilirlik (Accessibility)**
* **WCAG 2.1 AA Compliance:** Minimum erişilebilirlik standardına uyum.
* **Klavye Navigasyonu:** Fare kullanmadan "Tab" tuşuyla alım-satım formları arasında hızlı geçiş (Focus management).
* **Renk Kontrastı:** Fiyat değişim renklerinin (yeşil/kırmızı) renk körü kullanıcılar için uygun kontrastta veya ikon/ok işaretleriyle desteklenmesi.

**6. Browser Compatibility (Tarayıcı Uyumluluğu)**
* **Modern Browsers:** Chrome, Firefox, Safari, Edge (son 2 versiyon).
* **Graceful Degradation:** Eski tarayıcılarda WebSocket veya gelişmiş grafikler desteklenmiyorsa standart REST tabanlı yedek (fallback) gösterimler.

**7. State Management (Durum Yönetimi)**
* **Global State:** Kullanıcı bakiyesi ve oturum bilgileri için Redux, Zustand veya Context API.
* **Server & Real-time State:** REST istekleri için React Query/SWR ve anlık WebSocket fiyat akışları için özel hook'lar.
* **Form State:** Karmaşık alım-satım ve limit emri formları için formik veya React Hook Form.

**8. Routing (Yönlendirme)**
* **Protected Routes:** Sadece giriş yapmış kullanıcıların Portföy ve İşlem panellerine erişebilmesi (Authentication guards).
* **Client-Side Routing:** Sayfa yenilenmeden hisseler arası anında geçiş (React Router, Vue Router).
* **404 Handling:** Olmayan bir hisse veya sayfa arandığında özel 404 sayfası.

**9. API ve WebSocket Entegrasyonu**
* **Gerçek Zamanlı Veri (WebSocket/SSE):** Saniyelik fiyat güncellemeleri, anlık emir defteri ve AI bildirimleri için kesintisiz bağlantı yönetimi.
* **HTTP Client:** Güvenli REST istekleri için Axios veya Fetch API.
* **Interceptors:** API isteklerine otomatik JWT Token ekleme ve yetki (401) hatasında otomatik Token yenileme (Refresh Token).
* **Loading States:** API cevabı veya AI analizi beklenirken arayüzde iskelet yükleme (skeleton loader) gösterimi.

**10. Testing (Test Süreçleri)**
* **Unit Tests:** Alım-satım hesaplama fonksiyonları (komisyon, toplam tutar) için Jest/Vitest.
* **E2E Tests:** Kullanıcının giriş yapıp hisse alma senaryosunun baştan sona testi (Cypress veya Playwright).

**11. Build ve Deployment (Derleme ve Dağıtım)**
* **Build Tool:** Yüksek hız için Vite, Next.js veya Webpack.
* **Environment Variables:** API URL'leri ve gizli anahtarlar için `.env` yapılandırması.
* **CI/CD & Hosting:** GitHub Actions üzerinden Vercel, Netlify veya AWS'ye otomatik dağıtım süreçleri.
