import axios from 'axios';

// export const baseURL = "http://13.39.109.183:4000"
export const baseURL = "http://15.237.160.124:4000"


export const API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}); 

