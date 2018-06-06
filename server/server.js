(function() {
  'use strict';

  console.log('define server.js');

  var http = require("http"),
      path = require("path"),
      fs = require("fs"),

      localPath = __dirname,
      validExtensions = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png",
        ".woff": "application/font-woff",
        ".woff2": "application/font-woff2"
      },

      router = require("./router");


  /**
   * @class ServerJS
   */
  var ServerJS = {
    baseResponses: require('./baseResponses'),

    /**
     * start ServerJS
     * @param handle
     */
    start: function(handle) {
      function onRequest(req, res) {
        var pathname = req.url; // url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        var route = router.getRoute(handle, pathname, res, req);
        if ( route ) {
          route(res, req);
        }
        else {

          var filename = pathname,
              ext = path.extname(filename),
              mimeType = validExtensions[ext];

          if ( mimeType !== undefined ) {
            localPath += filename;

            fs.exists(localPath, function(exists) {
              if ( exists ) {
                console.log("Serving file: " + localPath);

                fs.readFile(localPath, function(err, contents) {
                  if ( !err ) {
                    //TODO: check like this.baseResponse
                    ServerJS.baseResponses._200(contents, mimeType, contents.length);
                  }
                  else {
                    ServerJS.baseResponses._500(err.stack);
                  }
                });
              }
              else {
                console.log("File not found: " + localPath);
                res.writeHead(404);
                res.end();
              }
            });
          }
        }

        console.log("No request handler found for " + pathname);
        res.writeHead(404, {"Content-Type": "application/json"});
        var json = JSON.stringify({"content": {"error": "Не найден обработчик для " + pathname}});
        res.end(json);
      }

      http.createServer(onRequest).listen(443);
      console.log("Server has started.");
    }
  };

  module.exports = ServerJS;
})();
