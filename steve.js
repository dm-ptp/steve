/** @module steve */

// Includes
var bodyParser = require("body-parser");
var express = require("express");
var yaml = require('js-yaml');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var handleMe = require('handleMe');

// Configure express app
var app = express();
app.use(bodyParser.json());

// Load config
config = yaml.safeLoad(fs.readFileSync(__dirname + '/conf/steve.yaml', 'utf-8'));
console.log(config);

// Handle all requests to /steve/
app.post("/steve/", function(req, res) {

	// Diagnostics - Print out the request body
	console.log(req.body);

	// Route
	var repo_name = handleMe(req.url, req.body);
	console.log(repo_name);
	var repo = config[repo_name];
	console.log(repo);
	var cmd = 'pushd ' + repo.path;

	// Construct command string
	// TODO: put this in a separate repo command processor
    if(repo.method == 'puppet') {
		cmd += ' && puppet agent --no-daemonize --one-time';
	} else if(repo.method == 'manual') {
		var branch = repo.branch ? repo.branch : 'master'
		cmd += ' && git checkout ' + branch
		cmd += ' && git pull';
	} else {
		console.log(repo.method + " is not a suitable update method. Check configuration file.");
		return;
	}

	// DEBUG - wrap cmd in 'echo' so we don't muss with things locally
	cmd = 'echo "' + cmd + '"';
	console.log("cmd: " + cmd);

	// Execute command
	var child = exec(cmd, function(error, stdout, stderr) {
		sys.print("stdout: " + stdout);
		sys.print("stderr: " + stderr);
		sys.print("");
		if(error !== null) {
			console.log("exec error: " + error);
		}
	});

});

app.listen(8888);
