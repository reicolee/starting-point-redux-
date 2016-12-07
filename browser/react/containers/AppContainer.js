import React, { Component } from 'react';
import axios from 'axios';
import { hashHistory } from 'react-router';

import AUDIO from '../audio';

import Albums from '../components/Albums.js';
import Album from '../components/Album';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import { convertAlbum, convertAlbums, convertSong, skip } from '../utils';
import store from '../store'
import { play as playAction, pause as pauseAction, load as loadAction, startSong as startSongAction, toggleOne as toggleOneAction, toggle as toggleAction, next as nextAction, prev as prevAction } from '../action-creators/play'



export default class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, {
      albums: [],
      artists: [],
      selectedAlbum: {},
      selectedArtist: {},
      playlists: [],
      selectedPlaylist: {},
      songs: []
    }, store.getState());

    this.selectAlbum = this.selectAlbum.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
    this.addPlaylist = this.addPlaylist.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.loadSongs = this.loadSongs.bind(this);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      console.log("we are in subscribe");
      this.setState(store.getState());
    });

    console.log("AppContainer mounted", this.state);

    Promise
      .all([
        axios.get('/api/albums/'),
        axios.get('/api/artists/'),
        axios.get('/api/playlists')
      ])
      .then(res => res.map(r => r.data))
      .then(data => this.onLoad(...data));

    AUDIO.addEventListener('ended', () => this.next());
    AUDIO.addEventListener('timeupdate', () => this.setProgress(AUDIO.currentTime / AUDIO.duration));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onLoad(albums, artists, playlists) {
    this.setState({
      albums: convertAlbums(albums),
      artists: artists,
      playlists: playlists
    });
  }

  play() {
    store.dispatch(playAction());
  }
  pause() {
    store.dispatch(pauseAction());
  }
  load(song, list) {
    store.dispatch(loadAction(song, list));
  }
  startSong(){
  store.dispatch(startSongAction());
  }
  toggleOne(song, list) {
    store.dispatch(toggleOneAction(song, list));
  }
  toggle() {
    store.dispatch(toggleAction());
  }
  next() {
    store.dispatch(nextAction());
  }
  prev (){
    store.dispatch(prevAction());
  }

  setProgress(progress) {
    this.setState({
      progress: progress
    });
  }

  selectAlbum(albumId) {
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(album => this.setState({
        selectedAlbum: convertAlbum(album)
      }));
  }

  selectArtist(artistId) {
    Promise
      .all([
        axios.get(`/api/artists/${artistId}`),
        axios.get(`/api/artists/${artistId}/albums`),
        axios.get(`/api/artists/${artistId}/songs`)
      ])
      .then(res => res.map(r => r.data))
      .then(data => this.onLoadArtist(...data));
  }

  onLoadArtist(artist, albums, songs) {
    songs = songs.map(convertSong);
    albums = convertAlbums(albums);
    artist.albums = albums;
    artist.songs = songs;

    this.setState({
      selectedArtist: artist
    });
  }

  addPlaylist(playlistName) {
    axios.post('/api/playlists', {
      name: playlistName
    })
      .then(res => res.data)
      .then(playlist => {
        this.setState({
          playlists: [...this.state.playlists, playlist]
        }, () => {
          hashHistory.push(`/playlists/${playlist.id}`)
        });
      });
  }

  selectPlaylist(playlistId) {
    axios.get(`/api/playlists/${playlistId}`)
      .then(res => res.data)
      .then(playlist => {
        playlist.songs = playlist.songs.map(convertSong);
        this.setState({
          selectedPlaylist: playlist
        });
      });
  }

  loadSongs(songs) {
    axios.get('/api/songs')
      .then(res => res.data)
      .then(songs => {
        this.setState({
          songs: songs
        });
      });
  }

  addSongToPlaylist(playlistId, songId) {
    return axios.post(`/api/playlists/${playlistId}/songs`, {
      id: songId
    })
      .then(res => res.data)
      .then(song => {
        const selectedPlaylist = this.state.selectedPlaylist;
        const songs = this.state.selectedPlaylist.songs;
        const newSongs = [...songs, convertSong(song)];
        const newSelectedPlaylist = Object.assign({}, selectedPlaylist, {
          songs: newSongs
        });

        this.setState({
          selectedPlaylist: newSelectedPlaylist
        });
      });
  }

  render() {
    console.log('this is toggleone in appcontainer', this.toggleOne)
    const props = Object.assign({}, this.state, {
      toggleOne: this.toggleOne,
      toggle: this.toggle,
      selectAlbum: this.selectAlbum,
      selectArtist: this.selectArtist,
      addPlaylist: this.addPlaylist,
      selectPlaylist: this.selectPlaylist,
      loadSongs: this.loadSongs,
      addSongToPlaylist: this.addSongToPlaylist
    });

    return ( <div id="main" className="container-fluid">
               <div className="col-xs-2">
                 <Sidebar playlists={ this.state.playlists } />
               </div>
               <div className="col-xs-10">
                 { this.props.children && React.cloneElement(this.props.children, props) }
               </div>
               <Player currentSong={ this.state.player.currentSong } currentSongList={ this.state.player.currentSongList } isPlaying={ this.state.player.isPlaying } progress={ this.state.player.progress } next={ this.next }
                 prev={ this.prev } toggle={ this.toggle } />
             </div>
      );
  }
}
