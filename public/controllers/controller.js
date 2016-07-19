'use strict';

var liaoyuanApp = angular.module('liaoyuanApp', []);

liaoyuanApp.controller('MainCtrl', ['$http', '$window', function ($http, $window) {
    
    var scope = this;
    scope.originalURL = '';
    scope.shortURL = '';
    scope.urlForm = '';
    // send POST request with original URL to server and geta short URL back.
    scope.getShortURL = function () {
        $http( { 
            method: 'POST', 
            url: '/getShortURL',
            data: { originalURL: scope.originalURL }
        })
        .success(function (data, status) {
            // set the current short URL to data that got back from server  
            scope.shortURL = data.shortURL;
        })
        .error(function (data, status) {
            alert('Server error, please try again.');
        });
        
        // clear original URL field
        scope.originalURL = '';
        scope.urlForm.$setPristine();
    };

    scope.urlValid = function () {
        return scope.originalURL.length >= 5 || scope.urlForm.originalURL.$pristine;
    };

    scope.redirect = function () {
        $http( { 
            method: 'POST', 
            url: '/redirect',
            data: { shortURL: scope.shortURL }
        })
        .success(function (data, status) {
            // set the current short URL to data that got back from server  
            $window.open('http://' + data.originalURL);
        })
        .error(function (data, status) {
            alert('Server error, please try again.');
        });
    };

}]);