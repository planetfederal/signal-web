export function createReducer(initialState, reducers) {
  return function reducer(state = initialState, action = {}) {
    if (reducers.hasOwnProperty(action.type)) {
      return reducers[action.type](state, action);
    } else {
      return state;
    }
  };
}
