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

  this.selectEvent = function(event) {
    if (!event){
      return;
    }
    console.log("before: ", $scope.editor.currentScene.events);
    $scope.editor.currentScene.events.push(event);
    console.log("after: ", $scope.editor.currentScene.events);
  };

  this.addLocationEvent = function(){
    var locationCount = ($scope.editor.currentScene.events.filter(function(element){
      return element.category === "location";
    })).length;
    console.log("LocationCount: ", locationCount);
    var name = (locationCount >= 1) ? "New Location Event " + (locationCount) : "New Location Event";
    var newEvent = {
      name: name,
      category: 'location',
      info: {
        requirements: [],
        results: {
          achievements: [],
          inventory: [],
          portal: {},
          text: []
        },
        triggers: []
      },
    };
    console.log("newEvent: ", newEvent);
    $scope.editor.currentScene.events.push(newEvent);
  };

  this.anyResults = function(event){
    if (!event) {
      return false;
    }
    var results = event.info.results;
    if (results.text.length > 0 ||
        results.achievements.length > 0 ||
        results.inventory.length > 0 ||
        Object.keys(results.portal).length > 0) {
      return true;
    } else {
      return false;
    }
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
