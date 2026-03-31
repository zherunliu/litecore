export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;
  push("return ");
  const functionName = "render";
  const args = ["_ctx", "_cache", "$props", "$setup", "$data", "$options"];
  const signature = `function ${functionName}(${args.join(", ")})`;
  push(signature + "{");
  push("return ");
  genNode(ast.codegenNode, context);
  push("}");
  return { code: context.code };

  // return `return function render(_ctx, _cache, $props, $setup, $data, $options){return "hi"}`;
}

function createCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source;
    },
  };
  return context;
}

function genNode(node, context) {
  context.push(`"${node.content}"`);
}
