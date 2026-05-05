"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userInfo = common_vendor.ref({
      nickname: "健身达人",
      signature: "坚持就是胜利"
    });
    const stats = common_vendor.ref({
      totalDays: 28,
      weekCount: 4,
      totalHours: 12.5
    });
    const weekDays = common_vendor.ref([
      { label: "一", done: true },
      { label: "二", done: true },
      { label: "三", done: false },
      { label: "四", done: true },
      { label: "五", done: true },
      { label: "六", done: false },
      { label: "日", done: false }
    ]);
    const completionRate = common_vendor.computed(() => {
      const done = weekDays.value.filter((d) => d.done).length;
      return Math.round(done / 7 * 100);
    });
    const goSettings = () => {
      common_vendor.index.showToast({ title: "设置功能开发中", icon: "none" });
    };
    const goTrainingPlan = () => {
      common_vendor.index.showToast({ title: "训练计划功能开发中", icon: "none" });
    };
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goSettings),
        b: common_vendor.t(userInfo.value.nickname || "健身达人"),
        c: common_vendor.t(userInfo.value.signature || "坚持就是胜利"),
        d: common_vendor.t(stats.value.totalDays),
        e: common_vendor.t(stats.value.weekCount),
        f: common_vendor.t(stats.value.totalHours),
        g: common_vendor.f(weekDays.value, (day, idx, i0) => {
          return common_vendor.e({
            a: day.done
          }, day.done ? {} : {}, {
            b: day.done ? 1 : "",
            c: common_vendor.t(day.label),
            d: idx
          });
        }),
        h: common_vendor.t(completionRate.value),
        i: completionRate.value + "%",
        j: common_vendor.o(goTrainingPlan)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f97f9319"]]);
wx.createPage(MiniProgramPage);
