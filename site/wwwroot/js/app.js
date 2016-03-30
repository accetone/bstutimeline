(function () {
    'use strict';

    var typesSvc = function (analyticsSvc) {
        var self = this;

        self.list = [
            { id: 'feed', text: 'Лента' },
            { id: 'upcoming', text: 'Ближайшее' }
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

    var rootCtrl = function ($scope, typesSvc, loadingSvc, feedSvc, upcomingSvc) {
        $scope.types = typesSvc;

        $scope.showSpinner = function() {
            return loadingSvc.is()
                && ((feedSvc.data.length === 0 && typesSvc.isActive('feed')) || (upcomingSvc.data.length === 0 && typesSvc.isActive('upcoming')));
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

        $scope.open = function(news) {
            $window.open(news.Url, '_blank');

            analyticsSvc.click('Feed', 'Read');
        };

        $scope.toggleSocials = function (news) {
            if (!news.socials) {
                news.socials = true;

                analyticsSvc.click('Feed', 'Open Share');
            } else {
                news.socials = false;

                analyticsSvc.click('Feed', 'Close Share');
            }
        };

        $scope.shareVk = function (news) {
            $window.open('http://vk.com/share.php?url=' + news.Url, '_blank');

            analyticsSvc.click('Feed', 'Share with VK');
        };

        $scope.shareTw = function (news) {
            $window.open('https://twitter.com/intent/tweet?text=' + news.Title + '&url=' + news.Url + '&via=bstutimeline', '_blank');

            analyticsSvc.click('Feed', 'Share with Twitter');
        };

        $scope.shareFb = function (news) {
            $window.open('http://www.facebook.com/sharer/sharer.php?u=' + news.Url, '_blank');

            analyticsSvc.click('Feed', 'Share with FB');
        };

        if (feedSvc.data.length === 0) feedSvc.read();
    };

    var upcomingSvc = function ($http, loadingSvc) {
        var self = this;

        self.data = [];

        self.read = function () {
            loadingSvc.begin();

            $http
                .get('/api/news/upcoming?skip=' + self.data.length)
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

    var upcomingCtrl = function ($scope, $window, analyticsSvc, upcomingSvc, loadingSvc) {
        $scope.news = upcomingSvc.data;

        $scope.readMore = function () {
            if (loadingSvc.is()) return;
            upcomingSvc.read();

            analyticsSvc.click('Upcoming', 'Read More');
        };

        $scope.open = function (news) {
            $window.open(news.Url, '_blank');

            analyticsSvc.click('Upcoming', 'Read');
        };

        $scope.toggleSocials = function (news) {
            if (!news.socials) {
                news.socials = true;

                analyticsSvc.click('Upcoming', 'Open Share');
            } else {
                news.socials = false;

                analyticsSvc.click('Upcoming', 'Close Share');
            }
        };

        $scope.shareVk = function (news) {
            $window.open('http://vk.com/share.php?url=' + news.Url, '_blank');

            analyticsSvc.click('Upcoming', 'Share with VK');
        };

        $scope.shareTw = function (news) {
            $window.open('https://twitter.com/intent/tweet?text=' + news.Title + '&url=' + news.Url + '&via=bstutimeline', '_blank');

            analyticsSvc.click('Upcoming', 'Share with Twitter');
        };

        $scope.shareFb = function (news) {
            $window.open('http://www.facebook.com/sharer/sharer.php?u=' + news.Url, '_blank');

            analyticsSvc.click('Upcoming', 'Share with FB');
        };

        if (upcomingSvc.data.length === 0) upcomingSvc.read();
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
        .controller('RootCtrl', ['$scope', 'TypesSvc', 'LoadingSvc', 'FeedSvc', 'UpcomingSvc', rootCtrl])

        .factory('FeedSvc', ['$http', 'LoadingSvc', feedSvc])
        .controller('FeedCtrl', ['$scope', '$window', 'AnalyticsSvc', 'FeedSvc', 'LoadingSvc', feedCtrl])

        .factory('UpcomingSvc', ['$http', 'LoadingSvc', upcomingSvc])
        .controller('UpcomingCtrl', ['$scope', '$window', 'AnalyticsSvc', 'UpcomingSvc', 'LoadingSvc', upcomingCtrl])

        .directive('toTop', ['$window', toTopDirective])

        .factory('AnalyticsSvc', ['$timeout', analyticsSvc]);
})();