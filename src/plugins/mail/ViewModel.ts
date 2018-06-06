import DataModel from "./DataModel";


/**
 * @class Core.plugins.mail.ViewModel
 */
export default class ViewModel {
	scope;
	el: HTMLElement;
	handlersMap = {
		'[type="submit"]': 'submit'
	};
	mail: DataModel;


	submit(e) {
		// const self = angular.element(e.target).scope().$ctrl.mail;
		console.log("submitting...");
		this.mail.save()
				.then((d) => {/* close form + self.scope.$digest(); */})
				.catch((e) => {alert(typeof e === 'string' ? e : (e.status +''+ e.data));});
		/* OR
    if (!self.scope.mail.isDirty()) return false;
    self.scope.mail.save();
    */
		return false;
	}
}
