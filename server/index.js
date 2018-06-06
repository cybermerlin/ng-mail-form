console.log('start index.js');

var tools = require('./utils'),
		server = require("./server"),

		mail = require("./plugins/mail");

var handlers = {
	"/v1/mail/": mail
};


server.start(handlers);
