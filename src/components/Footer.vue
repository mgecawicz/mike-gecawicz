<template>
  <div class="font-picker">
    <div
      v-for="font in props.fonts"
      v-bind:key="font"
      class="font-button-container"
    >
      <button class="font-button" @click="changeFont(font)">
        <p :style="{ fontFamily: props.currentFont }">{{ font }}</p>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
const emit = defineEmits<{
  (event: "updated-font", payload: string): void;
}>();
const props = defineProps<{
  fonts?: Array<string>;
  currentFont?: string;
}>();
const changeFont = (newFont: string) => {
  emit("updated-font", newFont);
};
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "FooterView",
});
</script>

<style scoped>
.font-picker {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2vw;
  margin-top: 1vw;
}
.font-button-container {
  background-color: none;
}
.font-button {
  height: fit-content;
  background: transparent;
  border: none;
  color: #333333;
  padding: 3px 4px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
}

.font-button:hover {
  background-color: #fb8500;
  color: #ffffff;
}

.font-button:active {
  transform: scale(0.95);
}

.font-button:focus {
  box-shadow: 0 0 0 2px rgba(98, 0, 234, 0.3);
}
p {
  font-size: small;
}
</style>
