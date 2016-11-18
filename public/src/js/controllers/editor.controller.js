angular.module('questCreator').controller('editorCtrl', function($scope, $state, EditorService, UserService) {

  this.currentLargeView = 'maps';
  this.currentSmallView = 'objects';

  this.backgroundName = "Testing Background";
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

  $scope.gameToEdit = UserService.get().editGame;

  $scope.editGame = function () {
      EditorService.getGame($scope.gameToEdit);
      $('.edit-game').hide();
  };

  $scope.createNewGame = function (name) {
      EditorService.createGame(name);
      $('.create-game').hide();
      $scope.gameToEdit = name;
      UserService.setGameEdit(name);
  };

  $scope.cancel = function () {
    $state.go('main.profile');
  };

});
