<template>
  <div class="title">
    <h1 v-motion-slide-visible-once-right>Résumé</h1>
    <div class="contact" v-motion-slide-visible-once-left>
      <h2 class="myName">{{ resume.name }}</h2>
      <h3 style="color: #444">{{ resume.location }}</h3>
      <h3 style="color: #444">{{ resume.email }}</h3>
    </div>
    <div
      style="background-color: #219ebc; padding-top: 0.2vw; padding-bottom: 2vw"
    >
      <SummaryOfSkills />
    </div>
    <div v-motion-slide-visible-once-left>
      <h2 style="margin-top: 5vw; font-weight: 1000; font-size: 35px">
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
        <h3 class="description">{{ item.description }}</h3>
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
    <div
      v-motion-slide-visible-once-left
      style="background-color: #219ebc; padding-top: 0.5vw"
    >
      <h2 style="margin-top: 1vw; font-weight: 1000; font-size: 35px">
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
import SummaryOfSkills from "@/components/SummaryOfSkills.vue";
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
  margin-left: 5vw;
}
.tagLine {
  margin-top: 3%;
  margin-left: 3%;
  line-height: 0.4;
}
@media screen and (max-width: 768px) {
  /* When Mobile */
  h2 {
    font-weight: 300;
    text-align: left;
    font-size: 50px;
    margin-left: 2vw;
  }
  h3 {
    color: white;
    text-align: left;
    font-size: 20px;
    margin-left: 2vw;
  }
  .myName {
    font-weight: 1000;
    font-size: 30px;
  }
  h4 {
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 12px;
    margin-left: 5vw;
  }
  .myExperience {
    margin-top: 5vw;
    font-weight: 1000;
    font-size: 25px;
    color: white;
  }
  .description {
    font-size: 12px;
  }
}
@media screen and (min-width: 768px) {
  /* When Desktop */
  h2 {
    font-weight: 300;
    text-align: left;
    font-size: 2vw;
    margin-left: 2vw;
  }
  h3 {
    color: white;
    text-align: left;
    font-size: 18px;
    margin-left: 2vw;
  }
  .myName {
    font-weight: 1000;
    font-size: 30px;
  }
  h4 {
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 12px;
    margin-left: 5vw;
  }
  .myExperience {
    margin-top: 5vw;
    font-weight: 1000;
    font-size: 25px;
    color: white;
  }
}
h1 {
  color: white;
  text-align: right;
  margin-bottom: 0;
  margin-right: 2%;
  margin-top: 2%;
  font-size: 10vw;
}
</style>
