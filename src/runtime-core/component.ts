import { PublicInstanceProxyHandler } from "./componentPublicInstance";
import { initProps } from "./componentProps";
import { shallowReadonly } from "../reactivity/reactive";

export function createComponentInstance(vNode) {
  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
    props: {},
  };
  return component;
}

export function setupComponent(instance) {
  // initProps, initSlots
  initProps(instance, instance.vNode.props);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const component = instance.type;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandler);
  const { setup } = component;
  if (setup) {
    // Return: function | object
    const setupResult = setup(shallowReadonly(instance.props));
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
