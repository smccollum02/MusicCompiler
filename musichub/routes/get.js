const objects = require("./dbObjects")
const db = require("./database")

function getSong(id) {
    const row = db.executeQuery(`SELECT * FROM SONGS WHERE ID = ${id}`, Song)
}
async function getSongs(params) {
    let songs = []
    const buildSongs = (data) => {
        console.log(data)
        songs = data.map((songData) => {
            console.log(songData)
            return new objects.Song(songData)
        })
    }
    await db.executeQuery(`SELECT * FROM SONGS`, buildSongs)
    return songs
}
async function getGenres(params) {
    let genres = {}
    const buildSongs = (data) => {
        data.forEach((songData) => {
            if (genres[songData.GENRE_ID]) {
                genres[songData.GENRE_ID].push(new objects.Song(songData))
            }
            else {
                genres[songData.GENRE_ID] = [new objects.Song(songData)]
            }
        })
    }
    const buildGenres = (data) => {
        data.forEach((genreData) => {
            genres[genreData.ID] = new objects.Genre(genreData)
        })
    }
    await db.executeQuery(`SELECT * FROM GENRES`, buildGenres)
    await db.executeQuery(`SELECT * FROM SONGS`, buildSongs)

    return genres
}

module.exports = {getGenres, getSongs, getSong}