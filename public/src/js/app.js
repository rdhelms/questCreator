(function() {
  "use strict";

  angular.module('questCreator', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            url: '/',
            templateUrl: './src/views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.chat', {
            url: 'chat',
            templateUrl: './src/views/chat.html',
            controller: 'chatCtrl as chat'
          }).state('main.game', {
            url: 'game',
            templateUrl: './src/views/game.html',
            controller: 'gameCtrl as game'
          });
        });

})();
