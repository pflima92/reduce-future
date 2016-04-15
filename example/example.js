var _rf = require('../lib/reduce-future');

function getPersonService(id, cb, err) {

	// If id generated is GREATER that 500 call err callback
	if(id > 500){

		err('has id > 500');
		return;
	}

	// Execute callback of success
	cb({
		id : id,
		name : 'Person ' + id
	});
}


//Generate random id's
var ids = [];
for (var i = 0; i < 10; i++) {

	ids.push(Math.floor(Math.random() * 1000) + 1);
}

// Create CompletableFuture instance
// When call parallel() indicates that alghoritm is a parallel process
// When call reduce() indicates that alghoritm is a monolitich process
_rf.parallel()
	.addAll(ids) //Add all ids to be processed
	.next(function(el, context, next, fail) {
		
		//Define the each iteration flow
		
		//Call external services
		getPersonService(el, function(resp) {
			
			//Set the context populating response
			context[el] = resp;
			
			//Notify CompletableFuture that this call has executed with success
			next(context);
		}, function(error){

			//Indicates that reduce flow should be stopped
			fail(error);
		});
	}).error(function(error) {
		
		//Callback of error

		// if any getPersonService call fail will show: ==> has id > 500 message.
		console.error(error); 
		
	}).done(function(context) {
	
		//Success callback
		
		console.info(context);
		
		 /* ==> { '30': { id: 30, name: 'Person 30' },
			  '38': { id: 38, name: 'Person 38' },
			  '42': { id: 42, name: 'Person 42' },
			  '43': { id: 43, name: 'Person 43' },
			  '48': { id: 48, name: 'Person 48' },
			  '64': { id: 64, name: 'Person 64' },
			  '70': { id: 70, name: 'Person 70' },
			  '71': { id: 71, name: 'Person 71' },
			  '73': { id: 73, name: 'Person 73' },
			  '85': { id: 85, name: 'Person 85' } }*/
	});

