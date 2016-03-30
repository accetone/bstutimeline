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