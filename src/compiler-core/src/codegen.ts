import { isString } from "../../shared/extend";
import { NodeTypes } from "./ast";
import {
  CREATE_ELEMENT_VNODE,
  helperMapName,
  TO_DISPLAY_STRING,
} from "./runtimeHelper";

export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;

  getFunctionPreamble(ast, context);
  const functionName = "render";
  const args = ["_ctx", "_cache", "$props", "$setup", "$data", "$options"];
  const signature = `function ${functionName}(${args.join(", ")})`;
  push(signature + "{");
  push("return ");
  genNode(ast.codegenNode, context);
  push("}");
  return { code: context.code };
}

function getFunctionPreamble(ast, context) {
  const VueBinging = "Vue";
  const aliasHelper = (s) => `${helperMapName[s]}:_${helperMapName[s]}`;
  if (ast.helpers.length > 0) {
    context.push(
      `const { ${ast.helpers.map(aliasHelper).join(", ")} } = ${VueBinging}`,
    );
    context.push("\n");
  }
  context.push("return ");
}

function createCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source;
    },
    helper(key) {
      return `_${helperMapName[key]}`;
    },
  };
  return context;
}

function genNode(node, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    case NodeTypes.ELEMENT:
      genElement(node, context);
      break;
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context);
      break;
    default:
      break;
  }
}

function genText(node, context) {
  context.push(`"${node.content}"`);
}

function genInterpolation(node, context) {
  const { push, helper } = context;
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}

function genExpression(node, context) {
  context.push(`${node.content}`);
}

function genElement(node, context) {
  const { push, helper } = context;
  const { children, tag, props } = node;
  push(`${helper(CREATE_ELEMENT_VNODE)}(`);
  genNodeList(genNullable([tag, props, children]), context);
  push(`)`);
}

function genNullable(args) {
  return args.map((arg) => arg || "null");
}

function genNodeList(nodes, context) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isString(node)) {
      push(node);
    } else {
      genNode(node, context);
    }

    if (i < nodes.length - 1) {
      push(", ");
    }
  }
}

function genCompoundExpression(node, context) {
  const children = node.children;
  for (let i = 0; i < children.length; i++) {
    if (isString(children[i])) {
      context.push(children[i]);
    } else {
      genNode(children[i], context);
    }
  }
}
