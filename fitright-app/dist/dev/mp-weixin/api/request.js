"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8000/api/v1";
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    common_vendor.index.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data,
      header: {
        "Content-Type": "application/json",
        ...token ? { Authorization: `Bearer ${token}` } : {},
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.reLaunch({ url: "/pages/login/index" });
          reject(new Error("未授权"));
          return;
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          common_vendor.index.showToast({ title: res.data.detail || "请求失败", icon: "none" });
          reject(res.data);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({ title: "网络异常", icon: "none" });
        reject(err);
      }
    });
  });
};
const uploadFile = (options) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    const uploadTask = common_vendor.index.uploadFile({
      url: BASE_URL + options.url,
      filePath: options.filePath,
      name: options.name || "file",
      formData: options.formData || {},
      header: {
        ...token ? { Authorization: `Bearer ${token}` } : {}
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(res.data));
        } else {
          reject(JSON.parse(res.data));
        }
      },
      fail: reject
    });
    if (options.onProgress) {
      uploadTask.onProgressUpdate(options.onProgress);
    }
  });
};
exports.request = request;
exports.uploadFile = uploadFile;
