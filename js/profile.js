document.addEventListener("DOMContentLoaded", () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const emailInput = document.getElementById("email");
    if (emailInput && storedUser.email) {
        emailInput.value = storedUser.email;
    }

    const nameInput = document.getElementById("full-name");
    if (nameInput && storedUser.name) {
        nameInput.value = storedUser.name;
    }
});

const profileForm = document.querySelector(".profile-data-user form");

if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem("user")) || {};

        const fullName = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("pass").value.trim();
        const confirmPass = document.getElementById("confpass").value.trim();

        if (password && password !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        storedUser.name = fullName || storedUser.name;
        storedUser.email = email || storedUser.email;
        if (password) {
            storedUser.password = password;
        }

        localStorage.setItem("user", JSON.stringify(storedUser));
        alert("Profile updated!");
    });
}




import { getCryptoRates } from "./api-coingecko/crypto-rates.js";

// ------------ RENDER RATES (by button) ------------
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
                <td>${name}</td>
                <td>⭐ ${usd != null ? "$ " + Number(usd).toLocaleString() : '-'}</td>
                <td>${usd_market_cap != null ? Number(usd_market_cap).toLocaleString() : '-'}</td>
                <td>${usd_24h_vol != null ? Number(usd_24h_vol).toLocaleString() : '-'}</td>
                <td>${usd_24h_change != null 
                        ? usd_24h_change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %' 
                        : '-'}</td>
                <td>${updatedAt}</td>
            </tr>
        `;
        document.querySelector(".cryptoRatesBody").insertAdjacentHTML('beforeend', pattern)
    });
}

document.querySelector("#getCryptoRates").addEventListener("click", renderRates)
