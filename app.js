var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('view engine', 'ejs');

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 3000;

app.listen( port, function() {
	'use strict';
	console.log( 'Listening on port ' + port );
} );

//midleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/', function (req, res) {
	res.send('server is running!', 200);
});




