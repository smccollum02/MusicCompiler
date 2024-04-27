import axios from 'axios';

export async function Get(action) {
    const response = await axios.get('http://localhost:3001/GET', { params: { action: action } })
    return response.data
}

export async function Post(action, data) {
    const response = await axios.post('http://localhost:3001/POST', data, { params: { action: action } })
    return response.data
}

export async function Authenticate() {
    const response = await axios.get('http://localhost:3001/login')
    return response.data
}

export async function Spotify(action) {
    const response = await axios.get('http://localhost:3001/SPOTIFY_' + action)
    return response.data
}