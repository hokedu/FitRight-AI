"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/index.js";
  "./pages/chat/index.js";
  "./pages/profile/index.js";
  "./pages/exercise-analysis/index.js";
  "./pages/exercise-analysis/result.js";
  "./pages/posture-assessment/index.js";
  "./pages/posture-assessment/result.js";
  "./pages/login/index.js";
}
const _sfc_main = {
  onLaunch() {
    console.log("FitRight AI App Launch");
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
