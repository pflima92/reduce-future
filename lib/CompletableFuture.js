'use strict';

var 
	_ = require('underscore'),
	_parallel = require('node-parallel'),
	
	DEFAULT_OPTIONS = {
		assync : false,
		timeout : 30000
	};

function performParallel(timeout, elements, performed, fn, cb, context){
	
	var parallel = _parallel().timeout(timeout);
	
	_.each(elements, function(el){
		
		parallel.add(function(done){

			fn(el, context, done);
		});
	});
	parallel.done(function(err, results){
		
		cb(context, results);
	});
	
}
function performMonolithic(elements, performed, fn, cb, context){
	
	if(elements.length === performed.length){
		cb(context);
		return;
	}
	
	_.each(elements, function(el, i){
		if(_.contains(performed, i)){ return;}
		performed.push(i);
		
		fn(el, context, function(rep) {
			performMonolithic(elements, performed, fn, cb, context);
		});
		return false;
	});
}

class CompletableFuture {

	constructor(context, options){

		this.context = context || {};
		this.options = options || DEFAULT_OPTIONS;
		
		this.elements = [];
		this.errCb = function(){};
		this.fn = function(){};
		this.cb = function(){};
	}

	/**
	 * addAll
	 * 
	 * @param {Array}
	 *            array, add iterate object.
	 * 
	 */
	addAll(array){ 
		
		this.elements = this.elements.concat(array);
		return this;
	}
	
	/**
	 * add
	 * 
	 * @param {object}
	 *            el, add element to array for perform future.
	 * 
	 */
	add(el){
		
		this.elements.push(el);
		return this;
	}
	
	/**
	 * next
	 * 
	 * @param {function}
	 *            fn, next function, used on each iteration of completable
	 *            future.
	 * 
	 */
	next(fn){
		
		this.fn = fn;
		return this;
	}
	
	/**
	 * done
	 * 
	 * execute callback on final of iteration, on response
	 * 
	 * @param {function}
	 *            fn, callback function, used for callback on final of process.
	 * 
	 */
	done(fn){

		this.cb = fn;
		
		if(this.options.parallel){
			
			var timeout = this.options.timeout;
			performParallel(timeout, this.elements, [], this.fn, this.cb, this.context);
		}else{
			
			performMonolithic(this.elements, [], this.fn, this.cb, this.context);
		}
	}
}

module.exports = CompletableFuture;