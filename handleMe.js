// This module provides switching based on the URL of the incoming
// request. Current supported formats are github webhooks and manual
// curls.
//
// TODO: Support for passing additional POST payload attributes upstream.
//

function handleMe(url, body){
	if(url.search('/steve/github/') == 0) {
		return body.repository.name;
	}
	if(url.search('/steve/manual/') == 0) {
		return body.repository;
	}
	// Insert additional routing formats here
}

exports.handleMe = handleMe;
