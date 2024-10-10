<template>
  <div style="text-align: center">
    <a id="stills" />
    <h2>Blender Design</h2>
    <VueFlux
      :options="vfOptions"
      :rscs="vfRscs"
      :transitions="vfTransitions"
      style="width: 80vw; margin-left: 10vw; margin-top: 5vw; height: 80vw"
      ref="$vueFlux"
    >
      <template #preloader="preloaderProps">
        <FluxPreloader v-bind="preloaderProps" />
      </template>

      <template #caption="captionProps">
        <FluxCaption v-bind="captionProps" />
      </template>

      <template #controls="controlsProps">
        <FluxControls v-bind="controlsProps" />
      </template>

      <template #pagination="paginationProps">
        <FluxPagination v-bind="paginationProps" />
      </template>

      <template #index="indexProps">
        <FluxIndex v-bind="indexProps" />
      </template>
    </VueFlux>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowReactive, require } from "vue";
import {
  VueFlux,
  FluxCaption,
  FluxControls,
  FluxIndex,
  FluxPagination,
  FluxPreloader,
  Img,
  Book,
} from "vue-flux";
import "vue-flux/style.css";

const $vueFlux = ref();

const vfOptions = shallowReactive({
  autoplay: true,
});

const vfRscs = shallowReactive([
  new Img(require("../images/23_1.png")),
  new Img(require("../images/39_1.png")),
  new Img(require("../images/64_1.png")),
  new Img(require("../images/bg.png")),
  new Img(require("../images/catch.png")),
  new Img(require("../images/CITY.png")),
  new Img(require("../images/dropFinal.png")),
  new Img(require("../images/entry_00000.png")),
  new Img(require("../images/geoWalker.png")),
  new Img(require("../images/house2 copy.png")),
  new Img(require("../images/kayboard.png")),
  new Img(require("../images/not.png")),
  new Img(require("../images/REACH.png")),
  new Img(require("../images/skull2.png")),
  new Img(require("../images/tubes.png")),
]);

const vfTransitions = shallowReactive([Book]);
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "StillImages",
});
</script>

<style scoped>
.bg {
  background: linear-gradient(
    to bottom,
    #333333,
    #219ebc
  ); /* Charcoal to Dark Blue */
  margin-right: 5vw;
  margin-left: 5vw;
  overflow-y: scroll !important; /* Enable vertical scrolling */
  max-height: 150vh;
  color: white; /* Optional: set text color for better contrast */
  padding: 20px; /* Optional: padding */
  padding-bottom: 60px;
  border-radius: 20px;
  margin-bottom: 5vw;
}
h2 {
  margin-top: 5vw;
  font-size: 3rem !important;
  color: #ffffff;
  margin-left: 5vw;
}
</style>
