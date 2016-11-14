(function() {
  "use strict";

  angular.module('questCreator', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            url: '/',
            templateUrl: './src/views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.game', {
            // url: ':name'
            url: 'game',
            templateUrl: './src/views/game.html',
            controller: 'gameCtrl as game'
          }).state('main.game.play', {
            url: 'play',
            templateUrl: './src/views/play.html',
            controller: 'playCtrl as play'
          }).state('main.game.editor', {
            // Includes sidebar and nav for all editor views
            // "/game/editor"
            url: 'editor',
            templateUrl: './src/views/editor.html',
            controller: 'editorCtrl as editor'
          }).state('main.game.editor.map', {
            // "/game/editor/map"
            url: 'map',
            templateUrl: './src/views/editor/map.html',
            controller: 'mapCtrl as map'
          }).state('main.game.editor.scene', {
            // "/game/editor/scene"
            url: 'scene',
            templateUrl: './src/views/editor/scene.html',
            controller: 'sceneCtrl as scene'
          }).state('main.game.editor.bg', {
            // "/game/editor/bg"
            url: 'bg',
            templateUrl: './src/views/editor/bg.html',
            controller: 'bgCtrl as bg'
          }).state('main.game.editor.obj', {
            // "/game/editor/obj"
            url: 'obj',
            templateUrl: './src/views/editor/obj.html',
            controller: 'objCtrl as obj'
          }).state('main.game.editor.ent', {
            // "/game/editor/ent"
            url: 'ent',
            templateUrl: './src/views/editor/ent.html',
            controller: 'entCtrl as ent'
          }).state('main.game.editor.scripts', {
            // "/game/editor/scripts"
            url: 'scripts',
            templateUrl: './src/views/editor/scripts.html',
            controller: 'scriptsCtrl as scripts'
          }).state('main.profile', {
            url: 'profile',
            templateUrl: './src/views/profile.html',
            controller: 'profileCtrl as profile'
          });
        });

})();
