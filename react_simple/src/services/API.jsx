import axios from 'axios';

export const baseURL = "http://35.180.103.66:4000"


export const API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}); 

