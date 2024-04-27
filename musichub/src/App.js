import './App.css';
import './Menu.css'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client'
import * as API from './API';
import * as Objects from  './objects'

function App({props}) {
  const addGenre = useRef()
  const addSong = useRef()
  
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

  const postSongs = (songs) => {
    API.Post("Songs", {SONGS: songs})
  }

  const makeColumn = (genre, i) => {
    let propObj = {
      name: genre.name,
      cards: makeColumnCards(genre.songs),
      add: addGenre,
      index: i,
      id: genre.id
    }
    return <Column key={genre.id} props={propObj}/>;
  }

  const makeColumnCards = (songs) => {
    let cardList = [];
    songs.forEach((song, i) => {
      cardList.push(<Card key={i} props={song}/>);
    });
    cardList.push(<Card key={songs.length} props={{isAdded: true, addSong: addSong}}/>);
    return cardList;
  }

  const makeColumns = (genresArray) => {
    let columns = [];
    genresArray.forEach((genre, i) => {
      columns.push(makeColumn(genre, i))
    })
    return columns;
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

  addGenre.current = (e) => {
    let newIndex = parseInt(e.target.parentElement.parentElement.dataset.index) + 1
    Promise.all([API.Post("Genre", {ORDER: newIndex})]).then((response) => { 
      let genre = new Objects.Genre(response[0])
      setGenreList((prevList) => {
        let newList = [...prevList]
        newList.splice(newIndex, 0, genre)
        return newList
      })
    })
  }

  addSong.current = () => {
    Promise.all([API.Spotify(`GetUserSongs?TOKEN=${token}`)]).then((response) => {
      let topTracks = response
      console.log(topTracks)
      const props = {
        title: "Add Song",
        type: "add-song",
        item: topTracks[0],
        buttons: [],
        close: closeMenu,
        callback: postSongs
      }
      setMenu(<Menu props={props}></Menu>)
    })
  }

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

  const handleNameClick = () => {
    setIsEditing(true)
  }

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const handleBlur = () => {
    API.Post("UpdateGenre?NAME=" + text + "&ID=" + props.id)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.keyCode == 13) {
      API.Post("UpdateGenre?NAME=" + text + "&ID=" + props.id)
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
          onClick={props.add.current}
        >+</div>
      </div>
      <div className="Cards-Container">
        <div className="Cards">{props.cards}</div>
      </div>
    </div>
  );
}

function Card({props}) {
  
  return (
    <div className="Card">
      {!props.isAdded ? (
      <div className="Card-Background">
        <img className="CardImg"
          src={props.imgSrc}
        />
        <div className="Title">{props.name}</div>
      </div>
      ) : (
        <div className="Add-Card"
          onClick={props.addSong.current}
        >
          <div className="Plus">+</div>
          <div className="Add-Text">Add New Song</div>
        </div>
      )}
    </div>
  );
}

function Menu({props}) {
  const renderSwitchParam = (param) => {
    switch (props.type) {
      case "add-song": return <div className="Content"><AddSongContent props={props}></AddSongContent></div>
    }
  }

  return (
    <div className="Menu-Container">
      <div className="Title" onClick={props.close}>{props.title}</div>
      {renderSwitchParam(props.type)}
      <div className="Buttons"></div>
    </div>
  )
}

function AddSongContent({props}) {
  const songs = props.item
  const songComps = []
  songs.forEach((song) => {
    songComps.push(<div className='Add-Song-Card'>
                      <dic className='Add-Song-Title' onClick={props.callback([song])}>{song.name}</dic>
                    </div>)
  })
  return (
    <div className="Menu-Content">{songComps}</div>
  )
}

export {App, Column, Card};
