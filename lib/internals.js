/**
 * @author Lcf.vs
 * @license Copyright MIT 2016
 * @repo https://github.com/Lcfvs/renderable
 * @module lib/internals
 */

void function() {
    'use strict';

    var fs,
        path,
        glob,
        readFile,
        resolve,
        options,
        internals,
        resources,
        parsers,
        onEntry,
        onFiles,
        onFile,
        list,
        read;

    fs = require('fs');
    path = require('path');

    glob = require('glob');

    readFile = fs.readFile;
    resolve = path.resolve;

    options = {
        nodir: true
    };

    internals = Object.create(null);
    resources = Object.create(null);
    parsers = [];

    internals.register = function(mask) {
        if (mask in resources) {
            return Promise.resolve([resources[mask]]);
        }

        return list(mask).then(onFiles);
    };

    internals.render = function(parser, file) {
        var index;

        index = parsers.indexOf(parser);

        if (index === -1) {
            index = parsers.push(parser) - 1;
        }

        return internals.register(file)
        .then(onEntry)
        .then(function(entry) {
            var parsed;

            parsed = entry.parsed;

            if (!(index in entry.parsed)) {
                parsed[index] = parser(new Buffer(entry.buffer), entry.file);
            }

            return Promise.resolve(parsed[index].render());
        });
    };

    onEntry = function(entries) {
        var entry;

        entry = entries.shift();

        if (entry.buffer) {
            return Promise.resolve(entry);
        }

        return read(entry);
    };

    onFiles = function(files) {
        return files.map(onFile);
    };

    onFile = function(file) {
        var entry;

        file = resolve(file);

        if (file in resources) {
            return resources[file];
        }

        entry = Object.create(null);
        entry.file = file;
        entry.parsed = Object.create(null);

        resources[file] = entry;

        return entry;
    };

    list = function(path) {
        return new Promise(function(resolve, reject) {
            glob(path, options, function(error, files) {
                if (error) {
                    return reject(error);
                }

                resolve(files);
            });
        });
    };

    read = function(entry) {
        return new Promise(function(resolve, reject) {
            readFile(entry.file, function(error, buffer) {
                if (error) {
                    return reject(error);
                }

                entry.buffer = buffer;

                resolve(entry);
            });
        });
    };

    module.exports = internals;
}();