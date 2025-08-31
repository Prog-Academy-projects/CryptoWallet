import { API_KEY } from "../config.js";

export const URL = 'https://api.coingecko.com/api/v3/'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const options = {
        method: 'GET', 
        headers: { accept: 'application/json', 'x-cg-demo-api-key': API_KEY }
};
export const req = async (url) => {
    // await delay(1000);
    const data = await fetch(url, options);
    return data.json();
};