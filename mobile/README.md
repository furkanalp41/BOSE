# BOSE Mobile (Flutter)

Tek bir Flutter projesi, beş ekip üyesinin "feature module"'larını barındırır.

## Klasör Yapısı

```
mobile/
├── pubspec.yaml
└── lib/
    ├── main.dart                       # Bottom nav: 5 sekme, üye başına 1 ekran.
    ├── core/
    │   ├── api_client.dart             # JWT-aware Dio. Port haritası buradan yönetilir.
    │   ├── auth_store.dart             # JWT + user objesi flutter_secure_storage'da.
    │   └── theme.dart
    └── features/
        ├── furkan/   # Login / Register / Profile  → :8080
        ├── cem/      # Piyasa emri                 → :8081
        ├── salih/    # Fiyat alarmları + AI chat    → :8082
        ├── enes/     # İzleme listeleri            → :8083
        └── efe/      # Canlı piyasa fiyatları (WS) → :8084
```

## İlk Kurulum

Bu repoda `android/` ve `ios/` klasörleri henüz yok — Flutter SDK'nın yerel olarak
yüklü olduğu makinede ekibin bir üyesinin **bir kez** aşağıdaki komutu çalıştırması
gerekir (mevcut `pubspec.yaml` ve `lib/` korunur, sadece platform iskeleleri eklenir):

```bash
cd mobile
flutter create --org=com.bose --project-name=bose_mobile .
flutter pub get
```

## Çalıştırma

Backend tarafının ayakta olması gerekir. Repo kökünden:

```bash
./start_project.sh
```

Sonra Flutter:

```bash
cd mobile
flutter run                      # Android emulator / fiziksel cihaz
flutter run -d chrome            # web (proof video için seçenek)
```

> Android emülatöründe `localhost` host makineye değil emülatörün kendisine işaret
> ettiği için `api_client.dart` içinde `10.0.2.2` kullanılır. iOS Simulator için
> aynı host'u `127.0.0.1` ile değiştirin. Gerçek cihazda LAN IP'sini yazın.

## Ekip İçi Sorumluluklar

Her ekip üyesi `lib/features/<kendi-adı>/` klasöründen sorumludur. Diğer üyelerin
klasörlerine yazmayın; ortak değişiklikler `core/` altında ele alınmalıdır.
