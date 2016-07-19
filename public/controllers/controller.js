'use strict';

var liaoyuanApp = angular.module('liaoyuanApp', []);

liaoyuanApp.controller('MainCtrl', ['$http', '$window', function ($http, $window) {
    
    var scope = this;
    scope.originalURL = '';
    scope.shortURL = '';
    scope.urlForm = '';
    // send POST request with original URL to server and geta short URL back.
    scope.getShortURL = function () {
        scope.originalURL = scope.originalURL.replace('http://', '');
        scope.originalURL = scope.originalURL.replace('https://', '');
        $http( { 
            method: 'POST', 
            url: '/getShortURL',
            data: { originalURL: scope.originalURL }
        })
        .success(function (data, status) {
            // set the current short URL to data that got back from server  
            scope.shortURL = data.shortURL;
            scope.oldOriginalURL = data.originalURL;
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

    // send POST request with short URL  to server and get a original URL back.
    scope.redirect = function () {
        $http( { 
            method: 'POST', 
            url: '/redirect',
            data: { shortURL: scope.shortURL }
        })
        .success(function (data, status) {
            // open link in new window 
            $window.open('http://' + data.originalURL);
        })
        .error(function (data, status) {
            alert('Server error, please try again.');
        });
    };

}]);