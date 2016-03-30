(function () {
    'use strict';

    var loadingSvc = function () {
        var self = this;

        self.queue = [];

        self.is = function () {
            return self.queue.length !== 0;
        };

        self.begin = function () {
            self.queue.push(0);
        };

        self.end = function () {
            self.queue.pop();
        };

        return self;
    };

    angular
        .module('timeline')
        .factory('LoadingSvc', [loadingSvc]);
})();