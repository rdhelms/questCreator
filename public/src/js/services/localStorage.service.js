angular.module('questCreator').service('StorageService', function (localStorageService) {
  function getSavedGames(gameName) {
    var allSavedGames = localStorageService.get('savedGames') || [];
    var yourSaves = allSavedGames[gameName];
    console.log("All saved games", allSavedGames);
    console.log("Your saved games for " + gameName, yourSaves);
    return yourSaves;
  }

  function setSavedGames(gameName, newSavedGames) {
    var allSavedGames = localStorageService.get('savedGames') || [];
    allSavedGames[gameName] = newSavedGames;
    console.log("New saved games list", allSavedGames);
    localStorageService.set('savedGames', allSavedGames);
  }

  function getPlayingGame() {
    console.log("Checking for old game");
    return localStorageService.get('currentPlaying') || null;
  }

  function setPlayingGame(gameName) {
    console.log("Currently playing: " + gameName);
    localStorageService.set('currentPlaying', gameName);
  }

  return {
    getSavedGames: getSavedGames,
    setSavedGames: setSavedGames,
    getPlayingGame: getPlayingGame,
    setPlayingGame: setPlayingGame
  };
});
