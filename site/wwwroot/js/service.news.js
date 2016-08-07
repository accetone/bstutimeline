(function () {
	'use strict';

	var newsSvc = function ($http, $q, loadingSvc) {
		var self = this;

		self.data = {};
		self.preloaded = {};
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

		    return $q(function (resolve, reject) {
		        var request;

		        if (self.preloaded[type] && self.preloaded[type][url]) {
		            if (self.preloaded[type][url].length) {
		                self.pushData(type, self.preloaded[type][url]);
		                resolve(self.preloaded[type][url]);
		                loadingSvc.end();

		                return;
		            }

		            request = self.preloaded[type][url];
		        } else {
		            request = $http.get(url);
		        }
                
		        request
                    .then(function (response) {
		                self.pushData(type, response.data);
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

		self.preread = function (type) {
		    if (!self.preloaded[type]) self.preloaded[type] = [];

		    var url = '/api/news/' + type + '?skip=' + self.data[type].length + '&take=' + self.limit;

		    self.preloaded[type][url] = $q(function (resolve, reject) {
		        $http
		            .get(url)
		            .then(function (response) {
		                self.preloaded[type][url] = response.data;
		                resolve(response);
		            })
		            .catch(function (response) {
		                reject(response);
		            });
		    });
		};

	    self.pushData = function(type, data) {
	        for (var i = 0; i < data.length; i++) {
	            self.data[type].push(data[i]);
	        }

	        if (data.length < self.limit) {
	            self.lastPortion[type] = true;
	        }
	    };

		return self;
	};

    angular
        .module('timeline')
        .factory('NewsSvc', ['$http', '$q', 'LoadingSvc', newsSvc]);
})();