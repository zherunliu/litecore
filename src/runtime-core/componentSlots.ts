import { ShapeFlags } from "../shared/ShapeFlags";

export function initSlots(instance, children) {
  const { vNode } = instance;
  if (vNode.shapeFlags & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];
    slots[key] = (prop) => normalizeSlotValue(value(prop));
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
