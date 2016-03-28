(function () {
    'use strict';

    var typesSvc = function (analyticsSvc) {
        var self = this;

        self.list = [
            { id: 'feed', text: 'Лента' },
            { id: 'actual', text: 'Актуальное' }
        ];

        self.active = self.list[0].id;

        self.isActive = function (type) {
            return self.active === type;
        };

        self.activate = function (type) {
            self.active = type;

            analyticsSvc.click('Go to', type);
        };

        return self;
    };

    var loadingSvc = function() {
        var self = this;

        self.queue = [];

        self.is = function() {
            return self.queue.length !== 0;
        };

        self.begin = function() {
            self.queue.push(0);
        };

        self.end = function() {
            self.queue.pop();
        };

        return self;
    };

    var rootCtrl = function ($scope, typesSvc, loadingSvc, feedSvc, actualSvc) {
        $scope.types = typesSvc;

        $scope.showSpinner = function() {
            return loadingSvc.is()
                && ((feedSvc.data.length === 0 && typesSvc.isActive('feed')) || (actualSvc.data.length === 0 && typesSvc.isActive('actual')));
        };

        $scope.showSpinnerSmall = function() {
            return loadingSvc.is()
                && feedSvc.data.length > 0;
        };
    };

    var feedSvc = function ($http, loadingSvc) {
        var self = this;

        self.data = [];

        self.read = function () {
            loadingSvc.begin();

            $http
                .get('/api/news/feed?skip=' + self.data.length)
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        self.data.push(response.data[i]);
                    }
                })
                .finally(function() {
                    loadingSvc.end();
                });
        };

        return self;
    };

    var feedCtrl = function ($scope, $window, analyticsSvc, feedSvc, loadingSvc) {
        $scope.news = feedSvc.data;

        $scope.readMore = function () {
            if (loadingSvc.is()) return;
            feedSvc.read();

            analyticsSvc.click('Feed', 'Read More');
        };

        $scope.open = function(url) {
            $window.open(url, '_blank');

            analyticsSvc.click('Feed', 'Read');
        };

        if (feedSvc.data.length === 0) feedSvc.read();
    };

    var actualSvc = function ($http, loadingSvc) {
        var self = this;

        self.data = [];

        self.read = function () {
            loadingSvc.begin();

            $http
                .get('/api/news/actual')
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        self.data.push(response.data[i]);
                    }
                })
                .finally(function () {
                    loadingSvc.end();
                });
        };

        return self;
    };

    var actualCtrl = function ($scope, $window, analyticsSvc, actualSvc, typesSvc) {
        $scope.news = actualSvc.data;

        $scope.goToFeed = function () {
            typesSvc.activate('feed');
            $window.scrollTo(0, 0);

            analyticsSvc.click('Actual', 'Go to feed');
        };

        $scope.open = function (url) {
            $window.open(url, '_blank');

            analyticsSvc.click('Actual', 'Read');
        };

        if (actualSvc.data.length === 0) actualSvc.read();
    };

    var toTopDirective = function ($window) {
        var link = function (scope, element, attrs) {
            var showAfter = parseInt(attrs['showAfter']);
            if (!showAfter) showAfter = 450;

            element.addClass('hidden');

            angular.element($window).on('scroll', function () {
                if ($window.document.body.scrollTop > showAfter) {
                    element.removeClass('hidden');
                } else {
                    element.addClass('hidden');
                }
            });

            element.on('click', function () {
                $window.scrollTo(0, 0);
            });
        };

        return {
            restrict: 'E',
            link: link
        };
    };

    var analyticsSvc = function ($timeout) {
        var self = this;

        self.counters = {};

        self.getCounter = function(key) {
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
        .module('timeline', [])
        .factory('TypesSvc', ['AnalyticsSvc', typesSvc])
        .factory('LoadingSvc', [loadingSvc])
        .controller('RootCtrl', ['$scope', 'TypesSvc', 'LoadingSvc', 'FeedSvc', 'ActualSvc', rootCtrl])

        .factory('FeedSvc', ['$http', 'LoadingSvc', feedSvc])
        .controller('FeedCtrl', ['$scope', '$window', 'AnalyticsSvc', 'FeedSvc', 'LoadingSvc', feedCtrl])

        .factory('ActualSvc', ['$http', 'LoadingSvc', actualSvc])
        .controller('ActualCtrl', ['$scope', '$window', 'AnalyticsSvc', 'ActualSvc', 'TypesSvc', actualCtrl])

        .directive('toTop', ['$window', toTopDirective])

        .factory('AnalyticsSvc', ['$timeout', analyticsSvc]);
})();