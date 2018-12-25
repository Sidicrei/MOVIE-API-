require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var base64 = require('file-base64');

var UserCtrl = {};
module.exports = UserCtrl;

//GET /user/:email - pegar um usuario usando o email informado
UserCtrl.readFromEmail = function(email, callback){
  var sql = 'select id, email, fbToken, name, photo_url FROM User WHERE email = ?';
  var params = [email];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.error(400));
      return;
    }
    
    callback(response.result(200, rows[0]));
  });
};


//POST /User - insere um novo usuario
UserCtrl.insert = function(params, callback){  
  var sql = 'INSERT INTO User(email, name) VALUES(?,?)';
  var params = [params.email, params.name];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    var id = rows.insertId;
    UserCtrl.readFromID(id, callback);
  });
};



