export default class Storage {
    constructor(genres, songs, artists, token) {
        this.genres = genres ? genres : []
        this.songs = songs ? songs : []
        this.artists = artists ? artists : []
        this.token = token
    }
}