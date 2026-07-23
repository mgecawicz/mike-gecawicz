<template>
  <div class="bg">
    <a id="weeks" />
    <div style="display: flex; flex-direction: column; align-items: center">
      <h2>How Many Weeks</h2>
      <p style="width: 80vw; text-align: center">
        In this project, I wanted to illustrate the extend of a human lifetime
        vissually. It is hosted on a different domain and rendered here for
        simplicity. For more details, see the description below.
      </p>
    </div>
    <iframe
      src="https://how-many-weeks.com"
      width="90%"
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
    #36454f,
    #cc0000
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
