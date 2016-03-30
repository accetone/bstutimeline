(function () {
	'use strict';

	var rootCtrl = function ($scope, typesSvc, loadingSvc, newsSvc) {
	    $scope.types = typesSvc;

	    $scope.showSpinner = function () {
	        return loadingSvc.is()
                && ((newsSvc.getData('Feed').length === 0 && typesSvc.isActive('feed')) || (newsSvc.getData('Upcoming').length === 0 && typesSvc.isActive('upcoming')));
	    };

	    $scope.showSpinnerSmall = function () {
	        return loadingSvc.is()
	            && ((newsSvc.getData('Feed').length > 0 && typesSvc.isActive('feed')) || (newsSvc.getData('Upcoming').length > 0 && typesSvc.isActive('upcoming')));
	    };
	};

    angular
        .module('timeline')
        .controller('RootCtrl', ['$scope', 'TypesSvc', 'LoadingSvc', 'NewsSvc', rootCtrl]);
})();