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
  this.currentLargeView = 'background';
  this.currentSmallView = 'object';
  this.availableBackgrounds = [];
  this.availableObjects = [];
  this.availableEntities = [];
  this.selectedAnimation = "Animations";

  this.currentColor = 'green';
  this.currentPixelSize = 15;
  this.selectingAssets = false;
  this.frameindex = 0;

  //TESTING PLEASE REMOVE:
  this.dummyent = {
      "id": 11,
      "info": {
          "pos": {
              "x": 350,
              "y": 250
          },
          "animate": {
            "walkleft": [
                {
                  "image": [{
                      "x": 79.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 103.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 118.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 124.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 139.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 64.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 49.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }],
                  "collisionMap": []
                },
                {
                  "image": [{
                      "x": 94.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 103.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 118.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 124.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 139.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 64.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 49.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }],
                  "collisionMap": []

                },
                {
                  "image": [{
                      "x": 79.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 103.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 118.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 124.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }],
                  "collisionMap": []

                },
              ],
              "walkright": [
                {
                  "image": [{
                      "x": 79.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 103.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 118.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 124.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 139.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 64.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 49.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }],
                  "collisionMap": []
                },
                {
                  "image": [{
                      "x": 79.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 103.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 118.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 124.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 139.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 64.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 49.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }],
                  "collisionMap": []

                },
                {
                  "image": [{
                      "x": 79.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 58.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 43.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 28.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 103.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 118.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 94.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 133.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 148.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 163.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 79.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 109.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 124.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 139.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 64.296875,
                      "y": 88.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }, {
                      "x": 49.296875,
                      "y": 73.203125,
                      "width": 15,
                      "height": 15,
                      "color": "brown"
                  }],
                  "collisionMap": []

                },
              ],
          },
      },
      "user_id": 5,
      "game_id": 40,
      "name": "ent 1",
      "published": false,
      "tags": "[]",
      "created_at": "2016-11-21T18:50:12.509Z",
      "updated_at": "2016-11-21T18:52:59.961Z",
      "$$hashKey": "object:105"
  }
  this.availableEntities.push(this.dummyent);


  this.goToPalette = function (type) {
    self.selectingAssets = true;
    // PaletteService.getByType(type);
    // $state.go('main.game.editor.palette');
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
        console.log(game);
        self.currentEditingGame = game;
      });
      $('.create-game').hide();
      UserService.setGameEdit(name);
  };

  this.editGame = function () {
      PopupService.close();
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
    var name = prompt("Enter a name for the new background: ");
    var game_id = self.currentEditingGame.id;
    EditorService.createBackground(name, game_id).done(function(background) {
      console.log(background);
      self.availableBackgrounds.push(background);
      self.currentBackground = background;
      $scope.$apply();
    });
  };

  this.editBackground = function(background) {
    console.log(background);
    self.currentBackground = background;
    $scope.$broadcast('redrawBackground', background.info.image);
  };

  this.createObject = function() {
    var name = prompt("Enter a name for the new object: ");
    var game_id = self.currentEditingGame.id;
    EditorService.createObject(name, game_id).done(function(object) {
      console.log(object);
      self.availableObjects.push(object);
      self.currentObject = object;
      self.currentSmallView = 'object';
      $scope.$apply();
    });
  };

  this.editObject = function(object) {
    console.log(object);
    self.currentObject = object;
    self.currentSmallView = 'object';
    $scope.$broadcast('redrawObject', object.info.image);
  };

  this.createEntity = function() {
    var name = prompt("Enter a name for the new entity: ");
    var game_id = self.currentEditingGame.id;
    EditorService.createEntity(name, game_id).done(function(entity) {
      console.log("ent", entity);
      self.availableEntities.push(entity);
      self.currentEntity = entity;
      self.currentSmallView = 'entity';
      $scope.$apply();
    });
  };

  this.editEntity = function(entity) {
    console.log(entity);
    self.currentEntity = entity;
    self.currentSmallView = 'entity';
    $scope.$broadcast('redrawEntity', entity.info.image);
  };

  this.cancel = function () {
    PopupService.close();
    $state.go('main.profile');
  };

  //jquery UI Stuff

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
