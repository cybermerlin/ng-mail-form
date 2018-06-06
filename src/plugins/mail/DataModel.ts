import api from "./API";
import {validation as checkPostalCode} from "../../lib/mail-track-code";
import * as angular from "angular";


/**
 * @class Core.plugins.mail.DataModel
 */
export default class {
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

	save() {
		if ( !this.isDirty() || !this.isValid() ) return Promise.reject('Not valid form');
		return angular['$http'].post('/mail', this.get())
				.then((resp) => {alert('saved'); return resp.content;})
				.catch((e) => {alert(e.status +''+ e.data);})
	}
	get() {
		return {code: '343', index: '3434'};
	}
	isDirty() {
		return true;
	}
	isValid() {
		return this.validate().length === 0;
	}
	validate() {
		const v = this.code;
		let result = [];
		if(!checkPostalCode(v)) result.push('Code is not correct');
		return result;
	}
}
