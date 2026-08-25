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
// i18n PAKETİ: 4 DİL DE TAM
//
// Önceden bu liste yalnızca Türkçe idi; sonra İngilizce (`kaynakEn`/`mealEn`)
// eklendi. Madde 10a/13 (bu tur): Endonezce (`kaynakId`/`mealId`) ve
// Fransızca (`kaynakFr`/`mealFr`) alanları da eklendi — hiçbiri belirli bir
// yayınevinin çevirisinin birebir kopyası değil; Diyanet mealindeki gibi
// sade, anlamı doğru aktaran bir anlatım hedeflendi (İngilizce alan için
// izlenen yaklaşımın aynısı). Sure adları her dilde o dilin yerleşik
// transliterasyon geleneğine göre yazıldı (ID: Kemenag geleneği,
// FR: Hamidullah geleneği). `HomeScreen.tsx` `veriSec()` ile aktif dile
// göre doğru alanı seçer.
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
  /** Sure adı ve ayet numarası (Endonezce transliterasyon) */
  kaynakId: string;
  /** Endonezce meal */
  mealId: string;
  /** Sure adı ve ayet numarası (Fransızca transliterasyon) */
  kaynakFr: string;
  /** Fransızca meal */
  mealFr: string;
}

export const AYETLER: AyetItem[] = [
  { kaynak: 'Fâtiha, 1/5', meal: '(Rabbimiz!) Ancak sana kulluk ederiz ve yalnız senden yardım dileriz.',
    kaynakEn: 'Al-Fatiha, 1:5', mealEn: 'You alone we worship, and You alone we ask for help.',
    kaynakId: 'Al-Fatihah, 1:5', mealId: 'Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan.',
    kaynakFr: 'Al-Fâtiha, 1:5', mealFr: 'C’est Toi seul que nous adorons, et c’est Toi seul dont nous implorons secours.' },
  { kaynak: 'Bakara, 2/152', meal: 'Öyleyse siz beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.',
    kaynakEn: 'Al-Baqarah, 2:152', mealEn: 'So remember Me; I will remember you. Be thankful to Me, and never ungrateful.',
    kaynakId: 'Al-Baqarah, 2:152', mealId: 'Maka ingatlah kepada-Ku, niscaya Aku ingat (pula) kepadamu. Bersyukurlah kepada-Ku dan janganlah kamu mengingkari nikmat-Ku.',
    kaynakFr: 'Al-Baqara, 2:152', mealFr: 'Souvenez-vous de Moi, Je Me souviendrai de vous. Remerciez-Moi et ne soyez pas ingrats envers Moi.' },
  { kaynak: 'Bakara, 2/153', meal: 'Ey iman edenler! Sabrederek ve namaz kılarak Allah’tan yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.',
    kaynakEn: 'Al-Baqarah, 2:153', mealEn: 'O you who believe! Seek help through patience and prayer. Indeed, Allah is with the patient.',
    kaynakId: 'Al-Baqarah, 2:153', mealId: 'Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sungguh, Allah beserta orang-orang yang sabar.',
    kaynakFr: 'Al-Baqara, 2:153', mealFr: 'Ô vous qui croyez ! Cherchez secours dans l’endurance et la prière. Certes, Allah est avec ceux qui endurent.' },
  { kaynak: 'Bakara, 2/186', meal: 'Kullarım sana beni sorduğunda (söyle onlara): Ben çok yakınım. Bana dua ettiğinde dua edenin dileğine karşılık veririm.',
    kaynakEn: 'Al-Baqarah, 2:186', mealEn: 'When My servants ask you about Me, (tell them) I am truly near. I answer the call of the caller when they call upon Me.',
    kaynakId: 'Al-Baqarah, 2:186', mealId: 'Apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat. Aku mengabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku.',
    kaynakFr: 'Al-Baqara, 2:186', mealFr: 'Quand Mes serviteurs t’interrogent sur Moi, Je suis proche : Je réponds à l’appel de celui qui M’invoque, lorsqu’il M’invoque.' },
  { kaynak: 'Bakara, 2/286', meal: 'Allah, hiç kimseye gücünün yeteceğinden fazlasını yüklemez.',
    kaynakEn: 'Al-Baqarah, 2:286', mealEn: 'Allah does not burden any soul with more than it can bear.',
    kaynakId: 'Al-Baqarah, 2:286', mealId: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.',
    kaynakFr: 'Al-Baqara, 2:286', mealFr: 'Allah n’impose à aucune âme une charge supérieure à sa capacité.' },
  { kaynak: 'Âl-i İmrân, 3/139', meal: 'Gevşemeyin, üzülmeyin. Eğer gerçekten iman etmişseniz, üstün olan sizsiniz.',
    kaynakEn: 'Aal-e-Imran, 3:139', mealEn: 'Do not lose heart nor grieve, for you will surely prevail if you are true believers.',
    kaynakId: 'Ali ’Imran, 3:139', mealId: 'Janganlah kamu bersikap lemah, dan janganlah (pula) kamu bersedih hati, sebab kamu paling tinggi (derajatnya) jika kamu orang beriman.',
    kaynakFr: 'Âl ’Imrân, 3:139', mealFr: 'Ne faiblissez pas et ne vous affligez pas ; vous serez les plus hauts, si vous êtes de vrais croyants.' },
  { kaynak: 'Âl-i İmrân, 3/159', meal: 'Bir kere de karar verip azmettin mi, artık Allah’a tevekkül et.',
    kaynakEn: 'Aal-e-Imran, 3:159', mealEn: 'And when you have made a decision, put your trust in Allah.',
    kaynakId: 'Ali ’Imran, 3:159', mealId: 'Kemudian apabila engkau telah membulatkan tekad, maka bertawakallah kepada Allah.',
    kaynakFr: 'Âl ’Imrân, 3:159', mealFr: 'Et une fois que tu as pris ta décision, place ta confiance en Allah.' },
  { kaynak: 'Nisâ, 4/103', meal: 'Şüphesiz namaz, müminlere belirli vakitlere bağlı olarak farz kılınmıştır.',
    kaynakEn: 'An-Nisa, 4:103', mealEn: 'Indeed, prayer has been enjoined upon the believers at specified times.',
    kaynakId: 'An-Nisa, 4:103', mealId: 'Sesungguhnya salat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman.',
    kaynakFr: 'An-Nisâ’, 4:103', mealFr: 'En vérité, la Salât demeure, pour les croyants, une prescription à des temps déterminés.' },
  { kaynak: 'En’âm, 6/162', meal: 'De ki: Şüphesiz benim namazım, ibadetlerim, hayatım ve ölümüm âlemlerin Rabbi olan Allah içindir.',
    kaynakEn: "Al-An'am, 6:162", mealEn: 'Say: Indeed, my prayer, my sacrifice, my living and my dying are all for Allah, Lord of all the worlds.',
    kaynakId: 'Al-An’am, 6:162', mealId: 'Katakanlah, Sesungguhnya salatku, ibadahku, hidupku dan matiku hanyalah untuk Allah, Tuhan seluruh alam.',
    kaynakFr: 'Al-An’âm, 6:162', mealFr: 'Dis : Ma prière, mes actes de dévotion, ma vie et ma mort appartiennent à Allah, Seigneur de l’univers.' },
  { kaynak: 'A’râf, 7/55', meal: 'Rabbinize alçak gönüllüce ve için için yalvararak dua edin.',
    kaynakEn: "Al-A'raf, 7:55", mealEn: 'Call upon your Lord humbly and privately.',
    kaynakId: 'Al-A’raf, 7:55', mealId: 'Berdoalah kepada Tuhanmu dengan rendah hati dan suara yang lembut.',
    kaynakFr: 'Al-A’râf, 7:55', mealFr: 'Invoquez votre Seigneur, humblement et en secret.' },
  { kaynak: 'A’râf, 7/56', meal: 'Şüphesiz Allah’ın rahmeti iyilik edenlere çok yakındır.',
    kaynakEn: "Al-A'raf, 7:56", mealEn: 'Indeed, the mercy of Allah is near to those who do good.',
    kaynakId: 'Al-A’raf, 7:56', mealId: 'Sesungguhnya rahmat Allah sangat dekat kepada orang yang berbuat kebaikan.',
    kaynakFr: 'Al-A’râf, 7:56', mealFr: 'En vérité, la miséricorde d’Allah est proche des bienfaisants.' },
  { kaynak: 'Enfâl, 8/46', meal: 'Sabredin. Çünkü Allah sabredenlerle beraberdir.',
    kaynakEn: 'Al-Anfal, 8:46', mealEn: 'And be patient. Indeed, Allah is with the patient.',
    kaynakId: 'Al-Anfal, 8:46', mealId: 'Dan bersabarlah, sesungguhnya Allah beserta orang-orang yang sabar.',
    kaynakFr: 'Al-Anfâl, 8:46', mealFr: 'Et soyez endurants. Allah est avec les endurants.' },
  { kaynak: 'Yûnus, 10/57', meal: 'Ey insanlar! Rabbinizden size bir öğüt, gönüllerdeki dertlere bir şifa, müminler için bir hidayet ve rahmet gelmiştir.',
    kaynakEn: 'Yunus, 10:57', mealEn: 'O mankind! There has come to you an instruction from your Lord, a healing for what is in the hearts, and guidance and mercy for the believers.',
    kaynakId: 'Yunus, 10:57', mealId: 'Wahai manusia! Sungguh, telah datang kepadamu pelajaran dari Tuhanmu, penyembuh bagi penyakit dalam dada, petunjuk dan rahmat bagi orang yang beriman.',
    kaynakFr: 'Yûnus, 10:57', mealFr: 'Ô hommes ! Une exhortation vous est venue de votre Seigneur, une guérison de ce qui est dans les poitrines, un guide et une miséricorde pour les croyants.' },
  { kaynak: 'Hûd, 11/88', meal: 'Başarım ancak Allah’ın yardımıyladır. Ben yalnız O’na güvendim ve yalnız O’na yöneliyorum.',
    kaynakEn: 'Hud, 11:88', mealEn: 'My success comes only through Allah. In Him I trust, and to Him I turn.',
    kaynakId: 'Hud, 11:88', mealId: 'Tidak ada taufik bagiku melainkan dengan (pertolongan) Allah. Hanya kepada-Nya aku bertawakal dan hanya kepada-Nya aku kembali.',
    kaynakFr: 'Hûd, 11:88', mealFr: 'Ma réussite ne dépend que d’Allah. En Lui je place ma confiance, et c’est vers Lui que je reviens.' },
  { kaynak: 'Ra’d, 13/28', meal: 'Bilesiniz ki kalpler ancak Allah’ı anmakla huzur bulur.',
    kaynakEn: "Ar-Ra'd, 13:28", mealEn: 'Truly, it is in the remembrance of Allah that hearts find peace.',
    kaynakId: 'Ar-Ra’d, 13:28', mealId: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.',
    kaynakFr: 'Ar-Ra’d, 13:28', mealFr: 'En vérité, c’est par l’évocation d’Allah que les cœurs se tranquillisent.' },
  { kaynak: 'İbrâhîm, 14/7', meal: 'Andolsun, eğer şükrederseniz elbette size nimetimi artırırım.',
    kaynakEn: 'Ibrahim, 14:7', mealEn: 'If you are grateful, I will surely increase you in favor.',
    kaynakId: 'Ibrahim, 14:7', mealId: 'Jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu.',
    kaynakFr: 'Ibrâhîm, 14:7', mealFr: 'Si vous êtes reconnaissants, très certainement J’augmenterai (Mes bienfaits) pour vous.' },
  { kaynak: 'Nahl, 16/90', meal: 'Şüphesiz Allah adaleti, iyiliği ve yakınlara yardım etmeyi emreder.',
    kaynakEn: 'An-Nahl, 16:90', mealEn: 'Indeed, Allah commands justice, doing good, and giving to relatives.',
    kaynakId: 'An-Nahl, 16:90', mealId: 'Sesungguhnya Allah menyuruh (kamu) berlaku adil, berbuat kebajikan, dan memberi bantuan kepada kerabat.',
    kaynakFr: 'An-Nahl, 16:90', mealFr: 'Certes, Allah commande l’équité, la bienfaisance et l’assistance aux proches.' },
  { kaynak: 'Nahl, 16/128', meal: 'Şüphesiz Allah, kendisine karşı gelmekten sakınanlar ve iyilik yapanlarla beraberdir.',
    kaynakEn: 'An-Nahl, 16:128', mealEn: 'Indeed, Allah is with those who are mindful of Him and those who do good.',
    kaynakId: 'An-Nahl, 16:128', mealId: 'Sesungguhnya Allah beserta orang-orang yang bertakwa dan orang-orang yang berbuat kebaikan.',
    kaynakFr: 'An-Nahl, 16:128', mealFr: 'Certes, Allah est avec ceux qui Le craignent et ceux qui font le bien.' },
  { kaynak: 'İsrâ, 17/23', meal: 'Rabbin, kendisinden başkasına kulluk etmemenizi ve anne babaya iyi davranmanızı emretti.',
    kaynakEn: 'Al-Isra, 17:23', mealEn: 'Your Lord has decreed that you worship none but Him, and that you be kind to your parents.',
    kaynakId: 'Al-Isra, 17:23', mealId: 'Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia, dan hendaklah berbuat baik kepada ibu bapak.',
    kaynakFr: 'Al-Isrâ’, 17:23', mealFr: 'Ton Seigneur a décrété : n’adorez que Lui, et soyez bienfaisants envers vos père et mère.' },
  { kaynak: 'İsrâ, 17/78', meal: 'Güneşin batıya kaymasından gecenin karanlığına kadar (belli vakitlerde) namazı kıl; bir de sabah namazını kıl.',
    kaynakEn: 'Al-Isra, 17:78', mealEn: 'Establish prayer from the decline of the sun until the darkness of the night, and the recitation of dawn.',
    kaynakId: 'Al-Isra, 17:78', mealId: 'Laksanakanlah salat sejak matahari tergelincir sampai gelapnya malam dan (laksanakan pula salat) subuh.',
    kaynakFr: 'Al-Isrâ’, 17:78', mealFr: 'Accomplis la Salât depuis le déclin du soleil jusqu’à l’obscurité de la nuit, et récite le Coran de l’aube.' },
  { kaynak: 'Kehf, 18/46', meal: 'Mal ve oğullar dünya hayatının süsüdür. Kalıcı olan iyi işler ise Rabbinin katında hem sevapça daha hayırlı, hem de ümit bağlamaya daha lâyıktır.',
    kaynakEn: 'Al-Kahf, 18:46', mealEn: 'Wealth and children are the adornment of this worldly life, but the lasting good deeds are better with your Lord in reward and in hope.',
    kaynakId: 'Al-Kahfi, 18:46', mealId: 'Harta dan anak-anak adalah perhiasan kehidupan dunia, tetapi amal kebajikan yang terus-menerus lebih baik pahalanya di sisi Tuhanmu dan lebih baik untuk menjadi harapan.',
    kaynakFr: 'Al-Kahf, 18:46', mealFr: 'Les biens et les enfants sont la parure de la vie de ce monde, mais les bonnes œuvres durables ont, auprès de ton Seigneur, une meilleure récompense et un meilleur espoir.' },
  { kaynak: 'Tâhâ, 20/14', meal: 'Şüphesiz ben Allah’ım. Benden başka hiçbir ilâh yoktur. Öyleyse bana kulluk et ve beni anmak için namaz kıl.',
    kaynakEn: 'Ta-Ha, 20:14', mealEn: 'Indeed, I am Allah. There is no god but Me, so worship Me and establish prayer for My remembrance.',
    kaynakId: 'Taha, 20:14', mealId: 'Sungguh, Aku ini Allah, tidak ada tuhan selain Aku, maka sembahlah Aku dan laksanakanlah salat untuk mengingat Aku.',
    kaynakFr: 'Tâ-Hâ, 20:14', mealFr: 'En vérité, c’est Moi Allah : point de divinité que Moi. Adore-Moi donc et accomplis la Salât pour te souvenir de Moi.' },
  { kaynak: 'Enbiyâ, 21/107', meal: 'Biz seni ancak âlemlere rahmet olarak gönderdik.',
    kaynakEn: 'Al-Anbiya, 21:107', mealEn: 'We have sent you only as a mercy to all the worlds.',
    kaynakId: 'Al-Anbiya, 21:107', mealId: 'Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi) rahmat bagi seluruh alam.',
    kaynakFr: 'Al-Anbiyâ’, 21:107', mealFr: 'Nous ne t’avons envoyé qu’en miséricorde pour l’univers.' },
  { kaynak: 'Mü’minûn, 23/1-2', meal: 'Müminler gerçekten kurtuluşa ermiştir; onlar namazlarında derin bir saygı içindedirler.',
    kaynakEn: "Al-Mu'minun, 23:1-2", mealEn: 'Successful indeed are the believers — those who are humbly attentive in their prayers.',
    kaynakId: 'Al-Mu’minun, 23:1-2', mealId: 'Sungguh beruntung orang-orang yang beriman, (yaitu) orang yang khusyuk dalam salatnya.',
    kaynakFr: 'Al-Mu’minûn, 23:1-2', mealFr: 'Bienheureux sont les croyants, ceux qui sont humbles dans leur Salât.' },
  { kaynak: 'Nûr, 24/35', meal: 'Allah göklerin ve yerin nurudur.',
    kaynakEn: 'An-Nur, 24:35', mealEn: 'Allah is the Light of the heavens and the earth.',
    kaynakId: 'An-Nur, 24:35', mealId: 'Allah (pemberi) cahaya (kepada) langit dan bumi.',
    kaynakFr: 'An-Nûr, 24:35', mealFr: 'Allah est la Lumière des cieux et de la terre.' },
  { kaynak: 'Furkân, 25/63', meal: 'Rahmân’ın kulları, yeryüzünde vakarla ve alçak gönüllülükle yürüyen kimselerdir.',
    kaynakEn: 'Al-Furqan, 25:63', mealEn: 'The servants of the Most Merciful are those who walk upon the earth with humility.',
    kaynakId: 'Al-Furqan, 25:63', mealId: 'Dan hamba-hamba Tuhan Yang Maha Pengasih itu (ialah) orang-orang yang berjalan di bumi dengan rendah hati.',
    kaynakFr: 'Al-Furqân, 25:63', mealFr: 'Les serviteurs du Tout Miséricordieux sont ceux qui marchent sur terre humblement.' },
  { kaynak: 'Ankebût, 29/45', meal: 'Şüphesiz namaz hayâsızlıktan ve kötülükten alıkoyar. Allah’ı anmak elbette en büyük ibadettir.',
    kaynakEn: 'Al-Ankabut, 29:45', mealEn: 'Indeed, prayer restrains from indecency and wrongdoing, and the remembrance of Allah is indeed the greatest.',
    kaynakId: 'Al-’Ankabut, 29:45', mealId: 'Sesungguhnya salat itu mencegah dari (perbuatan) keji dan mungkar. Dan sungguh, mengingat Allah (salat) itu lebih besar (keutamaannya).',
    kaynakFr: 'Al-’Ankabût, 29:45', mealFr: 'En vérité, la Salât préserve de la turpitude et du blâmable, et le rappel d’Allah est plus grand encore.' },
  { kaynak: 'Ankebût, 29/69', meal: 'Bizim uğrumuzda gayret gösterenlere gelince, elbette biz onlara yollarımızı gösteririz.',
    kaynakEn: 'Al-Ankabut, 29:69', mealEn: 'As for those who strive for Us, We will surely guide them to Our ways.',
    kaynakId: 'Al-’Ankabut, 29:69', mealId: 'Dan orang-orang yang berjihad untuk (mencari keridaan) Kami, akan Kami tunjukkan kepada mereka jalan-jalan Kami.',
    kaynakFr: 'Al-’Ankabût, 29:69', mealFr: 'Quant à ceux qui luttent pour Notre cause, Nous les guiderons certainement sur Nos voies.' },
  { kaynak: 'Rûm, 30/60', meal: 'Sabret! Şüphesiz Allah’ın verdiği söz gerçektir.',
    kaynakEn: 'Ar-Rum, 30:60', mealEn: 'So be patient. Indeed, the promise of Allah is true.',
    kaynakId: 'Ar-Rum, 30:60', mealId: 'Maka bersabarlah engkau (Muhammad), sungguh, janji Allah itu benar.',
    kaynakFr: 'Ar-Rûm, 30:60', mealFr: 'Sois donc patient. La promesse d’Allah est vérité.' },
  { kaynak: 'Lokmân, 31/17', meal: 'Yavrucuğum! Namazı dosdoğru kıl, iyiliği emret, kötülükten alıkoy, başına gelene sabret.',
    kaynakEn: 'Luqman, 31:17', mealEn: 'My son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you.',
    kaynakId: 'Luqman, 31:17', mealId: 'Wahai anakku! Laksanakanlah salat, suruhlah (manusia) berbuat yang makruf, cegahlah (mereka) dari yang mungkar, dan bersabarlah terhadap apa yang menimpamu.',
    kaynakFr: 'Luqmân, 31:17', mealFr: 'Ô mon fils, accomplis la Salât, commande le convenable, interdis le blâmable et endure ce qui t’atteint.' },
  { kaynak: 'Ahzâb, 33/41-42', meal: 'Ey iman edenler! Allah’ı çokça anın ve O’nu sabah akşam tesbih edin.',
    kaynakEn: 'Al-Ahzab, 33:41-42', mealEn: 'O you who believe! Remember Allah often, and glorify Him morning and evening.',
    kaynakId: 'Al-Ahzab, 33:41-42', mealId: 'Wahai orang-orang yang beriman! Ingatlah kepada Allah dengan mengingat (nama-Nya) sebanyak-banyaknya, dan bertasbihlah kepada-Nya pada waktu pagi dan petang.',
    kaynakFr: 'Al-Ahzâb, 33:41-42', mealFr: 'Ô vous qui croyez ! Évoquez Allah abondamment, et glorifiez-Le matin et soir.' },
  { kaynak: 'Zümer, 39/53', meal: 'De ki: Ey kendi aleyhlerine aşırı giden kullarım! Allah’ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.',
    kaynakEn: 'Az-Zumar, 39:53', mealEn: 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.',
    kaynakId: 'Az-Zumar, 39:53', mealId: 'Katakanlah, Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.',
    kaynakFr: 'Az-Zumar, 39:53', mealFr: 'Dis : Ô Mes serviteurs qui avez commis des excès contre vous-mêmes, ne désespérez pas de la miséricorde d’Allah. Allah pardonne tous les péchés.' },
  { kaynak: 'Şûrâ, 42/30', meal: 'Başınıza gelen herhangi bir musibet kendi ellerinizle yaptıklarınız yüzündendir. Allah yine de çoğunu affeder.',
    kaynakEn: 'Ash-Shura, 42:30', mealEn: 'Whatever misfortune befalls you is because of what your own hands have earned — and He still pardons much.',
    kaynakId: 'Asy-Syura, 42:30', mealId: 'Musibah apa pun yang menimpamu adalah karena perbuatan tanganmu sendiri, dan Allah memaafkan banyak (dari kesalahanmu).',
    kaynakFr: 'Ash-Shûrâ, 42:30', mealFr: 'Tout malheur qui vous atteint est dû à ce que vos mains ont accompli ; et Il pardonne beaucoup.' },
  { kaynak: 'Muhammed, 47/7', meal: 'Ey iman edenler! Eğer siz Allah’a yardım ederseniz, O da size yardım eder ve ayaklarınızı sağlam bastırır.',
    kaynakEn: 'Muhammad, 47:7', mealEn: 'O you who believe! If you help Allah, He will help you and make firm your steps.',
    kaynakId: 'Muhammad, 47:7', mealId: 'Wahai orang-orang yang beriman! Jika kamu menolong (agama) Allah, niscaya Dia akan menolongmu dan meneguhkan kedudukanmu.',
    kaynakFr: 'Muhammad, 47:7', mealFr: 'Ô vous qui croyez ! Si vous portez secours (à la cause d’)Allah, Il vous secourra et raffermira vos pas.' },
  { kaynak: 'Kâf, 50/16', meal: 'Andolsun, insanı biz yarattık ve nefsinin ona ne fısıldadığını biliriz. Çünkü biz ona şah damarından daha yakınız.',
    kaynakEn: 'Qaf, 50:16', mealEn: 'We created man, and We know what his soul whispers to him — for We are closer to him than his jugular vein.',
    kaynakId: 'Qaf, 50:16', mealId: 'Dan sungguh, Kami telah menciptakan manusia dan mengetahui apa yang dibisikkan oleh hatinya, dan Kami lebih dekat kepadanya daripada urat lehernya.',
    kaynakFr: 'Qâf, 50:16', mealFr: 'Nous avons créé l’homme et Nous savons ce que son âme lui susurre. Nous sommes plus proche de lui que sa veine jugulaire.' },
  { kaynak: 'Zâriyât, 51/56', meal: 'Ben cinleri ve insanları ancak bana kulluk etsinler diye yarattım.',
    kaynakEn: 'Adh-Dhariyat, 51:56', mealEn: 'I did not create the jinn and mankind except to worship Me.',
    kaynakId: 'Az-Zariyat, 51:56', mealId: 'Tidaklah Aku ciptakan jin dan manusia melainkan agar mereka beribadah kepada-Ku.',
    kaynakFr: 'Adh-Dhâriyât, 51:56', mealFr: 'Je n’ai créé les djinns et les hommes que pour qu’ils M’adorent.' },
  { kaynak: 'Hadîd, 57/4', meal: 'Nerede olsanız O sizinle beraberdir.',
    kaynakEn: 'Al-Hadid, 57:4', mealEn: 'He is with you wherever you are.',
    kaynakId: 'Al-Hadid, 57:4', mealId: 'Dan Dia bersamamu di mana pun kamu berada.',
    kaynakFr: 'Al-Hadîd, 57:4', mealFr: 'Il est avec vous où que vous soyez.' },
  { kaynak: 'Talâk, 65/2-3', meal: 'Kim Allah’a karşı gelmekten sakınırsa, Allah ona bir çıkış yolu açar ve onu ummadığı yerden rızıklandırır.',
    kaynakEn: 'At-Talaq, 65:2-3', mealEn: 'Whoever is mindful of Allah, He will make a way out for them, and provide for them from where they do not expect.',
    kaynakId: 'At-Talaq, 65:2-3', mealId: 'Barangsiapa bertakwa kepada Allah, niscaya Dia akan memberikan jalan keluar baginya, dan memberinya rezeki dari arah yang tidak disangka-sangka.',
    kaynakFr: 'At-Talâq, 65:2-3', mealFr: 'Quiconque craint Allah, Il lui donnera une issue, et lui accordera Ses dons par des moyens sur lesquels il ne comptait pas.' },
  { kaynak: 'İnşirâh, 94/5-6', meal: 'Şüphesiz güçlükle beraber bir kolaylık vardır. Gerçekten, güçlükle beraber bir kolaylık vardır.',
    kaynakEn: 'Ash-Sharh, 94:5-6', mealEn: 'So, truly, with hardship comes ease. Truly, with hardship comes ease.',
    kaynakId: 'Al-Insyirah, 94:5-6', mealId: 'Maka sesungguhnya beserta kesulitan ada kemudahan. Sesungguhnya beserta kesulitan ada kemudahan.',
    kaynakFr: 'Ash-Sharh, 94:5-6', mealFr: 'Certes, avec la difficulté vient une facilité. Certes, avec la difficulté vient une facilité.' },
  { kaynak: 'Duhâ, 93/5', meal: 'Rabbin sana verecek ve sen razı olacaksın.',
    kaynakEn: 'Ad-Duha, 93:5', mealEn: 'And your Lord will give you, and you will be well pleased.',
    kaynakId: 'Ad-Duha, 93:5', mealId: 'Dan kelak Tuhanmu pasti memberikan karunia-Nya kepadamu, sehingga engkau menjadi puas.',
    kaynakFr: 'Ad-Duhâ, 93:5', mealFr: 'Et bientôt ton Seigneur te donnera, et tu seras satisfait.' },
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
