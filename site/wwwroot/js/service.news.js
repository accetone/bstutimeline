(function () {
	'use strict';

	var newsSvc = function ($http, loadingSvc) {
		var self = this;

		self.data = {};

		self.getData = function (type) {
		    if (!self.data[type]) self.data[type] = [];

	        return self.data[type];
	    };

		self.read = function (type) {
			loadingSvc.begin();

			if (!self.data[type]) self.data[type] = [];

		    var url = '/api/news/' + type + '?skip=' + self.data[type].length;

			$http
                .get(url)
                .then(function (response) {
                	for (var i = 0; i < response.data.length; i++) {
                		self.data[type].push(response.data[i]);
                	}
                })
                .finally(function () {
                	loadingSvc.end();
                });
		};

		return self;
	};

    angular
        .module('timeline')
        .factory('NewsSvc', ['$http', 'LoadingSvc', newsSvc]);
})();