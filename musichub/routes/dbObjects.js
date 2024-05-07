class MusicObj {
    constructor (data) {
        this.id = data.ID
        this.name = data.NAME
        this.spotifyID = data.SPOTIFY_ID
    }
}

class Song extends MusicObj {
    constructor (data) {
        super(data)
        this.artists = data.artists ? data.artists : []
        this.genreID = data.GENRE_ID
    }
}

class Artist extends MusicObj {
    constructor (data) {
        super(data)
    }
}

class Genre {
    constructor (data) {
        this.id = data.ID
        this.name = data.NAME
        this.songs = data.SONGS ? data.SONGS.map((songData) => { return new Song(songData)}) : []
    }
}

module.exports = {Song, Genre, Artist}