(function () {
	'use strict';

	var rootCtrl = function ($scope, typesSvc, loadingSvc, newsSvc) {
	    $scope.types = typesSvc;

	    /*$scope.showSpinner = function () {
	        return loadingSvc.is()
                && ((feedSvc.data.length === 0 && typesSvc.isActive('feed')) || (upcomingSvc.data.length === 0 && typesSvc.isActive('upcoming')));
	    };

	    $scope.showSpinnerSmall = function () {
	        return loadingSvc.is()
                && feedSvc.data.length > 0;
	    };*/
	};

    angular
        .module('timeline')
        .controller('RootCtrl', ['$scope', 'TypesSvc', 'LoadingSvc', 'NewsSvc', rootCtrl]);
})();