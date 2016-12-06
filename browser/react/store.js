import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers/root-reducer';
import createLogger from 'redux-logger';

export default createStore(reducer, applyMiddleware(createLogger()));
