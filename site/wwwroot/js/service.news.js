(function () {
	'use strict';

	var newsSvc = function ($http, $q, loadingSvc) {
		var self = this;

		self.data = {};
	    self.lastPortion = {};
	    self.limit = 10;

		self.getData = function (type) {
		    if (!self.data[type]) self.data[type] = [];

	        return self.data[type];
		};

        self.isLastPortion = function(type) {
            return !!self.lastPortion[type];
        }

		self.read = function (type) {
			loadingSvc.begin();

			if (!self.data[type]) self.data[type] = [];

		    var url = '/api/news/' + type + '?skip=' + self.data[type].length + '&take=' + self.limit;

		    return $q(function(resolve, reject) {
		        $http
                .get(url)
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        self.data[type].push(response.data[i]);
                    }

                    if (response.data.length < self.limit) {
                        self.lastPortion[type] = true;
                    }

                    resolve(response.data);
                })
                .catch(function(response) {
		            reject(response);
		        })
                .finally(function () {
                    loadingSvc.end();
                });
		    });
		};

		return self;
	};

    angular
        .module('timeline')
        .factory('NewsSvc', ['$http', '$q', 'LoadingSvc', newsSvc]);
})();