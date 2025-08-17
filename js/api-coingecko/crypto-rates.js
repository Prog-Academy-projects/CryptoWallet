import { URL, req } from "./main.js";

// -------------------- CRYPTO RATES --------------------
const CACHE_TTL = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'cryptoRates';

const NAME_BY_SYMBOL = { 
    btc: 'Bitcoin',
    eth: 'Ethereum',
    trx: 'Tron',
    doge: 'Dogecoin',
    usdt: 'Tether',

 };

export const getCryptoRates = () => {
    document.querySelector(".modal-loader").classList.add("active");

    const coins = "btc";
    const include_market_cap = "true";
    const include_24hr_vol = "true";
    const include_24hr_change = "true";
    const include_last_updated_at = "true";

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
            console.log("Use data from localStorage");
            parsed.data.forEach(showCryptoRates);
            document.querySelector(".modal-loader").classList.remove("active");
            return;
        }
    }
    //&include_tokens=all
    // req(URL+`simple/price?vs_currencies=usd&symbols=${coins}
    //     &include_market_cap=${include_market_cap}
    //     &include_24hr_vol=${include_24hr_vol}
    //     &include_24hr_change=${include_24hr_change}
    //     &include_last_updated_at=${include_last_updated_at}
    //     &precision=2`)
    // `simple/price?vs_currencies=usd&symbols=btc%2Ceth%2Cdoge&include_tokens=all
    // &include_market_cap=true&include_24hr_vol=true
    // &include_24hr_change=true&include_last_updated_at=true
    // &precision=2`)
    // ids=bitcoin,ethereum,tron
    req(URL+
        'simple/price?symbols=btc%2Ceth%2Ctrx&vs_currencies=usd' +
        '&include_market_cap=true&include_24hr_vol=true' +
        '&include_24hr_change=true&include_last_updated_at=true&precision=2')
    .then((data)=>{
        console.log("Fetched:", data);

        const arr = Object.entries(data).map(([symbol, values]) => ({
            symbol,
            name: NAME_BY_SYMBOL[symbol] || symbol.toUpperCase(),
            ...values
        }));

        // if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: arr
        }));
        arr.forEach(showCryptoRates);
        // }
    })
    .catch((error) => {
        console.log("Fetch error:", error);
    })
    .finally(() => {
        document.querySelector(".modal-loader").classList.remove("active");
    });
}

function showCryptoRates(obj) {
    const { symbol, name, usd, usd_market_cap, usd_24h_vol, usd_24h_change, last_updated_at } = obj;
   
    const updatedAt = last_updated_at
    ? new Date(last_updated_at * 1000).toLocaleString()
    : '-';  

    const pattern = `
        <tr>
            <td>${symbol.toUpperCase()}</td>
            <td><h3>${name}</h3></td>
            <td>${usd_24h_vol != null ? Number(usd_24h_vol).toLocaleString() : '-'}</td>
            <td>${usd_24h_change != null 
                    ? usd_24h_change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %' 
                    : '-'}</td>
            <td><h3>${usd != null ? "$ " + Number(usd).toLocaleString() : '-'}</h3><div>Details</div></td>
            <td><h4>⭐ ${usd_market_cap != null ? Number(usd_market_cap).toLocaleString() : '-'}</h4></td>
            <td>${updatedAt}</td>
        </tr>
    `;
    document.querySelector(".cryptoRatesBody").insertAdjacentHTML('beforeend', pattern)
}

// getCryptoRates();
document.querySelector("#getCryptoRates").addEventListener("click", getCryptoRates)

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