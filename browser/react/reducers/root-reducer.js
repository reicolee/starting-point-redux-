import { SET_LYRICS } from '../constants';

const initialState = {
  text: ''
};

export default function reducer(currentState = initialState, action) {
  switch (action.type) {
  case SET_LYRICS:
    return Object.assign({}, currentState, {
      text: action.lyric
    });
  default:
    return currentState;
  }
}
