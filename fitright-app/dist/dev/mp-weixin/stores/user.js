"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const token = common_vendor.ref(common_vendor.index.getStorageSync("token") || "");
  const userInfo = common_vendor.ref(null);
  const fitnessInfo = common_vendor.ref(null);
  const isInfoCollected = common_vendor.ref(common_vendor.index.getStorageSync("isInfoCollected") || false);
  const setToken = (t) => {
    token.value = t;
    common_vendor.index.setStorageSync("token", t);
  };
  const setUserInfo = (info) => {
    userInfo.value = info;
  };
  const setFitnessInfo = (info) => {
    fitnessInfo.value = info;
    isInfoCollected.value = true;
    common_vendor.index.setStorageSync("isInfoCollected", true);
  };
  const logout = () => {
    token.value = "";
    userInfo.value = null;
    fitnessInfo.value = null;
    isInfoCollected.value = false;
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("isInfoCollected");
    common_vendor.index.reLaunch({ url: "/pages/login/index" });
  };
  const isLoggedIn = () => !!token.value;
  return { token, userInfo, fitnessInfo, isInfoCollected, setToken, setUserInfo, setFitnessInfo, logout, isLoggedIn };
});
exports.useUserStore = useUserStore;
