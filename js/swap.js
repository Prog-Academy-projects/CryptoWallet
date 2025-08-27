import { getWallet, saveWallet } from "./wallet.js";
import { getRatesCached } from "./api-coingecko/crypto-rates.js";
import { COINS, COINS_BY_SYMBOL } from "./settings.js";

// ------------------- renderCoinsList ---------------------------
export async function renderCoinsList() {
    const fromCoinList = document.getElementById("fromCoinList");
    fromCoinList.innerHTML = "";
    const toCoinList = document.getElementById("toCoinList");
    toCoinList.innerHTML = "";

    const rates = await getRatesCached();
    rates.forEach((obj) => {
        const { symbol } = obj;

        const pattern = `
            <li>
                <button class="dropdown-item" type="button" data-value="${symbol.toUpperCase()}" data-label="${symbol.toUpperCase()}" data-icon="../assets/img/${symbol}.png">
                    <img src="../assets/img/${symbol}.png" alt="${COINS_BY_SYMBOL["eth"].id}">${symbol.toUpperCase()}
                </button>
            </li>
        `;
        fromCoinList.insertAdjacentHTML('beforeend', pattern)
        toCoinList.insertAdjacentHTML('beforeend', pattern)
    });
}

// ------------------- updateSwapRate ---------------------------
export async function updateSwapRate() {
    const fromCoin = document.querySelector("#fromCoinDropdown").dataset.value || "ETH";
    const toCoin = document.querySelector("#toCoinDropdown")?.dataset.value || "USDT";

    const rateBlock = document.querySelector(".swap-rate");
    if (!rateBlock) return;

    const fromSymbolRate = rateBlock.querySelector(".swap-rate-from p:last-child");
    const toSymbolRate = rateBlock.querySelector(".swap-rate-to p:last-child");
    const toValueRate = rateBlock.querySelector(".swap-rate-to p:first-child");

    const rates = await getRatesCached();
    console.log(COINS[fromCoin].symbol)

    const fromData = rates.find(r => r.symbol.toLowerCase() === COINS[fromCoin].symbol);
    const toData = rates.find(r => r.symbol.toLowerCase() === COINS[toCoin].symbol);
    if (!fromData || !toData) return;

    const rate = fromData.usd / toData.usd;

    fromSymbolRate.textContent = fromCoin;
    toSymbolRate.textContent = toCoin;
    toValueRate.textContent = rate.toFixed(8);

    console.log("updateSwapRate: from " + fromCoin + " to " + toCoin + " is " + rate)
}

// ------------------- updateConvertedAmount ---------------------------
export async function updateConvertedAmount(input) {
    const fromCoin = document.querySelector("#fromCoinDropdown").dataset.value;
    const toCoin = document.querySelector("#toCoinDropdown")?.dataset.value;
    const toCoinAmount = document.querySelector("#toCoin");

    const rates = await getRatesCached();
    const fromData = rates.find(r => r.symbol.toLowerCase() === COINS[fromCoin].symbol);
    const toData = rates.find(r => r.symbol.toLowerCase() === COINS[toCoin].symbol);
    if (!fromData || !toData) return;

    const rate = fromData.usd / toData.usd;

    toCoinAmount.value = (rate*input).toFixed(4);

    console.log("updateConvertedAmount: from " + fromCoin + " to " + toCoin + " is " + rate)
}

// ------------------- swapCoins ---------------------------
export async function swapCoins(fromCoin, toCoin, amount) {
    if (fromCoin === toCoin) {
        alert("Can't change the same coins");
        return;
    }

    if (amount <= 0) {
        alert("Enter amount more 0.");
        return;
    }

    const wallet = getWallet();

    if (!wallet[fromCoin] || wallet[fromCoin] < amount) {
        alert(`Not enough amount on balance of ${fromCoin}`);
        return;
    }

    const rates = await getRatesCached();

    const fromRate = rates.find(r => r.symbol.toLowerCase() === COINS[fromCoin].symbol).usd;
    const toRate   = rates.find(r => r.symbol.toLowerCase() === COINS[toCoin].symbol).usd;

    const usdValue = amount * fromRate;
    const toAmount = usdValue / toRate;

    wallet[fromCoin] = +(wallet[fromCoin] - amount).toFixed(8);
    wallet[toCoin]   = +((wallet[toCoin] || 0) + toAmount).toFixed(8);

    saveWallet(wallet);

    return {
        from: { coin: fromCoin, amount },
        to: { coin: toCoin, amount: toAmount }
    };
}
