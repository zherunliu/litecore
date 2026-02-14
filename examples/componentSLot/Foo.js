import { h, renderSlots } from "../../lib/lite-core.esm.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const age = 20;
    const foo = h("p", {}, "foo");
    // Foo.vNode.children
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
