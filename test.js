
const { encryptECB, decryptECB } = require("./cryptoHelper");
const config = require('./config.json');
// 密钥
const m = "51AFoPEX14mCEjXrcCU_SxgJ-OIhagrM";

responseBody = "Ddo6+gY26wDxzOYJDWXW2G6GoGLxijrPMnWLt5nRGQDL0ssMxBMdYq1yCtMaZ39okBs98Q7x/Ym4B0X6WJ36Z0R8xV6V+1kYsLO4eDecB0qIY423z54q/8fZ+lWLMxzf3/U69gaVdR0bUDz6l2EZ9keVtR7BRX3slfsh6g3xlrcilN0dOWhhzoHs0rrN7YML7WI2DZ+g/J0Jhd/auwmqP97MW7fbYD4JP2LLZC+lC7x5gpYaDnQOXWUGjtiMYZUv";

const decryptedData = decryptECB(responseBody, config.encryptionKey);

console.log(decryptedData);

function formatDate(date) {
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // Pad with leading 0 if needed
    let day = ("0" + date.getDate()).slice(-2); // Pad with leading 0 if needed

    return `${year}-${month}-${day}`;
}

// Get today's date
let today = new Date();

// Get tomorrow's date by adding one day
let tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

// Format dates and put them in an array
let datesArray = [formatDate(today), formatDate(tomorrow)];

// Returning the array with today and tomorrow dates in YYYY-MM-DD format
console.log(datesArray);


function formatDate(date) {
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // Pad with leading 0 if needed
    let day = ("0" + date.getDate()).slice(-2); // Pad with leading 0 if needed

    return `${year}-${month}-${day}`;
}


message = "抢到场地,已下订单请在5分钟内支付，截止时间为" + new Date(new Date().getTime() + 5 * 60 * 1000).toLocaleString("zh-CN", { hour12: false }) + "，请及时支付";
console.log(message);
// 发送邮件
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: "",
    port: 12,
    secure: true,
    auth: {
        user: ""
        , pass: ""
    }
});
let mailOptions = {
    from: '"carljings" <carljings@qq.com>',
    to: 'carljings@qq.com',
    subject: '抢场地成功',
    text: message,
    html: message
};
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        return console.log(error);
    }
    console.log('邮件发送成功');
});