<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    //     labels:{
    //         type:Array,
    //         default:()=>["January","February","March","April","May","June","July"]
    //     },
    //     data1:{
    //         type:Array,
    //         default:()=>[40, 39, 10, 40, 39, 80, 40]
    //     },
    //     data2:{
    //         type:Array,
    //         default:()=>[60, 55, 32, 10, 2, 12, 53]
    //       }
  },
  data() {
    return {
      gradient: null,
      gradient2: null,
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      data1: [40, 39, 10, 40, 39, 80, 40],
      data2: [60, 55, 32, 10, 2, 12, 53],
      data3: [10, 20, 50, 30, 45, 20, 19],
    };
  },
  methods: {
    /*eslint-disable*/
    fnc(name, bconf, dth, rec) {
      this.drawChart(name, bconf, dth, rec);
    },
    drawChart(name, bconf, dth, rec) {
      this.gradient = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
      this.gradient2 = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
      this.gradient3 = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);

      this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
      this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
      this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

      this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
      this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
      this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

      this.gradient3.addColorStop(0, "rgba(15, 18, 17, 0.9)");
      this.gradient3.addColorStop(0.5, "rgba(15, 18, 17, 0.25)");
      this.gradient3.addColorStop(1, "rgba(15, 18, 17, 0)");

      this.renderChart(
        {
          labels: name,
          datasets: [
            {
              label: "Confirmed",
              borderColor: "#FC2525",
              pointBackgroundColor: "white",
              borderWidth: 1,
              pointBorderColor: "white",
              backgroundColor: this.gradient,
              data: bconf,
            },
            {
              label: "Recovered",
              borderColor: "#05CBE1",
              pointBackgroundColor: "white",
              pointBorderColor: "white",
              borderWidth: 1,
              backgroundColor: this.gradient2,
              data: rec,
            },
            {
              label: "Deaths",
              // borderColor: "#05CBE1",
              borderColor: "#000",
              pointBackgroundColor: "white",
              pointBorderColor: "white",
              borderWidth: 1,
              backgroundColor: this.gradient3,
              data: dth,
            },
          ],
        },

        {
          responsive: true,
          maintainAspectRatio: false,
          // scales: {
          //   xAxes: [
          //     {
          //       ticks: {
          //         display: false, //this will remove only the label
          //       },
          //     },
          //   ],
          // },
        }
      );
    },
  },
  mounted() {
    this.drawChart(this.labels, this.data1, this.data2, this.data3);
  },
};
</script>
