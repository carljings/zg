//const getAllVenues = require('./getcs');
const getVenueResources = require('./getkxcd');
const config = require('./config.json');
const book = require('./book');
const util = require('./util.js');

// 第一个参数 1抢票模式 2捡漏模式
// 第二个参数 场馆名称（职工、体育馆、东城、综合馆、城南、西城），抢票模式下默认体育馆然后职工， 捡漏模式下默认按顺序轮询所有的场馆
// 第三个参数 日期（今天、明天），抢票模式下默认明天，捡漏模式下默认今天+明天
// 第四个参数 场地类型(地胶、地板) ，默认模式下地胶+地板，优先地胶
// 第五个参数 时间段(9:00-22:00)，默认模式下19:00-21:00
// 第六个参数 至少包含几个小时，默认至少包含1小时
// 第七个参数 黑名单，不预定的场地
// 第八个参数 是否预定，默认不预定
// 第九个参数 回调函数
function autoqcd(mode, place, rq, cdlx, sj, sc,blacklist,isyd,callback) {

    ret = false;
    // 默认捡漏模式
    if (mode == null || mode == "") {
        mode = 2;
    } else if (mode == 1) {
        // 抢票模式，默认只抢职工和体育馆
        if (place == null || place == "") {
            place = [
                { venueId: 14, value: "职工" },
                { venueId: 11, value: "体育馆" }
            ];
        }
    }

    // 捡漏模式默认轮询所有场馆
    if (place == null || place == "") {
        place = [
            { venueId: 14, value: "职工" },
            { venueId: 11, value: "体育馆" },
            { venueId: 13, value: "东城" },
            { venueId: 9, value: "综合馆" },
            { venueId: 24, value: "城南" },
            { venueId: 4, value: "西城" }
        ];
    }

    if (mode == 1 && (rq == null || rq == "" || rq.length == 0)) {
        today = new Date(); // 获取今天的日期
        tomorrow = new Date();// 获取明天的日期
        tomorrow.setDate(today.getDate() + 1);// 格式化日期并组成数组
        rq = [tomorrow];
    } else {
        if (rq == null || rq == "" || rq.length == 0) {
            today = new Date();// 获取今天的日期
            tomorrow = new Date();// 获取明天的日期
            tomorrow.setDate(today.getDate() + 1);// 格式化日期并组成数组
            rq = [util.formatDate(today), util.formatDate(tomorrow)];
        }

    }

    if (cdlx == null || cdlx == "") {
        cdlx = ["地胶", "地板"];
    }

    if (sj == null || sj == "") {
        sj = ["19:00-20:00", "20:00-21:00"];
    }

    // 轮询所有场馆
    for (let i = 0; i < place.length; i++) {
        // 轮询所有日期
        for (let j = 0; j < rq.length; j++) {
            // console.log("准备抢或捡漏场地：【" + place[i].value + "】【" + rq[j] + "】【" + cdlx + "】【" + sj + "】时间段的场地");
            // 调用捡漏方法
            ret = ksqcd(place[i], rq[j], cdlx, sj, sc,blacklist,isyd,callback);
            if (ret) {
                return ret;
            }
        }
    }
    return ret;
}

function ksqcd(place, rq, cdlx, sj, sc,blacklist,isyd,callback) {
    let ret = false;
    message = "";
    const authorization = config.authorization // 您的授权头
    getVenueResources(place.venueId, rq, authorization)
        .then(decryptedData => {
            console.log("检索场地：【" + place.value + "】【" + rq + "】【" + cdlx + "】【" + sj + "】时间段的场地");
            // console.log('返回的数据:', decryptedData);
            // 获取满足cdlx和sj的空场地数据
            const filtered = [];
            decryptedData = JSON.parse(decryptedData);
            // 开始过滤满足场地类型、时间段、状态的场地
            decryptedData.forEach(place => {
                if (cdlx.length > 1) {
                    if (place.placeNumber.includes(cdlx[0]) || place.placeNumber.includes(cdlx[1])) {
                        place.cellList.forEach(cell => {

                            sj.forEach(timeSlot => {
                                const [beginTime, endTime] = timeSlot.split('-');
                                if ((cell.beginTime == beginTime && cell.endTime == endTime && cell.state == 0)) {
                                    filtered.push({
                                        placeNumber: place.placeNumber,
                                        placeId: place.placeId,
                                        cellId: cell.id,
                                        beginTime: cell.beginTime,
                                        endTime: cell.endTime,
                                        lockApply: cell.lockApply,
                                        price: cell.price,
                                        amount: cell.amount,
                                        state: cell.state,
                                        remark: cell.remark
                                    });
                                }
                            });

                        });
                    }
                } else {
                    if (place.placeNumber.includes(cdlx[0])) {
                        place.cellList.forEach(cell => {
                            sj.forEach(timeSlot => {
                                const [beginTime, endTime] = timeSlot.split('-');
                                if ((cell.beginTime == beginTime && cell.endTime == endTime && cell.state == 0)) {
                                    filtered.push({
                                        placeNumber: place.placeNumber,
                                        placeId: place.placeId,
                                        cellId: cell.id,
                                        beginTime: cell.beginTime,
                                        endTime: cell.endTime,
                                        lockApply: cell.lockApply,
                                        price: cell.price,
                                        amount: cell.amount,
                                        state: cell.state,
                                        remark: cell.remark
                                    });
                                }
                            });

                        });
                    }
                }

            });
            if (filtered.length == 0) {
                console.log("没有满足条件数据" + "\n");
                callback(0);
            } else {
                // 开始处理，如果时长大于1，需要找到连续的时间段的场地
                if (sc > 1) {
                    // 对时间段进行排序
                    filtered.sort((a, b) => a.beginTime.localeCompare(b.beginTime) || a.placeNumber.localeCompare(b.placeNumber));
                    // 优先尝试在同一个场地内找到连续时间段
                    let result = util.findConsecutiveSlots(filtered, sc);

                    // 如果同一个场地内找不到，则在所有场地内寻找
                    if (!result) {
                        result = util.findConsecutiveSlotsAcrossPlaces(filtered, sc);
                    }

                    if (result == null || result.length == 0) {
                        console.log("有满足1小时条件数据：" + JSON.stringify(filtered));
                        console.log("但没有满足连续" + sc + "小时条件的场地" + "\n");
                        callback(0);
                    } else {
                        console.log("有满足的场地，发送邮件并自动book预定");
                        // console.log(result);
                        result.forEach(cell => {
                            let placeNumber = cell.placeNumber;
                            let resourceIdList = [cell.cellId];
                            let actualPrice = cell.price;
                            let startTime = cell.beginTime;
                            let endTime = cell.endTime;
                            let message = "预定【" + place.value + "】【" + rq + "】【" + placeNumber + "】【" + startTime + "到" + endTime + "】的场地，价格为：" + actualPrice + "元\n";
                            console.log(message);
                            if(blacklist[place.venueId] && Array.isArray(blacklist[place.venueId]) && blacklist[place.venueId].includes(placeNumber)){
                                console.log("该场地在黑名单中，不预定");
                                callback(0);
                                return ret;
                            }else{
                                if (isyd == 1) {
                                    ret= book(place.venueId, 1, resourceIdList, actualPrice,message,callback)
                                }
                            }
                        });
                        return ret;
                    }

                } else {
                    console.log("有满足条件场地：" + JSON.stringify(filtered) + "\n");
                    console.log("发送邮件并自动book预定");
                    let placeNumber = filtered[0].placeNumber;
                    let resourceIdList = [filtered[0].cellId];
                    let actualPrice = filtered[0].price;
                    let startTime = filtered[0].beginTime;
                    let endTime = filtered[0].endTime;
                    message = "预定【" + place.value + "】【" + rq + "】【" + placeNumber + "】【" + startTime + "到" + endTime + "】的场地，价格为：" + actualPrice + "元" + "\n";
                    console.log(message);
                    if(blacklist[place.venueId] && Array.isArray(blacklist[place.venueId]) && blacklist[place.venueId].includes(placeNumber)){
                        console.log("该场地在黑名单中，不预定");
                        callback(0);
                        return ret;
                    }else{
                        if (isyd == 1) {
                            ret = "预定成功";
                            ret = book(place.venueId, 1, resourceIdList, actualPrice, message,callback)
                        }
                    }
                    return ret;
                }

            }
        })
        .catch(error => {
            console.error('请求发生错误:', error.message);
            callback(0);
            return ret;
        });
    return ret;

}



module.exports = autoqcd;
