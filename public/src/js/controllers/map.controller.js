angular.module('questCreator').controller('mapCtrl', function($state, $scope) {
  var self = this;

  this.width = 1;
  this.height = 1;

  // Scene pos should be [x,y,z], where x=mapIndex, y=rowIndex, z=columnIndex

  this.createMap = function() {
    var name = "new map";
    var sceneName = "new scene";
    console.log("Creating a map!", name);
    var newScene = {
      name: sceneName,
      background: null,
      objects: [],
      entities: []
    };
    var newMap = {
      name: name,
      scenes: [
        [newScene]
      ]
    };
    $scope.editor.currentEditingGame.info.maps.push(newMap);
  }

  this.createMapRow = function(mapObj) {
    var name = "new scene";
    var newScene = {
      name: name,
      background: null,
      objects: [],
      entities: []
    };
    $scope.editor.currentEditingGame.info.maps[$scope.editor.currentEditingGame.info.maps.indexOf(mapObj)].scenes.push([newScene]);
  }

  this.createScene = function(mapObj, rowNum) {
    var name = "new scene";
    var newScene = {
      name: name,
      background: null,
      objects: [],
      entities: []
    };
    console.log("Creating a scene!", mapObj, rowNum, name);
    $scope.editor.currentEditingGame.info.maps[$scope.editor.currentEditingGame.info.maps.indexOf(mapObj)].scenes[rowNum].push(newScene);
  }

  this.editScene = function(scene) {
    console.log(scene);
    $scope.editor.currentScene = scene;
    $scope.editor.currentLargeView = 'scene';
  }

});
