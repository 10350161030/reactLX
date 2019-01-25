import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as home from './home/reducer';
import * as main from './main/reducer';
import * as brand from './brand/reducer';
import thunk from 'redux-thunk';

let store = createStore(
  combineReducers({...home,...main,...brand}),
  applyMiddleware(thunk)
);

export default store;