<template>
  <div style="min-height: 100vh">
    <div class="title">
      <h1 v-motion-slide-visible-once-left>Projects</h1>
    </div>
    <div style="margin-top: 20vh">
      <h2 v-motion-slide-right>This will eventually be the projects page.</h2>
      <h2 v-motion-slide-left>Stay Tuned!</h2>
    </div>
  </div>
</template>
<script setup lang="ts">
import BouncingBall from "../components/BouncingBall.vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProjectsView",
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
  text-align: left;
  margin-bottom: 0;
  margin-left: 2%;
  margin-top: 0;
  font-size: 10vw;
}
</style>
