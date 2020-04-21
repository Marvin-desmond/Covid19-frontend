<template>
  <div class="cases">
    <div v-if="cases.length > 0">
      <div class="topGrid">
        <h1 class="floatgrid">Cases</h1>
        <div>
          <!-- <router-link v-bind:to="{ name: 'NewCases' }" class="routerLink">
            <p>Update COVID-19 cases</p>
          </router-link>-->
          <div class="routerLink floatgrid">
            <button @click="toggleUpdate">{{ totalData.length }}</button>
          </div>
        </div>

        <div class="style-chooser0 floatgrid">
          <select v-model="selected" @change="changed" class="select-css">
            <option
              v-for="option in cases"
              :value="{ id: option.id, text: option.name }"
              :key="option.id"
              class="form-control"
              >{{ option.name }}</option
            >
          </select>

          <!-- <input
            type="text"
            list="returned"
            v-model="selected"
            placeholder="choose country"
            class="style-chooser1"
          />
          <datalist id="returned" class="style-chooser2">
            <option v-for="option in cases" :key="option.id">{{ option.name }}</option>
          </datalist>-->
        </div>
      </div>
      <br />
      <div v-if="updateC">
        <NewCases />
      </div>
      <div class="cases-container" v-else>
        <div v-if="selected.text == undefined" class="covid">
          <h1>
            <span>{{ tempCountry.name }}</span>
          </h1>
          <p>
            Population :
            <span>{{ tempCountry.population }}</span>
          </p>
          <p>
            Date of case :
            <span>{{ tempCountry.updated_at.split("T")[0] }}</span>
          </p>
          <p>
            Deaths today:
            <span>{{ tempCountry.today.deaths }}</span>
          </p>
          <p>
            Confirmed today :
            <span>{{ tempCountry.today.confirmed }}</span>
          </p>
          <p>
            Total deaths :
            <span>{{ tempCountry.latest_data.deaths }}</span>
          </p>
          <p>
            Total confirmed :
            <span>{{ tempCountry.latest_data.confirmed }}</span>
          </p>
          <p>
            Total recovered :
            <span>{{ tempCountry.latest_data.recovered }}</span>
          </p>
          <p>
            Critical cases :
            <span>{{ tempCountry.latest_data.critical }}</span>
          </p>
        </div>

        <div
          v-else
          class="covid"
          v-for="caseV in cases"
          :key="caseV._id"
          v-show="selected.text == caseV.name"
        >
          <h1>
            {{
              caseV.name
                .split(" ")
                .slice(0, 3)
                .join(" ")
            }}
          </h1>
          <p>
            Population :
            <span>{{ caseV.population }}</span>
          </p>
          <p>
            Date of case :
            <span>{{ caseV.updated_at.split("T")[0] }}</span>
          </p>
          <p>
            Deaths today:
            <span>{{ caseV.today.deaths }}</span>
          </p>
          <p>
            Confirmed today :
            <span>{{ caseV.today.confirmed }}</span>
          </p>
          <p>
            Total deaths :
            <span>{{ caseV.latest_data.deaths }}</span>
          </p>
          <p>
            Total confirmed :
            <span>{{ caseV.latest_data.confirmed }}</span>
          </p>
          <p>
            Total recovered :
            <span>{{ caseV.latest_data.recovered }}</span>
          </p>
          <p>
            Critical cases :
            <span>{{ caseV.latest_data.critical }}</span>
          </p>
          <p>
            Calculated :
            <span>{{
              caseV.latest_data.calculated.cases_per_million_population
            }}</span>
            / million
          </p>
        </div>
        <div class="chart local" v-show="showCharts">
          <area-chart ref="chartA" :styles="myStyles" />
        </div>
        <div class="chart regional" v-show="showCharts">
          <area-chart ref="chartB" :styles="myStyles" />
        </div>
        <div class="topCountries" v-show="!showCharts">
          <div id="listTitle">
            <span class="show-box"></span>
            <span>Country</span>
            <span class="show-box">Population</span>
            <span>Confirmed</span>
            <span class="show-box">Deaths</span>
            <span>recovered</span>
          </div>
          <hr />
          <div v-for="count in countryMost" :key="count.name">
            <div class="listperCountry">
              <div class="box show-box">
                <img :src="count.code" style="margin-top:-10px" />
              </div>
              <div class="box">{{ count.name }}</div>
              <div class="box show-box">{{ count.population }}</div>
              <div class="box">{{ count.latest_data.confirmed }}</div>
              <div class="box">{{ count.latest_data.deaths }}</div>
              <div class="box show-box">{{ count.latest_data.recovered }}</div>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "../main";
import PostsService from "@/services/PostsService";
import CountriesData from "@/services/countries.json";
import NewCases from "@/components/NewCases";
import AreaChart from "./AreaChart.vue";

export default {
  name: "Cases",
  components: {
    NewCases,
    AreaChart,
  },
  data() {
    return {
      cases: [],
      showC: true,
      selected: "",
      updateC: false,
      totalData: "",
      testFly: "",
      totalConfirmed: [],
      nearbyCountries_casesConfirmed: [],
      tempCountry: [],
      showCharts: false,
      lab1: [],
      dat1: [],
      dat01: [],
      dat11: [],
      lab2: [],
      dat2: [],
      dat02: [],
      dat12: [],
      height: 500,
      width: 430,
      countryMost: [],
    };
  },
  props: {
    msg: String,
  },
  created() {
    bus.$on("Untoggled", (data) => {
      this.updateC = data;
      this.$router.go();
    });
  },
  mounted() {
    /*eslint-disable*/
    this.getPosts();
    this.getCountries();
  },
  methods: {
    /*eslint-disable*/
    async getPosts() {
      const response = await PostsService.fetchPosts();
      this.totalData = response.data.cases;
      let tempNum = 0;
      this.cases = response.data.cases.slice(0, 249);
      this.cases.forEach((country) => {
        if (country.latest_data.confirmed > tempNum) {
          tempNum = country.latest_data.confirmed;
          this.tempCountry = country;
        }
      });
      this.countryMost = this.cases
        .sort((a, b) =>
          a.latest_data.confirmed > b.latest_data.confirmed ? -1 : 1
        )
        .slice(0, 5);
      const tempCount = this.countryMost.map((e) => e.name);
      this.countryFlags = this.testFly
        .filter((e) => tempCount.includes(e.name))
        .map((e) => [e.name, e.country_code]);

      for (let i = 0; i < this.countryMost.length; i++) {
        for (let j = 0; j < this.countryFlags.length; j++) {
          if (this.countryMost[i].name == this.countryFlags[j][0]) {
            this.countryMost[i]["code"] =
              "https://www.countryflags.io/" +
              this.countryFlags[j][1] +
              "/shiny/32.png";
          }
        }
      }
      console.log(this.countryMost);
    },
    showCases() {
      this.showC = !this.showC;
      console.log(this.showC);
    },
    toggleUpdate() {
      this.updateC = true;
      bus.$emit("Update toggled", this.updateC);
    },
    async getCountries() {
      const testFly = await CountriesData;
      this.testFly = testFly;
    },
    fnc() {},
    changed() {
      this.showCharts = true;
      this.totalConfirmed = this.totalData
        .filter((e) => e.name === this.selected.text)
        .map((e) => [
          e.updated_at,
          e.latest_data.confirmed,
          e.latest_data.deaths,
          e.latest_data.recovered,
        ]);
      let count = 0;
      this.lab1 = [];
      this.dat1 = [];
      this.dat01 = [];
      this.dat11 = [];
      this.totalConfirmed.forEach((dt) => {
        this.lab1.push(new Date(dt[0]).toDateString());
        this.dat1.push(dt[1]);
        this.dat01.push(dt[2]);
        this.dat11.push(dt[3]);
        count++;
      });
      let countryclicked = this.testFly
        .filter((e) => e.name == this.selected.text)
        .map((e) => e.latlng);
      countryclicked = JSON.parse("[" + countryclicked + "]");
      let x1 = countryclicked[0];
      let y1 = countryclicked[1];

      const nearbyCountries = this.testFly
        .filter((e) => {
          return (
            Math.sqrt(
              Math.pow(e.latlng[0] - x1, 2) + Math.pow(e.latlng[1] - y1, 2)
            ) < 10 &&
            Math.sqrt(
              Math.pow(e.latlng[0] - x1, 2) + Math.pow(e.latlng[1] - y1, 2)
            ) != 0
          );
        })
        .map((e) => e.name);
      const nearbyCountries_cases = this.cases.filter((e) =>
        nearbyCountries.includes(e.name)
      );
      this.nearbyCountries_casesConfirmed = nearbyCountries_cases.map((a) => [
        a.name,
        a.latest_data.confirmed,
        a.latest_data.deaths,
        a.latest_data.recovered,
      ]);
      this.lab2 = [];
      this.dat2 = [];
      this.dat02 = [];
      this.dat12 = [];
      this.nearbyCountries_casesConfirmed.forEach((e) => {
        this.lab2.push(e[0]);
        this.dat2.push(e[1]);
        this.dat02.push(e[2]);
        this.dat12.push(e[3]);
      });
      this.$refs.chartA.fnc(
        this.lab1.reverse(),
        this.dat1.reverse(),
        this.dat01.reverse(),
        this.dat11.reverse()
      );
      this.$refs.chartB.fnc(this.lab2, this.dat2, this.dat02, this.dat12);
    },
  },
  computed: {
    myStyles() {
      return {
        height: `${this.height}px`,
        width: `${this.width}px`,
        position: "relative",
      };
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}

.cases h1 {
  /* font-family: 'Comic Neue', cursive; */
  /* font-family: 'Spicy Rice', cursive; */
  font-family: "Hind Siliguri", sans-serif;
  font-weight: lighter;
  color: #fff;
}
.form-control {
  font-family: "Hind Siliguri", sans-serif;
  font-weight: bold;
}

.routerLink {
  font-family: "Hind Siliguri", sans-serif;
  color: #fff;
}
/* .routerLink button {
  margin-top: 15px;
  height: 30px;
  width: 200px;
  font-weight: 500;
  background: none;
  border: none;
  outline: none;
  color: #fff;
}
.routerLink button:hover {
  cursor: pointer;
} */
@media (min-width: 700px) {
  .cases-container {
    /* margin-top:-10px; */
    height: 68vh;
    width: auto;
    display: grid;
    grid-template-columns: 1fr 2fr 2fr;
    column-gap: 7px;
    top: 0;
    left: 0;
    text-align: left;
  }
  .covid{
      height: 60vh;
  min-height: 300px;
  width: 20vw;
  min-width: 220px;
  }
  .topCountries {
  height: 60vh;
  min-height: 300px;
  width: 60vw;
  min-width: 700px;
  background-color: #fff;
  margin: 7vh 5vw 10vh 8vw;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  padding: 5vh 2vw 7vh 3vw;
  justify-content: center;
  border: 1px solid rgb(64, 64, 64);
}
.listperCountry {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
  text-align: left;
}
#listTitle {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
  text-align: left;
  text-transform: uppercase;
  padding-bottom: 1vh;
  font-family: "Hind Siliguri", sans-serif;
  font-size: 18px;
}
}
.topGrid {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  border: none;
  background-color: rgb(34, 34, 34);
}
@media (max-width: 700px) {
.covid {
  height: 370px;
  width: 80vw;
  
  /* min-width: 220px;  */

}
.show-box{
  display: none;
}
.topCountries {
  height: 60vh;
  width: 80vw;
  background-color: #fff;
  margin: 7vh 5vw 10vh 8vw;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  padding: 5vh 1vw 7vh 1vw;
  justify-content: center;
  border: 1px solid rgb(64, 64, 64);
}
.listperCountry {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
}
#listTitle {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  text-transform: uppercase;
  padding-bottom: 1vh;
  font-family: "Hind Siliguri", sans-serif;
  font-size: 18px;
}
}
.covid{
    background-color: #fff;
  border-radius: 5px;
  padding: 1vh 0vw 0vh 1.2vw;
  
  border: 1px solid rgb(64, 64, 64);
  margin: 6vh 0vw 0vh 5vw;
}
.covid h1,
.cases-container h1 {
  margin: 7vh 0vw 5vh 0vw;
  color: rgb(1, 6, 6);
  text-transform: uppercase;
  font-weight: bold;
  font-size: 5vh;
  font-family: "Hind Siliguri", sans-serif;
}
.covid p {
  margin-bottom: 0.1vh;
}
.covid p span {
  color: rgb(154, 148, 147);
}

.cases-container p {
  /* font-family: 'Comic Neue', cursive; */
  /* font-family: 'Spicy Rice', cursive; */
  font-family: "Hind Siliguri", sans-serif;
  /* font-family: 'Fredoka One', cursive; */
  font-weight: bold;
}
#listTitle span {
  font-size: 2.3vh;
  font-weight: bold;
}
.box {
  height: 5vh;
  font-size: 3vh;
  font-weight: 300;
  line-height: 3vh;
  padding-top: 3vh;
  text-decoration: none solid rgba(0, 0, 0, 0.87);
  /* font-family: 'Comic Neue', cursive; */
  /* font-family: 'Spicy Rice', cursive; */
  font-family: "Hind Siliguri", sans-serif;
  /* font-family: 'Fredoka One', cursive; */
}
hr {
  width: 97%;
  margin-left: 1.5%;
  border: none;
  border-bottom: 0.3vh solid #eeeeee;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #000;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

.style-chooser0 {
  width: 60%;
  margin-right: 0;
}
.style-chooser1 {
  border: none;
  outline: none;
  width: 100%;
  height: 28px;
  border-radius: 3px;
}
.floatgrid {
  width: 100%;
  height: 50px;
}
.style-chooser1 {
  margin: 7px;
  height: 33px;
  width: 60%;
  float: right;
}
.select-css {
  display: block;
  font-size: 14px;
  font-family: sans-serif;
  font-weight: 300;
  color: #444;
  line-height: 0.8;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 60%;
  box-sizing: border-box;
  margin: 10px;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.5em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  /* arrow icon position (1em from the right, 50% vertical) , then gradient position*/
  background-position: right 0.7em top 50%, 0 0;
  /* icon size, then gradient */
  background-size: 0.65em auto, 100%;
  float: right;
  border: none;
  outline: none;
}
.select-css::-ms-expand {
  display: none;
}
/* Hover style */
.select-css:hover {
  border-color: #888;
}
/* Focus style */
.select-css:focus {
  border-color: #aaa;
  box-shadow: 0 0 0 3px -moz-mac-focusring;
  color: #222;
  outline: none;
}
/* Set options to normal weight */
.select-css option {
  font-weight: normal;
}
/* Support for rtl text, explicit support for Arabic and Hebrew */
*[dir="rtl"] .select-css,
:root:lang(ar) .select-css,
:root:lang(iw) .select-css {
  background-position: left 0.7em top 50%, 0 0;
  padding: 0.6em 0.8em 0.5em 1.4em;
}
/* Disabled styles */
.select-css:disabled,
.select-css[aria-disabled="true"] {
  color: graytext;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22graytext%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
}
.select-css:disabled:hover,
.select-css[aria-disabled="true"] {
  border-color: #aaa;
}
</style>
