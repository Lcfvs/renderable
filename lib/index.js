/**
 * @author Lcf.vs
 * @license Copyright MIT 2016
 * @repo https://github.com/Lcfvs/renderable
 * @module lib
 */

void function() {
    'use strict';

    var path,
        internals,
        resolve,
        register,
        render,
        renderable,
        map,
        file;

    path = require('path');
    internals = require('./internals');

    resolve = Function.apply.bind(path.resolve, path);
    render = internals.render;
    register = internals.register;

    renderable = Object.create(null);

    /**
     * renderable.register(paths)
     * @desc Registers a resource to be fileBufferable
     * @param {array} paths
     *   @desc File paths or glob mask parts
     * @returns Promise<Array|Error>
     *
     * @example
     *   renderable.register([__dirname, '**', '*.js'])
     */
    renderable.register = function(paths) {
        return register(resolve(paths)).then(map);
    };

    /**
     * renderable.render(parser, paths)
     * @desc Renders a resource, using a parser
     * @param {function} parser
     * @param {array} paths
     *   @desc File paths
     * @returns Promise<null|Error>
     *
     * @example
     *   renderable.render(parser, [__dirname, 'index.js'])
     */
    renderable.render = function(parser, paths) {
        return render(parser, resolve(paths));
    };

    map = function(entries) {
        return entries.map(file);
    };

    file = function(entry) {
        return entry.file;
    };

    module.exports = renderable;
}();