import { h } from "../../lib/lite-core.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App");
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => h("p", {}, `header, age: ${age}`),
        footer: () => h("p", {}, "footer"),
      },
    );
    return h("div", {}, [app, foo]);
  },
  setup() {
    return {
      msg: "lite-core",
    };
  },
};
