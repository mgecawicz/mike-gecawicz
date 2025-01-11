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
    <h3>Based in Raleigh, NC</h3>
  </div>
  <div class="mainContent">
    <div class="column1">
      <div
        v-for="entry in blog.entries"
        v-bind:key="entry"
        v-motion-slide-visible-once-left
      >
        <p class="blogDate">{{ entry.date }}</p>
        <p class="blogContent">{{ entry.content }}</p>
        <hr />
      </div>
    </div>
    <div class="column2">
      <div style="line-height: 0.3">
        <h2 v-motion-slide-visible-once-right class="dummy">
          This website was developed using Vue.js
        </h2>
      </div>
      <h2 v-motion-slide-visible-once-right class="dummy">
        Here's the code for this page...
      </h2>
      <div v-motion-slide-visible-once-right class="code-container">
        <highlightjs class="code-block" language="javascript" :code="code" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "./style/home.css";
import blog from "../data/blog.json";
import code from "raw-loader!../data/homevue.txt";
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
});
</script>
