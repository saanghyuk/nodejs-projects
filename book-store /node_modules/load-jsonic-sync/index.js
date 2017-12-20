"use strict";
var jsonic = require('jsonic-ometajs');
var fs = require('fs');
var VError = require('verror');

module.exports = function loadJsonicSync(file) {
    try {
        return jsonic.parse(fs.readFileSync(file, 'utf-8'));
    } catch (e) {
        throw new VError(e, "loading jsonic file '%s'", file);
    }
};
