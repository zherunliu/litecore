import { h } from "../../lib/lite-core.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
      },
      [
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
    );
  },
  setup() {
    return {};
  },
};
