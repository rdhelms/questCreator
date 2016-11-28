angular.module('questCreator').controller('sceneCtrl', function(socket, $state, $scope, $compile) {
  var self = this;

  this.view = 'events';

  this.selecting = {
    background: false,
    object: false,
    entity: false
  };

  this.selectedObject = null;
  this.selectedEntity = null;
  this.selectedEvent= null;

  this.selectBackground = function(background) {
    console.log(background);
    $scope.editor.currentScene.background = background;
    self.selecting.background = false;
  };

  this.selectObject = function(object) {
    if (!object) {
      return;
    }
    $scope.editor.currentScene.objects.push(object);
    self.selecting.object = false;
  };

  this.selectEntity = function(entity) {
    if (!entity) {
      return;
    }
    $scope.editor.currentScene.entities.push(entity);
    self.selecting.entity = false;
  };

  this.removeAsset = function(index, type){
    $scope.editor.currentScene[type].splice(index, 1);
  };

  this.saveScene = function(scene) {
    console.log("Turns out saving is unnecessary here. Here's the game as proof.");
    console.log($scope.editor.currentEditingGame);
  };

  this.placeAsset = function(asset, type) {
    console.log("placin");
    var position = {
      'top': "{{"+type+ ".info.pos.x}}",
      'left': "{{"+type+ ".info.pos.y}}",
      'position': 'absolute'
    };
    var url = asset.thumbnail;
    var html = '<img src="'+url+'" draggable">';
    var template = angular.element(html);
    var linkFn = $compile(template);
    var element = linkFn($scope);
    $(element).appendTo('#scene-BG');
    $scope.apply;
  };

});
