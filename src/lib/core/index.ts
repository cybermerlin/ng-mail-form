import DataModel from "./DataModel";
import ViewModel from "./ViewModel";
import Controller from "./Controller";

let Core = {
	Controller: Controller,
	
	utils: {},
	plugins: {},
	data: {
		Model: DataModel
	},
	API: {},
	ui: {},
	view: {
		Model: ViewModel
	},
	/**
	 * frameworks
	 * @namespace
	 */
	fw: {
		/**
		 * angular fw
		 * @namespace
		 */
		a: {
			$q: null,
			$filter: null
		}
	}
};

Object.assign(window, {
	Core: Core
});
export default Core;
