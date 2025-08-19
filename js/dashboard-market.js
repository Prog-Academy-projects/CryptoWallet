import { showLineChart } from "./charts/lineChart.js";

import { getCryptoRates } from "./api-coingecko/crypto-rates.js";
import { getMarketChart } from "./api-coingecko/market-chart.js";

import { COINS, COINS_BY_ID, COINS_BY_SYMBOL } from "./settings.js";


// ------------ TEST DATA ------------
const coins_get_rate = "btc,eth,trx,xrp,ltc,doge,usdt"; // TO STORE in LocalStorage
const coins_rate = "btc,eth,trx"; // To show rate
const coins_for_market_chart = ["bitcoin", "ethereum", "tron", "ripple", "litecoin", "dogecoin"] // To show chart - ONLY NAME IN LOWER CASE


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
export async function renderMarketChart() {
    const rates = await getCryptoRates(coins_get_rate);

    const list = document.getElementById("cryptoList");
    list.innerHTML = "";
    coins_for_market_chart.forEach(async (coin_id) => {
        
        console.log(COINS_BY_ID[coin_id])
        const name = COINS_BY_ID[coin_id].name || "Solana";
        const symbol = COINS_BY_ID[coin_id].symbol || "sol";
        const upper_symbol = symbol.toUpperCase(); 
        const icon = COINS_BY_ID[coin_id].icon || "../assets/img/solana.png";
        const color = COINS_BY_ID[coin_id].color || "#999";

        let i = 0;
        for (i in rates){
            if (symbol == rates[i].symbol){
                console.log("Rate: ", rates[i])
                
                const differ = rates[i].usd_24h_change?.toFixed(2) ?? "0";

                const span = document.createElement("span");
                span.textContent = differ.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) + " %";

                const green = "#2FA15D";
                const red = "#A13D2F";

                if (differ > 0) {
                    span.style.color = `${green}`;
                    span.style.textShadow = `0 0 5px ${green}`;
                    span.insertAdjacentHTML('afterbegin',
                        `<svg class="icon" style="filter: drop-shadow(0px 0px 5px ${green})"><use href="../assets/icons/arrow-up-right.svg"></use></svg>`)
                } else if (differ < 0) {
                    span.style.color = `${red}`;
                    span.style.textShadow = `0 0 5px ${red}`;
                    span.insertAdjacentHTML('afterbegin',
                        `<svg class="icon" style="filter: drop-shadow(0px 0px 5px ${red})"><use href="../assets/icons/arrow-down-left.svg"></use></svg>`)
                } else {    
                    span.style.color = "gray";
                    span.style.textShadow = "0 0 5px gray";
                }

                const data = await getMarketChart(coin_id)
                const lastPriceIndex = data.prices.length - 1;
                const lastPrice = data.prices[lastPriceIndex]?.[1];
                //lastPrice.toLocaleString()
                //rates[i].usd.toLocaleString()

                // const difference = (lastPrice - data.prices[lastPriceIndex - 1]?.[1]) 
                // / data.prices[lastPriceIndex - 1]?.[1] * 100; 

                const item = `
                    <li class="chart-container ${coin_id}">
                        <nav>
                            <img src="${icon}" alt="${coin_id}">
                            <div>
                                <h4 class="poppins-regular">${name}</h4>
                                <h5 class="poppins-regular" id="curPrice-${symbol}">
                                    $${lastPrice.toLocaleString()}
                                </h5>
                            </div>
                            <div>
                                <p>${upper_symbol}</p>
                                <p class="poppins-regular difference-style" 
                                   id="curDif-${symbol}">
                                </p>
                                ${span.outerHTML}
                            </div> 
                        </nav>
                        <div class="line-chart">
                            <canvas id="lineChart-${coin_id}"></canvas>
                        </div>
                    </li>
                `;

                list.insertAdjacentHTML("beforeend", item);


                let dataset = data.prices.map(([timestamp, price]) => ({
                    x: new Date(timestamp).toLocaleDateString(),
                    y: price
                }));

                showLineChart(dataset, color, coin_id)
            }
        }
    })
}