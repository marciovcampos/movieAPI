var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var base64 = require('file-base64');

var MovieCtrl = {};
module.exports = MovieCtrl;

//GET /movie/:id - details of a movie
MovieCtrl.readFromID = function(id, callback){
  var sql = `SELECT m.id, m.title, m.photo_url AS photoURL, released_date AS releasedAt, lenght, s.id AS starId, s.name, s.photo_url AS startPhotoURL
              FROM movie m
              LEFT JOIN starmovie sm ON sm.movie_id = m.id 
              LEFT JOIN star s ON sm.star_id = s.id 
              WHERE m.id = ?`;
  var params = [id];
  console.log("id = ", id);

  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    if (!rows || rows.length == 0){
      callback(response.result(404));
      return;
    }

    var actors = [];
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].starId) {
        actors.push({
          id: rows[i].starId,
          name: rows[i].name,
          photoURL: rows[i].startPhotoURL
        });
      }
    }

    var result = {
      id: rows[0].id,
      title: rows[0].title,
      photoURL: rows[0].photoURL,
      releasedAt: rows[0].releasedAt,
      lenght: rows[0].lenght,
      actors: actors
    };

    return callback(response.result(200, result));
  });
};


//GET /movies - list all movies
MovieCtrl.readAll = function(callback){

  var sql = `SELECT id, title, photo_url AS photoURL, released_date AS releasedAt, lenght FROM movie`;
  var params = null;

  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }

    if (!rows || rows.length == 0){
      callback(response.result(404));
      return;
    }

    return callback(response.result(200, rows));
  });
};

//PUT /movie/:id - update a movie
MovieCtrl.edit = function (id, params, callback) {
  var imageName = params.title.fileNameClean('.' + params.photo.extension);
  base64.decode(params.photo.data, './public/images/movie/' + imageName, function (err, output) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
  });

  var params = [params.title, imageName, params.lenght, params.releasedAt, id];
  var sql = 'UPDATE movie SET title = ?, photo_url = ?, lenght = ?, released_date = ? WHERE id = ?';

  database.query(sql, params, 'release', function (err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }

    MovieCtrl.readFromID(id, callback);
  });
};


//POST /movies - insert a new movie
MovieCtrl.insert = function (params, callback) {
  var imageName = params.title.fileNameClean('.' + params.photo.extension);
  base64.decode(params.photo.data, './public/images/movie/' + imageName, function (err, output) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
  });

  var params = [params.title, imageName, params.lenght, params.releasedAt];
  var sql = 'INSERT INTO movie (title, photo_url, lenght, released_date) VALUES (?,?,?,?)';

  database.query(sql, params, 'release', function (err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }

    var id = rows.insertId;
    MovieCtrl.readFromID(id, callback);
  });
};

//DELETE /movie/:id - remove a movie
MovieCtrl.deleteFromID = function (id, callback) {
  var params = [id];
  var sql = 'DELETE FROM movie WHERE id = ?';

  database.query(sql, params, 'release', function (err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }

    callback(response.result(200));
  });
};