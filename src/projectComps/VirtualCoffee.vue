<template>
  <div class="bg">
    <a id="coffee" />
    <div style="display: flex; flex-direction: column; align-items: center">
      <h2>Influence of Electric Taste</h2>
      <p style="width: 80vw; text-align: center; margin-bottom: 4vw">
        This reserach paper was the culmination of multiple years of work,
        focused on the science of flavor and how to influence it. It involved
        many areas of engineering, such as mechanical, electrical, and
        bio-chemical. I am proud to be a co-author on this work.
      </p>
    </div>
    <iframe
      src="https://drive.google.com/file/d/1cEcI_jVDroXyLZV73wZ1r67m8-J05GEs/preview"
      width="80%"
      height="800"
      allow="autoplay"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "VirtualCoffee",
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
  margin-top: 2rem;
  font-size: 3rem !important;
  color: #fb8500;
}
</style>
