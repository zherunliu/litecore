import { h } from "../../lib/lite-core.esm.js";
import { Foo } from "./Foo.js";
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
      [
        h("div", {}, "hi, " + this.msg),
        h(Foo, {
          count: 1,
          onAdd(a, b) {
            console.log("onAdd", a, b);
          },
          onAddFoo() {
            console.log("onAddFoo");
          },
        }),
      ],
      // [(h("p", {}, "p1"), h("p", {}, "p2"))],
    );
  },
  setup() {
    return {
      msg: "lite-core",
    };
  },
};
