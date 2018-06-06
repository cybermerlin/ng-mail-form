import {validation as checkPostalCode} from "../../../../lib/mail-track-code";
import {Directive} from "../../../../lib/angular-decorators/index";
import {IDirective} from "angular";


@Directive({
	name: "postalCodeValidator"
})
export default class PostalCodeValidator {
	require = "ngModel";
	restrict = "A";

	link(scope, element, attr, mCtrl) {
		function validator(value) {
			console.log(checkPostalCode(value));
			if (checkPostalCode(value)) {
				mCtrl.$setValidity("code", true);
			} else {
				mCtrl.$setValidity("code", false);
			}
			return value;
		}

		mCtrl.$parsers.push(validator);
	}
}
