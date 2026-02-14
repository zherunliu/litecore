import { h } from "../../lib/lite-core.esm.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    return h("div", {}, [foo]);
  },
};
