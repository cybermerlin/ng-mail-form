/**
 * позволяет форматировать строку по маске:
 *  "Hello world {0}th and {1}.".format(23, 'some body')
 * @method format
 * @member String
 */
if (!String.prototype.format) {
	String.prototype.format = function (format) {
		var a = arguments;
		return this.replace(/\{(\d+)\}/g, function (m, i) {
			return a[i];
		});
	}
}

/**
 * @class ServerJS.tools
 */
module.exports = {
	/**
	 * генерация случайного числа в указанных пределах с заданой точностью
	 * @param {Number} min
	 * @param {Number} max
	 * @param {Number} [precision=0]
	 * @return {Number}
	 */
	getRndInt: function (min, max, precision) {
		precision = !precision ? 0 : precision;
		var res = Math.random() * (max - min) + min;
		return Math.min(parseFloat(res.toFixed(precision)), max)
	},
	/**
	 * дополнение нулями и возврат строкой
	 * @param {Number} int
	 * @param {String} [str='000000']
	 * @return {string}
	 */
	adjunct: function (int,str) {
		str = str || '000000';
		return (str + int.toString()).substr(-str.length)
	}

};
