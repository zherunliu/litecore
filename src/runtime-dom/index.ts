import { createRenderer } from "../runtime-core";

function createElement(type) {
  return document.createElement(type);
}

function patchProp(el, key, val) {
  if (key.startsWith("on")) {
    const eventName = key.substring(2).toLowerCase();
    el.addEventListener(eventName, val);
  } else {
    el.setAttribute(key, val);
  }
}

function insert(el, container) {
  container.append(el);
}

const renderer: any = createRenderer({ createElement, patchProp, insert });

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core";
