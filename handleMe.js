function handleMe(url, body){
	if(url.search('/steve/github/') == 0) {
		return body.repository.name;
	}
	if(url.search('/steve/jenkins/') == 0) {
		return body.repository.name;
	}
	// Insert additional routing formats here
}

exports.handleMe = handleMe;
