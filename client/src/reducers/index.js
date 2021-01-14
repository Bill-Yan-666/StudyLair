import { combineReducers } from "redux";
import authReducer from "./authReducer";
import courseInfoReducer from './courseInfoReducer';
import errorReducer from "./errorReducer";
import requestReducer from './requestReducer';

export default combineReducers({
  auth: authReducer,
  courseInfo: courseInfoReducer,
  errors: errorReducer,
  status: requestReducer,
});
