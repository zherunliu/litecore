export function createComponentInstance(vNode) {
  const component = {
    vNode,
    type: vNode.type,
  };
  return component;
}

export function setupComponent(instance) {
  // initProps, initSlots

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const component = instance.type;
  const { setup } = component;
  if (setup) {
    // Return: function | object
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
