import { h } from "../../lib/lite-core.esm.js";

window.self = null;
export const App = {
  // template
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        onClick: () => {
          console.log("click");
        },
        onMouseDown: () => {
          console.log("mousedown");
        },
      },
      [h("p", {}, "hi, " + this.msg), h("p", {}, "p1"), h("p", {}, "p2")],
    );
  },
  setup() {
    return {
      msg: "lite-core",
    };
  },
};
