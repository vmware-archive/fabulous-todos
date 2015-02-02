var fab = require('fabulous');
var Document = require('fabulous/Document');
var LocalStorage = require('fabulous/data/LocalStorage');
var History = require('fabulous/data/History');

var TodosController = require('./TodosController');

exports.main = fab.runAt(todosApp, document.body);

function todosApp(node, context) {
	context.controller = new TodosController([]);
	context.history = new History();

	Document.sync([
		new LocalStorage('todos'),
		Document.fromProperty('todos', context.controller),
		context.history
	]);
}
