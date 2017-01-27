//Lib
import { combineReducers } from 'redux';
//Reducers
import codeTransformReducer from './code_transform_reducer';
const rootReducer = combineReducers({
	codeTransform: codeTransformReducer
});

export default rootReducer;