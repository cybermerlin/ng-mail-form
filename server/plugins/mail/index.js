(function() {
	'use strict';
	var fs = require("fs"),
			tools = require('../utils'),
			br = require('../baseResponses');

	/**
	 * 
	 * @class ServerJS.Mail
	 */
	var Mail = {
		/**
		 * для работы с одиночными записями
		 * @param response
		 * @param request
		 * @param {String} id идентификатор запрашиваемого объекта
		 */
		getset: function(response, request, id) {
			console.log("Request handler 'mail.getset()' was called.");

			var files = {
				'175': './data/plugins/mail/175.json',
				'174': './data/plugins/mail/174.json'
			};
			id = id || '174';
			if ( !files.hasOwnProperty(String(id)) ) {
				id = tools.getRndInt(174, 175).toString();
			}
			console.log(id);
			var _p = files[id];

			fs.access(_p, fs.F_OK, function(er) {
				if ( !er ) {
					switch (request.method) {
						case 'PUT':
							br._200();
							break;
						case 'DELETE':
							br._200();
							break;
						case 'GET':
							fs.readFile(_p, "binary", function(error, file) {
								if ( error ) {
									br._500("Ошибка чтения файла." + _p);
								} else {
									response.writeHead(200, {"Content-Type": "application/json"});
									response.write(file, "binary");
									response.end();
								}
							});
							break;
					}
				} else {
					br._500("Файл не найден.");
				}
			});
		},

		/**
		 * get list of sendings
		 * @param response
		 * @param request
		 * @param {String} id
		 */
		'sendings': function(response, request, id) {
			console.log("Request handler 'sendings' was called.");

			var _p = "./data/plugins/mail/sendings.json";

			fs.access(_p, fs.F_OK, function(er) {
						if ( !er ) {
							fs.readFile(_p, "binary", function(error, file) {
								if ( error ) {
									br._500("Ошибка чтения файла." + _p);
								} else {
									response.writeHead(200, {"Content-Type": "application/json"});
									response.write(file, "binary");
									response.end();
								}
							});
						} else {
							response.writeHead(500, {"Content-Type": "application/json"});
							var json = JSON.stringify({"content": {"error": "Файл не найден.", "debug": er}});
							response.end(json);
						}
					}
			);
		}
	};

	module.exports = Mail;
})();
