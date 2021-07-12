<script>
import { Bar, mixins } from "vue-chartjs";
import Chart from "chart.js";
import vars from "@/styles/vars.scss";

const { reactiveProp } = mixins;

Chart.defaults.global.barThickness = 1;
export default {
  name: "DashBarChart",
  mixins: [reactiveProp],
  extends: Bar,
  data() {
    return {
      gradient: null,
    };
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, vars.chartFrom1);
    this.gradient.addColorStop(1, vars.chartTo1);
    this.renderChart(
      {
        labels: this.chartData.labels,
        datasets: [
          {
            backgroundColor: this.gradient,
            hoverBackgroundColor: "rgba(45,151,252,0.2)",
            data: this.chartData.datasets[0].data,
          },
        ],
      },
      {
        scales: {
          maxBarThickness: 1,
          yAxes: [
            {
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: vars.fontPrimaryColor,
                fontFamily: "Montserrat",
                callback: (v) => {
                  if (v % 1 === 0) return v;
                },
              },
              gridLines: {
                display: true,
                drawBorder: false,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                display: true,
                fontColor: vars.fontPrimaryColor,
                fontFamily: "Montserrat",
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            },
          ],
        },
        legend: {
          display: !!this.data_label,
          labels: {
            fontSize: 10,
            usePointStyle: true,
            padding: 5,
            fontFamily: "Montserrat",
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "#009374",
          titleFontFamily: "Montserrat",
          bodyFontFamily: "Montserrat",
          cornerRadius: 4,
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            },
          },
        },
      }
    );
  },
};
</script>

<style scoped></style>
