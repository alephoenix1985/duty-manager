const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // We need to override the CRA plugin that generates a service worker
      // It can be either GenerateSW or InjectManifest.
      const workboxPluginIndex = webpackConfig.plugins.findIndex(
        (element) =>
          element.constructor.name === "GenerateSW" ||
          element.constructor.name === "InjectManifest",
      );
      if (workboxPluginIndex !== -1) {
        webpackConfig.plugins.splice(workboxPluginIndex, 1);
      }

      webpackConfig.plugins.push(
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc: path.resolve(__dirname, "src/service-worker.ts"),
          swDest: "service-worker.js",
        }),
      );
      return webpackConfig;
    },
  },
};
