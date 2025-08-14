import { URL, req } from "./main.js";

import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

const DB_NAME = 'cryptoDB';
const STORE_NAME = 'marketChart';
const CACHE_TTL = 24 * 60 * 60 * 1000;

// -------------------- MARKET CHART --------------------

async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        }
    });
}

export const getMarketChart = async () => {
    document.querySelector(".modal-loader").classList.add("active")
    const db = await initDB();

    const cached = await db.get(STORE_NAME, 'btc');
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log("Use data from IndexedDB");
        renderMarketChart(cached.data);
        document.querySelector(".modal-loader").classList.remove("active");
        return;
    }

    // const FULL_URL = URL+'coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily&precision=2';
    // req(FULL_URL)
    
    req(URL+'simple/price?vs_currencies=usd&symbols=btc')
    .then((data)=>{
        console.log(data);
        // if (Array.isArray(data) && data.length > 0) {
        db.put(STORE_NAME, { id: 'btc', timestamp: Date.now(), data: data });
        renderMarketChart(data);
        // }
        document.querySelector(".modal-loader").classList.remove("active")
    })
    .catch((error) => {
        document.querySelector(".modal-loader").classList.remove("active")
        throw new Error(error)
    });
}

function renderMarketChart(data) {
    const tbody = document.querySelector(".marketChartBody");
    tbody.innerHTML = '';
    data.prices.forEach(([timestamp, price], index) => {
        const date = new Date(timestamp).toLocaleDateString();
        const marketCap = data.market_caps[index]?.[1] || '-';
        const volume = data.total_volumes[index]?.[1] || '-';
        tbody.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${date}</td>
                <td>$${price.toFixed(2)}</td>
                <td>${marketCap.toLocaleString()}</td>
                <td>${volume.toLocaleString()}</td>
            </tr>
        `);
    });
}

document.querySelector(".getMarketChart").addEventListener("click", getMarketChart)

// {
//   "prices": [
//     [
//       1711843200000,
//       69702.3087473573
//     ],
//     [
//       1711929600000,
//       71246.9514406015
//     ],
//     [
//       1711983682000,
//       68887.7495158568
//     ]
//   ],
//   "market_caps": [
//     [
//       1711843200000,
//       1370247487960.09
//     ],
//     [
//       1711929600000,
//       1401370211582.37
//     ],
//     [
//       1711983682000,
//       1355701979725.16
//     ]
//   ],
//   "total_volumes": [
//     [
//       1711843200000,
//       16408802301.8374
//     ],
//     [
//       1711929600000,
//       19723005998.215
//     ],
//     [
//       1711983682000,
//       30137418199.6431
//     ]
//   ]
// }


// {prices: Array(31), market_caps: Array(31), total_volumes: Array(31)}
// market_caps: 
// (31) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
// prices: 
// (31) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
// 0: Array(2)
// 0: 1752624000000
// 1: 117678.19
// length: 2
// [[Prototype]]: Array(0)
// 1: (2) [1752710400000, 118748.16]
// 2: (2) [1752796800000, 119445.37]
// 3: (2) [1752883200000, 117988.95]
// total_volumes: 
// (31) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
// [[Prototype]]: Object

// fetch(URL+'coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily&precision=2', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));