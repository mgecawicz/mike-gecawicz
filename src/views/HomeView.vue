<template>
  <div class="name">
    <h1 v-motion-slide-visible-once-left>
      <span>Mike</span>
      <br />
      <span>Gecawicz</span>
    </h1>
  </div>
  <div class="tagLine" v-motion-slide-visible-once-bottom>
    <h2>Software Developer & Digital Content Designer</h2>
    <h3>Based in Jersey City, NJ</h3>
  </div>
  <div
    class="intro"
    v-motion
    :initial="{ opacity: 0, y: 30 }"
    :enter="{ opacity: 1, y: 0, scale: 1 }"
    :duration="700"
  >
    <h2 class="dummy">{{ item }}</h2>
  </div>
</template>

<script lang="ts" setup>
import lorem from "../data/text.json";
const item = lorem.lorem as string;
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
});
</script>
<style scoped>
template {
  background-color: #ffb703;
}
.intro {
  display: flex;
  justify-content: center;
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
  text-align: left;
  font-size: 2vw;
}
.dummy {
  text-align: justify;
  font-size: 18px;
  color: white;
  max-width: 80vw;
}
h3 {
  color: #888;
  text-align: left;
  font-size: 2vw;
}
@media screen and (max-width: 768px) {
  h1 {
    text-align: left;
    margin-bottom: 0;
    margin-left: 2%;
    margin-top: 5%;
    font-size: 10vw;
  }
}
@media screen and (min-width: 768px) {
  h1 {
    text-align: left;
    margin-bottom: 0;
    margin-left: 2%;
    margin-top: 0;
    font-size: 10vw;
  }
}
</style>
