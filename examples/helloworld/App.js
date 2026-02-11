import { h } from "../../lib/lite-core.esm.js";

export const App = {
  // template
  render() {
    return h("div", "hello, " + this.msg);
  },
  setup() {
    return {
      msg: "lite-core",
    };
  },
};
