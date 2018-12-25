require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var base64 = require('file-base64');

var UserMovieCtrl = {};
module.exports = UserMovieCtrl;

//GET /actor/:id - detalhes de um ator
UserMovieCtrl.readFromID = function(id, callback){
  var sql = 'select id, toWatch, watched, favorite, review, user_id, movie_id FROM UserMovie WHERE id = ?';
  var params = [id];

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.error(400));
      return;
    }

    callback(response.result(200, rows[0]));
  });
};

//POST /actor - insere um novo ator
UserMovieCtrl.insert = function(params, callback){ 

  var sql = 'INSERT INTO UserMovie(toWatch, watched, favorite, review, user_id, movie_id) VALUES(?,?,?,?,?,?)';  
  var params = [params.toWatch,params.watched,params.favorite,params.review,params.user_id,params.movie_id];
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }    
    var id = rows.insertId;
    UserMovieCtrl.readFromID(id, callback);
  });
};



//PUT /mmovie - altera um filme
UserMovieCtrl.edit = function(id, params, callback){
 
  var sql = 'UPDATE UserMovie set toWatch = ?, watched = ?, favorite = ?, review = ?  WHERE id = ?';
  var params = [params.toWatch, params.watched, params.favorite, params.review, id];
  
  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    UserMovieCtrl.readFromID(id, callback);
  });
};

//GET /actor/:id - detalhes de um ator
UserMovieCtrl.readFromStastic = function(id, callback){
  var sql = 'SELECT  usermovie.id, usermovie.user_id,  sum(movie.lenght) length FROM movie, usermovie WHERE movie.id = usermovie.movie_id and  usermovie.user_id = ?';
  var params = [id];

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.error(400));
      return;
    }

    callback(response.result(200, rows[0]));
  });
};

//GET /actor/:id - detalhes de um ator
UserMovieCtrl.readFromLista = function(id, callback){
  var params = [id];
  var vr = params.id;
  var sql =  
             'Select DISTINCT(user_mov.user_id), '+ 
             '(Select DISTINCT(group_concat(concat_ws(" , ",usermovie.movie_id))) FROM usermovie  WHERE usermovie.toWatch = 1 and  usermovie.user_id = user_mov.user_id) toWatch, '+
             '(Select DISTINCT(group_concat(concat_ws(" , ",usermovie.movie_id))) FROM usermovie  WHERE usermovie.watched = 1 and  usermovie.user_id = user_mov.user_id) watched, '+
             '(Select DISTINCT(group_concat(concat_ws(" , ",usermovie.movie_id))) FROM usermovie  WHERE usermovie.favorite = 1 and  usermovie.user_id = user_mov.user_id) favorite '+
             'from usermovie user_mov where user_mov.user_id = ?';
  
  
  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.error(400));
      return;
    }

    callback(response.result(200, rows[0]));
  });
};

UserMovieCtrl.deleteFromID = function(id, id2, callback){
  var sql = 'DELETE FROM UserMovie WHERE user_id = ? and movie_id = ?';
  var params = [id, id2];

  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    callback(response.result(200));
  });
};
