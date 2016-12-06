import { SET_LYRICS } from '../constants';

export function setLyrics(text) {
  if(typeof text !=="string"){
    text = "";
  }
  return {
    type: SET_LYRICS,
    lyric: text
  };
}

