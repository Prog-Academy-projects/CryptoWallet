import { URL, req } from "./main.js";
import { COINS_BY_SYMBOL, COINS_GET_RATE } from "../settings.js";


const CACHE_TTL = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'cryptoRates';

let cachedRates = null;
let lastUpdated = 0;

export async function getRatesCached() {
    const now = Date.now();
    if (!cachedRates || (now - lastUpdated > 60000)) {
        cachedRates = await getCryptoRates(COINS_GET_RATE);
        lastUpdated = now;
    }
    console.log("getRatesCached:"+cachedRates)
    return cachedRates;
}

// -------------------- GET CRYPTO RATES --------------------
export const getCryptoRates = async (coins) => {
    const loader = document.querySelector(".modal-loader");
    loader?.classList.add("active");

    const url = URL +
    `simple/price?symbols=${coins}&vs_currencies=usd` +
    `&include_market_cap=true&include_24hr_vol=true` +
    `&include_24hr_change=true&include_last_updated_at=true&precision=2`;

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_TTL) {
                console.log("Use data from localStorage");
                return parsed.data;
            }
        }

        const data = await req(url);
        console.log("Fetched:", data);

        const arr = Object.entries(data).map(([symbol, values]) => ({
            symbol,
            name: COINS_BY_SYMBOL[symbol].name || symbol.toUpperCase(),
            ...values
        }));

        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: arr
        }));
        return arr;
    } catch (error) {
        console.log("Fetch error:", error);
        return [];
    } finally {
        loader?.classList.remove("active");
    }
}