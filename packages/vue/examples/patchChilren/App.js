import { h } from "../../dist/lite-core.esm.js";
import ArrayToText from "./ArrayToText.js";
import TextToText from "./TextToText.js";
import TextToArray from "./TextToArray.js";
import ArrayToArray from "./ArrayToArray.js";

export const App = {
  name: "App",
  setup() {},

  render() {
    return h("div", { id: 1 }, [
      h("p", {}, "homepage"),
      h(ArrayToText),
      h(TextToText),
      h(TextToArray),
      h(ArrayToArray),
    ]);
  },
};
