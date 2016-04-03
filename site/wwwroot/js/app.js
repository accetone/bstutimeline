(function () {
    'use strict';

    angular.module('timeline', []);
})();
(function () {
    'use strict';

    var newsCtrl = function ($scope, $window, analyticsSvc, newsSvc, loadingSvc) {
        var self = this;

        self.type = undefined;

        self.init = function(type) {
            self.type = type;

            if (newsSvc.getData(type).length === 0) {
                newsSvc
                    .read(type)
                    .then(analyticsSvc.inject);
            }
        };

        self.getData = function() {
            return newsSvc.getData(self.type);
        };

        self.readMore = function () {
            if (loadingSvc.is()) return;

            newsSvc.read(self.type);

            analyticsSvc.click(self.type, 'Read More');
        };

        self.open = function(news) {
            $window.open(news.Url, '_blank');

            analyticsSvc.click(self.type, 'Read');
        };

        self.toggleSocials = function (news) {
            if (!news.socials) {
                news.socials = true;

                analyticsSvc.click(self.type, 'Open Share');
            } else {
                news.socials = false;

                analyticsSvc.click(self.type, 'Close Share');
            }
        };

        self.shareVk = function (news) {
            $window.open('http://vk.com/share.php?url=' + news.Url, '_blank');

            analyticsSvc.click(self.type, 'Share with VK');
        };

        self.shareTw = function (news) {
            $window.open('https://twitter.com/intent/tweet?text=' + news.Title + '&url=' + news.Url + '&via=bstutimeline', '_blank');

            analyticsSvc.click(self.type, 'Share with Twitter');
        };

        self.shareFb = function (news) {
            $window.open('http://www.facebook.com/sharer/sharer.php?u=' + news.Url, '_blank');

            analyticsSvc.click(self.type, 'Share with FB');
        };

        $scope.news = {
            init: self.init,
            getData: self.getData,
            readMore: self.readMore,
            open: self.open,
            toggleSocials: self.toggleSocials,
            share: {
                vk: self.shareVk,
                tw: self.shareTw,
                fb: self.shareFb
            }
        };
    };

    angular
        .module('timeline')
        .controller('NewsCtrl', ['$scope', '$window', 'AnalyticsSvc', 'NewsSvc', 'LoadingSvc', newsCtrl]);
})();
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
(function () {
    'use strict';

    var toTopDirective = function ($window) {
        var link = function (scope, element, attrs) {
            var showAfter = parseInt(attrs['showAfter']);
            var stickOn = parseInt(attrs['stickOn']);

            if (!showAfter) showAfter = 450;
            if (!stickOn) stickOn = 180;

            element.addClass('hidden');

            angular.element($window).on('scroll', function () {
                var scrollLeft = $window.document.body.scrollHeight - $window.document.body.scrollTop - $window.document.body.clientHeight;

                if (scrollLeft <= stickOn) {
                    element.addClass('stick');
                } else {
                    element.removeClass('stick');
                }

                if ($window.document.body.scrollTop >= showAfter) {
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

    angular
        .module('timeline')
        .directive('toTop', ['$window', toTopDirective]);
})();
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

			return $http
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

    angular
        .module('timeline')
        .factory('TypesSvc', ['AnalyticsSvc', typesSvc]);
})();