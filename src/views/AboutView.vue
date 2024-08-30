<template>
  <div class="title">
    <h1 v-motion-slide-visible-once-right>About</h1>
  </div>
  <div class="container">
    <div
      v-motion
      :initial="{ opacity: 0, y: -30 }"
      :enter="{ opacity: 1, y: 0, scale: 1 }"
      :duration="700"
    >
      <img v-bind:src="require('../images/me.jpg')" class="myImage" />
    </div>
    <div
      class="intro"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, scale: 1 }"
      :duration="700"
    >
      <h2>
        I am a seasoned web developer with extensive experience in both
        front-end and back-end technologies, adept at using a range of
        programming languagessuch as JavaScript, Python, and PHP to build robust
        and dynamic web applications.
        <br /><br />
        My expertise extends beyond coding to encompass a deep understanding of
        digital design, where I craft visually stunning content through both
        traditional and innovative methods. I leverage Adobe tools to create
        high-quality graphics and video, while also exploring the creative
        potential of code with platforms like Processing to generate unique,
        algorithmically-driven visuals.
        <br /><br />
        This blend of technical proficiency and artistic vision allows me to
        deliver comprehensive digital solutions thatare not only functional but
        also aesthetically compelling. Explore my portfolio to discover how my
        skills in web development and digital design come together to create
        engaging and impactful user experiences.
      </h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "AboutView",
});
</script>

<style scoped>
.name {
  line-height: 0.8;
}

@media screen and (max-width: 768px) {
  /* When Mobile */
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    overflow: hidden;
  }
  .myImage {
    position: absolute;
    margin-bottom: 5vw;
    margin-left: -50vw;
    max-width: 100vw;
    filter: opacity(25%);
  }
  .intro {
    display: flex;
    text-align: left;
    justify-content: center;
    margin-left: 2vw;
    margin-right: 5vw;
    margin-bottom: 5vw;
  }
}
@media screen and (min-width: 768px) {
  /* When Desktop */
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
  .myImage {
    margin-left: 5vw;
    margin-bottom: 5vw;
    max-width: 30vw;
    border-radius: 80px;
  }
  .intro {
    display: flex;
    justify-content: center;
    margin-left: 2vw;
    margin-right: 5vw;
    margin-bottom: 5vw;
  }
}
.tagLine {
  margin-top: 3%;
  margin-left: 3%;
  line-height: 0.4;
}
h2 {
  text-align: justify;
  font-size: 18px;
  color: white;
  max-width: 80vw;
}
h3 {
  color: #888;
  text-align: left;
  font-size: 2vw;
}
h1 {
  text-align: right;
  margin-bottom: 0;
  margin-right: 2%;
  margin-top: 0;
  font-size: 10vw;
}
</style>
