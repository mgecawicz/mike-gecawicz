<template>
  <div id="app" :class="backgroundClass" :style="{ fontFamily: currentFont }">
    <nav v-motion-slide-visible-once-right>
      <router-link to="/">~/Home/</router-link>
      <router-link to="/about">About/</router-link>
      <router-link to="/projects">Projects/</router-link>
      <router-link to="/resume">Resume/</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>
    <router-view />
    <footer>
      <Footer
        :fonts="fonts"
        :current-font="currentFont"
        @updated-font="changeFont"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "./app.css";
import Footer from "@/components/Footer.vue";
const fonts = [
  "SometypeMono",
  "MonoFaceRegular",
  "Pixelify_Sans",
  "Libre_Barcode_39",
];
const currentFont = ref(fonts[0]);
const changeFont = (payload: string) => {
  currentFont.value = payload;
};
</script>

<script lang="ts">
export default {
  computed: {
    backgroundClass() {
      return this.$route.meta.backgroundColor || "";
    },
  },
};
</script>

<style>
html,
body {
  min-height: 100vh;
  margin: 0;
  overflow-x: hidden; /* Prevent horizontal scroll if needed */
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #023047;
  height: 100%;
  margin: 0;
  transition: background-color 0.5s ease;
}
@media screen and (max-width: 768px) {
  nav {
    text-align: center;
    padding-top: 30px;
  }
  nav a {
    font-size: 4vw;
  }
}

@media screen and (min-width: 768px) {
  nav {
    padding: 30px;
    text-align: right;
  }
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #fff;
}
.bg-home {
  background-color: #ffb703; /* Example color for Home page */
}

.bg-about {
  background-color: #fb8500; /* Example color for About page */
}

.bg-contact {
  background-color: #ffb703; /* Example color for Contact page */
}

.bg-projects {
  background-color: #219ebc; /* Example color for About page */
}

.bg-resume {
  background-color: #8ecae6; /* Example color for Contact page */
}
</style>
