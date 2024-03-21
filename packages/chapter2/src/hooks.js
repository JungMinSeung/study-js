export function createHooks(callback) {
  let state = [];
  let stateIndex = 0;

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

  const useMemo = (fn, refs) => {};

  const resetContext = () => {
    stateIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
