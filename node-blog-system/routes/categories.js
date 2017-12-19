var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category', function(req, res, next) {
	var posts = db.get('posts');

	posts.find({category: req.params.category}, {}, (err, posts)=>{
		res.render('index', {
			'title': req.params.category,
			'posts': posts
		});
	});
});

/* GET posts listing. */
router.get('/add', function(req, res, next) {
	res.render('addcategory', {
		title: 'Add Category'
	});
});

router.post('/add', function(req, res, next) {
	//Get Form values
	var name = req.body.name;

	//Form Validation
	req.checkBody('name', 'name field is required').notEmpty();

	//CHeck Validation Errors
	var errors = req.validationErrors();

	if (errors) {
		res.render('addcategory', {
			errors: errors
		});
	} else {
		var categories = db.get('categories');
		categories.insert(
			{
				name
			},
			(err, category) => {
				if (err) {
					res.send(err);
				} else {
					req.flash('success', 'Add Category');
					res.location('/');
					res.redirect('/');
				}
			}
		);
	}
});

module.exports = router;
