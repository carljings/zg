// 获取某个场地的羽毛球场地列表
const sendEncryptedRequest = require('./apiClient');

function getVenueResources(venueId, date) {
  const path = "/api/VenueService/MVenue/ResourceList"; // API路径
  
  // categoryCode 默认 1
  const data = {
    timestamp: parseInt(new Date().getTime() / 1e3),
    data: {
      venueId: venueId, // 场地ID
      categoryCode: 1, // 类别代码，默认为1
      date: date // 日期
    },
  };

  return sendEncryptedRequest(data, path);
}

module.exports = getVenueResources;


//venueId 职工14、体育馆11、东城13、综合馆9、城南24、西城4
const venueId = 11; // 场地ID
const date = "2024-01-16"; // 日期

// getVenueResources(venueId, date)
//   .then(decryptedData => {
//     console.log('解密后的数据:', decryptedData);
//   })
//   .catch(error => {
//     console.error('请求发生错误:', error.message);
//   });
