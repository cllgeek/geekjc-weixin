export default function getUserInfo() {
  let userInfo;
  userInfo = wx.getStorageSync('user');
  userInfo = userInfo && JSON.parse(userInfo);
  return userInfo;
}
