
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const fetch = require('node-fetch')
const http = require('http')
const socketIO = require('socket.io')
const post = require('./post')
const get = require('./get')

const SPOTIFY_CLIENT_ID = "4f1990ba39bd4dc7bb507b9788468b93"
const SPOTIFY_CLIENT_SECRET = "720fa1682876477ea6ced985d1d0d6a7"
const SPOTIFY_REDIRECT_URI = "http://localhost:3000/"

const app = express();
app.use(cors())
app.use(express.json());
app.use(session({
    secret: 'sd%jjas^&*67',
    resave: false,
    saveUninitialized: true
}));

const PORT = 3001
const server = http.createServer(app)
const io = socketIO(server)


io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle user interactions
    socket.on('userAction', (data) => {
        // Process user action (e.g., update database)
        // Emit real-time update to all connected clients
        io.emit('update', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log("listening on port" + PORT)
})

app.get("/GET", async (req, res) => {
    //try {
        const action = req.query.action
        console.log(req.query.action)
        let resObj = undefined
        switch (action) {
            case "Songs":
                resObj = await get.getSongs()
                break;
            case "Genres":
                resObj = await get.getGenres()
                console.log(resObj)
                break;
        }
        res.json(resObj)
    /*} catch (error) {
        console.log("Error processing get request")
    }*/
})

app.get("/POST", async (req, res) => {
    
})

app.get("/POST_AccessToken", async (req, res) => {
    try {
        const token = cleanString(req.query.TOKEN)
        req.session.accessToken = token
    } catch (error) {
        console.error("Error saving token:", error);
        res.status(500).json({ error: "Error saving token" });
    }
});

app.get("/SPOTIFY_GetUserSongs", async (req, res) => {
    try {
        const tracks = await getTopTracks(req.query.TOKEN)
        console.log(tracks)
        res.json(tracks.map((track) => {
            return {
                name: track.name,
                artists: track.artists.map((artist) => { return { 
                    id: artist.id, 
                    name: artist.name,
                    spotifyID: artist.id
                }}),
                spotifyID: track.id
            }
        }))
    } catch (error) {
        console.error("Error saving token:", error);
        res.status(500).json({ error: "Error saving token" });
    }
})

async function fetchWebApi(endpoint, method, token, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: method,
      body: JSON.stringify(body)
    });
    return await res.json();
  }
  
async function getTopTracks(token){
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi('v1/me/top/tracks?time_range=medium_term&limit=10', 'GET', token)).items;
}

const cleanString = function (string) {
    return string
}

const cleanInt = function (int) {
    return int
}