angular.module('questCreator').controller('mapCtrl', function($state, $scope) {
  var self = this;

  this.width = 1;
  this.height = 1;

  // Scene pos should be [x,y,z], where x=mapIndex, y=rowIndex, z=columnIndex

  this.createMap = function() {
    var name = "New Map";
    var sceneName = "New Scene (1, 1)";
    var newScene = {
      name: sceneName,
      background: undefined,
      objects: [],
      entities: [],
      events: []
    };
    var newMap = {
      name: name,
      scenes: [
        [newScene]
      ]
    };
    $scope.editor.currentEditingGame.info.maps.push(newMap);
  }

  this.sceneNamer = function(coord) {
    if ([address].filter(function(asset){return asset.name.includes(name.toLowerCase())})){
      var num = 1;
      [address].forEach(function(value){
        num = (value.name.includes(name.toLowerCase())) ? num + 1 : num;
      });
      name = name + " " + num;
    }
    return name;
  };

  this.initScene = null;

  this.createMapRow = function(mapObj) {
    var name = "New Scene ("+self.initScene[0]+", "+self.initScene[1]+")";
    var newScene = {
      name: name,
      background: undefined,
      objects: [],
      entities: [],
      events: []
    };
    $scope.editor.currentEditingGame.info.maps[$scope.editor.currentEditingGame.info.maps.indexOf(mapObj)].scenes.push([newScene]);
  }

  this.createScene = function(mapObj, rowNum) {
    var name = "New Scene ("+self.initScene[0]+", "+self.initScene[1]+")";
    var newScene = {
      name: name,
      background: undefined,
      objects: [],
      entities: [],
      events: []
    };
    $scope.editor.currentEditingGame.info.maps[$scope.editor.currentEditingGame.info.maps.indexOf(mapObj)].scenes[rowNum].push(newScene);
  }

  this.editScene = function(scene) {
    //backwards compatibility fix:
    if (!scene.events) {
      scene.events = [];
    }
    $scope.editor.currentScene = scene;
    $scope.editor.currentLargeView = 'scene';
  }

});
