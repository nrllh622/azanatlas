// src/data/ayetler.ts
//
// GÜNÜN AYETİ havuzu.
//
// Mealler, Diyanet İşleri Başkanlığı Kur'an-ı Kerim Meâli'nde kullanılan
// sade Türkçe anlatıma yakın tutulmuştur. Havuz tamamen cihazda (offline)
// tutulur; internet gerektirmez ve hiçbir sunucuya istek atılmaz.
//
// Günün ayeti, tarihe göre DETERMİNİSTİK seçilir: aynı gün uygulamayı kaç
// kez açarsanız açın aynı ayet gösterilir, ertesi gün değişir.
//
// ─────────────────────────────────────────────────────────────────────────────
// i18n PAKETİ: İNGİLİZCE ALANLAR EKLENDİ
//
// Önceden bu liste yalnızca Türkçe idi; dil İngilizce'ye çevrilse bile
// "Günün Ayeti" kartı hep Türkçe kalıyordu (kullanıcı geri bildirimi).
// Şimdi her kayıt `kaynakEn`/`mealEn` alanlarını da taşıyor — sade, doğru
// bir İngilizce anlatım (belirli bir yayınevinin çevirisi birebir
// kopyalanmadı, Diyanet mealindeki gibi sade bir anlatım hedeflendi).
// `HomeScreen.tsx` aktif dile göre `kaynak`/`meal` ya da `kaynakEn`/`mealEn`
// alanını seçer.
// ─────────────────────────────────────────────────────────────────────────────

export interface AyetItem {
  /** Sure adı ve ayet numarası (Türkçe) — kaynağın açıkça belirtilmesi için */
  kaynak: string;
  /** Türkçe meal */
  meal: string;
  /** Sure adı ve ayet numarası (İngilizce transliterasyon) */
  kaynakEn: string;
  /** İngilizce meal */
  mealEn: string;
}

export const AYETLER: AyetItem[] = [
  { kaynak: 'Fâtiha, 1/5', meal: '(Rabbimiz!) Ancak sana kulluk ederiz ve yalnız senden yardım dileriz.',
    kaynakEn: 'Al-Fatiha, 1:5', mealEn: 'You alone we worship, and You alone we ask for help.' },
  { kaynak: 'Bakara, 2/152', meal: 'Öyleyse siz beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.',
    kaynakEn: 'Al-Baqarah, 2:152', mealEn: 'So remember Me; I will remember you. Be thankful to Me, and never ungrateful.' },
  { kaynak: 'Bakara, 2/153', meal: 'Ey iman edenler! Sabrederek ve namaz kılarak Allah’tan yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.',
    kaynakEn: 'Al-Baqarah, 2:153', mealEn: 'O you who believe! Seek help through patience and prayer. Indeed, Allah is with the patient.' },
  { kaynak: 'Bakara, 2/186', meal: 'Kullarım sana beni sorduğunda (söyle onlara): Ben çok yakınım. Bana dua ettiğinde dua edenin dileğine karşılık veririm.',
    kaynakEn: 'Al-Baqarah, 2:186', mealEn: 'When My servants ask you about Me, (tell them) I am truly near. I answer the call of the caller when they call upon Me.' },
  { kaynak: 'Bakara, 2/286', meal: 'Allah, hiç kimseye gücünün yeteceğinden fazlasını yüklemez.',
    kaynakEn: 'Al-Baqarah, 2:286', mealEn: 'Allah does not burden any soul with more than it can bear.' },
  { kaynak: 'Âl-i İmrân, 3/139', meal: 'Gevşemeyin, üzülmeyin. Eğer gerçekten iman etmişseniz, üstün olan sizsiniz.',
    kaynakEn: 'Aal-e-Imran, 3:139', mealEn: 'Do not lose heart nor grieve, for you will surely prevail if you are true believers.' },
  { kaynak: 'Âl-i İmrân, 3/159', meal: 'Bir kere de karar verip azmettin mi, artık Allah’a tevekkül et.',
    kaynakEn: 'Aal-e-Imran, 3:159', mealEn: 'And when you have made a decision, put your trust in Allah.' },
  { kaynak: 'Nisâ, 4/103', meal: 'Şüphesiz namaz, müminlere belirli vakitlere bağlı olarak farz kılınmıştır.',
    kaynakEn: 'An-Nisa, 4:103', mealEn: 'Indeed, prayer has been enjoined upon the believers at specified times.' },
  { kaynak: 'En’âm, 6/162', meal: 'De ki: Şüphesiz benim namazım, ibadetlerim, hayatım ve ölümüm âlemlerin Rabbi olan Allah içindir.',
    kaynakEn: "Al-An'am, 6:162", mealEn: 'Say: Indeed, my prayer, my sacrifice, my living and my dying are all for Allah, Lord of all the worlds.' },
  { kaynak: 'A’râf, 7/55', meal: 'Rabbinize alçak gönüllüce ve için için yalvararak dua edin.',
    kaynakEn: "Al-A'raf, 7:55", mealEn: 'Call upon your Lord humbly and privately.' },
  { kaynak: 'A’râf, 7/56', meal: 'Şüphesiz Allah’ın rahmeti iyilik edenlere çok yakındır.',
    kaynakEn: "Al-A'raf, 7:56", mealEn: 'Indeed, the mercy of Allah is near to those who do good.' },
  { kaynak: 'Enfâl, 8/46', meal: 'Sabredin. Çünkü Allah sabredenlerle beraberdir.',
    kaynakEn: 'Al-Anfal, 8:46', mealEn: 'And be patient. Indeed, Allah is with the patient.' },
  { kaynak: 'Yûnus, 10/57', meal: 'Ey insanlar! Rabbinizden size bir öğüt, gönüllerdeki dertlere bir şifa, müminler için bir hidayet ve rahmet gelmiştir.',
    kaynakEn: 'Yunus, 10:57', mealEn: 'O mankind! There has come to you an instruction from your Lord, a healing for what is in the hearts, and guidance and mercy for the believers.' },
  { kaynak: 'Hûd, 11/88', meal: 'Başarım ancak Allah’ın yardımıyladır. Ben yalnız O’na güvendim ve yalnız O’na yöneliyorum.',
    kaynakEn: 'Hud, 11:88', mealEn: 'My success comes only through Allah. In Him I trust, and to Him I turn.' },
  { kaynak: 'Ra’d, 13/28', meal: 'Bilesiniz ki kalpler ancak Allah’ı anmakla huzur bulur.',
    kaynakEn: "Ar-Ra'd, 13:28", mealEn: 'Truly, it is in the remembrance of Allah that hearts find peace.' },
  { kaynak: 'İbrâhîm, 14/7', meal: 'Andolsun, eğer şükrederseniz elbette size nimetimi artırırım.',
    kaynakEn: 'Ibrahim, 14:7', mealEn: 'If you are grateful, I will surely increase you in favor.' },
  { kaynak: 'Nahl, 16/90', meal: 'Şüphesiz Allah adaleti, iyiliği ve yakınlara yardım etmeyi emreder.',
    kaynakEn: 'An-Nahl, 16:90', mealEn: 'Indeed, Allah commands justice, doing good, and giving to relatives.' },
  { kaynak: 'Nahl, 16/128', meal: 'Şüphesiz Allah, kendisine karşı gelmekten sakınanlar ve iyilik yapanlarla beraberdir.',
    kaynakEn: 'An-Nahl, 16:128', mealEn: 'Indeed, Allah is with those who are mindful of Him and those who do good.' },
  { kaynak: 'İsrâ, 17/23', meal: 'Rabbin, kendisinden başkasına kulluk etmemenizi ve anne babaya iyi davranmanızı emretti.',
    kaynakEn: 'Al-Isra, 17:23', mealEn: 'Your Lord has decreed that you worship none but Him, and that you be kind to your parents.' },
  { kaynak: 'İsrâ, 17/78', meal: 'Güneşin batıya kaymasından gecenin karanlığına kadar (belli vakitlerde) namazı kıl; bir de sabah namazını kıl.',
    kaynakEn: 'Al-Isra, 17:78', mealEn: 'Establish prayer from the decline of the sun until the darkness of the night, and the recitation of dawn.' },
  { kaynak: 'Kehf, 18/46', meal: 'Mal ve oğullar dünya hayatının süsüdür. Kalıcı olan iyi işler ise Rabbinin katında hem sevapça daha hayırlı, hem de ümit bağlamaya daha lâyıktır.',
    kaynakEn: 'Al-Kahf, 18:46', mealEn: 'Wealth and children are the adornment of this worldly life, but the lasting good deeds are better with your Lord in reward and in hope.' },
  { kaynak: 'Tâhâ, 20/14', meal: 'Şüphesiz ben Allah’ım. Benden başka hiçbir ilâh yoktur. Öyleyse bana kulluk et ve beni anmak için namaz kıl.',
    kaynakEn: 'Ta-Ha, 20:14', mealEn: 'Indeed, I am Allah. There is no god but Me, so worship Me and establish prayer for My remembrance.' },
  { kaynak: 'Enbiyâ, 21/107', meal: 'Biz seni ancak âlemlere rahmet olarak gönderdik.',
    kaynakEn: 'Al-Anbiya, 21:107', mealEn: 'We have sent you only as a mercy to all the worlds.' },
  { kaynak: 'Mü’minûn, 23/1-2', meal: 'Müminler gerçekten kurtuluşa ermiştir; onlar namazlarında derin bir saygı içindedirler.',
    kaynakEn: "Al-Mu'minun, 23:1-2", mealEn: 'Successful indeed are the believers — those who are humbly attentive in their prayers.' },
  { kaynak: 'Nûr, 24/35', meal: 'Allah göklerin ve yerin nurudur.',
    kaynakEn: 'An-Nur, 24:35', mealEn: 'Allah is the Light of the heavens and the earth.' },
  { kaynak: 'Furkân, 25/63', meal: 'Rahmân’ın kulları, yeryüzünde vakarla ve alçak gönüllülükle yürüyen kimselerdir.',
    kaynakEn: 'Al-Furqan, 25:63', mealEn: 'The servants of the Most Merciful are those who walk upon the earth with humility.' },
  { kaynak: 'Ankebût, 29/45', meal: 'Şüphesiz namaz hayâsızlıktan ve kötülükten alıkoyar. Allah’ı anmak elbette en büyük ibadettir.',
    kaynakEn: 'Al-Ankabut, 29:45', mealEn: 'Indeed, prayer restrains from indecency and wrongdoing, and the remembrance of Allah is indeed the greatest.' },
  { kaynak: 'Ankebût, 29/69', meal: 'Bizim uğrumuzda gayret gösterenlere gelince, elbette biz onlara yollarımızı gösteririz.',
    kaynakEn: 'Al-Ankabut, 29:69', mealEn: 'As for those who strive for Us, We will surely guide them to Our ways.' },
  { kaynak: 'Rûm, 30/60', meal: 'Sabret! Şüphesiz Allah’ın verdiği söz gerçektir.',
    kaynakEn: 'Ar-Rum, 30:60', mealEn: 'So be patient. Indeed, the promise of Allah is true.' },
  { kaynak: 'Lokmân, 31/17', meal: 'Yavrucuğum! Namazı dosdoğru kıl, iyiliği emret, kötülükten alıkoy, başına gelene sabret.',
    kaynakEn: 'Luqman, 31:17', mealEn: 'My son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you.' },
  { kaynak: 'Ahzâb, 33/41-42', meal: 'Ey iman edenler! Allah’ı çokça anın ve O’nu sabah akşam tesbih edin.',
    kaynakEn: 'Al-Ahzab, 33:41-42', mealEn: 'O you who believe! Remember Allah often, and glorify Him morning and evening.' },
  { kaynak: 'Zümer, 39/53', meal: 'De ki: Ey kendi aleyhlerine aşırı giden kullarım! Allah’ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.',
    kaynakEn: 'Az-Zumar, 39:53', mealEn: 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.' },
  { kaynak: 'Şûrâ, 42/30', meal: 'Başınıza gelen herhangi bir musibet kendi ellerinizle yaptıklarınız yüzündendir. Allah yine de çoğunu affeder.',
    kaynakEn: 'Ash-Shura, 42:30', mealEn: 'Whatever misfortune befalls you is because of what your own hands have earned — and He still pardons much.' },
  { kaynak: 'Muhammed, 47/7', meal: 'Ey iman edenler! Eğer siz Allah’a yardım ederseniz, O da size yardım eder ve ayaklarınızı sağlam bastırır.',
    kaynakEn: 'Muhammad, 47:7', mealEn: 'O you who believe! If you help Allah, He will help you and make firm your steps.' },
  { kaynak: 'Kâf, 50/16', meal: 'Andolsun, insanı biz yarattık ve nefsinin ona ne fısıldadığını biliriz. Çünkü biz ona şah damarından daha yakınız.',
    kaynakEn: 'Qaf, 50:16', mealEn: 'We created man, and We know what his soul whispers to him — for We are closer to him than his jugular vein.' },
  { kaynak: 'Zâriyât, 51/56', meal: 'Ben cinleri ve insanları ancak bana kulluk etsinler diye yarattım.',
    kaynakEn: 'Adh-Dhariyat, 51:56', mealEn: 'I did not create the jinn and mankind except to worship Me.' },
  { kaynak: 'Hadîd, 57/4', meal: 'Nerede olsanız O sizinle beraberdir.',
    kaynakEn: 'Al-Hadid, 57:4', mealEn: 'He is with you wherever you are.' },
  { kaynak: 'Talâk, 65/2-3', meal: 'Kim Allah’a karşı gelmekten sakınırsa, Allah ona bir çıkış yolu açar ve onu ummadığı yerden rızıklandırır.',
    kaynakEn: 'At-Talaq, 65:2-3', mealEn: 'Whoever is mindful of Allah, He will make a way out for them, and provide for them from where they do not expect.' },
  { kaynak: 'İnşirâh, 94/5-6', meal: 'Şüphesiz güçlükle beraber bir kolaylık vardır. Gerçekten, güçlükle beraber bir kolaylık vardır.',
    kaynakEn: 'Ash-Sharh, 94:5-6', mealEn: 'So, truly, with hardship comes ease. Truly, with hardship comes ease.' },
  { kaynak: 'Duhâ, 93/5', meal: 'Rabbin sana verecek ve sen razı olacaksın.',
    kaynakEn: 'Ad-Duha, 93:5', mealEn: 'And your Lord will give you, and you will be well pleased.' },
];

/**
 * Verilen güne ait ayeti döndürür.
 *
 * Seçim, takvim gününden (yıl-ay-gün) türetilen sabit bir indeksle yapılır;
 * rastgele değildir. Böylece kullanıcı gün içinde uygulamayı defalarca açsa da
 * hep aynı ayeti görür, ertesi gün yeni bir ayete geçer.
 */
export function getGununAyeti(date: Date): AyetItem {
  // Yerel takvim gününü gün sayısına çeviriyoruz (UTC kaymasından etkilenmemesi
  // için doğrudan yıl/ay/gün alanlarından hesaplanıyor).
  const gunSayisi = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
  );
  const index = ((gunSayisi % AYETLER.length) + AYETLER.length) % AYETLER.length;
  return AYETLER[index];
}
