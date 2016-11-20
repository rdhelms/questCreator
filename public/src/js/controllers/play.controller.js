angular.module('questCreator').controller('playCtrl', function(socket, Avatar, Background, SceneObject, Entity, UserService, $state, $scope) {
  var gameCanvas = document.getElementById('play-canvas');
  var gameCtx = gameCanvas.getContext('2d');
  var gameWidth = 700;
  var gameHeight = 500;
  var typing = {
    show: false,
    phrase: ''
  };
  var responding = {
    show: false,
    phrase: ''
  };
  var inventory = {
    show: false,
    contents: ''
  }
  var pause = false;
  var startTime = new Date();

  var avatar = null;
  var background = null;
  var sceneObject = null;
  var entity = null;
  var scene = null;

  var avatarLoaded = false;
  var backgroundLoaded = false;
  var sceneObjectLoaded = false;
  var entityLoaded = false;
  var sceneLoaded = false;

  // // returns all games a user has created.
  // $.ajax({
  //   method: 'GET',
  //   url: 'https://forge-api.herokuapp.com/games/user-games',
  //   headers: headerData,
  //   success: function(response) {
  //     console.log(response);
  //   },
  //   error: function(error) {
  //     console.log(error);
  //   }
  // });

  // // Gets a specific game by name
  // var gameToGetInfo = {
  //   name: 'potter quest'
  // };
  // $.ajax({
  //   method: 'GET',
  //   url: 'https://forge-api.herokuapp.com/games/load',
  //   data: gameToGetInfo,
  //   success: function(response) {
  //     console.log(response);
  //   },
  //   error: function(error) {
  //     console.log(error);
  //   }
  // });

  // Step 1: Create Game (POST request to database)
  var gameInfo = {};
  var currentEditingGame = {
    name: 'Potter Quest 11', // Game ID in database is 16
    description: '',
    info: gameInfo,
    tags: [],
    published: false
  };
  // POST empty Game to database
  $('.createGameBtn').click(function() {
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/games/create',
      headers: headerData,
      data: JSON.stringify(currentEditingGame),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        currentEditingGame.id = response.id;
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  // Step 2: Create Background (POST request)
  var backgroundInfo = {
    image: [],
    collisionMap: []
  };
  var currentBackground = {
    name: 'Cupboard',   // ID in database is 123
    info: backgroundInfo,
    tags: [],
    published: true
  };
  $('.createBgBtn').click(function() {
    currentBackground.game_id = currentEditingGame.id;
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    // Background
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/backgrounds/create',
      headers: headerData,
      data: JSON.stringify(currentBackground),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        currentBackground.id = response.id;
        // background = new Background(response);
        // backgroundLoaded = true;
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // Step 3: Draw Background picture (stored in front end)
  $('.drawImgBgBtn').click(function() {
    console.log("Drawing Background Image");
    backgroundInfo.image = [{
            x: 0,
            y: 0,
            width: 700,
            height: 500,
            color: 'beige'
          }, {
            x: 150,
            y: 150,
            width: 50,
            height: 50,
            color: 'yellow'
          }];
  })

  // Step 4: Draw Background collision map (stored in front end)
  $('.drawColBgBtn').click(function() {
    console.log("Drawing Background Collision Map");
    backgroundInfo.collisionMap = [{
            type: 'wall',
            x: 150,
            y: 200,
            width: 50,
            height: 20,
            color: 'gray'
          }];
  });

  // Step 5: Save Background (PUT request to database)
  $('.saveBgBtn').click(function() {
    currentBackground.info = backgroundInfo;
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    // Background
    $.ajax({
      method: 'PUT',
      url: 'https://forge-api.herokuapp.com/backgrounds/update',
      headers: headerData,
      data: JSON.stringify(currentBackground),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        // background = new Background(response);
        // backgroundLoaded = true;
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // Step 6: Create Object
  var sceneObjectInfo = {
    pos: {
      x: 350,
      y: 250
    },
    image: [],
    collisionMap: []
  };
  var currentSceneObject = {
    name: 'Light Bulb',
    info: sceneObjectInfo,
    tags: [],
    published: false
  };
  $('.createObjBtn').click(function() {
    currentSceneObject.game_id = currentEditingGame.id;
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    // Object
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/obstacles/create',
      headers: headerData,
      data: JSON.stringify(currentSceneObject),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        currentSceneObject.id = response.id;
        // sceneObject = new SceneObject(response);
        // sceneObject.allActions = Object.keys(sceneObject.obj.animate);
        // sceneObject.action = sceneObject.allActions[0]; // The first action
        // sceneObject.obj.currentFrame = sceneObject.obj.animate[sceneObject.action][0]; // The first frame of the first action, whatever it is.
        // sceneObjectLoaded = true;
        // setInterval(checkSceneObjectAction, 75);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // Not currently animating objects
  // // Step X: Create Object Action
  // sceneObjectObj.animate.wave = [];

  // Step 7: Draw Object picture
  $('.drawImgObjBtn').click(function() {
    console.log("Drawing Object Image");
    sceneObjectInfo.image = [
          {
            x: 0,
            y: 0,
            width: 10,
            height: 100,
            color: 'brown'
          }, {
            x: 0,
            y: 0,
            width: 50,
            height: 10,
            color: 'red'
          }, {
            x: 50,
            y: 10,
            width: 50,
            height: 10,
            color: 'red'
          }];
  });

  // Step 9: Draw Object collision map
  $('.drawColObjBtn').click(function() {
    console.log("Drawing Object Collision Map");
    sceneObjectInfo.collisionMap = [
      {
        x: -10,
        y: 100,
        width: 10,
        height: 10,
        color: 'gray'
      }, {
        x: 0,
        y: 100,
        width: 10,
        height: 10,
        color: 'gray'
      }, {
        x: 0,
        y: 100,
        width: 10,
        height: 10,
        color: 'gray'
      }
    ];
  });

  // Step 10: Save Object (PUT Request)
  $('.saveObjBtn').click(function() {
    currentSceneObject.info = sceneObjectInfo;
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    // Object
    $.ajax({
      method: 'PUT',
      url: 'https://forge-api.herokuapp.com/obstacles/update',
      headers: headerData,
      data: JSON.stringify(currentSceneObject),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        // sceneObject = new SceneObject(response);
        // sceneObject.allActions = Object.keys(sceneObject.obj.animate);
        // sceneObject.action = sceneObject.allActions[0]; // The first action
        // sceneObject.obj.currentFrame = sceneObject.obj.animate[sceneObject.action][0]; // The first frame of the first action, whatever it is.
        // sceneObjectLoaded = true;
        // setInterval(checkSceneObjectAction, 75);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // Step 11: Create Entity
  var entityInfo = {
    pos: {
      x: 350,
      y: 250
    },
    speed: {
      mag: 3,
      x: 0,
      y: 0
    },
    animate: {},
    collisionMap: []
  };
  var currentEntity = {
    name: 'Rat',
    info: entityInfo,
    tags: [],
    published: false
  };
  $('.createEntityBtn').click(function() {
    currentEntity.game_id = currentEditingGame.id;
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    // Entity
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/entities/create',
      headers: headerData,
      data: JSON.stringify(currentEntity),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        currentEntity.id = response.id;
        // entity = new Entity(response);
        // console.log(entity);
        // entity.obj.currentFrame = entity.obj.animate[entity.action][0];
        // entityLoaded = true;
        // setInterval(checkEntityAction, 75);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // Step 12: Draw Entity picture frames per Action
  $('.drawImgEntityBtn').click(function() {
    console.log("Drawing Entity Image Frames");
    entityInfo.animate = {
      stand: [
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'orange'
        }, {
          x: 150,
          y: 100,
          width: 30,
          height: 30,
          color: 'purple'
        }],
        [{
          x: 110,
          y: 100,
          width: 30,
          height: 30,
          color: 'orange'
        }, {
          x: 140,
          y: 100,
          width: 30,
          height: 30,
          color: 'purple'
        }]
      ],
      walkLeft: [
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'purple'
        }, {
          x: 110,
          y: 150,
          width: 30,
          height: 30,
          color: 'orange'
        }],
        [{
          x: 110,
          y: 100,
          width: 30,
          height: 30,
          color: 'purple'
        }, {
          x: 100,
          y: 150,
          width: 30,
          height: 30,
          color: 'orange'
        }]
      ],
      walkRight: [
        [{
          x: 150,
          y: 100,
          width: 30,
          height: 30,
          color: 'purple'
        }, {
          x: 140,
          y: 150,
          width: 30,
          height: 30,
          color: 'orange'
        }],
        [{
          x: 140,
          y: 100,
          width: 30,
          height: 30,
          color: 'purple'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'orange'
        }]
      ],
      walkUp: [
        [{
          x: 100,
          y: 110,
          width: 30,
          height: 30,
          color: 'purple'
        }, {
          x: 150,
          y: 100,
          width: 30,
          height: 30,
          color: 'orange'
        }],
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'purple'
        }, {
          x: 150,
          y: 110,
          width: 30,
          height: 30,
          color: 'orange'
        }]
      ],
      walkDown: [
        [{
          x: 100,
          y: 140,
          width: 30,
          height: 30,
          color: 'purple'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'orange'
        }],
        [{
          x: 100,
          y: 150,
          width: 30,
          height: 30,
          color: 'purple'
        }, {
          x: 150,
          y: 140,
          width: 30,
          height: 30,
          color: 'orange'
        }]
      ],
      swimLeft: [
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'lightblue'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'lightblue'
        }],
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'gray'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'gray'
        }]
      ],
      swimRight: [
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'lightblue'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'lightblue'
        }],
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'gray'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'gray'
        }]
      ],
      swimUp: [
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'lightblue'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'lightblue'
        }],
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'gray'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'gray'
        }]
      ],
      swimDown: [
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'lightblue'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'lightblue'
        }],
        [{
          x: 100,
          y: 100,
          width: 30,
          height: 30,
          color: 'gray'
        }, {
          x: 150,
          y: 150,
          width: 30,
          height: 30,
          color: 'gray'
        }]
      ]
    };
  });

  // Step 13: Draw Entity collision map per Action
  $('.drawColEntityBtn').click(function() {
    console.log("Drawing Entity Collision Map");
    entityInfo.collisionMap = [
      {
        x: 100,
        y: 180,
        width: 80,
        height: 10,
        color: 'gray'
      }, {
        x: 100,
        y: 185,
        width: 80,
        height: 10,
        color: 'gray'
      }
    ];
  });

  // Step 14: Save Entity
  $('.saveEntityBtn').click(function() {
    currentEntity.info = entityInfo;
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    // Entity
    $.ajax({
      method: 'PUT',
      url: 'https://forge-api.herokuapp.com/entities/update',
      headers: headerData,
      data: JSON.stringify(currentEntity),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
        // entity = new Entity(response);
        // console.log(entity);
        // entity.obj.currentFrame = entity.obj.animate[entity.action][0];
        // entityLoaded = true;
        // setInterval(checkEntityAction, 75);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // Step 15: Create Event
  // Step 16: Specify Event trigger and response
  // Step 17: Save Event

  // Step 18: Create Scene
  // Step 19: Add Background to Scene
  // Step 20: Add Objects and Entities to Scene
  // Step 21: Set coordinates of Objects and Entities
  // sceneObjectObj = {
  //   x: 150,
  //   y: 100
  // },
  // entityObj.pos = {
  //   x: 50,
  //   y: 220
  // };

  // Step 22: Add events to Scene
  // Step 23: Save Scene
  // Step 24: Create Map
  // Step 25: Specify Scene coordinates within Map
  // Step 26: Save Map
  // Step 27: Save Game


  // Updating an asset (background, object, entity)
  /*
    1) User selects an existing public asset
    2) User draws on canvas and sets metadata.
    3) User clicks "save" button. All info is sent to database in PATCH request
    4) Info for saved asset also gets added to list of "current game assets" available to be placed into scenes.
  */

  // Updating a scene
  /*
    1) In the scene editor, user has available visible assets that have already been made and saved to the list of current game assets.
    2) Clicking on an asset will add that asset to the particular scene within the game object (and the scene preview will continually be looping through the game object to preview the game)
    3) Clicking the "save scene" button will update the game object with the most recent x,y positions of all the assets in the scene.
  */

  // Updating a map
  /*
    1) The list of maps will be visible.
    2) Clicking on a map will show all scenes for that map.
    3) Clicking on a scene will add it to the current map.
    4) The coordinates of the scene can be edited numerically. (x, y)
    5) Clicking the "save map" button will update the game object with the most recent arrangement of scenes.
  */

  // Updating a game
  /*
    1) Clicking the "save game" button will send a PATCH request to the database.
  */

  // Testing creation of avatar
  var avatarTest = {
    name: 'Avatar Test',
    obj: {
      // The x and y coordinate of the top left corner of the avatar
      pos: {
        x: 100,
        y: 100
      },
      // The character's speed
      speed: {
        mag: 3,
        x: 0,
        y: 0
      },
      // The animate object contains all the possible character actions with all of the frames to be drawn for each action.
      animate: {
        // Key: possible action, Value: array of frames
        walkLeft: [
          // Each frame array element is an array of square objects to be drawn
          // Frame 1 - walk left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'blue'
          }, {
            x: 110,
            y: 150,
            width: 30,
            height: 30,
            color: 'green'
          }],
          // Frame 2 - walk left
          [{
            x: 110,
            y: 100,
            width: 30,
            height: 30,
            color: 'blue'
          }, {
            x: 100,
            y: 150,
            width: 30,
            height: 30,
            color: 'green'
          }]
        ],
        walkRight: [
          // Frame 1 - walk right
          [{
            x: 150,
            y: 100,
            width: 30,
            height: 30,
            color: 'blue'
          }, {
            x: 140,
            y: 150,
            width: 30,
            height: 30,
            color: 'green'
          }],
          // Frame 2 - walk right
          [{
            x: 140,
            y: 100,
            width: 30,
            height: 30,
            color: 'blue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'green'
          }]
        ],
        walkUp: [
          // Frame 1 - walk up
          [{
            x: 100,
            y: 110,
            width: 30,
            height: 30,
            color: 'red'
          }, {
            x: 150,
            y: 100,
            width: 30,
            height: 30,
            color: 'yellow'
          }],
          // Frame 2 - walk up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'red'
          }, {
            x: 150,
            y: 110,
            width: 30,
            height: 30,
            color: 'yellow'
          }]
        ],
        walkDown: [
          // Frame 1 - walk down
          [{
            x: 100,
            y: 140,
            width: 30,
            height: 30,
            color: 'red'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'yellow'
          }],
          // Frame 2 - walk down
          [{
            x: 100,
            y: 150,
            width: 30,
            height: 30,
            color: 'red'
          }, {
            x: 150,
            y: 140,
            width: 30,
            height: 30,
            color: 'yellow'
          }]
        ],
        swimLeft: [
          // Frame 1 - swim left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim left
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimRight: [
          // Frame 1 - swim right
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim right
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimUp: [
          // Frame 1 - swim up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim up
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ],
        swimDown: [
          // Frame 1 - swim down
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'lightblue'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'lightblue'
          }],
          // Frame 2 - swim down
          [{
            x: 100,
            y: 100,
            width: 30,
            height: 30,
            color: 'gray'
          }, {
            x: 150,
            y: 150,
            width: 30,
            height: 30,
            color: 'gray'
          }]
        ]
        // Other actions could go here
      },
      // The collision map is how the game can know whether the character has collided with another object or event trigger. It is an array of invisible (or gray for now) squares.
      collisionMap: [
        {
          x: 100,
          y: 180,
          width: 80,
          height: 10,
          color: 'gray'
        }, {
          x: 100,
          y: 185,
          width: 80,
          height: 10,
          color: 'gray'
        }
      ]
    },
    current: false
  };

  // Testing creation of scene
  var sceneTest = {
    name: 'Scene Test 3',
    description: 'This is the opening scene for my game.',
    obj: {},
    game_id: 1,
    map_id: 1
  };

  // Testing creation of map
  var mapTest = {
    game_id: 1,
    name: 'Map Test 2',
    description: 'This is the main map for my game',
    obj: {
      canvasElems: [{
        x: 100,
        y: 100,
        width: 30,
        height: 30,
        color: 'blue'
      }],
      collisionMap: [{
        x: 300,
        y: 300,
        width: 30,
        height: 30,
        color: 'red'
      }]
    }
  };

  $('.createAvatarBtn').click(function() {
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    // Avatar
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/characters/create',
      headers: headerData,
      data: JSON.stringify(avatarTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        avatar = new Avatar(response);
        avatar.obj.currentFrame = avatar.obj.animate.walkLeft[0];
        avatarLoaded = true;
        setInterval(checkAvatarAction, 75);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // Scene
  $('.createSceneBtn').click(function() {
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/scenes/create',
      headers: headerData,
      data: JSON.stringify(sceneTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // Map
  $('.createMapBtn').click(function() {
    var headerData = {
      user_id: UserService.get().id,
      token: UserService.get().token
    };
    $.ajax({
      method: 'POST',
      url: 'https://forge-api.herokuapp.com/maps/create',
      headers: headerData,
      data: JSON.stringify(mapTest),
      dataType: 'json',
      contentType: 'application/json',
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  })

  $('body').off('keyup').on('keyup', function(event) {
    var keyCode = event.which;
    if (keyCode === 37) {
      avatar.action = (avatar.action === 'walkLeft') ? 'stand' : 'walkLeft';
      avatar.obj.speed.x = (avatar.obj.speed.x === -1 * avatar.obj.speed.mag) ? 0 : -1 * avatar.obj.speed.mag;
      avatar.obj.speed.y = 0;
    } else if (keyCode === 38) {
      avatar.action = (avatar.action === 'walkUp') ? 'stand' : 'walkUp';
      avatar.obj.speed.x = 0;
      avatar.obj.speed.y = (avatar.obj.speed.y === -1 * avatar.obj.speed.mag) ? 0 : -1 * avatar.obj.speed.mag;
    } else if (keyCode === 39) {
      avatar.action = (avatar.action === 'walkRight') ? 'stand' : 'walkRight';
      avatar.obj.speed.x = (avatar.obj.speed.x === avatar.obj.speed.mag) ? 0 : avatar.obj.speed.mag;
      avatar.obj.speed.y = 0;
    } else if (keyCode === 40) {
      avatar.action = (avatar.action === 'walkDown') ? 'stand' : 'walkDown';
      avatar.obj.speed.x = 0;
      avatar.obj.speed.y = (avatar.obj.speed.y === avatar.obj.speed.mag) ? 0 : avatar.obj.speed.mag;
    }
  });

  $('body').off('keypress').on('keypress', function(event) {
    var keyCode = event.which;
    if (typing.show && keyCode >= 32 && keyCode <= 220 && !responding.show && $('.active').length === 0) {
      pause = true;
      var char = String.fromCharCode(keyCode);
      typing.phrase += char;
      $('.typing').text(typing.phrase);
    } else if (keyCode === 13) {
      // Enter
        if (typing.show) { // If the user is finishing typing
          typing.show = false;
          $('.typing').hide();
          var userPhrase = typing.phrase;
          typing.phrase = '';
          checkTyping(userPhrase);
        } else if (responding.show) { // If the user is finished reading a response
          responding.show = false;
          $('.dialog').hide();
          responding.phrase = '';
        } else if (inventory.show) { // If the user is finished looking at inventory
          // $('.inventoryContainer').hide();
          // this.inventory.show = false;
        }
        if (!responding.show && !inventory.show && $('.active').length === 0) { // Resume the game if all windows have been closed
          pause = false;
        }
    } else if (keyCode === 32) {
      // Space
      if (!typing.show) {
        typing.phrase = '>';
        typing.show = true;
        $('.typing').text(typing.phrase).show();
      }
    }
  });

  function checkTyping(phrase) {
    if (phrase.includes('look')) {
      responding.phrase = "This is a description of your current scene. I hope it's helpful.";
    } else {
      responding.phrase = "I don't understand that.";
    }
    $('.dialog').text(responding.phrase).show();
    responding.show = true;
    pause = true;
  }

  function checkAvatarCollisions() {
    var collision = {
      found: false,
      direction: 'none',
      type: 'none'
    };
    avatar.obj.collisionMap.forEach(function(avatarSquare) {  // Loop through all the avatar squares
      var avatarLeft = avatarSquare.x + avatar.obj.pos.x;
      var avatarRight = avatarSquare.x + avatarSquare.width + avatar.obj.pos.x;
      var avatarTop = avatarSquare.y + avatar.obj.pos.y;
      var avatarBottom = avatarSquare.y + avatarSquare.height + avatar.obj.pos.y;
      background.obj.collisionMap.forEach(function(bgSquare) {  // Loop through all the background's squares
        var bgLeft = bgSquare.x;
        var bgRight = bgSquare.x + bgSquare.width;
        var bgTop = bgSquare.y;
        var bgBottom = bgSquare.y + bgSquare.height;
        // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current bg square (in those exact orders).
        if (avatarLeft <= bgRight && avatarRight >= bgLeft && avatarTop <= bgBottom && avatarBottom >= bgTop) {
          collision.found = true;
          collision.type = 'wall';
          if (avatar.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (avatar.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (avatar.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (avatar.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
      sceneObject.obj.collisionMap.forEach(function(objSquare) {  // Loop through all the scene object's squares
        var objLeft = objSquare.x + sceneObject.obj.pos.x;
        var objRight = objSquare.x + objSquare.width + sceneObject.obj.pos.x;
        var objTop = objSquare.y + sceneObject.obj.pos.y;
        var objBottom = objSquare.y + objSquare.height + sceneObject.obj.pos.y;
        // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
        if (avatarLeft <= objRight && avatarRight >= objLeft && avatarTop <= objBottom && avatarBottom >= objTop) {
          collision.found = true;
          collision.type = 'wall';
          if (avatar.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (avatar.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (avatar.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (avatar.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
      entity.obj.collisionMap.forEach(function(entitySquare) {  // Loop through all the scene object's squares
        var entityLeft = entitySquare.x + entity.obj.pos.x;
        var entityRight = entitySquare.x + entitySquare.width + entity.obj.pos.x;
        var entityTop = entitySquare.y + entity.obj.pos.y;
        var entityBottom = entitySquare.y + entitySquare.height + entity.obj.pos.y;
        // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
        if (avatarLeft <= entityRight && avatarRight >= entityLeft && avatarTop <= entityBottom && avatarBottom >= entityTop) {
          collision.found = true;
          collision.type = 'wall';
          if (avatar.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (avatar.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (avatar.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (avatar.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
    });

    if (collision.found) {
      switch (collision.type) {
        case 'wall':
          avatar.collide(collision.direction);
          break;
      }
      collision = {
        found: false,
        direction: 'none',
        type: 'none'
      };
    }
  }

  function checkEntityCollisions() {
    var collision = {
      found: false,
      direction: 'none',
      type: 'none'
    };
    entity.obj.collisionMap.forEach(function(entitySquare) {  // Loop through all the entity squares
      var entityLeft = entitySquare.x + entity.obj.pos.x;
      var entityRight = entitySquare.x + entitySquare.width + entity.obj.pos.x;
      var entityTop = entitySquare.y + entity.obj.pos.y;
      var entityBottom = entitySquare.y + entitySquare.height + entity.obj.pos.y;
      background.obj.collisionMap.forEach(function(bgSquare) {  // Loop through all the background's squares
        var bgLeft = bgSquare.x;
        var bgRight = bgSquare.x + bgSquare.width;
        var bgTop = bgSquare.y;
        var bgBottom = bgSquare.y + bgSquare.height;
        // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current bg square (in those exact orders).
        if (entityLeft <= bgRight && entityRight >= bgLeft && entityTop <= bgBottom && entityBottom >= bgTop) {
          collision.found = true;
          collision.type = 'wall';
          if (entity.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (entity.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (entity.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (entity.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
      sceneObject.obj.collisionMap.forEach(function(objSquare) {  // Loop through all the scene object's squares
        var objLeft = objSquare.x + sceneObject.obj.pos.x;
        var objRight = objSquare.x + objSquare.width + sceneObject.obj.pos.x;
        var objTop = objSquare.y + sceneObject.obj.pos.y;
        var objBottom = objSquare.y + objSquare.height + sceneObject.obj.pos.y;
        // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
        if (entityLeft <= objRight && entityRight >= objLeft && entityTop <= objBottom && entityBottom >= objTop) {
          collision.found = true;
          collision.type = 'wall';
          if (entity.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (entity.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (entity.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (entity.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
      avatar.obj.collisionMap.forEach(function(avatarSquare) {  // Loop through all the scene object's squares
        var avatarLeft = avatarSquare.x + avatar.obj.pos.x;
        var avatarRight = avatarSquare.x + avatarSquare.width + avatar.obj.pos.x;
        var avatarTop = avatarSquare.y + avatar.obj.pos.y;
        var avatarBottom = avatarSquare.y + avatarSquare.height + avatar.obj.pos.y;
        // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
        if (entityLeft <= avatarRight && entityRight >= avatarLeft && entityTop <= avatarBottom && entityBottom >= avatarTop) {
          collision.found = true;
          collision.type = 'wall';
          if (entity.obj.speed.x > 0) {
            collision.direction = 'right';
          } else if (entity.obj.speed.x < 0) {
            collision.direction = 'left';
          } else if (entity.obj.speed.y < 0) {
            collision.direction = 'up';
          } else if (entity.obj.speed.y > 0) {
            collision.direction = 'down';
          }
        }
      });
    });

    if (collision.found) {
      switch (collision.type) {
        case 'wall':
          entity.collide(collision.direction);
          break;
      }
      collision = {
        found: false,
        direction: 'none',
        type: 'none'
      };
    }
  }

  function updateAvatar() {
    avatar.updatePos();
  }

  function updateEntity() {
    entity.updatePos();
  }

  // NOTE: these frame index variables should probably belong to the individual avatar, object, or entity in the factory
  var currentAvatarFrameIndex = 0;
  function checkAvatarAction() {
    if (avatar.action === 'walkLeft' || avatar.action === 'walkUp' || avatar.action === 'walkRight' || avatar.action === 'walkDown') {
      if (currentAvatarFrameIndex > avatar.obj.animate[avatar.action].length - 1) {
        currentAvatarFrameIndex = 0;
      }
      avatar.obj.currentFrame = avatar.obj.animate[avatar.action][currentAvatarFrameIndex];
      currentAvatarFrameIndex++;
    } else {
      // Do nothing, or set frame to a given specific frame.
      // avatar.obj.currentFrame = avatar.obj.animate.walkLeft[0];
    }
  }

  var currentSceneObjFrameIndex = 0;
  function checkSceneObjectAction() {
    // Animate the object.
    if (currentSceneObjFrameIndex > sceneObject.obj.animate[sceneObject.allActions[0]].length - 1) {
      currentSceneObjFrameIndex = 0;
    }
    sceneObject.obj.currentFrame = sceneObject.obj.animate[sceneObject.allActions[0]][currentSceneObjFrameIndex];
    currentSceneObjFrameIndex++;
  }

  var currentEntityFrameIndex = 0;
  function checkEntityAction() {
    if (entity.action === 'stand' || entity.action === 'walkLeft' || entity.action === 'walkUp' || entity.action === 'walkRight' || entity.action === 'walkDown') {
      switch (entity.action) {
        case 'walkLeft':
          entity.obj.speed.x = -1;
          entity.obj.speed.y = 0;
          break;
        case 'walkUp':
          entity.obj.speed.x = 0;
          entity.obj.speed.y = -1;
          break;
        case 'walkRight':
          entity.obj.speed.x = 1;
          entity.obj.speed.y = 0;
          break;
        case 'walkDown':
          entity.obj.speed.x = 0;
          entity.obj.speed.y = 1;
          break;
      }
      // Animate the entity.
      if (currentEntityFrameIndex > entity.obj.animate[entity.action].length - 1) {
        currentEntityFrameIndex = 0;
      }
      entity.obj.currentFrame = entity.obj.animate[entity.action][currentEntityFrameIndex];
      currentEntityFrameIndex++;
    }
  }

  function drawAvatar() {
    // Save the drawing context
    gameCtx.save();
    // Translate the canvas origin to be the top left of the avatar
    gameCtx.translate(avatar.obj.pos.x, avatar.obj.pos.y);
    // Draw the squares from the avatar's current frame
    avatar.obj.currentFrame.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.globalAlpha = 0.2;
    // Draw the avatar's collision map (purely for testing)
    avatar.obj.collisionMap.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.restore();
  }

  function drawBackground() {
    // Save the drawing context
    gameCtx.save();
    // Draw the squares from the background object.
    gameCtx.globalCompositeOperation = "destination-over";
    for (var index = background.obj.image.length - 1; index >= 0; index--) {
      var square = background.obj.image[index];
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    }
    gameCtx.globalCompositeOperation = "source-over";
    gameCtx.globalAlpha = 0.2;
    // Draw the background's collision map (purely for testing)
    background.obj.collisionMap.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.restore();
  }

  function drawObjects() {
    // Save the drawing context
    gameCtx.save();
    // Translate the canvas origin to be the top left of the sceneObject
    gameCtx.translate(sceneObject.obj.pos.x, sceneObject.obj.pos.y);
    // Draw the squares from the sceneObject's current frame
    gameCtx.globalCompositeOperation = "destination-over";  // If object is behind character.
    // gameCtx.globalCompositeOperation = "source-over";    // If object is in front of character.
    sceneObject.obj.currentFrame.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.globalAlpha = 0.2;
    // Draw the sceneObject's collision map (purely for testing)
    sceneObject.obj.collisionMap.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.restore();
  }

  function drawEntities() {
    // Save the drawing context
    gameCtx.save();
    // Translate the canvas origin to be the top left of the entity
    gameCtx.translate(entity.obj.pos.x, entity.obj.pos.y);
    // Draw the squares from the entity's current frame
    gameCtx.globalCompositeOperation = "destination-over";  // If object is behind character.
    // gameCtx.globalCompositeOperation = "source-over";    // If object is in front of character.
    entity.obj.currentFrame.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.globalAlpha = 0.2;
    // Draw the entity's collision map (purely for testing)
    entity.obj.collisionMap.forEach(function(square) {
      gameCtx.fillStyle = square.color;
      gameCtx.fillRect(square.x, square.y, square.width, square.height);
    });
    gameCtx.restore();
  }

  function clearCanvas() {
    gameCtx.clearRect(0, 0, gameWidth, gameHeight);
  }

  var initialized = false;
  function runGame() {
    clearCanvas();
    // Draw avatar if it has been loaded
    if (avatarLoaded && backgroundLoaded && sceneObjectLoaded && entityLoaded && !initialized) {
      sceneTest.obj = {
        avatar: avatar,
        background: background,
        objects: [sceneObject],
        entities: [entity]
      };
      avatar = sceneTest.obj.avatar;
      background = sceneTest.obj.background;
      sceneObject = sceneTest.obj.objects[0];
      entity = sceneTest.obj.entities[0];
      initialized = true;
      console.log(sceneTest);
      console.log(JSON.stringify(sceneTest.obj));
    }
    if (initialized) {
      checkAvatarCollisions();
      checkEntityCollisions();
      updateAvatar();
      updateEntity();
      drawAvatar();
      drawEntities();
      drawObjects();
      drawBackground();
    }
    requestAnimationFrame(runGame);
  }
  requestAnimationFrame(runGame);

  /*
  // Socket functionality
  var socketId;
  var charInfo;
  var allPlayers = [];

  socket.emit('game joined');

  socket.off('old player found');
  socket.on('old player found', function(oldCharInfo) {
    console.log("Found old player");
    // Add old player to array of players
    allPlayers.push(oldCharInfo);
  });

  socket.off('new player joining');
  socket.on('new player joining', function(newCharInfo) {
    var response = {
      oldCharInfo: charInfo,
      id: newCharInfo.id
    };
    // Add new player to array of players
    allPlayers.push(newCharInfo);
    // Send response from old player to new player
    socket.emit('send old player', response);
  });

  socket.off('updating player');
  socket.on('updating player', function(playerUpdate) {
    // Find the player who is being updated, and update their details
  });

  socket.off('player left');
  socket.on('player left', function(playerId) {
    console.log("Player left!");
    allPlayers.forEach(function(player, index) {
      if (player.id === playerId) {
        //Remove player from array here
      }
    });
  });

  var loopHandle;
  socket.off('create character');
  socket.on('create character', function(id) {
    socketId = id;
    var x = Math.round( Math.random() * gameWidth);
    var y = Math.round( Math.random() * gameHeight);
    var speedX = 0;
    var speedY = 0;
    var r = Math.round( Math.random() * 255 );
    var g = Math.round( Math.random() * 255 );
    var b = Math.round( Math.random() * 255 );
    var color = 'rgb(' + r + ', ' + g + ',' + b + ')';
    var newCharInfo = {
      id: id,
      x: x,
      y: y,
      speedX: speedX,
      speedY: speedY,
      color: color
    };
    allPlayers.push(newCharInfo);
    charInfo = newCharInfo;
    socket.emit('send new player', charInfo);   // Send this player to other users
    gameCtx.fillStyle = color;
    gameCtx.fillRect(x,y,100,100);
    loopHandle = setInterval(function() {
      x += speedX;
      y += speedY;
      charUpdate = {
        id: id,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        color: color
      }
      // Update the x and y position of the current player
      allPlayers.forEach(function(player, index) {
        if (player.id === id) {
          allPlayers[index] = charUpdate;
        }
      });
      socket.emit('player update', charUpdate);
      redrawGame();
    }, 20);
    $('body').off().on('keydown', function(event) {
      var keyCode = event.keyCode;
      if (keyCode === 37) {
        speedX += -1;
      } else if (keyCode === 38) {
        speedY += -1;
      } else if (keyCode === 39) {
        speedX += 1;
      } else if (keyCode === 40) {
        speedY += 1;
      }
    });
  });

  function redrawGame() {
    gameCtx.clearRect(0, 0, gameWidth, gameHeight);
    allPlayers.forEach(function(player) {
      gameCtx.fillStyle = player.color;
      gameCtx.fillRect(player.x, player.y, 100, 100);
    });
  }

  $scope.$on("$destroy", function(){
    socket.emit('game left');
    clearInterval(loopHandle);
  });

  // Chat messages
  $('.chat-submit').submit(function(){
    socket.emit('chat message', $('.message').val());
    $('.message').val('');
    return false;
  });
  socket.off('chat message');
  socket.on('chat message', function(msg){
    $('.chat-messages').append($('<li>').text(msg));
  });
  */
});
