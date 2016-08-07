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