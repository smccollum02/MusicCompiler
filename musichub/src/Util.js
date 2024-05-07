import * as Objects from  './objects'
import * as API from './API'
export async function postSongs(songs, callback) {
    let retSongs = await API.Post("Songs", songs)
    let newSongs = []

    retSongs.forEach((song) => {
        newSongs.push(new Objects.Song(song))
    })

    callback(newSongs)
}

export async function postGenres(genres, callback) {
    let retGenres = await API.Post("Genres", genres)
    let newGenreList = []

    retGenres.forEach((genre) => {
        newGenreList.push(new Objects.Genre(genre))
    })

    callback(newGenreList)
}