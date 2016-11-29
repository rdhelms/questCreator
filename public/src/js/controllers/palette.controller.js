angular.module('questCreator').controller('paletteCtrl', function(PaletteService, $scope, EditorService) {

    var self = this;
    this.elements = [];
    this.currentType = '';

    $scope.$on('paletteInit', function(event, type) {

        PaletteService.getByType(type.type).then(function(response) {
            self.assets = response;
            $scope.$apply();
            self.currentType = PaletteService.getCurrentType();
            $scope.$apply();
        });

        self.searchByTag = function(tag) {
            PaletteService.getByTag(tag).done(function (response) {
              self.assets = response;
              $scope.$apply();
            });
        };

        self.goToEditor = function() {
            if (self.elements.length > 0) {
                var confirmed = confirm('Do you wanna save the assets you chose before leaving this screen?');
                if (confirmed) {
                    self.saveElements();
                }
            }
            $scope.editor.selectingAssets = false;
        };

        self.testDupes = function (id, game) {
          var notDupe = true;
          if (game === $scope.editor.currentEditingGame.id) {
            notDupe = false;
          }
          for (var i = 0; i < self.elements.length; i++) {
            if (self.elements[i].id === id) {
              notDupe = false;
            }
          }
          return notDupe;
        };

        self.addToPalette = function(asset, index) {
          self.assets.forEach(function (element) {
          });
          self.assets.splice(index, 1);
          var element = angular.copy(asset);
          EditorService.getAssetInfo(element.id, self.currentType).done(function (info) {
            element.info = info;
            self.elements.push(element);
            $scope.$apply();
          });
        };

        self.removeFromPalette = function (index) {
          self.elements.splice(index, 1);
        };

        self.saveElements = function() {
          var currentObjects = [];
          var savedAssets = [];
          var asset = null;
          if (self.currentType === 'backgrounds') {
            for (var i = 0; i < self.elements.length; i++) {
              asset = self.elements[i];
                EditorService.createBackground(asset.name, $scope.editor.currentEditingGame.id, asset.info).done(function (response) {
                  response.thumbnail = asset.thumbnail;
                  savedAssets.push(response);
              });
            }
            currentObjects = $scope.editor.availableBackgrounds.concat(savedAssets);
            $scope.editor.availableBackgrounds = currentObjects;
            console.log($scope.editor.availableBackgrounds);
          } else if (self.currentType === 'obstacles') {
            for (var j = 0; j < self.elements.length; j++) {
              asset = self.elements[j];
                EditorService.createBackground(asset.name, $scope.editor.currentEditingGame.id, asset.info).done(function (response) {
                  response.thumbnail = asset.thumbnail;
                  savedAssets.push(response);
              });
            }
            currentObjects = $scope.editor.availableObjects.concat(savedAssets);
            $scope.editor.availableObjects = currentObjects;
          } else if (self.currentType === 'entities') {
            for (var k = 0; k < self.elements.length; k++) {
              asset = self.elements[k];
                EditorService.createEntity(asset.name, $scope.editor.currentEditingGame.id, asset.info).done(function (response) {
                  response.thumbnail = asset.thumbnail;
                  savedAssets.push(response);
              });
            }
            currentObjects = $scope.editor.availableEntities.concat(savedAssets);
            $scope.editor.availableEntities = currentObjects;
          }
          self.elements = [];
          $scope.editor.$apply();
          return self.elements;
        };

    });
});
