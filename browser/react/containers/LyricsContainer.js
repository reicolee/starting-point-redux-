import React from 'react';
import store from '../store';
import { fetchLyrics } from '../action-creators/lyrics';
import Lyrics from '../components/Lyrics';

export default class LyricsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({
      artistQuery: '',
      songQuery: ''
    }, store.getState());

    this.setArtist = this.setArtist.bind(this);
    this.setSong = this.setSong.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  handleSubmit() {
    if (this.state.artistQuery && this.state.songQuery) {
      store.dispatch(fetchLyrics(this.state.artistQuery, this.state.songQuery));
    }
  }

  setArtist(artist) {
    this.setState({
      artistQuery: artist
    });
  }

  setSong(song) {
    this.setState({
      songQuery: song
    });
  }


  render() {
    return (
      <Lyrics text={ this.state.lyrics.text } setArtist={ this.setArtist } setSong={ this.setSong } artistQuery={ this.state.artistQuery } songQuery={ this.state.songQuery } handleSubmit={ this.handleSubmit }
      />
    )
  }
}
