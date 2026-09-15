const initialState = 0;

function loadingBarReducer(state = initialState, action = {}) {
  if (action.type.endsWith('/pending')) {
    return state + 1;
  }

  if (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) {
    return Math.max(state - 1, 0);
  }

  return state;
}

export default loadingBarReducer;
