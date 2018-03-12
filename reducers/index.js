import { combineReducers } from "redux";
import auth from "./auth";
import processors from "./processors";
import menu from "./menu";
import notifications from "./notifications";
import input from "./input";

// http://redux.js.org/docs/api/combineReducers.html
const appReducer = combineReducers({
  auth,
  processors,
  menu,
  notifications,
  input
});

export default appReducer;
