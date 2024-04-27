import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import * as API from './API';
import * as Objects from  './objects'

let genres = [];

const loadCallback = function() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  let contentObj = {
    headerContent: "",
    genreList: genres
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