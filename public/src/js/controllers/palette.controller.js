angular.module('questCreator').controller('paletteCtrl', function(PaletteService, $scope) {

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
            PaletteService.getByTag(tag);
        };

        self.goToEditor = function() {
            console.log('exiting');
            if (self.elements) {
                var confirmed = confirm('Do you wanna save the assets you chose before leaving this screen?');
                if (confirmed) {
                    PaletteService.saveToPalette(self.elements);
                }
            }
            editor.selectingAssets = false;
        };

        self.addToPalette = function(element) {
            self.elements.push(element);
        };

        self.saveElements = function() {
          console.log($scope.editor.availableBackgrounds);
          if (self.currentType === 'backgrounds') {
            return $scope.editor.availableBackgrounds.push(self.elements);
          } else if (self.currentType === 'obstacles') {
            return $scope.editor.availableObjects.push(self.elements);
          } else if (self.currentType === 'entities') {
            return $scope.editor.availableEntities.push(self.elements);
          }
          console.log($scope.editor.availableBackgrounds);
          self.elements = [];
          return self.elements;
        };
    });
});
