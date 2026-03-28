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
    patch(null, vNode, container, null, null);
  }

  // recursion
  function patch(prevNode, vNode, container, parentComponent, anchor) {
    const { type, shapeFlags } = vNode;

    switch (type) {
      case Fragment:
        processFragment(prevNode, vNode, container, parentComponent, anchor);
        break;
      case Text:
        processText(prevNode, vNode, container);
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(prevNode, vNode, container, parentComponent, anchor);
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(prevNode, vNode, container, parentComponent, anchor);
        }
    }
  }

  function processFragment(
    prevNode,
    vNode,
    container,
    parentComponent,
    anchor,
  ) {
    mountChildren(vNode.children, container, parentComponent, anchor);
  }

  function processText(prevNode, vNode, container) {
    const textNode = (vNode.el = document.createTextNode(vNode.children));
    container.append(textNode);
  }

  function processElement(prevNode, vNode, container, parentComponent, anchor) {
    if (!prevNode) {
      mountElement(vNode, container, parentComponent, anchor);
    } else {
      patchElement(prevNode, vNode, container, parentComponent, anchor);
    }
  }

  function patchElement(prevNode, vNode, container, parentComponent, anchor) {
    const oldProps = prevNode.props || {};
    const newProps = vNode.props || {};
    const el = (vNode.el = prevNode.el);
    patchChildren(prevNode, vNode, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(prevNode, vNode, container, parentComponent, anchor) {
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
        mountChildren(children, container, parentComponent, anchor);
      } else {
        // array diff array
        patchKeyedChildren(
          prevChildren,
          children,
          container,
          parentComponent,
          anchor,
        );
      }
    }
  }

  function patchKeyedChildren(
    oldChildren,
    newChildren,
    container,
    parentComponent,
    parentAnchor,
  ) {
    let left = 0;
    let oldRight = oldChildren.length - 1;
    let newRight = newChildren.length - 1;

    function isSomeVNodeType(oldVNode, newVNode) {
      return oldVNode.type === newVNode.type && oldVNode.key === newVNode.key;
    }

    // 前序对比
    while (left <= oldRight && left <= newRight) {
      const curOldChild = oldChildren[left];
      const curNewChild = newChildren[left];
      if (isSomeVNodeType(curOldChild, curNewChild)) {
        patch(
          curOldChild,
          curNewChild,
          container,
          parentComponent,
          parentAnchor,
        );
      } else {
        break;
      }
      left++;
    }

    // 后序对比
    while (left <= oldRight && left <= newRight) {
      const curOldVNode = oldChildren[oldRight];
      const curNewVNode = newChildren[newRight];
      if (isSomeVNodeType(curOldVNode, curNewVNode)) {
        patch(
          curOldVNode,
          curNewVNode,
          container,
          parentComponent,
          parentAnchor,
        );
      } else {
        break;
      }
      oldRight--;
      newRight--;
    }

    // 旧节点全 patch，新增
    if (left > oldRight) {
      if (left <= newRight) {
        const anchor =
          newRight + 1 < newChildren.length
            ? newChildren[newRight + 1].el
            : null;
        while (left <= newRight) {
          patch(null, newChildren[left], container, parentComponent, anchor);
          left++;
        }
      }
      // 新节点全 patch，删除
    } else if (left > newRight) {
      while (left <= oldRight) {
        hostRemove(oldChildren[left].el);
        left++;
      }
      // 乱序
    } else {
      const toBePatched = newRight - left + 1;
      let patched = 0;
      const key2newIndexMap = new Map();
      const newIndex2oldIndex = new Array(toBePatched).fill(0);
      let moved = false;
      let maxNewIndexSoFar = 0;

      for (let i = left; i <= newRight; i++) {
        const curNewChild = newChildren[i];
        key2newIndexMap.set(curNewChild.key, i);
      }
      for (let i = left; i <= oldRight; i++) {
        const curOldChild = oldChildren[i];
        if (patched >= toBePatched) {
          hostRemove(curOldChild.el);
          continue;
        }
        let newIndex;
        if (curOldChild.key != null) {
          newIndex = key2newIndexMap.get(curOldChild.key);
        } else {
          for (let j = left; j <= newRight; j++) {
            if (isSomeVNodeType(curOldChild, newChildren[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === undefined) {
          hostRemove(curOldChild.el);
        } else {
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          newIndex2oldIndex[newIndex - left] = i + 1;
          patch(
            curOldChild,
            newChildren[newIndex],
            container,
            parentComponent,
            null,
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved
        ? getSequence(newIndex2oldIndex)
        : [];
      let j = increasingNewIndexSequence.length - 1;
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + left;
        const nextChild = newChildren[nextIndex];
        const anchor =
          nextIndex + 1 < newChildren.length
            ? newChildren[nextIndex + 1].el
            : null;
        if (newIndex2oldIndex[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor);
        }
        if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            hostInsert(nextChild.el, container, anchor);
          } else {
            j--;
          }
        }
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

  function mountElement(vNode, container, parentComponent, anchor) {
    const { type, props, children, shapeFlags } = vNode;
    const el: Element = (vNode.el = hostCreateElement(type));

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vNode.children, el, parentComponent, anchor);
    }

    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }
    hostInsert(el, container, anchor);
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }

  function processComponent(
    prevNode,
    vNode,
    container,
    parentComponent,
    anchor,
  ) {
    mountComponent(vNode, container, parentComponent, anchor);
  }

  function mountComponent(initialVNode, container, parentComponent, anchor) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }

  function setupRenderEffect(instance, initialVNode, container, anchor) {
    effect(() => {
      // init
      if (!instance.isMounted) {
        const { proxy } = instance;
        // bind context
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance, anchor);
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
        patch(prevSubTree, subTree, container, instance, anchor);
      }
    });
  }

  return {
    createApp: createAppApi(render),
  };
}

function getSequence(arr) {
  const len = arr.length;
  const prevIndices = arr.slice();
  // 存储索引
  const result = [0];
  for (let i = 0; i < len; i++) {
    if (arr[i] !== 0) {
      const lastResultIdx = result.at(-1)!;
      if (arr[lastResultIdx] < arr[i]) {
        prevIndices[i] = lastResultIdx;
        result.push(i);
        continue;
      }
      // 查找第一个 >= 当前值的位置
      let left = 0;
      let right = result.length - 1;
      while (left < right) {
        const mid = (left + right) >> 1;
        if (arr[result[mid]!] < arr[i]) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      if (arr[i] < arr[result[left]!]) {
        if (left > 0) {
          prevIndices[i] = result[left - 1];
        }
        result[left] = i;
      }
    }
  }
  // 回溯修复贪心，得到正确序列
  let curLen = result.length;
  let lastIdx = result.at(-1)!;
  while (curLen-- > 0) {
    result[curLen] = lastIdx;
    lastIdx = prevIndices[lastIdx];
  }
  return result;
}
