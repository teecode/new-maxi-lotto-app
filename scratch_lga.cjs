const fs = require('fs');

const lgaData = [
  { name: "Abia", code: "AB", lgas: ["Aba North","Aba South","Arochukwu","Bende","Ikwuano","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Obi Ngwa","Ohafia","Osisioma Ngwa","Ugwunagbo","Ukwa East","Ukwa West","Umuahia North","Umuahia South","Umu Nneochi"] },
  { name: "Adamawa", code: "AD", lgas: ["Demsa","Fufore","Ganye","Girei","Gombi","Guyuk","Hong","Jada","Lamurde","Madagali","Maiha","Mayo Belwa","Michika","Mubi North","Mubi South","Numan","Shelleng","Song","Toungo","Yola North","Yola South"] },
  { name: "Akwa Ibom", code: "AK", lgas: ["Abak","Eastern Obolo","Eket","Esit Eket","Essien Udim","Etim Ekpo","Etinan","Ibeno","Ibesikpo Asutan","Ibiono-Ibom","Ika","Ikono","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat-Enin","Nsit-Atai","Nsit-Ibom","Nsit-Ubium","Obot Akara","Okobo","Onna","Oron","Oruk Anam","Udung-Uko","Ukanafun","Uruan","Urue-Offong/Oruko","Uyo"] },
  { name: "Anambra", code: "AN", lgas: ["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"] },
  { name: "Bauchi", code: "BAU", lgas: ["Alkaleri","Bauchi","Bogoro","Damban","Darazo","Dass","Gamawa","Ganjuwa","Giade","Itas/Gadau","Jama'are","Katagum","Kirfi","Misau","Ningi","Shira","Tafawa Balewa","Toro","Warji","Zaki"] },
  { name: "Bayelsa", code: "BAY", lgas: ["Brass","Ekeremor","Kolokuma/Opokuma","Nembe","Ogbia","Sagbama","Southern Ijaw","Yenagoa"] },
  { name: "Benue", code: "BEN", lgas: ["Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West","Katsina-Ala","Konshisha","Kwande","Logo","Makurdi","Obi","Ogbadibo","Ohimini","Oju","Okpokwu","Oturkpo","Tarka","Ukum","Ushongo","Vandeikya"] },
  { name: "Borno", code: "BOR", lgas: ["Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala/Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"] },
  { name: "Cross River", code: "CR", lgas: ["Abi","Akamkpa","Akpabuyo","Bakassi","Bekwarra","Biase","Boki","Calabar Municipal","Calabar South","Etung","Ikom","Obanliku","Obubra","Obudu","Odukpani","Ogoja","Yakuur","Yala"] },
  { name: "Delta", code: "DT", lgas: ["Aniocha North","Aniocha South","Bomadi","Burutu","Ethiope East","Ethiope West","Ika North East","Ika South","Isoko North","Isoko South","Ndokwa East","Ndokwa West","Okpe","Oshimili North","Oshimili South","Patani","Sapele","Udu","Ughelli North","Ughelli South","Ukwuani","Uvwie","Warri North","Warri South","Warri South West"] },
  { name: "Ebonyi", code: "EB", lgas: ["Abakaliki","Afikpo North","Afikpo South","Ebonyi","Ezza North","Ezza South","Ikwo","Ishielu","Ivo","Izzi","Ohaozara","Ohaukwu","Onicha"] },
  { name: "Edo", code: "ED", lgas: ["Akoko-Edo","Egor","Esan Central","Esan North East","Esan South East","Esan West","Etsako Central","Etsako East","Etsako West","Igueben","Ikpoba-Okha","Oredo","Orhionmwon","Ovia North East","Ovia South West","Owan East","Owan West","Uhunmwonde"] },
  { name: "Ekiti", code: "EK", lgas: ["Ado Ekiti","Efon","Ekiti East","Ekiti South West","Ekiti West","Emure","Gbonyin","Ido/Osi","Ijero","Ikere","Ikole","Ilejemeje","Irepodun/Ifelodun","Ise/Orun","Moba","Oye"] },
  { name: "Enugu", code: "EN", lgas: ["Aninri","Awgu","Enugu East","Enugu North","Enugu South","Ezeagu","Igbo Etiti","Igbo Eze North","Igbo Eze South","Isi Uzo","Nkanu East","Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo Uwani"] },
  { name: "FCT", code: "ABJ", lgas: ["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"] },
  { name: "Gombe", code: "GOM", lgas: ["Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo","Kwami","Nafada","Shongom","Yamaltu/Deba"] },
  { name: "Imo", code: "IMO", lgas: ["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte Mbaise","Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano","Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele","Obowo","Oguta","Ohaji/Egbema","Okigwe","Orlu","Orsu","Oru East","Oru West","Owerri Municipal","Owerri North","Owerri West","Unuimo"] },
  { name: "Jigawa", code: "JIG", lgas: ["Auyo","Babura","Birnin Kudu","Birniwa","Buji","Dutse","Gagarawa","Garki","Gumel","Guri","Gwaram","Gwiwa","Hadejia","Jahun","Kafin Hausa","Kaugama","Kazaure","Kiri Kasama","Kiyawa","Maigatari","Malam Madori","Miga","Ringim","Roni","Sule Tankarkar","Taura","Yankwashi"] },
  { name: "Kaduna", code: "KAD", lgas: ["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"] },
  { name: "Kano", code: "KAN", lgas: ["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"] },
  { name: "Katsina", code: "KAT", lgas: ["Bakori","Batagarawa","Batsari","Baure","Bindawa","Charanchi","Dan Musa","Dandume","Danja","Daura","Dutsi","Dutsin-Ma","Faskari","Funtua","Ingawa","Jibia","Kafur","Kaita","Kankara","Kankia","Katsina","Kurfi","Kusada","Mai'Adua","Malumfashi","Mani","Mashi","Matazu","Musawa","Rimi","Sabuwa","Safana","Sandamu","Zango"] },
  { name: "Kebbi", code: "KEB", lgas: ["Aleiro","Arewa Dandi","Argungu","Augie","Bagudo","Birnin Kebbi","Bunza","Dandi","Fakai","Gwandu","Jega","Kalgo","Koko/Besse","Maiyama","Ngaski","Shanga","Suru","Wasagu/Danko","Yauri","Zuru"] },
  { name: "Kogi", code: "KOG", lgas: ["Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah","Igalamela Odolu","Ijumu","Kabba/Bunu","Kogi","Lokoja","Mopa Muro","Ofu","Ogori/Magongo","Okehi","Okene","Olamaboro","Omala","Yagba East","Yagba West"] },
  { name: "Kwara", code: "KW", lgas: ["Asa","Baruten","Edu","Ekiti","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"] },
  { name: "Lagos", code: "LA", lgas: ["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Epe","Eti Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"] },
  { name: "Nasarawa", code: "NAS", lgas: ["Akwanga","Awe","Doma","Karu","Keana","Keffi","Kokona","Lafia","Nasarawa","Nasarawa Egon","Obi","Toto","Wamba"] },
  { name: "Niger", code: "NIG", lgas: ["Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edati","Gbako","Gurara","Katcha","Kontagora","Lapai","Lavun","Magama","Mariga","Mashegu","Mokwa","Moya","Paikoro","Rafi","Rijau","Shiroro","Suleja","Tafa","Wushishi"] },
  { name: "Ogun", code: "OG", lgas: ["Abeokuta North","Abeokuta South","Ado-Odo/Ota","Egbado North","Egbado South","Ewekoro","Ifo","Ijebu East","Ijebu North","Ijebu North East","Ijebu Ode","Ikenne","Imeko Afon","Ipokia","Obafemi Owode","Odeda","Odogbolu","Ogun Waterside","Remo North","Shagamu"] },
  { name: "Ondo", code: "OD", lgas: ["Akoko North East","Akoko North West","Akoko South Akure East","Akoko South West","Akure North","Akure South","Ese Odo","Idanre","Ifedore","Ilaje","Ile Oluji/Okeigbo","Irele","Odigbo","Okitipupa","Ondo East","Ondo West","Ose","Owo"] },
  { name: "Osun", code: "OS", lgas: ["Aiyedaade","Aiyedire","Atakunmosa East","Atakunmosa West","Boluwaduro","Boripe","Ede North","Ede South","Egbedore","Ejigbo","Ife Central","Ife East","Ife North","Ife South","Ifedayo","Ifelodun","Ila","Ilesa East","Ilesa West","Irepodun","Irewole","Isokan","Iwo","Obokun","Odo Otin","Ola Oluwa","Olorunda","Oriade","Orolu","Osogbo"] },
  { name: "Oyo", code: "OY", lgas: ["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North East","Ibadan North West","Ibadan South East","Ibadan South West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West","Saki East","Saki West","Surulere"] },
  { name: "Plateau", code: "PL", lgas: ["Barkin Ladi","Bassa","Bokkos","Jos East","Jos North","Jos South","Kanam","Kanke","Langtang North","Langtang South","Mangu","Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase"] },
  { name: "Rivers", code: "RS", lgas: ["Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Andoni","Asari-Toru","Bonny","Degema","Eleme","Emohua","Etche","Gokana","Ikwerre","Khana","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo","Okrika","Omuma","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai"] },
  { name: "Sokoto", code: "SOK", lgas: ["Binji","Bodinga","Dange Shuni","Gada","Goronyo","Gudu","Gwadabawa","Illela","Isa","Kebbe","Kware","Rabah","Sabon Birni","Shagari","Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza","Tureta","Wamako","Wurno","Yabo"] },
  { name: "Taraba", code: "TAR", lgas: ["Ardo Kola","Bali","Donga","Gashaka","Gassol","Ibi","Jalingo","Karim Lamido","Kumi","Lau","Sardauna","Takum","Ussa","Wukari","Yorro","Zing"] },
  { name: "Yobe", code: "YOB", lgas: ["Bade","Bursari","Damaturu","Fika","Fune","Geidam","Gujba","Gulani","Jakusko","Karasuwa","Machina","Nangere","Nguru","Potiskum","Tarmuwa","Yunusari","Yusufari"] },
  { name: "Zamfara", code: "ZA", lgas: ["Anka","Bakura","Birnin Magaji/Kiyaw","Bukkuyum","Bungudu","Gummi","Gusau","Kaura Namoda","Maradun","Maru","Shinkafi","Talata Mafara","Tsafe","Zurmi"] },
  { name: "Accra", code: "ACR", lgas: ["Accra Metropolis"] }
];

const branches = [
  { Id: 1, Name: "Abia", Code: "AB", State: 1 },
  { Id: 2, Name: "Adamawa", Code: "AD", State: 2 },
  { Id: 3, Name: "Akwa Ibom", Code: "AK", State: 3 },
  { Id: 4, Name: "Anambra", Code: "AN", State: 4 },
  { Id: 5, Name: "Bauchi", Code: "BAU", State: 5 },
  { Id: 6, Name: "Bayelsa", Code: "BAY", State: 6 },
  { Id: 7, Name: "Benue", Code: "BEN", State: 7 },
  { Id: 8, Name: "Borno", Code: "BOR", State: 8 },
  { Id: 9, Name: "Cross River", Code: "CR", State: 9 },
  { Id: 10, Name: "Delta", Code: "DT", State: 10 },
  { Id: 11, Name: "Ebonyi", Code: "EB", State: 11 },
  { Id: 12, Name: "Edo", Code: "ED", State: 12 },
  { Id: 13, Name: "Ekiti", Code: "EK", State: 13 },
  { Id: 14, Name: "Enugu", Code: "EN", State: 14 },
  { Id: 15, Name: "FCT", Code: "ABJ", State: 15 },
  { Id: 16, Name: "Gombe", Code: "GOM", State: 16 },
  { Id: 17, Name: "Imo", Code: "IMO", State: 17 },
  { Id: 18, Name: "Jigawa", Code: "JIG", State: 18 },
  { Id: 19, Name: "Kaduna", Code: "KAD", State: 19 },
  { Id: 20, Name: "Kano", Code: "KAN", State: 20 },
  { Id: 21, Name: "Katsina", Code: "KAT", State: 21 },
  { Id: 22, Name: "Kebbi", Code: "KEB", State: 22 },
  { Id: 23, Name: "Kogi", Code: "KOG", State: 23 },
  { Id: 24, Name: "Kwara", Code: "KW", State: 24 },
  { Id: 25, Name: "Lagos", Code: "LA", State: 25 },
  { Id: 26, Name: "Nasarawa", Code: "NAS", State: 26 },
  { Id: 27, Name: "Niger", Code: "NIG", State: 27 },
  { Id: 28, Name: "Ogun", Code: "OG", State: 28 },
  { Id: 29, Name: "Ondo", Code: "OD", State: 29 },
  { Id: 30, Name: "Osun", Code: "OS", State: 30 },
  { Id: 31, Name: "Oyo", Code: "OY", State: 31 },
  { Id: 32, Name: "Plateau", Code: "PL", State: 32 },
  { Id: 33, Name: "Rivers", Code: "RS", State: 33 },
  { Id: 34, Name: "Sokoto", Code: "SOK", State: 34 },
  { Id: 35, Name: "Taraba", Code: "TAR", State: 35 },
  { Id: 36, Name: "Yobe", Code: "YOB", State: 36 },
  { Id: 37, Name: "Zamfara", Code: "ZA", State: 37 },
  { Id: 38, Name: "Accra", Code: "ACR", State: 38 }
];

let csharpLines = [];
let areaId = 1;

for (let branch of branches) {
  let stateData = lgaData.find(x => x.name === branch.Name);
  if (stateData) {
    let lgaCount = 1;
    for (let lga of stateData.lgas) {
      let areaCode = `${branch.Code}-${lgaCount.toString().padStart(3, '0')}`;
      csharpLines.push(`                new Area { Id = ${areaId}, Name = "${lga.replace(/"/g, '\\"')}", Code = "${areaCode}", Branch = ${branch.Id} },`);
      areaId++;
      lgaCount++;
    }
  }
}

fs.writeFileSync('areas_seed.txt', csharpLines.join('\n'));
console.log('Areas written to areas_seed.txt');
