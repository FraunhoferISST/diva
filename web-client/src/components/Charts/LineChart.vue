<script>
import { Line } from "vue-chartjs";
import vars from "@/styles/vars.scss";

export default {
  name: "LineChart",
  extends: Line,
  props: {
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      gradient: null,
      chartData: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
          },
        ],
      },
      options: {},
    };
  },
  watch: {
    data: {
      handler() {
        this.chartData.datasets[0].data = this.data;
        this.$data._chart.config.data.datasets[0].backgroundColor =
          this.gradient;
        this.chartData.datasets[0].borderColor = this.gradient;
        this.$data._chart.config.data.datasets[0].hoverBackgroundColor =
          "rgba(45,151,252,0.2)";
        this.$data._chart.update();
      },
    },
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, vars.chartFrom1);
    this.gradient.addColorStop(1, vars.chartTo1);

    this.options = {
      scales: {
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
        display: false,
      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        intersect: false,
        backgroundColor: "#009374",
        titleFontFamily: "Montserrat",
        bodyFontFamily: "Montserrat",
        cornerRadius: 4,
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.yLabel + "x";
          },
        },
      },
    };
    this.render();
  },
  methods: {
    render() {
      this.chartData.datasets[0].borderColor = this.gradient;
      this.chartData.datasets[0].backgroundColor = this.gradient;
      this.chartData.datasets[0].hoverBackgroundColor = "rgba(45,151,252,0.2)";
      this.renderChart(this.chartData, this.options);
    },
  },
};
</script>

<style scoped></style>
