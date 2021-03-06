import {Config, Module, Run} from "./lib/angular-decorators/index";

import MailEditorComponent from "./plugins/mail/angular/component/Editor";
import MailPage from "./pages/mail/angular/index";
import PostalCodeValidator from "./plugins/mail/angular/component/PostalCodeValidator";


@Module({
	name: "xxx",
	imports: ["ui.router"],
	declarations: [
		MailEditorComponent,
		MailPage,
		PostalCodeValidator
	],
	boot: MailPage
})
export default class XXX {
	@Config()
	public config() {
	}

	@Run()
	public run() {
	}
}
