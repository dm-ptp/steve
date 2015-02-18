// This module provides switching based on the URL of the incoming
// request. Current supported formats are github webhooks and manual
// curls.

function handler(handler, body){
	var payload = {}
	if(handler == 'github'){
		payload.name = body.repository.name;
		return payload
	}
	if(handler == 'manual'){
		console.log("body.repository: " + body.repository)
		payload.name = body.repository;
		return payload
	}
	// Insert additional routing formats here
	
	// Fallback
	console.log("Invalid handler: " + handler);
}

exports.handler = handler;
