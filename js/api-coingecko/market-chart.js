import { URL, req } from "./main.js";

import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

const DB_NAME = 'cryptoDB';
const STORE_NAME = 'marketChart';
const CACHE_TTL = 24 * 60 * 60 * 1000;

async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        }
    });
}

// -------------------- GET MARKET CHART --------------------
export const getMarketChart = async (coin) => {
    const loader = document.querySelector(".modal-loader");
    loader?.classList.add("active");

    const db = await initDB();

    const count = 30;
    const interval = "daily"; // daily, hourly, 5m

    try {
        const cached = await db.get(STORE_NAME, coin);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`Use ${coin} from IndexedDB`, cached);
            return cached.data;
        }

        const data = req(URL+`coins/${coin}/market_chart?vs_currency=usd&days=${count}&interval=${interval}&precision=2`);
        console.log(`${coin} fresh data`, data);

        db.put(STORE_NAME, { 
            id: coin, 
            timestamp: Date.now(), 
            data: data
        });
        return data.data;
    } catch (error) {
        console.log("Fetch error:", error);
        return [];
    } finally {
        loader?.classList.remove("active");
    }
}

// document.querySelector("#getMarketChart").addEventListener("click", getMarketChart)

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