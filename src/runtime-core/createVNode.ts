import { ShapeFlags } from "../shared/ShapeFlags";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export { createVNode as createElementVNode };

export function createVNode(type, props?, children?) {
  const vNode = {
    type,
    props,
    children,
    component: null,
    key: props && props.key,
    shapeFlags: getShapeFlags(type),
    el: null, // 真实 dom
  };

  if (typeof children === "string") {
    vNode.shapeFlags |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vNode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN;
  }

  if (vNode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vNode.shapeFlags |= ShapeFlags.SLOT_CHILDREN;
    }
  }

  return vNode;
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}

function getShapeFlags(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
