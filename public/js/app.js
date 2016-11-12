(function() {
  "use strict";

  angular.module('questCreator', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.chat', {
            url: 'chat',
            templateUrl: 'views/chat.html',
            controller: 'chatCtrl as chat'
          }).state('main.game', {
            url: 'game',
            templateUrl: 'views/game.html',
            controller: 'gameCtrl as game'
          });
        });

})();
