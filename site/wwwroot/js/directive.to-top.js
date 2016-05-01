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