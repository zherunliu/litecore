import { isTracking, trackEffect, triggerEffect } from "./effect";
import { hasChanged, isObject } from "./shared/extend";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _rawValue;
  public dep;
  public __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  // 基本类型使用原生 getter setter 节省开销
  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffect(this.dep);
    }
  }
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(raw) {
  return new RefImpl(raw);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRef(objectWithRef) {
  return new Proxy(objectWithRef, {
    get(target, key) {
      return unref(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
