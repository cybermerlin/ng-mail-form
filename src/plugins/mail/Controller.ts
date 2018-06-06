import ViewModel from "./ViewModel";
import DataModel from "./DataModel";


/**
 * @class Core.plugins.mail.Controller
 */
export default class Controller {
	ViewModel: ViewModel;

	//region data models
	mail: DataModel;

	//endregion


	constructor(cfg: any = {}) {
		console.info("Controller", arguments);
		this.mail = new DataModel();
	}

	destructor() {

	}

	onReady() {
		this.ViewModel = new ViewModel();
		this.ViewModel.scope = this;
		this.ViewModel.mail = this.mail;
		document.querySelector("[type=\"submit\"]")
				.addEventListener("click", this.ViewModel.submit.bind(this.ViewModel));
	}

	getLabel(text: String): String {
		let result: String = "";
		switch (text) {
			case "code":
				result = "ШПИ";
				break;
			case "index":
				result = "index";
				break;
			default:
				result = text;
		}
		return result;
	}
}
