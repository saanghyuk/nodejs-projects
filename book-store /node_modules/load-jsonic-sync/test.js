"use strict";
var test = require('tap').test;
var loadJsonicSync = require('./');
var path = require('path');

test('loads fine', function (t) {
    t.deepEqual(loadJsonicSync(path.resolve(__dirname, 'test-good.json')), {"Hello": "World"});
    t.end();
});

test('parse error', function (t) {
    try {
        loadJsonicSync(path.resolve(__dirname, 'test-bad.json'));
        t.fail();
    } catch (e) {
        t.matches(e.message, /loading jsonic file '.*\/test-bad.json/);
        t.matches(e.cause().message, /pair rule failed at: /);
    }
    t.end();
});

test("file not found", function (t) {
    try {
        loadJsonicSync(path.resolve(__dirname, 'test-notfound.json'));
        t.fail();
    } catch (e) {
        t.matches(e.message, /loading jsonic file '.*\/test-notfound.json/);
        t.matches(e.cause(), { code: "ENOENT" });
    }
    t.end();
});
