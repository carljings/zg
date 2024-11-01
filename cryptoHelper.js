// cryptoHelper.js
const CryptoJS = require("crypto-js");

function encryptECB(data, key) {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padStart(32, "0"));
  const dataUtf8 = CryptoJS.enc.Utf8.parse(data);

  const encrypted = CryptoJS.AES.encrypt(dataUtf8, keyUtf8, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

function decryptECB(encryptedData, key) {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padStart(32, '0'));
  const decrypted = CryptoJS.AES.decrypt(encryptedData, keyUtf8, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  encryptECB,
  decryptECB
};
