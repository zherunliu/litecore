import { ref, h } from "../../dist/lite-core.esm.js";

const prevChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "H" }, "H"),
  h("div", { key: "C", id: "prev-c" }, "C"),
  h("div", { key: "D" }, "D"),
  h("div", { key: "G" }, "G"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "F" }, "F"),
];
const nextChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "D" }, "D"),
  h("div", { key: "C", id: "next-c" }, "C"),
  h("div", { key: "I" }, "I"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "F" }, "F"),
];

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
