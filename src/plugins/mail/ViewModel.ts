import DataModel from "./DataModel";
import Core from "../../lib/core/index";


/**
 * @class Core.plugins.mail.ViewModel
 */
export default class ViewModel extends Core.view.Model {
	scope;
	el: HTMLElement;
	handlersMap = {
		'[type="submit"]': 'submit'
	};
	mail: DataModel;


	submit(e) {
		console.log("submitting...");
		this.mail.save();

		const self = e.data.self;
		if (!self.scope.mail.isDirty()) return false;
		self.scope.mail.save();
		self.scope.$digest();
		return false;
	}
}
