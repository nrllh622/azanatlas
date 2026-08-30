// src/config/reklamKimlikleri.ts
//
// ADMOB — GERÇEK REKLAM BİRİMİ KİMLİKLERİ
//
// Kullanıcının AdMob konsolunda azanatlas için oluşturduğu App ID
// (ca-app-pub-2984878117732696~1126374204, bkz. app.json) altındaki 3 ayrı
// Banner reklam birimi. Her yerleşimin kendi kimliği var ki AdMob
// raporlarında hangi konumun ne kadar kazandırdığı ayrı görülebilsin.
//
// NOT: `BannerReklam.tsx` development build'de (`__DEV__ === true`) bu
// kimlikler yerine otomatik olarak Google'ın test kimliğini kullanır —
// buradaki gerçek kimlikler yalnızca prod (Play Store) build'inde devreye
// girer. Bu yüzden geliştirme sırasında gerçek reklamlara yanlışlıkla
// tıklanma/geçersiz trafik riski yoktur.

/** Ana Sayfa — ekranın en altı. */
export const REKLAM_ANASAYFA_ALT = 'ca-app-pub-2984878117732696/8701611897';

/** Ana Sayfa — "Takip, Tesbih, Esmâ, Kaza" hızlı araçlar şeridinin altı. */
export const REKLAM_ANASAYFA_ORTA = 'ca-app-pub-2984878117732696/4243492138';

/** Keşfet — "İbadet" grubu ile "Takip" grubu arasında. */
export const REKLAM_KESFET = 'ca-app-pub-2984878117732696/7991165450';
