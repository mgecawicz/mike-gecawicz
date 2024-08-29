<template>
  <div class="title">
    <h1 v-motion-slide-visible-once-right>Resume</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ResumeView",
});
</script>

<style scoped>
.title {
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
h3 {
  color: #888;
  text-align: left;
  font-size: 2vw;
}
h1 {
  color: white;
  text-align: right;
  margin-bottom: 0;
  margin-right: 2%;
  margin-top: 0;
  font-size: 10vw;
}
</style>
