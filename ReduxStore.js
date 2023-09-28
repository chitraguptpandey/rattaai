import { combineReducers, configureStore } from '@reduxjs/toolkit';

import initReducer from './store/reducers/init';
import loginReducer from './store/reducers/login';

const rootReducer = combineReducers({
	login: loginReducer,
	init: initReducer
});

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		immutableCheck: false,
		serializableCheck: false,
	})
});

export default store;