import { createApp } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";

const app = createApp(App);
app.use(router);
app.use(hljsVuePlugin);
app.use(MotionPlugin);
app.mount("#app");
