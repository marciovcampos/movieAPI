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
