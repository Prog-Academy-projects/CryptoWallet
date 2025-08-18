import { showLineChart } from "./charts/lineChart.js";

import { getCryptoRates } from "./api-coingecko/crypto-rates.js";
import { getMarketChart } from "./api-coingecko/market-chart.js";


// ------------ TEST DATA ------------
const coins_get_rate = "btc,eth,trx,xrp,ltc,usdt,doge";
const coins_to_display = ["bitcoin", "ethereum", "tron"]


// ------------ RENDER RATES ------------
export async function renderRates() {
    const rates = await getCryptoRates(coins_get_rate);
    rates.forEach((obj) => {
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
    });
}

// ------------ RENDER MARKET CHART ------------
export async function renderMarketChart() { //data, coin
    coins_to_display.forEach(async (coin) => {
        const data = await getMarketChart(coin);
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
    })
}