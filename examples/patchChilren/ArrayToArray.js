import { ref, h } from "../../lib/lite-core.esm.js";

const prevChildren = [h("div", {}, "A"), h("div", {}, "B"), h("div", {}, "C")];
const nextChildren = [h("div", {}, "D"), h("div", {}, "E"), h("div", {}, "F")];

export default {
  name: "ArrayToArray",
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
