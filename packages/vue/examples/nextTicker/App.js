import {
  ref,
  h,
  getCurrentInstance,
  nextTick,
} from "../../dist/lite-core.esm.js";

export const App = {
  name: "App",
  setup() {
    const count = ref(0);
    const instance = getCurrentInstance();
    function increment100() {
      for (let i = 0; i < 100; i++) {
        console.log("increment100", i);
        count.value++;
      }
      console.log(instance.vNode.el.innerText);
      nextTick(() => {
        console.log("nextTick", instance.vNode.el.innerText);
      });
    }
    return {
      count,
      increment100,
    };
  },

  render() {
    const button = h("button", { onClick: this.increment100 }, "Increment100");
    const count = h("p", {}, `Count: ${this.count}`);
    return h("div", {}, [button, count]);
  },
};
