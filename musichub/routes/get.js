const objects = require("./dbObjects")
const db = require("./database")

async function runConcurrently(functions) {
    functions = functions.map((funct) => funct())

    Promise.all(functions).then((responses) => {
        return responses
    })
  }
async function getSong(id) {
    const row = await db.executeQuery(`SELECT * FROM SONGS WHERE ID = ${id}`)
    return new objects.Song(row)
}
async function getArtists(params) {
    let artists = []
    let data = await db.executeQuery(`SELECT * FROM ARTISTS`)

    artists = data.map((artistData) => {
        console.log(artistData)
        return new objects.Artist(artistData)
    })
    return artists
}
async function getSongs(params) {
    let songs = {}
    let artistsDict = {}
    let data = await db.executeQuery(`SELECT * FROM SONGS`)
    let relData = await db.executeQuery(`SELECT * FROM REL_ARTIST_SONG`)
    let artists = await getArtists()
    data.forEach((songData) => {
        songs[songData.ID] = new objects.Song(songData)
    })

    artists.forEach((artist) => {
        artistsDict[artist.id] = artist
    })

    console.log(relData)
    relData.forEach((rel) => {
        console.log(rel)
        songs[rel.SONG_ID].artists.push(artistsDict[rel.ARTIST_ID])
    })
    
    return Object.values(songs)
}
async function getGenres(params) {
    let genres = {}
    let genreData = await db.executeQuery(`SELECT * FROM GENRES`)

    genreData.forEach((genreData) => {
        genres[genreData.ID] = new objects.Genre(genreData)
    })

    let songs = await getSongs()

    console.log(songs)

    songs.forEach((song) => {
        console.log(song)
        if (genres[song.genreID]) {
            genres[song.genreID].songs.push(song)
        }
    })

    return Object.values(genres)
}

module.exports = {getGenres, getSongs, getSong}