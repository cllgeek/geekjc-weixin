export function login() {
  return new Promise((resolve, reject) => {
    wx.login({ success: resolve, fail: reject });
  });
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({ success: resolve, fail: reject });
  });
}

export function setStorage(key, value) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key, data: value, success: resolve, fail: reject,
    });
  });
}

export function getStorage(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({ key, success: resolve, fail: reject });
  });
}

export function getLocation(type) {
  return new Promise((resolve, reject) => {
    wx.getLocation({ type, success: resolve, fail: reject });
  });
}
