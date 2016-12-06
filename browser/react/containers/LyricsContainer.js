import React from 'react';
import store from '../store';
import { setLyrics } from '../action-creators/lyrics';
import Lyrics from '../components/Lyrics';
import axios from 'axios';


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

  handleSubmit (){
    if (this.state.artistQuery && this.state.songQuery) {
    axios.get(`/api/lyrics/${this.state.artistQuery}/${this.state.songQuery}`)
      .then(res => res.data)
      .then(data => store.dispatch(setLyrics(data.lyric)))
      .catch(console.error);
    }
  }

  setArtist(artist){
    this.setState({artistQuery: artist});
  }

  setSong(song){
    this.setState({songQuery: song});
  }


  render() {
    return (
            <Lyrics
      text={this.state.text}
      setArtist={this.setArtist}
      setSong={this.setSong}
      artistQuery={this.state.artistQuery}
      songQuery={this.state.songQuery}
      handleSubmit={this.handleSubmit}
    />
    )
  }
}
