const https = require('https');
const { encryptECB, decryptECB } = require('./cryptoHelper');
const config = require('./config.json'); // 添加对配置文件的引用

// 封装的通用请求方法，用于发送加密的请求
function sendEncryptedRequest(data, path) {
  return new Promise((resolve, reject) => {

    // 加密请求体
    const encryptedData = encryptECB(JSON.stringify(data), config.encryptionKey);

    // 构造请求头
    const headers = {
      "Content-Type": "application/json",
      Authorization: config.authorization,
      ClientId: config.clientId,
      Encrypt: "true",
    };

    // 构造请求行+请求头
    const options = {
      hostname: "dmwmfteeaiosz.zjgzhcs.com",
      port: 28085,
      path: path,
      method: "POST",
      headers: headers,
    };

    const req = https.request(options, (res) => {
      let responseBody = '';

      res.on("data", (chunk) => {
        // 记录响应体
        responseBody += chunk;
      });

      res.on('end', () => {
        try {
          // 解密响应体
          const decryptedData = decryptECB(responseBody, config.encryptionKey);
          // 返回解密后的数据
          resolve(decryptedData);
        } catch (error) {
          reject(error);
        }
      });
    });

    // 监听请求错误
    req.on("error", (e) => {
      reject(e);
    });

    // 发送请求体
    req.write(encryptedData);
    req.end();
  });
}

module.exports = sendEncryptedRequest;
