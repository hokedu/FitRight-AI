"use strict";
const common_vendor = require("../../common/vendor.js");
const api_posture = require("../../api/posture.js");
const _sfc_main = {
  __name: "result",
  setup(__props) {
    const result = common_vendor.ref({});
    const loading = common_vendor.ref(true);
    common_vendor.onMounted(() => {
      var _a, _b, _c;
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const id = ((_b = (_a = page.$page) == null ? void 0 : _a.options) == null ? void 0 : _b.id) || ((_c = page.options) == null ? void 0 : _c.id);
      if (id) loadResult(id);
    });
    const loadResult = async (id) => {
      try {
        result.value = await api_posture.getPostureResult(id);
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(result.value.overall_rating || "--"),
        b: common_vendor.n("rating-" + (result.value.overall_rating || "")),
        c: result.value.issues && result.value.issues.length
      }, result.value.issues && result.value.issues.length ? {
        d: common_vendor.f(result.value.issues, (issue, idx, i0) => {
          return {
            a: common_vendor.t(issue.name),
            b: common_vendor.t(issue.severity),
            c: common_vendor.n("severity-" + issue.severity),
            d: common_vendor.t(issue.description),
            e: common_vendor.t(issue.cause),
            f: common_vendor.t(issue.health_risk),
            g: idx
          };
        })
      } : {}, {
        e: result.value.training_plan
      }, result.value.training_plan ? {
        f: common_vendor.t(result.value.training_plan.title || "改善训练方案"),
        g: common_vendor.t(result.value.training_plan.frequency),
        h: common_vendor.f(result.value.training_plan.exercises || [], (ex, idx, i0) => {
          return {
            a: common_vendor.t(idx + 1),
            b: common_vendor.t(ex.name),
            c: common_vendor.t(ex.sets),
            d: common_vendor.t(ex.reps),
            e: common_vendor.t(ex.tips),
            f: idx
          };
        })
      } : {}, {
        i: loading.value
      }, loading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e3163118"]]);
wx.createPage(MiniProgramPage);
