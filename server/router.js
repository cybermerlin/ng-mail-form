(function () {
	'use strict';
	
	var br = require('./baseResponses');

	module.exports.route = function (handles, pathname, response, request) {
		console.log("Requested " + pathname + " > isIsset: " + (typeof handles[pathname] === 'function'));
		
		br.response = response;

		var p = pathname.split('/'),
				url = '',
				keys = Object.keys(handles);
		for (var ik = 0; ik < keys.length; ik++) {
			var h = keys[ik],
					r = h.split('/'),
					id;
			for (var i = 0; i < r.length; i++) {
				if (r[i] === '*' && p[i] !== '~') {
					id = p[i];
					url = h;
				} else if (p[i] !== r[i]) {
					url = '';
					break;
				}
			}

			if (url.length) {
				handles[url](response, request, id);
				break;
			}
		}
		console.log('router has URL > ', url);

		if (!url) {
			if (typeof handles[pathname] === 'function') {
				handles[pathname](response, request);
			} else {
				console.log("No request handler found for " + pathname);
				response.writeHead(404, {"Content-Type": "application/json"});
				var json = JSON.stringify({"content": {"error": "Не найден обработчик для " + pathname}});
				response.end(json);
			}
		}
	};

})();
