import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import * as API from './API';
import * as Objects from  './objects'
import Storage from './Storage'

let genres = [];

const loadCallback = function() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  let songs = []
  let artists = {}

  genres.forEach((genre) => {
    songs.push(...genre.songs)
    genre.songs.forEach((song) => {
      song.artists.forEach((artist) => {
        if (!artists[artist.id]) artists[artist.id] = artist
      })
    })
  })

  let contentObj = {
    headerContent: "",
    genreList: genres,
    storage: new Storage(genres, songs, Object.values(artists))
  }
  root.render(
    <App props={contentObj}/>
  );
}

Promise.all([API.Get("Genres")]).then((responses) => {
  let genres_data = responses[0]

  console.log(genres_data)
  Object.values(genres_data).forEach(genre => {
    genres.push(new Objects.Genre(genre))

  });

  loadCallback()
})

loadCallback()