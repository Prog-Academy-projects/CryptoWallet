import Chart from "react-apexcharts";

const options = {
  chart: { type: 'bar' },
  plotOptions: {
    bar: {
      columnWidth: '50%',
      dataLabels: { position: 'top' }
    }
  },
  title: { text: 'Wallet Waterfall' },
};

const series = [{
  data: [
    { x: 'BTC', y: 5000 },
    { x: 'ETH', y: 2000 },
    { x: 'USDT', y: 1000 },
    { x: 'Total', y: 8000, isSum: true }
  ]
}];

<Chart options={options} series={series} type="bar" height={350} />
