// home
exports.home = require('../controllers/home.js')


// movie_detail
exports.movie_detail = require('../controllers/movie_detail.js')


// notFound
exports.notFound = function(req, res) {
	res.render('notFound', {
		title : "This is not the page you are looking for"
	});
};