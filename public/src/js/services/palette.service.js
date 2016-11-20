angular.module('questCreator').service('PaletteService', function () {
  function getAllAssets() {
      $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/articles/index',
          contentType: 'application/json',
          success: function(response) {
              console.log('here');
              return response;
          },
          error: function(error) {
              alert('There was a problem loading the assets');
          }
      });
  }

  return {
    getAssets: getAllAssets
  };
});
