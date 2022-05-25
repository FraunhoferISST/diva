<script>
import { Bar } from "vue-chartjs";
import Chart from "chart.js";
import vars from "@/styles/vars.scss";
Chart.defaults.global.barThickness = 1;
export default {
  name: "BarChart",
  extends: Bar,
  props: {
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    sickness: {
      type: Number,
      default: 0.8,
    },
  },
  data: () => ({
    options: {},
  }),
  watch: {
    data: {
      handler() {
        this.render();
      },
    },
  },
  mounted() {
    this.options = {
      scales: {
        maxBarThickness: 1,
        yAxes: [
          {
            ticks: {
              display: true,
              beginAtZero: true,
              fontColor: vars.fontPrimaryColor,
              fontFamily: "Montserrat",
            },
            gridLines: {
              display: true,
              drawBorder: false,
            },
          },
        ],
        xAxes: [
          {
            categorySpacing: 100,
            ticks: {
              display: true,
              fontColor: vars.fontPrimaryColor,
              fontFamily: "Montserrat",
              precision: 0,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barPercentage: this.sickness,
          },
        ],
      },
      legend: {
        display: false,
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
            return tooltipItem.xLabel;
          },
        },
      },
    };
    this.render();
  },
  methods: {
    render() {
      this.renderChart(
        {
          labels: this.labels,
          datasets: [
            {
              data: this.data,
              backgroundColor: "#137efc",
            },
          ],
        },
        this.options
      );
    },
  },
};
</script>

<style scoped></style>
