(function () {
    'use strict';

    var analyticsSvc = function ($timeout) {
        var self = this;

        self.trackingCode = 'UA-62450305-3';
        self.counters = {};

        self.queue = [];
        self.attemp = 0;
        self.maxAttemps = 15;
        self.inited = false;

        self.checkAvailability = function() {
            if (typeof(ga) !== 'function') {
                self.attemp++;

                if (self.attemp > self.maxAttemps) return;

                $timeout(self.checkAvailability, 1000);
            } else {
                ga(self.init);
            }
        };

        self.init = function () {
            ga('create', self.trackingCode, 'auto');
            ga('send', 'pageview');

            self.inited = true;

            for (var i = 0; i < self.queue; i++) {
                ga('send', 'event', self.queue[i].category, self.queue[i].type, self.queue[i].label);
            }
        };

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

            label = label + ' #' + counter;

            if (self.inited) {
                ga('send', 'event', category, 'click', label);
            } else {
                self.queue.push({
                    type: 'click',
                    category: category,
                    label: label
                });
            }
        };

        self.init();

        return self;
    };

    angular
        .module('timeline')
        .factory('AnalyticsSvc', ['$timeout', analyticsSvc]);
})();