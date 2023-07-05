import Vue from "vue";
import Vuetify from "vuetify/lib";
import { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.teal.darken1,
        primarylight: colors.teal.lighten2,
        secondary: colors.grey.lighten3
      },
      dark: {
        primary: colors.teal.darken1,
        primarylight: colors.teal.lighten2,
        secondary: colors.grey.lighten3
      }
    }
  }
});
