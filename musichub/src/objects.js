export class MusicObj {
    constructor (data) {
        this.id = data.id
        this.name = data.name
        this.spotifyID = data.spotifyID
    }
}

export class Song extends MusicObj {
    constructor (data) {
        super(data)
        this.artists = data.artists ? data.artists : []
        this.genreID = data.genreID
    }
}

export class Artist extends MusicObj {
    constructor (data) {
        super(data)
    }
}

export class Genre {
    constructor (data) {
        this.id = data.id
        this.name = data.name
        this.songs = data.songs ? data.songs.map((songData) => { return new Song(songData)}) : []
    }
}