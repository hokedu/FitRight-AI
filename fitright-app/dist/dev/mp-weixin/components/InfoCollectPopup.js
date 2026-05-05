"use strict";
const common_vendor = require("../common/vendor.js");
const totalSteps = 4;
const _sfc_main = {
  __name: "InfoCollectPopup",
  props: { visible: Boolean },
  emits: ["close", "submit"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const currentStep = common_vendor.ref(1);
    const form = common_vendor.reactive({
      gender: "",
      age: "",
      height: "",
      weight: "",
      training_goal: "",
      training_exp: "",
      training_pref: "",
      session_duration: "",
      focus_areas: []
    });
    const goalOptions = ["增肌", "减脂", "塑形", "体能提升", "康复训练"];
    const expOptions = ["新手", "初级", "中级", "高级"];
    const prefOptions = ["健身房", "徒手", "家庭器械"];
    const durationOptions = ["30分钟", "45分钟", "60分钟", "90分钟"];
    const areaOptions = ["胸部", "背部", "腿部", "肩部", "手臂", "核心", "全身"];
    const toggleArea = (item) => {
      const idx = form.focus_areas.indexOf(item);
      if (idx > -1) {
        form.focus_areas.splice(idx, 1);
      } else {
        form.focus_areas.push(item);
      }
    };
    const prevStep = () => {
      if (currentStep.value > 1) currentStep.value--;
    };
    const nextStep = () => {
      if (currentStep.value < totalSteps) currentStep.value++;
    };
    const submit = () => {
      emit("submit", { ...form });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.visible
      }, __props.visible ? common_vendor.e({
        b: common_vendor.t(currentStep.value),
        c: common_vendor.t(totalSteps),
        d: currentStep.value === 1
      }, currentStep.value === 1 ? {
        e: form.gender === "男" ? 1 : "",
        f: common_vendor.o(($event) => form.gender = "男"),
        g: form.gender === "女" ? 1 : "",
        h: common_vendor.o(($event) => form.gender = "女"),
        i: form.age,
        j: common_vendor.o(($event) => form.age = $event.detail.value),
        k: form.height,
        l: common_vendor.o(($event) => form.height = $event.detail.value),
        m: form.weight,
        n: common_vendor.o(($event) => form.weight = $event.detail.value)
      } : {}, {
        o: currentStep.value === 2
      }, currentStep.value === 2 ? {
        p: common_vendor.f(goalOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: form.training_goal === item ? 1 : "",
            d: common_vendor.o(($event) => form.training_goal = item, item)
          };
        })
      } : {}, {
        q: currentStep.value === 3
      }, currentStep.value === 3 ? {
        r: common_vendor.f(expOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: form.training_exp === item ? 1 : "",
            d: common_vendor.o(($event) => form.training_exp = item, item)
          };
        }),
        s: common_vendor.f(prefOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: form.training_pref === item ? 1 : "",
            d: common_vendor.o(($event) => form.training_pref = item, item)
          };
        })
      } : {}, {
        t: currentStep.value === 4
      }, currentStep.value === 4 ? {
        v: common_vendor.f(durationOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: form.session_duration === item ? 1 : "",
            d: common_vendor.o(($event) => form.session_duration = item, item)
          };
        }),
        w: common_vendor.f(areaOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: form.focus_areas.includes(item) ? 1 : "",
            d: common_vendor.o(($event) => toggleArea(item), item)
          };
        })
      } : {}, {
        x: common_vendor.f(totalSteps, (i, k0, i0) => {
          return {
            a: i,
            b: i <= currentStep.value ? 1 : ""
          };
        }),
        y: currentStep.value > 1
      }, currentStep.value > 1 ? {
        z: common_vendor.o(prevStep)
      } : {}, {
        A: currentStep.value < totalSteps
      }, currentStep.value < totalSteps ? {
        B: common_vendor.o(nextStep)
      } : {}, {
        C: currentStep.value === totalSteps
      }, currentStep.value === totalSteps ? {
        D: common_vendor.o(submit)
      } : {}, {
        E: common_vendor.o(() => {
        })
      }) : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a0434410"]]);
wx.createComponent(Component);
