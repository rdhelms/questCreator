angular.module('questCreator')
    .controller('editorCtrl', function(
        $scope,
        $state,
        EditorService,
        UserService,
        PopupService,
        PaletteService
    ) {

        var self = this;

        this.dragCalls = 0;

        this.gameInfo = {};
        this.currentEditingGame = {
            name: UserService.getGameEdit(),
            description: '',
            info: this.gameInfo,
            tags: [],
            published: false
        };
        this.currentBackground = null;
        this.currentObject = null;
        this.currentEntity = null;
        this.currentScene = null;
        this.currentEvent = null;
        //NOTE probably can remove:
        // this.currentSceneImg = {};
        //NOTE probably can remove^
        this.currentLargeView = 'map';
        this.currentSmallView = 'welcome';
        this.assetsView = 'backgrounds';
        this.qState = {
          undo: 'undoBackground',
          redo: 'redoBackground',
          clear: 'clearBackground'
        };
        this.availableBackgrounds = [];
        this.availableObjects = [];
        this.availableEntities = [];
        this.availableEvents = [];
        this.eventTypes = [{
            name: 'text',
            description: 'Events triggered by text input.',
          }, {
            name: 'location',
            description: 'Events triggered by player position.'
        }];
        this.eventType = null;
        this.eventRequirements = [
            'inventory',
            'achievement'
        ];
        this.selectedAnimation = "walkLeft";

        this.currentColor = 'green';
        this.inputColor = 'green';
        this.colorPalette = {
          1: "skyblue",
          2: "green",
          3: "brown",
          4: "orange"
        };
        this.currentPixelSize = 4;
        this.drawingCollision = false;
        this.collisionType = 'wall';
        this.teleportTarget = {
          map: {},
          scene: {},
          pos: {
            x: 100,
            y: 100
          }
        };
        this.deathDescription = {
          text: "Game Over! Thanks for playing."
        };
        this.erasing = false;
        this.selectingAssets = false;
        this.currentFrameIndex = 0;
        this.modeledFrameIndex = 0; // For some reason ng-model is being wacky for the first click of navigating entity frames. This is the duct tape solution.
        this.dragIndex = null;
        this.dragAsset = null;

        this.goToPalette = function(type) {
            self.selectingAssets = true;
            $scope.$broadcast('paletteInit', {
                type: type
            });
        };

        this.selectColor = function(index) {
            // Convert hex color to rgb
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(self.inputColor);
            // console.log("color result: ", result);
            var rgb = result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
            self.colorPalette[index] = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
        };

        if (this.currentEditingGame.name === null) {
            PopupService.close();
            PopupService.open('create-game', $scope);
        } else {
            PopupService.close();
            PopupService.open('edit-game', $scope);
        }

        this.cancel = function() {
            PopupService.close();
            $state.go('main.profile');
        };


        this.createNewGame = function(name) {
            PopupService.close();
            EditorService.createGame(name).done(function(game) {
                // console.log(game);
                self.currentEditingGame = game;
                EditorService.getGameAssets(game.id).done(function(assets) {
                    // console.log(assets);
                    self.availableBackgrounds = assets.availableBackgrounds;
                    self.availableObjects = assets.availableObstacles;
                    self.availableEntities = assets.availableEntities;
                    self.availableEvents = assets.availableEvents;
                    self.currentBackground = self.availableBackgrounds[0] || null;
                    $scope.$apply();
                });
            });
            UserService.setGameEdit(name);
        };

        this.editGame = function() {
            PopupService.close();
            $scope.assetsToLoad = 0;
            $scope.assetsLoaded = 0;
            PopupService.open('loading-screen', $scope);
            EditorService.getGame(self.currentEditingGame.name).done(function(game) {
                self.currentEditingGame = game;
                EditorService.getGameAssets(game.id).done(function(assets) {
                    self.availableBackgrounds = assets.availableBackgrounds;
                    self.availableObjects = assets.availableObstacles;
                    self.availableEntities = assets.availableEntities;
                    self.availableEvents = assets.availableEvents;
                    game.info.maps.forEach(function(map) {
                      map.scenes.forEach(function(row) {
                        row.forEach(function(scene) {
                          if (scene.background) {
                            $scope.assetsToLoad++;
                            var backgroundId = scene.background.id;
                            // console.log(scene.background.info);
                            EditorService.getAssetInfo(backgroundId, 'backgrounds').done(function(info) {  // Get each background's info from the database
                                scene.background.info = info;
                                // console.log("Found background info!", scene.background.info);
                                $scope.assetsLoaded++;
                                $scope.$apply();
                            });
                            assets.availableBackgrounds.forEach(function(availableBackground) {
                              if (backgroundId === availableBackground.id) {
                                // console.log("Background match found!");
                                scene.background.thumbnail = availableBackground.thumbnail;
                              }
                            });
                          }
                          if (scene.entities) {
                            $scope.assetsToLoad += scene.entities.length;
                            scene.entities.forEach(function(entity) {
                              var entityId = entity.id;
                              // console.log(entity.info);
                              EditorService.getAssetInfo(entityId, 'entities').done(function(info) {  // Get each entity's info from the database
                                  entity.info.animate = info.animate;
                                  // console.log("Found entity info!", entity.info);
                                  $scope.assetsLoaded++;
                                  $scope.$apply();
                              });
                              assets.availableEntities.forEach(function(availableEntity) {
                                if (entityId === availableEntity.id) {
                                  // console.log("Entity match found!");
                                  entity.thumbnail = availableEntity.thumbnail;
                                }
                              });
                            });
                          }
                          if (scene.objects) {
                            $scope.assetsToLoad += scene.objects.length;
                            scene.objects.forEach(function(object) {
                              var objectId = object.id;
                              // console.log(object.info);
                              EditorService.getAssetInfo(objectId, 'objects').done(function(info) {  // Get each object's info from the database
                                  object.info.collisionMap = info.collisionMap;
                                  object.info.image = info.image;
                                  // console.log("Found object info!", object.info);
                                  $scope.assetsLoaded++;
                                  $scope.$apply();
                              });
                              assets.availableObstacles.forEach(function(availableObject) {
                                if (objectId === availableObject.id) {
                                  // console.log("Object match found!");
                                  object.thumbnail = availableObject.thumbnail;
                                }
                              });
                            });
                          }
                        });
                      });
                    });
                    var checkGameLoadLoop = setInterval(function() {
                      // console.log("Loading " + $scope.assetsToLoad + " assets.");
                      // console.log($scope.assetsLoaded + " assets loaded.");
                      var finishedLoading = false;
                      if ($scope.assetsLoaded >= $scope.assetsToLoad) {
                        finishedLoading = true;
                      }
                      if (finishedLoading) {
                        // console.log("Game Loaded!",game);
                        clearInterval(checkGameLoadLoop);
                        $scope.$apply();
                        PopupService.close();
                      }
                    }, 200);
                });
            });
            $('.edit-game').hide();
        };

        this.saveGame = function() {
          PopupService.close();
          PopupService.open('loading-screen');
            EditorService.saveGame(self.currentEditingGame).done(function(savedGame) {
                // console.log("Saved Game:", savedGame);
                PopupService.close();
            });
        };

        this.publishGame = function() {
            self.currentEditingGame.published = true;
            this.saveGame();
        };

        this.assetNamer = function(name, address) {
            if (self[address].filter(function(asset) {
                    return asset.name.includes(name.toLowerCase());
                })) {
                var num = 1;
                self[address].forEach(function(value) {
                    num = (value.name.includes(name.toLowerCase())) ? num + 1 : num;
                });
                name = name + " " + num;
            }
            return name;
        };

        this.createBackground = function() {
            var name = "New Background";
            var game_id = self.currentEditingGame.id;
            name = self.assetNamer(name, 'availableBackgrounds');
            EditorService.createBackground(name, game_id).done(function(background) {
                // console.log(background);
                self.availableBackgrounds.push(background);
                self.currentBackground = background;
                $scope.$apply();
            });
        };

        this.editBackground = function(background) {
            EditorService.getAssetInfo(background.id, 'backgrounds').done(function(info) {
                background.info = info;
                self.currentBackground = background;
                $scope.$broadcast('redrawBackground', background.info.image, background.info.collisionMap);
                $scope.$apply();
            });
        };

        this.createObject = function() {
            var name = "New Object";
            var game_id = self.currentEditingGame.id;
            name = self.assetNamer(name, 'availableObjects');
            EditorService.createObject(name, game_id).done(function(object) {
                // console.log(object);
                self.availableObjects.push(object);
                self.currentObject = object;
                self.currentSmallView = 'object';
                $scope.$apply();
            });
        };

        this.editObject = function(object) {
            EditorService.getAssetInfo(object.id, 'obstacles').done(function(info) {
                object.info = info;
                self.currentObject = object;
                self.currentSmallView = 'object';
                self.qState = {
                  undo: 'undoObject',
                  redo: 'redoObject',
                  clear: 'clearObject'
                };
                $scope.$broadcast('redrawObject', object.info.image, object.info.collisionMap);
                $scope.$apply();
            });
        };

        this.createEntity = function() {
            var name = "New Entity";
            var game_id = self.currentEditingGame.id;
            name = self.assetNamer(name, 'availableEntities');
            EditorService.createEntity(name, game_id).done(function(entity) {
                PopupService.close();
                self.availableEntities.push(entity);
                self.currentEntity = entity;
                self.currentSmallView = 'entity';
                $scope.$apply();
            });
        };

        this.editEntityFrame = function(entity) {
            self.currentFrameIndex = self.modeledFrameIndex || 0;
            EditorService.getAssetInfo(entity.id, 'entities').done(function(info) {
                entity.info = info;
                // console.log(entity);
                self.currentEntity = entity;
                self.currentSmallView = 'entity';
                self.qState = {
                  undo: 'undoEntity',
                  redo: 'redoEntity',
                  clear: 'clearEntity'
                };
                $scope.$broadcast('redrawEntity',entity.info.animate[self.selectedAnimation][self.currentFrameIndex].image, entity.info.animate[self.selectedAnimation][self.currentFrameIndex].collisionMap);
                $scope.$apply();
            });
        };

        this.selectEventType = function() {
            PopupService.open('event-prompt', $scope);
        };

        this.createEvent = function(type) {
            var name = "New Event";
            var game_id = self.currentEditingGame.id;
            EditorService.createEvent(name, type, game_id).done(function(event) {
                PopupService.close();
                self.availableEvents.push(event);
                self.currentEvent = event;
                self.currentSmallView = 'event';
                $scope.$apply();
            });
        };

        this.editEvent = function(event) {
            self.currentEvent = event;
            self.currentSmallView = 'event';
            $scope.$apply();
        };

        this.setThumbnail = function(asset) {
          if (asset) {
            if (asset === undefined || !asset.thumbnail) {
                return {
                    "background-image": "none"
                };
            } else {
                return {
                    "background-image": 'url("' + asset.thumbnail + '")',
                    "background-size": "contain",
                    "background-position": "center",
                    "background-repeat": "no-repeat"
                };
            }
          }
        };

        this.selectText = function($event) {
            $event.target.select();
        };

        this.positionAsset = function(asset) {
            return {
                'top': asset.info.pos.y,
                'left': asset.info.pos.x,
                'position': 'absolute'
            };
        };

        this.dragPositionAsset = function(index, type) {
            self.dragIndex = {
                index: index,
                type: type
            };
        };

        this.dragAvailableAsset = function(asset, type) {
            self.dragAsset = {
                asset: asset,
                type: type
            };
        };

        this.removeAsset = function(index, type) {
            self.currentScene[type].splice(index, 1);
        };

        //jquery UI Stuff
        this.uiDrag = function() {
            this.dragCalls++;
            $('.asset-in-scene').draggable({
                start: function(event, ui) {
                    $(ui.helper).addClass('grabbed');
                },
                stop: function(event, ui) {
                    $(ui.helper).css({
                        'transition': 'transform ease 100ms'
                    }).removeClass('grabbed');
                }
            });

            $('.asset.available').draggable({
                helper: function() {
                    var url = self.dragAsset.asset.thumbnail;
                    return $('<img>').attr('src', url).appendTo('#editor');
                },
                start: function(event, ui) {
                    $(ui.helper).addClass('grabbed');
                },
                stop: function(event, ui) {
                    $(ui.helper).css({
                        'transition': 'transform ease 100ms'
                    }).removeClass('grabbed');
                }
            });

            $('#scene-BG').droppable({
                drop: function(event, ui) {
                    // If already in scene editor view:
                    if (ui.draggable[0].className.toString().includes('-in-scene')) {
                        var type = self.dragIndex.type;
                        var index = self.dragIndex.index;
                        $scope.editor.currentScene[type][index].info.pos.x = ui.position.left;
                        $scope.editor.currentScene[type][index].info.pos.y = ui.position.top;
                        $scope.$apply();
                    }
                    // If dragging from available assets bar
                    else if (ui.draggable[0].className.toString().includes('available')) {
                        var type = self.dragAsset.type;
                        var asset = self.dragAsset.asset;
                        var offset = $('#scene-BG').offset();
                        EditorService.getAssetInfo(asset.id, type).done(function(info) {
                            // console.log(info);
                            asset.info = info;
                            asset.info.pos.x = event.pageX - offset.left;
                            asset.info.pos.y = event.pageY - offset.top;
                            $scope.editor.currentScene[type].push(asset);
                            $scope.$apply();
                        });
                    }
                }
            });
        };
    });
