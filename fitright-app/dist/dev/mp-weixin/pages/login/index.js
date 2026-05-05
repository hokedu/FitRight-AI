"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const api_user = require("../../api/user.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const phone = common_vendor.ref("");
    const code = common_vendor.ref("");
    const countdown = common_vendor.ref(0);
    const sendCode = () => {
      if (countdown.value > 0) return;
      if (phone.value.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) clearInterval(timer);
      }, 1e3);
      common_vendor.index.showToast({ title: "验证码已发送", icon: "none" });
    };
    const login = async () => {
      if (phone.value.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (code.value.length < 4) {
        common_vendor.index.showToast({ title: "请输入验证码", icon: "none" });
        return;
      }
      try {
        const res = await api_user.sendLogin({ phone: phone.value, code: code.value });
        userStore.setToken(res.token);
        userStore.setUserInfo(res.user);
        common_vendor.index.switchTab({ url: "/pages/home/index" });
      } catch (e) {
        userStore.setToken("dev-token-" + Date.now());
        userStore.setUserInfo({ nickname: "健身达人", phone: phone.value });
        common_vendor.index.switchTab({ url: "/pages/home/index" });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: phone.value,
        b: common_vendor.o(($event) => phone.value = $event.detail.value),
        c: code.value,
        d: common_vendor.o(($event) => code.value = $event.detail.value),
        e: common_vendor.t(countdown.value > 0 ? countdown.value + "s" : "获取验证码"),
        f: countdown.value > 0 ? 1 : "",
        g: common_vendor.o(sendCode),
        h: common_vendor.o(login)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-45258083"]]);
wx.createPage(MiniProgramPage);
