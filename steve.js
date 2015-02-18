/** @module steve */

// Includes
var bodyParser = require("body-parser");
var express = require("express");
var yaml = require('js-yaml');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var handler = require('./handler').handler;

// Configure express app
var app = express();
app.use(bodyParser.json());

// Load config
config = yaml.safeLoad(fs.readFileSync(__dirname + '/conf/steve.yaml', 'utf-8'));
// DEBUG: console.log(config);

function send_400(res, msg){
	console.log(msg);
	res.sendStatus(400);
}

// Handle all requests to /steve/
app.post("/steve/:handler", function(req, res) {
	// DEBUG: console.log(req.body);

	// Route
	var payload = handler(req.params.handler, req.body);
	if(!payload){
		send_400(res, "Received an invalid handler (" + req.params.handler + ") or payload.");
		return;
	}
	var repo = config[payload.name];
	if(!repo){
		send_400(res, "No repository by name of '" + payload.name + "' found.");
		return;
	}
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
		res.sendStatus(400);
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
		res.sendStatus(200);
	});

	
});

app.listen(8888);
