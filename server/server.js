(function () {
	console.log('define server.js');

	var http = require("http"),
			url = require("url");

	/**
	 * @class ServerJS
	 */
	var ServerJS = {
		baseResponses: require('./baseResponses'),
		
		/**
		 * start ServerJS
		 * @param route
		 * @param handle
		 */
		start: function (route, handle) {
			function onRequest(request, response) {
				var pathname = request.url; // url.parse(request.url).pathname;
				console.log("Request for " + pathname + " received.");
				route(handle, pathname, response, request);
			}

			http.createServer(onRequest).listen(443);
			console.log("Server has started.");
		}
	};

	module.exports = ServerJS;
})();
