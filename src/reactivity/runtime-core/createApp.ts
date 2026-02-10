import { createVNode } from "./createVNode";
import { render } from "./render";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // component -> vNode
      const vNode = createVNode(rootComponent);
      render(vNode, rootContainer);
    },
  };
}
