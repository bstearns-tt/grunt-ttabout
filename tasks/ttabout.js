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
        , path = require('path')
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

                var buffer;

                try {
                    buffer = grunt.file.read(src, "utf8");
                } catch (e) {
                    log.error('Error reading file `' + src + '` : ' + e);
                    return done(false);
                }

                parser.parseString(buffer, function (err, result) {

                    var name = result.package.name[0];
                    if (name === undefined) {
                        log.error('<name> tag not located in `' + src + '` file.');
                        return done(false);
                    }

                    var release = result.package.version[0].release[0];
                    if (release === undefined) {
                        log.error('<release> tag not located in `' + src + '` file.');
                        return done(false);
                    }

                    verbose.writeln(f(src + ' contents: ' + JSON.stringify(result)));

                    // Create the tt-release.txt file which contains only the version release number
                    //
                    var ttReleaseData = release;
                    try {
                        grunt.file.write(path.join(dest, 'tt-release.txt'), ttReleaseData);
                    } catch (e) {
                        log.error('Error writing `tt-release.txt` file: ' + e);
                        return done(false);
                    }

                    // Gather up the fields that we need for the ttAbout.json file and
                    // construct the object
                    //
                    var ttAboutData = {};
                    ttAboutData.version = release;
                    ttAboutData.name = name;

                    // Get the current user
                    //
                    var username = (process.env.USER || process.env.USERNAME);
                    ttAboutData.buildUser = username;

                    // TimeStamp
                    //
                    var buildDate = new Date();
                    ttAboutData.buildDateTime = buildDate.toISOString();

                    // Write out the results to the output file
                    //
                    try {
                        grunt.file.write(path.join(dest, 'ttAbout.json'), JSON.stringify(ttAboutData));
                    } catch (e) {
                        log.error('Error writing `ttAbout.json` file: ' + e);
                        return done(false);
                    }

                });

            });

        });

        done();

    });

};
