const sendEncryptedRequest = require("./apiClient");
const util = require('./util.js');
const config = require('./config.json');

function book(venueId, itemId, resourceIdList, actualPrice, message1, callback) {
    const path = "/api/VenueService/MVenue/BookCheck";

    const data = {
        timestamp: parseInt(new Date().getTime() / 1e3),
        data: {
            venueId: venueId,
            itemId: itemId,
            resourceIdList: resourceIdList,
            name: config.name,
            tel: config.tel,
            actualPrice: actualPrice,
            amount: actualPrice,
            ticket: "",
            userIp: "192.168.1.14",
        },
    };

    sendEncryptedRequest(data, path)
        .then(async bookcheck => {
            console.log("checkbook是否可以预定:", bookcheck);
            if (bookcheck == "true" || bookcheck === true) {
                console.log("checkbook通过，可以预定了");

                if (new Date().getHours() === 9 && new Date().getMinutes() < 30) {
                    const ticketData = await util.getTicket();
                    if (ticketData) {
                        const { ticket} = ticketData;
                        data.data.ticket = ticket.toString();
                        console.log('Obtained ticket:', ticket);
                    } else {
                        console.error('未能获取到有效的票据，无法继续预定');
                        return callback(0); // 返回失败状态
                    }
                }

                const path1 = "/api/VenueService/MVenue/Book";
                return sendEncryptedRequest(data, path1)
                    .then(decryptedData => {
                        console.log('捡漏场地成功，订单信息:', decryptedData);
                        message1 += "【预定成功】订单信息:" + JSON.stringify(decryptedData);
                        message1 += " 已下订单请在5分钟内支付，截止时间为" + new Date(new Date().getTime() + 5 * 60 * 1000).toLocaleString("zh-CN", { hour12: false }) + "，请及时支付";
                        util.sendReservationEmail(message1, "抢场地成功");
                        callback(1);
                        return true;
                    })
                    .catch(error => {
                        console.error('请求发生错误:', error.message);
                    });
            } else {
                console.log("抢场地失败");
                callback(0);
                return false;
            }
        })
        .catch(error => {
            console.error("请求发生错误:", error.message);
        });
}


module.exports = book;

// const venueId = 9;//场地id
// const itemId = 1;//运动类型 1羽毛球
// const resourceIdList = [ 429701 ]; // cellId 选择的场地id
// let actualPrice = 20;
// book(venueId, itemId, resourceIdList, actualPrice,authorization)
