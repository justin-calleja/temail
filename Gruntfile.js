"use strict";

module.exports = function (grunt) {

  require("load-grunt-tasks")(grunt);

  // --- initConfig START ---
  grunt.initConfig({

    watch: {
      options: {
        nospawn: true
      },
      "babel": {
        files: [
          "src/**/*.js",
          "src/temail-cli"
        ],
        tasks: [ "babel" ]
      },
      mochaTest: {
        files: [
          "test/**/*.js",
          "src/**/*.js"
        ],
        tasks: [ "mochaTest" ]
      },
      readme: {
        files: [ "README.md" ],
        tasks: [ "markdown:readme" ]
      }
    },

    "babel": {
      options: {
        experimental: true
      },
      build: {
        files: {
          "build/temail-cli": "src/temail-cli",
          "build/TemailConf.js": "src/TemailConf.js",
          "build/utils/index.js": "src/utils/index.js",
          "build/errors/NoTemplateDataError.js": "src/errors/NoTemplateDataError.js"
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: "spec",
          clearRequireCache: true
        },
        src: ["test/**/*.js"]
      }
    },

    clean: {
      build: "build"
    },

    copy: {
      exec: {
        options: {
          mode: "775"
        },
        files: [
          { src: [ "build/temail-cli" ], dest: "build/temail-cli" }
        ]
      }
    },

    markdown: {
      readme: {
        files: [
          {
          expand: true,
          src: 'README.md',
          dest: 'build/docs/html/',
          ext: '.html'
        }
        ]
      }
    }

  });
  // --- initConfig END ---

  grunt.registerTask("default", ["clean:build", "babel", "copy:exec", "mochaTest"]);
  grunt.registerTask("notest", ["clean:build", "babel", "copy:exec"]);
  grunt.registerTask("readme", ["markdown:readme"]);

};

