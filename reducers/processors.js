import * as request from "superagent-bluebird-promise";
import keyBy from "lodash/keyBy";
import omit from "lodash/omit";
import { push } from "react-router-redux";
import { API_URL } from "config";
import * as Types from "./types";

export const initialState = {
  spatial_processors: {},
  errors: {},
  capabilities: {
    inputs: {},
    outputs: {},
    predicates: {}
  }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Types.LOAD_CAPABILITIES:
      return {
        ...state,
        capabilities: action.payload.capabilities
      };
    case Types.LOAD_SPATIAL_PROCESSORS:
      return {
        ...state,
        spatial_processors: action.payload.spatial_processors
      };
    case Types.ADD_PROCESSOR:
      return {
        ...state,
        spatial_processors: {
          ...state.spatial_processors,
          [action.payload.processor.id]: action.payload.processor
        }
      };
    case Types.UPDATE_PROCESSOR:
      return {
        ...state,
        spatial_processors: {
          ...state.spatial_processors,
          [action.payload.processor.id]: action.payload.processor
        }
      };
    case Types.DELETE_PROCESSOR:
      return {
        ...state,
        spatial_processors: omit(
          state.spatial_processors,
          action.payload.processor.id
        )
      };
    case Types.PROCESSOR_ERRORS:
      return {
        ...state,
        errors: action.payload.errors
      };
    case Types.POINT_SENT_ERRORS:
      return {
        ...state,
        errors: action.payload.errors
      };
    default:
      return state;
  }
}

export function updateProcessorErrors(errors) {
  return {
    type: PROCESSOR_ERRORS,
    payload: {
      errors
    }
  };
}

export function updateCheck(errors) {
  return {
    type: POINT_SENT_ERRORS,
    payload: {
      errors
    }
  };
}

export function testPoint(p) {
  return (dispatch, getState) => {
    const token = getState().sc.auth.token;
    return request
      .post(`${API_URL}check`)
      .set("Authorization", `Token ${token}`)
      .send(p)
      .then(() => dispatch({}), err => dispatch(updateCheck(err.body.error)));
  };
}

export function updateProcessor(processor) {
  return (dispatch, getState) => {
    const { sc } = getState();
    const token = sc.auth.token;
    return request
      .put(`${API_URL}processors/${processor.id}`)
      .set("Authorization", `Token ${token}`)
      .send(processor)
      .then(
        () => dispatch(loadProcessor(processor.id, true)),
        err => dispatch(updateProcessorErrors(err.body.error))
      );
  };
}

export function addProcessor(processor) {
  return (dispatch, getState) => {
    const { sc } = getState();
    const token = sc.auth.token;
    return request
      .post(`${API_URL}processors`)
      .set("Authorization", `Token ${token}`)
      .send(processor)
      .then(
        () => dispatch(loadProcessors()),
        err => dispatch(updateProcessorErrors(err.body.error))
      );
  };
}

export function receiveProcessors(processors) {
  return {
    type: LOAD_SPATIAL_PROCESSORS,
    payload: {
      spatial_processors: keyBy(processors, "id")
    }
  };
}

export function receiveProcessor(processor) {
  return {
    type: ADD_PROCESSOR,
    payload: { processor }
  };
}

export function deleteProcessor(processor) {
  return (dispatch, getState) => {
    const { sc } = getState();
    const token = sc.auth.token;
    return request
      .delete(`${API_URL}processors/${processor.id}`)
      .set("Authorization", `Token ${token}`)
      .then(() => {
        dispatch({
          type: DELETE_PROCESSOR,
          payload: { processor }
        });
        dispatch(push("/processors"));
      });
  };
}

export function loadProcessor(processorId) {
  return (dispatch, getState) => {
    const { sc } = getState();
    const token = sc.auth.token;
    return request
      .get(`${API_URL}processors/${processorId}`)
      .set("Authorization", `Token ${token}`)
      .then(res => res.body.result)
      .then(data => dispatch(receiveProcessor(data)));
  };
}

export function loadProcessors() {
  return (dispatch, getState) => {
    const { sc } = getState();
    const token = sc.auth.token;
    return request
      .get(`${API_URL}processors`)
      .set("Authorization", `Token ${token}`)
      .then(res => res.body.result)
      .then(data => dispatch(receiveProcessors(data)));
  };
}

function receiveCapabilities(capabilities) {
  return {
    type: LOAD_CAPABILITIES,
    payload: {
      capabilities
    }
  };
}

export function loadCapabilities() {
  return (dispatch, getState) => {
    const { sc } = getState();
    const token = sc.auth.token;
    return request
      .get(`${API_URL}capabilities`)
      .set("Authorization", `Token ${token}`)
      .then(res => res.body.result)
      .then(data => dispatch(receiveCapabilities(data)));
  };
}
