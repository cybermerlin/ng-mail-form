console.log('start index.js');

var tools = require('./utils'),
		
		br = require('./baseResponses'),
		server = require("./server"),
		router = require("./router"),

		mail = require("./plugins/mail");

var handle = {
	"/v1/mail/": mail
};


server.start(router.route, handle);
