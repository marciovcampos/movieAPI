var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var path = require('path');
app.use(express.static(path.join(__dirname, '/public')));

var port = process.env.PORT || 3000;

app.listen( port, function() {
	'use strict';
	console.log( 'Listening on port ' + port );
} );

//midleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//controllers
var movieCtrl = require('./server/controllers/movie.js');
var actorCtrl = require('./server/controllers/actor.js');
var directorCtrl = require('./server/controllers/director.js');
var userCtrl = require('./server/controllers/user.js');

// Routes
app.get('/', function (req, res) {
	res.send('server is running!', 200);
});

//////////Movies//////////

//Get all Movies
app.get('/movies', function(req, res) {
	movieCtrl.readAll(function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
  });

//Get a movie
app.get('/movie/:id', function (req, res) {
	var id = req.params["id"];
	movieCtrl.readFromID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
})

//Delete an existing movie
app.delete('/movie/:id', function (req, res) {
	var id = req.params["id"];
	movieCtrl.deleteFromID(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

//Update an existing movie
app.put('/movie/:id', function (req, res) {
	var id = req.params["id"];
	var body = req.body;
	movieCtrl.edit(id, body, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

//Create a new movie
app.post('/movies', function (req, res) {
	var body = req.body;
	movieCtrl.insert(body, function (resp) {
		res.status(resp.statusCode).json(resp)
	});
});


//////////Actor//////////

//Get all Actors
app.get('/actors', function(req, res) {
	actorCtrl.readAll(function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
});

//Get a Actor
app.get('/actor/:id', function(req, res) {
	var id = req.params["id"];
	actorCtrl.readFromID(id, function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
});

//Delete a actor
app.delete('/actor/:id', function(req, res) {
	var id = req.params["id"];
	actorCtrl.deleteFromID(id, function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
});

//Update a actor
app.put('/actor/:id', function(req, res) {
	var id = req.params["id"];
	var body = req.body;
	actorCtrl.edit(id, body, function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
});


//Create a new actor
app.post('/actor', function(req, res) {
	var body = req.body;
	actorCtrl.insert(body, function(resp){
		res.status(resp.statusCode).json(resp)
	});
});


//////////Director//////////

//Get all Directors
app.get('/directors', function(req, res) {
	directorCtrl.readAll(function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
});

//Get a Director
app.get('/director/:id', function(req, res) {
	var id = req.params["id"];
	directorCtrl.readFromID(id, function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
});

//Delete a director
app.delete('/director/:id', function(req, res) {
	var id = req.params["id"];
	directorCtrl.deleteFromID(id, function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
});

//Update a director
app.put('/director/:id', function(req, res) {
	var id = req.params["id"];
	var body = req.body;
	directorCtrl.edit(id, body, function(resp) {
    	res.status(resp.statusCode).json(resp);
  	});
});


//Create a new director
app.post('/director', function(req, res) {
	var body = req.body;
	directorCtrl.insert(body, function(resp){
		res.status(resp.statusCode).json(resp)
	});
});


//////////Facebook//////////
//Login with Facebook Token
app.post('/auth/signin', function (req, res) {
	var fbToken = req.body.fbToken;
	userCtrl.signin(fbToken, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});


//////////User//////////

//Get User Statistics
app.get('/user/:id/statistic', function (req, res) {
	var id = req.params["id"];
	userCtrl.statistic(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

//Get an User List
app.get('/user/:id/list', function (req, res) {
	var id = req.params["id"];
	userCtrl.readAll(id, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

//Create a User List
app.post('/user/:id/list', function (req, res) {
	var userId = req.params["id"];
	var body = req.body;
	userCtrl.insert(userId, body, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});

//Delete an Movie on User list
app.delete('/user/:userid/list/:movieid', function (req, res) {
	var userId = req.params["userid"];
	var movieId = req.params["movieid"];
	userCtrl.deleteFromID(userId, movieId, function (resp) {
		res.status(resp.statusCode).json(resp);
	});
});
