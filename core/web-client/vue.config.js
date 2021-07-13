module.exports = {
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "src/styles/vars.scss";`,
      },
      // do not touch .sass files
      sass: {
        prependData: "",
      },
    },
  },

  // worker-loader issue workaround
  configureWebpack: {
    output: {
      globalObject: "this",
    },
  },
};
