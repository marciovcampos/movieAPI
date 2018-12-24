require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var UserCtrl = {};
module.exports = UserCtrl;

//POST /auth/signin - Authentication with Facebook
UserCtrl.signin = function (fbToken, callback) {
    var request = require("request");
    
    var url = 'https://graph.facebook.com/me?access_token=' + fbToken + '&fields=name,email,id,picture';

    var options = {
        url: url,
        method: 'GET',
        encoding: null,
        contentType: 'application/json'
    }

    request(options, function (error, response, body) {

        if (error) {
            callback(response.error(400, error));
            return;
        }

        if (response.statusCode == 200) {
         
            var userFB = JSON.parse(body);

            var params = [userFB.email];
            var sql = 'SELECT id, name, email, fbToken, photo_url FROM user WHERE email = ?';

            database.query(sql, params, 'release', function (err, rows) {
                if (err) {
                    callback(response.error(400, err));
                    return;
                }

                if (!rows || rows.length == 0) {
                    UserCtrl.insert(fbToken, userFB, callback);
                } else {
                    UserCtrl.edit(rows[0].id, fbToken, userFB, callback);
                }
            });
        }
        else{
            callback(response.status(response.statusCode).json({ 'message': 'Authentication with Facebook Failed.' }));        
        }
    });
};

//Get an user
UserCtrl.readFromID = function (id, callback) {
    var params = [id];
    var sql = 'SELECT id, name, email, fbToken, photo_url AS photoURL FROM user WHERE id = ?';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400));
            return;
        }

        if (!rows || rows.length == 0) {
            callback(response.error(404));
            return;
        }

        callback(response.result(200, rows[0]));
    });
};

//Create a new user
UserCtrl.insert = function (fbToken, userFB, callback) {
    params = [userFB.name, fbToken, userFB.picture.data.url, userFB.email];
    sql = 'INSERT INTO user (name, fbToken, photo_url, email) VALUES (?,?,?,?)';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        UserCtrl.readFromID(rows.insertId, callback);
    });
};


//Update an user
UserCtrl.edit = function (id, fbToken, userFB, callback) {
    params = [userFB.name, fbToken, userFB.picture.data.url, userFB.email];
    sql = 'UPDATE user SET name = ?, fbToken = ?, photo_url = ? WHERE email = ?';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        UserCtrl.readFromID(id, callback);
    });
};


//GET /user/:id/statistic - Get User Statistics
UserCtrl.statistic = function (id, callback) {
    var params = [id];
    var sql = `SELECT u.id, u.id AS userId, SUM(m.lenght) AS length 
                FROM user u
                INNER JOIN usermovie um 
                    ON u.id = um.user_id 
                INNER JOIN movie m 
                    ON um.movie_id = m.id 
                WHERE u.id = ? AND um.watched = 1`;

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        if (!rows || rows.length == 0) {
            callback(response.error(404));
            return;
        }

        callback(response.result(200, rows[0]));
    });
};

//GET /user/:id/list - Get an User List
UserCtrl.readAll = function (id, callback) {
    var params = [id];
    var result = { id: id, userId: id };

    var sql = `SELECT m.id
                    FROM user u
                    INNER JOIN usermovie um
                        ON u.id = um.user_id 
                    INNER JOIN movie m
                        ON um.movie_id = m.id 
                    WHERE u.id = ? AND um.watched = 1`;

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        var watched = [];
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id) {                
                watched.push(rows[i].id);               
            }
        }

        result.watched = watched;

        sql = ` SELECT m.id
                    FROM user u
                    INNER JOIN usermovie um
                        ON u.id = um.user_id 
                    INNER JOIN movie m
                        ON um.movie_id = m.id 
                    WHERE u.id = ? AND um.toWatch = 1`;

        database.query(sql, params, 'release', function (err, rows) {
            if (err) {
                callback(response.error(400, err));
                return;
            }

            var toWatch = [];
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].id) {                
                    toWatch.push(rows[i].id);               
                }
            }

            result.toWatch = toWatch;

            sql = `SELECT m.id
                        FROM user u
                        INNER JOIN usermovie um
                            ON u.id = um.user_id 
                        INNER JOIN movie m
                            ON um.movie_id = m.id 
                        WHERE u.id = ? AND um.favorite = 1`;

            database.query(sql, params, 'release', function (err, rows) {
                if (err) {
                    callback(response.error(400, err));
                    return;
                }

                var favorite = [];
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].id) {                
                        favorite.push(rows[i].id);               
                    }
                }

                result.favorite = favorite;

                callback(response.result(200, result));
            });

        });

    });

};

//POST /user/:id/list - Create a User List
UserCtrl.insert = function (userId, params, callback) {
    var watched = 0;
    var toWatch = 0;
    var favorite = 0;

    for (var i = 0; i < params.list.length; i++) {
        switch (params.list[i]) {
            case 'watched':
                watched = 1;
                break;
            case 'toWatch':
                toWatch = 1;
                break;
            case 'favorite':
                favorite = 1;
                break;
            default:
                break;
        }
    }

    var paramsSQL = [userId, params.movieId];
    var sql = 'SELECT * FROM usermovie WHERE user_id = ? AND movie_id = ?';

    database.query(sql, paramsSQL, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        if (!rows || rows.length == 0) {
            paramsSQL = [userId, params.movieId, toWatch, watched, favorite, params.review];
            sql = ' INSERT INTO usermovie (user_id, movie_id, toWatch, watched, favorite, review) VALUES (?,?,?,?,?,?)';

            database.query(sql, paramsSQL, 'release', function (err, rows) {
                if (err) {
                    callback(response.error(400, err));
                    return;
                }

                UserCtrl.readAll(userId, callback);
            });

        } else {
            paramsSQL = [toWatch, watched, favorite, params.review, userId, params.movieId];
            sql = ' UPDATE usermovie SET toWatch = ?, watched = ?, favorite = ?, review = ? WHERE user_id = ? AND movie_id = ?';

            database.query(sql, paramsSQL, 'release', function (err, rows) {
                if (err) {
                    callback(response.error(400, err));
                    return;
                }

                UserCtrl.readAll(userId, callback);
            });
        }
    });
};

//DELETE /user/:userid/list/:movieid - Delete an Movie on User list
UserCtrl.deleteFromID = function (userId, movieId, callback) {
    var params = [userId, movieId];
    var sql = ' DELETE FROM usermovie WHERE user_id = ? AND movie_id = ? ';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        callback(response.result(200));
    });
};