import { h, ref } from "../../lib/lite-core.esm.js";

export const App = {
  name: "App",
  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
      console.log(count.value);
    };
    const props = ref({
      foo: "foo",
      bar: "bar",
    });
    const onChangeFoo = () => {
      props.value.foo = "newFoo";
    };
    const onSetFooNull = () => {
      props.value.foo = null;
    };
    const onDelBar = () => {
      props.value = {
        foo: "foo",
      };
    };
    return {
      count,
      props,
      onClick,
      onChangeFoo,
      onSetFooNull,
      onDelBar,
    };
  },
  render() {
    return h("div", { id: "root", ...this.props }, [
      h("p", {}, `count: ${this.count}`),
      h("p", {}, `props: foo - ${this.props.foo}, bar - ${this.props.bar}`),
      h("button", { onClick: this.onClick }, "+1"),
      h("button", { onClick: this.onChangeFoo }, "changeFoo"),
      h("button", { onClick: this.onSetFooNull }, "setFooNull"),
      h("button", { onClick: this.onDelBar }, "delBar"),
    ]);
  },
};
