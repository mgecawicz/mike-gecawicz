<template>
  <div class="title">
    <h1 v-motion-slide-visible-once-right>Resume</h1>
    <div class="contact" v-motion-slide-visible-once-left>
      <h2 style="font-weight: 1000; font-size: 2.5vw">{{ resume.name }}</h2>
      <h3 style="color: #444">{{ resume.location }}</h3>
      <h3 style="color: #444">{{ resume.email }}</h3>
    </div>
    <div style="background-color: #219ebc; padding-top: 0.2vw">
      <h2
        style="margin-top: 5vw; font-weight: 1000; font-size: 2vw; color: white"
      >
        Experience
      </h2>
      <div
        v-for="item in resume.experience"
        v-bind:key="item.company"
        class="education-block"
      >
        <h3 style="color: white">{{ item.company }}</h3>
        <h3>{{ item.location }}</h3>
        <h3>{{ item.position }}</h3>
        <h3>{{ item.duration }}</h3>
        <h3>{{ item.description }}</h3>
        <h3
          v-if="item.publications.length > 0"
          style="margin-left: 5vw; color: #8ecae6"
        >
          Notable Publications
        </h3>
        <div
          v-for="sub in item.publications"
          v-bind:key="sub.name"
          class="publications"
        >
          <h4>[{{ sub.name }}]</h4>
          <h4 style="margin-left: 7vw">- {{ sub.description }}</h4>
          <h4 style="margin-left: 7vw">- {{ sub.details }}</h4>
          <br />
        </div>
        <hr style="border-color: #8ecae6" />
        <br />
      </div>
    </div>
    <div>
      <h2 style="margin-top: 5vw; font-weight: 1000; font-size: 2vw">
        Education
      </h2>
      <div
        v-for="item in resume.education"
        v-bind:key="item.school"
        class="education-block"
      >
        <h3 style="color: white">{{ item.school }}</h3>
        <h3>{{ item.studies }}</h3>
        <h3>{{ item.years }}</h3>
        <h3>{{ item.honors }}</h3>
        <h3>{{ item.description }}</h3>
        <hr style="border-color: #219ebc" />
        <br />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import res from "../data/text.json";
const resume = res;
</script>

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
.contact {
  line-height: 0.5;
  padding-bottom: 0.5vw;
}
.education-block {
  line-height: 1;
  max-width: 80vw;
  margin-left: 5vh;
}
.tagLine {
  margin-top: 3%;
  margin-left: 3%;
  line-height: 0.4;
}
h2 {
  font-weight: 300;
  text-align: left;
  font-size: 2vw;
  margin-left: 2vw;
}
h3 {
  text-align: left;
  font-size: 1.5vw;
  margin-left: 2vw;
}
h4 {
  text-align: left;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1vw;
  margin-left: 5vw;
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
