export * from "@lite-core/runtime-dom";

import { baseCompile } from "@lite-core/compiler-core";
import * as runtimeDom from "@lite-core/runtime-dom";
import { registerRuntimeCompiler } from "@lite-core/runtime-dom";

function compileToFunction(template: string) {
  const { code } = baseCompile(template);
  const render = new Function("Vue", code)(runtimeDom);
  return render;
}

registerRuntimeCompiler(compileToFunction);
