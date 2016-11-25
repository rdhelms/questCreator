angular.module('questCreator').service('EditorService', function (UserService, $state) {

    var drawingCopy = {
      image: [],
      collision: []
    };

    function copy(image, collision) {
      drawingCopy = {
        image: image,
        collision: collision
      };
    }

    function paste(type) {
      if (type === 'image') {
        return drawingCopy.image;
      } else if (type === 'collision') {
        return drawingCopy.collision;
      }
    }

    function getGame(name) {
      var nameWrapper = {
        name: name.toLowerCase()
      }
      return $.ajax({
        method: 'GET',
        url: 'https://forge-api.herokuapp.com/games/load',
        data: nameWrapper,
        success: function(response) {
          return response;
        },
        error: function(error) {
          alert('There was a problem loading this game');
        }
      });
    }

    function getGameAssets(game_id) {
        var headerData = {
          user_id: UserService.get().id,
          token: UserService.get().token
        };
        var data = {
          game_id: game_id
        };
        return $.ajax({
          method: 'GET',
          url: 'https://forge-api.herokuapp.com/articles/game/all',
          headers: headerData,
          data: data,
          success: function(response) {
            return response;
          },
          error: function(error) {
            console.log(error);
          }
        });
    }

    function createGame(name) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var titleScene = {
        name: 'Title Screen',
        pos: [0,0,0],
        background: null,
        objects: [],
        entities: []
      };
      var titleMap = {
        name: 'Title Map',
        scenes: [
          [titleScene]
        ]
      };
      var game = {
        name: name,
        description: "",
        tags: [],
        info: {
          maps: [
            titleMap
          ]
        }
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/games/create',
        data: JSON.stringify(game),
        headers: headerData,
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          game = response;
          createBackground('Title Screen', game.id)
          createCollaborator(game.id).done(function(response) {
            console.log(response);
          });
          return game;
        },
        error: function(error) {
          alert('There was a problem creating this game. Please try again.');
          $state.go('main.landing');
        }
      });
    }

    function createCollaborator(game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var data = {
        game_id: game_id,
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/collaborators/self',
        headers: headerData,
        data: data,
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveGame(game) {
      var gameUpdateData = {
        name: game.name,
        id: game.id,
        tags: game.tags,
        description: game.description,
        info: game.info,
        published: true,
        thumbnail: game.info.maps[0].scenes[0][0].background.thumbnail || null
      };
      console.log(gameUpdateData);
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/games/update',
        headers: headerData,
        data: JSON.stringify(gameUpdateData),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function createBackground(name, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var backgroundInfo = {
        image: [],
        collisionMap: []
      };
      var currentBackground = {
        name: name,
        info: backgroundInfo,
        tags: [],
        published: true,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/backgrounds/create',
        headers: headerData,
        data: JSON.stringify(currentBackground),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveBackground(imageArr, collisionArr, currentBackground, thumbnail) {
      currentBackground.info.image = imageArr;
      currentBackground.info.collisionMap = collisionArr;
      currentBackground.thumbnail = thumbnail;
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/backgrounds/update',
        headers: headerData,
        data: JSON.stringify(currentBackground),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function createObject(name, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var objectInfo = {
        pos: {
          x: 350,
          y: 250
        },
        image: [],
        collisionMap: []
      };
      var currentObject = {
        name: name,
        info: objectInfo,
        tags: [],
        published: false,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/obstacles/create',
        headers: headerData,
        data: JSON.stringify(currentObject),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveObject(imageArr, collisionArr, currentObject, thumbnail) {
      currentObject.info.image = imageArr;
      currentObject.info.collisionMap = collisionArr;
      currentObject.thumbnail = thumbnail;
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/obstacles/update',
        headers: headerData,
        data: JSON.stringify(currentObject),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function createEntity(name, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var entityInfo = {
        pos: {
          x: 350,
          y: 250
        },
        animate: {
          walkLeft: [
            {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }
          ],
          walkRight: [
            {
              image: [],
              collisionMap: []
            },
            {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }
          ],
          walkUp: [
            {
              image: [],
              collisionMap: []
            },
            {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }
          ],
          walkDown: [
            {
              image: [],
              collisionMap: []
            },
            {
              image: [],
              collisionMap: []
            }, {
              image: [],
              collisionMap: []
            }
          ]
        }
      };
      var currentEntity = {
        name: name,
        info: entityInfo,
        tags: [],
        published: false,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/entities/create',
        headers: headerData,
        data: JSON.stringify(currentEntity),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveEntity(imageArr, collisionArr, currentEntity, currentAnimation, frameIndex, thumbnail) {
      currentEntity.info.animate[currentAnimation][frameIndex].image = imageArr;
      currentEntity.info.animate[currentAnimation][frameIndex].collisionMap = collisionArr;
      currentEntity.thumbnail = thumbnail;
      currentEntity.published = true;
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/entities/update',
        headers: headerData,
        data: JSON.stringify(currentEntity),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    // NOTE I HAVE NO IDEA IF THIS WORKS, NOT TESTED YET:
    // --TOUPS

    function deleteEntity(currentEntity){
      return $.ajax({
        method: 'DELETE',
        url: 'https://forge-api.herokuapp.com/entities/delete',
        headers: headerData,
        data: JSON.stringify(currentEntity),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      })
    }

    function createEvent(name, type, game_id) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      var eventInfo = {};
      // Event categories:
      // -typing
      // -eventually more here
      switch (type) {
        case 'typing':
          eventInfo = {
            requirements: [],
            words: [],
            response: []
          };
          break;
      }
      var newEvent = {
        name: name,
        category: type,
        info: eventInfo,
        tags: [],
        published: false,
        game_id: game_id
      };
      return $.ajax({
        method: 'POST',
        url: 'https://forge-api.herokuapp.com/events/create',
        headers: headerData,
        data: JSON.stringify(newEvent),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          console.log(response);
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    function saveEvent(eventUpdate) {
      var headerData = {
        user_id: UserService.get().id,
        token: UserService.get().token
      };
      return $.ajax({
        method: 'PUT',
        url: 'https://forge-api.herokuapp.com/obstacles/update',
        headers: headerData,
        data: JSON.stringify(eventUpdate),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          console.log(response);
          return response;
        },
        error: function(error) {
          console.log(error);
        }
      });
    }

    return {
      getGame: getGame,
      getGameAssets: getGameAssets,
      createGame: createGame,
      saveGame: saveGame,
      createBackground: createBackground,
      saveBackground: saveBackground,
      createObject: createObject,
      saveObject: saveObject,
      createEntity: createEntity,
      saveEntity: saveEntity,
      deleteEntity: deleteEntity,
      createEvent: createEvent,
      saveEvent: saveEvent,
      copy: copy,
      paste: paste
    };
});
