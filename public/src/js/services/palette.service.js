angular.module('questCreator').service('PaletteService', function (UserService, PopupService) {

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
              PopupService.openTemp('fail-assets-load');
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
        return assets;
      },
      error: function(error) {
        PopupService.openTemp('fail-assets-load');
      }
    });
  }

  function getAssetsByTag(tag) {
    return $.ajax({
      method: 'GET',
      url: 'https://forge-api.herokuapp.com/' + currentType + '/search',
      headers: headerData,
      data: {
        name: tag
      },
      success: function(response) {
        assets = response;
        return assets;
      },
      error: function(error) {
        PopupService.openTemp('fail-assets-load');
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
