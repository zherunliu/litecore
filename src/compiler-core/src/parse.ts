import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

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
  const s = context.source;
  let node;
  if (s.startsWith(openDelimiter)) {
    node = parseInterpolation(context);
  } else if (s.startsWith("<")) {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context);
    }
  } else {
    node = parseText(context);
  }
  nodes.push(node);
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

function parseElement(context) {
  const element = parseTag(context, TagType.Start);
  parseTag(context, TagType.End);
  return element;
}

function parseTag(context, tagType: TagType) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length + 1);
  if (tagType === TagType.Start) {
    return {
      type: NodeTypes.ELEMENT,
      tag,
      children: [],
    };
  }
}

function parseText(context) {
  const content = context.source;
  advanceBy(context, content.length);
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function advanceBy(context, numberOfCharacters) {
  context.source = context.source.slice(numberOfCharacters);
}

function createParserContext(content: string) {
  return { source: content };
}
