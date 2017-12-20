'use strict';

var mongoose = require('mongoose');

//Book Schema
var categoryModel = function() {
	var categorySchema = mongoose.Schema({
		name: String,
	});

	return mongoose.model('Category', categorySchema);
};

module.exports = new categoryModel();
