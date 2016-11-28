angular.module('questCreator').controller('eventsCtrl', function($state, $scope, EditorService) {
  this.view = 'triggers';
  this.resultType = 'text';
  this.requirementType = 'achievement';
  this.newWord = null;
  this.wordBuffer = {};
  this.counter = 0;
// DEBUG
  this.log = function(){
    console.log($scope.editor.currentEvent);
  }

  this.save = function(event) {
    console.log("Saving event", event);
    EditorService.saveEvent(event).done(function(response){
      console.log("Event saved: ", response);
    });
  }
////
//TRIGGERS:
////

//TEXT:

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
  }

//TEXT:

  this.addText = function(){
    $scope.editor.currentEvent.info.results.text.push('');
  };

  this.removeText = function(index){
    $scope.editor.currentEvent.info.results.text.splice(index, 1);
  };

});
