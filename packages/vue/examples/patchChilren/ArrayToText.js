import { ref, h } from "../../dist/lite-core.esm.js";

const prevChildren = [h("div", {}, "A"), h("div", {}, "B"), h("div", {}, "C")];
const nextChildren = "newChildren";

export default {
  name: "ArrayToText",
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
