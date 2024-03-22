import { createHooks } from './hooks';
import { render as updateElement } from './render';

function MyReact() {
  let _root;
  let _rootComponent;

  const _render = () => {
    resetHookContext();
    _rootComponent();

    _root.innerHTML = null;
    render(_root, _rootComponent);
  };

  function render($root, rootComponent) {
    _root = $root;
    _rootComponent = rootComponent;
    updateElement(_root, _rootComponent());
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
