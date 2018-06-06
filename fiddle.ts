/**
 * @interface IModuleOptions
 */
interface IModuleOptions {
	element ? : (string | Element | Document);
	name: string;
	imports: string[];
	declarations: any[];
	boot: any;
}

// from https://github.com/angular/angular.js/blob/v1.3.10/src/Angular.js#L1447-L1453
const SNAKE_CASE_REGEXP = /[A-Z]/g;

function snakeCase(name, separator) {
	separator = separator || "_";

	return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
		return (pos ? separator : "") + letter.toLowerCase();
	});
}

function Module(options: IModuleOptions) {
	return function(target: any) {
		let module: ng.IModule;
		target.$name = options.name;

		module = angular.module(options.name, options.imports || []);

		if (angular.isString(options.boot)) {
			module.config(["$urlRouterProvider", ($urlRouterProvider) => {
				$urlRouterProvider.otherwise(options.boot);
			}]);
		} else if (angular.isFunction(options.boot)) {
			module.config(["$urlRouterProvider", ($urlRouterProvider) => {
				$urlRouterProvider.otherwise(options.boot.$$stateOptions.url);
			}]);
		}

		Object.keys(target.prototype).forEach(function(element, index, array) {
			const property = target.prototype[element];
			if (typeof(property) === "function" && property.$$type) {
				switch (property.$$type) {
					case "config":
						module.config(property);
						break;
					case "run":
						module.config(property);
						break;
					case "constant":
						module.constant(property.$$options.name, property());
						break;
					case "value":
						module.value(property.$$options.name, property());
						break;
				}
			}

			delete property.$$options;
			delete property.$$type;
		});

		for (let index = 0; index < options.declarations.length; index++) {
			const dependency = options.declarations[index];

			switch (dependency.$$type) {
				case "component":
					module.component(dependency.$$options.name,
							angular.extend(dependency.$$options || {}, {
								controller: dependency
							}));

					if (dependency.$$stateOptions) {
						module.config(["$stateProvider", ($stateProvider: ng.ui.IStateProvider) => {
							$stateProvider.state(
									dependency.$$stateOptions.name ?
											dependency.$$stateOptions.name :
											dependency.$$options.name,
									angular.extend({
										template: "<" + snakeCase(dependency.$$options.name, "-") + " />"
									}, dependency.$$stateOptions));
						}]);
					}

					break;
				case "controller":
					module.controller(dependency.$$options.name, dependency);
					break;
				case "directive":
					module.directive(dependency.$$options.name, function() {
						return angular.extend(dependency.$$options || {}, dependency);
					});
					break;
				case "factory":
					module.factory(dependency.$$options.name, dependency);
					break;
				case "filter":
					module.filter(dependency.$$options.name, dependency);
					break;
				case "provider":
					module.provider(dependency.$$options.name, dependency);
					break;
				case "service":
					module.service(dependency.$$options.name, dependency);
					break;
			}

			// delete dependency.$$options;
			// delete dependency.$$type;
		}
	};
}

function Inject(dependency: string) {
	return function(target: any, key: string, index: number) {
		target = key ? target[key] : target;
		target.$inject = target.$inject || [];
		target.$inject[index] = dependency;
	};
}

function State(options: any) {
	return function(target: any) {
		target.$$stateOptions = options;
	};
}

function Component(options: any) {
	return function(target: any) {
		target.$$type = "component";
		target.$$options = options;
	};
}

function Controller(options: any) {
	return function(target: any) {
		target.$$type = "controller";
		target.$$options = options;
	};
}

function Filter(options: any) {
	return function(target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "filter";
		target.$$options = options;
	};
}

function Provider(options: any) {
	return function(target: any) {
		target.$$type = "provider";
		target.$$options = options;
	};
}

function Service(options: any) {
	return function(target: any) {
		target.$$type = "service";
		target.$$options = options;
	};
}

function Directive(options ? : ng.IDirective) {
	return function(target: any) {
		target.$$type = "directive";
		target.$$options = options;
	};
}

function Config() {
	return function(target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "config";
		target.$$options = {};
	};
}

function Run() {
	return function(target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "run";
		target.$$options = {};
	};
}

function Constant(name: string) {
	return function(target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "constant";
		target.$$options = {
			name: name
		};
	};
}

function Value(name: string) {
	return function(target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "value";
		target.$$options = {
			name: name
		};
	};
}

angular.injector(['ng']).invoke(['$http', function($http){
	angular.$http = $http;
}]);

function checkPostalCode(v):boolean {
	let result = 0;
	const serviceCode = {
		"AV-AZ": {
			reg: /A[V-Z]/,
			desc: "domestic, bilateral, multilateral use only, identifying RFID-tracked e-commerce items",
			codes: []
		},
		"BA-BZ": {reg: /B[A-Z]/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"CA-CZ": {
			reg: /C[A-Z]/,
			desc: "Parcel post; the use of CZ requires bilateral agreement. It is not required to use CV for insured parcels but if the service indicator CV is used, then it is recommended that it be used only on insured parcels.",
			ru: "международная посылка (более 2 кг)",
			codes: []
		},
		"DA-DZ": {reg: /D[A-Z]/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"EA-EZ": {
			reg: /E[A-Z]/,
			desc: "EMS; the use of EX–EZ requires bilateral agreement",
			ru: "экспресс-отправления (EMS)",
			codes: []
		},
		"GA": {reg: /GA/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"GD": {reg: /GD/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"HA-HZ": {
			reg: /H[A-Z]/,
			desc: "e-commerce parcels; the use of HX–HY requires multilateral agreement; the use of HZ requires bilateral agreement",
			codes: []
		},
		"JA-JZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"KA-KZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"LA-LZ": {
			reg: /L[A-Z]/,
			desc: "Letter post express; the use of LZ requires bilateral agreement",
			ru: "нерегистрируемое отправление (исключение LM, LZ)",
			codes: []
		},
		"MA-MZ": {reg: /M[A-Z]/, desc: "Letter post: M bags", codes: []},
		"NA-NZ": {reg: /N[A-Z]/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"PA-PZ": {reg: /P[A-Z]/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"QA-QZ": {reg: /Q[A-Z]/, desc: "Letter post: IBRS (International Business Reply Service)", codes: []},
		"RA-RZ": {
			reg: /R[A-Z]/,
			desc: "Letter post: registered, but not insured delivery. The use of RZ requires bilateral agreement.",
			ru: "регистрируемое отправление письменной корреспонденции (заказная карточка, письмо, бандероль, мелкий пакет (до 2 кг), мешок М)",
			codes: []
		},
		"SA-SZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"TA-TZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"UA-UZ": {
			reg: /U[A-Z]/,
			desc: "Letter post: items other than LA–LZ (Express), MA–MZ (M bags), QA–QM (IBRS), RA–RZ (registered), VA–VZ (insured), subject to customs control, i.e. bearing a CN 22 or CN 23",
			ru: "нерегистрируемые и неотслеживаемые отправления, но которые обязаны проходить таможенные процедуры",
			codes: []
		},
		"VA-VZ": {
			reg: /V[A-Z]/,
			desc: "Letter post insured; the use of VZ requires bilateral agreement",
			ru: "письмо с объявленной ценностью",
			codes: []
		},
		"WA-WZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"ZA-ZZ": {
			reg: /Z[A-Z]/,
			desc: "for domestic, bilateral, multilateral use only",
			ru: "SRM-отправление (от simplified registered mail), простой регистрируемый пакет",
			codes: []
		}
	};

	/**
	 * Первые восемь цифр (12345678) — уникальный номер отправления. Согласно правилам UPU-S10,
	 * почтовая служба должна назначать идентификаторы таким образом,
	 * чтобы номер не повторялся в течение 12 календарных месяцев
	 * (рекомендованный период — 24 календарных месяца или дольше).
	 * @type {number}
	 */
	let parcelNumber = v.substr(2, 8),
			/**
			 * Девятая цифра (9) — проверочный код, рассчитываемый по формуле[2];
			 * - каждая из первых восьми цифр номера умножается соответственно на 8, 6, 4, 2, 3, 5, 9, 7;
			 * - полученные значения суммируются;
			 * - результат делится на 11, чтобы получить остаток;
			 * - остаток вычитается из 11;
			 * - полученный результат является проверочным кодом, если он больше или равен 1, но меньше или равен 9;
			 * - если результат равен 10, то проверочный код равен 0;
			 * - если результат равен 11, то проверочный код равен 5.
			 * @type {number}
			 */
			crc = 0,
			/**
			 * Две буквы в конце (YY) — буквенный код страны-отправителя
			 * (например, US — США, GB — Великобритания, FR — Франция, RU — Россия, UA — Украина, CN — Китай,
			 * IL — Израиль и т. д.),
			 * или код почтовой службы (например, YP — Yanwen Logistics).
			 * Идентификатор внутреннего почтового отправления обычно состоит из 13 символов (внутрироссийский состоит из 14 цифр).
			 * @type {number}
			 */
			isoCountryCode = 0,

			regChecking = /^([A-Z]{2})(\d{8})(\d)([A-z]{2})$/;

	/*
        Внутрироссийский почтовый идентификатор содержит 14 цифр и состоит из четырёх смысловых частей:
            
            1. Первые 6 цифр — индекс предприятия связи места приёма.
            
            2. Седьмая и восьмая цифры — порядковый номер месяца печати штрихкодового идентификатора, начиная с 01.2000 (значение 01), это обеспечивает уникальность идентификатора в сети почтовой связи в течение, по крайней мере, восьми лет. При достижении номера 99 следующий месяц получает номер 01.
            
            3. Пять цифр с девятой по тринадцатую — уникальный номер почтового отправления, принятого в предприятии связи в текущем месяце.
            
            4. Последняя, четырнадцатая цифра — контрольный разряд, который вычисляется по следующему правилу:
            
            Сумма цифр в нечётных позициях умножается на 3;
            Суммируются все цифры в чётных позициях;
            Суммируются результаты действий пунктов 1 и 2;
            Из 10 вычитается остаток от деления суммы из пункта 3 на 10. Это число и есть контрольный разряд. (В случае, если результат пункта 4 кратен 10, то контрольный разряд равен 0).
         */

	// serviceCode
	for (let i in serviceCode) {
		if (!serviceCode.hasOwnProperty(i)) continue;
		result |= serviceCode[i].use !== false && serviceCode[i].reg.test(v[0] + v[1]);
		if (!!result) break;
	}
	result &= +regChecking.test(v);

	// parcelNumber + crc
	const pnS = [8, 6, 4, 2, 3, 5, 9, 7];
	crc = Array.from(parcelNumber).reduce(function(r: number, c: number, i) {return r + c * pnS[i]}, 0);
	crc = 11 - (crc - Math.floor(crc / 11) * 11);
	result &= +(v.substr(-3, 1) == ((crc >= 1 || crc <= 9)
			? crc
			: (
					crc === 10
							? 0
							: (crc === 11)? 5: crc
			)));

	//TODO: find list of country codes AND postal services
	// result &= v.substr(-2) in isoCountryCode
	return !!result;
}


class DataModel {
	proxy = {
		type: "rest",
		url: '---'
	};

	/**
	 * ШПИ
	 * @type {string}
	 */
	code = "";
	/**
	 * вес в граммах
	 * @type {number}
	 */
	weight = 0;
	/**
	 * отправление (посылки)
	 */
	sending;
	/**
	 * Тип (посылка стандарт)
	 * @type {string}
	 */
	type = "";
	/**
	 * Индекс
	 * @type {string}
	 */
	index = "";
	/**
	 * адрес
	 * @type {string}
	 */
	address = "";
	/**
	 * получатель
	 * @type {string}
	 */
	recipient = "";
	/**
	 * cслуженое поле (индекс или адрес, если не известен индекс)
	 * @type {string}
	 */
	indexORaddress = "";

	_fields = [{
		name: "code"
	},
		"index", "address", "sending", "type", "recipient",
		{
			name: "weight",
			type: "float"
		}
	];

	save() {
		if ( !this.isDirty() || !this.isValid() ) return Promise.reject('Not valid form');
		return angular.$http.post('/mail', this.get())
				.then((resp) => {alert('saved'); return resp.content;})
				.catch((e) => {alert(e.status +''+ e.data);})
	}
	get() {
		return {code: '343', index: '3434'};
	}
	isDirty() {
		return true;
	}
	isValid() {
		return this.validate().length === 0;
	}
	validate() {
		const v = this.code;
		let result = [];
		if(!checkPostalCode(v)) result.push('Code is not correct');
		return result;
	}
}

class ViewModel {
	scope;
	el: HTMLElement;
	handlersMap = {
		'[type="submit"]': 'submit'
	};
	mail: DataModel;


	submit(e) {
		const self = angular.element(e.target).scope().$ctrl.mail;
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

class Ctrl {
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
		document.querySelector('[type="submit"]').addEventListener('click', this.ViewModel.submit.bind(this.ViewModel));
	}

	getLabel(text: String): String {
		let result = '';
		switch(text){
			case 'code': result = 'ШПИ'; break;
			case 'index': result = 'index'; break;
			default result = text;
		}
		return result;
	}
}

class PostalCodeValidator {
	require= 'ngModel';
	restrict= 'A';
	link(scope, element, attr, mCtrl) {
		function validator(value) {
			console.log(checkPostalCode(value));
			if (checkPostalCode(value)) {
				mCtrl.$setValidity('code', true);
			} else {
				mCtrl.$setValidity('code', false);
			}
			return value;
		}
		mCtrl.$parsers.push(validator);
	}
}

@Component({
	name: "mailEditor",
	template: '<form class="$ctrl.mail-form">\
	<label>{{ $ctrl.getLabel(\'code\') }}\
		<input ng-model="$ctrl.mail.code" postal-code-validator\
					 aria-label="{{ $ctrl.getLabel(\'code\')  }}"/></label>\
	<label>{{ $ctrl.getLabel(\'index\')  }}\
		<input ng-model="$ctrl.mail.index"\
					 aria-label="{{ $ctrl.mail.getLabel(\'index\')  }}"/></label>\
	<label>{{ $ctrl.getLabel(\'address\') }}\
		<input ng-model="$ctrl.mail.address"\
					 aria-label="{{ $ctrl.getLabel(\'address\') }}"/></label>\
\
	<button ng-click="$ctrl.mail.save()">save</button>\
  <button type="submit" >save</button>\
</form>\
',
	bindings: {
		mail: "=?"
	}
})
class MailEditorComponent extends Ctrl {
	$onInit() {
		this.onReady();
	}

	$onDestroy() {
		this.destructor();
	}

	$onChanges(changes) {
		if (changes.mail) {

		}
	}
};


@Component({
	name: "mail",
	template: '<div class="mail page-body"> <mail-editor>not worked</mail-editor> </div>'
})
class Mail {}


@Module({
	name: "xxx",
	imports: [],
	declarations: [
		MailEditorComponent,
		Mail
	]
})
class XXX {
	@Config()
	public config() {}

	@Run()
	public run() {}
}
angular.module('xxx')
		.directive('postalCodeValidator', PostalCodeValidator);
