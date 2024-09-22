<template>
  <div style="min-height: 100vh">
    <div class="title">
      <h1 v-motion-slide-visible-once-left>Projects</h1>
      <h2 style="text-align: left; width: 50vw; margin-left: 10vw">
        Over the past 10 years, I have devoted much of my professional, academic
        and personal time to the development of projects in a range of
        diciplines. This spans everthing from front/backend development, video
        production and 3D Rendering, industrial design, and multi-diciplinary
        reserach.
      </h2>
      <h2 style="text-align: left; width: 50vw; margin-left: 10vw">
        These are some of those projects.
      </h2>
    </div>
    <div style="margin-top: 20vh; text-align: center">
      <WasmTest />
      <VirtualCoffee />
      <HowManyWeeks />
      <MovieList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import WasmTest from "@/projectComps/WasmTest.vue";
import MovieList from "@/projectComps/MovieList.vue";
import HowManyWeeks from "@/projectComps/HowManyWeeks.vue";
import VirtualCoffee from "@/projectComps/VirtualCoffee.vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProjectsView",
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 0.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

h2 {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #f9f9f9;
}

/* Movie list */
ul {
  list-style-type: none; /* Remove default bullet points */
  padding: 0; /* Remove padding */
  max-width: 600px; /* Set a max width */
  margin: 0 auto; /* Center the list */
}

/* Individual movie item */
li {
  background-color: #f9f9f9; /* Light background for each item */
  border: 1px solid #ddd; /* Add a border */
  border-radius: 5px; /* Rounded corners */
  padding: 15px; /* Padding for content */
  margin: 10px 0; /* Space between items */
  color: black;
  transition: background-color 0.3s; /* Smooth transition for hover effect */
}

/* Hover effect */
li:hover {
  background-color: #e2e2e2; /* Change background on hover */
}

/* Movie title and year styling */
li span.title {
  font-weight: bold; /* Bold for title */
  font-size: 1.2em; /* Larger font for title */
}

li span.year {
  font-style: italic; /* Italic for the year */
  color: #555; /* Darker gray for year */
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
  color: #ffb703;
  margin-left: 2%;
  margin-top: 0;
  font-size: 10vw;
}
</style>
