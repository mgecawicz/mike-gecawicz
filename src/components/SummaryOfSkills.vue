<template>
  <div class="title">
    <h2
      v-motion-slide-visible-once-left
      style="margin-top: 1vw; font-weight: 1000; font-size: 35px"
    >
      Summary of Skills
    </h2>
    <div v-motion-slide-visible-once-top class="subject-holder">
      <div
        class="subject-object"
        v-for="subject in resume.summaryOfSkills"
        v-bind:key="subject"
      >
        <h3>{{ subject.title }}</h3>
        <div class="item" v-for="item in subject.items" v-bind:key="item">
          <p style="margin-top: 0px">■ {{ item }}</p>
        </div>
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
  name: "SummaryOfSkills",
});
</script>

<style scoped>
@media screen and (max-width: 768px) {
  /* When Mobile */
  h2 {
    font-weight: 300;
    text-align: left;
    font-size: 50px;
    margin-left: 2vw;
  }
  .subject-holder {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .subject-object {
    display: flex;
    text-align: left;
    flex-direction: column;
    background-color: #1c89a3;
    border-radius: 15px;
    height: fit-content;
    min-width: 15vw;
    padding-left: 1vw;
    margin-bottom: 2vw;
  }
  p {
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin-left: 5vw;
  }
  h3 {
    font-size: 18px;
    margin-left: 2vw;
    font-weight: 200;
    color: #8ecae6;
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
  .subject-holder {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .subject-object {
    display: flex;
    text-align: left;
    flex-direction: column;
    background-color: #1c89a3;
    border-radius: 15px;
    height: fit-content;
    min-width: 15vw;
    padding-left: 1vw;
    padding-right: 1vw;
  }
  p {
    color: white;
    font-size: 1vw;
    font-weight: 600;
    margin-left: 1vw;
  }
  h3 {
    font-size: 16px;
    font-weight: 200;
    color: #8ecae6;
  }
}
</style>
