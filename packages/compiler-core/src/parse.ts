import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

const openDelimiter = "{{";
const closeDelimiter = "}}";
export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context, []));
}

function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children,
  };
}

function parseChildren(context, ancestorTags: string[]) {
  const nodes: any[] = [];
  while (!isEnd(context, ancestorTags)) {
    let node;
    const s = context.source;
    if (s.startsWith(openDelimiter)) {
      node = parseInterpolation(context);
    } else if (s.startsWith("<")) {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestorTags);
      }
    } else {
      node = parseText(context);
    }
    nodes.push(node);
  }
  return nodes;
}

function isEnd(context, ancestorTags: string[]) {
  const s = context.source;
  if (s.startsWith("</")) {
    for (let i = ancestorTags.length - 1; i >= 0; i--) {
      const tag = ancestorTags[i];
      if (startsWithEndTagOpen(context, tag)) {
        return true;
      }
    }
  }
  return !s;
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

function parseElement(context, ancestorTags: string[]) {
  const element: any = parseTag(context, TagType.Start);
  ancestorTags.push(element.tag);
  element.children = parseChildren(context, ancestorTags);
  ancestorTags.pop();
  if (!startsWithEndTagOpen(context, element.tag)) {
    throw new Error(`missing end tag: ${element.tag}`);
  }
  parseTag(context, TagType.End);
  return element;
}

function startsWithEndTagOpen(context, tag) {
  return (
    context.source.startsWith("</") &&
    context.source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  );
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
  let endIndex = context.source.length;
  const endTokens = ["<", openDelimiter];
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }
  const content = parseTextData(context, endIndex);
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function advanceBy(context, numberOfCharacters) {
  context.source = context.source.slice(numberOfCharacters);
}

function parseTextData(context, length) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
}

function createParserContext(content: string) {
  return { source: content };
}
