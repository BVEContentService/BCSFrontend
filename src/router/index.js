import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import ProfileDetail from "../views/ProfileDetail.vue";
import ProfileEdit from "../views/ProfileEdit.vue";
import PackageList from "../views/PackageList.vue";
import PackageDetail from "../views/PackageDetail.vue";
import PackageEdit from "../views/PackageEdit.vue";
import FileList from "../views/FileList.vue";
import UserRegister from "../views/UserRegister.vue";
import UserActivate from "../views/UserActivate.vue";
import UserChangePassword from "../views/UserChangePassword.vue";
import Debug from "../views/Debug.vue";

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
    path: "/profile/edit/:id?",
    name: "Profile edit",
    component: ProfileEdit
  },
  {
    path: "/package/list",
    name: "Package list",
    component: PackageList
  },
  {
    path: "/package/detail/:id",
    name: "Package detail",
    component: PackageDetail
  },
  {
    path: "/package/edit/:id?",
    name: "Package edit",
    component: PackageEdit
  },
  {
    path: "/user/register",
    name: "User register",
    component: UserRegister
  },
  {
    path: "/user/activate/:token",
    name: "User activate",
    component: UserActivate
  },
  {
    path: "/user/change_password",
    name: "Change password",
    component: UserChangePassword
  },
  {
    path: "/file/list",
    name: "File list",
    component: FileList
  },
  {
    path: "/debug",
    name: "Debug",
    component: Debug
  }
];

const router = new VueRouter({
  routes
});

export default router;
