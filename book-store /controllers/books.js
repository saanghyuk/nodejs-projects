'use strict';

var Book=require('../models/bookModel');
var Category=require('../models/categoryModel');


module.exports = router => {
	// router.get('/', (req, res) => {
	// 	res.render('index');
	// });
	router.get('/details/:id', (req, res) => {
		Book.findOne({_id: req.params.id }, (err, book)=>{
			if(err){
				console.log(err);
			}
			var model={
				book: book
			};
            res.render('books/details', model);
		});


	});
};
