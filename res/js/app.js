var app = angular.module('LaimasApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/log');

    $stateProvider
        .state('log', {
            url: '/log',
            templateUrl: '/res/scope/log/view.html'
        })
        .state('chars', {
            url: '/chars',
            templateUrl: '/res/scope/chars/view.html'
        })
        .state('config', {
            url: '/config',
            templateUrl: '/res/scope/config/view.html'
        });
});

app.filter('toDictionaryArray', function () {
    return function (obj) {
        if (!(obj instanceof Object)) return obj;

        var arr = [];
        for (var key in obj) {
            arr.push({ key: key, value: obj[key] });
        }
        return arr;
    }
});

var remote = require('remote');
var dialog = remote.require('dialog');
var appConfig = remote.require('./assets/js/appConfig.js');
