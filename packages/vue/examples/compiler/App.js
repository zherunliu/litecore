import { ref } from "../../dist/lite-core.esm.js";

export const App = {
  name: "App",
  template: `<div>hello, {{ count }}</div>`,
  setup() {
    const count = (window.count = ref(0));
    return {
      count,
    };
  },
};
