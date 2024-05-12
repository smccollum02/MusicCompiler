import './App.css';
import './Menu.css'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client'
import * as API from './API';
import * as Objects from  './objects'
import * as Util from './Util'
import * as Menu from './Menu'

function App({props}) {
  const [genreList, setGenreList] = useState(props.genreList)
  const [token, setToken] = useState(null)
  const [menu, setMenu] = useState(null)
  
  const authenticate = () => {
    const SPOTIFY_CLIENT_ID = "4f1990ba39bd4dc7bb507b9788468b93"
    const SPOTIFY_REDIRECT_URI = "http://localhost:3000/"

    let state = Math.random()
    let scope = 'user-read-private user-read-email user-library-read user-top-read'
    let url = 'https://accounts.spotify.com/authorize?' +
                'response_type=token' +
                '&show_dialog=true' +
                '&client_id=' + encodeURIComponent(SPOTIFY_CLIENT_ID) +
                '&scope=' + encodeURIComponent(scope) +
                '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI) +
                '&state=' + encodeURIComponent(state)

    window.location.href = url
  }

  const addGenre = async(e) => {
    await Util.postGenres([{name: "New Genre", songs: []}], (newGenres) => {
      let newGenreList = [...genreList, ...newGenres]
      setGenreList(newGenreList)
    })
  }

  const makeColumn = (genre, i) => {
    let propObj = {
      name: genre.name,
      songs: genre.songs,
      add: addGenre,
      openMenu: openMenu,
      index: i,
      id: genre.id,
      token: token
    }
    return <Column key={genre.id} props={propObj}/>;
  }

  const makeColumns = (genresArray) => {
    let columns = [];
    genresArray.forEach((genre, i) => {
      columns.push(makeColumn(genre, i))
    })
    return columns;
  }

  const openMenu = (props) =>  {
    setMenu(Menu.create({...props, close: closeMenu}))
  }

  const closeMenu = () =>  {
    setMenu(null)
  }
  
  useEffect(() => {
    const socket = io('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] });
    const getAccessToken = (accessToken) => {
      if (accessToken) {
        API.Post(`AccessToken?TOKEN=${accessToken}`)
        setToken(accessToken)
        localStorage.setItem("token", accessToken)
        window.location.href = 'http://localhost:3000'
      } else {
        console.log('Access token not found');
      }
    }
    if (!token) {
      const storedToken = localStorage.getItem("token")
      const urlParams = new URLSearchParams(window.location.hash.replace("#", ""));
      const accessToken = urlParams.get('access_token');
      if (storedToken) {
        setToken(storedToken)
        //API.Post(`AccessToken?TOKEN=${storedToken}`)
      }
      else if (accessToken) {
        getAccessToken(accessToken);
      }
      else {
        authenticate()
      }
    }
    return () => {
      socket.disconnect();
    };
  }, [])

  return (
    <div className={"App" + (menu ? " Menu" : "")}>
      <div className="Header">{props.headerContent}</div>
      <div className="Main">{makeColumns(genreList)}</div>
      <div className="Menu">{menu}</div>
    </div>
  );
}

function Column({props}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.name);
  const [colSongs, setSongs] = useState(props.songs);

  const addSong = async(genreID) => {
    const response = await API.Spotify(`GetUserSongs?TOKEN=${props.token}`)
    let topTracks = response.map((song) => { return new Objects.Song({...song, artists: song.artists.map((artist) => new Objects.Artist(artist)), genreID: genreID})})
    console.log(topTracks)
    const Menu = {
      title: "Add Song",
      type: "add-song",
      item: topTracks,
      buttons: [],
      callback: async function(songs) {
        await Util.postSongs(songs, (newSongs) => {
          let newSongList = [...colSongs, ...newSongs]
          setSongs(newSongList)
        })
      },
      search: true,
      genreID: genreID,
      token: props.token
    }
    props.openMenu(Menu)
  }

  const deleteSong = async(songID) => {
    const response = await API.Post(`DeleteSong`, {SONG_ID: songID})
    if (response) {
      let newSongList = colSongs.filter((song) => { return songID !== song.id })
      setSongs(newSongList)
    }
  }

  const makeColumnCards = () => {
    let cardList = [];
    colSongs.forEach((song, i) => {
      cardList.push(<Card key={i} props={{ delete: deleteSong, song: song, genreID: props.id}}/>);
    });
    cardList.push(<Card key={props.songs.length} props={{isAdded: true, addSong: addSong, genreID: props.id}}/>);
    return cardList;
  }

  const handleNameClick = () => {
    setIsEditing(true)
  }

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const handleBlur = async() => {
    await API.Post("UpdateGenre", {NAME: text, ID: props.id})
    setIsEditing(false)
  }

  const handleKeyDown = async(e) => {
    if (e.keyCode == 13) {
      await API.Post("UpdateGenre", {NAME: text, ID: props.id})
      setText(e.target.value)
      setIsEditing(false)
    }
  };

  return (
    <div className="Column" data-index={props.index}>
      <div className='Column-Header'>
        <div className="Column-Name" onClick={handleNameClick}>{!isEditing ? 
          text : (
            <input className="Column-Input"
              type="text"
              value={text}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
            ></input>
          )}
        </div>
        <div className="Add-Column"
          onClick={props.add}
        >+</div>
      </div>
      <div className="Cards-Container">
        <div className="Cards">{makeColumnCards(colSongs)}</div>
      </div>
    </div>
  );
}

function Card({props}) {
  let song = props.song
  return (
    <div className="Card">
      {!props.isAdded ? (
      <div className="Card-Background">
        <div className="Play-Button"></div>
        <div className="Card-Info">
          <div className="Title">{song.name}</div>
          <div className="Artist-Name">{song.artists.map((artist) => artist.name).join(", ")}</div>
        </div>
        <div className="Delete-Button"
          onClick={() => {props.delete(props.song.id)}}
        >&minus;</div>
      </div>
      ) : (
        <div className="Add-Card"
          onClick={() => {props.addSong(props.genreID)}}
        >
          +
          <div className="Add-Text">Add New Song</div>
        </div>
      )}
    </div>
  );
}

function WebPlayback(props) {
  const [player, setPlayer] = useState(undefined);
  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [currTrack, setTrack] = useState(track);

  useEffect(() => {

    const deviceID = Math.random() * Date.now()
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(props.token); },
            volume: 0.5
        });

        setPlayer(player);

        player.addListener('ready', ({ deviceID }) => {
            console.log('Ready with Device ID', deviceID);
        });

        player.addListener('not_ready', ({ deviceID }) => {
            console.log('Device ID has gone offline', deviceID);
        });


        player.connect();

    };
  }, []);

  return (
     <>
       <div className="Playback-Container">
          <div className="Playback-Wrapper">

           </div>
       </div>
     </>
   );
}

export {App, Column, Card};
