import { createVNodeCall, NodeTypes } from "../ast";

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const vNodeTag = `"${node.tag}"`;
      let vNodeProps;
      const children = node.children;
      let vNodeChildren = children[0];
      node.codegenNode = createVNodeCall(
        context,
        vNodeTag,
        vNodeProps,
        vNodeChildren,
      );
    };
  }
}
