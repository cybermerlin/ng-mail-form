import * as angular from "angular";


angular.injector(["ng"]).invoke(["$http", function ($http) {
	angular['$http'] = $http;
}]);
