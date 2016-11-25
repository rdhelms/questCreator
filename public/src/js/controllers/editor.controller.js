angular.module('questCreator')
.controller('editorCtrl', function(
  $scope,
  $state,
  EditorService,
  UserService,
  PopupService,
  PaletteService
  ) {

  var self = this;

  this.dragCalls = 0;

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
  this.currentScene = null;
  //NOTE probably can remove:
  // this.currentSceneImg = {};
  //NOTE probably can remove^
  this.currentLargeView = 'map';
  this.currentSmallView = 'object';
  this.availableBackgrounds = [];
  this.availableObjects = [];
  this.availableEntities = [];
  this.selectedAnimation = "walkLeft";

  this.currentColor = 'green';
  this.inputColor;
  this.currentPixelSize = 15;
  this.drawingCollision = false;
  this.erasing = false;
  this.selectingAssets = false;
  this.currentFrameIndex = 0;
  this.modeledFrameIndex = 0; // For some reason ng-model is being wacky the first click
  this.dragIndex = null;
  this.dragAsset = null;

  this.goToPalette = function (type) {
    self.selectingAssets = true;
    $scope.$broadcast('paletteInit', {type: type});
  };

  this.selectColor = function() {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(self.inputColor);
      var rgb = result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
      self.currentColor = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
      console.log(self.currentColor);
      console.log(self.inputColor);
  };

  if (this.currentEditingGame.name === null) {
    PopupService.close();
    PopupService.open('create-game', $scope);
  } else {
    PopupService.close();
    PopupService.open('edit-game', $scope);
  }

  this.createNewGame = function (name) {
      PopupService.close();
      EditorService.createGame(name).done(function(game) {
        // console.log(game);
        self.currentEditingGame = game;
        EditorService.getGameAssets(game.id).done(function(assets) {
          // console.log(assets);
          self.availableBackgrounds = assets.availableBackgrounds;
          self.availableObjects = assets.availableObstacles;
          self.availableEntities = assets.availableEntities;
          self.currentBackground = self.availableBackgrounds[0] || null;
          $scope.$apply();
        });
      });
      UserService.setGameEdit(name);
  };

  this.editGame = function () {
      PopupService.close();
      EditorService.getGame(self.currentEditingGame.name).done(function(game) {
        self.currentEditingGame = game;
        // console.log(self.currentEditingGame);
        EditorService.getGameAssets(game.id).done(function(assets) {
          // console.log(assets);
          self.availableBackgrounds = assets.availableBackgrounds;
          self.availableObjects = assets.availableObstacles;
          self.availableEntities = assets.availableEntities;
          $scope.$apply();
        });
      });
      $('.edit-game').hide();
  };

  this.saveGame = function() {
    EditorService.saveGame(self.currentEditingGame).done(function(savedGame) {
      console.log(savedGame);
    });
  };

  this.publishGame = function () {
    self.currentEditingGame.published = true;
    this.saveGame();
  };

  this.createBackground = function() {
    var name = "New Background";
    var game_id = self.currentEditingGame.id;
    EditorService.createBackground(name, game_id).done(function(background) {
      // console.log(background);
      self.availableBackgrounds.push(background);
      self.currentBackground = background;
      $scope.$apply();
    });
  };

  this.editBackground = function(background) {
    // console.log(background);
    self.currentBackground = background;
    $scope.$broadcast('redrawBackground', background.info.image, background.info.collisionMap);
  };

  this.createObject = function() {
    var name = "New Object";
    var game_id = self.currentEditingGame.id;
    EditorService.createObject(name, game_id).done(function(object) {
      // console.log(object);
      self.availableObjects.push(object);
      self.currentObject = object;
      self.currentSmallView = 'object';
      $scope.$apply();
    });
  };

  this.editObject = function(object) {
    // console.log(object);
    self.currentObject = object;
    self.currentSmallView = 'object';
    $scope.$broadcast('redrawObject', object.info.image, object.info.collisionMap);
  };

  this.createEntity = function() {
    var name = "New Entity";
    var game_id = self.currentEditingGame.id;
    EditorService.createEntity(name, game_id).done(function(entity) {
      console.log("ent", entity);
      self.availableEntities.push(entity);
      self.currentEntity = entity;
      self.currentSmallView = 'entity';
      $scope.$apply();
    });
  };

  this.editEntityFrame = function(entity) {
    self.currentFrameIndex = self.modeledFrameIndex || 0;
    self.currentEntity = entity;
    self.currentSmallView = 'entity';
    console.log("ent:", entity);
    console.log("frame index:", self.currentFrameIndex);
    console.log("selected frame:", entity.info.animate[self.selectedAnimation][self.currentFrameIndex]);
    $scope.$broadcast('redrawEntity', entity.info.animate[self.selectedAnimation][self.currentFrameIndex].image, entity.info.animate[self.selectedAnimation][self.currentFrameIndex].collisionMap);
  };

  this.setThumbnail = function(asset){
    if (asset === undefined) {
      return {"background": "none"};
    } else {
      return {
        "background": 'url("'+ asset.thumbnail +'")',
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat"
      };
    }
  }

  this.cancel = function () {
    PopupService.close();
    $state.go('main.profile');
  };

  this.selectText = function($event){
    $event.target.select();
  };

  this.positionAsset = function(asset){
    return {
      'top': asset.info.pos.y,
      'left': asset.info.pos.x,
      'position': 'absolute'
    };
  }

  this.dragPositionAsset = function(index, type){
    self.dragIndex = {
      index: index,
      type: type
    };
  }

  this.dragAvailableAsset = function(asset, type){
    self.dragAsset = {
      asset: asset,
      type: type
    };
  }

  //jquery UI Stuff
  this.uiDrag = function() {
    this.dragCalls++;
    // console.log("you called this function needlessly " + this.dragCalls + " times, ya jerk!");
    $('.asset-in-scene').draggable({
      start: function(event, ui) {
        $(ui.helper).addClass('grabbed');
      },
      stop: function(event, ui) {
        $(ui.helper).css({'transition': 'transform ease 100ms'}).removeClass('grabbed');
      }
    });

    $('.asset.available').draggable({
      helper: function(){
        var url = self.dragAsset.asset.thumbnail;
        console.log(url);
        return $('<img>').attr('src', url);
      },
      start: function(event, ui) {
        $(ui.helper).addClass('grabbed');
      },
      stop: function(event, ui) {
        $(ui.helper).css({'transition': 'transform ease 100ms'}).removeClass('grabbed');
      }
    });
    $('#scene-BG').droppable({
      drop: function(event, ui) {
        // If already in scene editor view:
        if (ui.draggable[0].className.toString().includes('-in-scene')){
          var type = self.dragIndex.type;
          var index = self.dragIndex.index;
          $scope.editor.currentScene[type][index].info.pos.x = ui.position.left;
          $scope.editor.currentScene[type][index].info.pos.y = ui.position.top;
          $scope.$apply();
        }
        // If dragging from available assets bar
        else if (ui.draggable[0].className.toString().includes('available')) {
          var type = self.dragAsset.type;
          var asset = self.dragAsset.asset;
          var offset = $('#scene-BG').offset();
          console.log("event: ", event);
          console.log("ui: ", ui);
          asset.info.pos.x = event.pageX - offset.left;
          asset.info.pos.y = event.pageY - offset.top;
          $scope.editor.currentScene[type].push(asset);
          $scope.$apply();
        }
      }
    });
  };
});
