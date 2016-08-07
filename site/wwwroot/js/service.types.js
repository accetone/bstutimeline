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