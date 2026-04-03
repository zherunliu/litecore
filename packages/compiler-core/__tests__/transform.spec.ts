import { baseParse } from "../src/parse";
import { transform } from "../src/transform";
import { NodeTypes } from "../src/ast";

describe("transform", () => {
  it("should transform code correctly", () => {
    const ast = baseParse("<div>hello, {{ name }}<p>hi, {{ msg }}</p></div>");

    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content + "world";
      }
    };

    transform(ast, { nodeTransforms: [plugin] });
    const nodeText = ast.children[0].children[0];
    expect(nodeText.content).toBe("hello, world");
    const nodeText2 = ast.children[0].children[2].children[0];
    expect(nodeText2.content).toBe("hi, world");
  });
});
