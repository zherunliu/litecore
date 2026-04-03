import { h } from "../../dist/lite-core.esm.js";

export const Child = {
  name: "Child",
  setup(props, { emit }) {},
  render(proxy) {
    return h("div", {}, [
      h("div", {}, "child - props - msg:" + this.$props.msg),
    ]);
  },
};
