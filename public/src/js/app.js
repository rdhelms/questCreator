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
            url: 'game/',
            templateUrl: './src/views/game.html',
            controller: 'gameCtrl as game'
          }).state('main.game.play', {
            url: 'play/',
            templateUrl: './src/views/game/play.html',
            controller: 'playCtrl as play'
          }).state('main.game.editor', {
            // Includes sidebar and nav for all editor views
            // "/game/editor"
            url: 'editor/',
            templateUrl: './src/views/game/editor.html',
            controller: 'editorCtrl as editor'
          }).state('main.game.editor.map', {
            // "/game/editor/map"
            url: 'map/',
            templateUrl: './src/views/game/editor/map.html',
            controller: 'mapCtrl as map'
          }).state('main.game.editor.scene', {
            // "/game/editor/scene"
            url: 'scene/',
            templateUrl: './src/views/game/editor/scene.html',
            controller: 'sceneCtrl as scene'
          }).state('main.game.editor.bg', {
            // "/game/editor/bg"
            url: 'bg/',
            templateUrl: './src/views/game/editor/bg.html',
            controller: 'bgCtrl as bg'
          }).state('main.game.editor.obj', {
            // "/game/editor/obj"
            url: 'obj/',
            templateUrl: './src/views/game/editor/obj.html',
            controller: 'objCtrl as obj'
          }).state('main.game.editor.ent', {
            // "/game/editor/ent"
            url: 'ent/',
            templateUrl: './src/views/game/editor/ent.html',
            controller: 'entCtrl as ent'
          }).state('main.game.editor.scripts', {
            // "/game/editor/scripts"
            url: 'scripts/',
            templateUrl: './src/views/game/editor/scripts.html',
            controller: 'scriptsCtrl as scripts'
          }).state('main.profile', {
            url: 'profile/',
            templateUrl: './src/views/profile.html',
            controller: 'profileCtrl as profile'
          });
        });

})();
