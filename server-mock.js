module.exports = function(grunt) {
  "use strict";

  var proxy = require("http-proxy-middleware");
  var modifyResponse = require("node-http-proxy-json");
  grunt.loadNpmTasks("grunt-browser-sync");

  var resourcesProxy = proxy("/resources", {
    target: "https://sapui5.hana.ondemand.com",
    changeOrigin: true
  });

  var testResourcesProxy = proxy("/test-resources", {
    target: "https://sapui5.hana.ondemand.com",
    changeOrigin: true
  });

  grunt.initConfig({
    browserSync: {
      default_options: {
        bsFiles: {
          src: "**/*,js"
        },
        options: {
          server: {
            baseDir: ["webapp"],
            middleware: [resourcesProxy, testResourcesProxy]
          },
          startPath: "/test/flpSandboxMockServer.html"
        }
      }
    }
  });

  grunt.registerTask("default", ["browserSync"]);
};
