import { h, getCurrentInstance } from "../../lib/lite-core.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log("Foo setup: ", instance);
  },
  render() {
    return h("p", {}, "foo");
  },
};
