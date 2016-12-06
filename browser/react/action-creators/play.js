import {
    START_PLAYING,
    STOP_PLAYING,
    SET_CURRENT_SONG,
    SET_LIST
} from "../constants";
import axios from 'axios';
import AUDIO from '../audio';



const startPlaying = () => ({
    type: START_PLAYING
});

const stopPlaying = () => ({
    type: STOP_PLAYING
});

const setCurrentSong = (currentSong) => ({
    type: SET_CURRENT_SONG,
    currentSong
});

const setCurrentSongList = (currentSongList) => ({
    type: SET_LIST,
    currentSongList
});


export const play = () => dispatch => {
    AUDIO.play();
    dispatch(startPlaying());
};

export const pause = () => dispatch => {
    AUDIO.pause();
    dispatch(stopPlaying());
};

export const load = (currentSong, currentSongList) => dispatch => {
    AUDIO.src = currentSong.audioUrl;
    AUDIO.load();
    dispatch(setCurrentSongList(currentSongList));
    dispatch(setCurrentSong(currentSong));
};


export const startSong = (song, list) => dispatch => {
    dispatch(pause());
    dispatch(load(song, list));
    dispatch(play());
};

export const toggleOne = (selectedSong, selectedSongList) => (dispatch, getState) => {
    const {
        currentSong
    } = getState();
    if (selectedSong.id !== currentSong.id)
        dispatch(startSong(selectedSong, selectedSongList));
    else dispatch(toggle());
};

export const toggle = () => (dispatch, getState) => {
    const {
        isPlaying
    } = getState();
    if (isPlaying) dispatch(pause());
    else dispatch(play());
};

export const next = () => (dispatch, getState) => {
    dispatch(startSong(...skip(1, getState())));
};

export const prev = () => (dispatch, getState) => {
    dispatch(startSong(...skip(-s1, getState())));
};
