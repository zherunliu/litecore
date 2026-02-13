import { isObject } from "../shared/extend";
import {
  mutableHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from "./baseHandler";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandler);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandler);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandler);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function createReactiveObject(raw: any, baseHandler) {
  if (!isObject(raw)) {
    console.warn(`value cannot be made reactive: ${String(raw)}`);
  }
  return new Proxy(raw, baseHandler);
}
