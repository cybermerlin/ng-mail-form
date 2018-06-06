(function() {
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
     * @param {String} msg
     */
    _500: function(msg) {
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

    _401: function() {
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
     * @param {Object} d the data for sending
     * @param {String} [mimeType]
     * @param {Number} [length]
     */
    _200: function(d, mimeType = '', length = 0) {
      var rd = {"status": 200, "status_text": "OK", "content": null};
      if ( d ) {
        if ( !d.hasOwnProperty('content') ) rd['content'] = d || null;
        else {
          for (var i in d) {
            if ( !d.hasOwnProperty(i) ) continue;
            rd[i] = d[i];
          }
        }
      }
      var headers = {
        "Content-Type": mimeType || "application/json"
      };
      if ( length ) headers["Content-Length"] = length;
      this.response.writeHead(200, headers);
      this.response.end(JSON.stringify(rd));
    }
  };
})();
