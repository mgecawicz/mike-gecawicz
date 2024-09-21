<template>
  <div class="bg">
    <div style="display: flex; flex-direction: column; align-items: center">
      <h2>WebAssembly Collatz Conjecture</h2>
      <p style="width: 80vw; text-align: center">
        The Collatz Conjecture is a classic problem is mathematics and computer
        science. Although, for larger starting integers, this can be rather
        demanding and slow. To acheive good load time on the web, I implmemented
        WebAssembly for lightning fast computation.
      </p>
    </div>
    <iframe
      src="http://mikegec.com/Collatz/src/main.html"
      width="100%"
      height="800"
      style="border: none"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "HowManyWeek",
});
</script>

<style scoped>
.bg {
  background: linear-gradient(
    to bottom,
    #888888,
    #333333
  ); /* Charcoal to Dark Blue */
  margin-right: 5vw;
  margin-left: 5vw;
  color: white; /* Optional: set text color for better contrast */
  padding: 20px; /* Optional: padding */
  padding-bottom: 60px;
  border-radius: 20px;
  margin-bottom: 5vw;
}
h2 {
  margin-top: 2rem;
  font-size: 3rem !important;
  color: #8ecae6;
}
</style>
