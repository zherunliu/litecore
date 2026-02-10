import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter;
  private _is_dirty = true;
  private _effect;
  private _value;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._is_dirty) {
        this._is_dirty = true;
      }
    });
  }

  get value() {
    if (this._is_dirty) {
      this._is_dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
