import { h, ref } from "../../lib/lite-core.esm.js";
import { Child } from "./Child.js";

export const App = {
  name: "App",
  setup() {
    const msg = ref("hello");
    const count = ref(0);

    window.msg = msg;
    const changeChildProps = () => {
      msg.value = "world";
    };
    const changeCount = () => {
      count.value++;
    };

    return {
      msg,
      count,
      changeChildProps,
      changeCount,
    };
  },

  render() {
    return h("div", {}, [
      h("h1", {}, "componentUpdate"),
      h("button", { onClick: this.changeChildProps }, "changeChildProps"),
      h(Child, { msg: this.msg }),
      h("button", { onClick: this.changeCount }, "changeCount"),
      h("p", {}, "count:" + this.count),
    ]);
  },
};
