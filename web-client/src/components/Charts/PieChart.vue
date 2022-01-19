<script>
import { Pie } from "vue-chartjs";
import vars from "@/styles/vars.scss";

export default {
  name: "LineChart",
  extends: Pie,
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
        this.$data._chart.config.data.datasets[0].backgroundColor = this.gradients;
        this.$data._chart.config.data.datasets[0].hoverBackgroundColor =
          "rgba(45,151,252,0.2)";
        this.$data._chart.update();
      },
    },
  },
  mounted() {
    const gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    const gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    const gradient3 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    gradient.addColorStop(0, vars.chartFrom1);
    gradient.addColorStop(1, vars.chartTo1);

    gradient2.addColorStop(0, vars.chartFrom2);
    gradient2.addColorStop(1, vars.chartTo2);

    gradient3.addColorStop(0, vars.chartFrom3);
    gradient3.addColorStop(1, vars.chartTo3);

    this.gradients = [gradient, gradient2, gradient3];

    this.options = {
      legend: {
        display: true,
        position: "left",
        labels: {
          fontSize: 11,
          usePointStyle: true,
          padding: 10,
          fontFamily: "Montserrat",
          fontColor: vars.fontPrimaryColor,
        },
      },
      tooltips: {
        backgroundColor: "#009374",
        titleFontFamily: "Montserrat",
        bodyFontFamily: "Montserrat",
        cornerRadius: 4,
      },
      elements: {
        arc: {
          borderWidth: 10,
          borderColor: "transparent",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
    this.render();
  },
  methods: {
    render() {
      this.chartData.datasets[0].backgroundColor = this.gradients;
      this.chartData.datasets[0].hoverBackgroundColor = "rgba(45,151,252, 0.5)";
      this.renderChart(this.chartData, this.options);
    },
  },
};
</script>

<style scoped></style>
