import "../stand";
import Core from "./index";
import {isArray, isString} from "util";

export default class ViewModel {
	scope;
	element;

	/**
	 * Карта привязки обработчиков к HTML-элементам.
	 *
	 *    {
	 * 			'selector': 'имя метода из ViewModel',
	 * 			'selector': {
	 * 				'event': 'имя метода из ViewModel'
	 * 			}
	 * 		}
	 *
	 * @property {object} handlersMap
	 * @cfg {object} [handlersMap]
	 */
	handlersMap;

	constructor(cfg?: any) {
		Object.assign(this, cfg);
		this.element = this.element || document;
		this.scope = this.scope || this;

		this.control.defer(0, this);
	}

	/**
	 * проходит по указанных элементам HTML-формы и навешивает обработчики событий из
	 * {@link #handlersMap}
	 * @param {object} [handlersMap]
	 */
	control(handlersMap: Object = {}) {
		handlersMap = handlersMap || this.handlersMap;
		var self = this;

		for (var i in handlersMap) {
			if (!handlersMap.hasOwnProperty(i)) continue;

			// обработчик для scope переменной angular (к-ая может содержать переменные и генерить события)
			if (i == "scope") {
				var cr = 5,
						_run = function () {
							if (!--cr && !self.scope)
								throw new Error("Необходим scope во ViewModel для навешивания обработчиков на события.");
							if (!self.scope) {
								_run.defer(1e2, self);
								return;
							}

							if (isArray(handlersMap["scope"])) {
								var scopeA = handlersMap["scope"];
								for (var n = 0; n < scopeA.length; n++) {
									var mth = "on" + scopeA[n][0].toUpperCase() + scopeA[n].substring(1);
									self[mth] && self.scope.$on(n, self[mth]);
								}
							} else {
								var hms = handlersMap["scope"];
								for (var ihms in hms) {
									if (!hms.hasOwnProperty(ihms)) continue;
									var scopeA = hms[ihms];
									for (var n = 0; n < scopeA.length; n++) {
										var nameEvent = scopeA[n],
												mth = "on" + nameEvent[0].toUpperCase() + nameEvent.substring(1)
														+ ihms[0].toUpperCase() + ihms.substring(1);
										self[mth] && self.scope[ihms].on(nameEvent, self[mth].createDelegate(self));
									}
								}
							}
						};

				setTimeout(_run, 0);
				continue;
			}

			//region обработчики для HTMLElement-объектов
			if (isString(handlersMap[i])) {
				var objs = handlersMap[i].split("."),
						act = this,
						exs = true;
				if (objs.length > 1) {
					for (var iObjs = 0; iObjs < objs.length; iObjs++) {
						if (!act[objs[iObjs]]) {
							exs = false;
							break;
						}
						act = act[objs[iObjs]];
					}
					if (!exs) act = this[handlersMap[i]];
				} else
					act = this[handlersMap[i]];
				this.element.on("click", i, {self: self}, act)
			}
			else {
				for (var im in handlersMap[i]) {
					if (!handlersMap[i].hasOwnProperty(im)) continue;
					if (!this[handlersMap[i][im]])
						throw new Error(Core.fw.a.$filter("translate")("Отсутствует назначаемый обработчик события: {0}.{1}").format(i, im));
					this.element.on(im, i, {self: self}, this[handlersMap[i][im]])
				}
			}
			//endregion
		}
	}
}

Core.view.Model = ViewModel;
