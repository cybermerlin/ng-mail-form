import {Component, State} from "../../../lib/angular-decorators/index";


@Component({
	name: "mail",
	templateUrl: '../../pages/mail/tpl/page.html'
})
@State({
	url: "/mail",
	params: {}
})
export default class MailPage {
}
