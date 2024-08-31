<template>
  <div
    v-for="boid in flock"
    v-bind:key="boid.index"
    :style="{
      position: 'absolute',
      left: boid.position.x + 'px',
      top: boid.position.y + 'px',
      width: '10px',
      height: '10px',
      borderRadius: '2px',
      backgroundColor: '#fb8500',
      rotate: -Math.atan2(boid.velocity.x, boid.velocity.y) + 'rad',
      transform: 'translate(-50%, -50%)',
    }"
    class="sphere"
  ></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Boid } from "../components/Boid";

const flock = ref([] as Array<Boid>);
function setup() {
  for (let i = 0; i < 100; i++) {
    flock.value.push(new Boid(i));
  }
}

function draw() {
  for (const boid of flock.value) {
    boid.edges();
    boid.flock(flock.value);
    boid.update();
  }
  requestAnimationFrame(draw);
}

// Start animation when component is mounted
onMounted(() => {
  setup();
  draw();
});
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BoidsSim",
});
</script>
