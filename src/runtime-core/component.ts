import { PublicInstanceProxyHandler } from "./componentPublicInstance";
import { initProps } from "./componentProps";
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlots";
import { proxyRef } from "../reactivity";

export function createComponentInstance(vNode, parent) {
  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
    props: {},
    slots: {},
    providers: parent ? parent.providers : {},
    parent,
    isMounted: false,
    subTree: {},
    emit: () => {},
  };
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  // initProps, initSlots
  initProps(instance, instance.vNode.props);
  initSlots(instance, instance.vNode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const component = instance.type;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandler);
  const { setup } = component;
  if (setup) {
    // Return: function | object
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = proxyRef(setupResult);
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}

let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
}

// convenience for debugging
function setCurrentInstance(instance) {
  currentInstance = instance;
}
