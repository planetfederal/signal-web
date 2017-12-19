import * as request from 'superagent-bluebird-promise';
import { API_URL } from 'config';
import { push } from 'react-router-redux';
import * as R from 'ramda';

export const LOAD_INPUT = 'sc/processors/LOAD_INPUT';
export const LOAD_INPUTS = 'sc/processors/LOAD_INPUTS';
export const DELETE_INPUT = 'sc/processors/DELETE_INPUT';

const initialState = {
  inputs: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_INPUT:
      return {
        ...state,
        inputs: state.inputs.concat(action.payload.notification)
      };
    case LOAD_INPUTS:
      return {
        ...state,
        inputs: action.payload.inputs
      };
    case DELETE_INPUT:
      return {
        ...state,
        inputs: R.reject(i => i.id === action.payload.input.id, state.inputs)
      };
    default:
      return state;
  }
}

export function addInput(i) {
  return (dispatch, getState) => {
    const { sc } = getState();
    const token = sc.auth.token;
    return request
      .post(`${API_URL}inputs`)
      .set('Authorization', `Token ${token}`)
      .send(i)
      .then(
        () => dispatch(loadInputs()),
        err => dispatch(updateProcessorErrors(err.body.error))
      );
  };
}

export function receiveInputs(inputs) {
  return {
    type: LOAD_INPUTS,
    payload: { inputs }
  };
}

export function receiveInput(notification) {
  return {
    type: LOAD_INPUT,
    payload: { notification }
  };
}

export function loadInputs() {
  return dispatch =>
    request
      .get(`${API_URL}inputs`)
      .then(res => res.body.result)
      .then(data => dispatch(receiveInputs(data)));
}

export function loadInput(notificationId) {
  return (dispatch, getState) => {
    const { sc } = getState();
    const token = sc.auth.token;
    return request
      .get(`${API_URL}inputs/${notificationId}`)
      .set('Authorization', `Token ${token}`)
      .then(res => res.body.result)
      .then(data => dispatch(receiveInput(data)));
  };
}

export function deleteInput(input) {
  return dispatch => {
    return request.delete(`${API_URL}inputs/${input.id}`).then(() => {
      dispatch({
        type: DELETE_INPUT,
        payload: { input }
      });
      dispatch(push('/inputs'));
    });
  };
}
