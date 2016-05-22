var app = angular.module('LaimasApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/log');

    $stateProvider
        .state('log', {
            url: '/log',
            templateUrl: 'res/scope/log/view.html'
        })
        .state('chars', {
            url: '/chars',
            templateUrl: 'res/scope/chars/view.html'
        })
        .state('config', {
            url: '/config',
            templateUrl: 'res/scope/config/view.html'
        })
        .state('route', {
            url: '/route/:from/:to',
            params: {
                from: "1001", // Klaipeda
                to: "1006" // Orsha
            },
            templateUrl: 'res/scope/route/view.html'
        })
        .state('advice', {
            url: '/advice',
            templateUrl: 'res/scope/advice/view.html'
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

// http://stackoverflow.com/a/13782311/1845714

app.directive('backImg', function () {
    return function (scope, element, attrs) {
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url + ')',
            'background-size': 'cover'
        });
    };
})


if(!( typeof require === 'undefined' || require === null )){
    var remote = require('remote');
    var dialog = remote.require('dialog');
    var appConfig = remote.require('./assets/js/appConfig.js');
}
