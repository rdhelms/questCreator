angular.module('questCreator').service('EditorService', function (UserService, $state) {


    var game = null;

    function getGame(name) {
      var nameWrapper = {
        name: name.toLowerCase()
      }
      return $.ajax({
        method: 'GET',
        url: 'https://forge-api.herokuapp.com/games/load',
        data: nameWrapper,
        success: function(response) {
          return response;
        },
        error: function(error) {
          alert('There was a problem loading this game');
        }
      });
    }

    function getGameAssets(game_id) {
        var headerData = {
          user_id: UserService.get().id,
          token: UserService.get().token
        };
        var data = {
          game_id: game_id
        };
        return $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/articles/game/all',
          headers: headerData,
          data: data,
          success: function(response) {
            return response;
          },
          error: function(error) {
            console.log(error);
          }
        });
    }

    function createGame(name) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var game = {
        name: name,
        description: "",
        tags: []
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/games/create',
        data: JSON.stringify(game),
        headers: headerData,
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          game = response;
          return game;
        },
        error: function(error) {
          alert('There was a problem creating this game. Please try again.');
          $state.go('main.landing');
        }
      });
    }

    function createBackground(name, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var backgroundInfo = {
        image: [],
        collisionMap: []
      };
      var currentBackground = {
        name: name,
        info: backgroundInfo,
        tags: [],
        published: true,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/backgrounds/create',
        headers: headerData,
        data: JSON.stringify(currentBackground),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveBackground(imageArr, currentBackground) {
      currentBackground.info.image = imageArr;
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/backgrounds/update',
        headers: headerData,
        data: JSON.stringify(currentBackground),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function createObject(name, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var objectInfo = {
        pos: {
          x: 350,
          y: 250
        },
        image: [],
        collisionMap: []
      };
      var currentObject = {
        name: name,
        info: objectInfo,
        tags: [],
        published: false,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/obstacles/create',
        headers: headerData,
        data: JSON.stringify(currentObject),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveObject(imageArr, currentObject) {
      currentObject.info.image = imageArr;
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/obstacles/update',
        headers: headerData,
        data: JSON.stringify(currentObject),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    return {
      getGame: getGame,
      getGameAssets: getGameAssets,
      createGame: createGame,
      createBackground: createBackground,
      saveBackground: saveBackground,
      createObject: createObject,
      saveObject: saveObject
    };
});
