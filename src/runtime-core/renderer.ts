import { effect } from "../reactivity/effect";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./createVNode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vNode, container) {
    patch(null, vNode, container, null);
  }

  // recursion
  function patch(prevNode, vNode, container, parentComponent) {
    const { type, shapeFlags } = vNode;

    switch (type) {
      case Fragment:
        processFragment(prevNode, vNode, container, parentComponent);
        break;
      case Text:
        processText(prevNode, vNode, container);
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(prevNode, vNode, container, parentComponent);
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(prevNode, vNode, container, parentComponent);
        }
    }
  }

  function processFragment(prevNode, vNode, container, parentComponent) {
    mountChildren(vNode.children, container, parentComponent);
  }

  function processText(prevNode, vNode, container) {
    const textNode = (vNode.el = document.createTextNode(vNode.children));
    container.append(textNode);
  }

  function processElement(prevNode, vNode, container, parentComponent) {
    if (!prevNode) {
      mountElement(vNode, container, parentComponent);
    } else {
      patchElement(prevNode, vNode, container, parentComponent);
    }
  }

  function patchElement(prevNode, vNode, container, parentComponent) {
    console.log("prev", prevNode);
    console.log("vnode", vNode);
    const oldProps = prevNode.props || {};
    const newProps = vNode.props || {};
    const el = (vNode.el = prevNode.el);
    patchChildren(prevNode, vNode, el, parentComponent);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(prevNode, vNode, container, parentComponent) {
    const prevShapeFlag = prevNode.shapeFlags;
    const prevChildren = prevNode.children;
    const children = vNode.children;
    const { shapeFlags } = vNode;
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChild(prevChildren);
      }
      if (prevChildren !== children) {
        hostSetElementText(container, children);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(children, container, parentComponent);
      } else {
      }
    }
  }

  function unmountChild(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }

      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    }
  }

  function mountElement(vNode, container, parentComponent) {
    const { type, props, children, shapeFlags } = vNode;
    const el: Element = (vNode.el = hostCreateElement(type));

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vNode.children, el, parentComponent);
    }

    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }
    hostInsert(el, container);
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function processComponent(prevNode, vNode, container, parentComponent) {
    mountComponent(vNode, container, parentComponent);
  }

  function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance, initialVNode, container) {
    effect(() => {
      // init
      if (!instance.isMounted) {
        const { proxy } = instance;
        // bind context
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance);
        // root element
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // update
        const { proxy } = instance;
        // bind context
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppApi(render),
  };
}
