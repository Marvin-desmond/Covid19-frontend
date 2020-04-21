<template>
  <div class="map">
    <div id="map"></div>
    <div id="selectData">
      <h4>{{ selected.text }}</h4>
      <h4>{{ timezones }}</h4>
    </div>
    <button @click="reset" class="reset">Reset</button>
    <div id="casesList">
      <select v-model="selected" class="select" @change="mychange">
        <option
          v-for="option in cases"
          :value="{
            id: option.id,
            text: option.name,
            victims: option.latest_data.deaths,
          }"
          :key="option.id"
          class="form-control"
          >{{ option.name }}</option
        >
      </select>
    </div>
  </div>
</template>
<script>
import PostsService from "@/services/PostsService";
import JSON from "@/services/DataJSON.json";
import CountriesData from "@/services/countries.json";
export default {
  name: "Map",
  data() {
    return {
      cases: "",
      covidcase: "",
      selected: "",
      json: "",
      testFly: "",
      coordinates: "",
      timezones: "",
    };
  },
  methods: {
    async getPosts() {
      const response = await PostsService.fetchPosts();
      this.cases = response.data.cases;
      this.cases = this.cases.slice(0, 249);
      this.cases.forEach(function (item) {
        let temp = item.updated_at;
        var { 0: year, 1: month, 2: day } = temp.split("-");
        day = day.split("T")[0];
        let combined = day + "-" + month + "-" + year;
        item.updated_at = combined;
      });
    },
    /*eslint-disable*/
    async getJSON() {
      const json = await JSON;
      const testFly = await CountriesData;
      this.json = json;
      this.testFly = testFly;
      // console.log(testFly[0].name);
    },
    initMap() {
      /*eslint-disable*/
      // this.map = L.map("map").setView([37.857507, -85.632935], 7);
      this.map = L.map("map").setView([32.882932, 13.1533164], 2);
      this.tileLayer = L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFydmluLWRlc21vbmQiLCJhIjoiY2s4aHR4NWsyMDNvcjNlbHN4YjZoemRsciJ9.JNIgHIDpwAED3AfAoGQvXQ",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: "mapbox/streets-v11",
          // tileSize: 512,
          // zoomOffset: -1,
          //Preload Leaflet nearby tiles
          edgeBufferTiles: 10,
          accessToken:
            "pk.eyJ1IjoibWFydmluLWRlc21vbmQiLCJhIjoiY2s4aHR4NWsyMDNvcjNlbHN4YjZoemRsciJ9.JNIgHIDpwAED3AfAoGQvXQ",
        }
      );
      this.tileLayer.addTo(this.map);
      // var circle = L.circle([51.508, -0.11], {
      //   color: "red",
      //   fillColor: "#f03",
      //   fillOpacity: 0.5,
      //   radius: 5000000
      // });
      // circle.addTo(this.map);
      this.map.on("click", this.onMapClick);
    },
    mychange() {
      let temp = this.selected.text;
      const yy = this.testFly.filter((e) => {
        return e.name == temp;
      });
      const zz = this.cases.filter((e) => {
        return e.name == yy[0].name;
      });
      this.timezones = yy[0].timezones[0];
      this.f = yy[0].latlng[0];
      this.s = yy[0].latlng[1];
      this.coordinates = [this.f, this.s];
      this.map.flyTo(this.coordinates, 6);
      this.marker = L.marker(this.coordinates);
      this.marker.addTo(this.map);
      let mem = zz[0].latest_data.confirmed;
      let mem2 = zz[0].latest_data.deaths;
      mem = mem.toString();
      mem2 = mem2.toString();
      this.marker
        .bindPopup(`${yy[0].name} Confirmed : ${mem}`)
        .openPopup();
      this.marker.bindTooltip(`${yy[0].name} Deaths : ${mem2}`).openTooltip();
      // let popup = L.popup()
      //   .setLatLng(this.coordinates)
      //   .setContent(mem)
      //   .openOn(this.map);
    },
    reset() {
      this.map.flyTo([32.882932, 13.1533164], 2);
    },
    async updateCircles() {
      await this.getPosts();
      await this.getJSON();
      let deaths = 0;
      let recovered = 0;
      for (let k in this.cases) {
        deaths = deaths + this.cases[k].latest_data.deaths;
        recovered = recovered + this.cases[k].latest_data.recovered;
      }
      let confirmed = this.cases.reduce(function (acc, obj) {
        return acc + obj.latest_data.confirmed;
      }, 0);
      for (let i in this.cases) {
        let mmm = 0;
        for (let j in this.testFly) {
          if (this.cases[i].name == this.testFly[j].name) {
            mmm = 1;
            this.once_coord = this.testFly[j].latlng;
            // this.once_radius = Math.round((this.cases[i].latest_data.confirmed/confirmed + Number.EPSILON) * 100) / 100
            this.once_radius = Math.fround(
              this.cases[i].latest_data.confirmed / confirmed
            );
            this.once_radius = this.once_radius * 7000000;
            this.once_radius2 =
              Math.fround(this.cases[i].latest_data.deaths / deaths) * 7000000;
            this.once_radius3 =
              Math.fround(this.cases[i].latest_data.recovered / recovered) *
              7000000;
            let circleconfirmed;
            let circledeaths;
            let circlerecovered;
            circleconfirmed = L.circle(this.once_coord, {
              color: "red",
              fillColor: "#f03",
              fillOpacity: 0.5,
              radius: this.once_radius,
            });
            circledeaths = L.circle(this.once_coord, {
              color: "black",
              fillColor: "#2e2e2e",
              fillOpacity: 0.5,
              radius: this.once_radius2,
            });
            circlerecovered = L.circle(this.once_coord, {
              color: "green",
              fillColor: "#b5b5b5",
              fillOpacity: 0.5,
              radius: this.once_radius3,
            });
            circleconfirmed.addTo(this.map);
            // circledeaths.addTo(this.map);
            // circlerecovered.addTo(this.map);
          }
        }
        if (mmm == 0) {
          console.log(this.cases[i].name); //countries not mapped
        }
      }
    },
    onMapClick(e) {
      let popup = L.popup();
      // console.log("You clicked the map at " + e.latlng);
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(this.map);
      this.map.flyTo(e.latlng, 6);
      let x1 = e.latlng.lat;
      let y1 = e.latlng.lng;
      let listOfCountries = [];
      for (let p in this.testFly) {
        let x2 = this.testFly[p].latlng[0];
        let y2 = this.testFly[p].latlng[1];
        let res = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
        res = Math.sqrt(res);
        if (res < 5) {
          listOfCountries.push(this.testFly[p].latlng);
        }
      }
      const tm = this.testFly.filter((e) => {
        return (
          Math.sqrt(
            Math.pow(e.latlng[0] - x1, 2) + Math.pow(e.latlng[1] - y1, 2)
          ) < 5
        );
      });
      // console.log(listOfCountries);
      console.log(tm);
    },
  },
  mounted() {
    this.getPosts();
    this.initMap();
    this.getJSON();
    this.updateCircles();
  },
};
</script>
<style scoped>
.map {
  display: inline-block;
  justify-content: center;
}
#map {
  height: 80vh;
  width: 80vw;
  display: flex;
  justify-content: center;
  border: 2px solid rgb(10, 103, 131);
  z-index: 0;
}
#casesList {
  height: 23px;
  width: 15%;
  bottom: 28px;
  right: 9.9vw;
  position: absolute;
  border: none;
  outline: none;
}
.select {
  width: 100%;
}
#selectData {
  height: 80px;
  width: 15%;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  bottom: 51px;
  right: 9.8vw;
  border: 1px solid black;
  color: #fff;
}
.reset {
  height: 30px;
  width: 100px;
}
</style>
