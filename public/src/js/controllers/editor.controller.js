angular.module('questCreator').controller('editorCtrl', function($scope, $state, EditorService, UserService) {

  // $scope.currentEditingGame = UserService.get().editGame;
  this.gameInfo = {};
  this.currentEditingGame = {
    name: 'Potter Quest',
    description: '',
    info: this.gameInfo,
    tags: [],
    published: false
  };
  this.currentLargeView = 'background';
  this.currentSmallView = 'object';

  this.editGame = function () {
      EditorService.getGame(this.currentEditingGame);
      $('.edit-game').hide();
  };

  this.createNewGame = function (name) {
      EditorService.createGame(name).done(function(game) {
        console.log(game);
      });
      $('.create-game').hide();
      $scope.currentEditingGame = name;
      UserService.setGameEdit(name);

  };

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
