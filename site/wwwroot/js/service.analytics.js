(function () {
    'use strict';

    var analyticsSvc = function ($timeout) {
        var self = this;

        self.trackingCode = 'UA-62450305-3';
        self.counters = {};

        self.queue = [];
        self.attemp = 0;
        self.maxAttemps = 30;
        self.inited = false;
        self.injected = false;

        self.inject = function () {
            if (self.injected) return;

            self.injected = true;

          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
          })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        };

        self.checkAvailability = function () {
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

        self.checkAvailability();

        return self;
    };

    angular
        .module('timeline')
        .factory('AnalyticsSvc', ['$timeout', analyticsSvc]);
})();