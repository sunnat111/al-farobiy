import type { TopicSlug } from './people'

export type BookCategory = 'political-science' | 'economics' | 'philosophy-law' | 'islam-modernity'

export type SeedBook = {
  title: string
  titleUz: string
  authors: string
  year: number
  category: BookCategory
  summary: string
  whyRead: string
  topics: TopicSlug[]
  badge?: 'new' | 'recommended' | 'book-club'
  featured?: boolean
}

// Real books; summaries are editorial annotations written for this catalogue.
export const books: SeedBook[] = [
  // Siyosatshunoslik va demokratiya
  { title: 'Democracy in America', titleUz: 'Amerikada demokratiya', authors: 'Alexis de Tocqueville', year: 1835, category: 'political-science', topics: ['siyosat'],
    summary: 'Fransuz mutafakkiri yosh Amerika respublikasidagi tenglik, mahalliy oʻzini oʻzi boshqarish va uyushmalar hayotini kuzatib, demokratiyaning kuchli va zaif tomonlarini tahlil qiladi.',
    whyRead: '“Koʻpchilik tiraniyasi” va fuqarolik uyushmalarining roli haqidagi gʻoyalar bugun ham dolzarb.' },
  { title: 'Why Nations Fail', titleUz: 'Nega millatlar inqirozga uchraydi', authors: 'Daron Acemoglu, James A. Robinson', year: 2012, category: 'political-science', topics: ['siyosat', 'iqtisod'], badge: 'book-club', featured: true,
    summary: 'Mualliflar mamlakatlarning boy yoki kambagʻal boʻlishini geografiya yoki madaniyat emas, “inklyuziv” yoki “ekstraktiv” institutlar belgilaydi, deb taʼkidlaydi.',
    whyRead: 'Institutlar nazariyasiga eng oson kirish. Kitob klubimizning noyabr kitobi.' },
  { title: 'The Origins of Political Order', titleUz: 'Siyosiy tartibning kelib chiqishi', authors: 'Francis Fukuyama', year: 2011, category: 'political-science', topics: ['siyosat'],
    summary: 'Davlat, qonun ustuvorligi va hisobdor hukumat qanday paydo boʻlganini qadimgi Xitoydan Fransuz inqilobigacha boʻlgan tarix orqali tushuntiradi.',
    whyRead: 'Davlatchilik tarixini qiyosiy nuqtai nazardan koʻrish uchun.' },
  { title: 'Political Order in Changing Societies', titleUz: 'Oʻzgarayotgan jamiyatlarda siyosiy tartib', authors: 'Samuel P. Huntington', year: 1968, category: 'political-science', topics: ['siyosat'],
    summary: 'Tez modernizatsiya siyosiy institutlar rivojidan oʻzib ketsa, beqarorlik yuzaga kelishini koʻrsatgan klassik asar.',
    whyRead: 'Institutlar va ijtimoiy oʻzgarish muvozanati haqida asosiy matn.' },
  { title: 'Polyarchy: Participation and Opposition', titleUz: 'Poliarxiya: ishtirok va muxolifat', authors: 'Robert A. Dahl', year: 1971, category: 'political-science', topics: ['siyosat'],
    summary: 'Real demokratiyalarni oʻlchash uchun ikki oʻlchov — siyosiy raqobat va ishtirok — asosida “poliarxiya” tushunchasini taklif qiladi.',
    whyRead: 'Demokratiyani qanday oʻlchash mumkinligini tushunish uchun.' },
  { title: 'How Democracies Die', titleUz: 'Demokratiyalar qanday halok boʻladi', authors: 'Steven Levitsky, Daniel Ziblatt', year: 2018, category: 'political-science', topics: ['siyosat'], badge: 'recommended',
    summary: 'Demokratiyalar koʻpincha toʻntarish bilan emas, saylangan rahbarlar institutlarni asta-sekin zaiflashtirishi orqali yemirilishini tarixiy misollarda koʻrsatadi.',
    whyRead: 'Yozilmagan meʼyorlar — oʻzaro tolerantlik va vazminlik — ahamiyati haqida.' },
  { title: 'The Narrow Corridor', titleUz: 'Tor yoʻlak', authors: 'Daron Acemoglu, James A. Robinson', year: 2019, category: 'political-science', topics: ['siyosat', 'huquq'],
    summary: 'Erkinlik kuchli davlat va kuchli jamiyat oʻzaro muvozanatda boʻlgan “tor yoʻlak”da yashaydi, degan gʻoyani ilgari suradi.',
    whyRead: 'Davlat va jamiyat munosabatini yangicha tushunish uchun.' },
  { title: 'Democracy and Its Critics', titleUz: 'Demokratiya va uning tanqidchilari', authors: 'Robert A. Dahl', year: 1989, category: 'political-science', topics: ['siyosat', 'falsafa'],
    summary: 'Demokratiyaga qarshi asosiy falsafiy eʼtirozlarni — anarxizm, vasiylik va boshqalarni — koʻrib chiqib, demokratik jarayon mezonlarini asoslaydi.',
    whyRead: 'Demokratiya nazariyasining puxta va muvozanatli bayoni.' },

  // Iqtisodiy nazariya va rivojlanish
  { title: 'The Wealth of Nations', titleUz: 'Xalqlar boyligi', authors: 'Adam Smith', year: 1776, category: 'economics', topics: ['iqtisod'],
    summary: 'Mehnat taqsimoti, bozor va “koʻrinmas qoʻl” gʻoyalari bilan zamonaviy iqtisodiyot fanining asosini qoʻygan asar.',
    whyRead: 'Iqtisodiy tafakkurning ildizlarini bilish uchun.' },
  { title: 'Development as Freedom', titleUz: 'Rivojlanish — erkinlik sifatida', authors: 'Amartya Sen', year: 1999, category: 'economics', topics: ['iqtisod', 'falsafa'], badge: 'recommended',
    summary: 'Rivojlanishni faqat daromad oʻsishi emas, insonlarning real imkoniyatlari va erkinliklarining kengayishi sifatida koʻrishni taklif qiladi.',
    whyRead: '“Imkoniyatlar yondashuvi”ning asosiy matni.' },
  { title: 'The Road to Serfdom', titleUz: 'Qullik sari yoʻl', authors: 'F. A. Hayek', year: 1944, category: 'economics', topics: ['iqtisod', 'siyosat'],
    summary: 'Markazlashgan iqtisodiy rejalashtirish siyosiy erkinlikni cheklashga olib kelishi haqidagi ogohlantiruvchi asar.',
    whyRead: 'Iqtisodiy va siyosiy erkinlik bogʻliqligi haqidagi klassik bahs.' },
  { title: 'Capitalism and Freedom', titleUz: 'Kapitalizm va erkinlik', authors: 'Milton Friedman', year: 1962, category: 'economics', topics: ['iqtisod'],
    summary: 'Bozor iqtisodiyoti siyosiy erkinlik sharti ekanini asoslaydi va taʼlim vaucherlari kabi siyosat gʻoyalarini taklif qiladi.',
    whyRead: 'Davlatning iqtisoddagi roli haqidagi muhim qarash.' },
  { title: 'Poor Economics', titleUz: 'Kambagʻallik iqtisodiyoti', authors: 'Abhijit V. Banerjee, Esther Duflo', year: 2011, category: 'economics', topics: ['iqtisod'], badge: 'new',
    summary: 'Nobel sovrindorlari kambagʻal oilalarning real qarorlarini dala tajribalari asosida oʻrganib, kambagʻallikka qarshi kurashning amaliy yoʻllarini koʻrsatadi.',
    whyRead: 'Dalillarga asoslangan siyosat qanday ishlashini koʻrish uchun.' },
  { title: 'Thinking, Fast and Slow', titleUz: 'Tez va sekin fikrlash', authors: 'Daniel Kahneman', year: 2011, category: 'economics', topics: ['iqtisod', 'falsafa'],
    summary: 'Inson tafakkurining ikki tizimi — tezkor intuitiv va sekin mantiqiy — va ular sabab boʻladigan kognitiv xatolar haqida.',
    whyRead: 'Xulq-atvor iqtisodiyotiga kirish.' },
  { title: 'Economics in One Lesson', titleUz: 'Bir darsda iqtisodiyot', authors: 'Henry Hazlitt', year: 1946, category: 'economics', topics: ['iqtisod'],
    summary: 'Har bir siyosatning faqat bir guruhga emas, butun jamiyatga va uzoq muddatli taʼsirini koʻrish zarurligini oddiy misollarda tushuntiradi.',
    whyRead: 'Iqtisodiy fikrlashga eng qisqa kirish.' },
  { title: 'The Mystery of Capital', titleUz: 'Kapital sirlari', authors: 'Hernando de Soto', year: 2000, category: 'economics', topics: ['iqtisod', 'huquq'],
    summary: 'Rivojlanayotgan mamlakatlarda aktivlar rasmiy mulk huquqi bilan himoyalanmagani uchun kapitalga aylanmasligini koʻrsatadi.',
    whyRead: 'Mulk huquqi va rivojlanish bogʻliqligi haqida.' },

  // Falsafa va huquq
  { title: 'A Theory of Justice', titleUz: 'Adolat nazariyasi', authors: 'John Rawls', year: 1971, category: 'philosophy-law', topics: ['falsafa', 'huquq'], featured: true,
    summary: 'Jaholat pardasi ortida tanlanadigan ikki adolat tamoyili orqali adolatli jamiyat nazariyasini quradi.',
    whyRead: 'XX asr siyosiy falsafasining eng taʼsirli asari.' },
  { title: 'The Concept of Law', titleUz: 'Huquq tushunchasi', authors: 'H. L. A. Hart', year: 1961, category: 'philosophy-law', topics: ['huquq'],
    summary: 'Huquqni birlamchi va ikkilamchi qoidalar tizimi sifatida taʼriflagan, huquqiy pozitivizmning asosiy asari.',
    whyRead: 'Huquq falsafasini oʻrganish uchun boshlangʻich nuqta.' },
  { title: 'Anarchy, State, and Utopia', titleUz: 'Anarxiya, davlat va utopiya', authors: 'Robert Nozick', year: 1974, category: 'philosophy-law', topics: ['falsafa'],
    summary: 'Roulsga javob sifatida “minimal davlat” va mulk huquqiga asoslangan adolat nazariyasini himoya qiladi.',
    whyRead: 'Adolat haqidagi bahsning ikkinchi tomoni.' },
  { title: 'The Human Condition', titleUz: 'Inson holati', authors: 'Hannah Arendt', year: 1958, category: 'philosophy-law', topics: ['falsafa', 'siyosat'],
    summary: 'Inson faoliyatini mehnat, ish va harakatga ajratib, siyosiy harakat va jamoatchilik makonining ahamiyatini tahlil qiladi.',
    whyRead: 'Siyosatni erkin harakat maydoni sifatida tushunish uchun.' },
  { title: 'The Open Society and Its Enemies', titleUz: 'Ochiq jamiyat va uning dushmanlari', authors: 'Karl Popper', year: 1945, category: 'philosophy-law', topics: ['falsafa', 'siyosat'],
    summary: 'Platon, Gegel va Marks gʻoyalaridagi totalitar tendensiyalarni tanqid qilib, tanqidga ochiq jamiyatni himoya qiladi.',
    whyRead: 'Tanqidiy ratsionalizm va ochiq jamiyat gʻoyasi.' },
  { title: "Justice: What's the Right Thing to Do?", titleUz: 'Adolat: toʻgʻri ish qaysi?', authors: 'Michael J. Sandel', year: 2009, category: 'philosophy-law', topics: ['falsafa'], badge: 'recommended',
    summary: 'Garvarddagi mashhur kurs asosida yozilgan kitob axloqiy dilemmalar orqali utilitarizm, libertarizm va Kant etikasini tushuntiradi.',
    whyRead: 'Siyosiy falsafaga eng qiziqarli kirish.' },
  { title: 'The Morality of Law', titleUz: 'Huquq axloqi', authors: 'Lon L. Fuller', year: 1964, category: 'philosophy-law', topics: ['huquq'],
    summary: 'Qonun tizimi samarali boʻlishi uchun zarur boʻlgan sakkiz shartni — “qonunning ichki axloqi”ni — bayon qiladi.',
    whyRead: 'Qonun ustuvorligi tushunchasini chuqur anglash uchun.' },

  // Islom va zamonaviylik
  { title: 'Islam and the Secular State', titleUz: 'Islom va dunyoviy davlat', authors: 'Abdullahi Ahmed An-Naʼim', year: 2008, category: 'islam-modernity', topics: ['islom', 'huquq'],
    summary: 'Muallif musulmonlar shariatga ixtiyoriy amal qilishi uchun davlat diniy jihatdan betaraf boʻlishi kerak, degan gʻoyani asoslaydi.',
    whyRead: 'Din va davlat munosabatiga musulmon olimning nuqtai nazari.' },
  { title: 'The Reconstruction of Religious Thought in Islam', titleUz: 'Islomda diniy tafakkurni qayta qurish', authors: 'Muhammad Iqbal', year: 1930, category: 'islam-modernity', topics: ['islom', 'falsafa'],
    summary: 'Shoir va faylasuf Iqbol Islom tafakkurini zamonaviy falsafa va fan bilan muloqotda yangilash, ijtihodni tiklash zarurligini taʼkidlaydi.',
    whyRead: 'Islom islohotchilik tafakkurining asosiy matnlaridan biri.' },
  { title: 'Islam and Modernity: Transformation of an Intellectual Tradition', titleUz: 'Islom va zamonaviylik', authors: 'Fazlur Rahman', year: 1982, category: 'islam-modernity', topics: ['islom'],
    summary: 'Islom taʼlimi va intellektual anʼanasini tarixiy tahlil qilib, Qurʼonni yaxlit axloqiy tizim sifatida oʻqish metodini taklif qiladi.',
    whyRead: 'Taʼlim islohoti va ijtihod haqida chuqur mulohaza.' },
  { title: 'Islam and the Challenge of Democracy', titleUz: 'Islom va demokratiya muammosi', authors: 'Khaled Abou El Fadl', year: 2004, category: 'islam-modernity', topics: ['islom', 'siyosat'],
    summary: 'Islom huquqi anʼanasidagi qadriyatlar demokratiya bilan mos kelishini asoslagan esse va unga turli olimlarning javoblari.',
    whyRead: 'Islom va demokratiya bahsining eng muhim manbalaridan biri.' },
  { title: "Lost Enlightenment: Central Asia's Golden Age from the Arab Conquest to Tamerlane", titleUz: 'Yoʻqotilgan maʼrifat: Markaziy Osiyoning oltin davri', authors: 'S. Frederick Starr', year: 2013, category: 'islam-modernity', topics: ['meros', 'islom'], badge: 'book-club', featured: true,
    summary: 'Forobiy, Ibn Sino, Beruniy, Xorazmiy kabi Markaziy Osiyo olimlari jahon fani va falsafasiga qoʻshgan ulkan hissani hikoya qiladi.',
    whyRead: 'Loyihamiz nomidagi merosni tushunish uchun eng yaxshi kitob.' },
  { title: 'Islam, Authoritarianism, and Underdevelopment', titleUz: 'Islom, avtoritarizm va qoloqlik', authors: 'Ahmet T. Kuru', year: 2019, category: 'islam-modernity', topics: ['islom', 'siyosat', 'iqtisod'], badge: 'new',
    summary: 'Musulmon mamlakatlaridagi muammolar sababini dinning oʻzida emas, XI asrdan keyin shakllangan ulamo-davlat ittifoqida koʻradi.',
    whyRead: 'Tarixiy-institutsional tahlilning yorqin namunasi.' },
  { title: 'What Is Islam? The Importance of Being Islamic', titleUz: 'Islom nima?', authors: 'Shahab Ahmed', year: 2016, category: 'islam-modernity', topics: ['islom', 'falsafa'],
    summary: 'Islomni faqat huquqiy normalar emas, falsafa, sheʼriyat va madaniyatni ham qamrab olgan keng tarixiy tajriba sifatida talqin qiladi.',
    whyRead: 'Islom sivilizatsiyasining boy xilma-xilligini koʻrish uchun.' },
  { title: 'Islamic Liberalism: A Critique of Development Ideologies', titleUz: 'Islomiy liberalizm', authors: 'Leonard Binder', year: 1988, category: 'islam-modernity', topics: ['islom', 'siyosat'],
    summary: 'Musulmon mamlakatlarida liberal siyosiy tafakkur imkoniyatlarini va rivojlanish mafkuralarini tanqidiy tahlil qiladi.',
    whyRead: '“Islomiy liberal demokratiya” loyihasi uchun asosiy manba.' },
]

export type SeedClassic = {
  slug: string
  title: string
  originalTitle: string
  thinker: string
  initials: string
  era: string
  originalLanguage: string
  intro: string
  context: string
  keyIdeas: { title: string; text: string }[]
  commentary: string
  questions: string[]
  fullTextUrl?: string
  topics: TopicSlug[]
  color: string
  featured?: boolean
}

const gutenberg = (q: string) => `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(q)}`

export const classics: SeedClassic[] = [
  {
    slug: 'platon-davlat', title: 'Davlat', originalTitle: 'Πολιτεία (Politeia)', thinker: 'Platon', initials: 'P', era: 'mil. avv. 427–347', originalLanguage: 'Qadimgi yunon tili',
    intro: 'Adolat nima degan savoldan boshlanib, ideal davlat loyihasiga aylanadigan dialog. Gʻarb siyosiy falsafasining poydevori.',
    context: 'Asar Afinada, Sokrat qatl etilganidan keyin yozilgan. Platon demokratik Afinaning Sokratni hukm qilishidan chuqur iztirob chekkan va bu uning demokratiyaga tanqidiy munosabatida aks etgan.',
    keyIdeas: [
      { title: 'Adolat — har kim oʻz ishini qilishi', text: 'Davlatdagi uch tabaqa — hukmdorlar, himoyachilar va ishlab chiqaruvchilar — oʻz vazifasini bajarsa, jamiyat adolatli boʻladi.' },
      { title: 'Faylasuf hukmdor', text: 'Haqiqatni biladigan, donish egasi boshqarmaguncha davlatlar baxtsizlikdan qutulmaydi.' },
      { title: 'Gʻor tamsili', text: 'Odamlar soyalarni haqiqat deb biladi; taʼlim — gʻordan chiqib, yorugʻlikka qarash jarayoni.' },
      { title: 'Boshqaruv shakllarining buzilishi', text: 'Aristokratiya timokratiya, oligarxiya, demokratiya va nihoyat tiraniyaga aylanishi mumkin.' },
    ],
    commentary: `Platonning “Davlat”i Forobiyning “Fozil odamlar shahri”ga bevosita taʼsir koʻrsatgan. Forobiy faylasuf hukmdor gʻoyasini Islom kontekstida “birinchi rais” tushunchasi orqali qayta talqin qilgan.

Zamonaviy oʻquvchi uchun asardagi eng muhim saboq — boshqaruvda bilim va axloqning ahamiyati. Shu bilan birga, Karl Popper kabi tanqidchilar Platon loyihasining avtoritar xavflariga eʼtibor qaratgan.`,
    questions: ['Platon taʼriflagan adolat bugungi “qonun oldida tenglik” tushunchasidan qanday farq qiladi?', 'Faylasuf hukmdor gʻoyasining xavfli tomonlari nimada?', 'Gʻor tamsilini raqamli axborot davriga qanday tatbiq etish mumkin?'],
    fullTextUrl: gutenberg('Plato Republic'), topics: ['falsafa', 'siyosat'], color: '#14275E', featured: true,
  },
  {
    slug: 'aristotel-siyosat', title: 'Siyosat', originalTitle: 'Πολιτικά (Politika)', thinker: 'Aristotel', initials: 'A', era: 'mil. avv. 384–322', originalLanguage: 'Qadimgi yunon tili',
    intro: '“Inson — siyosiy mavjudot” degan mashhur taʼrif shu asardan. Boshqaruv shakllarini tizimli tasniflagan ilk asar.',
    context: 'Aristotel 158 ta yunon shahar-davlatining konstitutsiyasini toʻplab oʻrgangan. “Siyosat” bu empirik tadqiqot va falsafiy mulohazaning natijasi.',
    keyIdeas: [
      { title: 'Inson tabiatan siyosiy', text: 'Inson faqat jamiyatda — polisda — oʻz tabiatini toʻliq roʻyobga chiqaradi.' },
      { title: 'Olti boshqaruv shakli', text: 'Monarxiya, aristokratiya va politeya — toʻgʻri; tiraniya, oligarxiya va demokratiya — ularning buzilgan shakllari.' },
      { title: 'Oʻrta tabaqa', text: 'Kuchli oʻrta tabaqaga tayangan davlat eng barqaror boʻladi.' },
      { title: 'Qonun hukmronligi', text: 'Eng yaxshi inson emas, qonun hukmronlik qilgani maʼqul.' },
    ],
    commentary: `Aristotel Islom olamida “birinchi muallim” deb atalgan, Forobiy esa “ikkinchi muallim” unvonini olgan. Aristotelning qonun hukmronligi va oʻrta tabaqa haqidagi gʻoyalari zamonaviy konstitutsionalizm va demokratik barqarorlik nazariyalarida yashab kelmoqda.`,
    questions: ['Aristotel nega demokratiyani buzilgan shakl deb hisoblagan?', 'Oʻrta tabaqa va siyosiy barqarorlik oʻrtasidagi bogʻliqlik bugun ham kuzatiladimi?', '“Qonun hukmronligi” va “eng yaxshi inson hukmronligi” — qaysi biri xavfsizroq?'],
    fullTextUrl: gutenberg('Aristotle Politics'), topics: ['falsafa', 'siyosat'], color: '#4A2E5C',
  },
  {
    slug: 'forobiy-fozil-odamlar-shahri', title: 'Fozil odamlar shahri', originalTitle: 'Ārāʼ ahl al-madīna al-fāḍila', thinker: 'Abu Nasr Forobiy', initials: 'AF', era: 'taxm. 870–950', originalLanguage: 'Arab tili',
    intro: '“Ikkinchi muallim”ning ideal jamiyat haqidagi asosiy asari. Loyihamiz nomi ham shu merosga ishora qiladi.',
    context: 'Forobiy Bagʻdodda yunon falsafasini arab tilida sharhlagan olimlar davrasida yetishgan. Asar umrining soʻnggi yillarida, Damashqda yakunlangan deb hisoblanadi.',
    keyIdeas: [
      { title: 'Saodat — umumiy maqsad', text: 'Inson yolgʻiz kamolotga erisha olmaydi; saodat oʻzaro yordamga asoslangan jamiyatda qoʻlga kiritiladi.' },
      { title: 'Tana tamsili', text: 'Fozil shahar sogʻlom tanaga oʻxshaydi: har bir aʼzo oʻz vazifasini bajaradi, yurak esa butun tanani boshqaradi.' },
      { title: 'Rahbar fazilatlari', text: 'Rahbarda bilim, adolat, rostgoʻylik, iroda va mol-dunyoga berilmaslik kabi fazilatlar boʻlishi kerak.' },
      { title: 'Nofozil shaharlar', text: 'Johil, fosiq, oʻzgargan va adashgan shaharlar — jamiyatlar inqirozining turlari.' },
    ],
    commentary: `Forobiy Platon va Aristotel gʻoyalarini Islom madaniyati bilan uygʻunlashtirib, mustaqil siyosiy falsafa yaratdi. Uning asarlari keyinchalik Ibn Sino va Ibn Rushd orqali Yevropa tafakkuriga ham taʼsir qilgan.

Bugun Forobiy merosi yaxshi boshqaruv, xizmatkor yetakchilik va bilimga asoslangan jamiyat haqidagi muhokamalar uchun boy manba boʻlib xizmat qiladi.`,
    questions: ['Forobiyning “saodat” tushunchasi bugungi “farovonlik” tushunchasidan nimasi bilan farq qiladi?', 'Rahbar fazilatlaridan qaysilari zamonaviy davlat xizmatchisi uchun eng muhim?', 'Nofozil shaharlar tasnifini bugungi jamiyatlarga qoʻllash mumkinmi?'],
    topics: ['meros', 'falsafa', 'islom'], color: '#135E5A', featured: true,
  },
  {
    slug: 'nizomulmulk-siyosatnoma', title: 'Siyosatnoma', originalTitle: 'Siyar al-mulūk', thinker: 'Nizomulmulk', initials: 'N', era: '1018–1092', originalLanguage: 'Fors tili',
    intro: 'Saljuqiylar vaziri sulton Malikshohga yozgan davlat boshqaruvi qoʻllanmasi — “podshohlar uchun koʻzgu” janrining yorqin namunasi.',
    context: 'Nizomulmulk qariyb oʻttiz yil davomida Saljuqiylar davlatini boshqargan, Nizomiya madrasalarini asos solgan. Asar XI asr oxirida yozilgan.',
    keyIdeas: [
      { title: 'Adolat — davlat poydevori', text: 'Hukmdor xalq shikoyatlarini tinglashi va zulmga yoʻl qoʻymasligi kerak.' },
      { title: 'Nazorat tizimi', text: 'Viloyatlardagi amaldorlar faoliyati ishonchli xabarchilar orqali kuzatib boriladi.' },
      { title: 'Loyiqlik', text: 'Lavozimlar bilim va tajribaga qarab berilishi lozim.' },
      { title: 'Maslahat', text: 'Muhim qarorlar tajribali kishilar bilan maslahatlashib qabul qilinadi.' },
    ],
    commentary: `“Siyosatnoma” amaliy boshqaruv tajribasini umumlashtirgan asar sifatida qimmatli. Uni zamonaviy davlat xizmati etikasi va korrupsiyaga qarshi kurash tamoyillari bilan qiyoslash mumkin.`,
    questions: ['Nizomulmulk tavsiya etgan nazorat tizimining bugungi muqobillari qanday?', 'Loyiqlik tamoyili qanday institutlar orqali taʼminlanadi?'],
    topics: ['meros', 'siyosat'], color: '#7E3518',
  },
  {
    slug: 'ibn-xaldun-muqaddima', title: 'Muqaddima', originalTitle: 'al-Muqaddima', thinker: 'Ibn Xaldun', initials: 'IX', era: '1332–1406', originalLanguage: 'Arab tili',
    intro: 'Tarix falsafasi va ijtimoiy fanlarning asoschilaridan biri sanalgan muallifning jamiyat va davlat qonuniyatlari haqidagi asari.',
    context: 'Ibn Xaldun Shimoliy Afrika va Andalusiyada turli saroylarda xizmat qilgan. 1401-yilda Damashq yaqinida Amir Temur bilan uchrashgani tarixiy manbalarda qayd etilgan.',
    keyIdeas: [
      { title: 'Asabiyya', text: 'Jamoaviy birdamlik davlatlarni quradi va uning zaiflashuvi inqirozga olib keladi.' },
      { title: 'Davlat sikli', text: 'Sulolalar odatda bir necha avlod davomida yuksalish va tanazzul davrini boshidan kechiradi.' },
      { title: 'Tarixni tanqidiy oʻrganish', text: 'Tarixiy xabarlar aql va ijtimoiy qonuniyatlar mezoni bilan tekshirilishi kerak.' },
      { title: 'Iqtisodiyot va soliqlar', text: 'Haddan tashqari yuqori soliqlar ishlab chiqarishni susaytiradi va davlat daromadini kamaytiradi.' },
    ],
    commentary: `Ibn Xaldun gʻoyalari sotsiologiya, iqtisodiyot va siyosatshunoslikning koʻplab zamonaviy nazariyalarini oldindan koʻra bilgan. Uning soliqlar haqidagi kuzatuvlari keyinchalik “Laffer egri chizigʻi” bilan qiyoslangan.`,
    questions: ['Asabiyya tushunchasini zamonaviy fuqarolik identifikatsiyasi bilan qanday bogʻlash mumkin?', 'Ibn Xaldunning tarixga tanqidiy yondashuvi bugungi “fakt-cheking” bilan qanday oʻxshash?'],
    topics: ['meros', 'falsafa', 'iqtisod'], color: '#1F4D3A',
  },
  {
    slug: 'temur-tuzuklari', title: 'Temur tuzuklari', originalTitle: 'Tuzūkāt-i Tīmūrī', thinker: 'Amir Temur (nisbat berilgan)', initials: 'AT', era: '1336–1405', originalLanguage: 'Fors tili',
    intro: 'Davlat boshqaruvi va harbiy ishlar haqidagi qoidalar toʻplami. Muallifligi ilmiy bahsli boʻlsa-da, milliy davlatchilik merosining muhim manbai.',
    context: 'Fors tilidagi matn XVII asrda maʼlum boʻlgan va 1783-yilda Oksfordda inglizcha tarjimasi bilan nashr etilgan. Tadqiqotchilar matnning tarixiy qatlamlari haqida turli fikrlarni bildiradi.',
    keyIdeas: [
      { title: 'Kengash va tadbir', text: 'Davlat ishlarining katta qismi maslahat, tadbir va ehtiyotkorlik bilan hal qilinadi.' },
      { title: 'Jamiyat toifalari', text: 'Jamiyat turli toifalarga ajratilib, har biriga munosib hurmat va vazifa belgilanadi.' },
      { title: 'Qonun va tartib', text: 'Lavozimlar, mukofot va jazo aniq qoidalar asosida belgilanadi.' },
      { title: 'Adolat', text: 'Fuqarolarga adolatli munosabat davlat barqarorligining sharti sifatida koʻrsatiladi.' },
    ],
    commentary: `“Tuzuklar”ni oʻrganishda ikki yondashuvni uygʻunlashtirish muhim: milliy tarixiy xotira manbai sifatida qadrlash va tarixiy manba sifatida tanqidiy tahlil qilish.`,
    questions: ['Tarixiy manbaning muallifligi bahsli boʻlsa, undan qanday foydalanish kerak?', '“Kengash” tamoyilining bugungi institutsional ifodasi nima?'],
    topics: ['meros', 'siyosat'], color: '#C9962B',
  },
  {
    slug: 'lokk-boshqaruv-haqida-ikkinchi-risola', title: 'Boshqaruv haqida ikkinchi risola', originalTitle: 'Second Treatise of Government', thinker: 'Jon Lokk', initials: 'JL', era: '1632–1704', originalLanguage: 'Ingliz tili',
    intro: 'Hayot, erkinlik va mulk huquqlari hamda boshqaruvning xalq roziligiga asoslanishi haqidagi liberal tafakkurning asosiy matni.',
    context: 'Risola 1689-yilda, Angliyadagi “Shonli inqilob” davrida nashr etilgan va keyinchalik Amerika Mustaqillik deklaratsiyasiga taʼsir koʻrsatgan.',
    keyIdeas: [
      { title: 'Tabiiy huquqlar', text: 'Har bir inson tugʻilishdan hayot, erkinlik va mulk huquqiga ega.' },
      { title: 'Rozilik', text: 'Hukumat hokimiyati boshqariluvchilarning roziligidan kelib chiqadi.' },
      { title: 'Mehnat va mulk', text: 'Inson tabiat neʼmatlariga mehnatini qoʻshganda mulkka ega boʻladi.' },
      { title: 'Qarshilik huquqi', text: 'Hukumat shartnomani buzsa, xalq uni almashtirish huquqiga ega.' },
    ],
    commentary: `Lokk gʻoyalari zamonaviy konstitutsiyalarning asosida yotadi. Ularni Islom huquqidagi “bayʼat” va maqosid tushunchalari bilan qiyoslash qiziqarli tadqiqot mavzusi.`,
    questions: ['Lokkning rozilik nazariyasi va “bayʼat” tushunchasi oʻrtasida qanday oʻxshashlik va farqlar bor?', 'Mulk huquqining chegarasi qayerda?'],
    fullTextUrl: gutenberg('Locke Second Treatise of Government'), topics: ['falsafa', 'huquq'], color: '#1E3A8A',
  },
  {
    slug: 'mill-erkinlik-haqida', title: 'Erkinlik haqida', originalTitle: 'On Liberty', thinker: 'Jon Styuart Mill', initials: 'JM', era: '1806–1873', originalLanguage: 'Ingliz tili',
    intro: 'Shaxs erkinligi chegaralari, soʻz erkinligi va “koʻpchilik tiraniyasi” haqidagi klassik esse.',
    context: '1859-yilda nashr etilgan asar Viktoriya davri Angliyasidagi ijtimoiy konformizmga javob sifatida yozilgan. Mill uni rafiqasi Harriet Teylor Mill bilan birga yaratilgan deb hisoblagan.',
    keyIdeas: [
      { title: 'Zarar tamoyili', text: 'Jamiyat shaxs erkinligini faqat boshqalarga zarar yetkazilishining oldini olish uchun cheklashi mumkin.' },
      { title: 'Soʻz erkinligi', text: 'Hatto notoʻgʻri fikr ham haqiqatni yaxshiroq anglashga yordam beradi.' },
      { title: 'Koʻpchilik tiraniyasi', text: 'Xavf faqat hukumatdan emas, jamiyatning bosimidan ham keladi.' },
      { title: 'Individuallik', text: 'Shaxsning oʻziga xos rivojlanishi jamiyat taraqqiyotining manbai.' },
    ],
    commentary: `Mill gʻoyalari raqamli davrda yangi savollar uygʻotmoqda: ijtimoiy tarmoqlardagi yolgʻon axborot, nafrat tili va platformalar masʼuliyati. Zarar tamoyilini bugungi sharoitda qanday talqin qilish kerakligi ochiq bahs mavzusi.`,
    questions: ['Zarar tamoyili internetdagi yolgʻon axborotga qanday qoʻllanadi?', '“Koʻpchilik tiraniyasi” ijtimoiy tarmoqlarda qanday namoyon boʻladi?'],
    fullTextUrl: gutenberg('Mill On Liberty'), topics: ['falsafa', 'huquq'], color: '#4A2E5C',
  },
]
