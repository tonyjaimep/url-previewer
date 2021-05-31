import axios from 'axios'

const instance = axios.create({ baseURL: process.env.MIX_API_ENDPOINT })

export default instance
