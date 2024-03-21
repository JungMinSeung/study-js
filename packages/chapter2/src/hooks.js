export function createHooks(callback) {
  let state = [];
  let memoizedValues = [];
  let stateIndex = 0;
  let memoIndex = 0;

  const useState = (initialValue) => {
    const currentIndex = stateIndex;
    state[currentIndex] = state[currentIndex] ?? initialValue;

    const setState = (newValue) => {
      if (state[currentIndex] !== newValue) {
        state[currentIndex] = newValue;
        callback();
      }
    };

    stateIndex++;
    return [state[currentIndex], setState];
  };

  const useMemo = (fn, refs) => {
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
