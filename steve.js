/** @module steve */

var bodyParser = require("body-parser")
var express = require("express")
var yaml = require('js-yaml');
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;


// Configure express app
var app = express();
app.use(bodyParser.json());

// Configure repos
config = yaml.safeLoad(fs.readFileSync(__dirname + '/conf/steve.yaml', 'utf-8'));
console.log(config);

app.post("/steve/", function(req, res) {

	// Diagnostics - Print out the request body
	console.log(req.body);

	// Route 
	var repo = config[req.body.repository.name];
	console.log(req.body.repository.name);
	var cmd = 'pushd ' + repo.path;
    if(repo.method == 'puppet') {
		cmd += ' && puppet agent --no-daemonize --one-time';
	} else if(repo.method == 'manual') {
		var branch = repo.branch ? repo.branch : 'master'
		cmd += ' && git checkout ' + branch
		cmd += ' && git pull';
	} else {
		console.log("Not a suitable update method: " + repo.method + "\nCheck configuration file.");
		return;
	}

	console.log("cmd: " + cmd);

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
