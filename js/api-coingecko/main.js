import { API_KEY } from "../config.js";

export const URL = 'https://api.coingecko.com/api/v3/'

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const options = {
    method: 'GET', 
    headers: { 
        accept: 'application/json', 
        'x-cg-demo-api-key': API_KEY
    }
};

export class HttpError extends Error {
  constructor(response, body) {
    super(`HTTP ${response.status} ${response.statusText}`);
    this.name = 'HttpError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.url = response.url;
    this.body = body;
  }
}

export const req = async (url) => {
    // await delay(1000);
    try {
        const response = await fetch(url, options);

        const contentType = response.headers.get('content-type') || '';

        let body;
        try {
            if (contentType.includes('application/json')) {
                body = await response.json();
            } else {
                body = await response.text();
            }
        } catch (parseErr) {
            body = null;
        }

        if (!response.ok) {
            throw new HttpError(response, body);
        }

        return body;
    } catch (err) {
        if (err instanceof HttpError) throw err;

        const e = new Error(`NetworkError: ${err.message || err}`);
        e.name = 'NetworkError';
        throw e;
    }
    // const data = await fetch(url, options);
    // return data.json();
};

export function handleRequestError(err, { showAlert = true } = {}) {
    console.error("handleRequestError:", err);

    let userMessage = "An error occurred. Please try again.";

    if (err && err.name === 'HttpError') {
        const status = err.status;

        if (status === 401) userMessage = "Unauthorized — please sign in.";
        else if (status === 403) userMessage = "Access denied.";
        else if (status === 404) userMessage = "Requested resource not found.";
        else if (status === 429) userMessage = "Too many requests — rate limit exceeded. Please wait and try again.";
        else if (status >= 400 && status < 500) userMessage = `Client error ${status}. ${err.body?.message || err.statusText || ''}`;
        else if (status >= 500) userMessage = `Server error ${status}. Please try again later.`;
    } else if (err && err.name === 'NetworkError') {
        userMessage = "Network error. Check your internet connection.";
    } else if (err instanceof Error) {
        userMessage = err.message;
    }

    if (showAlert) {
        try { 
            alert(userMessage); 
        } catch(e) { /* ignore alert failing in some contexts */ }
    }

    return { ok: false, message: userMessage, error: err };
}