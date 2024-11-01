const sendEncryptedRequest = require("./apiClient");
const util = require('./util.js');
// 预定场地，先去bookcheck一下，再去book
function book(venueId, itemId, resourceIdList, actualPrice, message1, callback) {
  const path = "/api/VenueService/MVenue/BookCheck";

  // 要加密的对象
  const data = {
    timestamp: parseInt(new Date().getTime() / 1e3),
    data: {
      venueId: venueId,//场馆
      itemId: itemId,// 运动类型 1羽毛球
      resourceIdList: resourceIdList,// cellId 选择的场地id
      name: "顾川",
      tel: "13338030621",
      actualPrice: actualPrice,
      amount: actualPrice,
      ticket: "",
      userIp: "192.168.1.14",
    },
  };
  // console.log("预定场地信息:", data);

  sendEncryptedRequest(data, path)
    .then(async bookcheck => {
      console.log("checkbook是否可以预定:", bookcheck);
      // 去check一下是否可以预定
      if (bookcheck == "true" || bookcheck == true) {
        console.log("checkbook通过，可以预定了");

        // 如果当前是9点到9点30，则从util里获取ticket
        if (new Date().getHours() == 9 && new Date().getMinutes() < 30) {
          (async () => {
            const { ticket, randstr } = await util.getTicket();
            data.data.ticket = ticket.toString();
            if (ticket) {
                console.log('Obtained ticket:', ticket);
            }
          })();
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
        console.log(message);
        console.log("抢场地失败");
        callback(0);
        //util.sendReservationEmail(message+"!!!!", "抢场地失败");
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