if (false) {

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
