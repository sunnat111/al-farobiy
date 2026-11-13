import type { AuthorKey, TopicSlug } from './people'

export type SeedLesson = { title: string; duration: string; summary: string; points: string[] }
export type SeedQuiz = { q: string; options: string[]; correct: number; explanation: string }
export type SeedCourse = {
  slug: string
  code: string
  title: string
  titleEn: string
  tagline: string
  summary: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  instructors: AuthorKey[]
  topics: TopicSlug[]
  outcomes: string[]
  lessons: SeedLesson[]
  quiz: SeedQuiz[]
  readings: string[] // book / classical slugs
  color: string
  motif: 'stars' | 'arches' | 'rings' | 'columns'
}

export const courses: SeedCourse[] = [
  {
    slug: 'siyosatshunoslikka-kirish',
    code: 'POL-101',
    title: 'Siyosatshunoslikka kirish',
    titleEn: 'Introduction to Political Science',
    tagline: 'Siyosatshunoslik asoslari, davlat boshqaruvi va institutlar nazariyasi',
    summary:
      'Hokimiyat nima, davlat qanday ishlaydi va nega turli mamlakatlarda siyosiy tizimlar turlicha? Kurs siyosatshunoslikning asosiy tushunchalari, institutlar va siyosiy ishtirok bilan tanishtiradi.',
    description: `Bu kurs siyosatni “kim nimani, qachon va qanday oladi” degan savol orqali oʻrganishga taklif qiladi. Biz hokimiyat va legitimlik tushunchalaridan boshlab, davlatning kelib chiqishi, boshqaruv shakllari, siyosiy institutlar va fuqarolik jamiyatini bosqichma-bosqich koʻrib chiqamiz.

## Kurs kimlar uchun?
Siyosat, huquq yoki xalqaro munosabatlar yoʻnalishiga tayyorlanayotgan yuqori sinf oʻquvchilari va birinchi bosqich talabalari uchun. Oldindan bilim talab qilinmaydi.

## Qanday oʻqitiladi?
- Har hafta bitta dars: qisqa video, oʻqish uchun matn va muhokama savollari
- Har bir mavzu boʻyicha kutubxonadan tavsiya etilgan adabiyotlar
- Kurs oxirida oʻz-oʻzini tekshirish testi va qisqa esse`,
    level: 'beginner',
    duration: '8 hafta',
    instructors: ['nodira', 'malika'],
    topics: ['siyosat'],
    outcomes: [
      'Hokimiyat, kuch, legitimlik va suverenitet tushunchalarini farqlay olish',
      'Demokratik, gibrid va avtoritar rejimlarni mezonlar asosida tasniflash',
      'Parlament, prezidentlik va aralash boshqaruv tizimlarini qiyoslash',
      'Siyosiy voqealarni tahlil qilib, asosli fikr yozish',
    ],
    lessons: [
      { title: 'Siyosat nima? Hokimiyat, kuch va legitimlik', duration: '45 daq', summary: 'Siyosatning asosiy savollari, hokimiyat turlari va Maks Veberning legitimlik tasnifi.', points: ['Hokimiyat va kuch farqi', 'Anʼanaviy, xarizmatik va qonuniy-ratsional legitimlik', 'Siyosat — jamoaviy qaror qabul qilish jarayoni'] },
      { title: 'Davlat: kelib chiqishi va vazifalari', duration: '50 daq', summary: 'Davlatning kelib chiqishi haqidagi nazariyalar va zamonaviy davlatning asosiy funksiyalari.', points: ['Suverenitet tushunchasi', 'Ijtimoiy shartnoma nazariyalari', 'Xavfsizlik, adolat va farovonlik funksiyalari'] },
      { title: 'Boshqaruv shakllari va siyosiy rejimlar', duration: '55 daq', summary: 'Monarxiya va respublika, demokratiya va avtoritarizm, gibrid rejimlar.', points: ['Rejimlarni tasniflash mezonlari', 'Raqobatli avtoritarizm', 'Demokratik konsolidatsiya'] },
      { title: 'Institutlar: qonun chiqaruvchi, ijroiya va sud hokimiyati', duration: '50 daq', summary: 'Hokimiyatlar boʻlinishi va ular oʻrtasidagi oʻzaro nazorat mexanizmlari.', points: ['Parlamentar va prezidentlik tizimlari', 'Sud mustaqilligi', 'Tekshiruv va muvozanat (checks and balances)'] },
      { title: 'Saylovlar, partiyalar va fuqarolik jamiyati', duration: '45 daq', summary: 'Saylov tizimlari, siyosiy partiyalar va nodavlat tashkilotlarning roli.', points: ['Majoritar va proporsional tizimlar', 'Partiyalar tizimi', 'Mahalla va fuqarolik tashabbuslari'] },
      { title: 'Siyosiy madaniyat va ishtirok', duration: '40 daq', summary: 'Fuqarolarning siyosatga munosabati, ishtirok shakllari va raqamli davrdagi oʻzgarishlar.', points: ['Siyosiy madaniyat turlari', 'Ishtirokning anʼanaviy va raqamli shakllari', 'Yoshlar va siyosat'] },
    ],
    quiz: [
      { q: 'Maks Veber legitimlikning nechta turini ajratgan?', options: ['Ikki', 'Uch', 'Toʻrt', 'Besh'], correct: 2, explanation: 'Veber anʼanaviy, xarizmatik va qonuniy-ratsional legitimlikni ajratgan.' },
      { q: 'Hokimiyatlar boʻlinishi gʻoyasi qaysi mutafakkir nomi bilan koʻproq bogʻlanadi?', options: ['Monteskyo', 'Makiavelli', 'Platon', 'Marks'], correct: 1, explanation: '“Qonunlar ruhi” asarida Monteskyo hokimiyatlarni boʻlish gʻoyasini tizimli bayon qilgan.' },
      { q: 'Proporsional saylov tizimida deputatlik oʻrinlari nimaga qarab taqsimlanadi?', options: ['Okrugdagi eng koʻp ovozga', 'Partiyalar olgan ovozlar ulushiga', 'Hududlar soniga', 'Nomzodlar yoshiga'], correct: 2, explanation: 'Partiya qancha ulush ovoz olsa, taxminan shuncha ulush oʻrin oladi.' },
      { q: 'Quyidagilardan qaysi biri fuqarolik jamiyati instituti hisoblanadi?', options: ['Vazirlik', 'Nodavlat notijorat tashkilot', 'Prokuratura', 'Markaziy bank'], correct: 2, explanation: 'NNTlar davlatdan mustaqil ravishda fuqarolar tashabbusi bilan tuziladi.' },
    ],
    readings: ['why-nations-fail', 'polyarchy-participation-and-opposition', 'how-democracies-die', 'aristotel-siyosat'],
    color: '#1E3A8A',
    motif: 'columns',
  },
  {
    slug: 'siyosiy-falsafaga-kirish',
    code: 'PHIL-110',
    title: 'Siyosiy falsafaga kirish',
    titleEn: 'Introduction to Political Philosophy',
    tagline: 'Mumtoz va zamonaviy siyosiy falsafa: Platondan Roulsgacha',
    summary:
      'Adolat nima? Erkinlik chegarasi qayerda? Davlat nega kerak? Kurs Platon, Aristotel, Forobiy, ijtimoiy shartnoma nazariyachilari, Mill va Rouls gʻoyalari orqali bu savollarga javob izlaydi.',
    description: `Siyosiy falsafa “qanday boshqaruv yaxshi?” degan savolga ming yillar davomida berilgan javoblarni oʻrganadi. Kurs mumtoz matnlarni bevosita oʻqish va ularni bugungi muammolar bilan bogʻlashga qaratilgan.

## Kursning oʻziga xosligi
Gʻarb falsafasi bilan bir qatorda **Abu Nasr Forobiy** merosiga alohida dars ajratilgan: “Fozil odamlar shahri” Platon va Aristotel gʻoyalarini Islom madaniyati kontekstida qayta talqin qilgan asar sifatida oʻrganiladi.

## Har bir darsda
- Mumtoz matndan parcha va uning sharhi
- Asosiy tushunchalar lugʻati
- Munozara uchun 2–3 savol`,
    level: 'beginner',
    duration: '8 hafta',
    instructors: ['zarina', 'jasur'],
    topics: ['falsafa', 'meros'],
    outcomes: [
      'Mumtoz siyosiy falsafaning asosiy maktablarini bilish',
      'Forobiy gʻoyalarini antik va zamonaviy nazariyalar bilan qiyoslash',
      'Adolat va erkinlik haqidagi raqobatlashuvchi qarashlarni tahlil qilish',
      'Falsafiy matnni oʻqib, uning dalillarini baholash',
    ],
    lessons: [
      { title: 'Platon: adolatli davlat va faylasuf hukmdor', duration: '50 daq', summary: '“Davlat” asaridagi adolat taʼrifi, uch tabaqa va gʻor tamsili.', points: ['Ruh va davlatning uch qismi', 'Faylasuf hukmdor gʻoyasi', 'Gʻor tamsili'] },
      { title: 'Aristotel: inson — siyosiy mavjudot', duration: '50 daq', summary: '“Siyosat” asaridagi boshqaruv shakllari tasnifi va oʻrta yoʻl gʻoyasi.', points: ['Toʻgʻri va buzilgan boshqaruv shakllari', 'Politeya', 'Fuqarolik va ezgulik'] },
      { title: 'Forobiy: fozil shahar va uning raqiblari', duration: '55 daq', summary: 'Ideal jamiyat — tana tamsili, rahbar sifatlari va “johil”, “fosiq” shaharlar.', points: ['Saodat — jamiyatning maqsadi', 'Rahbarning fazilatlari', 'Fozil va nofozil shaharlar'] },
      { title: 'Ijtimoiy shartnoma: Hobbs, Lokk, Russo', duration: '55 daq', summary: 'Tabiiy holat, shartnoma va davlat hokimiyatining asoslari.', points: ['Hobbsning “Leviafan”i', 'Lokk: hayot, erkinlik, mulk', 'Russo: umumiy iroda'] },
      { title: 'Jon Styuart Mill va erkinlik', duration: '45 daq', summary: '“Erkinlik haqida” asaridagi zarar tamoyili va soʻz erkinligi himoyasi.', points: ['Zarar tamoyili', 'Koʻpchilik tiraniyasi', 'Fikrlar raqobati'] },
      { title: 'Jon Rouls va adolat nazariyasi', duration: '50 daq', summary: 'Jaholat pardasi, ikki adolat tamoyili va ularga tanqidlar.', points: ['Dastlabki holat va jaholat pardasi', 'Farq tamoyili', 'Nozik va kommunitaristlar tanqidi'] },
    ],
    quiz: [
      { q: 'Forobiyning ideal jamiyat haqidagi asosiy asari qaysi?', options: ['Siyosatnoma', 'Fozil odamlar shahri', 'Muqaddima', 'Qutadgʻu bilig'], correct: 2, explanation: '“Ara ahl al-madina al-fozila” — “Fozil odamlar shahri qarashlari”.' },
      { q: '“Zarar tamoyili” qaysi mutafakkirga tegishli?', options: ['Jon Lokk', 'Jon Rouls', 'Jon Styuart Mill', 'Tomas Hobbs'], correct: 3, explanation: 'Mill “Erkinlik haqida” asarida bu tamoyilni bayon qilgan.' },
      { q: 'Aristotelga koʻra koʻpchilikning umumiy manfaat uchun boshqaruvi qanday ataladi?', options: ['Demokratiya', 'Politeya', 'Oligarxiya', 'Aristokratiya'], correct: 2, explanation: 'Aristotel “politeya”ni toʻgʻri shakl, “demokratiya”ni esa uning buzilgan shakli deb hisoblagan.' },
      { q: 'Roulsning “jaholat pardasi” nimani anglatadi?', options: ['Bilimsiz jamiyatni', 'Oʻz ijtimoiy mavqeingizni bilmagan holda tamoyil tanlashni', 'Diniy taqiqlarni', 'Siyosiy senzurani'], correct: 2, explanation: 'Taraflar oʻz mavqeini bilmagani uchun xolis tamoyillarni tanlaydi.' },
    ],
    readings: ['platon-davlat', 'aristotel-siyosat', 'forobiy-fozil-odamlar-shahri', 'a-theory-of-justice'],
    color: '#4A2E5C',
    motif: 'arches',
  },
  {
    slug: 'mikroiqtisodiyotga-kirish',
    code: 'ECON-101',
    title: 'Mikroiqtisodiyotga kirish',
    titleEn: 'Introduction to Microeconomics',
    tagline: 'Bozor tamoyillari, iqtisodiy tahlil va davlat siyosati',
    summary:
      'Narxlar qanday shakllanadi? Nega ayrim bozorlar ishlamaydi va davlat qachon aralashishi kerak? Kurs mikroiqtisodiyotning asosiy modellari bilan hayotiy misollar orqali tanishtiradi.',
    description: `Mikroiqtisodiyot alohida isteʼmolchilar, firmalar va bozorlarning xulq-atvorini oʻrganadi. Kursda grafik va oddiy hisob-kitoblar yordamida talab va taklif, raqobat, bozor muvaffaqiyatsizliklari va davlat siyosati tahlil qilinadi.

## Amaliy yondashuv
Har bir mavzu Oʻzbekiston bozoridan olingan misollar bilan tushuntiriladi: bozordagi narxlar, transport, taʼlim va qishloq xoʻjaligi.

## Natija
Kurs yakunida iqtisodiy yangiliklarni tanqidiy oʻqish va oddiy siyosat tavsiyalarini asoslash koʻnikmasi shakllanadi.`,
    level: 'beginner',
    duration: '10 hafta',
    instructors: ['rustam'],
    topics: ['iqtisod'],
    outcomes: [
      'Talab va taklif modelini qurish va muvozanat narxini topish',
      'Elastiklik tushunchasini amaliy vaziyatlarda qoʻllash',
      'Raqobat turlari va monopoliyaning oqibatlarini tushuntirish',
      'Soliq, subsidiya va narx nazoratining taʼsirini baholash',
    ],
    lessons: [
      { title: 'Tanqislik, tanlov va muqobil xarajat', duration: '40 daq', summary: 'Iqtisodiyotning asosiy muammosi va har bir tanlovning narxi.', points: ['Cheklangan resurslar', 'Muqobil xarajat', 'Ishlab chiqarish imkoniyatlari chegarasi'] },
      { title: 'Talab va taklif', duration: '55 daq', summary: 'Talab va taklif egri chiziqlari, muvozanat va uning siljishi.', points: ['Talab qonuni', 'Taklifga taʼsir etuvchi omillar', 'Bozor muvozanati'] },
      { title: 'Elastiklik', duration: '45 daq', summary: 'Narx oʻzgarganda talab va taklif qanchalik oʻzgaradi.', points: ['Narx boʻyicha elastiklik', 'Daromad boʻyicha elastiklik', 'Elastiklik va soliq yuki'] },
      { title: 'Bozor tuzilmalari', duration: '55 daq', summary: 'Mukammal raqobat, monopoliya, oligopoliya va monopolistik raqobat.', points: ['Bozor kuchi', 'Monopoliya va jamiyat yoʻqotishlari', 'Raqobat siyosati'] },
      { title: 'Bozor muvaffaqiyatsizliklari', duration: '50 daq', summary: 'Tashqi effektlar, jamoat neʼmatlari va axborot assimetriyasi.', points: ['Ifloslanish — salbiy tashqi effekt', 'Jamoat neʼmatlari va “tekinxoʻr” muammosi', 'Axborot assimetriyasi'] },
      { title: 'Davlat siyosati: soliqlar, subsidiyalar, narx nazorati', duration: '55 daq', summary: 'Davlat aralashuvining afzalliklari va kutilmagan oqibatlari.', points: ['Soliqning bozorga taʼsiri', 'Narx shipi va taqchillik', 'Subsidiyalar samaradorligi'] },
    ],
    quiz: [
      { q: 'Muqobil xarajat nima?', options: ['Mahsulotning bozor narxi', 'Tanlov uchun voz kechilgan eng yaxshi muqobil', 'Soliq summasi', 'Ishlab chiqarish tannarxi'], correct: 2, explanation: 'Har qanday tanlovning haqiqiy narxi — voz kechilgan eng yaxshi imkoniyat.' },
      { q: 'Narx shipi muvozanat narxidan past belgilansa nima yuz beradi?', options: ['Ortiqcha taklif', 'Taqchillik', 'Hech narsa', 'Narx oshadi'], correct: 2, explanation: 'Past narxda talab miqdori taklifdan oshadi va taqchillik paydo boʻladi.' },
      { q: 'Quyidagilardan qaysi biri jamoat neʼmatiga misol boʻladi?', options: ['Non', 'Koʻcha yoritilishi', 'Avtomobil', 'Mobil telefon'], correct: 2, explanation: 'Koʻcha yoritilishidan foydalanishni cheklash qiyin va u raqobatsiz isteʼmol qilinadi.' },
      { q: 'Talab noelastik boʻlsa, soliq yukining katta qismini kim koʻtaradi?', options: ['Sotuvchilar', 'Xaridorlar', 'Davlat', 'Hech kim'], correct: 2, explanation: 'Xaridorlar narxga sezgir boʻlmagani uchun soliqning katta qismi ularga oʻtadi.' },
    ],
    readings: ['the-wealth-of-nations', 'economics-in-one-lesson', 'poor-economics', 'development-as-freedom'],
    color: '#1F4D3A',
    motif: 'rings',
  },
  {
    slug: 'qiyosiy-boshqaruv-va-siyosat',
    code: 'GOV-201',
    title: 'Qiyosiy boshqaruv va siyosat (AP-ga tayyorgarlik)',
    titleEn: 'Comparative Government and Politics (AP prep)',
    tagline: 'Xalqaro boshqaruv tizimlari va siyosiy rejimlarni qiyosiy oʻrganish',
    summary:
      'Olti davlat misolida siyosiy institutlar, legitimlik, fuqarolik jamiyati va islohotlar qiyoslanadi. AP Comparative Government imtihoniga tayyorlanuvchilar uchun mos tuzilma.',
    description: `Qiyosiy siyosat “nega turli mamlakatlar turlicha boshqariladi?” degan savolga javob izlaydi. Kurs AP Comparative Government and Politics dasturidagi olti davlat — Buyuk Britaniya, Meksika, Nigeriya, Rossiya, Xitoy va Eron misolida qurilgan.

> Eslatma: kurs mustaqil tayyorgarlik dasturi boʻlib, College Board tashkiloti bilan rasmiy aloqasi yoʻq.

## Kurs tuzilmasi
- Toʻrtta nazariy blok: metodlar, institutlar, ishtirok, oʻzgarish
- Har bir davlat boʻyicha keys-stadi
- Imtihon formatidagi savollar va esse namunalari`,
    level: 'intermediate',
    duration: '12 hafta',
    instructors: ['nodira', 'dilshod'],
    topics: ['siyosat', 'huquq'],
    outcomes: [
      'Qiyosiy siyosat metodlarini (keys-stadi, qiyoslash) qoʻllash',
      'Olti davlatning siyosiy tizimini taqqoslab tushuntirish',
      'Legitimlik va barqarorlik omillarini tahlil qilish',
      'AP formatidagi qisqa va uzun javoblarni yozish',
    ],
    lessons: [
      { title: 'Qiyosiy siyosat metodlari', duration: '45 daq', summary: 'Tushunchalar, oʻzgaruvchilar, sabab va bogʻliqlik, keys-stadi usuli.', points: ['Empirik va normativ savollar', 'Mustaqil va bogʻliq oʻzgaruvchilar', 'Korrelyatsiya ≠ sababiyat'] },
      { title: 'Suverenitet, hokimiyat va legitimlik', duration: '50 daq', summary: 'Davlatlar legitimlikni qanday qozonadi va saqlaydi.', points: ['Legitimlik manbalari', 'Davlat va rejim farqi', 'Konstitutsiyalar roli'] },
      { title: 'Siyosiy institutlar qiyosi', duration: '55 daq', summary: 'Ijroiya va qonun chiqaruvchi hokimiyatlar, sudlar, federal va unitar tuzilmalar.', points: ['Parlamentar va prezidentlik tizimlari', 'Federalizm', 'Sud nazorati'] },
      { title: 'Fuqarolik jamiyati va siyosiy ishtirok', duration: '50 daq', summary: 'Saylovlar, partiyalar, ijtimoiy harakatlar va OAV.', points: ['Korporativizm va plyuralizm', 'Ijtimoiy harakatlar', 'Media erkinligi'] },
      { title: 'Siyosiy va iqtisodiy oʻzgarishlar', duration: '50 daq', summary: 'Demokratlashuv, islohotlar va globallashuv taʼsiri.', points: ['Demokratlashuv toʻlqinlari', 'Iqtisodiy liberallashtirish', 'Globallashuv'] },
      { title: 'Olti davlat: keys-stadi', duration: '90 daq', summary: 'Buyuk Britaniya, Meksika, Nigeriya, Rossiya, Xitoy va Eron siyosiy tizimlarining qisqa tahlili.', points: ['Konstitutsiyaviy monarxiya va parlament', 'Federal prezidentlik tizimlari', 'Bir partiyaviy va teokratik elementli rejimlar'] },
    ],
    quiz: [
      { q: 'Unitar davlatda hokimiyat qanday taqsimlanadi?', options: ['Markaz va subyektlar oʻrtasida konstitutsiya boʻyicha teng', 'Asosan markaziy hukumatda', 'Faqat mahalliy organlarda', 'Xalqaro tashkilotlarda'], correct: 2, explanation: 'Unitar davlatda asosiy hokimiyat markazda boʻladi, hududlar unga boʻysunadi.' },
      { q: 'Quyidagi davlatlardan qaysi biri federativ?', options: ['Buyuk Britaniya', 'Xitoy', 'Meksika', 'Eron'], correct: 3, explanation: 'Meksika — federativ respublika.' },
      { q: 'Korrelyatsiya nimani isbotlamaydi?', options: ['Ikki oʻzgaruvchi bogʻliqligini', 'Sabab-oqibat munosabatini', 'Tendensiyani', 'Statistik aloqani'], correct: 2, explanation: 'Bogʻliqlik har doim ham sababiyatni anglatmaydi.' },
      { q: 'Britaniyada ijroiya hokimiyat rahbari kim?', options: ['Monarx', 'Bosh vazir', 'Lordlar palatasi spikeri', 'Oliy sud raisi'], correct: 2, explanation: 'Bosh vazir parlamentdagi koʻpchilik partiyasi yetakchisi sifatida hukumatni boshqaradi.' },
    ],
    readings: ['political-order-in-changing-societies', 'the-origins-of-political-order', 'the-narrow-corridor', 'how-democracies-die'],
    color: '#135E5A',
    motif: 'stars',
  },
]
