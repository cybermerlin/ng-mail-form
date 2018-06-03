import {Config, Module, Run} from "./lib/angular-decorators/index";

import MailEditorComponent from "./plugins/mail/angular/component/Editor";
import MailPage from "./pages/mail/angular/index";


@Module({
	name: "xxx",
	imports: ["ui.router"],
	declarations: [
		MailEditorComponent
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
