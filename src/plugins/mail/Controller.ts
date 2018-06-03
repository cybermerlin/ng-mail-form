import ViewModel from "./ViewModel";
import DataModel from "./DataModel";


/**
 * @class Core.plugins.mail.Controller
 */
export default class Controller {
	ViewModel = ViewModel;

	mail;

	constructor(cfg: any = {}) {
		console.info('Controller', arguments);
		this.mail = new DataModel();
		new this.ViewModel({
			scope: cfg.scope,
			el: cfg.el
		});
	}
}
