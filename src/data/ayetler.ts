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

export interface AyetItem {
  /** Sure adı ve ayet numarası — kaynağın açıkça belirtilmesi için */
  kaynak: string;
  /** Türkçe meal */
  meal: string;
}

export const AYETLER: AyetItem[] = [
  { kaynak: 'Fâtiha, 1/5', meal: '(Rabbimiz!) Ancak sana kulluk ederiz ve yalnız senden yardım dileriz.' },
  { kaynak: 'Bakara, 2/152', meal: 'Öyleyse siz beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.' },
  { kaynak: 'Bakara, 2/153', meal: 'Ey iman edenler! Sabrederek ve namaz kılarak Allah’tan yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.' },
  { kaynak: 'Bakara, 2/186', meal: 'Kullarım sana beni sorduğunda (söyle onlara): Ben çok yakınım. Bana dua ettiğinde dua edenin dileğine karşılık veririm.' },
  { kaynak: 'Bakara, 2/286', meal: 'Allah, hiç kimseye gücünün yeteceğinden fazlasını yüklemez.' },
  { kaynak: 'Âl-i İmrân, 3/139', meal: 'Gevşemeyin, üzülmeyin. Eğer gerçekten iman etmişseniz, üstün olan sizsiniz.' },
  { kaynak: 'Âl-i İmrân, 3/159', meal: 'Bir kere de karar verip azmettin mi, artık Allah’a tevekkül et.' },
  { kaynak: 'Nisâ, 4/103', meal: 'Şüphesiz namaz, müminlere belirli vakitlere bağlı olarak farz kılınmıştır.' },
  { kaynak: 'En’âm, 6/162', meal: 'De ki: Şüphesiz benim namazım, ibadetlerim, hayatım ve ölümüm âlemlerin Rabbi olan Allah içindir.' },
  { kaynak: 'A’râf, 7/55', meal: 'Rabbinize alçak gönüllüce ve için için yalvararak dua edin.' },
  { kaynak: 'A’râf, 7/56', meal: 'Şüphesiz Allah’ın rahmeti iyilik edenlere çok yakındır.' },
  { kaynak: 'Enfâl, 8/46', meal: 'Sabredin. Çünkü Allah sabredenlerle beraberdir.' },
  { kaynak: 'Yûnus, 10/57', meal: 'Ey insanlar! Rabbinizden size bir öğüt, gönüllerdeki dertlere bir şifa, müminler için bir hidayet ve rahmet gelmiştir.' },
  { kaynak: 'Hûd, 11/88', meal: 'Başarım ancak Allah’ın yardımıyladır. Ben yalnız O’na güvendim ve yalnız O’na yöneliyorum.' },
  { kaynak: 'Ra’d, 13/28', meal: 'Bilesiniz ki kalpler ancak Allah’ı anmakla huzur bulur.' },
  { kaynak: 'İbrâhîm, 14/7', meal: 'Andolsun, eğer şükrederseniz elbette size nimetimi artırırım.' },
  { kaynak: 'Nahl, 16/90', meal: 'Şüphesiz Allah adaleti, iyiliği ve yakınlara yardım etmeyi emreder.' },
  { kaynak: 'Nahl, 16/128', meal: 'Şüphesiz Allah, kendisine karşı gelmekten sakınanlar ve iyilik yapanlarla beraberdir.' },
  { kaynak: 'İsrâ, 17/23', meal: 'Rabbin, kendisinden başkasına kulluk etmemenizi ve anne babaya iyi davranmanızı emretti.' },
  { kaynak: 'İsrâ, 17/78', meal: 'Güneşin batıya kaymasından gecenin karanlığına kadar (belli vakitlerde) namazı kıl; bir de sabah namazını kıl.' },
  { kaynak: 'Kehf, 18/46', meal: 'Mal ve oğullar dünya hayatının süsüdür. Kalıcı olan iyi işler ise Rabbinin katında hem sevapça daha hayırlı, hem de ümit bağlamaya daha lâyıktır.' },
  { kaynak: 'Tâhâ, 20/14', meal: 'Şüphesiz ben Allah’ım. Benden başka hiçbir ilâh yoktur. Öyleyse bana kulluk et ve beni anmak için namaz kıl.' },
  { kaynak: 'Enbiyâ, 21/107', meal: 'Biz seni ancak âlemlere rahmet olarak gönderdik.' },
  { kaynak: 'Mü’minûn, 23/1-2', meal: 'Müminler gerçekten kurtuluşa ermiştir; onlar namazlarında derin bir saygı içindedirler.' },
  { kaynak: 'Nûr, 24/35', meal: 'Allah göklerin ve yerin nurudur.' },
  { kaynak: 'Furkân, 25/63', meal: 'Rahmân’ın kulları, yeryüzünde vakarla ve alçak gönüllülükle yürüyen kimselerdir.' },
  { kaynak: 'Ankebût, 29/45', meal: 'Şüphesiz namaz hayâsızlıktan ve kötülükten alıkoyar. Allah’ı anmak elbette en büyük ibadettir.' },
  { kaynak: 'Ankebût, 29/69', meal: 'Bizim uğrumuzda gayret gösterenlere gelince, elbette biz onlara yollarımızı gösteririz.' },
  { kaynak: 'Rûm, 30/60', meal: 'Sabret! Şüphesiz Allah’ın verdiği söz gerçektir.' },
  { kaynak: 'Lokmân, 31/17', meal: 'Yavrucuğum! Namazı dosdoğru kıl, iyiliği emret, kötülükten alıkoy, başına gelene sabret.' },
  { kaynak: 'Ahzâb, 33/41-42', meal: 'Ey iman edenler! Allah’ı çokça anın ve O’nu sabah akşam tesbih edin.' },
  { kaynak: 'Zümer, 39/53', meal: 'De ki: Ey kendi aleyhlerine aşırı giden kullarım! Allah’ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.' },
  { kaynak: 'Şûrâ, 42/30', meal: 'Başınıza gelen herhangi bir musibet kendi ellerinizle yaptıklarınız yüzündendir. Allah yine de çoğunu affeder.' },
  { kaynak: 'Muhammed, 47/7', meal: 'Ey iman edenler! Eğer siz Allah’a yardım ederseniz, O da size yardım eder ve ayaklarınızı sağlam bastırır.' },
  { kaynak: 'Kâf, 50/16', meal: 'Andolsun, insanı biz yarattık ve nefsinin ona ne fısıldadığını biliriz. Çünkü biz ona şah damarından daha yakınız.' },
  { kaynak: 'Zâriyât, 51/56', meal: 'Ben cinleri ve insanları ancak bana kulluk etsinler diye yarattım.' },
  { kaynak: 'Hadîd, 57/4', meal: 'Nerede olsanız O sizinle beraberdir.' },
  { kaynak: 'Talâk, 65/2-3', meal: 'Kim Allah’a karşı gelmekten sakınırsa, Allah ona bir çıkış yolu açar ve onu ummadığı yerden rızıklandırır.' },
  { kaynak: 'İnşirâh, 94/5-6', meal: 'Şüphesiz güçlükle beraber bir kolaylık vardır. Gerçekten, güçlükle beraber bir kolaylık vardır.' },
  { kaynak: 'Duhâ, 93/5', meal: 'Rabbin sana verecek ve sen razı olacaksın.' },
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
