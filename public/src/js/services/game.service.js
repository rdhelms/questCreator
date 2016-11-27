angular.module('questCreator').service('GameService', function(PopupService) {

    var gameDetail = {};

    function loadGame(name) {
      var nameWrapper = {
        name: name.toLowerCase()
      };

      return $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/games/load',
          data: nameWrapper,
          success: function(response) {
              return response;
          },
          error: function(error) {
              PopupService.open('fail-game-load');
          }
      });
    }

    function getAllGames() {
        return $.ajax({
            method: 'GET',
            url: 'https://forge-api.herokuapp.com/games/all',
            contentType: 'application/json',
            success: function(response) {
                return response;
            },
            error: function(error) {
                PopupService.openTemp('fail-games-load');
            }
        });
    }

    function getGameDetail() {
        return gameDetail;
    }

    function setGameDetail(game) {
        gameDetail = game;
    }

    function searchGames(keyword) {
      return $.ajax({
        method: 'GET',
        url: 'https://forge-api.herokuapp.com/games/search',
        data: {
          name: keyword
        },
        success: function(response) {
          return response;
        },
        error: function(error) {
          PopupService.openTemp('fail-games-load');
        }
      });
    }



    return {
        loadGame: loadGame,
        getGameDetail: getGameDetail,
        setGameDetail: setGameDetail,
        getGames: getAllGames,
        searchGames: searchGames
    };
});
