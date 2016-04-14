var CompletableFuture = require('./CompletableFuture');

function reduce(context) {

	return new CompletableFuture(context);
}

function parallel(context) {

	return new CompletableFuture(context, {
		parallel : true
	});
}

module.exports = {

	reduce : reduce,

	parallel : parallel,

	CompletableFuture : CompletableFuture,
};