import { Category, ChannelItem, Program } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "all", title: "ทั้งหมด" },
  { id: "favorite", title: "ชื่นชอบ" },
  { id: "livedigital", title: "ดิจิตอลทีวี" },
  { id: "livesport", title: "กีฬา" },
  { id: "liveentertain", title: "บันเทิง" },
  { id: "livenews", title: "ข่าว" },
  { id: "livecartoon", title: "การ์ตูน" },
  { id: "livesara", title: "สาระความรู้" },
  { id: "livethai", title: "ไทย" },
  { id: "liveinter", title: "ต่างประเทศ" }
];

export function getStreamUrl(cid: string): string {
  return `https://s.okwin321.ai/ngz168/${cid}/playlist.m3u8`;
}

export function getProxyStreamUrl(streamUrl: string): string {
  return `/api/proxy?url=${encodeURIComponent(streamUrl)}`;
}

// Initial Raw Channel Data as supplied by the user
export const RAW_CHANNELS_DATA: Array<{
  tid: string;
  data: Array<{
    favorite: boolean;
    cid: string;
    remotetv: string;
    title: string;
    logo: string;
    id: string;
  }>;
}> = [
  {"tid":"279879","data":[{"favorite":false,"cid":"279879","remotetv":"","title":"Asian Games 17","logo":"https://www.fileinw.com/postor/1789736269_eddd1782d9038eccd4d0.jpg","id":"1880363"}]},
  {"tid":"279880","data":[{"favorite":false,"cid":"279880","remotetv":"","title":"Asian Games 16","logo":"https://www.fileinw.com/postor/1789736293_f7fa4b9bced0c49e1b12.jpg","id":"1880362"}]},
  {"tid":"279881","data":[{"favorite":false,"cid":"279881","remotetv":"","title":"Asian Games 15","logo":"https://www.fileinw.com/postor/1789736302_b7627184a77c9de97675.jpg","id":"1880361"}]},
  {"tid":"279882","data":[{"favorite":false,"cid":"279882","remotetv":"","title":"Asian Games 14","logo":"https://www.fileinw.com/postor/1789736312_8bd276e436f0819efe38.jpg","id":"1880360"}]},
  {"tid":"279883","data":[{"favorite":false,"cid":"279883","remotetv":"","title":"Asian Games 13","logo":"https://www.fileinw.com/postor/1789736320_b5c49aa83a58f674a77e.jpg","id":"1880359"}]},
  {"tid":"279884","data":[{"favorite":false,"cid":"279884","remotetv":"","title":"Asian Games 12","logo":"https://www.fileinw.com/postor/1789736329_9cba9949aa8847150b13.jpg","id":"1880358"}]},
  {"tid":"279885","data":[{"favorite":false,"cid":"279885","remotetv":"","title":"Asian Games 11","logo":"https://www.fileinw.com/postor/1789736337_bfce1b7999ed63202e9c.jpg","id":"1880357"}]},
  {"tid":"279886","data":[{"favorite":false,"cid":"279886","remotetv":"","title":"Asian Games 10","logo":"https://www.fileinw.com/postor/1789736347_d89c4dde6e1a1411fbac.jpg","id":"1880356"}]},
  {"tid":"279887","data":[{"favorite":false,"cid":"279887","remotetv":"","title":"Asian Games 9","logo":"https://www.fileinw.com/postor/1789736370_f266422f9e56ded1d22e.jpg","id":"1880355"}]},
  {"tid":"279888","data":[{"favorite":false,"cid":"279888","remotetv":"","title":"Asian Games 8","logo":"https://www.fileinw.com/postor/1789736377_1be1cd3e17618757fcff.jpg","id":"1880354"}]},
  {"tid":"279889","data":[{"favorite":false,"cid":"279889","remotetv":"","title":"Asian Games 7","logo":"https://www.fileinw.com/postor/1789736385_71cbb6e9dd8dfd2ba280.jpg","id":"1880353"}]},
  {"tid":"279890","data":[{"favorite":false,"cid":"279890","remotetv":"","title":"Asian Games 6","logo":"https://www.fileinw.com/postor/1789736400_090bba4bdb37c15b62a3.jpg","id":"1880352"}]},
  {"tid":"279891","data":[{"favorite":false,"cid":"279891","remotetv":"","title":"Asian Games 5","logo":"https://www.fileinw.com/postor/1789736407_d367e9a4824614ec0a88.jpg","id":"1880351"}]},
  {"tid":"279892","data":[{"favorite":false,"cid":"279892","remotetv":"","title":"Asian Games 4","logo":"https://www.fileinw.com/postor/1789736414_8b44e9a7fc633102c2a2.jpg","id":"1880350"}]},
  {"tid":"279893","data":[{"favorite":false,"cid":"279893","remotetv":"","title":"Asian Games 3","logo":"https://www.fileinw.com/postor/1789736421_db777807eb50f039207d.jpg","id":"1880349"}]},
  {"tid":"279894","data":[{"favorite":false,"cid":"279894","remotetv":"","title":"Asian Games 2","logo":"https://www.fileinw.com/postor/1789736428_7a7c37453a540082c714.jpg","id":"1880348"}]},
  {"tid":"279895","data":[{"favorite":false,"cid":"279895","remotetv":"","title":"Asian Games 1","logo":"https://www.fileinw.com/postor/1789736435_170c731ef680e44c9038.jpg","id":"1880347"}]},
  {"tid":"1397","data":[{"favorite":false,"cid":"1397","remotetv":"","title":"Play Sports 53","logo":"https://www.fileinw.com/postor/1789366344_2f839aed4cd2e84303e9.jpg","id":"1878475"}]},
  {"tid":"1398","data":[{"favorite":false,"cid":"1398","remotetv":"","title":"Play Sports 52","logo":"https://www.fileinw.com/postor/1789366370_c6d2d1118a7b83d8e410.jpg","id":"70208"}]},
  {"tid":"1404","data":[{"favorite":false,"cid":"1404","remotetv":"","title":"Play Sports 94","logo":"https://www.fileinw.com/postor/1787897765_2301d3a1c48db9cd24fa.jpg","id":"587678"}]},
  {"tid":"1416","data":[{"favorite":false,"cid":"1416","remotetv":"","title":"Play Sports 93","logo":"https://www.fileinw.com/postor/1787897744_6d5a5645e143e8c03ab1.jpg","id":"1061327"}]},
  {"tid":"1418","data":[{"favorite":false,"cid":"1418","remotetv":"","title":"Play Sports 92","logo":"https://www.fileinw.com/postor/1787897713_d786f34d4bf4f1a7fe2f.jpg","id":"1285566"}]},
  {"tid":"1431","data":[{"favorite":false,"cid":"1431","remotetv":"","title":"Play Sports 91","logo":"https://www.fileinw.com/postor/1787897658_304635d5ec20f1c379f6.jpg","id":"1763097"}]},
  {"tid":"1436","data":[{"favorite":false,"cid":"1436","remotetv":"","title":"Play Sports 90","logo":"https://www.fileinw.com/postor/1783060141_3746d2c8ad097ab2cda7.jpg","id":"6357"}]},
  {"tid":"1437","data":[{"favorite":false,"cid":"1437","remotetv":"","title":"Play Sports 65","logo":"https://www.fileinw.com/postor/1785431825_9db26329c51e577c3f8e.jpg","id":"1849703"}]},
  {"tid":"1438","data":[{"favorite":false,"cid":"1438","remotetv":"","title":"Play Sports 64","logo":"https://www.fileinw.com/postor/1779282910_49f28e4c00b99de027bd.jpg","id":"1835778"}]},
  {"tid":"1439","data":[{"favorite":false,"cid":"1439","remotetv":"","title":"Play Sports 48","logo":"https://www.fileinw.com/postor/1779282671_bcc13f00c71f77102410.jpg","id":"1835777"}]},
  {"tid":"1440","data":[{"favorite":false,"cid":"1440","remotetv":"","title":"Play Sports 58","logo":"https://www.fileinw.com/postor/1778400974_1b18c7fe03a32dcaedc6.jpg","id":"1832245"}]},
  {"tid":"1441","data":[{"favorite":false,"cid":"1441","remotetv":"","title":"Play Sports 57","logo":"https://www.fileinw.com/postor/1778400897_898d3c6c29c32dafd506.jpg","id":"1832244"}]},
  {"tid":"1442","data":[{"favorite":false,"cid":"1442","remotetv":"","title":"Play Sports 96","logo":"https://www.fileinw.com/postor/1786099556_f74f1171c59f023ac99b.jpg","id":"1864834"}]},
  {"tid":"1443","data":[{"favorite":false,"cid":"1443","remotetv":"","title":"Play Sports 95","logo":"https://www.fileinw.com/postor/1786099540_a4972afcfa183469c4db.jpg","id":"1864833"}]},
  {"tid":"1444","data":[{"favorite":false,"cid":"1444","remotetv":"","title":"Play Sports 51","logo":"https://www.fileinw.com/postor/1786010109_35b356c8df7a9181c834.jpg","id":"1864518"}]},
  {"tid":"1445","data":[{"favorite":false,"cid":"1445","remotetv":"","title":"Play Sports 67","logo":"https://www.fileinw.com/postor/1785580753_771de2940f020d84c8c1.jpg","id":"1862610"}]},
  {"tid":"7347","data":[{"favorite":false,"cid":"7347","remotetv":"1","title":"ช่อง 5 HD","logo":"https://www.fileinw.com/postor/20240418185850ch5hd.jpg","id":"524461"}]},
  {"tid":"1450","data":[{"favorite":false,"cid":"1450","remotetv":"2","title":"NBT Channel","logo":"https://www.fileinw.com/postor/20240418191323nbthd.jpg","id":"646016"}]},
  {"tid":"1698","data":[{"favorite":false,"cid":"1698","remotetv":"3","title":"Thai PBS","logo":"https://www.fileinw.com/postor/20240418191223tpbshd.jpg","id":"646012"}]},
  {"tid":"435","data":[{"favorite":false,"cid":"435","remotetv":"7","title":"T Sport Channel","logo":"https://www.fileinw.com/postor/20240418193731tsports7.jpg","id":"171505"}]},
  {"tid":"430","data":[{"favorite":false,"cid":"430","remotetv":"10","title":"TPTV","logo":"https://www.fileinw.com/postor/20240418191939tptv.jpg","id":"315698"}]},
  {"tid":"6345","data":[{"favorite":false,"cid":"6345","remotetv":"16","title":"TNN 16","logo":"https://www.fileinw.com/postor/20240418190014TNN16.jpg","id":"645992"}]},
  {"tid":"1730","data":[{"favorite":false,"cid":"1730","remotetv":"18","title":"Top News","logo":"https://www.fileinw.com/postor/20240418191206Topnews.jpg","id":"781725"}]},
  {"tid":"6339","data":[{"favorite":false,"cid":"6339","remotetv":"22","title":"Nation","logo":"https://www.fileinw.com/postor/20240418192308Nation1.jpg","id":"645988"}]},
  {"tid":"6335","data":[{"favorite":false,"cid":"6335","remotetv":"23","title":"Workpoint TV","logo":"https://www.fileinw.com/postor/20240418190941Workpoint.jpg","id":"646000"}]},
  {"tid":"6337","data":[{"favorite":false,"cid":"6337","remotetv":"24","title":"True4U","logo":"https://www.fileinw.com/postor/20240418190115True4u.jpg","id":"645996"}]},
  {"tid":"6336","data":[{"favorite":false,"cid":"6336","remotetv":"25","title":"GMM 25","logo":"https://www.fileinw.com/postor/20240418190128gmmchannel.jpg","id":"530607"}]},
  {"tid":"497","data":[{"favorite":false,"cid":"497","remotetv":"27","title":"CH 8","logo":"https://www.fileinw.com/postor/20240418191335ch8.jpg","id":"646018"}]},
  {"tid":"6333","data":[{"favorite":false,"cid":"6333","remotetv":"29","title":"Monomax Sports TV","logo":"https://www.fileinw.com/postor/1781753351_e9793c2b453fdd8d7589.jpg","id":"646001"}]},
  {"tid":"6332","data":[{"favorite":false,"cid":"6332","remotetv":"30","title":"MCOT HD","logo":"https://www.fileinw.com/postor/20240418191042mcothd.jpg","id":"239094"}]},
  {"tid":"461","data":[{"favorite":false,"cid":"461","remotetv":"31","title":"One Channel","logo":"https://www.fileinw.com/postor/20240418191350onehd.jpg","id":"646021"}]},
  {"tid":"6330","data":[{"favorite":false,"cid":"6330","remotetv":"32","title":"ไทยรัฐ TV HD","logo":"https://www.fileinw.com/postor/20241201222710thairahttvhd2.jpg","id":"239096"}]},
  {"tid":"7348","data":[{"favorite":false,"cid":"7348","remotetv":"33","title":"ช่อง 3 HD","logo":"https://www.fileinw.com/postor/20240418191821ch3hd.jpg","id":"524458"}]},
  {"tid":"6328","data":[{"favorite":false,"cid":"6328","remotetv":"34","title":"Amarin TV","logo":"https://www.fileinw.com/postor/20240418191809amarintvhd.jpg","id":"646006"}]},
  {"tid":"7161","data":[{"favorite":false,"cid":"7161","remotetv":"35","title":"7 HD","logo":"https://www.fileinw.com/postor/20240418185909ch7hd.jpg","id":"524463"}]},
  {"tid":"1664","data":[{"favorite":false,"cid":"1664","remotetv":"36","title":"PPTV HD","logo":"https://www.fileinw.com/postor/20240418191253pptvhd.jpg","id":"646014"}]},
  {"tid":"2820","data":[{"favorite":false,"cid":"2820","remotetv":"205","title":"HBO","logo":"https://www.fileinw.com/postor/20240418201334HBO.jpg","id":"446863"}]},
  {"tid":"2819","data":[{"favorite":false,"cid":"2819","remotetv":"206","title":"HBO Hits","logo":"https://www.fileinw.com/postor/20240418201343HBO_Hits.jpg","id":"364601"}]},
  {"tid":"2818","data":[{"favorite":false,"cid":"2818","remotetv":"207","title":"HBO Signature","logo":"https://www.fileinw.com/postor/20240418201358HBO_Signature.jpg","id":"790667"}]},
  {"tid":"2816","data":[{"favorite":false,"cid":"2816","remotetv":"208","title":"HBO Family","logo":"https://www.fileinw.com/postor/20240418201412HBO_Family.jpg","id":"1312524"}]},
  {"tid":"2815","data":[{"favorite":false,"cid":"2815","remotetv":"209","title":"CINEMAX","logo":"https://www.fileinw.com/postor/20240418201426cinemax.jpg","id":"364606"}]},
  {"tid":"2824","data":[{"favorite":false,"cid":"2824","remotetv":"210","title":"Mono29 Music Station","logo":"https://www.fileinw.com/postor/20240418201201Mono29music.jpg","id":"75747"}]},
  {"tid":"2823","data":[{"favorite":false,"cid":"2823","remotetv":"211","title":"Mono29 Plus","logo":"https://www.fileinw.com/postor/20240418201217Mono29Plus.jpg","id":"451257"}]},
  {"tid":"2821","data":[{"favorite":false,"cid":"2821","remotetv":"212","title":"3BB Asian","logo":"https://www.fileinw.com/postor/202404182013223BBAsian.jpg","id":"1312538"}]},
  {"tid":"2796","data":[{"favorite":false,"cid":"2796","remotetv":"213","title":"TV5MONDE","logo":"https://www.fileinw.com/postor/1787897441_e1b52df2ccc42e28965a.jpg","id":"1872852"}]},
  {"tid":"2739","data":[{"favorite":false,"cid":"2739","remotetv":"228","title":"Warner TV","logo":"https://www.fileinw.com/postor/20240418201607WBTV.jpg","id":"1294732"}]},
  {"tid":"2930","data":[{"favorite":false,"cid":"2930","remotetv":"229","title":"Rock Action","logo":"https://www.fileinw.com/postor/20240418201014RockAction.jpg","id":"697459"}]},
  {"tid":"2929","data":[{"favorite":false,"cid":"2929","remotetv":"230","title":"Rock Entertainment","logo":"https://www.fileinw.com/postor/20240418201026RockEnterment.jpg","id":"697438"}]},
  {"tid":"1845","data":[{"favorite":false,"cid":"1845","remotetv":"342","title":"Food Network","logo":"https://www.fileinw.com/postor/20240418202640Food.jpg","id":"315533"}]},
  {"tid":"2831","data":[{"favorite":false,"cid":"2831","remotetv":"343","title":"Fashion TV","logo":"https://www.fileinw.com/postor/1787896707_372b94bbc15fbfb7dd82.jpg","id":"1872851"}]},
  {"tid":"1854","data":[{"favorite":false,"cid":"1854","remotetv":"356","title":"Asian Food Network","logo":"https://www.fileinw.com/postor/20240418202628AFN.jpg","id":"712739"}]},
  {"tid":"2827","data":[{"favorite":false,"cid":"2827","remotetv":"357","title":"Cool Channel","logo":"https://www.fileinw.com/postor/1787897166_4216914f04d8e6bc2841.jpg","id":"75744"}]},
  {"tid":"1642","data":[{"favorite":false,"cid":"1642","remotetv":"358","title":"Rama Channel","logo":"https://www.fileinw.com/postor/20241102110312rama.jpg","id":"49019"}]},
  {"tid":"8999","data":[{"favorite":false,"cid":"8999","remotetv":"401","title":"Boomerang","logo":"https://www.fileinw.com/postor/20240418202911Boomerang.jpg","id":"68906"}]},
  {"tid":"2029","data":[{"favorite":false,"cid":"2029","remotetv":"446","title":"Nickelodeon","logo":"https://www.fileinw.com/postor/20240418205237Nickelodeon.jpg","id":"12335"}]},
  {"tid":"2875","data":[{"favorite":false,"cid":"2875","remotetv":"447","title":"Nick Jr.","logo":"https://www.fileinw.com/postor/20240418203048Nickjr.jpg","id":"70166"}]},
  {"tid":"8007","data":[{"favorite":false,"cid":"8007","remotetv":"449","title":"Cartoon Network","logo":"https://www.fileinw.com/postor/20240418202927CN.jpg","id":"61528"}]},
  {"tid":"477","data":[{"favorite":false,"cid":"477","remotetv":"460","title":"Cartoonito","logo":"https://www.fileinw.com/postor/20240418205416Cartoonito.jpg","id":"67127"}]},
  {"tid":"563","data":[{"favorite":false,"cid":"563","remotetv":"505","title":"สำรวจโลก","logo":"https://www.fileinw.com/postor/20240418211443SamRujLok.jpg","id":"1312728"}]},
  {"tid":"555","data":[{"favorite":false,"cid":"555","remotetv":"506","title":"Mysci","logo":"https://www.fileinw.com/postor/20240418211511MySci.jpg","id":"587767"}]},
  {"tid":"710","data":[{"favorite":false,"cid":"710","remotetv":"507","title":"Animal Show","logo":"https://www.fileinw.com/postor/20240418211432AnimalShow.jpg","id":"1312542"}]},
  {"tid":"716","data":[{"favorite":false,"cid":"716","remotetv":"508","title":"ของดีประเทศไทย","logo":"https://www.fileinw.com/postor/20240418211325KhongDeeThailand.jpg","id":"655081"}]},
  {"tid":"715","data":[{"favorite":false,"cid":"715","remotetv":"509","title":"Thainess TV","logo":"https://www.fileinw.com/postor/20240418211345Thainess.jpg","id":"1312732"}]},
  {"tid":"1546","data":[{"favorite":false,"cid":"1546","remotetv":"562","title":"Discovery Channel","logo":"https://www.fileinw.com/postor/20240418210226Discovery.jpg","id":"1394547"}]},
  {"tid":"1496","data":[{"favorite":false,"cid":"1496","remotetv":"566","title":"TLC","logo":"https://www.fileinw.com/postor/20240418210246TLC.jpg","id":"1285581"}]},
  {"tid":"159","data":[{"favorite":false,"cid":"159","remotetv":"585","title":"DLTV1 ประถมศึกษาปีที่ 1","logo":"https://www.fileinw.com/postor/20240418211604DLTV1.jpg","id":"728581"}]},
  {"tid":"144","data":[{"favorite":false,"cid":"144","remotetv":"586","title":"DLTV1 ประถมศึกษาปีที่ 2","logo":"https://www.fileinw.com/postor/20240418211613DLTV2.jpg","id":"728582"}]},
  {"tid":"112","data":[{"favorite":false,"cid":"112","remotetv":"587","title":"DLTV3 ประถมศึกษาปีที่ 3","logo":"https://www.fileinw.com/postor/20240418211627DLTV3.jpg","id":"728583"}]},
  {"tid":"61","data":[{"favorite":false,"cid":"61","remotetv":"588","title":"DLTV4 ประถมศึกษาปีที่ 4","logo":"https://www.fileinw.com/postor/20240418211637DLTV4.jpg","id":"728584"}]},
  {"tid":"21","data":[{"favorite":false,"cid":"21","remotetv":"589","title":"DLTV5 ประถมศึกษาปีที่ 5","logo":"https://www.fileinw.com/postor/20240418211646DLTV5.jpg","id":"728585"}]},
  {"tid":"20","data":[{"favorite":false,"cid":"20","remotetv":"590","title":"DLTV5 ประถมศึกษาปีที่ 6","logo":"https://www.fileinw.com/postor/20240418211659DLTV6.jpg","id":"728586"}]},
  {"tid":"19","data":[{"favorite":false,"cid":"19","remotetv":"591","title":"DLTV7 มัธยมศึกษาปีที่ 1","logo":"https://www.fileinw.com/postor/20240418211710DLTV7.jpg","id":"728587"}]},
  {"tid":"18","data":[{"favorite":false,"cid":"18","remotetv":"592","title":"DLTV8 มัธยมศึกษาปีที่ 2","logo":"https://www.fileinw.com/postor/20240418211724DLTV8.jpg","id":"728588"}]},
  {"tid":"17","data":[{"favorite":false,"cid":"17","remotetv":"593","title":"DLTV9 มัธยมศึกษาปีที่ 3","logo":"https://www.fileinw.com/postor/20240418211737DLTV9.jpg","id":"728589"}]},
  {"tid":"16","data":[{"favorite":false,"cid":"16","remotetv":"594","title":"DLTV10 อนุบาลศึกษาปีที่ 1","logo":"https://www.fileinw.com/postor/20240418211745DLTV10.jpg","id":"728590"}]},
  {"tid":"15","data":[{"favorite":false,"cid":"15","remotetv":"595","title":"DLTV11 อนุบาลศึกษาปีที่ 2","logo":"https://www.fileinw.com/postor/20240418211757DLTV11.jpg","id":"728591"}]},
  {"tid":"7","data":[{"favorite":false,"cid":"7","remotetv":"596","title":"DLTV12 อนุบาลศึกษาปีที่ 3","logo":"https://www.fileinw.com/postor/20240418211807DLTV12.jpg","id":"728592"}]},
  {"tid":"6","data":[{"favorite":false,"cid":"6","remotetv":"597","title":"DLTV13 มัธยมศึกษาปีที่ 4","logo":"https://www.fileinw.com/postor/20240418211828DLTV13.jpg","id":"728950"}]},
  {"tid":"5","data":[{"favorite":false,"cid":"5","remotetv":"598","title":"DLTV14 มัธยมศึกษาปีที่ 5","logo":"https://www.fileinw.com/postor/20240418211840DLTV14.jpg","id":"728951"}]},
  {"tid":"4","data":[{"favorite":false,"cid":"4","remotetv":"599","title":"DLTV15 มัธยมศึกษาปีที่ 6","logo":"https://www.fileinw.com/postor/20240418211852DLTV15.jpg","id":"728952"}]},
  {"tid":"82290","data":[{"favorite":false,"cid":"82290","remotetv":"601","title":"Monomax 1","logo":"https://www.fileinw.com/postor/1784638366_8098cef8d3f4a00d7b7d.jpg","id":"1759407"}]},
  {"tid":"82079","data":[{"favorite":false,"cid":"82079","remotetv":"602","title":"Monomax 2","logo":"https://www.fileinw.com/postor/1784638378_08bb9ed4705671d03b58.jpg","id":"1759404"}]},
  {"tid":"82044","data":[{"favorite":false,"cid":"82044","remotetv":"603","title":"Monomax 3","logo":"https://www.fileinw.com/postor/1784638396_c4abaa773c2224e6cbb5.jpg","id":"1759398"}]},
  {"tid":"81912","data":[{"favorite":false,"cid":"81912","remotetv":"604","title":"Monomax 4","logo":"https://www.fileinw.com/postor/1784638414_15031f739d30dbe67156.jpg","id":"1759397"}]},
  {"tid":"81779","data":[{"favorite":false,"cid":"81779","remotetv":"605","title":"Monomax 5","logo":"https://www.fileinw.com/postor/1784638431_3f99efd1c2172c31fb7b.jpg","id":"1759396"}]},
  {"tid":"81741","data":[{"favorite":false,"cid":"81741","remotetv":"606","title":"Monomax 6","logo":"https://www.fileinw.com/postor/1784638450_b01f29df43a4a2434267.jpg","id":"1759393"}]},
  {"tid":"81639","data":[{"favorite":false,"cid":"81639","remotetv":"607","title":"Monomax 7","logo":"https://www.fileinw.com/postor/1784638462_dc7b807e2491f3fdf20e.jpg","id":"1759392"}]},
  {"tid":"81611","data":[{"favorite":false,"cid":"81611","remotetv":"608","title":"Monomax 8","logo":"https://www.fileinw.com/postor/1784638475_30f5187a5f9fecb40a03.jpg","id":"1759391"}]},
  {"tid":"7424","data":[{"favorite":false,"cid":"7424","remotetv":"610","title":"beIN SPORTS 1","logo":"https://www.fileinw.com/postor/20240418192615Bein1.jpg","id":"1805657"}]},
  {"tid":"7423","data":[{"favorite":false,"cid":"7423","remotetv":"611","title":"beIN SPORTS 2","logo":"https://www.fileinw.com/postor/20240418192624Bein2.jpg","id":"1805658"}]},
  {"tid":"7422","data":[{"favorite":false,"cid":"7422","remotetv":"612","title":"beIN SPORTS 3","logo":"https://www.fileinw.com/postor/20240418192653Bein3.jpg","id":"1754173"}]},
  {"tid":"7203","data":[{"favorite":false,"cid":"7203","remotetv":"625","title":"Golf +","logo":"https://www.fileinw.com/postor/1775887283_c8bc2f4f2440145c762e.jpg","id":"1203615"}]},
  {"tid":"1498","data":[{"favorite":false,"cid":"1498","remotetv":"645","title":"W-sport","logo":"https://www.fileinw.com/postor/20250830191812Wsport.jpg","id":"1759464"}]},
  {"tid":"1239","data":[{"favorite":false,"cid":"1239","remotetv":"646","title":"MUTV","logo":"https://www.fileinw.com/postor/20250419153707MUTV.jpg","id":"1660850"}]},
  {"tid":"1231","data":[{"favorite":false,"cid":"1231","remotetv":"647","title":"Realmadrid TV","logo":"https://www.fileinw.com/postor/20250903090211Realmardridtv.jpg","id":"1761787"}]},
  {"tid":"1235","data":[{"favorite":false,"cid":"1235","remotetv":"648","title":"LFCTV","logo":"https://www.fileinw.com/postor/20250421131930LFCTV.jpg","id":"1662141"}]},
  {"tid":"1373","data":[{"favorite":false,"cid":"1373","remotetv":"660","title":"RED BULL","logo":"https://www.fileinw.com/postor/20240418193701RedBull.jpg","id":"1074313"}]},
  {"tid":"1368","data":[{"favorite":false,"cid":"1368","remotetv":"665","title":"Eurosport","logo":"https://www.fileinw.com/postor/20240519111216Eurosport1.jpg","id":"1422087"}]},
  {"tid":"1260","data":[{"favorite":false,"cid":"1260","remotetv":"679","title":"BG Sports 1","logo":"https://www.fileinw.com/postor/1773406615_8a171eb7717620c0610d.jpg","id":"1434860"}]},
  {"tid":"1259","data":[{"favorite":false,"cid":"1259","remotetv":"680","title":"BG Sports 2","logo":"https://www.fileinw.com/postor/1773406636_4cbce03dfdfc4be64d34.jpg","id":"1434862"}]},
  {"tid":"1258","data":[{"favorite":false,"cid":"1258","remotetv":"681","title":"BG Sports 3","logo":"https://www.fileinw.com/postor/1773406652_9c20feaa48661cb1979c.jpg","id":"1434864"}]},
  {"tid":"1257","data":[{"favorite":false,"cid":"1257","remotetv":"682","title":"BG Sports 4","logo":"https://www.fileinw.com/postor/1773406711_c80e7195ee41974a7013.jpg","id":"1434868"}]},
  {"tid":"1255","data":[{"favorite":false,"cid":"1255","remotetv":"683","title":"BG Sports 6","logo":"https://www.fileinw.com/postor/1789622885_d344c2e0108429bd36b4.jpg","id":"1434869"}]},
  {"tid":"1256","data":[{"favorite":false,"cid":"1256","remotetv":"683","title":"BG Sports 5","logo":"https://www.fileinw.com/postor/1789622830_2fc2b8d9447b89da6cce.jpg","id":"1879816"}]},
  {"tid":"1484","data":[{"favorite":false,"cid":"1484","remotetv":"722","title":"Play Sports 55","logo":"https://www.fileinw.com/postor/1778323536_307b60a17c68dcd7bfe4.jpg","id":"1759388"}]},
  {"tid":"1483","data":[{"favorite":false,"cid":"1483","remotetv":"723","title":"Play Sports 56","logo":"https://www.fileinw.com/postor/1778323547_b574499b0610076f178b.jpg","id":"1759387"}]},
  {"tid":"1482","data":[{"favorite":false,"cid":"1482","remotetv":"724","title":"Play Sports 61","logo":"https://www.fileinw.com/postor/1778323562_b6864f474d78b65cc27b.jpg","id":"1759384"}]},
  {"tid":"1481","data":[{"favorite":false,"cid":"1481","remotetv":"725","title":"Play Sports 62","logo":"https://www.fileinw.com/postor/1778323575_bfffb7458766543034c7.jpg","id":"1759382"}]},
  {"tid":"1480","data":[{"favorite":false,"cid":"1480","remotetv":"726","title":"Play Sports 63","logo":"https://www.fileinw.com/postor/1778323586_68feff8b162984e503d0.jpg","id":"1759379"}]},
  {"tid":"1479","data":[{"favorite":false,"cid":"1479","remotetv":"727","title":"Play Sports 66","logo":"https://www.fileinw.com/postor/1778323619_360f3708561d63bd62b1.jpg","id":"1759377"}]},
  {"tid":"1478","data":[{"favorite":false,"cid":"1478","remotetv":"728","title":"Play Sports 69","logo":"https://www.fileinw.com/postor/1778323649_fba0da17f65a660e6f1d.jpg","id":"1759376"}]},
  {"tid":"1477","data":[{"favorite":false,"cid":"1477","remotetv":"729","title":"Play Sports 71","logo":"https://www.fileinw.com/postor/1778323666_047495696721f5b90518.jpg","id":"1759374"}]},
  {"tid":"1476","data":[{"favorite":false,"cid":"1476","remotetv":"730","title":"Play Sports 72","logo":"https://www.fileinw.com/postor/1778323678_a0750094187fc0b7cd20.jpg","id":"1759373"}]},
  {"tid":"1475","data":[{"favorite":false,"cid":"1475","remotetv":"731","title":"Play Sports 73","logo":"https://www.fileinw.com/postor/1778323695_28e2ffa3f90395597a9b.jpg","id":"1759372"}]},
  {"tid":"1433","data":[{"favorite":false,"cid":"1433","remotetv":"732","title":"Play Sports 74","logo":"https://www.fileinw.com/postor/1778323713_6c92b515171bffb2fbd4.jpg","id":"1763094"}]},
  {"tid":"1432","data":[{"favorite":false,"cid":"1432","remotetv":"733","title":"Play Sports 75","logo":"https://www.fileinw.com/postor/1778323723_c93ffe65e328f02938b0.jpg","id":"1763096"}]},
  {"tid":"1495","data":[{"favorite":false,"cid":"1495","remotetv":"733","title":"Mono MAX 1","logo":"https://www.fileinw.com/postor/20250904190235Monomax1.jpg","id":"1763091"}]},
  {"tid":"1494","data":[{"favorite":false,"cid":"1494","remotetv":"734","title":"Mono MAX 2","logo":"https://www.fileinw.com/postor/20250904190145Monomax2.jpg","id":"1763088"}]},
  {"tid":"1499","data":[{"favorite":false,"cid":"1499","remotetv":"734","title":"Premier Sports","logo":"https://www.fileinw.com/postor/1787896423_a37c70995320ce67ee71.jpg","id":"1872850"}]},
  {"tid":"1493","data":[{"favorite":false,"cid":"1493","remotetv":"735","title":"Mono MAX 3","logo":"https://www.fileinw.com/postor/20250904190017Monomax3.jpg","id":"1763087"}]},
  {"tid":"1492","data":[{"favorite":false,"cid":"1492","remotetv":"736","title":"Mono MAX 4","logo":"https://www.fileinw.com/postor/20250904185727Monomax4.jpg","id":"1763085"}]},
  {"tid":"1491","data":[{"favorite":false,"cid":"1491","remotetv":"737","title":"Mono MAX 5","logo":"https://www.fileinw.com/postor/20250904185628Monomax5.jpg","id":"1763082"}]},
  {"tid":"1490","data":[{"favorite":false,"cid":"1490","remotetv":"738","title":"Mono MAX 6","logo":"https://www.fileinw.com/postor/20250904185435Monomax6.jpg","id":"1763078"}]},
  {"tid":"1489","data":[{"favorite":false,"cid":"1489","remotetv":"739","title":"Mono MAX 7","logo":"https://www.fileinw.com/postor/20250904185314Monomax7.jpg","id":"1763075"}]},
  {"tid":"1488","data":[{"favorite":false,"cid":"1488","remotetv":"740","title":"Mono MAX 8","logo":"https://www.fileinw.com/postor/20250904184956Monomax8.jpg","id":"1763070"}]},
  {"tid":"1487","data":[{"favorite":false,"cid":"1487","remotetv":"741","title":"Mono MAX 9","logo":"https://www.fileinw.com/postor/20250904185026Monomax9.jpg","id":"1763068"}]},
  {"tid":"1486","data":[{"favorite":false,"cid":"1486","remotetv":"742","title":"Mono MAX 10","logo":"https://www.fileinw.com/postor/20250904184605Monomax10.jpg","id":"1763067"}]},
  {"tid":"1485","data":[{"favorite":false,"cid":"1485","remotetv":"743","title":"Play Sports 41","logo":"https://www.fileinw.com/postor/1778400202_5eafcb6bab5444f79b52.jpg","id":"1763064"}]},
  {"tid":"3026","data":[{"favorite":false,"cid":"3026","remotetv":"774","title":"CBS News (CBSN)","logo":"https://www.fileinw.com/postor/20240418212101CBS News.jpg","id":"45170"}]},
  {"tid":"7839","data":[{"favorite":false,"cid":"7839","remotetv":"775","title":"FOX Business","logo":"https://www.fileinw.com/postor/20250830191205foxbusiness.jpg","id":"1759462"}]},
  {"tid":"6639","data":[{"favorite":false,"cid":"6639","remotetv":"778","title":"CNN","logo":"https://www.fileinw.com/postor/20240418211937CNN.jpg","id":"1231871"}]},
  {"tid":"6638","data":[{"favorite":false,"cid":"6638","remotetv":"779","title":"BBC World News","logo":"https://www.fileinw.com/postor/20240418211953BBCNEWS.jpg","id":"780139"}]},
  {"tid":"4337","data":[{"favorite":false,"cid":"4337","remotetv":"780","title":"Euronews","logo":"https://www.fileinw.com/postor/20240418212044Euro News.jpg","id":"1320751"}]},
  {"tid":"2814","data":[{"favorite":false,"cid":"2814","remotetv":"782","title":"Bloomberg","logo":"https://www.fileinw.com/postor/20240418212129Bloomberg.jpg","id":"626129"}]},
  {"tid":"2145","data":[{"favorite":false,"cid":"2145","remotetv":"783","title":"Deutsche Welle DW","logo":"https://www.fileinw.com/postor/20240418212145DW.jpg","id":"782257"}]},
  {"tid":"9196","data":[{"favorite":false,"cid":"9196","remotetv":"784","title":"FOX NEWS","logo":"https://www.fileinw.com/postor/20240420115238FoxNews.jpg","id":"69652"}]},
  {"tid":"394","data":[{"favorite":false,"cid":"394","remotetv":"785","title":"France 24","logo":"https://www.fileinw.com/postor/20240418212942France24.jpg","id":"1320785"}]},
  {"tid":"404","data":[{"favorite":false,"cid":"404","remotetv":"786","title":"Al Jazeera","logo":"https://www.fileinw.com/postor/20240418212848Aljazeera.jpg","id":"661159"}]},
  {"tid":"1497","data":[{"favorite":false,"cid":"1497","remotetv":"787","title":"RT News","logo":"https://www.fileinw.com/postor/20240418212614RT.jpg","id":"454197"}]},
  {"tid":"2100","data":[{"favorite":false,"cid":"2100","remotetv":"789","title":"CGTN","logo":"https://www.fileinw.com/postor/20240418212205CGTN.jpg","id":"761959"}]},
  {"tid":"402","data":[{"favorite":false,"cid":"402","remotetv":"790","title":"CCTV-4","logo":"https://www.fileinw.com/postor/20240418212911CCTV4.jpg","id":"1678908"}]},
  {"tid":"433","data":[{"favorite":false,"cid":"433","remotetv":"791","title":"Channel NewsAsia","logo":"https://www.fileinw.com/postor/20240418212633CNA.jpg","id":"718237"}]},
  {"tid":"1600","data":[{"favorite":false,"cid":"1600","remotetv":"792","title":"ABC Australia","logo":"https://www.fileinw.com/postor/20240418212559ABCAus.jpg","id":"1285607"}]},
  {"tid":"408","data":[{"favorite":false,"cid":"408","remotetv":"792","title":"NEWS1","logo":"https://www.fileinw.com/postor/20240418212649News1.jpg","id":"782256"}]},
  {"tid":"1243","data":[{"favorite":false,"cid":"1243","remotetv":"793","title":"สุวรรณภูมิทีวี","logo":"https://www.fileinw.com/postor/20210514142124สุวรรณภูมิทีวี.jpg","id":"587679"}]}
];

// Determine category based on channel properties
export function classifyChannel(item: { title: string; remotetv: string; cid: string }): string {
  const num = parseInt(item.remotetv, 10);
  const titleLower = item.title.toLowerCase();

  // Digital TV Thailand
  if ((num >= 1 && num <= 36) || item.title.includes("ช่อง 3") || item.title.includes("7 HD") || item.title.includes("ไทยรัฐ") || item.title.includes("Workpoint") || item.title.includes("One Channel") || item.title.includes("GMM") || item.title.includes("Amarin") || item.title.includes("PPTV") || item.title.includes("MCOT") || item.title.includes("Thai PBS")) {
    return "livedigital";
  }

  // Cartoon
  if (titleLower.includes("cartoon") || titleLower.includes("nick") || titleLower.includes("boomerang") || titleLower.includes("การ์ตูน")) {
    return "livecartoon";
  }

  // News
  if (titleLower.includes("news") || titleLower.includes("cnn") || titleLower.includes("bbc") || titleLower.includes("fox news") || titleLower.includes("al jazeera") || titleLower.includes("bloomberg") || titleLower.includes("euronews") || titleLower.includes("nation") || titleLower.includes("top news") || titleLower.includes("tnn") || item.title.includes("สุวรรณภูมิ")) {
    return "livenews";
  }

  // Sports
  if (titleLower.includes("sport") || titleLower.includes("asian games") || titleLower.includes("bein") || titleLower.includes("bg sport") || titleLower.includes("mutv") || titleLower.includes("lfctv") || titleLower.includes("realmadrid") || titleLower.includes("golf") || titleLower.includes("eurosport") || titleLower.includes("red bull")) {
    return "livesport";
  }

  // Documentary / Educational / Sara
  if (titleLower.includes("discovery") || titleLower.includes("tlc") || titleLower.includes("food") || titleLower.includes("dltv") || item.title.includes("สำรวจโลก") || item.title.includes("mysci") || item.title.includes("animal") || item.title.includes("ของดี") || item.title.includes("thainess") || titleLower.includes("rama")) {
    return "livesara";
  }

  // Movies / Entertainment
  if (titleLower.includes("hbo") || titleLower.includes("cinemax") || titleLower.includes("monomax") || titleLower.includes("warner") || titleLower.includes("rock") || titleLower.includes("music") || titleLower.includes("fashion") || titleLower.includes("cool")) {
    return "liveentertain";
  }

  // International
  if (num >= 770 || titleLower.includes("dw") || titleLower.includes("cctv") || titleLower.includes("cgtn") || titleLower.includes("france") || titleLower.includes("rt") || titleLower.includes("cbs")) {
    return "liveinter";
  }

  return "livethai";
}

// Convert raw dataset to structured ChannelItem list
export function getInitialChannels(): ChannelItem[] {
  const channelMap = new Map<string, ChannelItem>();

  RAW_CHANNELS_DATA.forEach(entry => {
    entry.data.forEach(item => {
      if (!channelMap.has(item.cid)) {
        const category = classifyChannel(item);
        channelMap.set(item.cid, {
          id: item.id || item.cid,
          cid: item.cid,
          tid: entry.tid,
          title: item.title,
          remotetv: item.remotetv || "",
          logo: item.logo,
          favorite: item.favorite || false,
          category,
          streamUrl: getStreamUrl(item.cid)
        });
      }
    });
  });

  return Array.from(channelMap.values());
}

// Generate dynamic on-air programs and schedule based on current hour
export function generateScheduleForChannel(channel: ChannelItem, now: Date = new Date()): { current: Program; next: Program; full: Program[] } {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Template program schedules based on genre
  let scheduleTemplates: Array<{ title: string; desc: string; durHours: number }> = [];

  const titleLower = channel.title.toLowerCase();

  if (channel.category === "livesport" || titleLower.includes("sport") || titleLower.includes("asian games") || titleLower.includes("bein")) {
    scheduleTemplates = [
      { title: "ถ่ายทอดสด กีฬาเอเชียนเกมส์ ไฮไลต์ช่วงเช้า", desc: "รวมการแข่งขันรอบคัดเลือกและเหรียญรางวัล", durHours: 2 },
      { title: "Sport Highlights & Tactical Breakdown", desc: "สรุปผลการแข่งขันลีกสำคัญและสถิติ", durHours: 1.5 },
      { title: "ถ่ายทอดสด ฟุตบอลกระชับมิตร & ไฮไลท์พรีเมียร์ลีก", desc: "ศึกฟาดแข้งสุดมันส์พร้อมผู้บรรยายสด", durHours: 2.5 },
      { title: "Motorsport & Superbike World Series", desc: "ความเร้าใจระดับโลกในสนามแข่งความเร็วสูง", durHours: 2 },
      { title: "ถ่ายทอดสด มวยชิงแชมป์ & ศิลปะการต่อสู้", desc: "ไฟต์สำคัญระดับโลก สดติดขอบเวที", durHours: 2 },
      { title: "Sport Magazine: เส้นทางแชมป์โลก", desc: "เจาะลึกเบื้องหลังนักกีฬาระดับตำนาน", durHours: 2 }
    ];
  } else if (channel.category === "livenews" || titleLower.includes("news") || titleLower.includes("tnn") || titleLower.includes("cnn") || titleLower.includes("nation")) {
    scheduleTemplates = [
      { title: "เกาะติดข่าวเช้า สรุปสถานการณ์รอบวัน", desc: "ข่าวเช้าสด ประเด็นร้อนรอบประเทศไทยและทั่วโลก", durHours: 2 },
      { title: "ข่าวเที่ยงทันเหตุการณ์ & เจาะลึกเศรษฐกิจ", desc: "สถานการณ์การเงิน ตลาดหุ้น และเหตุการณ์สำคัญ", durHours: 1.5 },
      { title: "เจาะประเด็นร้อนการเมืองรอบทิศ", desc: "วิเคราะห์การเมือง นโยบายรัฐ และสถานการณ์โลก", durHours: 2 },
      { title: "ข่าวค่ำสถานการณ์สด เกาะติดข่าวด่วน", desc: "รายงานสดจากพื้นที่ โดยทีมข่าวภาคสนามมืออาชีพ", durHours: 2.5 },
      { title: "โต๊ะกลมข่าวโลก World News Tonight", desc: "สรุปข่าวต่างประเทศ สงคราม การทูต และเทคโนโลยี", durHours: 2 },
      { title: "สรุปข่าวรอบดึก & ราตรีสวัสดิ์เมืองไทย", desc: "ภาพรวมเหตุการณ์สำคัญก่อนเข้านอน", durHours: 2 }
    ];
  } else if (channel.category === "livecartoon" || titleLower.includes("cartoon") || titleLower.includes("nick") || titleLower.includes("boomerang")) {
    scheduleTemplates = [
      { title: "การ์ตูนหรรษาตอนเช้า: แอนิเมชันยอดฮิต", desc: "สนุกสนานกับการผจญภัยของตัวละครโปรด", durHours: 1.5 },
      { title: "ขบวนการยอดมนุษย์ & ผู้พิทักษ์", desc: "แอ็กชันสุดมันส์พากย์ไทยถูกใจทุกวัย", durHours: 2 },
      { title: "โลกแฟนตาซีมหัศจรรย์ ตอนใหม่ล่าสุด", desc: "เรื่องราวเวทมนตร์และมิตรภาพอันอบอุ่น", durHours: 2 },
      { title: "อนิเมะดังประจำสัปดาห์ (พากย์ไทย)", desc: "ตอนใหม่สุดเข้มข้น ลิขสิทธิ์แท้", durHours: 2 },
      { title: "การ์ตูนเสริมทักษะความคิดสร้างสรรค์", desc: "เรียนรู้เรื่องวิทยาศาสตร์และศิลปะผ่านแอนิเมชัน", durHours: 1.5 },
      { title: "คลาสสิกตูน: นิทานก่อนนอนแสนสนุก", desc: "แอนิเมชันคลาสสิกผ่อนคลายสำหรับครอบครัว", durHours: 3 }
    ];
  } else if (channel.category === "liveentertain" || titleLower.includes("hbo") || titleLower.includes("cinemax") || titleLower.includes("monomax")) {
    scheduleTemplates = [
      { title: "Cinema Showcase: ภาพยนตร์ฮอลลีวูดฟอร์มยักษ์", desc: "ความบันเทิงระดับบล็อกบัสเตอร์ Full HD ระบบเสียงสมจริง", durHours: 2.5 },
      { title: "ซีรีส์ยอดฮิตระดับโลก ซีซั่นใหม่", desc: "ดราม่าสืบสวนระทึกขวัญ ตอนเด็ดประจำสัปดาห์", durHours: 1.5 },
      { title: "Movie Premier: หนังแอ็กชันมันส์ทะลุจอ", desc: "การต่อสู้สุดตื่นเต้นและสเปเชียลเอฟเฟกต์อลังการ", durHours: 2.5 },
      { title: "Asian Blockbuster: ภาพยนตร์เอเชียระดับรางวัล", desc: "เรื่องราวกินใจและศิลปะการต่อสู้สุดตระการตา", durHours: 2 },
      { title: "วาไรตี้คอนเสิร์ต & มิวสิคสเตชัน", desc: "เพลงฮิตติดชาร์ตและโชว์สุดพิเศษ", durHours: 1.5 },
      { title: "Midnight Thriller: ระทึกขวัญยามดึก", desc: "ภาพยนตร์สยองขวัญสุดสะพรึง", durHours: 2 }
    ];
  } else if (channel.category === "livesara" || titleLower.includes("discovery") || titleLower.includes("dltv") || channel.title.includes("สำรวจโลก")) {
    scheduleTemplates = [
      { title: "สำรวจโลกกว้าง: มหัศจรรย์สัตว์ป่าแอฟริกา", desc: "สารคดีธรรมชาติระบบ 4K สัมผัสชีวิตสัตว์หายาก", durHours: 2 },
      { title: "วิศวกรรมพิศวง: สิ่งก่อสร้างอัจฉริยะ", desc: "เบื้องหลังเทคโนโลยีและสิ่งปลูกสร้างขนาดยักษ์", durHours: 1.5 },
      { title: "DLTV ห้องเรียนแห่งอนาคต: วิทยาศาสตร์ & ภาษา", desc: "บทเรียนถ่ายทอดสดโดยครูต้นแบบ สพฐ.", durHours: 2 },
      { title: "มนต์เสน่ห์แดนสยาม: ท่องเที่ยวเชิงวัฒนธรรม", desc: "วิถีชีวิต อาหารพื้นถิ่น และมรดกไทย", durHours: 2 },
      { title: "จักรวาลและความลี้ลับแห่งดวงดาว", desc: "การสำรวจอวกาศ ดาราศาสตร์ และการค้นพบใหม่", durHours: 2 },
      { title: "อาหารเพื่อสุขภาพ & นวัตกรรมชีวภาพ", desc: "เคล็ดลับการกินดี อยู่ดี ด้วยองค์ความรู้สมัยใหม่", durHours: 2.5 }
    ];
  } else {
    // General Digital TV Thai (ช่อง 3, 7, One31, Workpoint, Thairath, etc.)
    scheduleTemplates = [
      { title: "คุยข่าวเช้าสด ทันโลกทันเหตุการณ์", desc: "เจาะลึกข่าวชาวบ้าน ข่าวสังคม และพยากรณ์อากาศ", durHours: 2.5 },
      { title: "รายการวาไรตี้ ทอล์กโชว์ & ครัวครบรส", desc: "เมนูเด็ด แขกรับเชิญพิเศษ และสาระบันเทิง", durHours: 2 },
      { title: "ข่าวเที่ยงตรงประเด็น ร้อนใจประชาชน", desc: "สรุปข่าวเด่นรอบวัน เกาะติดคดีดัง", durHours: 1.5 },
      { title: "ละครรีรัน & ละครช่วงบ่ายสุดฮิต", desc: "ละครยอดนิยม เรตติ้งถล่มทลาย", durHours: 2 },
      { title: "เกมโชว์สุดฮา แข่งขันชิงเงินล้าน", desc: "ความสนุกสนานและเสียงหัวเราะของทุกครอบครัว", durHours: 1.5 },
      { title: "ละครหลังข่าวภาคค่ำ ตอนอวสาน / ตอนใหม่", desc: "ดราม่าเข้มข้น ดารานำระดับแถวหน้าของเมืองไทย", durHours: 2 },
      { title: "รายการสนทนาข่าวค่ำ & ร้องทุกข์ชาวบ้าน", desc: "เปิดไมค์ช่วยเหลือประชาชน สัมภาษณ์สดคนดัง", durHours: 1.5 },
      { title: "สารคดีและวาไรตี้รอบดึก", desc: "เรื่องราวประทับใจส่งท้ายวัน", durHours: 2.5 }
    ];
  }

  // Construct 24h timeline
  const full: Program[] = [];
  let currentStartMinutes = 0; // Starts from 00:00

  let index = 0;
  while (currentStartMinutes < 24 * 60) {
    const template = scheduleTemplates[index % scheduleTemplates.length];
    const durationMins = Math.round(template.durHours * 60);
    const endMinutes = Math.min(currentStartMinutes + durationMins, 24 * 60);

    const startH = Math.floor(currentStartMinutes / 60);
    const startM = currentStartMinutes % 60;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const startTime = `${pad(startH)}:${pad(startM)}`;
    const endTime = `${pad(endH)}:${pad(endM)}`;

    full.push({
      id: `${channel.cid}-prog-${index}`,
      title: template.title,
      description: template.desc,
      startTime,
      endTime,
      durationMinutes: endMinutes - currentStartMinutes
    });

    currentStartMinutes = endMinutes;
    index++;
  }

  // Find current and next program
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  let currentProg = full[0];
  let nextProg = full[1] || full[0];

  for (let i = 0; i < full.length; i++) {
    const [sH, sM] = full[i].startTime.split(':').map(Number);
    const [eH, eM] = full[i].endTime.split(':').map(Number);
    const startMins = sH * 60 + sM;
    let endMins = eH * 60 + eM;
    if (endMins <= startMins) endMins += 24 * 60; // wrap over midnight

    if (currentTotalMinutes >= startMins && currentTotalMinutes < endMins) {
      currentProg = full[i];
      nextProg = full[(i + 1) % full.length];
      break;
    }
  }

  return { current: currentProg, next: nextProg, full };
}
