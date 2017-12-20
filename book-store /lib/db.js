"use strict";

var mongoose = require("mongoose");

var db = function() {
    return {
        config: function(conf) {
            mongoose.connect("mongodb://localhost/sanghyuk-books");
            var db = mongoose.connection;
            db.on("error", console.error.bind(console, "Connection Error"));
            db.once("open", () => {
                console.log("DB Connection Open");
            });
        }
    };
};

module.exports = db();
