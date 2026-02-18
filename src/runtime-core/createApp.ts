import { createVNode } from "./createVNode";

export function createAppApi(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // component -> vNode
        const vNode = createVNode(rootComponent);
        render(vNode, rootContainer);
      },
    };
  };
}
