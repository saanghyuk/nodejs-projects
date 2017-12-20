'use strict';

module.exports = router => {
	router.get('/', (req, res) => {
		res.render('manage/index');
	});
	router.get('/books', (req, res) => {
		res.render('manage/books/index');
	});
	router.get('/categories', (req, res) => {
		res.render('manage/categories/index');
	});
};
