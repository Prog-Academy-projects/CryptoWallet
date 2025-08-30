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
    renderShadow();
});

// -------- IN DEV ---------------
function renderShadow() {
    const charts = document.querySelectorAll(".chart-container");

    console.log(charts);
    let active = 0;

    setInterval(() => {
    charts.forEach((chart, i) => {
        chart.style.animation = `shadowChart 2s linear infinite`;
        chart.style.animationDelay = `${i * 2}s`; // смещение для каждого
        chart.classList.remove("active-glow")
    });
    charts[active].classList.add("../style/dashboard.css/active-glow");
    active = (active + 1) % charts.length;
    }, 2000);
}



