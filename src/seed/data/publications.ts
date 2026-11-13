import type { AuthorKey, TopicSlug } from './people'

export type SeedPublication = {
  slug: string
  kind: 'research' | 'article' | 'curated' | 'brief'
  series?: 'islamic-liberal-democracy' | 'national-statehood' | 'other'
  title: string
  subtitle?: string
  excerpt: string
  summary: string
  keyPoints: string[]
  content: string
  references?: string[]
  authors?: AuthorKey[]
  externalAuthors?: string
  journal?: string
  externalUrl?: string
  date: string
  readTime: number
  topics: TopicSlug[]
  language?: string
  featured?: boolean
}

const scholar = (q: string) => `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`

export const publications: SeedPublication[] = [
  /* ------------------------------------------------------------------ */
  /* Tadqiqot va nazariya — Islamic Liberal Democracy                    */
  /* ------------------------------------------------------------------ */
  {
    slug: 'islomiy-liberal-demokratiya-konseptual-asoslar',
    kind: 'research',
    series: 'islamic-liberal-democracy',
    featured: true,
    title: 'Islomiy liberal demokratiya: konseptual asoslar',
    subtitle: 'Islomiy qadriyatlar, fuqarolik jamiyati va qonun ustuvorligi sintezi',
    excerpt:
      'Islomiy qadriyatlar va liberal demokratik institutlar bir-birini inkor etadimi yoki toʻldiradimi? Ushbu konseptual loyiha uch ustun — qadriyatlar, fuqarolik jamiyati va qonun ustuvorligi — asosida sintez modelini taklif qiladi.',
    summary:
      'Maqola Islom va demokratiya oʻrtasidagi munosabatni “ziddiyat” yoki “toʻliq moslik” ikkilamchiligidan chiqib, institutsional yondashuv bilan koʻrib chiqadi. Alfred Stepanning “ikki tomonlama tolerantlik” konsepsiyasi, maqosid ash-shariʼa anʼanasi va Forobiyning fozil jamiyat haqidagi qarashlariga tayanib, Markaziy Osiyo sharoitiga mos uch ustunli model taklif etiladi.',
    keyPoints: [
      'Islom va demokratiya munosabati — mutlaq ziddiyat emas, institutlar dizayni masalasi',
      '“Ikki tomonlama tolerantlik”: davlat dinga, din esa demokratik institutlarga hurmat koʻrsatadi',
      'Maqosid ash-shariʼa (hayot, aql, nasl, mol va dinni himoya qilish) inson huquqlari tilida qayta oʻqilishi mumkin',
      'Mahalla va vaqf anʼanalari fuqarolik jamiyatining milliy ildizlari boʻla oladi',
      'Qonun ustuvorligi har ikki anʼananing umumiy maxraji sifatida taklif qilinadi',
    ],
    content: `## Kirish
Soʻnggi oʻttiz yil davomida “Islom va demokratiya mos keladimi?” degan savol akademik va siyosiy munozaralarning markazida turibdi. Bir guruh mualliflar bu ikki tizimni tabiatan zid deb hisoblasa, boshqalari Islom anʼanasida demokratiyaga yaqin tamoyillar — shoʻro (maslahat), bayʼat (rozilik) va adl (adolat) borligini taʼkidlaydi.

Ushbu loyiha boshqacha savol qoʻyadi: **qanday institutlar** islomiy qadriyatlarni hurmat qiladigan va ayni paytda erkinlik, tenglik va qonun ustuvorligini kafolatlaydigan jamiyatni barpo etishga yordam beradi?

## Muammo qoʻyilishi
Munozaralarning katta qismi matnlar darajasida qoladi: muayyan oyat yoki hadis demokratiyaga “ruxsat beradimi” degan savol atrofida aylanadi. Biz esa siyosatshunoslikdagi institutsional yondashuvdan foydalanamiz: natija qadriyatlarning oʻzidan koʻra, ular amal qiladigan qoidalar va tashkilotlarga bogʻliq.

## Birinchi ustun: qadriyatlar
Maqosid ash-shariʼa anʼanasi — Imom Gʻazzoliy va Shotibiy kabi olimlar ishlab chiqqan — shariatning maqsadini besh narsani himoya qilishda koʻradi: hayot, aql, nasl, mol va din. Bu tasnif zamonaviy inson huquqlari katalogi bilan bevosita bogʻlanadi: yashash huquqi, fikr erkinligi, oila daxlsizligi, mulk huquqi va vijdon erkinligi.

## Ikkinchi ustun: fuqarolik jamiyati
Markaziy Osiyoda mahalla, vaqf va hunarmandlar uyushmalari asrlar davomida davlat va oila oʻrtasidagi oraliq makon vazifasini bajargan. Bu tuzilmalar mustaqil, oʻzini oʻzi boshqaradigan va qonun bilan himoyalangan boʻlsa, zamonaviy fuqarolik jamiyatining mustahkam poydevoriga aylanishi mumkin.

## Uchinchi ustun: qonun ustuvorligi
Alfred Stepan (2000) demokratiya uchun “ikki tomonlama tolerantlik” zarurligini koʻrsatgan: diniy institutlar saylangan hukumat vakolatlarini tan oladi, davlat esa fuqarolarning diniy hayotiga aralashmaydi. Bu muvozanat faqat mustaqil sud va hammaga birday amal qiladigan qonunlar orqali taʼminlanadi.

> Forobiy fozil shaharni aʼzolari bir-biriga yordam berib, birgalikda saodatga erishadigan jamiyat deb taʼriflagan. Bugungi tilda bu — umumiy manfaat va ishonch institutlariga tayangan jamiyat.

## Xulosa va keyingi bosqichlar
Model uch ustunning birortasisiz barqaror boʻlmaydi: qadriyatlarsiz institutlar ruhsiz, institutlarsiz qadriyatlar esa himoyasiz qoladi. Loyihaning keyingi bosqichida mahalla institutini chuqur oʻrganish va qonun ustuvorligi indikatorlarini milliy kontekstga moslashtirish rejalashtirilgan.`,
    references: [
      'Stepan, A. (2000). Religion, Democracy, and the “Twin Tolerations”. Journal of Democracy, 11(4).',
      'An-Naʼim, A. A. (2008). Islam and the Secular State. Harvard University Press.',
      'Abou El Fadl, K. (2004). Islam and the Challenge of Democracy. Princeton University Press.',
      'Rahman, F. (1982). Islam and Modernity. University of Chicago Press.',
      'Forobiy, Abu Nasr. Fozil odamlar shahri.',
    ],
    authors: ['kamola', 'jasur'],
    date: '2026-10-28',
    readTime: 18,
    topics: ['islom', 'siyosat', 'huquq'],
  },
  {
    slug: 'mahalla-va-fuqarolik-jamiyati',
    kind: 'research',
    series: 'islamic-liberal-democracy',
    title: 'Mahalla va fuqarolik jamiyati: ijtimoiy kapitalning milliy shakli',
    excerpt:
      'Mahalla — davlat organimi yoki fuqarolik jamiyati instituti? Tadqiqot Robert Patnamning ijtimoiy kapital nazariyasi orqali mahallaning ikki tomonlama tabiatini tahlil qiladi.',
    summary:
      'Mahalla Oʻzbekistonda ishonch, oʻzaro yordam va jamoaviy qaror qabul qilish anʼanasining asosiy tashuvchisi. Biroq uning davlat tizimiga integratsiyasi mustaqil fuqarolik instituti sifatidagi rolini cheklashi mumkin. Maqola muvozanatni saqlash uchun uchta tamoyil taklif qiladi.',
    keyPoints: [
      'Mahalla — “bogʻlovchi” ijtimoiy kapitalning kuchli manbai',
      'Haddan tashqari maʼmuriy vazifalar mahallaning ixtiyoriy tabiatini zaiflashtiradi',
      'Shaffof saylov, mustaqil byudjet va yoshlar ishtiroki — muvozanat tamoyillari',
    ],
    content: `## Ijtimoiy kapital nima?
Ijtimoiy kapital — odamlar oʻrtasidagi ishonch, oʻzaro yordam meʼyorlari va tarmoqlar. Patnam bu kapitalni demokratik institutlarning samarali ishlashi uchun muhim omil deb hisoblagan.

## Mahallaning ikki tomonlama tabiati
Mahalla tarixan qoʻshnilar oʻrtasidagi ixtiyoriy hamkorlik shakli boʻlgan: hashar, toʻy-marakalar, nizolarni hal qilish. Zamonaviy davrda unga ijtimoiy himoya va maʼmuriy vazifalar ham yuklangan.

## Muvozanat tamoyillari
- Mahalla raisini shaffof va raqobatli saylash
- Mahalla byudjetini aholining ochiq muhokamasi bilan shakllantirish
- Yoshlar kengashlari orqali yangi avlodni qaror qabul qilishga jalb etish

## Xulosa
Mahalla toʻgʻri institutsional dizayn bilan milliy oʻziga xoslikka ega fuqarolik jamiyatining tayanchiga aylanishi mumkin.`,
    authors: ['sardor', 'madina'],
    date: '2026-09-15',
    readTime: 11,
    topics: ['islom', 'siyosat'],
  },
  {
    slug: 'qonun-ustuvorligi-va-maqosid',
    kind: 'research',
    series: 'islamic-liberal-democracy',
    title: 'Qonun ustuvorligi va adolat: maqosid ash-shariʼa va zamonaviy konstitutsionalizm',
    excerpt:
      'Ikki huquqiy anʼana — maqosid nazariyasi va konstitutsionalizm — hokimiyatni cheklash va inson qadrini himoya qilish masalasida qanchalik yaqin?',
    summary:
      'Maqola “qonun ustuvorligi” tushunchasining Gʻarb huquqshunosligidagi talqinini (Lon Fuller, H. L. A. Hart) maqosid ash-shariʼa anʼanasidagi adolat va maslaha tushunchalari bilan qiyoslaydi va ular oʻrtasida uchta umumiy nuqtani ajratadi.',
    keyPoints: [
      'Har ikki anʼanada hokimiyat qonunga boʻysunishi kerak',
      'Fullerning “qonunning ichki axloqi” va maqosiddagi adolat tamoyili oʻxshash',
      'Konstitutsiyaviy sud nazorati — tamoyillarni amaliyotga koʻchirish vositasi',
    ],
    content: `## Kirish
Qonun ustuvorligi — hukmdor ham, fuqaro ham bir xil qoidalarga boʻysunadigan tartib. Bu gʻoya turli sivilizatsiyalarda turlicha ifodalangan.

## Fuller va qonunning ichki axloqi
Lon Fuller “The Morality of Law” asarida qonun umumiy, eʼlon qilingan, tushunarli, orqaga qaytmaydigan va bajarish mumkin boʻlishi kerakligini taʼkidlagan.

## Maqosid ash-shariʼa
Mumtoz faqihlar shariatning maqsadi insonlar manfaatini (maslaha) himoya qilish deb bilgan. Bu yondashuv qonunni mexanik qoʻllash emas, uning maqsadini tushunishni talab qiladi.

## Umumiy nuqtalar
1. Hokimiyatning cheklanganligi
2. Qonun oldida tenglik
3. Insonning qadr-qimmatini himoya qilish

## Xulosa
Ikki anʼana oʻrtasidagi muloqot milliy huquqiy islohotlar uchun boy manba boʻlishi mumkin.`,
    authors: ['dilshod'],
    date: '2026-08-30',
    readTime: 12,
    topics: ['huquq', 'islom'],
  },

  /* ------------------------------------------------------------------ */
  /* Tadqiqot va nazariya — Milliy davlatchilik va meros                */
  /* ------------------------------------------------------------------ */
  {
    slug: 'forobiy-fozil-shahar-tahlili',
    kind: 'research',
    series: 'national-statehood',
    featured: true,
    title: 'Forobiyning “Fozil odamlar shahri”: ideal jamiyat va rahbar sifatlari',
    excerpt:
      '“Ikkinchi muallim” Abu Nasr Forobiy jamiyatni tirik organizmga qiyoslagan va rahbarga oʻn ikki fazilatni shart qilib qoʻygan. Bu gʻoyalar bugungi boshqaruv uchun nimani anglatadi?',
    summary:
      'Tadqiqot Forobiyning “Fozil odamlar shahri qarashlari” asaridagi asosiy gʻoyalarni — saodatni jamiyat maqsadi sifatida, tana tamsilini, rahbar fazilatlarini va nofozil shaharlar tasnifini — tahlil qiladi hamda ularni zamonaviy yetakchilik va davlat boshqaruvi nazariyalari bilan solishtiradi.',
    keyPoints: [
      'Forobiy uchun jamiyatning oliy maqsadi — barcha aʼzolarning saodatga erishishi',
      'Shahar tanaga oʻxshaydi: har bir aʼzo oʻz vazifasini bajarganda butun organizm sogʻlom boʻladi',
      'Rahbar bilimli, adolatli, soʻzi va ishi bir, mol-dunyoga berilmagan boʻlishi kerak',
      '“Johil”, “fosiq”, “oʻzgargan” va “adashgan” shaharlar — jamiyat inqirozining turlari',
    ],
    content: `## Muallif haqida
Abu Nasr Muhammad al-Forobiy (taxminan 870–950) Sirdaryo boʻyidagi Forob (Oʻtror) shahrida tugʻilgan. Aristoteldan keyin “ikkinchi muallim” (al-muallim as-soniy) unvoni bilan mashhur boʻlgan. Bagʻdod va Damashqda faoliyat yuritgan.

## Saodat — jamiyat maqsadi
Forobiy inson yolgʻiz holda kamolotga erisha olmaydi, deb hisoblaydi. Odamlar birlashib, bir-biriga yordam berganda saodatga erishadi. Shu maqsadda birlashgan jamiyat — **fozil shahar**.

## Tana tamsili
Fozil shahar sogʻlom tanaga oʻxshaydi: yurak (rahbar) boshqa aʼzolarni boshqaradi, har bir aʼzo esa oʻz vazifasini bajaradi. Bu tamsil jamiyatdagi mehnat taqsimoti va oʻzaro bogʻliqlikni ifodalaydi.

## Rahbar fazilatlari
Forobiy rahbarda boʻlishi kerak boʻlgan oʻn ikki fazilatni sanab oʻtadi, jumladan:
- sogʻlom va baquvvat boʻlish
- tushunish va eslab qolish qobiliyati
- bilimga muhabbat va haqiqatgoʻylik
- adolatparvarlik va zulmdan nafratlanish
- mol-dunyoga berilmaslik va iroda kuchi

Bu fazilatlarning barchasi bir kishida jamlanmasa, boshqaruvni bir necha kishi birgalikda amalga oshirishi mumkinligini ham taʼkidlaydi.

## Nofozil shaharlar
Forobiy fozil shaharga qarama-qarshi jamiyatlarni tasniflaydi: saodatni bilmaydigan **johil** shahar, saodatni bilib, unga amal qilmaydigan **fosiq** shahar, qarashlari buzilgan **oʻzgargan** shahar va notoʻgʻri tasavvurlarga ergashgan **adashgan** shahar.

## Bugungi ahamiyati
Forobiy gʻoyalari zamonaviy “xizmatkor yetakchilik”, “yaxshi boshqaruv” (good governance) va jamoat manfaati tushunchalari bilan hamohang. Ayniqsa, rahbarning bilim va axloqiy fazilatlari haqidagi talablar bugungi davlat xizmatchisi etikasi uchun dolzarb.`,
    references: [
      'Forobiy, Abu Nasr. Fozil odamlar shahri qarashlari.',
      'Walzer, R. (tarj. va sharh) (1985). Al-Farabi on the Perfect State. Oxford: Clarendon Press.',
      'Starr, S. F. (2013). Lost Enlightenment. Princeton University Press.',
    ],
    authors: ['zarina'],
    date: '2026-10-12',
    readTime: 15,
    topics: ['meros', 'falsafa'],
  },
  {
    slug: 'nizomulmulk-siyosatnoma-tahlili',
    kind: 'research',
    series: 'national-statehood',
    title: 'Nizomulmulkning “Siyosatnoma”si: adolatli boshqaruv va maʼmuriy tizim',
    excerpt:
      'Saljuqiylar vaziri Nizomulmulk XI asr oxirida sultonga yozgan nasihatnoma bugungi davlat xizmatchisi uchun ham saboq bera oladimi?',
    summary:
      '“Siyosatnoma” (“Siyar ul-muluk”) Saljuqiylar sultoni Malikshoh uchun yozilgan boshqaruv qoʻllanmasi. Maqola asardagi adolat, nazorat, axborot tizimi va kadrlar siyosatiga oid gʻoyalarni tahlil qiladi.',
    keyPoints: [
      'Adolat — davlat barqarorligining asosi: “mamlakat kufr bilan turishi mumkin, zulm bilan turmaydi” degan maqol asar ruhini ifodalaydi',
      'Mahalliy amaldorlar ustidan muntazam nazorat va xabar tizimi tavsiya qilinadi',
      'Lavozimlarga loyiqlik asosida tayinlash taʼkidlanadi',
    ],
    content: `## Asar va muallif
Abu Ali Hasan ibn Ali Tusiy — Nizomulmulk (1018–1092) Saljuqiylar davlatining bosh vaziri boʻlgan. “Siyosatnoma” uning umrining soʻnggi yillarida Sulton Malikshohga atab yozilgan.

## Adolat gʻoyasi
Asarda hukmdor xalq shikoyatlarini shaxsan tinglashi, zulmga yoʻl qoʻygan amaldorlarni jazolashi kerakligi qayta-qayta taʼkidlanadi.

## Nazorat va axborot
Nizomulmulk viloyatlardagi vaziyatdan xabardor boʻlish uchun ishonchli xabarchilar tizimini tavsiya qiladi. Bu bugungi “jamoatchilik nazorati” va “fikr-mulohaza” mexanizmlarining ilk koʻrinishi sifatida talqin qilinishi mumkin.

## Kadrlar siyosati
Lavozimlarni qarindoshlik emas, bilim va tajriba asosida berish, bir kishiga bir nechta muhim lavozimni bermaslik tavsiya etiladi.

## Xulosa
“Siyosatnoma” — oʻrta asr kontekstida yozilgan boʻlsa-da, yaxshi boshqaruvning universal tamoyillarini oʻz ichiga olgan manba.`,
    authors: ['sardor'],
    date: '2026-09-02',
    readTime: 10,
    topics: ['meros', 'siyosat'],
  },
  {
    slug: 'temur-tuzuklari-davlat-qurilishi',
    kind: 'research',
    series: 'national-statehood',
    title: '“Temur tuzuklari”: davlat qurilishi, kengash va qonun',
    excerpt:
      'Amir Temurga nisbat berilgan “Tuzuklar” davlatni boshqarishda kengash, tartib va adolatga qanday oʻrin beradi? Matnning tarixi va gʻoyalari haqida.',
    summary:
      'Maqola “Temur tuzuklari” matnining tarixini (XVII asrda fors tilida maʼlum boʻlishi, 1783-yilda Oksfordda inglizcha tarjimada nashr etilishi va muallifligi haqidagi ilmiy bahslar) hamda asardagi kengash, qonun va ijtimoiy tabaqalar haqidagi gʻoyalarni koʻrib chiqadi.',
    keyPoints: [
      'Matnning muallifligi ilmiy bahsli — bu manbani tanqidiy oʻqishni talab qiladi',
      'Muhim qarorlarni kengash (mashvarat) bilan qabul qilish tamoyili',
      'Jamiyatni oʻn ikki toifaga ajratib, har biriga hurmat bilan munosabat',
    ],
    content: `## Matn tarixi
“Tuzuklar” Amir Temur (1336–1405) nomidan yozilgan boshqaruv va harbiy qoidalar toʻplami sifatida maʼlum. Fors tilidagi matn XVII asrda paydo boʻlgan; 1783-yilda Oksfordda inglizcha tarjimasi bilan nashr etilgan. Tadqiqotchilar matnning qaysi qismlari Temur davriga tegishli ekani haqida turli fikrlarni bildiradi.

## Kengash va maslahat
Matnda davlat ishlarining katta qismi kengash, tadbir va ehtiyotkorlik bilan hal qilinishi taʼkidlanadi.

## Qonun va tartib
“Tuzuklar”da lavozimlar, mukofot va jazo tartibi, qoʻshin tuzilishi batafsil bayon qilingan.

## Tanqidiy oʻqish
Tarixiy manbani oʻrganishda uning yaratilish konteksti va muallifligi haqidagi savollarni hisobga olish zarur. Shunda u milliy gʻurur manbai boʻlish bilan birga ilmiy tahlil obyekti ham boʻladi.`,
    authors: ['sardor', 'kamola'],
    date: '2026-07-20',
    readTime: 9,
    topics: ['meros'],
  },

  /* ------------------------------------------------------------------ */
  /* Kutubxona III — ilmiy maqolalar (hamkorlar va mualliflar)          */
  /* ------------------------------------------------------------------ */
  {
    slug: 'raqamli-davrda-jamoatchilik-muhokamasi',
    kind: 'article',
    title: 'Raqamli davrda jamoatchilik muhokamasi: Telegram kanallari va deliberativ demokratiya',
    excerpt: 'Ijtimoiy tarmoqlar ochiq muhokama maydonimi yoki “aks-sado xonalari”mi? Yurgen Habermas gʻoyalari orqali tahlil.',
    summary: 'Maqola Habermasning “jamoatchilik makoni” tushunchasini Oʻzbekistonda keng tarqalgan Telegram kanallari va guruhlariga tatbiq etadi.',
    keyPoints: ['Telegram — yangi “jamoatchilik makoni”', 'Algoritmlar va “aks-sado xonalari” xavfi', 'Muhokama madaniyati qoidalari zarurati'],
    content: `## Jamoatchilik makoni
Habermas uchun jamoatchilik makoni — fuqarolar teng huquqli boʻlib, umumiy masalalarni dalillar asosida muhokama qiladigan maydon.

## Telegram fenomeni
Oʻzbekistonda Telegram yangiliklar, muhokama va jamoaviy tashkilotchilikning asosiy vositasiga aylangan.

## Xulosa
Raqamli maydon deliberatsiya uchun imkoniyat, lekin muhokama madaniyatisiz u qutblanishni kuchaytirishi mumkin.`,
    authors: ['behruz'],
    date: '2026-10-05',
    readTime: 8,
    topics: ['siyosat'],
  },
  {
    slug: 'ibn-xaldun-asabiyya-va-barqarorlik',
    kind: 'article',
    title: 'Ibn Xaldunning asabiyya nazariyasi va zamonaviy davlat barqarorligi',
    excerpt: 'Jamoaviy birdamlik (asabiyya) sulolalarning yuksalishi va inqirozini tushuntiradi. Bu nazariya bugungi davlatlar uchun nimani anglatadi?',
    summary: 'Maqola “Muqaddima”dagi asabiyya va davlat sikli gʻoyasini zamonaviy institutsional nazariya bilan solishtiradi.',
    keyPoints: ['Asabiyya — jamoaviy birdamlik va safarbarlik qobiliyati', 'Davlatning tugʻilish, yuksalish va inqiroz sikli', 'Institutlar asabiyyani barqaror ishonchga aylantirishi mumkin'],
    content: `## Asabiyya
Ibn Xaldun (1332–1406) davlatlarni birdamligi kuchli guruhlar quradi, deb hisoblagan.

## Davlat sikli
Hokimiyat qoʻlga kiritilgach, hashamat va loqaydlik birdamlikni zaiflashtiradi va sulola inqirozga yuz tutadi.

## Zamonaviy talqin
Bugungi davlatlar asabiyyani shaxsiy sadoqatga emas, umumiy institutlar va fuqarolik identifikatsiyasiga tayanib saqlashga harakat qiladi.`,
    authors: ['zarina'],
    date: '2026-08-18',
    readTime: 9,
    topics: ['falsafa', 'meros'],
  },
  {
    slug: 'kichik-biznes-va-institutlar',
    kind: 'article',
    title: 'Kichik biznes va institutlar: de Soto nazariyasi Markaziy Osiyo kontekstida',
    excerpt: 'Nega ayrim mamlakatlarda mehnatkash tadbirkorlar kambagʻal qoladi? “Oʻlik kapital” tushunchasi va mulk huquqi.',
    summary: 'Ernando de Sotoning “The Mystery of Capital” asaridagi gʻoyalar asosida rasmiy mulk huquqi va kichik biznes rivoji oʻrtasidagi bogʻliqlik tahlil qilinadi.',
    keyPoints: ['Rasmiylashtirilmagan mulk — “oʻlik kapital”', 'Oddiy roʻyxatdan oʻtish tartibi tadbirkorlikni ragʻbatlantiradi', 'Ishonchli sud tizimi kredit olish imkonini kengaytiradi'],
    content: `## Oʻlik kapital
De Soto rivojlanayotgan mamlakatlarda aholi katta aktivlarga ega, lekin ular rasmiy hujjatlashtirilmagani uchun kapitalga aylanmaydi, deb taʼkidlaydi.

## Markaziy Osiyo konteksti
Uy-joy va yer ustidan aniq huquqlar, oddiy litsenziyalash va mustaqil sudlar kichik biznes uchun hal qiluvchi ahamiyatga ega.

## Tavsiyalar
- Mulkni roʻyxatdan oʻtkazishni raqamlashtirish
- Kichik nizolar uchun tezkor sud tartibi
- Mikrokredit va garov tizimini kengaytirish`,
    authors: ['rustam'],
    date: '2026-07-08',
    readTime: 7,
    topics: ['iqtisod', 'huquq'],
  },
  {
    slug: 'mill-va-forobiy-baxt-va-erkinlik',
    kind: 'article',
    title: 'Mill va Forobiy: baxt, erkinlik va jamiyat',
    excerpt: 'Ikki mutafakkir — ikki xil davr. Biri baxtni erkinlikda, ikkinchisi saodatni hamjihatlikda koʻradi. Ular qayerda uchrashadi?',
    summary: 'Talaba muallif Mill utilitarizmi va Forobiyning saodat tushunchasini qiyoslab, ularning jamiyat va shaxs munosabatiga qarashlarini tahlil qiladi.',
    keyPoints: ['Mill: shaxs erkinligi — jamiyat taraqqiyoti sharti', 'Forobiy: saodat faqat jamiyatda erishiladi', 'Har ikkisi uchun taʼlim va aql markaziy oʻrinda'],
    content: `## Ikki yondashuv
Mill uchun eng yuqori qadriyat — individual erkinlik va shaxsiy rivojlanish. Forobiy uchun esa inson faqat fozil jamiyatda kamolotga erishadi.

## Uchrashuv nuqtasi
Har ikki mutafakkir ham insonning aqliy kamolotini jamiyatning maqsadi deb biladi.

## Xulosa
Bugungi jamiyat ikki qarashni uygʻunlashtirishi mumkin: erkin shaxs va mustahkam jamoa bir-birini toʻldiradi.`,
    authors: ['madina'],
    date: '2026-10-20',
    readTime: 6,
    topics: ['falsafa'],
  },
  {
    slug: 'talim-inson-kapitali',
    kind: 'article',
    title: 'Taʼlim — inson kapitali: mikroiqtisodiy yondashuv',
    excerpt: 'Nega taʼlimga sarflangan har bir yil kelajakdagi daromadga taʼsir qiladi? Inson kapitali nazariyasining oddiy tushuntirishi.',
    summary: 'Maqola Gari Bekker va Teodor Shults ishlab chiqqan inson kapitali nazariyasini sodda tilda tushuntiradi va yoshlar uchun amaliy xulosalar chiqaradi.',
    keyPoints: ['Taʼlim — isteʼmol emas, investitsiya', 'Muqobil xarajat: oʻqish yillaridagi yoʻqotilgan daromad', 'Davlat taʼlimni qoʻllab-quvvatlashi tashqi ijobiy effekt bilan asoslanadi'],
    content: `## Inson kapitali
Bilim, koʻnikma va sogʻliq — insonning daromad keltiradigan kapitali.

## Investitsiya mantiqi
Taʼlimning xarajati bugun, foydasi esa butun hayot davomida olinadi.

## Davlat roli
Bilimli jamiyat hammaga foyda keltiradi, shuning uchun taʼlimni qoʻllab-quvvatlash iqtisodiy jihatdan asoslangan.`,
    authors: ['aziz'],
    date: '2026-09-25',
    readTime: 6,
    topics: ['iqtisod'],
  },

  /* ------------------------------------------------------------------ */
  /* Kutubxona III — xalqaro jurnallardan tanlovlar (real articles)     */
  /* ------------------------------------------------------------------ */
  {
    slug: 'stepan-twin-tolerations',
    kind: 'curated',
    title: 'Religion, Democracy, and the “Twin Tolerations”',
    excerpt: 'Din va demokratiya oʻrtasidagi munosabatni “ikki tomonlama tolerantlik” tushunchasi orqali tushuntirgan klassik maqola.',
    summary: 'Stepan demokratiya uchun qatʼiy sekulyarizm emas, davlat va diniy institutlar oʻrtasidagi oʻzaro hurmat chegaralari muhim ekanini koʻrsatadi. Tahririyat annotatsiyasi.',
    keyPoints: ['Diniy institutlar demokratik hokimiyatni tan oladi', 'Davlat fuqarolarning diniy erkinligini hurmat qiladi', 'Yevropa va musulmon mamlakatlari tajribasi qiyoslanadi'],
    content: 'Bu xalqaro jurnaldan tanlangan maqola. Toʻliq matn asl nashrda mavjud — “Asl manbaga oʻtish” tugmasidan foydalaning.',
    externalAuthors: 'Alfred Stepan',
    journal: 'Journal of Democracy, 11(4)',
    externalUrl: scholar('Stepan Religion, Democracy, and the Twin Tolerations'),
    date: '2000-10-01',
    readTime: 25,
    topics: ['islom', 'siyosat'],
    language: 'en',
  },
  {
    slug: 'sen-democracy-as-a-universal-value',
    kind: 'curated',
    title: 'Democracy as a Universal Value',
    excerpt: 'Nobel mukofoti sovrindori Amartya Sen demokratiya faqat Gʻarbga xos emas, universal qadriyat ekanini asoslaydi.',
    summary: 'Sen demokratiyaning uch xil ahamiyatini ajratadi: oʻz-oʻzidan qimmatli, instrumental va konstruktiv. Tahririyat annotatsiyasi.',
    keyPoints: ['Demokratiya — inson erkinligining bir qismi', 'Erkin matbuot va saylovlar ocharchiliklarning oldini olishga yordam beradi', 'Qadriyatlar ochiq muhokamada shakllanadi'],
    content: 'Bu xalqaro jurnaldan tanlangan maqola. Toʻliq matn asl nashrda mavjud — “Asl manbaga oʻtish” tugmasidan foydalaning.',
    externalAuthors: 'Amartya Sen',
    journal: 'Journal of Democracy, 10(3)',
    externalUrl: scholar('Sen Democracy as a Universal Value'),
    date: '1999-07-01',
    readTime: 20,
    topics: ['siyosat', 'iqtisod'],
    language: 'en',
  },
  {
    slug: 'levitsky-way-competitive-authoritarianism',
    kind: 'curated',
    title: 'The Rise of Competitive Authoritarianism',
    excerpt: 'Saylovlar oʻtkaziladigan, lekin raqobat teng boʻlmagan gibrid rejimlarni tasniflagan taʼsirli maqola.',
    summary: 'Mualliflar demokratiya va toʻliq avtoritarizm oʻrtasidagi “raqobatli avtoritarizm” toifasini taʼriflaydi. Tahririyat annotatsiyasi.',
    keyPoints: ['Gibrid rejimlar — alohida toifa', 'Saylov, sud, media va qonun chiqaruvchi — toʻrt raqobat maydoni', 'Notekis oʻyin maydoni tushunchasi'],
    content: 'Bu xalqaro jurnaldan tanlangan maqola. Toʻliq matn asl nashrda mavjud — “Asl manbaga oʻtish” tugmasidan foydalaning.',
    externalAuthors: 'Steven Levitsky, Lucan A. Way',
    journal: 'Journal of Democracy, 13(2)',
    externalUrl: scholar('Levitsky Way The Rise of Competitive Authoritarianism'),
    date: '2002-04-01',
    readTime: 22,
    topics: ['siyosat'],
    language: 'en',
  },
  {
    slug: 'fukuyama-end-of-history',
    kind: 'curated',
    title: 'The End of History?',
    excerpt: 'Sovuq urush yakunida liberal demokratiya insoniyat mafkuraviy evolyutsiyasining soʻnggi nuqtasi boʻlishi mumkinligi haqidagi bahsli esse.',
    summary: 'Fukuyama Gegel falsafasiga tayanib, liberal demokratiyaga jiddiy mafkuraviy muqobil qolmaganini ilgari suradi. Maqola koʻplab tanqidlarga sabab boʻlgan. Tahririyat annotatsiyasi.',
    keyPoints: ['Mafkuraviy kurashning yakunlanishi haqidagi tezis', 'Gegel va Kojev talqini', 'Keyinchalik koʻplab tanqid va bahslarga asos boʻldi'],
    content: 'Bu xalqaro jurnaldan tanlangan maqola. Toʻliq matn asl nashrda mavjud — “Asl manbaga oʻtish” tugmasidan foydalaning.',
    externalAuthors: 'Francis Fukuyama',
    journal: 'The National Interest, No. 16',
    externalUrl: scholar('Fukuyama The End of History? National Interest 1989'),
    date: '1989-06-01',
    readTime: 30,
    topics: ['siyosat', 'falsafa'],
    language: 'en',
  },
  {
    slug: 'huntington-clash-of-civilizations',
    kind: 'curated',
    title: 'The Clash of Civilizations?',
    excerpt: 'Sovuq urushdan keyingi dunyoda ziddiyatlar sivilizatsiyalar chegarasida yuzaga keladi degan gipoteza.',
    summary: 'Huntington kelajakdagi asosiy ziddiyatlar mafkura yoki iqtisod emas, madaniy-sivilizatsion farqlar asosida boʻlishini taxmin qiladi. Fukuyama tezisiga muqobil sifatida keng muhokama qilingan. Tahririyat annotatsiyasi.',
    keyPoints: ['Sivilizatsiyalar — xalqaro siyosatning asosiy birligi', '“Yoriq chiziqlari” tushunchasi', 'Gipoteza koʻplab empirik tanqidlarga uchragan'],
    content: 'Bu xalqaro jurnaldan tanlangan maqola. Toʻliq matn asl nashrda mavjud — “Asl manbaga oʻtish” tugmasidan foydalaning.',
    externalAuthors: 'Samuel P. Huntington',
    journal: 'Foreign Affairs, 72(3)',
    externalUrl: scholar('Huntington The Clash of Civilizations? Foreign Affairs 1993'),
    date: '1993-06-01',
    readTime: 30,
    topics: ['siyosat', 'islom'],
    language: 'en',
  },

  /* ------------------------------------------------------------------ */
  /* Kutubxona IV — siyosiy tahlilnomalar (policy briefs)               */
  /* ------------------------------------------------------------------ */
  {
    slug: 'maktablarda-debat-klublari',
    kind: 'brief',
    title: 'Maktablarda debat klublarini tizimli joriy etish',
    excerpt: 'Tanqidiy fikrlash va nutq madaniyatini rivojlantirish uchun har bir maktabda debat klubi: muammo, tahlil va 4 ta tavsiya.',
    summary: 'Tahlilnoma maktab oʻquvchilarida asosli bahs yuritish koʻnikmasi yetishmasligini koʻrsatadi va debat klublarini bosqichma-bosqich joriy etish modelini taklif qiladi.',
    keyPoints: ['Debat — tanqidiy fikrlashni oʻrgatishning arzon va samarali usuli', 'Oʻqituvchilar uchun qisqa malaka oshirish kursi kerak', 'Viloyatlararo onlayn liga motivatsiyani oshiradi'],
    content: `## Muammo
Oʻquvchilar maʼlumotni yod olishga oʻrganadi, lekin fikrni dalil bilan himoya qilish, qarshi fikrni tinglash koʻnikmasi kam rivojlangan.

## Tahlil
Debat klublari bu koʻnikmalarni kam xarajat bilan rivojlantiradi. Asosiy toʻsiq — tayyorlangan murabbiylar va metodik materiallar yetishmasligi.

## Tavsiyalar
1. Har bir tumanda kamida bitta tayanch maktabda debat klubini ochish
2. Oʻqituvchilar uchun 36 soatlik onlayn kurs tashkil etish
3. Oʻzbek tilida ochiq metodik qoʻllanma yaratish
4. Viloyatlararo onlayn debat ligasini yoʻlga qoʻyish`,
    authors: ['islom'],
    date: '2026-10-30',
    readTime: 5,
    topics: ['siyosat'],
  },
  {
    slug: 'qishloq-yoshlari-uchun-onlayn-kutubxona',
    kind: 'brief',
    title: 'Qishloq yoshlari uchun onlayn kutubxonaga kirishni kengaytirish',
    excerpt: 'Shahar va qishloq oʻrtasidagi bilim tafovutini qisqartirish uchun raqamli kutubxona va mahalla axborot nuqtalari.',
    summary: 'Tahlilnoma qishloq hududlarida sifatli adabiyotga kirish cheklanganini koʻrsatib, raqamli kutubxona va mahalla axborot nuqtalari modelini taklif qiladi.',
    keyPoints: ['Kitobga kirish — imkoniyatlar tengligining asosi', 'Mahalla va maktab kutubxonalarini raqamli tarmoqqa ulash', 'Oʻzbek tilidagi ilmiy-ommabop adabiyot tarjimasini koʻpaytirish'],
    content: `## Muammo
Qishloq yoshlari uchun zamonaviy ilmiy adabiyot topish qiyin, kutubxona fondlari eskirgan.

## Tavsiyalar
1. Maktab kutubxonalarida bepul internet va planshet bilan “raqamli burchak” tashkil etish
2. Ochiq litsenziyali kitoblarni oʻzbek tiliga tarjima qilish dasturi
3. Oylik onlayn kitob klublari orqali oʻqishni ragʻbatlantirish`,
    authors: ['madina'],
    date: '2026-09-18',
    readTime: 4,
    topics: ['iqtisod'],
  },
  {
    slug: 'ochiq-byudjet-va-yoshlar',
    kind: 'brief',
    title: 'Ochiq byudjet muhokamalarini yoshlarga yaqinlashtirish',
    excerpt: 'Mahalla darajasidagi byudjet qarorlarida yoshlar ishtirokini oshirish uchun amaliy taklif.',
    summary: 'Tahlilnoma yoshlarning mahalliy byudjet jarayonlaridagi ishtiroki past ekanini qayd etadi va maktab hamda universitetlar orqali ishtirokni kengaytirish yoʻllarini koʻrsatadi.',
    keyPoints: ['Byudjet savodxonligi — fuqarolik taʼlimining bir qismi', 'Yoshlar uchun maxsus tashabbuslar kvotasi', 'Natijalar haqida ochiq hisobot'],
    content: `## Muammo
Yoshlar mahalliy byudjet qarorlari qanday qabul qilinishini kam biladi va jarayonda kam qatnashadi.

## Tavsiyalar
1. Maktablarda “byudjet savodxonligi” boʻyicha amaliy darslar
2. Yoshlar tashabbuslari uchun alohida tanlov yoʻnalishi
3. Amalga oshirilgan loyihalar haqida xarita koʻrinishidagi ochiq hisobot`,
    authors: ['aziz'],
    date: '2026-08-25',
    readTime: 4,
    topics: ['iqtisod', 'siyosat'],
  },
  {
    slug: 'akademik-halollik-standarti',
    kind: 'brief',
    title: 'Oliy taʼlimda akademik halollik: yagona milliy standart',
    excerpt: 'Plagiat va akademik nohalollikka qarshi aniq qoidalar, oʻqitish va texnologiya uygʻunligi.',
    summary: 'Tahlilnoma akademik halollik qoidalari universitetlarda turlicha talqin qilinishini koʻrsatib, yagona standart va profilaktik taʼlim dasturini taklif qiladi.',
    keyPoints: ['Jazodan oldin — oʻqitish: iqtibos va manbaga havola qoidalari', 'Yagona atamalar va qoidalar', 'Plagiatni aniqlash vositalari va apellyatsiya tartibi'],
    content: `## Muammo
Talabalar koʻpincha manbalarga toʻgʻri havola berish qoidalarini bilmaydi, universitetlar esa qoidabuzarlikka turlicha munosabatda boʻladi.

## Tavsiyalar
1. Birinchi kurslar uchun majburiy “akademik yozuv” moduli
2. Barcha OTMlar uchun yagona akademik halollik nizomi
3. Adolatli koʻrib chiqish va apellyatsiya tartibi`,
    authors: ['islom'],
    date: '2026-07-30',
    readTime: 4,
    topics: ['huquq'],
  },
  {
    slug: 'yoshlar-mikrogrant-dasturlari',
    kind: 'brief',
    title: 'Yoshlar tadbirkorligi uchun mikrogrant dasturlarini baholash',
    excerpt: 'Grant ajratish yetarli emas — natijani oʻlchash kerak. Oddiy baholash mexanizmi taklifi.',
    summary: 'Tahlilnoma mikrogrant dasturlari samaradorligini baholash uchun oddiy indikatorlar toʻplami va nazorat guruhi usulini taklif qiladi.',
    keyPoints: ['Natija indikatorlari: bandlik, daromad, biznesning omon qolishi', 'Tasodifiy tanlov asosida nazorat guruhi', 'Natijalarni ochiq eʼlon qilish'],
    content: `## Muammo
Grant dasturlari koʻpincha ajratilgan mablagʻ hajmi bilan baholanadi, lekin natijalar oʻlchanmaydi.

## Tavsiyalar
1. Har bir dastur uchun 3–5 ta aniq natija indikatori
2. Imkon boʻlsa, tasodifiy tanlov orqali nazorat guruhi
3. Bir va uch yildan keyin kuzatuv soʻrovnomasi`,
    authors: ['aziz'],
    date: '2026-10-10',
    readTime: 4,
    topics: ['iqtisod'],
  },
]
