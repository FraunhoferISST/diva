<script>
import randomColor from "@/utils/colors";
import { Doughnut } from "vue-chartjs";
import vars from "@/styles/vars.scss";

export default {
  extends: Doughnut,
  name: "DonutChart",
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
        intersect: false,
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
      this.renderChart(
        {
          labels: this.labels,
          datasets: [
            {
              data: this.data,
              backgroundColor: randomColor(this.data.length),
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
