(function () {
    'use strict';

    var analyticsSvc = function ($timeout) {
        var self = this;

        self.counters = {};

        self.getCounter = function (key) {
            if (self.counters.hasOwnProperty(key)) {
                self.counters[key]++;
                return self.counters[key];
            } else {
                self.counters[key] = 1;
                return 1;
            }
        };

        self.click = function (category, label) {
            var counter = self.getCounter(category + label);

            ga('send', 'event', category, 'click', label + ' #' + counter);
        };

        return self;
    };

    angular
        .module('timeline')
        .factory('AnalyticsSvc', ['$timeout', analyticsSvc]);
})();