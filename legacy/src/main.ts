import { createApp } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import Tres from "@tresjs/core";
import App from "./App.vue";
import router from "./router";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import VueVideoPlayer from "@videojs-player/vue";
import "video.js/dist/video-js.css";

const app = createApp(App);
app.use(router);
app.use(Tres);
app.use(hljsVuePlugin);
app.use(MotionPlugin);
app.use(VueVideoPlayer);
app.mount("#app");
