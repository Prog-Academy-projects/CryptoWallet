let chartInstance = null;

export const showDoughnutChart = (labels, balances) => {
    const data = {
        labels,
        datasets: [{
            data: balances,
            backgroundColor: ["#FF9900", "#3C3CFF", "#27AE60"],
            // backgroundColor: ["#DBD42B", "#38B5DC", "#129B28"],
            shadow: "#129B28"
        }]
    }
        
    const options = {
        animation: true,
        responsive: true,
        plugins: {
            legend: { display: false },
        }
    }

    const ctx = document.getElementById("doughnutChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data,
            options
        });
}