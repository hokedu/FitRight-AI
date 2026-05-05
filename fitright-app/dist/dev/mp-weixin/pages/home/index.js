"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const goToExercise = () => {
      common_vendor.index.navigateTo({ url: "/pages/exercise-analysis/index" });
    };
    const goToPosture = () => {
      common_vendor.index.navigateTo({ url: "/pages/posture-assessment/index" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goToExercise),
        b: common_vendor.o(goToPosture)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2c5296db"]]);
wx.createPage(MiniProgramPage);
