angular.module('questCreator').factory('Scene', function() {
  function Scene(name) {
    this.name = name;
    this.backgrounds = [];
    this.sceneObjects = [];
    this.entities = [];
  };

  return Scene;
});
