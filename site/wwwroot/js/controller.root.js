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
	        var category = typesSvc.active[0].toUpperCase() + typesSvc.active.substring(1);

	        analyticsSvc.click(category, 'Back to the top');
	    };

	    self.trackLink = function(place, element) {
	        analyticsSvc.click(place, element);
	    };

	    $scope.root = {
	        types: typesSvc,
	        showSpinner: self.showSpinner,
	        showSpinnerSmall: self.showSpinnerSmall,
	        toTopAnalytics: self.toTopAnalytics,
	        trackLink: self.trackLink
	    };
	};

    angular
        .module('timeline')
        .controller('RootCtrl', ['$scope', 'TypesSvc', 'LoadingSvc', 'NewsSvc', 'AnalyticsSvc', rootCtrl]);
})();