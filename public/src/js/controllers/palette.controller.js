angular.module('questCreator').controller('PaletteCtrl', function (PaletteService) {
  
  this.allAssets = PaletteService.getAssets();

});
