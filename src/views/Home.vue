<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <Cases msg="Hello World" />
  </div>
</template>

<script>
// @ is an alias to /src
import Cases from "@/components/Cases.vue";

export default {
  name: "home",
  components: {
    Cases
  }
};
</script>
