(function () {
    'use strict';

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

    angular
        .module('timeline')
        .directive('toTop', ['$window', toTopDirective]);
})();