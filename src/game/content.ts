export type AuthStatus = 'pass' | 'fail' | 'none';

export interface Attachment {
  name: string;
  size: string;
}

export type TrapKind = 'login' | 'card' | 'macro';

export interface Trap {
  kind: TrapKind;
  brand: string;
  amount?: string;
}

export interface SafePreview {
  title: string;
  text: string;
}

export interface Mail {
  id: number;
  type: string;
  phish: boolean;
  time: string;
  from: { n: string; a: string };
  reply?: string;
  auth: AuthStatus;
  subj: string;
  body: string;
  att?: Attachment[];
  clues: Record<string, string>;
  why: string;
  trap?: Trap;
  safe?: SafePreview;
}

export interface TypeInfo {
  n: string;
  g: string;
  s: string;
  signs: string[];
  do: string;
}

export interface Shift {
  t: string;
  day: string;
  sub: string;
  tip: string;
  mails: number[];
}

export interface BadgeDef {
  id: string;
  n: string;
  d: string;
}

/* ---------- příručka ---------- */

export const TYPES: Record<string, TypeInfo> = {
  urgent: {
    n: 'Nátlak a časový tlak',
    g: '!',
    s: 'Útočník chce, abys jednal dřív, než začneš přemýšlet.',
    signs: [
      '„Do 24 hodin“, „ihned“, „poslední upozornění“',
      'Hrozba blokace účtu, pokuty nebo ztráty dat',
      'Generické oslovení „Vážený uživateli“',
    ],
    do: 'Zpomal. Otevři službu sám v prohlížeči, ne přes odkaz z mailu.',
  },
  domain: {
    n: 'Podvržená adresa',
    g: '@',
    s: 'Jméno odesílatele je pravé, adresa ne. Útočník změní jedno písmeno nebo použije jinou koncovku.',
    signs: [
      'novatem.cz místo novaterm.cz',
      'Čísla místo písmen (0 místo o)',
      'Soukromý gmail u „firemního“ mailu',
    ],
    do: 'Čti celou adresu za zavináčem. Jméno si může vymyslet kdokoli.',
  },
  link: {
    n: 'Zrádný odkaz',
    g: '↗',
    s: 'Text odkazu slibuje jedno, cíl je jinde. Někdy píše i pravý kolega s napadeným účtem.',
    signs: [
      'Skutečná doména je ta před první lomítkem: u rychly-balik.cz.platba-info.top je to platba-info.top',
      'Sdílený dokument od neznámé služby',
      'Lákavý název souboru (mzdy, bonusy)',
    ],
    do: 'Neklikej. Otevři službu přes záložku nebo vyhledávač.',
  },
  attach: {
    n: 'Nebezpečná příloha',
    g: '▤',
    s: 'Soubor se tváří jako faktura nebo potvrzení, ale spustí škodlivý kód nebo falešné přihlášení.',
    signs: [
      'Přípony .docm, .xlsm, .html, .zip, .exe',
      'Výzva „povolit makra“ nebo „povolit úpravy“',
      'Heslo k archivu přímo v textu mailu',
    ],
    do: 'Nečekané přílohy neotevírej. Ověř odesílatele jinou cestou.',
  },
  parcel: {
    n: 'Falešný kurýr',
    g: '▦',
    s: 'Zpráva o balíku, který nemůže být doručen, dokud nezaplatíš „malý poplatek“.',
    signs: ['Doplatek za doručení', 'Platba kartou na neznámém webu', 'Balík, který neočekáváš'],
    do: 'Zkontroluj sledování na webu kurýra a objednávku v e-shopu.',
  },
  prize: {
    n: 'Výhra a příliš dobré nabídky',
    g: '★',
    s: 'Odměna, o kterou jsi nežádal. Cílem je tvoje karta, tvoje doklady nebo tvoje důvěra.',
    signs: [
      'Soutěž, do které ses nepřihlásil',
      'Poplatek za převzetí výhry',
      'Práce z domova za nereálné peníze',
      'Žádost o kopii dokladů a číslo účtu',
    ],
    do: 'Co zní příliš dobře, aby to byla pravda, pravda není.',
  },
  support: {
    n: 'Falešná podpora',
    g: '?',
    s: 'IT, banka nebo služba „potřebuje“ heslo, nebo tě pošle na telefonní číslo.',
    signs: [
      'Žádost o heslo e-mailem (IT to nikdy neudělá)',
      'Neočekávaná faktura a číslo pro „zrušení“',
      'Odpověď by šla na jinou adresu (Reply-To)',
    ],
    do: 'Heslo nesděluj nikomu. Kontakt hledej na oficiálním webu.',
  },
  qr: {
    n: 'QR phishing',
    g: '▣',
    s: 'QR kód ukrývá adresu. Na mobilu obejdeš firemní ochranu a adresu nevidíš.',
    signs: ['QR kód v e-mailu místo odkazu', 'Kód vede na přihlašovací stránku', 'Naléhavá lhůta'],
    do: 'Kódy z mailů neskenuj. Adresu si vždy zkontroluj.',
  },
  ceo: {
    n: 'Podvod s ředitelem',
    g: 'Ř',
    s: '„Šéf“ chce rychlou důvěrnou platbu a nechce volat.',
    signs: [
      'Soukromá adresa místo firemní',
      'Naléhavá, utajená platba',
      '„Nemůžu telefonovat“',
      'Obchází běžný schvalovací proces',
    ],
    do: 'Ověř platbu telefonem na známém čísle a drž se schvalování.',
  },
  invoice: {
    n: 'Změna účtu dodavatele',
    g: '₿',
    s: 'Dodavatel „oznámí“ nový bankovní účet. Peníze pak odejdou útočníkovi.',
    signs: ['Doména dodavatele se liší o jedno písmeno', 'Odpovědi jdou na jinou adresu', 'Tlak na rychlou úhradu'],
    do: 'Změnu účtu vždy ověř telefonicky na čísle, které už znáš.',
  },
  mfa: {
    n: 'Krádež ověřovacího kódu',
    g: '#',
    s: 'Útočník zná tvé heslo a potřebuje už jen kód z SMS nebo aplikace.',
    signs: [
      'Žádost o kód odpovědí nebo po telefonu',
      'Poplach o neobvyklém přihlášení s odkazem',
      'Kód, o který jsi nežádal',
    ],
    do: 'Ověřovací kód nikdy nikomu nesděluj.',
  },
  blackmail: {
    n: 'Vydírání',
    g: '$',
    s: 'Hromadný e-mail, který tvrdí, že má tvoje heslo a kompromitující záběry.',
    signs: ['Staré heslo z veřejného úniku dat', 'Platba v kryptoměně', 'Hrozba lhůtou'],
    do: 'Nepanikař a neplať. Změň heslo tam, kde ho používáš, a zprávu smaž.',
  },
  bank: {
    n: 'Falešná banka',
    g: '¤',
    s: '„Banka“ ti zablokuje platbu a po telefonu chce kód z SMS nebo PIN.',
    signs: ['Doména jen podobná bance (nordia-banka.cz)', 'Telefonní číslo v e-mailu', 'Žádost o PIN nebo kód'],
    do: 'Zavolej na číslo na kartě. Banka nechce PIN ani kód po telefonu.',
  },
  legit: {
    n: 'Jak poznat pravou zprávu',
    g: '✓',
    s: 'Většina pošty je v pořádku. Paranoia taky stojí čas a peníze.',
    signs: [
      'Známý odesílatel, firemní doména, ověření prošlo',
      'Zpráva souvisí s tím, co očekáváš',
      'Odkazy vedou na stejnou doménu jako odesílatel',
      'Obecné oslovení samo o sobě podvod není',
    ],
    do: 'Když si nejsi jistý, zeptej se IT. Falešné poplachy zatěžují bezpečnostní tým.',
  },
};

export const TYPE_KEYS = Object.keys(TYPES);

/* ---------- směny ---------- */

export const SHIFTS: Shift[] = [
  {
    t: 'Pondělí: první den',
    day: 'Po',
    sub: 'Vítej ve firmě Novaterm. Prvních šest zpráv ukáže, jak si vedeš.',
    tip: 'Podívej se, odkud zpráva skutečně přichází. Jméno odesílatele může napsat kdokoli. Klikni na „Technické detaily“.',
    mails: [1, 2, 3, 4, 5, 6],
  },
  {
    t: 'Úterý: balíky a podpora',
    day: 'Út',
    sub: 'Firma tento týden čeká toner z objednávky OBJ-5521 od Kancelářských potřeb Moravia.',
    tip: 'Nátlak, poplatky a „nutná akce“ jsou varovné signály. Dej si pozor i na QR kódy.',
    mails: [7, 8, 9, 10, 11, 12],
  },
  {
    t: 'Středa: šéf potřebuje pomoc',
    day: 'St',
    sub: 'Právě ses přihlásil do Hyper365 na svém počítači.',
    tip: 'Změna účtu nebo urgentní platba? Ověř ji jinou cestou, třeba telefonem. Sleduj také řádek „Ověření“ v technických detailech.',
    mails: [13, 14, 15, 16, 17, 18],
  },
  {
    t: 'Čtvrtek: cílené útoky',
    day: 'Čt',
    sub: 'Dnes ti telefonovala Kateřina z auditorské firmy Ekonomika s.r.o.',
    tip: 'Útočník zná jména tvých kolegů, takže osobní oslovení nic nedokazuje. Cizí odesílatel zase není automaticky podvodník.',
    mails: [19, 20, 21, 22, 23, 24],
  },
  {
    t: 'Pátek: ostřílení',
    day: 'Pá',
    sub: 'Poslední směna. Pozor na paranoiu, falešný poplach stojí také.',
    tip: 'Nic není jisté na první pohled. Skládej dohromady doménu, ověření, kontext a tlak. Pravý odesílatel může mít napadený účet.',
    mails: [25, 26, 27, 28, 29, 30],
  },
];

/* ---------- zprávy ----------
   syntaxe těla: {{klíč|text}} = označitelná stopa,
   [[url|text|klíč|styl]] = odkaz (btn, qr), prázdný řádek = odstavec */

export const MAILS: Mail[] = [
  {
    id: 1,
    type: 'urgent',
    phish: true,
    time: '07:42',
    from: { n: 'Podpora Hyper365', a: 'support@hyper365-helpdesk.xyz' },
    auth: 'fail',
    subj: 'Vaše heslo vyprší za 24 hodin',
    body: `{{gen|Vážený uživateli}},\n\nz bezpečnostních důvodů musíte své heslo obnovit {{urg|do 24 hodin}}, jinak bude váš účet {{urg|trvale zablokován}}.\n\n[[https://login.hyper365-helpdesk.xyz/obnova-hesla|Obnovit heslo|lnk|btn]]\n\nTým podpory Hyper365`,
    clues: {
      h_from: 'Služba Hyper365 píše z hyper365.com. Doména hyper365-helpdesk.xyz jí nepatří.',
      h_auth: 'Ověření odesílatele selhalo, zpráva se vydává za někoho jiného.',
      gen: 'Pravá služba zná tvé jméno. „Vážený uživateli“ je znak hromadné rozesílky.',
      urg: 'Časový tlak a hrozba blokace mají zabránit přemýšlení.',
      lnk: 'Odkaz vede na cizí doménu .xyz, ne na hyper365.com.',
    },
    why: 'Cizí doména, selhané ověření, anonymní oslovení a hrozba blokace za 24 hodin. Heslo se mění přímo v aplikaci, ne přes odkaz z mailu.',
    trap: { kind: 'login', brand: 'Hyper365' },
  },
  {
    id: 2,
    type: 'legit',
    phish: false,
    time: '08:05',
    from: { n: 'Jana Nováková', a: 'jana.novakova@novaterm.cz' },
    auth: 'pass',
    subj: 'Zápis z porady 27. 10.',
    body: `Ahoj,\n\nv příloze je zápis z pondělní porady. Úkoly pro náš tým jsou na straně 2, termíny jsme si potvrdili.\n\nDíky\nJana`,
    att: [{ name: 'zapis_porada_2710.pdf', size: '184 kB' }],
    clues: {},
    why: 'Kolegyně z interní domény, ověření prošlo, očekávaná příloha ve formátu PDF a žádný nátlak.',
    safe: {
      title: 'zapis_porada_2710.pdf',
      text: 'Zápis z porady 27. 10. Přítomni: Horák, Nováková, Dvořáková, Kratochvíl. Úkol: připravit podklady pro Q4 do 5. 11.',
    },
  },
  {
    id: 3,
    type: 'prize',
    phish: true,
    time: '08:19',
    from: { n: 'Spotřebitelská loterie', a: 'vyhra@loterie-vyherce.top' },
    auth: 'none',
    subj: 'Gratulujeme! Jste náš 1000. návštěvník',
    body: `Dobrý den,\n\ngratulujeme, {{prize|vyhráli jste nový telefon v hodnotě 29 990 Kč}}! Do soutěže jste byli zařazeni automaticky.\n\nCenu si musíte vyzvednout {{urg|do 2 hodin}}, jinak propadne. Stačí uhradit poštovné 49 Kč.\n\n[[https://vyhra-telefon.top/prevzit|Převzít výhru|lnk|btn]]`,
    clues: {
      h_from: 'Doména .top bez vztahu k nějaké skutečné firmě.',
      prize: 'Do soutěže ses nepřihlásil. Výhra, o kterou jsi nežádal, je klasický vějičkový podvod.',
      urg: 'Lhůta dvou hodin má zabránit rozmyslu.',
      lnk: 'Poštovné se platí kartou na cizím webu. Cílem jsou údaje o kartě.',
    },
    why: 'Výhra v soutěži, do které ses nepřihlásil, poplatek a lhůta dvou hodin. Cílem je tvoje platební karta.',
    trap: { kind: 'card', brand: 'Převzetí výhry', amount: '49 Kč' },
  },
  {
    id: 4,
    type: 'legit',
    phish: false,
    time: '08:31',
    from: { n: 'Tomáš Kratochvíl', a: 'tomas.kratochvil@novaterm.cz' },
    auth: 'pass',
    subj: 'Odstávka tiskáren ve čtvrtek',
    body: `Ahoj všichni,\n\nve čtvrtek 30. 10. od 17:00 do 18:00 budeme aktualizovat tiskové servery. Tisk nebude dostupný. Pokud potřebujete něco vytisknout, udělejte to prosím dřív.\n\nTomáš, IT`,
    clues: {},
    why: 'Interní oznámení od IT z firemní domény. Nežádá heslo ani kliknutí, jen informuje.',
  },
  {
    id: 5,
    type: 'blackmail',
    phish: true,
    time: '08:47',
    from: { n: 'Anonym', a: 'k8d2x9@mailbox-secure.ru' },
    auth: 'none',
    subj: 'Vím vaše heslo',
    body: `Ahoj,\n\nvím, že vaše heslo je {{pw|Heslo2019}}. Dostal jsem se do vašeho zařízení a mám {{threat|kompromitující záběry a vaši historii prohlížení}}.\n\nPošlete {{pay|0,05 BTC}} na adresu bc1q9x7…f4k7. Máte {{urg|48 hodin}}. Pak vše rozešlu vašim kontaktům.`,
    clues: {
      h_from: 'Anonymní adresa na ruské doméně bez vztahu k tobě.',
      pw: 'Staré heslo pochází z veřejných úniků dat. Neznamená to, že se někdo dostal do tvého počítače.',
      threat: 'Záběry neexistují. Stejný text dostávají tisíce lidí.',
      pay: 'Platba v kryptoměně je nevratná a nikdo seriózní ji nechce.',
      urg: 'Lhůta je tu jen k vyvolání paniky.',
    },
    why: 'Hromadný vydírací mail. Heslo je ze starého úniku dat a hrozba je prázdná. Neplať a změň heslo všude, kde ho používáš.',
  },
  {
    id: 6,
    type: 'attach',
    phish: true,
    time: '09:02',
    from: { n: 'Fakturace', a: 'faktury@dodavatel-online.biz' },
    auth: 'fail',
    subj: 'Neuhrazená faktura č. 2024118',
    body: `Dobrý den,\n\nv příloze zasíláme {{urg|poslední upomínku}} k neuhrazené faktuře. Dokument otevřete a {{macro|povolte úpravy a makra}}, aby se zobrazil celý obsah.\n\nFakturační oddělení`,
    att: [{ name: 'Faktura_2024118.docm', size: '96 kB' }],
    clues: {
      h_from: 'Neznámý dodavatel na doméně .biz a upomínka na fakturu, kterou nikdo nezná.',
      h_auth: 'Ověření odesílatele selhalo.',
      urg: 'Slovo „poslední upomínka“ vyvolává tlak.',
      macro: 'Výzva „povolit makra“ je nejčastější cesta ke spuštění škodlivého kódu.',
      att0: 'Přípona .docm je dokument s makry. Faktury chodí jako PDF.',
    },
    why: 'Neznámý dodavatel, selhané ověření a dokument s makry. Prosba „povolit makra“ je jasný varovný signál.',
    trap: { kind: 'macro', brand: 'Faktura_2024118.docm' },
  },

  {
    id: 7,
    type: 'parcel',
    phish: true,
    time: '07:30',
    from: { n: 'Rychlý Balík', a: 'info@rychly-balik-doruceni.com' },
    auth: 'fail',
    subj: 'Balík nelze doručit – doplatek 29 Kč',
    body: `Dobrý den,\n\nVáš balík č. RB77129 nelze doručit, protože chybí {{fee|doplatek 29 Kč}}. Zaplaťte {{urg|do 24 hodin}}, jinak bude vrácen odesílateli.\n\n[[https://rychly-balik.cz.platba-info.top/doplatek|Zaplatit doplatek|lnk|btn]]`,
    clues: {
      h_from: 'Kurýr píše z rychlybalik.cz, ne z „rychly-balik-doruceni.com“.',
      h_auth: 'Ověření odesílatele selhalo.',
      fee: 'Doplatek za doručení je záminka k získání údajů o kartě. Firma žádný balík neobjednala s takovou podmínkou.',
      urg: 'Lhůta 24 hodin.',
      lnk: 'Skutečná doména je platba-info.top. „rychly-balik.cz“ je jen poddoména, kterou si útočník zvolil jako kamufláž.',
    },
    why: 'Doplatek, lhůta a doména, která se jen tváří jako kurýrská. Pravý kurýr píše z rychlybalik.cz a za doručení nic nežádá.',
    trap: { kind: 'card', brand: 'Rychlý Balík – platba', amount: '29 Kč' },
  },
  {
    id: 8,
    type: 'legit',
    phish: false,
    time: '07:55',
    from: { n: 'Rychlý Balík', a: 'info@rychlybalik.cz' },
    auth: 'pass',
    subj: 'Váš balík dorazí zítra',
    body: `Dobrý den,\n\nzásilka z objednávky OBJ-5521 (Kancelářské potřeby Moravia, toner) dorazí zítra mezi 8:00 a 12:00. Za doručení neplatíte nic.\n\n[[https://www.rychlybalik.cz/sledovani/RB48210|Sledovat zásilku|ok|btn]]`,
    clues: {},
    why: 'Čeká se na toner z objednávky OBJ-5521, doména rychlybalik.cz sedí, ověření prošlo a nikdo nechce žádné peníze.',
    safe: {
      title: 'Sledování zásilky RB48210',
      text: 'Stav: v přepravě. Doručení zítra 8–12 h. Žádná platba není vyžadována.',
    },
  },
  {
    id: 9,
    type: 'support',
    phish: true,
    time: '08:10',
    from: { n: 'IT oddělení', a: 'it-podpora@novaterm-helpdesk.cz' },
    reply: 'sber@gmail-bezpecnost.com',
    auth: 'fail',
    subj: 'Upgrade poštovní schránky – nutná akce',
    body: `Dobrý den,\n\nprovádíme upgrade poštovních schránek. Aby vám zůstal přístup, {{cred|odpovězte na tento e-mail a uveďte své přihlašovací jméno a heslo}}.\n\nPokud tak neučiníte {{urg|do pátku}}, schránku zrušíme.\n\nIT oddělení`,
    clues: {
      h_from: 'Firemní IT píše z novaterm.cz. Tady je novaterm-helpdesk.cz.',
      h_reply: 'Odpověď by šla na zcela jinou adresu na gmail-bezpecnost.com.',
      h_auth: 'Ověření odesílatele selhalo.',
      cred: 'IT po tobě nikdy nebude chtít heslo e-mailem.',
      urg: 'Hrozba zrušením schránky.',
    },
    why: 'Skutečné IT nikdy nežádá heslo e-mailem. Navíc adresa i odpověď vedou mimo firemní doménu.',
  },
  {
    id: 10,
    type: 'qr',
    phish: true,
    time: '08:28',
    from: { n: 'Benefity Novaterm', a: 'benefity@novaterm-benefity.info' },
    auth: 'none',
    subj: 'Nový benefitní program – aktivace do pátku',
    body: `Dobrý den,\n\nzaměstnanecké benefity se od listopadu přesouvají do nové aplikace. Účet si aktivujete naskenováním QR kódu mobilem:\n\n[[https://novaterm-benefity.info/aktivace|QR kód|qr|qr]]\n\nPřihlaste se firemním heslem {{urg|do pátku}}, jinak nárok na příspěvky propadne.`,
    clues: {
      h_from: 'Doména novaterm-benefity.info není firemní. Firma používá novaterm.cz.',
      qr: 'QR kód skrývá adresu a na mobilu obcházíš firemní ochranu. Adresu je nutné zkontrolovat.',
      urg: 'Lhůta s hrozbou ztráty příspěvků.',
    },
    why: 'Cizí doména, QR kód místo viditelného odkazu a žádost o firemní heslo s časovým limitem. Klasický „quishing“.',
    trap: { kind: 'login', brand: 'Novaterm Benefity' },
  },
  {
    id: 11,
    type: 'legit',
    phish: false,
    time: '08:44',
    from: { n: 'Jana Nováková', a: 'jana.novakova@novaterm.cz' },
    auth: 'pass',
    subj: 'Školení BOZP – vyberte si termín',
    body: `Ahoj,\n\nv listopadu proběhne povinné školení BOZP. Termíny a přihlášení najdeš na intranetu:\n\n[[https://intra.novaterm.cz/skoleni|Vybrat termín|ok|btn]]\n\nProsím přihlas se do pátku, ať můžeme zarezervovat sál.\n\nDíky, Jana`,
    clues: {},
    why: 'Má termín, ale je to běžný provozní termín. Odesílatel i odkaz jsou na firemní doméně novaterm.cz a ověření prošlo.',
    safe: {
      title: 'Intranet Novaterm – Školení BOZP',
      text: 'Dostupné termíny: 12. 11. 9:00, 14. 11. 13:00, 19. 11. 9:00.',
    },
  },
  {
    id: 12,
    type: 'legit',
    phish: false,
    time: '09:01',
    from: { n: 'Kancelářské potřeby Moravia', a: 'novinky@kancelarskepotreby-moravia.cz' },
    auth: 'pass',
    subj: 'Podzimní slevy až 30 % na papír a toner',
    body: `Dobrý den,\n\nv podzimní akci máte papír, tonery a archivační krabice se slevou až 30 %. Akce platí do konce listopadu.\n\n[[https://www.kancelarskepotreby-moravia.cz/akce|Zobrazit akční nabídku|ok|btn]]\n\nOdhlásit odběr: [[https://www.kancelarskepotreby-moravia.cz/odhlasit|odhlásit|unsub]]`,
    clues: {},
    why: 'Reklama od skutečného dodavatele. Odkazy vedou na jeho vlastní doménu a ověření prošlo. Slevy nejsou podvod, podvod je tlak a cizí doména.',
    safe: {
      title: 'Akční nabídka',
      text: 'Papír A4 80 g, 5 × 500 listů, nyní o 30 % levněji. Platí do 30. 11.',
    },
  },

  {
    id: 13,
    type: 'ceo',
    phish: true,
    time: '07:18',
    from: { n: 'Pavel Horák', a: 'pavel.horak.novaterm@gmail.com' },
    auth: 'none',
    subj: 'Důvěrné – potřebuji vaši pomoc',
    body: `Dobrý den,\n\njsem právě na jednání a {{nophone|nemůžu telefonovat}}. Potřebuji, abyste {{pay|obratem uhradili fakturu 148 500 Kč}} novému dodavateli. Je to {{conf|důvěrné, zatím o tom nikomu neříkejte}}.\n\nČíslo účtu pošlu hned po vašem potvrzení. Odpovězte, že to zařídíte.\n\nPavel`,
    clues: {
      h_from: 'Ředitel píše z firemní adresy novaterm.cz. Tady je soukromý gmail.',
      nophone: 'Útočník se vyhýbá telefonu, protože by ho prozradil hlas.',
      pay: 'Neobvyklá platba mimo schvalovací proces je typický podvod „CEO fraud“.',
      conf: 'Utajení brání kolegům, aby podvod odhalili.',
    },
    why: 'Soukromá adresa, utajená urgentní platba a „nemůžu telefonovat“. Platbu bys ověřil telefonem a přes schvalovací proces.',
  },
  {
    id: 14,
    type: 'legit',
    phish: false,
    time: '07:40',
    from: { n: 'Pavel Horák', a: 'pavel.horak@novaterm.cz' },
    auth: 'pass',
    subj: 'Podklady na čtvrtek',
    body: `Dobrý den,\n\nprosím připravte na čtvrteční poradu přehled zakázek za Q4, stačí jedna strana. Šablonu najdete na intranetu.\n\n[[https://intra.novaterm.cz/sablony|Šablona přehledu|ok]]\n\nDěkuji\nPavel Horák, ředitel`,
    clues: {},
    why: 'Ředitel píše z firemní adresy, žádá obvyklou práci, nic neutajuje a nežádá peníze. Odkaz míří na intra.novaterm.cz.',
    safe: {
      title: 'Intranet Novaterm – Šablony',
      text: 'Šablona: Přehled zakázek Q4.docx',
    },
  },
  {
    id: 15,
    type: 'invoice',
    phish: true,
    time: '08:02',
    from: { n: 'Kancelářské potřeby Moravia', a: 'fakturace@kancelarskepotreby-moravla.cz' },
    reply: 'platby@moravia-finance.com',
    auth: 'fail',
    subj: 'Změna bankovního účtu od 1. 11.',
    body: `Dobrý den,\n\nod 1. 11. používáme nový bankovní účet {{acc|2201234567/2010}}. Platby na původní účet už nebudou připsány. Prosíme o úpravu platebních údajů a o {{urg|úhradu faktur ještě tento týden}}.\n\nDěkujeme za pochopení\nOddělení financí`,
    clues: {
      h_from: 'V doméně je „moravla“ s písmenem l místo i. Pravý dodavatel píše z kancelarskepotreby-moravia.cz.',
      h_reply: 'Odpovědi by šly na jinou doménu, moravia-finance.com.',
      h_auth: 'Ověření odesílatele selhalo.',
      acc: 'Změna účtu e-mailem je častý způsob přesměrování plateb. Vždy ověř telefonem.',
      urg: 'Tlak na rychlou úhradu.',
    },
    why: 'Doména, která se liší jedním písmenem, jiná adresa pro odpovědi a změna účtu e-mailem. Změnu účtu vždy ověř telefonem.',
  },
  {
    id: 16,
    type: 'legit',
    phish: false,
    time: '08:15',
    from: { n: 'Hyper365', a: 'no-reply@hyper365.com' },
    auth: 'pass',
    subj: 'Váš ověřovací kód: 482 913',
    body: `Váš jednorázový kód pro přihlášení je 482 913.\n\nPřihlášení z počítače s Windows, Praha. Kód platí 10 minut. Pokud jste se právě nepřihlašovali, tuto zprávu ignorujte. Kód nikdy nikomu nesdělujte, ani pracovníkům podpory.`,
    clues: {},
    why: 'Právě ses přihlásil, kód přišel od skutečné služby a nikdo po tobě nechce, abys ho někam posílal. Kód se používá jen ve formuláři, který sám otevřeš.',
  },
  {
    id: 17,
    type: 'mfa',
    phish: true,
    time: '08:33',
    from: { n: 'Hyper365 Security', a: 'alerts@hyper365-alerts.net' },
    auth: 'fail',
    subj: 'Neobvyklé přihlášení z Nigérie',
    body: `Zaznamenali jsme pokus o přihlášení z neznámého zařízení (Lagos, Nigérie).\n\nChcete-li účet ochránit, {{code|odpovězte na tento e-mail ověřovacím kódem, který vám právě přišel SMS}}.\n\nNebo účet okamžitě zabezpečte:\n\n[[https://secure.hyper365-alerts.net/verify|Zabezpečit účet|lnk|btn]]`,
    clues: {
      h_from: 'Hyper365 píše z hyper365.com, ne z hyper365-alerts.net.',
      h_auth: 'Ověření odesílatele selhalo.',
      code: 'Ověřovací kód se nikdy nikomu nesděluje. Útočník právě zadává tvé heslo a kód potřebuje k dokončení přihlášení.',
      lnk: 'Odkaz vede na cizí doménu.',
    },
    why: 'Falešný poplach s požadavkem na kód z SMS. Útočník zná heslo a potřebuje už jen kód. Pravý kód ti přišel dříve a nikam se neposílá.',
    trap: { kind: 'login', brand: 'Hyper365' },
  },
  {
    id: 18,
    type: 'attach',
    phish: true,
    time: '08:51',
    from: { n: 'Marie Dvořáková', a: 'marie.dvorakova@novaterm.cz' },
    auth: 'fail',
    subj: 'Faktura k odsouhlasení',
    body: `Ahoj,\n\nposílám fakturu od dodavatele k odsouhlasení. Otevři ji prosím v prohlížeči a {{login|přihlas se firemním účtem}}, aby se dokument zobrazil.\n\nMarie`,
    att: [{ name: 'faktura_k_odsouhlaseni.html', size: '12 kB' }],
    clues: {
      h_auth: 'Adresa vypadá správně, ale ověření selhalo. Někdo se za Marii vydává, adresa je podvržená.',
      att0: 'HTML příloha otevřená v prohlížeči často skrývá falešné přihlášení. Faktury nechodí jako .html.',
      login: 'Dokument, který chce heslo, aby se zobrazil, je podvrh.',
    },
    why: 'Adresa sedí, ale ověření selhalo. Příloha .html a výzva k přihlášení prozrazují falešnou přihlašovací stránku. Dobrý důvod mrknout do technických detailů.',
    trap: { kind: 'login', brand: 'Faktura online' },
  },

  {
    id: 19,
    type: 'link',
    phish: true,
    time: '07:25',
    from: { n: 'Cloudora', a: 'share@cloudora-docs.link' },
    auth: 'none',
    subj: 'Jana Nováková s vámi sdílí dokument',
    body: `Jana Nováková s vámi sdílí dokument {{bait|Mzdy 2025 – návrh.xlsx}}.\n\n[[https://cloudora.share-files.cc/d/8f2a1c|Otevřít dokument|lnk|btn]]\n\nPokud dokument nechcete otevřít, ignorujte tuto zprávu.`,
    clues: {
      h_from: 'Služba Cloudora píše z cloudora.com. Tady je cloudora-docs.link.',
      bait: 'Lákavý název (mzdy) má vzbudit zvědavost. Jana by ti to řekla osobně nebo interním kanálem.',
      lnk: 'share-files.cc nemá se službou Cloudora nic společného.',
    },
    why: 'Doména se jen tváří jako Cloudora a dokument s mzdami láká na zvědavost. Odkaz vede na cizí web.',
    trap: { kind: 'login', brand: 'Cloudora' },
  },
  {
    id: 20,
    type: 'legit',
    phish: false,
    time: '07:48',
    from: { n: 'Cloudora', a: 'no-reply@cloudora.com' },
    auth: 'pass',
    subj: 'Tomáš Kratochvíl s vámi sdílí složku Šablony IT',
    body: `Tomáš Kratochvíl s vámi sdílí složku Šablony IT.\n\n[[https://app.cloudora.com/s/ab12cd|Otevřít složku|ok|btn]]`,
    clues: {},
    why: 'Správná doména cloudora.com, ověření prošlo a odkaz vede na stejnou službu. Sdílení od kolegy z IT je běžné.',
    safe: {
      title: 'Cloudora – Šablony IT',
      text: 'Složka obsahuje 4 soubory: Přístupy.docx, Postup_instalace.pdf, ...',
    },
  },
  {
    id: 21,
    type: 'bank',
    phish: true,
    time: '08:09',
    from: { n: 'Bankovnictví Nordia', a: 'bezpecnost@nordia-banka.cz' },
    auth: 'none',
    subj: 'Zablokovali jsme podezřelou platbu 12 990 Kč',
    body: `Dobrý den,\n\nv e-shopu byla zablokována platba 12 990 Kč vaší kartou. Pro odblokování {{call|zavolejte na číslo +420 777 123 456}} a pracovníkovi nadiktujte {{code|kód z SMS a PIN}}.\n\nOddělení bezpečnosti`,
    clues: {
      h_from: 'Banka píše z nordia.cz, ne z nordia-banka.cz.',
      call: 'Číslo v mailu nemusí patřit bance. Volej na číslo z karty nebo z oficiálního webu.',
      code: 'Banka nikdy nechce PIN ani kód z SMS po telefonu.',
    },
    why: 'Banka nikdy po telefonu nechce PIN ani kód z SMS. Navíc píše z jiné domény (nordia-banka.cz místo nordia.cz).',
  },
  {
    id: 22,
    type: 'support',
    phish: true,
    time: '08:30',
    from: { n: 'Hyper365 Billing', a: 'billing@hyper365-invoice.com' },
    auth: 'none',
    subj: 'Faktura 8 990 Kč – předplatné Premium',
    body: `Děkujeme za objednávku!\n\nVaše předplatné Hyper365 Premium bylo prodlouženo o 12 měsíců. Z vaší karty bude stržena částka {{amt|8 990 Kč}}.\n\nPokud s platbou nesouhlasíte, {{call|zavolejte na +1 (888) 555 0142}} {{urg|do 24 hodin}}.\n\nHyper365 Billing`,
    clues: {
      h_from: 'Hyper365 píše z hyper365.com.',
      amt: 'Vysoká částka za službu, kterou jsi neobjednal, má vyvolat paniku.',
      call: 'Cílem není web, ale telefon. „Operátor“ tě vyzve k instalaci vzdáleného přístupu nebo k zadání karty.',
      urg: 'Lhůta 24 hodin.',
    },
    why: 'Zpráva o objednávce, kterou jsi neudělal, a telefonní číslo pro „zrušení“. Tak funguje podvod s vyzváněním.',
  },
  {
    id: 23,
    type: 'legit',
    phish: false,
    time: '08:55',
    from: { n: 'Kateřina Svobodová', a: 'k.svobodova@ekonomika-sro.cz' },
    auth: 'pass',
    subj: 'Podklady k auditu – jak jsme se domluvili',
    body: `Dobrý den,\n\nděkuji za dnešní telefonát. Jak jsme se domluvili, posílám odkaz na sdílený balíček s podklady k auditu. Platnost odkazu je 14 dní.\n\n[[https://sdileni.ekonomika-sro.cz/audit2025|Podklady k auditu|ok|btn]]\n\nS pozdravem\nKateřina Svobodová, Ekonomika s.r.o.`,
    clues: {},
    why: 'Cizí odesílatel není automaticky podvodník. Sedí kontext (dnešní telefonát), ověření prošlo a odkaz vede na doménu odesílatele. Při pochybnostech stačí zavolat.',
    safe: {
      title: 'Ekonomika s.r.o. – sdílený balíček',
      text: 'Podklady k auditu 2025 (3 soubory, platnost 14 dní).',
    },
  },
  {
    id: 24,
    type: 'prize',
    phish: true,
    time: '09:10',
    from: { n: 'Kariéra Plus', a: 'kariera.plus.nabidky@gmail.com' },
    auth: 'none',
    subj: 'Zajímavá pracovní nabídka z domova',
    body: `Dobrý den,\n\nzaujal nás váš profil. Nabízíme práci administrativního pracovníka {{too|z domova, 2 hodiny denně, za 70 000 Kč měsíčně}}. Nepotřebujete praxi ani vzdělání.\n\nPro rychlý nástup nám {{id|pošlete kopii občanského průkazu a číslo účtu}}. Místo držíme jen do zítřka.`,
    clues: {
      h_from: 'Personální agentura by psala z vlastní domény, ne z gmailu.',
      too: 'Příliš dobrá nabídka za nulovou kvalifikaci.',
      id: 'Kopii dokladů a číslo účtu před smlouvou chtějí podvodníci. Zneužijí je k půjčkám nebo k praní peněz.',
    },
    why: 'Nereálná nabídka a žádost o doklady a číslo účtu ještě před smlouvou. Takhle vznikají falešné půjčky na tvé jméno.',
  },

  {
    id: 25,
    type: 'legit',
    phish: false,
    time: '07:20',
    from: { n: 'Tomáš Kratochvíl', a: 'tomas.kratochvil@novaterm.cz' },
    auth: 'pass',
    subj: 'Heslo do VPN vyprší za 7 dní',
    body: `Ahoj,\n\nplatnost hesla do VPN končí za 7 dní. Změnit si ho můžeš kdykoli na přihlašovací stránce:\n\n[[https://sso.novaterm.cz/zmena-hesla|Změnit heslo|ok|btn]]\n\nPřipomínám, že po tobě nikdy nebudeme chtít heslo e-mailem ani telefonicky.\n\nTomáš, IT`,
    clues: {},
    why: 'Připomínka od IT bez nátlaku, z firemní domény, s ověřením a odkazem na sso.novaterm.cz. Nežádá heslo e-mailem. I mail o heslech může být pravý.',
    safe: {
      title: 'Firemní přihlášení – změna hesla',
      text: 'Adresa sso.novaterm.cz patří firmě. Zadejte staré a nové heslo.',
    },
  },
  {
    id: 26,
    type: 'domain',
    phish: true,
    time: '07:44',
    from: { n: 'Pavel Horák', a: 'pavel.horak@novatem.cz' },
    auth: 'none',
    subj: 'Rozpis dovolených na rok 2026',
    body: `Dobrý den,\n\nprosím doplňte do rozpisu své plánované dovolené na příští rok. Rozpis je sdílený v tabulce:\n\n[[https://novatem-intra.cz/dovolena|Otevřít rozpis|lnk|btn]]\n\nDěkuji\nPavel Horák`,
    clues: {
      h_from: 'V „novatem.cz“ chybí písmeno r. Firma je novaterm.cz.',
      lnk: 'Odkaz vede na novatem-intra.cz. Firemní intranet je intra.novaterm.cz.',
    },
    why: 'Žádný nátlak, ale doména odesílatele i odkaz mají o písmeno méně. Nejnebezpečnější podvody vypadají nenápadně.',
    trap: { kind: 'login', brand: 'Novaterm intranet' },
  },
  {
    id: 27,
    type: 'legit',
    phish: false,
    time: '08:00',
    from: { n: 'Bankovnictví Nordia', a: 'info@nordia.cz' },
    auth: 'pass',
    subj: 'Nové obchodní podmínky od 1. 1.',
    body: `Vážená klientko, vážený kliente,\n\nod 1. 1. 2026 se mění naše obchodní podmínky. Nemusíte nic dělat. Úplné znění najdete na našem webu.\n\n[[https://www.nordia.cz/podminky|Znění podmínek|ok]]\n\nVaše banka Nordia`,
    clues: {},
    why: 'Hromadná zpráva z nordia.cz s ověřením a bez požadavku na akci. Obecné oslovení samo podvod neznamená, rozhoduje doména, ověření a žádost.',
    safe: {
      title: 'Nordia – obchodní podmínky',
      text: 'Úplné znění obchodních podmínek platných od 1. 1. 2026.',
    },
  },
  {
    id: 28,
    type: 'attach',
    phish: true,
    time: '08:22',
    from: { n: 'Business Travel', a: 'rezervace@business-travel-cz.com' },
    auth: 'none',
    subj: 'Potvrzení rezervace služební cesty',
    body: `Dobrý den,\n\nv příloze najdete potvrzení rezervace letenky a hotelu. Archiv je zabezpečený, {{pw|heslo: 2025}}.\n\nPokud rezervaci nepoznáváte, {{urg|do 12 hodin}} nás kontaktujte, jinak bude účtován storno poplatek.`,
    att: [{ name: 'rezervace_potvrzeni.zip', size: '1,4 MB' }],
    clues: {
      h_from: 'Neznámá agentura, se kterou firma nespolupracuje.',
      att0: 'ZIP archiv s heslem v textu mailu brání antiviru ve kontrole.',
      pw: 'Heslo uvedené přímo v mailu je trik, jak obejít skenování příloh.',
      urg: 'Rezervace, kterou jsi neobjednal, má vyvolat zvědavost nebo strach.',
    },
    why: 'Nečekané potvrzení rezervace, zabezpečený archiv s heslem v textu a časová lhůta. Typický způsob rozesílání malwaru.',
    trap: { kind: 'macro', brand: 'rezervace_potvrzeni.zip' },
  },
  {
    id: 29,
    type: 'link',
    phish: true,
    time: '08:41',
    from: { n: 'Marie Dvořáková', a: 'marie.dvorakova@novaterm.cz' },
    auth: 'pass',
    subj: 'Re: Faktura 2024-118 (PDF)',
    body: `Ahoj,\n\nposílám znovu, předchozí verze měla chybu. Aktuální faktura je zde:\n\n[[https://cloudora.files-novaterm.top/f/118|faktura_2024-118.pdf|lnk]]\n\nMarie\n\n> Původní zpráva: Faktura 2024-118 (PDF), 24. 10.`,
    clues: {
      lnk: 'Marie běžně posílá přílohu. Tady je odkaz na cizí doménu .top. Její účet byl nejspíš napaden, proto adresa i ověření sedí.',
    },
    why: 'Pravý odesílatel s napadeným účtem. Adresa i ověření sedí, ale odkaz vede na cizí doménu .top místo přílohy. Při pochybnostech Marii zavolej.',
    trap: { kind: 'login', brand: 'Cloudora' },
  },
  {
    id: 30,
    type: 'legit',
    phish: false,
    time: '09:05',
    from: { n: 'Hyper365', a: 'billing@hyper365.com' },
    auth: 'pass',
    subj: 'Vaše předplatné se obnoví 1. 11.',
    body: `Dobrý den,\n\nvaše firemní předplatné Hyper365 Business se 1. 11. automaticky obnoví. Fakturu najdete ve firemním portálu. Pokud nechcete nic měnit, nemusíte dělat nic.\n\n[[https://portal.hyper365.com/billing|Otevřít portál|ok]]\n\nTým Hyper365`,
    clues: {},
    why: 'Oznámení z hyper365.com s ověřením, bez tlaku a bez telefonního čísla. Fakturu najdeš po přihlášení ve firemním portálu.',
    safe: {
      title: 'Hyper365 – fakturace',
      text: 'Plán: Business. Další obnovení 1. 11. Faktura ke stažení.',
    },
  },
];

export const BY_ID: Record<number, Mail> = Object.fromEntries(MAILS.map((mail) => [mail.id, mail]));
export const MAIL_COUNT = MAILS.length;

/* ---------- odznaky ---------- */

export const BADGES: BadgeDef[] = [
  { id: 'first', n: 'První úlovek', d: 'Správně nahlas první phishing.' },
  { id: 'clean', n: 'Bezchybná směna', d: 'Dokonči směnu bez chyby a bez otevření podezřelého odkazu.' },
  { id: 'streak8', n: 'Série 8', d: 'Osm správných rozhodnutí za sebou.' },
  { id: 'detective', n: 'Detektiv', d: 'Najdi všechny stopy u pěti phishingů.' },
  { id: 'nopanic', n: 'Žádná paranoia', d: 'Dokonči hru bez jediného falešného poplachu.' },
  { id: 'nokick', n: 'Nekliknu', d: 'Dokonči hru bez otevření podezřelého odkazu.' },
  { id: 'grad', n: 'Absolvent', d: 'Dokonči všech pět směn.' },
  { id: 'master', n: 'Mistr obrany', d: 'Získej nejvyšší hodnost.' },
  { id: 'collector', n: 'Sběratel', d: 'Odemkni všechny kapitoly příručky.' },
];

export const BADGE_BY_ID: Record<string, BadgeDef> = Object.fromEntries(
  BADGES.map((badge) => [badge.id, badge]),
);

/* ---------- bodování ---------- */

export const SCORING = [
  { label: 'Nahlásit phishing', value: '+500 Kč', tone: 'pos' as const },
  { label: 'Každá správná stopa', value: '+50 Kč', tone: 'pos' as const },
  { label: 'Ponechat pravou zprávu', value: '+200 Kč', tone: 'pos' as const },
  { label: 'Série správných (až ×1,5)', value: 'bonus', tone: 'pos' as const },
  { label: 'Falešný poplach', value: '−300 Kč', tone: 'neg' as const },
  { label: 'Otevřít podezřelý odkaz', value: '−500 Kč', tone: 'neg' as const },
  { label: 'Naletět na phishing', value: '−1 500 Kč a ♥', tone: 'neg' as const },
  { label: 'Zadat údaje na falešné stránce', value: '−2 000 Kč a ♥', tone: 'neg' as const },
  { label: 'Zeptat se IT (2× za směnu)', value: '−250 Kč', tone: 'neg' as const },
];
