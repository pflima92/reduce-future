var _rf = require('../lib/reduce-future');

function person(id, cb) {

	cb({
		id : id,
		name : 'Person ' + id
	});
}

var ids = [];
for (var i = 0; i < 100; i++) {

	ids.push(Math.floor(Math.random() * 1000) + 1);
}

_rf.parallel().addAll(ids).next(function(el, context, next) {

	person(el, function(resp) {
		context[el] = resp;
		next(resp);
	})
}).done(function(context) {

	console.info(context);
});