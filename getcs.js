
const sendEncryptedRequest = require('./apiClient');

// 获取所有场地信息
function getAllVenues(authorization) {
  const path = "/api/VenueService/MVenue/List";

  const data = {
    timestamp: parseInt(new Date().getTime() / 1e3),
    data: {
      keyword: "",
      page: 1,
      limit: 10,
      type: 0,
      itemCategory: "",
      distance: 0,
      location: "120.5555,31.87547",
      triggered: false,
      _freshing: false,
      loadStatus: "loadmore",
    },
  };

  return sendEncryptedRequest(data, path);
}

module.exports = getAllVenues;


getAllVenues()
  .then(decryptedData => {
    console.log('场地信息:\n', decryptedData);
  })
  .catch(error => {
    console.error('请求发生错误:', error.message);
  });

