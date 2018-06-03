import Core from "../../lib/core/index";
import api from "./API";


export default class extends Core.data.Model {
	proxy = {
		type: "rest",
		url: api
	};

	/**
	 * ШПИ
	 * @type {string}
	 */
	code = "";
	/**
	 * вес в граммах
	 * @type {number}
	 */
	weight = 0;
	/**
	 * отправление (посылки)
	 */
	sending;
	/**
	 * Тип (посылка стандарт)
	 * @type {string}
	 */
	type = "";
	/**
	 * Индекс
	 * @type {string}
	 */
	index = "";
	/**
	 * адрес
	 * @type {string}
	 */
	address = "";
	/**
	 * получатель
	 * @type {string}
	 */
	recipient = "";
	/**
	 * cслуженое поле (индекс или адрес, если не известен индекс)
	 * @type {string}
	 */
	indexORaddress = "";

	_fields = [
		{
			name: "code",
			convert(v) {
				let result: String = '',
						r1 = '';
				// type postal sending
				const types = ['RA','RB','RC','RD','RE','RF','RG','RH']
				return result;
			}
		},
		"index", "address", "sending", "type", "recipient",
		{name: "weight", type: "float"}
	];
}
