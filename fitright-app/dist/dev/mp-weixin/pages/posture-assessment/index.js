"use strict";
const common_vendor = require("../../common/vendor.js");
const api_posture = require("../../api/posture.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const images = common_vendor.ref({ front: "", side: "", back: "" });
    const analyzing = common_vendor.ref(false);
    const canSubmit = common_vendor.computed(() => {
      return images.value.front && images.value.side && images.value.back && !analyzing.value;
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const chooseImage = (type) => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          images.value[type] = res.tempFilePaths[0];
        }
      });
    };
    const startAssessment = async () => {
      if (!canSubmit.value) {
        common_vendor.index.showToast({ title: "请上传三张照片", icon: "none" });
        return;
      }
      analyzing.value = true;
      const token = common_vendor.index.getStorageSync("token");
      const BASE_URL = "http://localhost:8000/api/v1";
      try {
        const uploadImg = (filePath, name) => {
          return new Promise((resolve, reject) => {
            common_vendor.index.uploadFile({
              url: `${BASE_URL}/posture/upload`,
              filePath,
              name,
              formData: {
                front_image: name === "front_image" ? "true" : "false",
                side_image: name === "side_image" ? "true" : "false",
                back_image: name === "back_image" ? "true" : "false"
              },
              header: { Authorization: `Bearer ${token}` },
              success: (res) => resolve(JSON.parse(res.data)),
              fail: reject
            });
          });
        };
        const result = await uploadImg(images.value.front, "front_image");
        pollResult(result.id);
      } catch (e) {
        analyzing.value = false;
        common_vendor.index.showToast({ title: "上传失败，请重试", icon: "none" });
      }
    };
    const pollResult = (assessmentId) => {
      let retries = 0;
      const timer = setInterval(async () => {
        retries++;
        try {
          const result = await api_posture.getPostureResult(assessmentId);
          if (result.status === "completed") {
            clearInterval(timer);
            analyzing.value = false;
            common_vendor.index.navigateTo({
              url: `/pages/posture-assessment/result?id=${assessmentId}`
            });
          } else if (result.status === "failed" || retries >= 60) {
            clearInterval(timer);
            analyzing.value = false;
            common_vendor.index.showToast({ title: "评估失败，请重试", icon: "none" });
          }
        } catch (e) {
          if (retries >= 60) {
            clearInterval(timer);
            analyzing.value = false;
          }
        }
      }, 2e3);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: images.value.front
      }, images.value.front ? {
        c: images.value.front
      } : {}, {
        d: common_vendor.o(($event) => chooseImage("front")),
        e: images.value.side
      }, images.value.side ? {
        f: images.value.side
      } : {}, {
        g: common_vendor.o(($event) => chooseImage("side")),
        h: images.value.back
      }, images.value.back ? {
        i: images.value.back
      } : {}, {
        j: common_vendor.o(($event) => chooseImage("back")),
        k: !analyzing.value
      }, !analyzing.value ? {} : {}, {
        l: !canSubmit.value ? 1 : "",
        m: common_vendor.o(startAssessment)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4d22f956"]]);
wx.createPage(MiniProgramPage);
