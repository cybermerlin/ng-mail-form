(function () {
	'use strict';

	/**
	 * @class ServerJS.BaseResponses
	 * @singleton
	 */
	module.exports = {
		/**
		 * response. updating in router
		 */
		response: null,

		/**
		 * @method _500
		 * @param {String} msg
		 */
		_500: function (msg) {
			var d = {
				"status_text": "INTERNAL SERVER ERROR",
				"content": {
					"is_debug": false,
					"debug": "",
					"error": msg || "Во время обработки запроса произошла неизвестная ошибка"
				},
				"status": 500
			};
			this.response.writeHead(500, {"Content-Type": "application/json"});
			this.response.end(JSON.stringify(d));
		},
		/**
		 * @method _401
		 */
		_401: function () {
			var d = {
				"content": {
					"error": "Для доступа к запрашиваемому ресурсу требуется аутентификация",
					"debug": "",
					"is_debug": false,
					"auth_type": "VGATE"
				},
				"status": 401,
				"status_text": "UNAUTHORIZED"
			};
			this.response.writeHead(401, {"Content-Type": "application/json"});
			this.response.end(JSON.stringify(d));
		},
		/**
		 * @method _200
		 * @param {Object} d
		 */
		_200: function (d) {
			var rd = {"status": 200, "status_text": "OK", "content": null};
			if (d) {
				if (!d.hasOwnProperty('content')) rd['content'] = d || null;
				else {
					for (var i in d) {
						if (!d.hasOwnProperty(i)) continue;
						rd[i] = d[i];
					}
				}
			}
			this.response.writeHead(200, {"Content-Type": "application/json"});
			this.response.end(JSON.stringify(rd));
		}
	};
})();
