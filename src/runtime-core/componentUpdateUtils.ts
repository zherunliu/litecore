export function shouldUpdateComponent(prevNode, vNode) {
  const { props: prevProps } = prevNode;
  const { props: nextProps } = vNode;

  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
