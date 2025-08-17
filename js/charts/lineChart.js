let charts = {};

export const showLineChart = (inputData, inputColor, coin) => {
    const options = {
        animation: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { display: false }
            },
            y: {
                grid: { display: false },
                ticks: { display: false }
            }
        },
        plugins: {
            tooltip: {
                intersect: false
            },
            legend: { display: false }
        },
        elements: {
            line: {
                tension: 0.1,
                borderColor: inputColor,
                borderWidth: 1.5
            }
        },
        responsive: true
    }

    const data = {
        datasets: [{
            data: inputData,
            label: 'Price',
            // fill: true,
        }]
    }

    const ctx = document.getElementById(`lineChart-${coin}`);

    if (charts[coin]) {
        charts[coin].destroy();
    }

    charts[coin] = new Chart(
        ctx, {
            type: 'line',
            data,
            options
        });
}

