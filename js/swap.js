import { getWallet, saveWallet } from "./wallet.js";
import { getCryptoRates } from "./api-coingecko/crypto-rates.js";
import { COINS,COINS_BY_SYMBOL } from "./settings.js";

export async function renderCoinsList() {
    const fromCoinList = document.getElementById("fromCoinList");
    fromCoinList.innerHTML = "";
    const toCoinList = document.getElementById("toCoinList");
    toCoinList.innerHTML = "";

    const rates = await getCryptoRates();
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

export async function updateSwapRate() {
    const fromCoin = document.querySelector("#fromCoinDropdown").dataset.value || "ETH";
    const toCoin = document.querySelector("#toCoinDropdown")?.dataset.value || "USDT";
    if (fromCoin == toCoin) {
        const pattern = `
            <div id="validationfromCoinDropdown" class="invalid-feedback">
                Please choose different currency.
            </div>
        `;
        document.querySelector("#fromCoinDropdown").insertAdjacentHTML('afterend', pattern)
        return;
    }

    const rateBlock = document.querySelector(".swap-rate");
    if (!rateBlock) return;

    const fromSymbolRate = rateBlock.querySelector(".swap-rate-from p:last-child");
    const toSymbolRate = rateBlock.querySelector(".swap-rate-to p:last-child");
    const toValueRate = rateBlock.querySelector(".swap-rate-to p:first-child");

    const rates = await getCryptoRates();
    console.log(COINS[fromCoin].symbol)

    const fromData = rates.find(c => c.symbol.toLowerCase() === COINS[fromCoin].symbol);
    const toData = rates.find(c => c.symbol.toLowerCase() === COINS[toCoin].symbol);
    if (!fromData || !toData) return;

    const rate = fromData.usd / toData.usd;
    // let rate = rates[fromCoin]?.[toCoin];
    // if (!rate) rate = "—";

    fromSymbolRate.textContent = fromCoin;
    toSymbolRate.textContent = toCoin;
    toValueRate.textContent = rate.toFixed(2);

    console.log("updateSwapRate: from " + fromCoin + " to " + toCoin + " is " + rate)
}

// ---- test data ----
// const rates = {
//   ETH: { USDT: 4000.00, BTC: 0.065 },
//   BTC: { USDT: 60000.00, ETH: 15.5 },
//   USDT: { BTC: 1 / 60000.00, ETH: 1 / 4000.00 }
// };

export async function updateConvertedAmount(input) {
    const fromCoin = document.querySelector("#fromCoinDropdown").dataset.value;
    const toCoin = document.querySelector("#toCoinDropdown")?.dataset.value;
    const toCoinAmount = document.querySelector("#toCoin");

    const rates = await getCryptoRates();
    const fromData = rates.find(c => r.symbol.toLowerCase() === COINS[fromCoin].symbol);
    const toData = rates.find(c => r.symbol.toLowerCase() === COINS[toCoin].symbol);
    if (!fromData || !toData) return;

    const rate = fromData.usd / toData.usd;
    // let rate = rates[fromCoin]?.[toCoin];
    // if (!rate) rate = "—";

    toCoinAmount.value = (rate*input).toFixed(4);

    console.log("updateConvertedAmount: from " + fromCoin + " to " + toCoin + " is " + rate)
}


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

    const rates = await getCryptoRates();

    // 5. Берём курсы в USD (например rates = [{symbol:"BTC", usd:65000}, ...])
    const fromRate = rates.find(r => r.symbol.toLowerCase() === COINS[fromCoin]).usd;
    const toRate   = rates.find(r => r.symbol.toLowerCase() === COINS[toCoin]).usd;

    // 6. Считаем сколько получаем
    const usdValue = amount * fromRate;          // сколько $ отдаём
    const toAmount = usdValue / toRate;          // сколько монет получаем

    // 7. Обновляем кошелёк
    // wallet[fromCoin] -= amount;
    // wallet[toCoin] = (wallet[toCoin] || 0) + toAmount;
    wallet[fromCoin] = +(wallet[fromCoin] - amount).toFixed(8);
    wallet[toCoin]   = +((wallet[toCoin] || 0) + toAmount).toFixed(8);

    // 8. Сохраняем
    saveWallet(wallet);

    // 9. Возвращаем для отображения
    return {
        from: { coin: fromCoin, amount },
        to: { coin: toCoin, amount: toAmount }
    };
}
