# Mobil Frontend Görev Dağılımı

Bu dokümanda, **AI Destekli Borsa ve Kripto Simülasyonu** mobil uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) görevleri listelenmektedir. Her grup üyesi (UraniumZ ekibi), kendisine atanan ekranların tasarımı, API entegrasyonlarının arayüze yansıtılması ve kullanıcı etkileşimlerinden sorumludur.

## Grup Üyelerinin Mobil Frontend Görevleri

1. [Furkan Alp Günay'ın Mobil Frontend Görevleri](./Furkan-Alp-Gunay/Furkan-Alp-Gunay-Mobil-Frontend-Gorevleri.md)
2. [Enes Çoban'ın Mobil Frontend Görevleri](./Enes-Coban/Enes-Coban-Mobil-Frontend-Gorevleri.md)
3. [Cem Karaca'nın Mobil Frontend Görevleri](./Cem-Karaca/Cem-Karaca-Mobil-Frontend-Gorevleri.md)
4. [Salih Arda Katırcıoğlu'nun Mobil Frontend Görevleri](./Salih-Arda-Katircioglu/Salih-Arda-Katircioglu-Mobil-Frontend-Gorevleri.md)
5. [Yakup Efe Çelebi'nin Mobil Frontend Görevleri](./Yakup-Efe-Celebi/Yakup-Efe-Celebi-Mobil-Frontend-Gorevleri.md)

---

## Genel Mobil Frontend Prensipleri

**1. Tasarım Sistemi ve Finansal Temalar**
* **Renk Paleti:** Finans standartlarına uygun renk kullanımı (Yükseliş için belirgin yeşil, düşüş için kırmızı, yapay zeka vurguları için neon/mavi tonlar).
* **Tema Desteği:** Borsa uygulamalarında kritik olan, göz yormayan **Dark Mode (Karanlık Tema)** ve Light Mode desteği.
* **Tipografi:** Rakamların (fiyatların) net okunabilmesi için "Monospaced" (eşit aralıklı) font ağırlıkları kullanımı.
* **Iconography:** Standart icon seti kullanımı (Material Icons/SF Symbols).

**2. Responsive (Duyarlı) Tasarım**
* **Grafik Görünümleri:** Borsa grafiklerinin daha iyi incelenebilmesi için Landscape (Yatay) mod desteği.
* Farklı ekran boyutlarına uyum (phone, tablet).
* Safe area desteği (notch, status bar - özellikle grafik tam ekran yapıldığında).

**3. Kullanıcı Deneyimi (UX) ve Geri Bildirim**
* **Anlık Değişimler:** Canlı piyasa verilerinde fiyat değiştiğinde arka planda anlık yeşil/kırmızı yanıp sönme (flash) efektleri.
* **Loading States:** API'den portföy veya yapay zeka analizi beklenirken Skeleton Screens (iskelet ekranlar) kullanımı.
* **Empty States:** İzleme listesi veya açık emir olmadığında kullanıcıyı yönlendiren bilgilendirici grafikler/mesajlar.
* **Feedback:** Başarılı alım-satım işlemlerinde anında görsel ve titreşimli (haptic) geri bildirim (toast, snackbar).

**4. Erişilebilirlik (Accessibility)**
* Finansal verilerin ve yön tuşlarının Screen Reader (ekran okuyucu) tarafından doğru seslendirilmesi.
* Hızlı alım-satım (Touch target) buton boyutlarının standartlara uygun (min 44x44dp/pt) olması.

**5. Yüksek Performanslı Veri Gösterimi**
* **Canlı Grafikler:** WebSocket'ten akan anlık verilerin UI thread'ini kilitlememesi ve grafiklerin kasmadan (60 FPS hedefi) render edilmesi.
* Lazy loading (Uzun işlem geçmişi ve market listesi için).
* Memory management (Özellikle çok fazla hisse senedinin anlık yüklendiği listelerde bellek sızıntısını önleme).

**6. Navigasyon**
* Hızlı işlem yapabilmek için tutarlı Bottom Navigation (Piyasa, Al-Sat, Portföy, AI Asistan).
* Bildirimlerden (Örn: Fiyat Alarmı) gelen tıklamalar için Deep Linking desteği.

**7. Form ve Emir Yönetimi**
* **Finansal Klavyeler:** Fiyat ve Lot (miktar) girerken sadece sayısal (Decimal/Number) klavye açılması.
* Bakiye yetersizliği veya hatalı fiyat girişlerinde Real-time validation (anında doğrulama) ve input altında kırmızı hata mesajları.
* Form state persistence (Kullanıcı sekmeler arası geçiş yaptığında girdiği emir bilgilerinin silinmemesi).

**8. Platform Özellikleri**
* **Android:** Material Design 3 guidelines ve native komponentler.
* **iOS:** Human Interface Guidelines ve iOS'e özgü kaydırma/navigasyon hissinin (Native feel) sağlanması.
