const autoqcd = require("./app");
const util = require('./util.js');
mode = 1;
today = new Date();// 获取今天的日期
tomorrow = new Date(); // 获取明天的日期
tomorrow.setDate(today.getDate() + 1);// 格式化日期并组成数组
rq = [util.formatDate(tomorrow)];// 抢明天
//rq = ['2024-01-05'];
blacklist = {
    "4": ["07地板"],
    "11": ["地胶04", "地胶09"]
}
place = [
    { venueId: 11, value: "体育馆" },
    { venueId: 13, value: "东城" },
    { venueId: 24, value: "城南" }
];
// place = [
//     { venueId: 14, value: "职工" },
//     { venueId: 11, value: "体育馆" },
//     { venueId: 13, value: "东城" },
//     { venueId: 9, value: "综合馆" },
//     { venueId: 24, value: "城南" },
//     { venueId: 4, value: "西城" }
// ];
// place = [
//     { venueId: 14, value: "职工" }
// ];
//cdlx = ["地胶","地板"];
cdlx = ["地胶"];
sj = ["14:00-15:00", "15:00-16:00"]; 
//sj = ["18:00-19:00","19:00-20:00", "20:00-21:00", "21:00-22:00"];
//sj = ["19:00-20:00", "20:00-21:00", "21:00-22:00"];
//sj = ["20:00-21:00", "21:00-22:00"];
//sj = ["19:00-20:00", "20:00-21:00"];  // 时间段
// sc = 1;
sc = 2;  // 打球时长，单位小时
isyd = 0;  // 是否预定
targetHour = 9;
targetMinute = 0;
targetSecond = 1;
// 定义下单成功数
dds = 0;
function scheduleFunction(targetHour, targetMinute, targetSecond) {
    now = new Date();

    let targetTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        targetHour,
        targetMinute,
        targetSecond
    );


    // 计算现在时间到目标时间的毫秒数
    const timeToWait = targetTime - now;

    // 设置一个定时器，在计算出的毫秒数之后执行你的函数
    setTimeout(function () {
        isqd = autoqcd(mode, place, rq, cdlx, sj, sc,blacklist,isyd, (isqd) => {

            // 下单成功一次
            if (isqd == 1) {
                dds++;
                console.log("下单成功，已下单" + dds + "次");
            }

            // 下单成功达到上限
            if (dds == sj.length) {
                console.log('抢场地成功');
            }

            if (isqd == 0) {
                console.log('抢场地失败');
            }

        });
    }, timeToWait);
}


// 调用 scheduleFunction 来开始整个过程
scheduleFunction(targetHour, targetMinute, targetSecond);



