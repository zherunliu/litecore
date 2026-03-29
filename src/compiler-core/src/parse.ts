import { NodeTypes } from "./ast";

const openDelimiter = "{{";
const closeDelimiter = "}}";
export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}

function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children,
  };
}

function parseChildren(context) {
  const nodes: any[] = [];
  if (context.source.startsWith(openDelimiter)) {
    const node = parseInterpolation(context);
    nodes.push(node);
  }
  return nodes;
}

function parseInterpolation(context) {
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length,
  );
  const content = context.source.slice(openDelimiter.length, closeIndex).trim();
  advanceBy(context, closeIndex + closeDelimiter.length);
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function advanceBy(context, numberOfCharacters) {
  context.source = context.source.slice(numberOfCharacters);
}

function createParserContext(content: string) {
  return { source: content };
}
