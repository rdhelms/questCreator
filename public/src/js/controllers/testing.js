if (false) {

  // Thumbnail code:
  // In JS:
  // game.thumbnail = gameCanvas.toDataURL();
  // In HTML:
  // <img ng-cloak src="{{game.thumbnail}}">
  /* Also:
  clearCanvas();
  base_image = new Image();
  base_image.src = "./lib/images/logo.png";
  base_image.onload = function(){
    gameCtx.drawImage(base_image, 0, 0, gameWidth, gameHeight);
    self.thumbnail = gameCanvas.toDataURL();
    console.log(self.thumbnail);
  }
  */

  // Testing creation of avatar
  // var avatarTest = {
  //     name: 'Avatar Test',
  //     info: {
  //         // The x and y coordinate of the top left corner of the avatar
  //         pos: {
  //             x: 100,
  //             y: 250
  //         },
  //         // The character's speed
  //         speed: {
  //             mag: 3,
  //             x: 0,
  //             y: 0
  //         },
  //         // The animate object contains all the possible character actions with all of the frames to be drawn for each action.
  //         animate: {
  //             // Key: possible action, Value: array of frames
  //             walkLeft: [
  //                 // Each frame array element is an array of square objects to be drawn
  //                 // Frame 1 - walk left
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'blue'
  //                     }, {
  //                         x: 110,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'green'
  //                     }
  //                 ],
  //                 // Frame 2 - walk left
  //                 [
  //                     {
  //                         x: 110,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'blue'
  //                     }, {
  //                         x: 100,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'green'
  //                     }
  //                 ]
  //             ],
  //             walkRight: [
  //                 // Frame 1 - walk right
  //                 [
  //                     {
  //                         x: 150,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'blue'
  //                     }, {
  //                         x: 140,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'green'
  //                     }
  //                 ],
  //                 // Frame 2 - walk right
  //                 [
  //                     {
  //                         x: 140,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'blue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'green'
  //                     }
  //                 ]
  //             ],
  //             walkUp: [
  //                 // Frame 1 - walk up
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 110,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'red'
  //                     }, {
  //                         x: 150,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'yellow'
  //                     }
  //                 ],
  //                 // Frame 2 - walk up
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'red'
  //                     }, {
  //                         x: 150,
  //                         y: 110,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'yellow'
  //                     }
  //                 ]
  //             ],
  //             walkDown: [
  //                 // Frame 1 - walk down
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 140,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'red'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'yellow'
  //                     }
  //                 ],
  //                 // Frame 2 - walk down
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'red'
  //                     }, {
  //                         x: 150,
  //                         y: 140,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'yellow'
  //                     }
  //                 ]
  //             ],
  //             swimLeft: [
  //                 // Frame 1 - swim left
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }
  //                 ],
  //                 // Frame 2 - swim left
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }
  //                 ]
  //             ],
  //             swimRight: [
  //                 // Frame 1 - swim right
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }
  //                 ],
  //                 // Frame 2 - swim right
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }
  //                 ]
  //             ],
  //             swimUp: [
  //                 // Frame 1 - swim up
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }
  //                 ],
  //                 // Frame 2 - swim up
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }
  //                 ]
  //             ],
  //             swimDown: [
  //                 // Frame 1 - swim down
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'lightblue'
  //                     }
  //                 ],
  //                 // Frame 2 - swim down
  //                 [
  //                     {
  //                         x: 100,
  //                         y: 100,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }, {
  //                         x: 150,
  //                         y: 150,
  //                         width: 30,
  //                         height: 30,
  //                         color: 'gray'
  //                     }
  //                 ]
  //             ]
  //             // Other actions could go here
  //         },
  //         // The collision map is how the game can know whether the character has collided with another object or event trigger. It is an array of invisible (or gray for now) squares.
  //         collisionMap: [
  //             {
  //                 x: 100,
  //                 y: 180,
  //                 width: 80,
  //                 height: 10,
  //                 color: 'gray'
  //             }, {
  //                 x: 100,
  //                 y: 185,
  //                 width: 80,
  //                 height: 10,
  //                 color: 'gray'
  //             }
  //         ]
  //     },
  //     current: false
  // };

  var headerData = {
    user_id: UserService.get().id,
    token: UserService.get().token
  };

  // returns 3 separate arrays of objects with all asset information
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/articles/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns correct objects still broken out into backgrounds, obstacles, and entities.
  var testData = {
    // tags needs to be userInput from search.  As of now, the tags are limited to one search term.
    tags: 'sky',
  };

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/articles/search',
    data: testData,
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns all backgrounds
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/backgrounds/index',
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  //returns all characters (including all data re:character) that match the user ID given - see note below

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/characters/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns only one character and data that match the truthfulness of current boolean
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/characters/current_character',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns array of entities objects
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/entities/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns games based on a search term in their tags column in the database or the specific name
  var testData = {
    // tags needs to be userInput from search.  As of now, the tags are limited to one search term.
    tags: 'war',
  };

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/games/search',
    data: testData,
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns all games a user has created.
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/games/user-games',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  //returns all maps - we should probably add some sort of data validation like, per game request which will req game_id be sent in the data body.
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/maps/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns a specific map if name CONTAINS any part of the searched word
  var testData = {
    // this should be searched data from the user
    name: 'map 1',
  };

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/maps/search',
    data: testData,
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns all obstacles
  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/obstacles/index',
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });


  // returns searched scenes
  var testData = {
    name: 'scene',
  };

  $.ajax({
    method: 'GET',
    url: 'https://forge-api.herokuapp.com/scenes/search',
    data: testData,
    headers: headerData,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });
}
