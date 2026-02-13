import { isObject } from "../shared/extend";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vNode, container) {
  patch(vNode, container);
}

// recursion
function patch(vNode, container) {
  const { shapeFlags } = vNode;
  if (shapeFlags & ShapeFlags.ELEMENT) {
    processElement(vNode, container);
  } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vNode, container);
  }
}

function processElement(vNode, container) {
  mountElement(vNode, container);
}

function mountElement(vNode, container) {
  const { type, props, children, shapeFlags } = vNode;
  const el: Element = (vNode.el = document.createElement(type));

  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vNode, el);
  }

  for (const key in props) {
    const val = props[key];
    if (key.startsWith("on")) {
      const eventName = key.substring(2).toLowerCase();
      el.addEventListener(eventName, val);
    } else {
      el.setAttribute(key, val);
    }
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
