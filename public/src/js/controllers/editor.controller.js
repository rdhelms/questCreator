angular.module('questCreator').controller('editorCtrl', function($scope, $state, EditorService, UserService) {

  // $scope.currentEditingGame = UserService.get().editGame;
  this.gameInfo = {};
  this.currentEditingGame = {
    name: 'Potter Quest', // This name would be from localStorage
    description: '',
    info: this.gameInfo,
    tags: [],
    published: false
  };
  this.currentLargeView = 'background';
  this.currentSmallView = 'object';
  this.availableObjects = [];

  this.editGame = function () {
      EditorService.getGame(this.currentEditingGame.name).done(function(game) {
        console.log(game);
      });
      $('.edit-game').hide();
  };

  this.createNewGame = function (name) {
      EditorService.createGame(name).done(function(game) {
        console.log(game);
        this.currentEditingGame = game;
      });
      $('.create-game').hide();
      UserService.setGameEdit(name);
  };

  this.createObject = function() {
    console.log("New object created!");
  }

  $scope.cancel = function () {
    $state.go('main.profile');
  };

  $('.asset').draggable({
    helper: 'clone',
    start: function(event, ui) {
      $(ui.helper).addClass('grabbed');
    },
    stop: function(event, ui) {
      $(ui.helper).css({'transition': 'transform ease 100ms'}).removeClass('grabbed');
    }
  });
  $('#bg-canvas').droppable({
    drop: function(event, ui) {
      console.log('ui', ui);
      var clone = $(ui.draggable).clone();
      clone.draggable();
      $(this).append(clone);
    }
  });
});
