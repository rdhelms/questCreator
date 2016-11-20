angular.module('questCreator').controller('editorCtrl', function($scope, $state, EditorService, UserService) {
  var self = this;
  this.gameInfo = {};
  this.currentEditingGame = {
    name: UserService.getGameEdit(),
    description: '',
    info: this.gameInfo,
    tags: [],
    published: false
  };
  this.currentBackground = null;
  this.currentObject = null;
  this.currentEntity = null;
  this.currentLargeView = 'background';
  this.currentSmallView = 'object';
  this.availableBackgrounds = [];
  this.availableObjects = [];
  this.availableEntities = [];

  this.currentColor = 'green';
  this.currentPixelSize = 15;

  this.createNewGame = function (name) {
      EditorService.createGame(name).done(function(game) {
        console.log(game);
        self.currentEditingGame = game;
      });
      $('.create-game').hide();
      UserService.setGameEdit(name);
  };

  this.editGame = function () {
      EditorService.getGame(self.currentEditingGame.name).done(function(game) {
        self.currentEditingGame = game;
        console.log(self.currentEditingGame);
        EditorService.getGameAssets(game.id).done(function(assets) {
          console.log(assets);
          self.availableBackgrounds = assets.availableBackgrounds;
          self.availableObjects = assets.availableObstacles;
          self.availableEntities = assets.availableEntities;
          $scope.$apply();
        });
      });
      $('.edit-game').hide();
  };

  this.createBackground = function() {
    var name = prompt("Enter a name for the new background: ");
    var game_id = self.currentEditingGame.id;
    EditorService.createBackground(name, game_id).done(function(background) {
      console.log(background);
      self.availableBackgrounds.push(background);
      self.currentBackground = background;
      $scope.$apply();
    });
  }

  this.editBackground = function(background) {
    console.log(background);
    self.currentBackground = background;
    $scope.$broadcast('redrawBackground', background.info.image);
  }

  this.createObject = function() {
    var name = prompt("Enter a name for the new object: ");
    var game_id = self.currentEditingGame.id;
    EditorService.createObject(name, game_id).done(function(object) {
      console.log(object);
      self.availableObjects.push(object);
      self.currentObject = object;
      $scope.$apply();
    });
  }

  this.editObject = function(object) {
    console.log(object);
    self.currentObject = object;
    $scope.$broadcast('redrawObject', object.info.image);
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
