const config = require('./config.json');
const nodemailer = require('nodemailer');
const axios = require('axios');
const tencentcloud = require("tencentcloud-sdk-nodejs-captcha");
const CaptchaClient = tencentcloud.captcha.v20190722.Client;
// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey
const clientConfig = {
    credential: {
      secretId: config.secretId, // 请替换为您的 SecretId
      secretKey: config.secretKey, // 请替换为您的 SecretKey
    },
    region: "", // 可以根据需要指定区域
    profile: {
        httpProfile: {
        endpoint: "captcha.tencentcloudapi.com",
        },
    },
};

// 实例化要请求产品的client对象
const client = new CaptchaClient(clientConfig);

/**
 * 验证验证码
 * @param {string} ticket - 验证码票据
 * @param {string} randstr - 验证码随机字符串
 * @param {string} userIp - 用户IP地址
 * @returns {Promise<Object>} - 返回验证码验证结果
 */
async function verifyCaptcha(ticket, randstr, userIp) {
    const params = {
        "CaptchaType": 9,
        "Ticket": ticket,
        "UserIp": userIp,
        "Randstr": randstr,
        "CaptchaAppId": 190313930,
        "AppSecretKey": "" // 请根据需要设置
    };
    try {
        const data = await client.DescribeCaptchaResult(params);
        return data; // 返回结果
    } catch (err) {
        console.error("Error:", err);
        throw err; // 抛出错误以供调用者处理
    }
}


async function getTicket() {
    const url = `https://api.decodecaptcha.com/tencent?key=${config.key}&aid=${config.aid}&domain=${encodeURIComponent(config.domain)}&entry_url=${encodeURIComponent(config.entryUrl)}&elder_captcha=0&proxy_address=${config.proxyAddress}`;


    try {
        const response = await axios.get(url, { httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
        const data = response.data;
        const ticket = data.token?.ticket;
        const randstr = data.token?.randstr;

        if (!ticket || !randstr) {
            console.error(JSON.stringify({ error: "Failed to obtain ticket and randstr" }));
            console.log(data);
            return;
        }

        return {ticket,randstr};
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return;
    }
}


function sendReservationEmail(message,subject) {
    // 创建 Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        port: 465,
        secure: true,
        auth: {
            user: config.user,
            pass: config.pass
        }
    });

    // 邮件选项
    const mailOptions = {
        from: config.from,
        to: config.to,
        subject: subject,
        text: message,
        html: message
    };

    // 发送邮件
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('邮件发送成功');
    });
}

function formatDate(date) {
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // Pad with leading 0 if needed
    let day = ("0" + date.getDate()).slice(-2); // Pad with leading 0 if needed
    return `${year}-${month}-${day}`;
}

function getRandomSeconds(minSeconds,maxSeconds) {
    // 生成随机秒数
    return Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
}

// 在同一个场地内寻找连续的时间段
function findConsecutiveSlots(slots, hoursNeeded) {
    // 将场地按照placeId分组
    const groupedByPlace = slots.reduce((group, slot) => {
        group[slot.placeId] = group[slot.placeId] || [];
        group[slot.placeId].push(slot);
        return group;
    }, {});

    for (const placeId in groupedByPlace) {
        const placeSlots = groupedByPlace[placeId].sort((a, b) => a.beginTime.localeCompare(b.beginTime));
        for (let i = 0; i < placeSlots.length - 1; i++) {
            const sequence = [placeSlots[i]];
            let lastEndTime = placeSlots[i].endTime;
            for (let j = i + 1; j < placeSlots.length; j++) {
                if (placeSlots[j].beginTime === lastEndTime) {
                    sequence.push(placeSlots[j]);
                    lastEndTime = placeSlots[j].endTime;
                    if (sequence.length === hoursNeeded) return sequence;
                } else {
                    break;
                }
            }
        }
    }
    return null;
}

// 如果同一个场地内没有找到，则在所有场地内寻找连续的时间段
function findConsecutiveSlotsAcrossPlaces(slots, hoursNeeded) {
    for (let i = 0; i < slots.length - 1; i++) {
        const sequence = [slots[i]];
        let lastEndTime = slots[i].endTime;
        for (let j = i + 1; j < slots.length; j++) {
            if (slots[j].beginTime === lastEndTime) {
                sequence.push(slots[j]);
                lastEndTime = slots[j].endTime;
                if (sequence.length === hoursNeeded) return sequence;
            }
        }
    }
    return null;
}
// 使用示例
// (async () => {
//     const { ticket, randstr } = await getTicket();  // 使用对象解构
//     if (ticket && randstr) {
//         console.log('Obtained ticket:', ticket.toString());
//         console.log('Obtained randstr:', randstr);
//         const userIp = "218.4.55.18"; 
//         const result = await verifyCaptcha( ticket.toString(), randstr, userIp);
//         console.log("Captcha verification result:", result);
//     } else {
//         console.log('Failed to obtain ticket or randstr');
//     }
// })();

module.exports = {sendReservationEmail,formatDate,getRandomSeconds,findConsecutiveSlots,findConsecutiveSlotsAcrossPlaces,getTicket};

