angular.module('questCreator').controller('mapCtrl', function($state, $scope) {
  var self = this;
  this.allMaps = [
    {
      name: 'Title Map',
      scenes: [
        ['Title Screen']
      ]
    }
  ];

  this.createMap = function() {
    var name = prompt("Enter a name for the map: ");
    var sceneName = prompt("Enter a name for the first scene: ");
    console.log("Creating a map!", name);
    var newMap = {
      name: name,
      scenes: [
        [sceneName]
      ]
    };
    self.allMaps.push(newMap);
    $scope.editor.allMaps = self.allMaps;
  }

  this.createMapRow = function(mapObj) {
    var name = prompt("Enter a name for the first scene in this row");
    self.allMaps[self.allMaps.indexOf(mapObj)].scenes.push([name]);
  }

  this.createScene = function(mapObj, rowNum) {
    var name = prompt("Enter a name for the scene: ");
    console.log("Creating a scene!", mapObj, rowNum, name);
    self.allMaps[self.allMaps.indexOf(mapObj)].scenes[rowNum].push(name);
    $scope.editor.allMaps = self.allMaps;
  }

  this.editScene = function(scene) {
    console.log(scene);
    $scope.editor.currentScene = scene;
    $scope.editor.currentLargeView = 'scene';
  }

});
