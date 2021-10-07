import { combineReducers } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import { useSelector as useSelectorOrigin } from 'react-redux';

import userReducer from './user';

const reducer = combineReducers({
  user: userReducer
})

const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;