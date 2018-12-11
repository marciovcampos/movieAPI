var config = require("../config.js")
var request = require("request");


var Request = {};
module.exports = Request;

Request.getMovies = function(callback){
    var url = config.movieAPI.baseURL + '/movies'
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
    Request.getMovies(function(data){
        res.render('home', {
            title : "Movie Show Time",
            movies : data,
            baseImgURL: config.movieAPI.baseImgURL
        });
    });
};

	