

export const createSpan = (usd = 0, differ = null) => {
    const span = document.createElement("span");

    if (usd != 0 && usd != null){
        span.textContent = " $" + usd.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " (" + differ.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + "%)";
    } else {
        span.textContent = differ.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + "%";
    }

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
    return span;
}
