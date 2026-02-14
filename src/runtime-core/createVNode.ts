import { ShapeFlags } from "../shared/ShapeFlags";

export function createVNode(type, props?, children?) {
  const vNode = {
    type,
    props,
    children,
    shapeFlags: getShapeFlags(type),
    el: null,
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

function getShapeFlags(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
