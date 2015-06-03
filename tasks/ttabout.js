/*
 * grunt-ttabout
 * https://github.com/bstearns-tt/grunt-ttabout
 *
 * Copyright (c) 2015 bstearns-tt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var fs = require('fs')
        , xml2js = require('xml2js')
        , f = require('util').format
        , _ = grunt.util._
        , log = grunt.log
        , verbose = grunt.verbose;

    grunt.registerMultiTask('ttabout', 'Creates the data/ttAbout and data/tt-release files during build', function() {

        var done = this.async();

        this.files.forEach(function(filePair) {
            var dest = filePair.dest;

            filePair.src.forEach(function(src) {
                if (!grunt.file.exists(src)) {
                    log.error('Error: File not found: `' + src + '`');
                    return done(false);
                }

                var parser = new xml2js.Parser();

                try {
                    var buffer = grunt.file.read("deployment.xml", "utf8");
                    parser.parseString(buffer, function (err, result) {
                        log.writeln(JSON.stringify(result));
                    });

                } catch (e) {
                    log.error('Error reading file `' + src + '` : ' + e);
                    return done(false);
                }

            });

        });

    });

};
