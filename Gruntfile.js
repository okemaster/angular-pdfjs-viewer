module.exports = function (grunt) {
  'use strict';

  var escapeContent = function(content, quoteChar) {
    content = content.replace(/\r?\n$/, '');
    var bsRegexp = new RegExp('\\\\', 'g');
    var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
    var nlReplace = '\\n' + quoteChar + ' +\n' + quoteChar;
    return '\'' + content.replace(bsRegexp, '\\\\').replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace) + '\'';
  };

  // Project configuration.
  grunt.initConfig({
    replace: {
      dist: {
        options: {
          patterns: [
            {
                          match: /templateUrl:.*/,
                          replacement: function () {
                            var content = grunt.file.read('vendor/pdfjs-viewer/viewer-fragment.html');
                            return 'template: ' + escapeContent(content, '\'') + ',';
                          }
                        },            {
              match: /=== get current script file ===[\w\W]+======/,
              replacement: ''
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['src/angular-pdfjs-viewer.js'], dest: 'dist/'}
        ]
      }
    }
  });

  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-replace');

  // Default task(s).
  grunt.registerTask('default', ['replace']);
};
