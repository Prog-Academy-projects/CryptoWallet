import { COINS } from "../settings.js";

let chartInstance = null;

export const renderDoughnutChart = (labels, balances) => {
    const backgroundColors = labels.map(coin => COINS[coin].color);

    const data = {
        labels,
        datasets: [{
            data: balances,
            // backgroundColor: ["#FF9900", "#3C3CFF", "#27AE60"],
            // backgroundColor: ["#DBD42B", "#38B5DC", "#129B28"],
            // backgroundColor: ["#FFA800", "#38B5DC", "#129B28"],
            backgroundColor: backgroundColors,

            borderWidth: 1,
            borderColor: "#000000"
        }]
    }
    const shadowPlugin = {
    id: 'shadowPlugin',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        chart.data.datasets.forEach((dataset, i) => {
        chart.getDatasetMeta(i).data.forEach((arc, index) => {
            ctx.shadowColor = dataset.backgroundColor[index];
            ctx.shadowBlur = 35;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            arc.draw(ctx);
        });
        });
        ctx.restore();
    }
    };
    const options = {
        animation: true,
        responsive: true,
        plugins: {
            legend: { 
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                    let dataset = context.dataset.data;
                    let total = dataset.reduce((a, b) => a + b, 0);
                    let value = dataset[context.dataIndex];
                    let percentage = ((value / total) * 100).toFixed(1) + '%';
                    return percentage;
                    }
                }
            }
        },
        layout: {
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            }
        }
    }

    const ctx = document.getElementById("doughnutChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
        plugins: [shadowPlugin]
    });
}