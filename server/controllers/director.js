require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var base64 = require('file-base64');

var DirectorCtrl = {};
module.exports = DirectorCtrl;

//GET /director/:id - detalhes de um ator
DirectorCtrl.readFromID = function(id, callback){
  var sql = 'select id, name, photo_url FROM Star WHERE is_director = true AND id = ?';
  var params = [id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.error(400));
      return;
    }
    
    callback(response.result(200, rows[0]));
  });
};


//GET /direcotrs - lista todos os diretores
DirectorCtrl.readAll = function(callback){
  
  var sql = 'select id, name, photo_url AS photoURL FROM Star WHERE is_director = true';
  var params = null;
  
  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.error(400));
      return;
    }
    
    callback(response.result(200, rows));
  });
};


//POST /director - insere um novo diretor
DirectorCtrl.insert = function(params, callback){
  var imageName = params.name.fileNameClean('.jpg');
  base64.decode(params.photo_url, './public/images/' + imageName, function(err, output) {
    console.log("success")
  });
  
  var sql = 'INSERT INTO Star(name, photo_url, is_actor, is_director) VALUES(?,?,?,?)';
  var params = [params.name, imageName, false, true];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    var id = rows.insertId;
    DirectorCtrl.readFromID(id, callback);
  });
};


//PUT /diretor - altera um diretor
DirectorCtrl.edit = function(id, params, callback){
  var imageName = params.name.fileNameClean('.jpg');
  base64.decode(params.photo_url, './public/images/' +  imageName, function(err, output) {
    console.log("success")
  });
  
  var sql = 'UPDATE Star SET name = ?, photo_url = ? WHERE id = ? AND is_director = true';
  var params = [params.name, imageName, id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    DirectorCtrl.readFromID(id, callback);
  });
};


//DELETE /director - remove um diretor
DirectorCtrl.deleteFromID = function(id, callback){
  var sql = 'DELETE FROM Star WHERE id = ? AND is_director = true';
  var params = [id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    callback(response.result(204));
  });
};