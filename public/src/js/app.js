(function() {
  "use strict";

  angular.module('questCreator', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            abstract: true,
            url: '/',
            templateUrl: './src/views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.landing', {
            // landing page
            url: '',
            templateUrl: './src/views/landing.html',
            controller: 'landingCtrl as landing'
          }).state('main.game', {
            // url: ':name'
            url: 'game',
            templateUrl: './src/views/game.html',
            controller: 'gameCtrl as game'
          }).state('main.game.detail', {
            url: '/detail',
            templateUrl: './src/views/game/detail.html',
            controller: 'detailCtrl as detail'
          }).state('main.game.play', {
            url: '/play',
            templateUrl: './src/views/game/play.html',
            controller: 'playCtrl as play'
          }).state('main.game.editor', {
            // "/game/editor"
            abstract: true,
            url: '/editor',
            templateUrl: './src/views/game/editor.html',
            controller: 'editorCtrl as editor',
          }).state('main.game.editor.views', {
            url: '/',
            views: {
              'palette': {
                templateUrl: './src/views/game/editor/palette.html',
                controller: 'paletteCtrl as palette'
              },
              'maps': {
                templateUrl: './src/views/game/editor/map.html',
                controller: 'mapCtrl as map'
              },
              'scenes': {
                templateUrl: './src/views/game/editor/scene.html',
                controller: 'sceneCtrl as scene'
              },
              'backgrounds': {
                templateUrl: './src/views/game/editor/bg.html',
                controller: 'bgCtrl as bg'
              },
              'objects': {
                templateUrl: './src/views/game/editor/obj.html',
                controller: 'objCtrl as obj'
              },
              'entities': {
                templateUrl: './src/views/game/editor/ent.html',
                controller: 'entCtrl as ent'
              },
              'events': {
                templateUrl: './src/views/game/editor/events.html',
                controller: 'eventsCtrl as events'
              }
            }
          }).state('main.profile', {
            url: 'profile',
            templateUrl: './src/views/profile.html',
            controller: 'profileCtrl as profile'
          });
        });
})();
