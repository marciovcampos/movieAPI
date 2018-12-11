var express = require('express');
var request = require('request');
var app = express();

app.set('view engine', 'ejs');

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// Routes
var routes = require('./routes');

// home
app.get('/', routes.home);

// movie_detail
app.get('/movie/:id/detail', routes.movie_detail);

// notFound
app.get('*', routes.notFound);



app.listen(process.env.PORT || 4000);