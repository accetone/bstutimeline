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
                    .then(analyticsSvc.inject)
                    .then(function () {
                        newsSvc.preread(type);
                    });
            }
        };

        self.getData = function() {
            return newsSvc.getData(self.type);
        };

        self.readMore = function () {
            if (loadingSvc.is()) return;

            newsSvc
                .read(self.type)
                .then(function () {
                    newsSvc.preread(self.type);
                });

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

        self.isLastPortion = function() {
            return newsSvc.isLastPortion(self.type);
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
            },
            isLastPortion: self.isLastPortion
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

    var toTopDirective = function ($window, $timeout) {
        var link = function (scope, element, attrs) {
            var showAfter = parseInt(attrs['showAfter']);
            var stickOn = parseInt(attrs['stickOn']);

            if (!showAfter) showAfter = 450;
            if (!stickOn) stickOn = 180;

            element.addClass('hidden');

            if ($window.document.body.clientWidth <= 1024) $timeout(onScrollMobile, 500); 
            angular.element($window).on('scroll', onScroll);

            element.on('click', onClick);

            function onScroll() {
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
            }

            function onScrollMobile() {
                onScroll();

                $timeout(onScrollMobile, 500);
            }

            function onClick() {
                $window.scrollTo(0, 0);
            }
        };

        return {
            restrict: 'E',
            link: link
        };
    };

    angular
        .module('timeline')
        .directive('toTop', ['$window', '$timeout', toTopDirective]);
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

	    self.text = {
            more: function() {
                return self.active === 'feed' ? 'Ещё новости' : 'Ещё события';
            },
            none: function() {
                return self.active === 'feed' ? 'Новостей больше нет' : 'Событий больше нет';
            }
	    };

	    return self;
	};

    angular
        .module('timeline')
        .factory('TypesSvc', ['AnalyticsSvc', typesSvc]);
})();