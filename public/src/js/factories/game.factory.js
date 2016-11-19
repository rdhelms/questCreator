angular.module('questCreator').factory('Game', function() {
  function Game(name) {
    this.name = name;
    this.maps = [];
    this.scenes = [];
    this.backgrounds = [];
    this.sceneObjects = [];
    this.entities = [];
  };

  return Game;
});
