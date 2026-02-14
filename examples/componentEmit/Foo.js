import { h } from "../../lib/lite-core.esm.js";

export const Foo = {
  setup(props, { emit }) {
    console.log(props);
    props.count++;
    const emitAdd = () => {
      console.log("emit");
      emit("add", 1, 2);
      emit("add-foo");
    };
    return { emitAdd };
  },
  render() {
    const btn = h("button", { onClick: this.emitAdd }, "emitAdd");
    const foo = h("p", {}, "foo: " + this.count);
    return h("div", {}, [foo, btn]);
  },
};
