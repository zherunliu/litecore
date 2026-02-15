import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./createVNode";

export function render(vNode, container) {
  patch(vNode, container);
}

// recursion
function patch(vNode, container) {
  const { type, shapeFlags } = vNode;

  switch (type) {
    case Fragment:
      processFragment(vNode, container);
      break;
    case Text:
      processText(vNode, container);
      break;
    default:
      if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vNode, container);
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vNode, container);
      }
  }
}

function processFragment(vNode, container) {
  mountChildren(vNode, container);
}

function processText(vNode, container) {
  const textNode = (vNode.el = document.createTextNode(vNode.children));
  container.append(textNode);
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
