"use strict";
const common_vendor = require("../../common/vendor.js");
const api_analysis = require("../../api/analysis.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const exerciseTypes = ["深蹲", "卧推", "硬拉", "引体向上", "俯卧撑", "弓步蹲"];
    const selectedType = common_vendor.ref("");
    const uploading = common_vendor.ref(false);
    const analyzing = common_vendor.ref(false);
    const progress = common_vendor.ref(0);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const chooseVideo = () => {
      common_vendor.index.chooseVideo({
        maxDuration: 60,
        compressed: true,
        sourceType: ["album", "camera"],
        success: (res) => {
          if (res.size > 100 * 1024 * 1024) {
            common_vendor.index.showToast({ title: "视频不能超过100MB", icon: "none" });
            return;
          }
          startUpload(res.tempFilePath);
        },
        fail: () => {
        }
      });
    };
    const startUpload = async (filePath) => {
      uploading.value = true;
      progress.value = 0;
      try {
        const result = await api_analysis.uploadVideo(filePath, selectedType.value, (res) => {
          progress.value = res.progress;
        });
        uploading.value = false;
        analyzing.value = true;
        pollResult(result.id);
      } catch (e) {
        uploading.value = false;
        common_vendor.index.showToast({ title: "上传失败，请重试", icon: "none" });
      }
    };
    const pollResult = (analysisId) => {
      let retries = 0;
      const maxRetries = 60;
      const timer = setInterval(async () => {
        retries++;
        try {
          const result = await api_analysis.getAnalysisResult(analysisId);
          if (result.status === "completed") {
            clearInterval(timer);
            analyzing.value = false;
            common_vendor.index.navigateTo({
              url: `/pages/exercise-analysis/result?id=${analysisId}`
            });
          } else if (result.status === "failed" || retries >= maxRetries) {
            clearInterval(timer);
            analyzing.value = false;
            common_vendor.index.showToast({ title: "分析失败，请重试", icon: "none" });
          }
        } catch (e) {
          if (retries >= maxRetries) {
            clearInterval(timer);
            analyzing.value = false;
            common_vendor.index.showToast({ title: "分析超时，请重试", icon: "none" });
          }
        }
      }, 2e3);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.o(chooseVideo),
        c: uploading.value
      }, uploading.value ? {
        d: progress.value + "%",
        e: common_vendor.t(progress.value)
      } : {}, {
        f: analyzing.value
      }, analyzing.value ? {} : {}, {
        g: common_vendor.f(exerciseTypes, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: selectedType.value === item ? 1 : "",
            d: common_vendor.o(($event) => selectedType.value = item, item)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-40227c42"]]);
wx.createPage(MiniProgramPage);
