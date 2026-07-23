<template>
  <div style="margin-top: 5vw">
    <div style="display: flex; flex-direction: column; align-items: left">
      <a href="#wasm">🧮 Collatz Conjecture Calculator</a>
      <a href="#maze">🔎 A* Algorithm with Recursive Backtracking</a>
      <a href="#coffee">☕ Influence of Electric Taste</a>
      <a href="#weeks">📅 How Many Weeks</a>
      <a href="#movie-list">🍿 Movie Watch List</a>
      <a href="#stills">🖌️ Blender Design</a>
      <a href="#stills">📹 3D Animation</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ContentsVue",
});
</script>

<style scoped>
h2 {
  margin-top: 2rem;
  font-size: 3rem !important;
  color: #8ecae6;
}
a {
  text-align: left;
  margin-left: 10vw;
  color: #ffb703;
  font-weight: 600;
  font-size: 30px;
}
h3 {
  text-align: center;
  color: white;
  font-size: 20px;
}
</style>
