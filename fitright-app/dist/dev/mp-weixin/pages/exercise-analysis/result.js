"use strict";
const common_vendor = require("../../common/vendor.js");
const api_analysis = require("../../api/analysis.js");
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
      if (id) {
        loadResult(id);
      }
    });
    const loadResult = async (id) => {
      try {
        result.value = await api_analysis.getAnalysisResult(id);
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(result.value.score || "--"),
        b: common_vendor.t(result.value.exercise_type || "动作分析"),
        c: result.value.issues && result.value.issues.length
      }, result.value.issues && result.value.issues.length ? {
        d: common_vendor.f(result.value.issues, (issue, idx, i0) => {
          return {
            a: common_vendor.t(issue.severity),
            b: common_vendor.n("severity-" + issue.severity),
            c: common_vendor.t(issue.title),
            d: common_vendor.t(issue.description),
            e: common_vendor.t(issue.harm),
            f: common_vendor.t(issue.suggestion),
            g: idx
          };
        })
      } : {}, {
        e: result.value.overall_suggestion
      }, result.value.overall_suggestion ? {
        f: common_vendor.t(result.value.overall_suggestion)
      } : {}, {
        g: loading.value
      }, loading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-47ffe04f"]]);
wx.createPage(MiniProgramPage);
