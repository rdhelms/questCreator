angular.module('questCreator').controller('eventsCtrl', function($state, $scope, EditorService) {
  this.view = 'triggers';
  this.resultType = 'text';
  this.requirementType = null;
  this.requirements = {
    achievements: null,
    inventory: null
  }
  this.locationView = 'scene';
  this.map = null;
  this.scene = null;
  this.newWord = null;
  this.wordBuffer = {};
  this.counter = 0;
// DEBUG
  this.log = function(){
    console.log($scope.editor.currentEvent);
    console.log("requirements: ", this.requirements);
  }

  this.save = function(event) {
    EditorService.saveEvent(event).done(function(response){
    });
  }

////
//REQUIREMENTS:
////

  this.findRequirements = function() {
    var achievements = [];
    var itemList = [];
    $scope.editor.currentEditingGame.info.maps.forEach(function(map){
      map.scenes.forEach(function(sceneRow){
        sceneRow.forEach(function(scene){
          if (scene.events) {
            scene.events.forEach(function(event){
              event.info.results.achievements.forEach(function(achievement){
                achievements.push(achievement.name);
              });
              event.info.results.inventory.forEach(function(item){
                itemList.push(item);
              });
            })
          }
        })
      });
    });
    this.requirements = {
      achievements: achievements,
      inventory: itemList
    };
  }

  this.addRequirement = function(requirement, type) {
    if ($scope.editor.currentEvent.info.requirements.length === 0) {
      $scope.editor.currentEvent.info.requirements = {
        achievements: [],
        inventory: []
      };
    }
    $scope.editor.currentEvent.info.requirements[type].push(requirement);
  };

  this.anyRequirements = function(){
    if (!$scope.editor.currentEvent) {
      return false;
    }
    var requirements = $scope.editor.currentEvent.info.results;
    if (requirements.achievements.length > 0 ||
        requirements.inventory.length > 0) {
      return true;
    } else {
      return false;
    }
  };


////
//TRIGGERS:
////

//TRIGGER
////TEXT:

  this.addWordList = function(word){
    if (!word) {
      console.log("no word!");
      return;
    }
    var newList = [word];
    $scope.editor.currentEvent.info.triggers.push(newList);
    this.newWord = null;
    this.counter++;
  }

  this.addAlias = function(word, index){
    if (!word) {
      console.log("no word!");
      return;
    }
    $scope.editor.currentEvent.info.triggers[index].push(word);
    this.counter++;
  };

  this.bufferIndex = function() {
    return this.counter;
  }

//TRIGGER
////LOCATION:

  this.selectScene = function(scene){
    this.scene = scene;
    if (scene.background){
      $scope.editor.currentEvent.info.thumbnail = scene.background.thumbnail;
      console.log("added thumbnail");
    } else {
      $scope.editor.currentEvent.info.thumbnail = false;
    }
  };

////
//RESULTS:
////

//GENERAL:

  this.anyResults = function(){
    if (!$scope.editor.currentEvent) {
      return false;
    }
    var results = $scope.editor.currentEvent.info.results;
    if (results.text.length > 0 ||
        results.achievements.length > 0 ||
        results.inventory.length > 0 ||
        Object.keys(results.portal).length > 0) {
      return true;
    } else {
      return false;
    }
  };

//RESULT:
////TEXT:

  this.addText = function(){
    $scope.editor.currentEvent.info.results.text.push('');
  };

  this.removeText = function(index){
    $scope.editor.currentEvent.info.results.text.splice(index, 1);
  };

//RESULT:
////ACHIEVEMENT:

  this.addAchievement = function(){
    $scope.editor.currentEvent.info.results.achievements.push({
      name: '',
      description: '',
      points: 0
    });
  };

  this.removeAchievement = function(index){
    $scope.editor.currentEvent.info.results.achievements.splice(index, 1);
  };

//RESULT:
////ITEM:

  this.addItem = function(){
    $scope.editor.currentEvent.info.results.inventory.push('');
  };

  this.removeItem = function(index){
    $scope.editor.currentEvent.info.results.inventory.splice(index, 1);
  };


});
