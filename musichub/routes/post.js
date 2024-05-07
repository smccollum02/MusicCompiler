const objects = require("./dbObjects")
const db = require("./database")

async function postArtists(params) {
    
}
async function postSongs(params) {
    let songs = params
    for (const song of songs) {
        const songID = await db.executeQueryGetID(`INSERT INTO SONGS (NAME, GENRE_ID, SPOTIFY_ID) VALUES ('${song.name}', ${song.genreID}, '${song.spotifyID}')`)
        song.id = songID
        for (const artist of song.artists) {
            console.log(artist)
            if (artist.id === 0) {
                const artistID = await db.executeQueryGetID(`INSERT INTO ARTISTS (NAME, SPOTIFY_ID) VALUES ('${artist.name}', '${artist.spotifyID}')`)
                console.log(artistID)
                artist.id = artistID
            }
            await db.executeQuery(`INSERT INTO REL_ARTIST_SONG (SONG_ID, ARTIST_ID) VALUES (${songID}, ${artist.id})`)
        }
    }
    console.log(songs)
    return songs
}
async function postGenres(params) {
    let genres = params
    for (const genre of genres) {
        const genreID = await db.executeQueryGetID(`INSERT INTO GENRES (NAME) VALUES ('${genre.name}')`)
        genre.id = genreID
    }
    console.log(genres)
    return genres
}
async function updateGenre(params) {
    const id = params.ID
    const name = params.NAME

    await db.executeQuery(`UPDATE GENRES SET NAME = '${name}' WHERE ID = ${id}`)
    return true
}

module.exports = {postGenres, updateGenre, postSongs, postArtists}