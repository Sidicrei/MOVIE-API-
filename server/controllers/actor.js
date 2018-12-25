require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var base64 = require('file-base64');

var ActorCtrl = {};
module.exports = ActorCtrl;

//GET /actor/:id - detalhes de um ator
ActorCtrl.readFromID = function(id, callback){
  var sql = 'select id, name, photo_url FROM Star WHERE is_actor = true AND id = ?';
  var params = [id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.error(400));
      return;
    }
    
    callback(response.result(200, rows[0]));
  });
};


//GET /actors - lista todos os atores
ActorCtrl.readAll = function(callback){
  
  var sql = 'select id, name, photo_url AS photoURL FROM Star WHERE is_actor = true';
  var params = null;
  
  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.error(400));
      return;
    }
    
    callback(response.result(200, rows));
  });
};


//POST /actor - insere um novo ator
ActorCtrl.insert = function(params, callback){
  var imageName = params.name.fileNameClean('.jpg');
  base64.decode(params.photo_url, './public/images/' + imageName, function(err, output) {
    console.log("success")
  });
  
  var sql = 'INSERT INTO Star(name, photo_url, is_actor, is_director) VALUES(?,?,?,?)';
  var params = [params.name, imageName, true, false];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    var id = rows.insertId;
    ActorCtrl.readFromID(id, callback);
  });
};


//PUT /actor - altera um ator
ActorCtrl.edit = function(id, params, callback){
  var imageName = params.name.fileNameClean('.jpg');
  base64.decode(params.photo_url, './public/images/' +  imageName, function(err, output) {
    console.log("success")
  });
  
  var sql = 'UPDATE Star SET name = ?, photo_url = ? WHERE id = ? AND is_actor = true';
  var params = [params.name, imageName, id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    ActorCtrl.readFromID(id, callback);
  });
};


//DELETE /actor - remove um ator
ActorCtrl.deleteFromID = function(id, callback){
  var sql = 'DELETE FROM Star WHERE id = ? AND is_actor = true';
  var params = [id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    callback(response.result(204));
  });
};