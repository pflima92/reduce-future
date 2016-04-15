'use strict';

var 
	_ = require('underscore'),
	_parallel = require('node-parallel'),
	
	DEFAULT_OPTIONS = {
		assync : false,
		timeout : 30000
	};

function performParallel(timeout, elements, performed, fn, cb, errCb, context){
	
	var parallel = _parallel().timeout(timeout);
	
	_.each(elements, function(el){
		
		parallel.add(function(done){

			fn(el, context, done, function(err){
				context = new Fail(err);
				done(null);
			});
		});
	});
	parallel.done(function(err, results){

		if(context instanceof Fail){
			errCb(err);
			return;
		} 
		
		cb(context, results);
	});
	
}

function performMonolithic(elements, performed, fn, cb, errCb, context){
	
	if(elements.length === performed.length){
		cb(context);
		return;
	}
	
	for(var i = 0; i < elements.length; i++){
		var el = elements[i];
		if(_.contains(performed, i)){ continue;}
		performed.push(i);
		
		fn(el, context, function(rep) {
			performMonolithic(elements, performed, fn, cb,errCb, context);
		}, function(error){
			errCb(error);
		});
		break;
	}
}

class Fail{
	
	constructor(err){
		
		this.err = err;
	}
	
}

class CompletableFuture {

	/**
	 * CompletableFuture
	 * 
	 * @param {object} context
	 * @param {options} options
	 * 
	 * @api public
	 * */
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
	 * @api public
	 */
	addAll(array){ 
		
		Array.prototype.push.apply(this.elements, array)
		return this;
	}
	
	/**
	 * add
	 * 
	 * @param {object}
	 *            el, add element to array for perform future.
	 * @api public
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
	 * @api public
	 */
	next(fn){
		
		this.fn = fn;
		return this;
	}
	
	/**
	 * error
	 * 
	 * @param {function}
	 *            fn, used for error callbacks.
	 * @api public
	 */
	error(fn){
		
		this.errCb = fn;
		return this;
	}
	
	/**
	 * done
	 * 
	 * execute callback on final of iteration, on response
	 * 
	 * @param {function}
	 *            fn, callback function, used for callback on final of process.
	 * @api public
	 */
	done(fn){

		this.cb = fn;
		
		if(this.options.parallel){
			
			var timeout = this.options.timeout;
			performParallel(timeout, this.elements, [], this.fn, this.cb, this.errCb, this.context);
		}else{
			
			performMonolithic(this.elements, [], this.fn, this.cb, this.errCb, this.context);
		}
	}
}

module.exports = CompletableFuture;