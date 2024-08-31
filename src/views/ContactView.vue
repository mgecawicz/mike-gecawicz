<template>
  <BoidsSim />
  <div class="title">
    <h1 v-motion-slide-visible-once-left>Contact</h1>
  </div>
  <div style="height: 60vh; margin-top: 20vh">
    <h2 v-motion-slide-right>This will eventually be the contact page.</h2>
    <h2 v-motion-slide-left>Stay Tuned!</h2>
  </div>
</template>
<script setup lang="ts">
import BoidsSim from "../components/Boids.vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ContactView",
});
</script>

<style scoped>
template {
  background-color: #ffb703;
}
.name {
  line-height: 0.8;
}
.tagLine {
  margin-top: 3%;
  margin-left: 3%;
  line-height: 0.4;
}
.ball {
  position: absolute;
  background-color: red;
  width: 20vw;
  height: 20vw;
  position: 0 0;
  border-radius: 20vw;
}
h2 {
  text-align: center;
  font-size: 18px;
}
h3 {
  color: #888;
  text-align: left;
  font-size: 2vw;
}
h1 {
  color: white;
  text-align: left;
  margin-bottom: 0;
  margin-left: 2%;
  margin-top: 0;
  font-size: 10vw;
}
</style>
