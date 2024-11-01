const autoqcd = require("./app");
const util = require('./util.js');
// 第一个参数 1抢票模式 2捡漏模式
mode = 2;
today = new Date();// 获取今天的日期
tomorrow = new Date(); // 获取明天的日期
tomorrow.setDate(today.getDate() + 1);// 格式化日期并组成数组
rq = [util.formatDate(today)];// 捡漏明天
//rq = [util.formatDate(today), util.formatDate(tomorrow)];// 格式化日期并组成数组
//rq = ['2024-01-04', '2024-01-05'];
// place = [
//     { venueId: 14, value: "职工" },
//     { venueId: 11, value: "体育馆" },
//     { venueId: 13, value: "东城" },
//     { venueId: 9, value: "综合馆" },
//     { venueId: 24, value: "城南" },
//     { venueId: 4, value: "西城" }
// ];
place = [
    { venueId: 14, value: "职工" },
    { venueId: 11, value: "体育馆" },
    { venueId: 13, value: "东城" },
    { venueId: 4, value: "西城" }
];
// place = [
//     { venueId: 14, value: "职工" },
//     { venueId: 11, value: "体育馆" },
//     { venueId: 13, value: "东城" },
//     { venueId: 24, value: "城南" },
//     { venueId: 4, value: "西城" }
// ];
blacklist = {
    "4": ["07地板"],
    "11": ["地胶04", "地胶09"],
}
;
// blacklist = {

// }
// ;
//cdlx = ["地胶","地板"];
cdlx = ["地胶"];
//sj = ["18:00-19:00","19:00-20:00", "20:00-21:00", "21:00-22:00"];
//sj = ["19:00-20:00", "20:00-21:00", "21:00-22:00"];
//sj = ["20:00-21:00", "21:00-22:00"];
sj = ["19:00-20:00","20:00-21:00"];  // 时间段
//sc = 1;
sc = 1;  // 打球时长，单位小时
isyd = 1;  // 是否预定
// 定义调用次数
let n = 100;
// 定义轮询时间
let h = 1;
// 定义最小和最大的随机秒数范围
let minSeconds = 10;
let maxSeconds = 10;
// 使用setInterval函数随机调用方法
let timer;
let interval = util.getRandomSeconds(minSeconds, maxSeconds); // 获取随机的秒数间隔
// 定义下单成功数
dds = 0;
count = 0;
// function startTimer() {
//     let timer = setInterval(() => {
//         console.log("随机秒数间隔为" + interval / 1000 + "秒");
//         console.log(new Date()+"------------------------第"+(count+1)+"次调用-------------------------------");
//         count++;
//         autoqcd(mode, place, rq, cdlx, sj, sc,blacklist, isyd,(isqd) => {
//             if (isqd == 1) {
//                 dds++;
//                 console.log("下单成功，已下单" + dds + "次");
//             }
//             if (dds >= sj.length) {
//                 console.log("捡漏到场地，已下订单请在5分钟内支付，截止时间为" + new Date(new Date().getTime() + 5 * 60 * 1000).toLocaleString("zh-CN", { hour12: false }) + "，请及时支付");
//                 clearInterval(timer);
//                 return;
//             }
//         });
//     }, interval);
// }

// // 开始执行定时器
// startTimer();


autoqcd(mode, place, rq, cdlx, sj, sc,blacklist, isyd,(isqd) => {
    if (isqd == 1) {
        dds++;
        console.log("下单成功，已下单" + dds + "次");
    }
    if (dds >= sj.length) {
        console.log("捡漏到场地，已下订单请在5分钟内支付，截止时间为" + new Date(new Date().getTime() + 5 * 60 * 1000).toLocaleString("zh-CN", { hour12: false }) + "，请及时支付");
        clearInterval(timer);
        return;
    }
});