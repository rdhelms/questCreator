angular.module('questCreator').service('PaletteService', function (UserService) {

  var currentType = '';

  var assets = null;

  var headerData = {
    user_id: UserService.get().id,
    token: UserService.get().token
  };

  function getAssetsInService() {
    return assets;
  }

  function getCurrentType() {
    return currentType;
  }

  function getAllAssets() {
      $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/articles/index',
          contentType: 'application/json',
          success: function(response) {
              return response;
          },
          error: function(error) {
              alert('There was a problem loading the assets');
          }
      });
  }

  function getAssetsByType(type) {
    currentType = type;
    return $.ajax({
      method: 'GET',
      url: 'https://forge-api.herokuapp.com/' + type + '/all',
      headers: headerData,
      success: function(response) {
        assets = response;
        console.log(assets);
        return assets;
      },
      error: function(error) {
        alert('There was a problem loading the ' + currentType +'s');
      }
    });
  }

  function getAssetsByTag(tag) {
    return $.ajax({
      method: 'GET',
      url: 'https://forge-api.herokuapp.com/' + currentType + '/search',
      headers: headerData,
      data: tag,
      success: function(response) {
        console.log(response);
        assets = response;
        return assets;
      },
      error: function(error) {
        alert('There was a problem loading the ' + currentType +'s matching your search for ' + tag);
      }
    });
  }

  return {
    getCurrent: getAssetsInService,
    getCurrentType: getCurrentType,
    getAll: getAllAssets,
    getByType: getAssetsByType,
    getByTag: getAssetsByTag
  };
});
