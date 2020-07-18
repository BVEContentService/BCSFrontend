module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/test/" : "/",

  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  },

  configureWebpack: {
    externals: {
      "@ckeditor/ckeditor5-build-classic": "ClassicEditor"
    }
  },

  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "BVE Content Service";
      return args;
    });
  },

  productionSourceMap: false
};
