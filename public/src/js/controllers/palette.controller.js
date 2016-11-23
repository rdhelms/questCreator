angular.module('questCreator').controller('paletteCtrl', function (PaletteService, $scope) {
  var self = this;
  this.elements = [];
  this.currentType = PaletteService.getCurrentType();

  this.assets = PaletteService.getCurrent();

  this.searchByTag = function (tag) {
    PaletteService.getByTag(tag);
  };

  this.goToEditor = function () {
    if (this.elements) {
      var confirmed = confirm('Do you wanna save the assets you chose before leaving this screen?');
      if (confirmed) {
        PaletteService.saveToPalette(this.elements);
      }
    }
    editor.selectingAssets = false;
  };

  this.addToPalette = function (element) {
    this.elements.push(element);
  };

  this.saveElements = function () {
    console.log(self.currentType);
  // editor.
  //   self.elements = [];
  };
});
