import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://byob-48b08.firebaseio.com/'
})

export default instance;