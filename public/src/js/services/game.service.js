angular.module('questCreator').service('GameService', function() {

    var gameDetail = {};

    function loadGame(name) {
        $.ajax({
            method: 'GET',
            url: 'https://forge-api.herokuapp.com/games/load',
            data: JSON.stringify(name),
            dataType: 'json',
            contentType: 'application/json',
            success: function(response) {
                return response;
            },
            error: function(error) {
                alert('There was a problem loading this game');
            }
        });
    }

    function getAllGames() {
        $.ajax({
            method: 'GET',
            url: 'https://forge-api.herokuapp.com/games/all',
            contentType: 'application/json',
            success: function(response) {
                return response;
            },
            error: function(error) {
                alert('There was a problem loading the games');
            }
        });
    }

    function getGameDetail() {
        return gameDetail;
    }

    function setGameDetail(game) {
        gameDetail = game;
    }

    return {
        loadGame: loadGame,
        getGameDetail: getGameDetail,
        setGameDetail: setGameDetail,
        getGames: getAllGames
    };
});
