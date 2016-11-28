angular.module('questCreator').controller('paletteCtrl', function(PaletteService, $scope) {

    var self = this;
    this.elements = [];
    this.currentType = '';

    $scope.$on('paletteInit', function(event, type) {

        PaletteService.getByType(type.type).then(function(response) {
          console.log(response);
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

        self.addToPalette = function(element) {
            self.elements.push(element);
        };

        self.saveElements = function() {
          console.log('in editor: ', $scope.editor.availableObjects);
          console.log('in palette: ', self.elements);
          var currentObjects = null;
          if (self.currentType === 'backgrounds') {
            currentObjects =  $scope.editor.availableBackgrounds.concat(self.elements);
            $scope.editor.availableBackgrounds = currentObjects;
          } else if (self.currentType === 'obstacles') {
            currentObjects = $scope.editor.availableObjects.concat(self.elements);
            $scope.editor.availableObjects = currentObjects;
          } else if (self.currentType === 'entities') {
            currentObjects = $scope.editor.availableEntities.concat(self.elements);
            $scope.editor.availableEntities = currentObjects;
          }
          self.elements = [];
          return self.elements;
        };

        self.removeFromPalette = function (element) {

        };

    });
});
