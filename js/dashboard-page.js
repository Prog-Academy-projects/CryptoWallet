import { getMarketChart } from "./api-coingecko/market-chart.js";
import { renderBalanceChart } from "./wallet.js";


document.addEventListener("DOMContentLoaded", () => {
    renderBalanceChart();
    getMarketChart();
});
