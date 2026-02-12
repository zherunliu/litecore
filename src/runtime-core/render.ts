import { isObject } from "../shared/extend";
import { createComponentInstance, setupComponent } from "./component";

export function render(vNode, container) {
  patch(vNode, container);
}

// recursion
function patch(vNode, container) {
  if (typeof vNode.type === "string") {
    processElement(vNode, container);
  } else if (isObject(vNode.type)) {
    processComponent(vNode, container);
  }
}

function processElement(vNode, container) {
  mountElement(vNode, container);
}

function mountElement(vNode, container) {
  const { type, props, children } = vNode;
  const el: Element = (vNode.el = document.createElement(type));

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vNode, el);
  }

  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}

function mountChildren(vNode, container) {
  vNode.children.forEach((v) => {
    patch(v, container);
  });
}

function processComponent(vNode, container) {
  mountComponent(vNode, container);
}

function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  // bind context
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
  // root element
  initialVNode.el = subTree.el;
}
