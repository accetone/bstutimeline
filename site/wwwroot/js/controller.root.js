(function () {
	'use strict';

	var rootCtrl = function ($scope, typesSvc, loadingSvc, newsSvc, analyticsSvc) {
	    var self = this;
        
	    self.showSpinner = function () {
	        return loadingSvc.is()
                && ((newsSvc.getData('Feed').length === 0 && typesSvc.isActive('feed')) || (newsSvc.getData('Upcoming').length === 0 && typesSvc.isActive('upcoming')));
	    };

	    self.showSpinnerSmall = function () {
	        return loadingSvc.is()
	            && ((newsSvc.getData('Feed').length > 0 && typesSvc.isActive('feed')) || (newsSvc.getData('Upcoming').length > 0 && typesSvc.isActive('upcoming')));
	    };

	    self.toTopAnalytics = function () {
	        console.log(3);

	        var category = typesSvc.active[0].toUpperCase() + typesSvc.active.substring(1);

	        analyticsSvc.click(category, 'Back to the top');
	    };

	    $scope.root = {
	        types: typesSvc,
	        showSpinner: self.showSpinner,
	        showSpinnerSmall: self.showSpinnerSmall,
	        toTopAnalytics: self.toTopAnalytics
	    };
	};

    angular
        .module('timeline')
        .controller('RootCtrl', ['$scope', 'TypesSvc', 'LoadingSvc', 'NewsSvc', 'AnalyticsSvc', rootCtrl]);
})();