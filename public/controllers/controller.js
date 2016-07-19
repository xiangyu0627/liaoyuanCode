'use strict';

var liaoyuanApp = angular.module('liaoyuanApp', []);

liaoyuanApp.controller('MainCtrl', ['$http', function ($http) {
    
    var scope = this;
    scope.originalURL = '';
    scope.shortURL = '';

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
    };

}]);