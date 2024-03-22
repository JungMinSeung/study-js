import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let _root;
  let _rootComponent;

  const _render = () => {
    _root.innerHTML = null;
    render(_root, _rootComponent);
  };

  function render($root, rootComponent) {
    _root = $root;
    _rootComponent = rootComponent;
    /**
     * Context 초기화
     * 1. 리렌더링 전 초기화
     * 2. 이전 테스트에서 사용한 컨텍스트 초기화
     */
    resetHookContext();
    const jsx = _rootComponent();
    updateElement(_root, jsx);
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
