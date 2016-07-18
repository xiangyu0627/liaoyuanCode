'use strict';

var liaoyuanApp = angular.module('liaoyuanApp', []);

liaoyuanApp.controller('MainCtrl', ['$http', function ($http) {
    
    this.originalURL = '';
    this.shortURL = '';

    this.getShortURL = function () {
        this.shortURL = this.originalURL + 'fdss';
        this.originalURL = '';
    };

}]);