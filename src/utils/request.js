

import { setStorage, removeStorage } from '@/utils/wechat';

const baseUrl = 'https://www.geekjc.com';

// 处理res
function processRes(res) {
  const result = res.data;
  if (result && result.token) {
    setStorage('token', result.token);
    setStorage('user', JSON.stringify(result.user));
  }
  if (res && res.code === 10005) {
    removeStorage('token');
    removeStorage('user');
    wx.navigateTo({ url: '/pages/login/main' });
  }
  return res;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(method, url, body) {
  const token = wx.getStorageSync('token');
  // Do something with return value
  method = method.toUpperCase();
  if (method === 'GET') {
    body = undefined;
  } else {
    body = body && JSON.stringify(body);
  }
  wx.showLoading({ title: '数据加载中' });
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      method,
      header: {
        'content-type': 'application/json',
        authorization: token ? `Bearer ${token}` : undefined,
      },
      data: body,
      success: function (res) {
        resolve(res.data);
      },
      fail: function (err) {
        reject(err);
      },
      complete: function () {
        wx.hideLoading();
      },
    });
  })
    .then(res => processRes(res))
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

export const get = url => request('GET', url);
export const post = (url, body) => request('POST', url, body);
export const put = (url, body) => request('PUT', url, body);
export const del = (url, body) => request('DELETE', url, body);
