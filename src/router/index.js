import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import ProfileDetail from "../views/ProfileDetail.vue";
import PackageList from "../views/PackageList.vue";
import PackageEdit from "../views/PackageEdit.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/profile/detail/:id?",
    name: "Profile",
    component: ProfileDetail
  },
  {
    path: "/package/list",
    name: "Package list",
    component: PackageList
  },
  {
    path: "/package/edit/:id?",
    name: "Package edit",
    component: PackageEdit
  }
];

const router = new VueRouter({
  routes
});

export default router;
