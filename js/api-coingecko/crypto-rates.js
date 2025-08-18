import { URL, req } from "./main.js";
import { NAME_BY_SYMBOL } from "../settings.js";

// -------------------- CRYPTO RATES --------------------
const CACHE_TTL = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'cryptoRates';

export const getCryptoRates = async () => {
    const loader = document.querySelector(".modal-loader");
    loader?.classList.add("active");

    const coins = "btc,eth,trx,doge";
    const include_market_cap = "true";
    const include_24hr_vol = "true";
    const include_24hr_change = "true";
    const include_last_updated_at = "true";
    const url =
    URL +
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
            name: NAME_BY_SYMBOL[symbol.toUpperCase()] || symbol.toUpperCase(),
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

// (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// 0
// : 
// {id: 'bitcoin', name: 'Bitcoin', usd: 118008.81, usd_market_cap: 2357698682630.9873, usd_24h_vol: 78176387484.51817, …}
// 1
// : 
// {id: 'osmosis-allbtc', name: 'Osmosis allBTC', usd: 118762.5, usd_market_cap: 13425217.299430989, usd_24h_vol: 5689397.748091219, …}
// 2
// : 
// {id: 'batcat', name: 'batcat', usd: 0, usd_market_cap: 51178.07110747678, usd_24h_vol: 146.2522912913952, …}
// 3
// : 
// {id: 'bobby-the-cat', name: 'Bobby The Cat', usd: 0, usd_market_cap: 18589.48081865048, usd_24h_vol: 804.0330311776324, …}
// 4
// : 
// {id: 'big-tom-coin', name: 'Big Tom Coin', usd: 0, usd_market_cap: 7738.834919626792, usd_24h_vol: 5.64162473113104, …}
// 5
// : 
// {id: 'mezo-wrapped-btc', name: 'Mezo Wrapped BTC', usd: 122740.98, usd_market_cap: 0, usd_24h_vol: 13193.74909884774, …}
// 6
// : 
// {id: 'blackrocktradingcurrency', name: 'BlackrockTradingCurrency', usd: 0, usd_market_cap: 0, usd_24h_vol: 3351.254134399667, …}
// 7
// : 
// {id: 'meld-bridged-btc-meld', name: 'Meld Bridged BTC (Meld)', usd: 63865.98, usd_market_cap: 0, usd_24h_vol: 1555.1387893240774, …}
// 8
// : 
// {id: 'bitcoin-on-sol', name: 'Bitcoin on SOL', usd: 0, usd_market_cap: 0, usd_24h_vol: 104.9134579237856, …}
// length
// : 
// 9