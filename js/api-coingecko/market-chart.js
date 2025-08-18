import { URL, req } from "./main.js";

import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

import { showLineChart } from "../charts/lineChart.js";

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

    const count = 30;
    const interval = "daily"; // daily, hourly, 5m
    const coins = ["bitcoin", "ethereum", "tron"]

    const promises = coins.map(async (coin) => {
        const cached = await db.get(STORE_NAME, coin);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`Use ${coin} from IndexedDB`);
            renderMarketChart(cached.data, coin);
            return;
        }

        return req(URL+`coins/${coin}/market_chart?vs_currency=usd&days=${count}&interval=${interval}&precision=2`)
            .then((data)=>{
                console.log(`${coin} fresh data`, data);
                db.put(STORE_NAME, { id: coin, timestamp: Date.now(), data: data });
                renderMarketChart(data, coin);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                document.querySelector(".modal-loader").classList.remove("active")
            });
    });

    await Promise.all(promises);
    document.querySelector(".modal-loader").classList.remove("active");
}

function renderMarketChart(data, coin) {
    const curPrice = document.querySelector(`#curPrice-${coin}`);
    const curDif = document.querySelector(`#curDif-${coin}`);
    curPrice.innerHTML = '';
    curDif.innerHTML = '';
    
    const lastPriceIndex = data.prices.length - 1;
    const lastPrice = data.prices[lastPriceIndex]?.[1];

    curPrice.insertAdjacentHTML('beforeend', "$ " + lastPrice.toLocaleString());

    const difference = (lastPrice - data.prices[lastPriceIndex - 1]?.[1]) 
                    / data.prices[lastPriceIndex - 1]?.[1] * 100; 
    
    const span = document.createElement("span");
    span.textContent = difference.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " %";

    if (difference > 0) {
        span.style.color = "#2FA15D";
        span.style.textShadow = "0 0 5px #2FA15D";
        span.insertAdjacentHTML('afterbegin',
            '<svg class="icon" style="filter: drop-shadow(0px 0px 5px #2FA15D)"><use href="../assets/icons/arrow-up-right.svg"></use></svg>')
    } else if (difference < 0) {
        span.style.color = "#A13D2F";
        span.style.textShadow = "0 0 5px #A13D2F";
        span.insertAdjacentHTML('afterbegin',
            '<svg class="icon" style="filter: drop-shadow(0px 0px 5px #A13D2F)"><use href="../assets/icons/arrow-down-left.svg"></use></svg>')
    } else {    
        span.style.color = "gray";
        span.style.textShadow = "0 0 5px gray";
    }

    curDif.appendChild(span);

    let dataset = data.prices.map(([timestamp, price]) => ({
        x: new Date(timestamp).toLocaleDateString(),
        y: price
    }));

    const colors = {
        bitcoin: "#FFA800",
        ethereum: "#3A6FF8", //"#00ADEF",
        tron: "#FF073A"
    };
    showLineChart(dataset, colors[coin], coin)
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

// fetch(URL+'coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily&precision=2', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));