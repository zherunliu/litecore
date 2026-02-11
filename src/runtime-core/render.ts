import { createComponentInstance, setupComponent } from "./component";

export function render(vNode, container) {
  patch(vNode, container);
}

function patch(vNode, container) {
  processComponent(vNode, container);
}

function processComponent(vNode, container) {
  mountComponent(vNode, container);
}

function mountComponent(vNode, container) {
  const instance = createComponentInstance(vNode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render;
  patch(subTree, container);
}
