class MusicObj {
    constructor (data) {
        this.id = data.id
        this.name = data.name
        this.spotifyID = data.spotifyID
    }
}

class Song extends MusicObj {
    constructor (data) {
        super(data)
    }
}

class Artist extends MusicObj {
    constructor (data) {
        super(data)
    }
}

class Genre {
    constructor (data) {
        this.id = data.id
        this.name = data.name
        this.songs = data.songs.map((songData) => { return new Song(songData)})
    }
}