export function createHooks(callback) {
  let state = [];
  let memoizedValues = [];
  let stateIndex = 0;
  let memoIndex = 0;

  const useState = (initialValue) => {
    const currentIndex = stateIndex;
    state[currentIndex] = state[currentIndex] ?? initialValue;

    const setState = (newValue) => {
      // 1. state를 생성 시점 current index를 통해 업데이트한다.
      // 2. callback이 호출되고, 다시 useState가 호출되면, 해당 index의 state 값이 변경되어 initialValue가 할당되지 않는다.
      // 3. 다시말해, 업데이트는 setState가 호출될 때만 일어나고,
      // 4. useState가 호출될 때는 처음 한번만 초기값이 할당되고 그 이후에는 초기값이 할당되지 않는다.
      if (state[currentIndex] !== newValue) {
        state[currentIndex] = newValue;
        callback();
      }
    };

    stateIndex++;
    return [state[currentIndex], setState];
  };

  const useMemo = (fn, refs) => {
    // 1. 처음 호출될 때, memoIndex에 값을 저장한다.
    // 2. 두번째 호출될 때, resetContext를 호출했기 때문에 이전에 값을 저장한 memoIndex로 접근이 가능하다.
    // 3. 각 useMemo에서 가지고 있는 memoIndex를 이용해서 memoizedValues 리스트의 데이터에 접근해서, 값이 없거나 값이 변경 됐을 경우, 값을 변경해준다.
    // 4. 값이 변경 되지 않았을 경우 값을 변경하지 않는다.(캐싱)
    const currentIndex = memoIndex;
    const hasRefsChanged =
      memoizedValues[currentIndex] === undefined ||
      !areArraysEqual(memoizedValues[currentIndex].refs, refs);

    if (hasRefsChanged) {
      memoizedValues[currentIndex] = {
        value: fn(),
        refs,
      };
    }
    memoIndex++;
    return memoizedValues[currentIndex].value;
  };

  const resetContext = () => {
    // 1. stateIndex, memoIndex를 초기화한다.
    // 2. useState가 호출될때, 인덱스를 다시 처음부터 시작하게 하는 역할.
    // 3. 이 함수가 없으면 states 배열에 값이 계속 쌓이게 된다.
    stateIndex = 0;
    memoIndex = 0;
  };

  function areArraysEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
  }

  return { useState, useMemo, resetContext };
}
