import {COINS} from "./settings.js"

export const showSwapModal = (coinId) => {
    const modal = document.getElementById("swapModal").firstElementChild;
    const oldSwapContainer = modal.querySelector(".swap-container");
    console.log(oldSwapContainer);
    if(oldSwapContainer) oldSwapContainer.remove();

    const symbol = COINS[coinId].symbol;
    console.log(modal.firstElementChild)

    document.querySelector(".modal-loader").classList.add("active")
    const pattern = `
        <nav class="swap-container">
            <h4 class="poppins-regular">Swap</h4>
            <div>
                <ul class="swap-currencies">
                    <li class="swap-item swap-rate">
                        <div class="swap-rate-from">
                            <p>
                            1
                            </p>
                            <p>
                            ${coinId}
                            </p>
                        </div>
                        <div>
                            <img src="../assets/icons/arrow-right.svg" alt="arrow-right">
                        </div>
                        <div class="swap-rate-to">
                            <p>
                            </p>
                            <p>
                            USDT
                            </p>
                        </div>
                    </li>
                    <li class="swap-item swap-from">
                        <label for="fromCoin">From:</label>
                        <div class="from-input-group">
                            <input id="fromCoin" class="form-control" type="number" placeholder="Max 0.00">
                            <div class="invalid-feedback">Not enough balance</div>
                        </div>
                        <div class="dropdown">
                            <button id="fromCoinDropdown" class="coinDropdown btn btn-secondary dropdown-toggle" type="button" 
                            aria-describedby="validationfromCoinDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-value="${coinId}">
                                <img src="../assets/img/${symbol}.png" alt="${COINS[coinId].name.toLowerCase()}" width="20"> ${coinId}
                            </button>
                            <input type="hidden" name="coin" id="fromCoinInput" value="${coinId}">
                            <ul class="dropdown-menu" id="fromCoinList">
                            </ul>
                        </div>
                    </li>
                    <li class="swap-item swap-arrows">
                        <button id="switchCurrenciesBtn" type="button" class="btn" aria-label="Switch currencies">
                            <img  src="../assets/icons/arrows-up-down.svg" alt="arrows-up-down">
                        </button>
                    </li>
                    <li class="swap-item swap-to">
                        <label for="toCoin">To:</label>
                        <input id="toCoin" placeholder="0.00" disabled readonly>
                        <div class="dropdown">
                            <button id="toCoinDropdown" class="coinDropdown btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-value="USDT">
                                <img src="../assets/img/usdt.png" alt="tether" width="20"> USDT
                            </button>
                            <input type="hidden" name="coin" id="toCoinInput" value="USDT">
                            <ul class="dropdown-menu" id="toCoinList">
                            </ul>
                        </div>
                    </li>
                    <li class="swap-item swap-button">
                        <button id="swapBtn" type="button" class="btn">SWAP</button>
                    </li>
                </ul>
            </div>
        </nav>
    `
    modal.insertAdjacentHTML('beforeend', pattern)
    const script = document.createElement("script");
    script.type = "module";
    script.src = "../js/swap-page.js";
    document.body.appendChild(script);
    document.querySelector(".modal-loader").classList.remove("active")
}