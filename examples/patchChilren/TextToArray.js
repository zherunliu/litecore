import { ref, h } from "../../lib/lite-core.esm.js";

const prevChildren = "prevChildren";
const nextChildren = [h("div", {}, "A"), h("div", {}, "B"), h("div", {}, "C")];

export default {
  name: "TextToArray",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;
    return {
      isChange,
    };
  },

  render() {
    const self = this;
    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
