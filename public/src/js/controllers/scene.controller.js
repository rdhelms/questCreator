angular.module('questCreator').controller('sceneCtrl', function(socket, $state, $scope) {
  var self = this;

  this.selecting = {
    background: false,
    object: false,
    entity: false
  };

  this.selectBackground = function(background) {
    console.log(background);
    $scope.editor.currentScene.background = background;
    self.selecting.background = false;
  }

  this.selectObject = function(object) {
    console.log(object);
    $scope.editor.currentScene.objects.push(object);
    self.selecting.object = false;
  }

  this.selectEntity = function(entity) {
    // console.log(entity);
    console.log($scope.editor.currentScene.entities);
    $scope.editor.currentScene.entities.push(entity);
    console.log($scope.editor.currentScene.entities);
    self.selecting.entity = false;
  }

  this.saveScene = function(scene) {
    console.log("Turns out saving is unnecessary here. Here's the game as proof.");
    console.log($scope.editor.currentEditingGame);
  }


});
