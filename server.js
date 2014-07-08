var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var jiff = require('jiff');
var defaultHash = require('fabulous/data/defaultHash');

var data = {
	todos: []
};

var app = createApp();

app.route('/todos')
	.get(function(req, res) {
		var s = req.session;
		if(!s.shadow) {
			s.shadow = jiff.clone(data.todos);
		}
		res.json(s.shadow);
	})
	.patch(function(req, res) {
		var patch = req.body;
		var s = req.session;
		var shadow = s.shadow;

		if(shadow === void 0) {
			shadow = data.todos;
		}

		shadow = jiff.patch(patch, shadow);
		data.todos = jiff.patch(patch, data.todos);

		ensureIds(data.todos);

		var returnPatch = jiff.diff(shadow, data.todos, defaultHash);
		s.shadow = jiff.patch(returnPatch, shadow);

		res.json(returnPatch);
	});

app.listen(8080);

var id = data.todos.length+1;
function ensureIds(todos) {
	todos.forEach(function(todo) {
		if(todo.id === void 0) {
			todo.id = id++;
		}
	});
}

function createApp () {
	var app = express();
	app.use(express.static(__dirname));
	app.use(bodyParser.json());
	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: 'blah'
	}));
	return app;
}
