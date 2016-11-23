angular.module('questCreator').controller('paletteCtrl', function(PaletteService, $scope) {

    var self = this;
    this.elements = [];

    $scope.$on('paletteInit', function(event, type) {

        PaletteService.getByType(type.type).then(function(response) {
            self.assets = response;
            $scope.$apply();
            self.currentType = PaletteService.getCurrentType();
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

        this.addToPalette = function(element) {
            this.elements.push(element);
        };

        this.saveElements = function() {
            console.log(self.currentType);
        };
    });
});
