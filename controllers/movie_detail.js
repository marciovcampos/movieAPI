var config = require("../config.js")
var request = require("request");


var Request = {};
module.exports = Request;

Request.getMovie = function(id, callback){
    var url = config.movieAPI.baseURL + '/movie/' + id
    var options = {
	   url: url,
	   method: 'GET',
	   contentType: 'application/json'
	 };
	
	request(options, function (error, response, body) {
        var data = [];
        
        if (response.statusCode == 200) {
            data = JSON.parse(body).result
        }
        callback(data)
	});
}


module.exports = function(req, res) {
	var id = req.params.id;

	Request.getMovie(id, function(data){
        if (data == null) {
            res.render('notFound', {
                title : "This is not the page you are looking for"
            });
        }
        res.render('movie_detail', {
			title : data.title,
            movie : data,
            baseImgURL : config.movieAPI.baseImgURL
		});	
    });
};

	