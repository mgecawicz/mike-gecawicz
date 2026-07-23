<template>
  <!-- <BoidsSim /> -->
  <div class="body">
    <div class="title">
      <h1 v-motion-slide-visible-once-left>Contact</h1>
    </div>
    <div
      style="margin-top: 2vw"
      v-for="account in sm.accounts"
      v-bind:key="account"
    >
      <SocialMediaButton
        :title="account.title"
        :color="account.color"
        :icon="account.icon"
        :link="account.link"
        :textColor="account.textColor"
      />
    </div>
    <div style="height: 5vh" />
  </div>
</template>
<script setup lang="ts">
import sm from "../data/sm.json";
import SocialMediaButton from "@/components/SocialMediaButton.vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ContactView",
});
</script>

<style scoped>
.body {
  min-height: 100vh;
}
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
  text-align: right;
  font-size: 12;
  margin-left: 5%;
}
h3 {
  color: #888;
  text-align: left;
  font-size: 2vw;
}
h1 {
  color: #2a9d8f;
  text-align: left;
  margin-bottom: 0;
  margin-left: 2%;
  margin-top: 0;
  font-size: 10vw;
}
</style>
