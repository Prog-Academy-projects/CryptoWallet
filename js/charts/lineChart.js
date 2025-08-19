let charts = {};

export const renderLineChart = (inputData, inputColor, coin) => {
    const options = {
        animation: true,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: false,
                grid: { display: false },
                // ticks: { display: false }
            },
            y: {
                display: false,
                grid: { display: false },
                // ticks: { display: false }
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
        }
    }

    const data = {
        datasets: [{
            data: inputData,
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

