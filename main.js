var fab = require('fabulous');
var rest = require('fabulous/rest');
var Document = require('fabulous/Document');
var History = require('fabulous/data/History');

var TodosController = require('./TodosController');

exports.main = fab.run(document.body, todosApp);

function todosApp(node, context) {
	var remote = rest.at('/todos');

	context.controller = new TodosController([]);
	context.history = new History();

	Document.sync([
		Document.fromPatchRemote(function(patch) {
			return remote.patch({ entity: patch });
		}, remote.get()),
		Document.fromProperty('todos', context.controller),
		context.history
	]);
}
