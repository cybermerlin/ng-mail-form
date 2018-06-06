/**
 * source from github.com
 * HOW TO USE
 *
 * ```ts
 *  @Component({
 * 			name: "home",
 * 			template: `{{$ctrl.message}}`
 * 	})
 *  @State({
 * 			url: "/",
 * 			params: {}
 * 	})
 *  export class LoginPage {
 * 			public message: string = "Hello world!";
 * 			
 * 			public constructor(
 *          @Inject("$http") private _httpService: ng.IHttpService
 *          @Inject("$state") private _stateService: ng.ui.IStateService
 *      ) {
 * 			}
 *
 *      public goToTestPage(messageForTestPage: string) {
 * 			    this._stateService.go("test", { message: messageForTestPage });
 * 			}
 *  }
 * ```
 *
 * ```ts
 *  @Module({
 * 	    name: "app",
 * 	    imports: ["ui.router"],
 * 	    declarations: [
 * 	        LoginPage
 * 	    ],
 * 	    boot: LoginPage
 * 	})
 *  class MyModule {
 *      @Config()
 *      public config(
 *          @Inject("$provide") provide: any
 *      ) {
 * 	        // Config!
 * 	    }
 *
 *      @Run()
 *      public run(
 *          @Inject("$provide") provide: any
 *      ) {
 * 	        // Run!
 * 	    }
 *
 *      @Value("baseUrl")
 *      public baseUrl(): string {
 * 	        return "http://myserver/api/";
 * 	    }
 *  }
 * ```
 */
import * as ng from "angular";
import * as angular from "angular";


/**
 * @interface IModuleOptions
 */
export interface IModuleOptions {
	element?: (string | Element | Document);
	name: string;
	imports: string[];
	declarations: any[];
	boot: any;
}

// from https://github.com/angular/angular.js/blob/v1.3.10/src/Angular.js#L1447-L1453
const SNAKE_CASE_REGEXP = /[A-Z]/g;

function snakeCase(name, separator) {
	separator = separator || "_";

	return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
		return (pos ? separator : "") + letter.toLowerCase();
	});
}

export function Module(options: IModuleOptions) {
	return function (target: any) {
		let module: ng.IModule;
		target.$name = options.name;

		module = angular.module(options.name, options.imports || []);

		if (angular.isString(options.boot)) {
			module.config(["$urlRouterProvider", ($urlRouterProvider) => {
				$urlRouterProvider.otherwise(options.boot);
			}]);
		}
		else if (angular.isFunction(options.boot)) {
			module.config(["$urlRouterProvider", ($urlRouterProvider) => {
				$urlRouterProvider.otherwise(options.boot.$$stateOptions.url);
			}]);
		}

		Object.keys(target.prototype).forEach(function (element, index, array) {
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
							angular.extend(dependency.$$options || {},
									{controller: dependency}));

					if (dependency.$$stateOptions) {
						module.config(["$stateProvider", ($stateProvider: ng.ui.IStateProvider) => {
							$stateProvider.state(
									dependency.$$stateOptions.name
											? dependency.$$stateOptions.name
											: dependency.$$options.name,
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
					module.directive(dependency.$$options.name, function () {
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

export function Inject(dependency: string) {
	return function (target: any, key: string, index: number) {
		target = key ? target[key] : target;
		target.$inject = target.$inject || [];
		target.$inject[index] = dependency;
	};
}

export function State(options: any) {
	return function (target: any) {
		target.$$stateOptions = options;
	};
}

export function Component(options: any) {
	return function (target: any) {
		target.$$type = "component";
		target.$$options = options;
	};
}

export function Controller(options: any) {
	return function (target: any) {
		target.$$type = "controller";
		target.$$options = options;
	};
}

export function Filter(options: any) {
	return function (target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "filter";
		target.$$options = options;
	};
}

export function Provider(options: any) {
	return function (target: any) {
		target.$$type = "provider";
		target.$$options = options;
	};
}

export function Service(options: any) {
	return function (target: any) {
		target.$$type = "service";
		target.$$options = options;
	};
}

export function Directive(options?: any) {
	return function (target: any) {
		target.$$type = "directive";
		target.$$options = options;
	};
}

export function Config() {
	return function (target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "config";
		target.$$options = {};
	};
}

export function Run() {
	return function (target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "run";
		target.$$options = {};
	};
}

export function Constant(name: string) {
	return function (target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "constant";
		target.$$options = {
			name: name
		};
	};
}

export function Value(name: string) {
	return function (target: any, key: string) {
		target = key ? target[key] : target;
		target.$$type = "value";
		target.$$options = {
			name: name
		};
	};
}
