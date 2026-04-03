import { hasOwn } from "@lite-core/shared";

const publicPropertiesMap = {
  $el: (i) => i.vNode.el,
  $slots: (i) => i.slots,
  $props: (i) => i.props,
};

export const PublicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;

    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
