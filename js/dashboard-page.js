import { renderBalanceChart, renderWalletCoins} from "./dashboard-wallet.js";
import { renderMarketChart } from "./dashboard-market.js";


// ------------ TEST DATA ------------
const test_data = { 
    btc: {
        symbol: 'btc',
        name: 'Bitcoin', 
        usd: 118008.81, 
        usd_market_cap: 2357698682630.9873, 
        usd_24h_vol: 78176387484.51817, 
        usd_24h_change: 3.63727894677354,
        last_updated_at: 1711356300
    },
    eth: {
        symbol: "eth", 
        name: "Ethereum", 
        usd: 4478.5, 
        usd_market_cap: 540494072667.8991,
        last_updated_at: 1755463595,
        usd_24h_change: 0.9992786999192023, 
        usd_24h_vol: 25066598160.54498
    },
    trx: {
        symbol: "trx", 
        name: "Tron", 
        usd: 0.35, 
        usd_market_cap: 33377273199.74825,
        last_updated_at: 1755463597,
        usd_24h_change: 1.15906004594372,
        usd_24h_vol: 863997730.4178143,
    }
};

document.addEventListener("DOMContentLoaded", () => {
    renderBalanceChart();
    renderWalletCoins();
    renderMarketChart();
});

export function renderCryptoList(data) {
    const list = document.getElementById("cryptoList");
    list.innerHTML = "";

    Object.entries(data).forEach(([symbol, info]) => {
        const sym = symbol.toUpperCase();
        console.log(SYMBOL_BY_NAME['Bitcoin'])
        const name = NAME_BY_SYMBOL[sym] || sym;
        const icon = ICON_BY_SYMBOL[sym] || "../assets/img/solana.png";
        const color = COLOR_BY_SYMBOL[sym] || "#999";

        const difference = info.usd_24h_change?.toFixed(2) ?? "0";

        const item = `
            <li class="chart-container ${name.charAt(0).toUpperCase()+name.slice(1)}">
                <nav>
                    <img src="${icon}" alt="${name}">
                    <div>
                        <h4 class="poppins-regular">${name}</h4>
                        <h5 class="poppins-regular" id="curPrice-${symbol.toLowerCase()}">
                            $${info.usd.toLocaleString()}
                        </h5>
                    </div>
                    <div>
                        <p>${sym}</p>
                        <p class="poppins-regular difference-style" 
                           id="curDif-${symbol.toLowerCase()}" 
                           style="color:${difference >= 0 ? "green" : "red"};
                                  text-shadow: 0 0 4px ${difference >= 0 ? "green" : "red"};">
                           ${difference} %
                        </p>
                    </div> 
                </nav>
                <div class="line-chart">
                    <canvas id="lineChart-${symbol.toLowerCase()}"></canvas>
                </div>
            </li>
        `;
        list.insertAdjacentHTML("beforeend", item);

        // 🔹 здесь можно сразу вызвать функцию для отрисовки графика
        // renderLineChart(`lineChart-${symbol.toLowerCase()}`, info, color);
    });
}