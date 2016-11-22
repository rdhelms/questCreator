angular.module('questCreator').controller('detailCtrl', function ($state, GameService, UserService) {

    this.playGame = function (name) {
        $state.go('main.game.play');
    };

    this.game = GameService.getGameDetail();

    this.sendCollabRequest = function (gameId) {
      var request = UserService.validateCollabRequest(gameId);
      if (request) {
        //success from this call indicates the user has already requested collaborator status
        alert('You have already requested to be a collaborator on this game.');
      } else if (request.response){
        //a particular type of failure indicates the user has permission to request collab status
        UserService.sendCollabRequest(gameId);
        alert('Your request has been sent.');
      } else {
        alert('There was a problem sending this collaboration request.  Please try again later.');
      }
    };

    //This is for testing only
    this.players = [
      {
        name: 'billy badass',
        score: 72,
        timeToComplete: '00:45:06'
      }, {
        name: 'jaime presley',
        score: 28,
        timeToComplete: 'incomplete'
      }, {
        name: 'rob helms',
        score: 56,
        timeToComplete: '02:32:06'
      }, {
        name: 'mr. toups',
        score: 61,
        timeToComplete: '01:28:15'
      }, {
        name: 'nate',
        score: 36,
        timeToComplete: 'incomplete'
      }, {
        name: 'fitch',
        score: 73,
        timeToComplete: '03:45:04'
      }];
});
