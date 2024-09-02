<template>
  <div class="container" v-motion-slide-visible-once-left>
    <a class="a" :href="props.link" :style="{ backgroundColor: props.color }">
      <img class="logo" :src="props.icon" />
      <h2 :style="{ color: props.textColor }">{{ props.title }}</h2>
    </a>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps<{
  title?: string;
  color?: string;
  icon?: string;
  link?: string;
  textColor?: string;
}>();
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SocialMediaButton",
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
.a {
  display: flex;
  flex-direction: columns;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
a {
  width: 50vw;
  text-align: center;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 1vw;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
}
a:hover {
  background-color: #005582; /* Darker shade on hover */
  transform: scale(1.05); /* Slight zoom effect */
}

a:active {
  background-color: #003d72; /* Even darker shade on click */
  transform: scale(0.95); /* Slight shrink effect */
}
.container {
  display: flex;
  justify-content: center;
  text-align: center;
}
.logo {
  margin-right: 1vw;
  height: 3vw;
}
@media screen and (max-width: 768px) {
  /* mobile */
  .a {
    width: 80vw;
    display: flex;
    flex-direction: columns;
  }
  h2 {
    font-size: 18px;
    color: white;
    text-align: center;
  }
}
@media screen and (min-width: 768px) {
  /* desktop */
  .a {
    display: flex;
    flex-direction: columns;
  }
  h2 {
    color: white;
    text-align: center;
  }
}
</style>
