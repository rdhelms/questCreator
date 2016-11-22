angular.module('questCreator').controller('detailCtrl', function ($state, GameService, UserService) {

    this.playGame = function (name) {
        $state.go('main.game.play');
    };

    this.game = GameService.getGameDetail();

    this.sendCollabRequest = function (gameId) {
      var request = UserService.validateCollabRequest(gameId);
      //user has never requested collaboration
      if (request.message){
        UserService.sendCollabRequest(gameId);
        alert('Your request has been sent.');
      } else if (request.requested) {
        //success from this call indicates the user has already requested collaborator status
        alert('You have already requested to be a collaborator on this game. Be patient.');
      } else if (!request.requested) {
        alert('Okay...You have already requested to collaborate on this game and been turned down.  We will try again, but do not be annoying.');
        UserService.toggleRequested(gameId);
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
