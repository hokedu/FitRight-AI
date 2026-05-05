"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const api_user = require("../../api/user.js");
if (!Math) {
  InfoCollectPopup();
}
const InfoCollectPopup = () => "../../components/InfoCollectPopup.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const messages = common_vendor.ref([]);
    const inputText = common_vendor.ref("");
    const isLoading = common_vendor.ref(false);
    const scrollTop = common_vendor.ref(0);
    const showInfoPopup = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      messages.value.push({
        role: "assistant",
        content: "你好！我是 FitRight AI 健身助手。我可以帮你定制专属训练计划，解答健身问题。请告诉我你的健身目标？"
      });
      if (!userStore.isInfoCollected) {
        setTimeout(() => {
          showInfoPopup.value = true;
        }, 500);
      }
    });
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        scrollTop.value = scrollTop.value === 99999 ? 99998 : 99999;
      });
    };
    const onInfoSubmit = async (info) => {
      showInfoPopup.value = false;
      userStore.setFitnessInfo(info);
      try {
        await api_user.updateFitnessInfo(info);
      } catch (e) {
      }
      messages.value.push({
        role: "assistant",
        content: `已收到你的信息！${info.gender}，${info.age}岁，${info.height}cm/${info.weight}kg，训练目标：${info.training_goal}，经验：${info.training_exp}。现在可以问我任何健身问题，或者让我帮你制定训练计划！`
      });
      scrollToBottom();
    };
    const quickSend = (text) => {
      inputText.value = text;
      sendMessage();
    };
    const sendMessage = async () => {
      const text = inputText.value.trim();
      if (!text || isLoading.value) return;
      messages.value.push({ role: "user", content: text });
      inputText.value = "";
      isLoading.value = true;
      scrollToBottom();
      try {
        const token = common_vendor.index.getStorageSync("token");
        const BASE_URL = "http://localhost:8000/api/v1";
        const res = await new Promise((resolve, reject) => {
          let fullContent = "";
          common_vendor.index.request({
            url: `${BASE_URL}/chat/send`,
            method: "POST",
            header: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            data: { message: text },
            success: (res2) => {
              if (res2.data && res2.data.content) {
                messages.value.push({ role: "assistant", content: res2.data.content });
              }
              resolve(res2.data);
            },
            fail: reject
          });
        });
      } catch (e) {
        messages.value.push({
          role: "assistant",
          content: "抱歉，网络出现了问题，请稍后重试。"
        });
      } finally {
        isLoading.value = false;
        scrollToBottom();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: messages.value.length <= 1
      }, messages.value.length <= 1 ? {
        b: common_vendor.o(($event) => quickSend("帮我制定一份增肌训练计划")),
        c: common_vendor.o(($event) => quickSend("帮我制定一份减脂方案")),
        d: common_vendor.o(($event) => quickSend("帮我安排一周的训练计划"))
      } : {}, {
        e: common_vendor.f(messages.value, (msg, idx, i0) => {
          return common_vendor.e({
            a: msg.role === "assistant"
          }, msg.role === "assistant" ? {} : {}, {
            b: msg.role === "assistant"
          }, msg.role === "assistant" ? {} : {}, {
            c: common_vendor.t(msg.content),
            d: common_vendor.n("bubble-" + msg.role),
            e: idx,
            f: common_vendor.n("msg-" + msg.role)
          });
        }),
        f: isLoading.value
      }, isLoading.value ? {} : {}, {
        g: scrollTop.value,
        h: common_vendor.o(sendMessage),
        i: inputText.value,
        j: common_vendor.o(($event) => inputText.value = $event.detail.value),
        k: inputText.value.trim() ? 1 : "",
        l: common_vendor.o(sendMessage),
        m: common_vendor.o(($event) => showInfoPopup.value = false),
        n: common_vendor.o(onInfoSubmit),
        o: common_vendor.p({
          visible: showInfoPopup.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-da04a0a0"]]);
wx.createPage(MiniProgramPage);
