# reduce-future

## Why?

Reduce boils down a list of values into a single values. With reduce-future, you will able to reduce one list that need execute async functions, joining the results on success callback.

## Installation

Via npm:

	npm install reduce-future
   

## Features

	* Reduce list of objects, executing async operations
	* Monolithic and Parallel methods
	* Timeout support.
	* Unified error handling.
	* No magic on finished callback, just one done function.

## Test on node

``` bash
$ git clone git@github.com:pflima92/reduce-future.git
$ cd reduce-future && npm install
```

## Example

```js
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

//  Use parallel() to parallel processing or reduce() for monolithic process

_rf.parallel().addAll(ids).next(function(el, context, next) {

	person(el, function(resp) {
		context[el] = resp;
		next(resp);
	})
}).done(function(context) {

	console.info(context);
});
```

## API

### reduce

Create new CompletabeFuture class with default options. 


### parallel

Create new CompletabeFuture class with parallel option marked with true.

### CompletableFuture

Class (ES6) responsible for manage reduce future features.

#### .add(Object)

Add element to CompletableFuture, can be called any times that is needed, return your own instance.

#### .addAll(Array)

Add array and concat at elements of CompletableFuture, can be called any times that is needed, return your own instance.

#### .next(Function)

Add function that will be called on each iteration of CompletableFuture execution

#### .done(Function)

Function that receive the callback parameter, responsible for join the results of interration

## License

	MIT





