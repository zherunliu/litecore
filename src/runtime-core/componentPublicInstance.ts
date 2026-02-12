const publicPropertiesMap = {
  $el: (i) => i.vNode.el,
};

export const PublicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
