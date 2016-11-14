angular.module('questCreator').controller('mainCtrl', function(socket, $state) {
  var apiKey = 'AIzaSyCe__2EGSmwp0DR-qKGqpYwawfmRsTLBEs';
  var clientId = '730683845367-tjrrmvelul60250evn5i74uka4ustuln.apps.googleusercontent.com';

  var auth2;

  var username = 'firstUser';


  // When the api has loaded, run the init function.
  gapi.load('client:auth2', initAuth);

  // Get authorization from the user to access profile info
  function initAuth() {
    gapi.client.setApiKey(apiKey);  // Define the apiKey for requests
    gapi.auth2.init({ // Define the clientId and the scopes for requests
        client_id: clientId,
        scope: 'profile'
    }).then(function() {
      auth2 = gapi.auth2.getAuthInstance(); // Store authInstance for easier accessibility
      console.log("Session authorized");
      auth2.isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(auth2.isSignedIn.get());
    });
  }

  function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
      $('#login').hide();
      $('#logout').show();
      console.log("Signed In!");
      getUserInfo();
    } else {
      $('#login').show();
      $('#logout').hide();
      console.log("Signed Out!");
    }
  }

  // Sign the user in to their google account when the sign in button is clicked
  function signIn() {
    auth2.signIn({
      prompt: 'login'
    });
  }

  // Sign the user out of their google account when the sign out button is clicked
  function signOut() {
    auth2.signOut();
  }

  // Get the name of the user who signed in.
  function getUserInfo() {
    var requestUser = gapi.client.request({
      path: 'https://people.googleapis.com/v1/people/me',
      method: 'GET'
    });
    requestUser.then(function(response) {
      console.log(response);
      console.log(auth2.currentUser.Ab.Zi.access_token);
      var token = auth2.currentUser.Ab.Zi.access_token;
      $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/users/create',
        data: {
          username: username,
          token: token
        },
        success: function(response) {
          console.log(response);
        },
        error: function(error) {
          console.log(error);
        }
      })
      // user.name = response.result.displayName;
      // console.log("Welcome, " + user.name + "!");
    }, function(error) {
      console.log(error);
    });
  }

  // When the user clicks the sign in button, prompt them to sign in to their google account.
  $('#login').click(function() {
    signIn();
  });

  // When the user clicks the sign out button, sign them out of their google account
  $('#logout').click(function() {
    signOut();
  });

});
