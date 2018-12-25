var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//C:\Users\<matricula>\AppData\Roaming\npm\pm2 start app.js --watch
//1px base64: R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=

var port = process.env.PORT || 3000;

app.listen( port, function() {
	'use strict';
	console.log( 'Listening on port ' + port );
} );

//midleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//controllers
var usermovieCtrl = require('./server/controllers/usermovie.js')
var userCtrl = require('./server/controllers/user.js')
var actorCtrl = require('./server/controllers/actor.js')
var movieCtrl = require('./server/controllers/movie.js')
var directorCtrl = require('./server/controllers/director.js')


var autorizado = 0;


//router


app.get('/', function(req, res) {
	res.send('server is running!',200);
});

app.get('/movies', function(req, res) {
	movieCtrl.readAll(function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});


app.route('/movie/:id').get(function(req, res) {
	var id = req.params["id"];
	movieCtrl.readFromID(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});


app.delete('/movie/:id', function(req, res) {
	var id = req.params["id"];
	movieCtrl.deleteFromID(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.put('/movie/:id', function(req, res) {
	var id = req.params["id"];
	var body = req.body;
	movieCtrl.edit(id, body, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.post('/movie', function(req, res) {
	var body = req.body;
	movieCtrl.insert(body, function(resp){
		res.status(resp.statusCode).json(resp)
	});
});

app.get('/actors', function(req, res) {
	actorCtrl.readAll(function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/actor/:id', function(req, res) {
	var id = req.params["id"];
	actorCtrl.readFromID(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});


app.delete('/actor/:id', function(req, res) {
	var id = req.params["id"];
	actorCtrl.deleteFromID(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.put('/actor/:id', function(req, res) {
	var id = req.params["id"];
	var body = req.body;
	actorCtrl.edit(id, body, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.post('/actor', function(req, res) {
	var body = req.body;
	actorCtrl.insert(body, function(resp){
		res.status(resp.statusCode).json(resp)
	});
});

app.get('/directors', function(req, res) {
	directorCtrl.readAll(function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/director/:id', function(req, res) {
	var id = req.params["id"];
	directorCtrl.readFromID(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.post('/director', function(req, res) {
	var body = req.body;
	directorCtrl.insert(body, function(resp){
		res.status(resp.statusCode).json(resp)
	});
});

app.put('/director/:id', function(req, res) {
	var id = req.params["id"];
	var body = req.body;
	directorCtrl.edit(id, body, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});


app.delete('/director/:id', function(req, res) {
	var id = req.params["id"];
	directorCtrl.deleteFromID(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});


app.post('/auth/signin/fb', function (req, res) {
	var request = require("request");
	var fbURL = 'https://graph.facebook.com/me'; 
	var actions = '&fields=name,email,id,picture'; 
	var fbToken = req.body.fbToken; 
	var url = fbURL + '?access_token=' + fbToken + actions; 
	var options = { url:url, method:'GET', contentType: 'application/json'
};



request(options, function (error, response, body) {	   
	
	if (response.statusCode != 200) {
		res.status(response.statusCode).json({ 
			'statusCode':response.statusCode, 
			'result': 
			{ 'message':'NÃ£o foi possÃ­vel logar com o Facebook'               
		}             
	}) 
	res.status(400).send(req.body)         }     
	else{
		var body = response.body;
		
		var json= JSON.parse(body);
		
		
		var email = json.email;
		userCtrl.readFromEmail(email, function(resp) {
			if (resp.statusCode == 400){
				userCtrl.insert(json, function(resp){
					res.status(400).send(resp.json); 
				});
				
			}
			res.status(200).send(json); 
			
		});
		
	}
	
}); 
}); 

app.get('/user/:email', function(req, res) {
	var email = req.params["email"];
	userCtrl.readFromEmail(email, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});


app.post('/user', function(req, res) {
	var body = req.body;
	userCtrl.insert(body, function(resp){
		res.status(resp.statusCode).json(resp)
	});
});


app.get('/usermovie/:id', function(req, res) {
	var id = req.params["id"];
	usermovieCtrl.readFromID(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.post('/usermovie', function(req, res) {
	var body = req.body;
	usermovieCtrl.insert(body, function(resp){
		res.status(resp.statusCode).json(resp)
	});
});

app.put('/usermovie/:id', function(req, res) {
	var id = req.params["id"];
	var body = req.body;
	usermovieCtrl.edit(id, body, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/usermovie/statisitic/:id', function(req, res) {
	var id = req.params["id"];
	usermovieCtrl.readFromStastic(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.get('/usermovie/lista/:id', function(req, res) {
	var id = req.params["id"];
	usermovieCtrl.readFromLista(id, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});

app.delete('/usermovie/:id/lista/:id2', function(req, res) {
	var id = req.params["id"];
	var id2 = req.params["id2"];
	usermovieCtrl.deleteFromID(id, id2, function(resp) {
		res.status(resp.statusCode).json(resp);
	});
});





