<template>
  <div v-motion-pop :style="sphereStyle" class="sphere"></div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
const x = ref(window.innerWidth / 2);
const y = ref(window.innerHeight / 2);
const dx = ref(1); // Speed in the x direction
const dy = ref(0); // Speed in the y direction
const ddx = ref(0); // Speed in the x direction
const ddy = ref(0.1); // Speed in the y direction
const radius = 50; // Radius of the sphere
const containerWidth = window.innerWidth; // Width of the window
const containerHeight = window.innerHeight; // Height of the window

const sphereStyle = computed(
  (): Record<string, string> => ({
    position: "absolute",
    left: `${x.value}px`,
    top: `${y.value}px`,
    width: "100px",
    height: "100px",
    backgroundColor: "#fb8500",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
  })
);

// Function to update the sphere's position and animate it
function animate() {
  // Update position
  dx.value += ddx.value;
  dy.value += ddy.value;
  x.value += dx.value;
  y.value += dy.value;

  // Bounce off the edges
  if (x.value - radius < 0 || x.value + radius > containerWidth) {
    dx.value *= -1; // Reverse direction
  }
  if (y.value - radius < 0 || y.value + radius > containerHeight) {
    dy.value *= -1; // Reverse direction
  }

  // Request the next frame
  requestAnimationFrame(animate);
}

// Start animation when component is mounted
onMounted(() => {
  animate();
});
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BouncingBall",
});
</script>
