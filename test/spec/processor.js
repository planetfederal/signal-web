import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import { API_URL } from "config";
import reducer from "./../../ducks/processors";
import { loadProcessors, initialState } from "./../../ducks/processors";
import { log } from "util";
import * as R from "ramda";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("processors", () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it("all", () => {
    const store = mockStore({ processors: initialState });
    return store.dispatch(loadProcessors()).then(val => {
      const newState = reducer(initialState, val);
      console.log(newState);
      expect(newState).toBeDefined();
      expect(newState.spatial_processors).toBeDefined();
      expect(newState.errors).toBeDefined();
      expect(newState.capabilities).toBeDefined();
      R.keys(newState.spatial_processors)
        .map(k => {
          return newState.spatial_processors[k];
        })
        .map(p => {
          expect(p.id).toBeDefined();
          expect(p.description).toBeDefined();
        });
      expect(newState.capabilities.inputs).toBeDefined();
      expect(newState.capabilities.outputs).toBeDefined();
      expect(newState.capabilities.predicates).toBeDefined();
    });
  });

  it("reads", () => {
    const store = mockStore({ processors: initialState });
    return store.dispatch(loadProcessors()).then(val => {
      const newState = reducer(val);
      expect(newState).toBeDefined();
    });
  });
});
