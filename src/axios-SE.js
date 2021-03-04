import axios from 'axios';
import { SEHost } from './shared/consts';

const instance = axios.create({
    baseURL: SEHost
});

export default instance;  