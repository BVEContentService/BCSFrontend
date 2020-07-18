import i18n from "../i18n.js";

var googleSerializer = function(shareURL) {
  return shareURL
    .stripStart("https://")
    .stripStart("http://")
    .stripStart("drive.google.com/file/d")
    .stripStart("drive.google.com/open")
    .strip("/")
    .stripStart("?id=")
    .stripEnd("?usp=sharing")
    .strip("/")
    .stripEnd("view")
    .strip("/");
};

export default {
  platform: {
    openbve: { name: "OpenBVE", bgColor: "#636363", dark: true },
    bvets5: { name: "BVE 5", bgColor: "#A7DC41", dark: false },
    hmmsim: { name: "Hmmsim", bgColor: "#569E7B", dark: true },
    bvets6: { name: "BVE 6", bgColor: "#000000", dark: true }
  },
  file: {
    plain: { p1: "url", p2: [] },
    auth: { p1: "url", p2: ["username", "password"] },
    google: {
      p1: "share",
      p2: [],
      p1s: googleSerializer,
      p1d: sid => "https://drive.google.com/open?id=" + sid,
      p1v: sid =>
        googleSerializer(sid).match(/^[a-zA-Z0-9]*$/) ||
        i18n.t("e_file_google_bad")
    },
    teracloud: {
      p1: "path",
      p2: ["email", "password"]
    },
    onedrive: {
      p1: "share",
      p2: [],
      p1v: path =>
        path.indexOf("https://1drv.ms") == 0 ||
        path.indexOf("http://1drv.ms") == 0 ||
        i18n.t("e_file_onedrive_bad")
    },
    pandog: { p1: "path", p2: ["email", "password"] },
    bcstianjin: { p1: "path", p2: ["email"] }
  }
};
