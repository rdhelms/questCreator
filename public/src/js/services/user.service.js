angular.module('questCreator')
    .service('UserService', function(PopupService, $state) {
        // Google Info
        var apiKey = 'AIzaSyCe__2EGSmwp0DR-qKGqpYwawfmRsTLBEs';
        var clientId = '730683845367-tjrrmvelul60250evn5i74uka4ustuln.apps.googleusercontent.com';
        var user = {
            uid: null,
            token: null,
            username: null,
            picture: null,
            id: null,
            games: null,
            joined: null,
            editGame: null
        };
        var loggedIn = false;

        function checkLogin() {
          return new Promise(function(resolve, reject) {
            var loopHandle = setInterval(function() {
              if (loggedIn) {
                resolve(true);
                clearInterval(loopHandle);
              }
            }, 20);
          });
        }

        //Get the current values for user data
        function getUser() {
          var userPromise = new Promise(
            function(resolve, reject) {
              resolve(user);
            }
          );
          return userPromise;
        }

        function setUser(adjUser) {
            user = adjUser;
        }

        function setGameEdit(name) {
            user.editGame = name;
        }

        function getGameEdit() {
            return user.editGame || null;
        }

        function archiveGame(gameId) {
            $.ajax({
                method: 'DELETE',
                url: 'https://forge-api.herokuapp.com/games/archive',
                data: {
                    id: gameId
                },
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                success: function(response) {
                    alert('Your game has been archived. If you ever want to see it again, click "Archived Games" below the list of your games. Carry on.');
                },
                error: function(error) {
                    alert('There was a problem archiving this game. Please try again.');
                }
            });
        }

        var auth2;
        // When the api has loaded, run the init function.
        gapi.load('client:auth2', initAuth);

        // Get authorization from the user to access profile info
        function initAuth() {
            gapi.client.setApiKey(apiKey); // Define the apiKey for requests
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
                getLogin();
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
        function getLogin() {
            var requestUser = gapi.client.request({
                path: 'https://people.googleapis.com/v1/people/me',
                method: 'GET'
            });
            requestUser.then(function(response) {
                user.picture = response.result.photos[0].url;
                user.uid = auth2.currentUser.Ab.El;
                user.token = auth2.currentUser.Ab.Zi.access_token;
                $.ajax({
                    method: 'PATCH',
                    url: 'https://forge-api.herokuapp.com/users/login',
                    data: {
                        uid: user.uid,
                        token: user.token
                    },
                    success: function(response) {
                        user.joined = response.created_at;
                        user.username = response.username;
                        user.id = response.id;
                        PopupService.open('welcome');
                        loggedIn = true;
                    },
                    error: function(error) {
                        if (error.status === 404) {
                            // $('#register-form').css('display', 'flex');
                            PopupService.open('user-register');
                        } else if (error.status === 0) {
                            // Do nothing
                        } else {
                            alert('There was a problem logging in. Please try again');
                            signOut();
                        }
                    }
                });
            });
        }

        function registerUser(username) {
            user.username = username;
            $.ajax({
                method: 'POST',
                url: 'https://forge-api.herokuapp.com/users/create',
                data: {
                    username: user.username,
                    uid: user.uid,
                    token: user.token
                },
                success: function(response) {
                    user.id = response.id;
                    // $('#register-form').css('display', 'none');
                    PopupService.open('user-register');
                },
                error: function(error) {
                    alert('There was a problem logging in. Please try again');
                    signOut();
                }
            });
        }

        function getUserGames() {
            return $.ajax({
                method: 'GET',
                url: 'https://forge-api.herokuapp.com/games/user-games',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                success: function(response) {
                    return response;
                },
                error: function(error) {
                    alert('There was a problem loading the profile. Please try again.');
                }
            });
            }

        function validateCollabRequest(gameId) {
            $.ajax({
                method: 'GET',
                url: 'https://forge-api.herokuapp.com/collaborators/existence',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                    game_id: gameId
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    return response;
                },
                error: function(error) {
                    return error;
                }
            });
        }

        function sendCollabRequest(gameId) {
            $.ajax({
                method: 'POST',
                url: 'https://forge-api.herokuapp.com/collaborators/create',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                    game_id: gameId
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    console.log(response.requested);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        function getCollabRequests() {
            return $.ajax({
                method: 'GET',
                url: 'https://forge-api.herokuapp.com/collaborators/user/requesters',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        function toggleAccepted(gameId) {
            $.ajax({
                method: 'PATCH',
                url: 'https://forge-api.herokuapp.com/collaborators/update/accepted',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                    game_id: gameId
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        function toggleRequested(gameId) {
            $.ajax({
                method: 'PATCH',
                url: 'https://forge-api.herokuapp.com/collaborators/update/requested',
                headers: {
                    user_id: user.id,
                    token: user.token
                },
                data: {
                  game_id: gameId
                },
                dataType: 'json',
                contentType: 'application/json',
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        return {
            get: getUser,
            set: setUser,
            setGameEdit: setGameEdit,
            getGameEdit: getGameEdit,
            getUserGames: getUserGames,
            validateCollabRequest: validateCollabRequest,
            sendCollabRequest: sendCollabRequest,
            getCollabRequests: getCollabRequests,
            toggleAccepted: toggleAccepted,
            toggleRequested: toggleRequested,
            archive: archiveGame,
            register: registerUser,
            signOut: signOut,
            signIn: signIn,
            checkLogin: checkLogin
        };
    });
