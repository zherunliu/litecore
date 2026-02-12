import { h } from "../../lib/lite-core.esm.js";

export const App = {
  // template
  render() {
    return h("div", { id: "root" }, [h("p", {}, "p1"), h("p", {}, "p2")]);
  },
  setup() {
    return {
      msg: "lite-core",
    };
  },
};
