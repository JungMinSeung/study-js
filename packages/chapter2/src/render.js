export function jsx(type, props, ...children) {
  return { type, props, children };
}

function createElement(node) {
  /**
   * 1. node가 문자열인 경우 - 텍스트 노드를 생성하여 반환 (createTextNode)
   * 2. node가 객체인 경우 - element를 생성, element에 속성과 자식을 추가 후 요소 반환. (createElement, setAttribute, appendChild)
   */
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const element = document.createElement(node.type);
  const props = node.props || {};

  Object.entries(props).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  node.children.map((childNode) => element.append(createElement(childNode)));

  return element;
}

function updateAttributes(element, newProps = {}, oldProps = {}) {
  /**
   * 1. oldProps에 있는데 newProps에 없는 속성은 제거 (removeAttribute)
   * 2. newProps에 있는 속성 중, 요소의 속성과 다른 경우에만 업데이트 (getAtrribute, setAttribute)
   */
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      element.removeAttribute(key);
    }
  });
  Object.entries(newProps).forEach(([key, value]) => {
    if (value !== element.getAttribute(key)) {
      element.setAttribute(key, value);
    }
  });
}

export function render(parent, newNode = null, oldNode = null, index = 0) {
  /**
   * 1. newNode가 없고 oldNode만 있는 경우 - oldNode를 제거 후 종료 (removeChild)
   * 2. newNode가 있고 oldNode가 없는 경우 - newNode를 추가 후 종료 (appendChild)
   * 3. newNode와 oldNode가 둘 다 문자열이고 서로 다른 경우 - newNode로 교체 후 종료 (replaceChild)
   * 4. newNode와 oldNode의 타입이 다른 경우 - newNode로 교체 후 종료 (replaceChild)
   * 5. newNode와 oldNode의 타입이 같은 경우 - 속성과 자식을 비교하고 각각 업데이트
   */
  const targetNode = parent.childNodes[index];

  if (!newNode && oldNode) {
    parent.removeChild(targetNode);
    return;
  }
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }
  if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      parent.replaceChild(createElement(newNode), targetNode);
    }
    return;
  }
  if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), targetNode);
    return;
  }

  updateAttributes(targetNode, newNode.props || {}, oldNode.props || {});
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    render(targetNode, newNode.children[i], oldNode.children[i], i);
  }

  for (let i = maxLength; i < targetNode.childNodes.length; i++) {
    targetNode.childNodes[i].remove();
  }
}
