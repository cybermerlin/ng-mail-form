import {isObject} from "util";


export default class Controller {
	view;
	ViewModel;

	constructor(cfg: any = {}) {
		cfg = cfg || {};
		Object.assign(this, cfg);

		let vm = {};
		if (cfg.ViewModel && isObject(cfg.ViewModel)) {
			Object.assign(vm, {
						el: cfg.el,
						scope: cfg.scope,
						helpers: cfg.helpers
					},
					cfg.ViewModel);
		} else {
			Object.assign(vm, {
				el: cfg.el,
				scope: cfg.scope,
				helpers: cfg.helpers
			})
		}
		this.ViewModel = new this.ViewModel(vm);
	}
};
