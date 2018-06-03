import {Component} from "../../../../lib/angular-decorators/index";
import Controller from "../../../../plugins/mail/Controller";

@Component({
	name: "mailEditor",
	templateUrl: "../../plugins/mail/tpl/editor.html",
	bindings: {
		mail: "=?"
	}
})
export default class extends Controller {
};
