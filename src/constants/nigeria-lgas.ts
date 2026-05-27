export interface NigeriaState {
  code: string;
  name: string;
  active: boolean; // false = not yet licensed, greyed out in UI
  lgas: string[];
}

/** Only Delta is active (licensed). All others are listed but disabled. */
export const NIGERIA_STATES: NigeriaState[] = [
  // ============================================================
  // ACTIVE – Delta (licensed)
  // ============================================================
  {
    code: "DT",
    name: "Delta",
    active: true,
    lgas: [
      "Aniocha North",
      "Aniocha South",
      "Bomadi",
      "Burutu",
      "Ethiope East",
      "Ethiope West",
      "Ika North East",
      "Ika South",
      "Isoko North",
      "Isoko South",
      "Ndokwa East",
      "Ndokwa West",
      "Okpe",
      "Oshimili North",
      "Oshimili South",
      "Patani",
      "Sapele",
      "Udu",
      "Ughelli North",
      "Ughelli South",
      "Ukwuani",
      "Uvwie",
      "Warri North",
      "Warri South",
      "Warri South West",
    ],
  },

  // ============================================================
  // INACTIVE – remaining 35 states + FCT (commented-out / disabled)
  // ============================================================
  /* {
    code: "AB",
    name: "Abia",
    active: false,
    lgas: [
      "Aba North","Aba South","Arochukwu","Bende","Ikwuano",
      "Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Obi Ngwa",
      "Ohafia","Osisioma Ngwa","Ugwunagbo","Ukwa East","Ukwa West",
      "Umuahia North","Umuahia South","Umu Nneochi",
    ],
  },
  {
    code: "AD",
    name: "Adamawa",
    active: false,
    lgas: [
      "Demsa","Fufore","Ganye","Girei","Gombi","Guyuk","Hong","Jada",
      "Lamurde","Madagali","Maiha","Mayo Belwa","Michika","Mubi North",
      "Mubi South","Numan","Shelleng","Song","Toungo","Yola North","Yola South",
    ],
  },
  {
    code: "AK",
    name: "Akwa Ibom",
    active: false,
    lgas: [
      "Abak","Eastern Obolo","Eket","Esit Eket","Essien Udim","Etim Ekpo",
      "Etinan","Ibeno","Ibesikpo Asutan","Ibiono-Ibom","Ika","Ikono",
      "Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat-Enin","Nsit-Atai",
      "Nsit-Ibom","Nsit-Ubium","Obot Akara","Okobo","Onna","Oron",
      "Oruk Anam","Udung-Uko","Ukanafun","Uruan","Urue-Offong/Oruko","Uyo",
    ],
  },
  {
    code: "AN",
    name: "Anambra",
    active: false,
    lgas: [
      "Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South",
      "Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South",
      "Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North",
      "Onitsha South","Orumba North","Orumba South","Oyi",
    ],
  },
  {
    code: "BA",
    name: "Bauchi",
    active: false,
    lgas: [
      "Alkaleri","Bauchi","Bogoro","Damban","Darazo","Dass","Gamawa",
      "Ganjuwa","Giade","Itas/Gadau","Jama'are","Katagum","Kirfi",
      "Misau","Ningi","Shira","Tafawa Balewa","Toro","Warji","Zaki",
    ],
  },
  {
    code: "BY",
    name: "Bayelsa",
    active: false,
    lgas: [
      "Brass","Ekeremor","Kolokuma/Opokuma","Nembe","Ogbia","Sagbama",
      "Southern Ijaw","Yenagoa",
    ],
  },
  {
    code: "BE",
    name: "Benue",
    active: false,
    lgas: [
      "Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West",
      "Katsina-Ala","Konshisha","Kwande","Logo","Makurdi","Obi","Ogbadibo",
      "Ohimini","Oju","Okpokwu","Oturkpo","Tarka","Ukum","Ushongo","Vandeikya",
    ],
  },
  {
    code: "BO",
    name: "Borno",
    active: false,
    lgas: [
      "Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa",
      "Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala/Balge","Konduga",
      "Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar",
      "Monguno","Ngala","Nganzai","Shani",
    ],
  },
  {
    code: "CR",
    name: "Cross River",
    active: false,
    lgas: [
      "Abi","Akamkpa","Akpabuyo","Bakassi","Bekwarra","Biase","Boki",
      "Calabar Municipal","Calabar South","Etung","Ikom","Obanliku",
      "Obubra","Obudu","Odukpani","Ogoja","Yakuur","Yala",
    ],
  },
  {
    code: "ED",
    name: "Edo",
    active: false,
    lgas: [
      "Akoko-Edo","Egor","Esan Central","Esan North East","Esan South East",
      "Esan West","Etsako Central","Etsako East","Etsako West","Igueben",
      "Ikpoba-Okha","Oredo","Orhionmwon","Ovia North East","Ovia South West",
      "Owan East","Owan West","Uhunmwonde",
    ],
  },
  {
    code: "EK",
    name: "Ekiti",
    active: false,
    lgas: [
      "Ado Ekiti","Efon","Ekiti East","Ekiti South West","Ekiti West",
      "Emure","Gbonyin","Ido/Osi","Ijero","Ikere","Ikole","Ilejemeje",
      "Irepodun/Ifelodun","Ise/Orun","Moba","Oye",
    ],
  },
  {
    code: "EN",
    name: "Enugu",
    active: false,
    lgas: [
      "Aninri","Awgu","Enugu East","Enugu North","Enugu South","Ezeagu",
      "Igbo Etiti","Igbo Eze North","Igbo Eze South","Isi Uzo","Nkanu East",
      "Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo Uwani",
    ],
  },
  {
    code: "GO",
    name: "Gombe",
    active: false,
    lgas: [
      "Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo",
      "Kwami","Nafada","Shongom","Yamaltu/Deba",
    ],
  },
  {
    code: "IM",
    name: "Imo",
    active: false,
    lgas: [
      "Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte Mbaise",
      "Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano",
      "Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele",
      "Obowo","Oguta","Ohaji/Egbema","Okigwe","Orlu","Orsu","Oru East",
      "Oru West","Owerri Municipal","Owerri North","Owerri West","Unuimo",
    ],
  },
  {
    code: "JI",
    name: "Jigawa",
    active: false,
    lgas: [
      "Auyo","Babura","Birnin Kudu","Birniwa","Buji","Dutse","Gagarawa",
      "Garki","Gumel","Guri","Gwaram","Gwiwa","Hadejia","Jahun","Kafin Hausa",
      "Kaugama","Kazaure","Kiri Kasama","Kiyawa","Maigatari","Malam Madori",
      "Miga","Ringim","Roni","Sule Tankarkar","Taura","Yankwashi",
    ],
  },
  {
    code: "KD",
    name: "Kaduna",
    active: false,
    lgas: [
      "Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a",
      "Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura",
      "Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga",
      "Soba","Zangon Kataf","Zaria",
    ],
  },
  {
    code: "KN",
    name: "Kano",
    active: false,
    lgas: [
      "Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta",
      "Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko",
      "Garun Mallam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal",
      "Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda",
      "Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila",
      "Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil",
    ],
  },
  {
    code: "KT",
    name: "Katsina",
    active: false,
    lgas: [
      "Bakori","Batagarawa","Batsari","Baure","Bindawa","Charanchi","Dan Musa",
      "Dandume","Danja","Daura","Dutsi","Dutsin-Ma","Faskari","Funtua",
      "Ingawa","Jibia","Kafur","Kaita","Kankara","Kankia","Katsina",
      "Kurfi","Kusada","Mai'Adua","Malumfashi","Mani","Mashi","Matazu",
      "Musawa","Rimi","Sabuwa","Safana","Sandamu","Zango",
    ],
  },
  {
    code: "KB",
    name: "Kebbi",
    active: false,
    lgas: [
      "Aleiro","Arewa Dandi","Argungu","Augie","Bagudo","Birnin Kebbi",
      "Bunza","Dandi","Fakai","Gwandu","Jega","Kalgo","Koko/Besse","Maiyama",
      "Ngaski","Shanga","Suru","Wasagu/Danko","Yauri","Zuru",
    ],
  },
  {
    code: "KO",
    name: "Kogi",
    active: false,
    lgas: [
      "Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah",
      "Igalamela Odolu","Ijumu","Kabba/Bunu","Kogi","Lokoja","Mopa Muro",
      "Ofu","Ogori/Magongo","Okehi","Okene","Olamaboro","Omala",
      "Yagba East","Yagba West",
    ],
  },
  {
    code: "KW",
    name: "Kwara",
    active: false,
    lgas: [
      "Asa","Baruten","Edu","Ekiti","Ifelodun","Ilorin East","Ilorin South",
      "Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero",
      "Oyun","Pategi",
    ],
  },
  {
    code: "LA",
    name: "Lagos",
    active: false,
    lgas: [
      "Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa",
      "Badagry","Epe","Eti Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja",
      "Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin",
      "Ojo","Oshodi-Isolo","Shomolu","Surulere",
    ],
  },
  {
    code: "NA",
    name: "Nasarawa",
    active: false,
    lgas: [
      "Akwanga","Awe","Doma","Karu","Keana","Keffi","Kokona","Lafia",
      "Nasarawa","Nasarawa Egon","Obi","Toto","Wamba",
    ],
  },
  {
    code: "NI",
    name: "Niger",
    active: false,
    lgas: [
      "Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edati","Gbako",
      "Gurara","Katcha","Kontagora","Lapai","Lavun","Magama","Mariga",
      "Mashegu","Mokwa","Moya","Paikoro","Rafi","Rijau","Shiroro","Suleja",
      "Tafa","Wushishi",
    ],
  },
  {
    code: "OG",
    name: "Ogun",
    active: false,
    lgas: [
      "Abeokuta North","Abeokuta South","Ado-Odo/Ota","Egbado North",
      "Egbado South","Ewekoro","Ifo","Ijebu East","Ijebu North","Ijebu North East",
      "Ijebu Ode","Ikenne","Imeko Afon","Ipokia","Obafemi Owode","Odeda",
      "Odogbolu","Ogun Waterside","Remo North","Shagamu",
    ],
  },
  {
    code: "ON",
    name: "Ondo",
    active: false,
    lgas: [
      "Akoko North East","Akoko North West","Akoko South Akure East",
      "Akoko South West","Akure North","Akure South","Ese Odo",
      "Idanre","Ifedore","Ilaje","Ile Oluji/Okeigbo","Irele",
      "Odigbo","Okitipupa","Ondo East","Ondo West","Ose","Owo",
    ],
  },
  {
    code: "OS",
    name: "Osun",
    active: false,
    lgas: [
      "Aiyedaade","Aiyedire","Atakunmosa East","Atakunmosa West",
      "Boluwaduro","Boripe","Ede North","Ede South","Egbedore","Ejigbo",
      "Ife Central","Ife East","Ife North","Ife South","Ifedayo",
      "Ifelodun","Ila","Ilesa East","Ilesa West","Irepodun","Irewole",
      "Isokan","Iwo","Obokun","Odo Otin","Ola Oluwa","Olorunda",
      "Oriade","Orolu","Osogbo",
    ],
  },
  {
    code: "OY",
    name: "Oyo",
    active: false,
    lgas: [
      "Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North",
      "Ibadan North East","Ibadan North West","Ibadan South East",
      "Ibadan South West","Ibarapa Central","Ibarapa East","Ibarapa North",
      "Ido","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu",
      "Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo",
      "Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West",
      "Saki East","Saki West","Surulere",
    ],
  },
  {
    code: "PL",
    name: "Plateau",
    active: false,
    lgas: [
      "Barkin Ladi","Bassa","Bokkos","Jos East","Jos North","Jos South",
      "Kanam","Kanke","Langtang North","Langtang South","Mangu",
      "Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase",
    ],
  },
  {
    code: "RI",
    name: "Rivers",
    active: false,
    lgas: [
      "Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Andoni",
      "Asari-Toru","Bonny","Degema","Eleme","Emohua","Etche","Gokana",
      "Ikwerre","Khana","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo",
      "Okrika","Omuma","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai",
    ],
  },
  {
    code: "SO",
    name: "Sokoto",
    active: false,
    lgas: [
      "Binji","Bodinga","Dange Shuni","Gada","Goronyo","Gudu","Gwadabawa",
      "Illela","Isa","Kebbe","Kware","Rabah","Sabon Birni","Shagari",
      "Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza",
      "Tureta","Wamako","Wurno","Yabo",
    ],
  },
  {
    code: "TA",
    name: "Taraba",
    active: false,
    lgas: [
      "Ardo Kola","Bali","Donga","Gashaka","Gassol","Ibi","Jalingo",
      "Karim Lamido","Kumi","Lau","Sardauna","Takum","Ussa","Wukari",
      "Yorro","Zing",
    ],
  },
  {
    code: "YO",
    name: "Yobe",
    active: false,
    lgas: [
      "Bade","Bursari","Damaturu","Fika","Fune","Geidam","Gujba",
      "Gulani","Jakusko","Karasuwa","Machina","Nangere","Nguru",
      "Potiskum","Tarmuwa","Yunusari","Yusufari",
    ],
  },
  {
    code: "ZA",
    name: "Zamfara",
    active: false,
    lgas: [
      "Anka","Bakura","Birnin Magaji/Kiyaw","Bukkuyum","Bungudu",
      "Gummi","Gusau","Kaura Namoda","Maradun","Maru","Shinkafi",
      "Talata Mafara","Tsafe","Zurmi",
    ],
  },
  {
    code: "FC",
    name: "FCT - Abuja",
    active: false,
    lgas: [
      "Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council",
    ],
  }, */
];

export function getLgasByStateCode(stateCode: string): string[] {
  return NIGERIA_STATES.find((s) => s.code === stateCode)?.lgas ?? [];
}

export function getActiveStates(): NigeriaState[] {
  return NIGERIA_STATES.filter((s) => s.active);
}

/** Returns all states. Inactive ones should be shown as disabled options. */
export function getAllStates(): NigeriaState[] {
  return NIGERIA_STATES;
}
