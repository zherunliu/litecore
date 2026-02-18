import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./createVNode";

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;

  function render(vNode, container) {
    patch(vNode, container, null);
  }

  // recursion
  function patch(vNode, container, parentComponent) {
    const { type, shapeFlags } = vNode;

    switch (type) {
      case Fragment:
        processFragment(vNode, container, parentComponent);
        break;
      case Text:
        processText(vNode, container);
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(vNode, container, parentComponent);
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vNode, container, parentComponent);
        }
    }
  }

  function processFragment(vNode, container, parentComponent) {
    mountChildren(vNode, container, parentComponent);
  }

  function processText(vNode, container) {
    const textNode = (vNode.el = document.createTextNode(vNode.children));
    container.append(textNode);
  }

  function processElement(vNode, container, parentComponent) {
    mountElement(vNode, container, parentComponent);
  }

  function mountElement(vNode, container, parentComponent) {
    const { type, props, children, shapeFlags } = vNode;
    const el: Element = (vNode.el = createElement(type));

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vNode, el, parentComponent);
    }

    for (const key in props) {
      const val = props[key];
      patchProp(el, key, val);
    }
    container.append(el);
    insert(el, container);
  }

  function mountChildren(vNode, container, parentComponent) {
    vNode.children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }

  function processComponent(vNode, container, parentComponent) {
    mountComponent(vNode, container, parentComponent);
  }

  function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    // bind context
    const subTree = instance.render.call(proxy);
    patch(subTree, container, instance);
    // root element
    initialVNode.el = subTree.el;
  }

  return {
    createApp: createAppApi(render),
  };
}
