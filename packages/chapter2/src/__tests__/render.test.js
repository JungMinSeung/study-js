import { describe, expect, test } from 'vitest';
import { jsx, render } from '../render';

describe('render > ', () => {
  describe('첫 번째 렌더링 테스트', () => {
    test('한 개의 태그를 렌더링할 수 있다.', () => {
      const App = jsx('div', null, 'div의 children 입니다.');

      const $root = document.createElement('div');
      render($root, App);

      expect($root.innerHTML).toBe(`<div>div의 children 입니다.</div>`);
    });

    test('props를 추가할 수 있다.', () => {
      const App = jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        'div의 children 입니다.'
      );

      const $root = document.createElement('div');
      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class">div의 children 입니다.</div>`
      );
    });

    test('자식 노드를 표현할 수 있다.', () => {
      const App = jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        jsx('p', null, '첫 번째 문단'),
        jsx('p', null, '두 번째 문단')
      );

      const $root = document.createElement('div');
      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );
    });
  });

  describe('리렌더링 테스트 - 변경된 내용만 반영되도록 한다.', () => {
    test('하위 노드 추가', () => {
      const $root = document.createElement('div');

      const App = jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        jsx('p', null, '첫 번째 문단'),
        jsx('p', null, '두 번째 문단')
      );

      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );

      const children = [...$root.querySelectorAll('p')];

      render(
        $root,
        jsx(
          'div',
          { id: 'test-id', class: 'test-class' },
          jsx('p', null, '첫 번째 문단'),
          jsx('p', null, '두 번째 문단'),
          jsx('p', null, '세 번째 문단')
        ),
        App
      );

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p><p>세 번째 문단</p></div>`
      );

      const newChildren = [...$root.querySelectorAll('p')];

      expect(children[0]).toBe(newChildren[0]);
      expect(children[1]).toBe(newChildren[1]);
      expect(children[2]).not.toBe(newChildren[2]);
    });

    test('하위 노드 삭제', () => {
      const $root = document.createElement('div');
      const App = jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        jsx('p', null, '첫 번째 문단'),
        jsx('p', null, '두 번째 문단'),
        jsx('p', null, '세 번째 문단')
      );

      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p><p>세 번째 문단</p></div>`
      );

      const children = [...$root.querySelectorAll('p')];

      render(
        $root,
        jsx(
          'div',
          { id: 'test-id', class: 'test-class' },
          jsx('p', null, '첫 번째 문단'),
          jsx('p', null, '두 번째 문단')
        ),
        App
      );

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );

      const newChildren = [...$root.querySelectorAll('p')];

      expect(children[0]).toBe(newChildren[0]);
      expect(children[1]).toBe(newChildren[1]);
      expect(children[2]).not.toBe(newChildren[2]);
    });

    test('하위 노드 변경', () => {
      const $root = document.createElement('div');
      const App = jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        jsx('p', null, '첫 번째 문단'),
        jsx('p', null, '두 번째 문단'),
        jsx('p', null, '세 번째 문단')
      );

      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p><p>세 번째 문단</p></div>`
      );

      const children = [...$root.querySelectorAll('p')];

      render(
        $root,
        jsx(
          'div',
          { id: 'test-id', class: 'test-class' },
          jsx('p', null, '첫 번째 문단'),
          jsx('p', null, '세 번째 문단'),
          jsx('p', null, '두 번째 문단')
        ),
        App
      );

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>세 번째 문단</p><p>두 번째 문단</p></div>`
      );

      const newChildren = [...$root.querySelectorAll('p')];

      expect(children[0]).toBe(newChildren[0]);
      expect(children[1]).toBe(newChildren[1]);
      expect(children[2]).toBe(newChildren[2]);
    });

    test('하위 노드 변경 및 삭제', () => {
      const $root = document.createElement('div');
      const App = jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        jsx('p', null, '첫 번째 문단'),
        jsx('p', null, '두 번째 문단'),
        jsx('p', null, '세 번째 문단')
      );

      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p><p>세 번째 문단</p></div>`
      );

      const children = [...$root.querySelectorAll('p')];

      render(
        $root,
        jsx(
          'div',
          { id: 'test-id', class: 'test-class' },
          jsx('p', null, '첫 번째 문단'),
          jsx('p', null, '세 번째 문단')
        ),
        App
      );

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>세 번째 문단</p></div>`
      );

      const newChildren = [...$root.querySelectorAll('p')];

      /**
       * children  [ '첫 번째 문단', '세 번째 문단', '세 번째 문단' ]
       * newChildren [ '첫 번째 문단', '세 번째 문단' ]
       * 1. 두번째 렌더에서 children의 두 번째 요소가 newNode의 두 번째 요소로 변경되었음
       *    즉, children의 두 번째 요소와 세 번째요소는 다른 객체를 참조하고 있음
       * 2. 두번째 렌더에서 세번째 요소를 삭제하더라도, children의 세 번째 요소가 삭제되는건 아니다.
       *    왜냐하면 children의 세 번째 요소에서 계속 참조하고 있음.
       */

      expect(children[0]).toBe(newChildren[0]);
      expect(children[1]).toBe(newChildren[1]);
      expect(children[2]).not.toBe(newChildren[2]);
      expect(children[1]).not.toBe(children[2]);
    });

    test('props 수정', () => {
      const $root = document.createElement('div');
      const App = jsx(
        'div',
        { id: 'test-id', class: 'test-class' },
        jsx('p', null, '첫 번째 문단'),
        jsx('p', null, '두 번째 문단')
      );

      render($root, App);

      expect($root.innerHTML).toBe(
        `<div id="test-id" class="test-class"><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );

      const children = [...$root.querySelectorAll('p')];

      render(
        $root,
        jsx(
          'div',
          null,
          jsx('p', null, '첫 번째 문단'),
          jsx('p', null, '두 번째 문단')
        ),
        App
      );

      expect($root.innerHTML).toBe(
        `<div><p>첫 번째 문단</p><p>두 번째 문단</p></div>`
      );

      const newChildren = [...$root.querySelectorAll('p')];

      expect(children[0]).toBe(newChildren[0]);
      expect(children[1]).toBe(newChildren[1]);
    });
  });
});
