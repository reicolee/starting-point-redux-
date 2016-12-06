import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import lyricsReducer from './reducers/lyrics-reducer';
import playerReducer from './reducers/player-reducer';

export default createStore(
  combineReducers({
    lyrics: lyricsReducer,
    player: playerReducer
  }),
  applyMiddleware(createLogger(),
    thunkMiddleware));
