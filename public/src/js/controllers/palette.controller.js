angular.module('questCreator').controller('paletteCtrl', function (PaletteService) {

  // this.elements = [];
  // this.currentType = PaletteService.getCurrentType();
  //
  // this.allAssets = PaletteService.getAll();
  //
  // this.assets = PaletteService.getCurrent();
  //
  // this.searchByTag = function (tag) {
  //   PaletteService.getByTag(tag);
  // };

  this.goToEditor = function () {
    if (this.elements) {
      var confirm = confirm('Do you wanna save the assets you chose before leaving this screen?');
      if (confirm) {
        PaletteService.saveToPalette(this.elements);
      }
    }
    $state.go('main.game.editor');
  };

  this.addToPalette = function (element) {
    this.elements.push(element);
  };

  this.saveElements = function () {
    //this function should get the current objects from the palette (preferably by type and probably from the editor service), concats that array with this.elements and sets the combined array back into the service from whence they came.
    this.elements = [];
  };
});
