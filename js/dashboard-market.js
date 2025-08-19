import { COINS, COINS_BY_ID, COINS_BY_SYMBOL } from "./settings.js";

import { renderLineChart } from "./charts/lineChart.js";

import { getCryptoRates } from "./api-coingecko/crypto-rates.js";
import { getMarketChart } from "./api-coingecko/market-chart.js";


// ------------ TEST DATA ------------
const coins_get_rate = "btc,eth,trx,xrp,ltc,doge,usdt"; // TO STORE in LocalStorage
const coins_rate = "btc,eth,trx"; // To show rate
const coins_for_market_chart = ["bitcoin", "ethereum", "tron", "ripple", "litecoin", "dogecoin"] // To show chart - ONLY NAME IN LOWER CASE


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
                // console.log("Rate: ", rates[i])
                const data = await getMarketChart(coin_id)
                const lastPriceIndex = data.prices.length - 1;
                const lastPrice = data.prices[lastPriceIndex]?.[1];
                // ------ displaying lastPrice from Coin Rate
                //rates[i].usd.toLocaleString()
                //lastPrice.toLocaleString()

                // ------ displaying lastPrice from Coin Rate
                const differ = rates[i].usd_24h_change?.toFixed(2) ?? "0";
                // ------ displaying difference from Coin History (today-yesterday)
                const difference = (lastPrice - data.prices[lastPriceIndex - 1]?.[1]) 
                / data.prices[lastPriceIndex - 1]?.[1] * 100

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

                renderLineChart(dataset, color, coin_id)
            }
        }
    })
}