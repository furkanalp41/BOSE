# Gereksinim Analizi

Tüm gereksinimlerimizi çıkardıktan sonra beraber tartıştık ve son gereksinimlerin isimlerini hangi API metoduna karşılık geleceğini ve kısa açıklamalarını aşağıda numaralı bir şekilde listeledik. Toplam 5 kişilik ekibimiz için sistemin temel işlevlerini kapsayan **37 adet endpoint** belirlenmiş ve modüller halinde dağıtılmıştır.

**Canlı API:** `https://bose-platform.onrender.com/api/v1`
**Canlı Frontend:** `https://frontend-bose.vercel.app`
**API Dokümantasyonu:** `https://bose-platform.onrender.com/docs`

---

## Tüm Gereksinimler

### Furkan Alp Günay — Auth, User CRUD, Admin (10 endpoint)
1. Üye Olma (`POST /auth/register`)
2. Giriş Yapma (`POST /auth/login`)
3. Profil Görüntüleme (`GET /users/me`)
4. Kullanıcı Detayı (`GET /users/:userId`)
5. Profil Güncelleme (`PUT /users/:userId`)
6. Hesap Silme (`DELETE /users/:userId`)
7. AI Tercihlerini Kaydetme (`POST /users/:userId/ai-preferences`)
8. Admin Log Görüntüleme (`GET /admin/logs`)
9. Admin Kullanıcı Rolü Güncelleme (`PUT /admin/users/:id/role`)
10. Admin Kullanıcı Silme (`DELETE /admin/users/:id`)

### Cem Karaca — Trading (6 endpoint)
11. Alım/Satım Emri Oluşturma (`POST /trading/order`)
12. Açık Pozisyonları Listeleme (`GET /trading/positions`)
13. Pozisyon Kapatma (`POST /trading/positions/:positionId/close`)
14. İşlem Geçmişi (`GET /trading/history`)
15. Portföy Özeti (`GET /trading/portfolio`)
16. Admin Duyuru Oluşturma (`POST /admin/announcements`)

### Salih Arda Katırcıoğlu — Watchlist & Alerts (9 endpoint)
17. İzleme Listesi Oluşturma (`POST /watchlist/`)
18. İzleme Listelerini Görüntüleme (`GET /watchlist/`)
19. İzleme Listesini Silme (`DELETE /watchlist/:id`)
20. Listeye Sembol Ekleme (`POST /watchlist/:id/items`)
21. Listeden Sembol Çıkarma (`DELETE /watchlist/:id/items/:itemId`)
22. Fiyat Alarmı Oluşturma (`POST /watchlist/alerts`)
23. Alarmları Listeleme (`GET /watchlist/alerts`)
24. Alarm Silme (`DELETE /watchlist/alerts/:alertId`)
25. Tetiklenen Alarmları Görüntüleme (`GET /watchlist/alerts/triggered`)

### Enes Çoban — AI Reports & Chat (5 endpoint)
26. AI Yatırım Tavsiyesi (`POST /ai/advice`)
27. AI Portföy Analizi (`POST /ai/reports/portfolio`)
28. AI Watchlist Analizi (`POST /ai/reports/watchlist`)
29. AI İşlem Analizi (`POST /ai/reports/transactions`)
30. AI Chatbot (`POST /ai/chat`)

### Yakup Efe Çelebi — Market, Leaderboard, Admin Assets (7 endpoint)
31. Piyasa Verilerini Listeleme (`GET /market/assets`)
32. Liderlik Tablosu (`GET /leaderboard/rankings`)
33. Kullanıcı Sıralaması (`GET /leaderboard/user/:userId`)
34. Başarımlar (`GET /leaderboard/achievements`)
35. Admin Asset Listesi (`GET /admin/market/assets`)
36. Admin Asset Ekleme (`POST /admin/market/assets`)
37. Admin Asset Silme (`DELETE /admin/market/assets/:symbol`)

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Backend | Go 1.22 + Fiber v2 |
| Veritabanı | PostgreSQL 16 (Render) |
| ORM | GORM |
| Auth | JWT (golang-jwt/v5) |
| Frontend | React 18 + Vite + Tailwind CSS |
| State | Zustand |
| AI | Gemini 2.0 Flash → Anthropic Claude → Rules Engine (fallback) |
| Canlı Veri | WebSocket (Fiber WebSocket) |
| Fiyat Motoru | Geometric Brownian Motion simülasyonu |
| Deploy | Render (Backend) + Vercel (Frontend) |
