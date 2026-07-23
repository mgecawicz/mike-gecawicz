import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ContactView from "../views/ContactView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import ResumeView from "../views/ResumeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { backgroundColor: "bg-home" },
  },
  {
    path: "/about",
    name: "about",
    meta: { backgroundColor: "bg-about" },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
    meta: { backgroundColor: "bg-contact" },
  },
  {
    path: "/projects",
    name: "projects",
    component: ProjectsView,
    meta: { backgroundColor: "bg-projects" },
  },
  {
    path: "/resume",
    name: "resume",
    component: ResumeView,
    meta: { backgroundColor: "bg-resume" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
