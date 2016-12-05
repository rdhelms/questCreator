angular.module('questCreator').controller('objCtrl', function($state, $scope, EditorService) {
  var self = this;      // To help with scope issues
  var drawingObject = false;
  var currentMouseX = null;
  var currentMouseY = null;
  var mouseIsDown = false;
  var mouseMoveEvent;       // Global variable to track mouse movement events
  var touchMoveEvent;       // Global variable to track touch movement events
  var mobileWidth = 850;    // Width for mobile screen sizes
  var tabletWidth = 1100;   // Width for tablet screen sizes
  var tabletScale = 1.4;
  var mobileScaleX = 2.5;
  var mobileScaleY = 1.6;
  var moveType = '';    // Either mouse or touch
  var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
  var undoCollisionArray = [];
  this.currentColor = $scope.editor.currentColor;    // Value of color input in draw.html
  this.myCanvas = document.getElementById('obj-canvas');  // Canvas html element
  this.canvasPos = {    // Canvas top and left coordinates on page
    x: self.myCanvas.getBoundingClientRect().left,
    y: self.myCanvas.getBoundingClientRect().top
  };
  this.draw = this.myCanvas.getContext('2d'); // Canvas context
  var canvasWidth = self.myCanvas.width;
  var canvasHeight = self.myCanvas.height;
  this.allCollisionSquares = [];
  this.allBackgroundSquares = [];

  /*
  *   Rectangle object constructor
  *   @params
  *     x: horizontal coord of top left corner
  *     y: vertical coord of top left corner
  *     width: width of rectangle
  *     height: height of rectangle
  *     color: color of rectangle
  *   @methods
  *     draw: draw the rectangle on the canvas using its position, size, and color.
  */
  function Square(x, y, width, height, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
  }

  Square.prototype.draw = function() {
    self.draw.fillStyle = this.color;
    if (window.innerWidth <= mobileWidth) { // Mobile size
      self.draw.fillRect(this.x * mobileScaleX, this.y * mobileScaleY, this.width, this.height);
    } else if (window.innerWidth <= tabletWidth) { // Tablet size
      self.draw.fillRect(this.x * tabletScale, this.y / tabletScale, this.width, this.height);
    } else {  // Desktop size
      self.draw.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  $scope.$on('redrawObject', function(event, imageArr, collisionArray) {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    self.allBackgroundSquares = imageArr;
    self.allCollisionSquares = collisionArray;
    drawBackgroundSquares();
    drawCollisionSquares();
  });

  // Called when the mouse button is pressed.
  // Starts the interval to run every 100ms while the mouse button is still held down.
  // Only start the interval if it is not already running.
  function mouseDown(event) {
    mouseIsDown = true;
    // if (drawHandle === -1) {
    //   drawHandle = setInterval(mousePressed, 100);
    // }
  }

  // Called when the mouse button is released.
  // If the interval is running, then clear it and reset it.
  function mouseUp(event) {
    mouseIsDown = false;
    // if (drawHandle !== -1) {
    //   clearInterval(drawHandle);
    //   drawHandle = -1;
    // }
  }

  // Loop through the array of background objects and draw them all.
  function drawBackgroundSquares() {
    for (var index = 0; index < self.allBackgroundSquares.length; index++) {
      var square = self.allBackgroundSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }
  function drawCollisionSquares() {
    for (var index = 0; index < self.allCollisionSquares.length; index++) {
      var square = self.allCollisionSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }

  function drawGrid() {
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackgroundSquares();
    drawCollisionSquares();
    var drawSize = $scope.editor.currentPixelSize;
    self.canvasPos = {    // Canvas top and left coordinates on page
      x: self.myCanvas.getBoundingClientRect().left,
      y: self.myCanvas.getBoundingClientRect().top
    };
    var numSquaresX = 20;
    var numSquaresY = 20;
    var gridWidth = canvasWidth / numSquaresX;
    var gridHeight = canvasHeight / numSquaresY;
    var color = $scope.editor.drawingCollision ? 'rgba(100, 100, 100, 0.5)' : $scope.editor.currentColor;
    var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
    self.draw.fillStyle = color;
    for (var xIndex = -drawSize; xIndex <= drawSize; xIndex++) {
      for (var yIndex = -drawSize; yIndex <= drawSize; yIndex++) {
        var rectX = Math.floor( (currentMouseX - self.canvasPos.x) / gridWidth + xIndex) * gridWidth;
        var rectY = Math.floor( (currentMouseY - self.canvasPos.y) / gridHeight + yIndex) * gridHeight;
        if ($scope.editor.erasing) {
          self.draw.strokeStyle = 'black';
          self.draw.strokeRect(rectX, rectY, gridWidth, gridHeight);
        } else {
          self.draw.fillRect(rectX, rectY, gridWidth, gridHeight);
        }
        if (mouseIsDown) {
          if (!$scope.editor.drawingCollision) {
            var squaresToRemove = [];
            self.allBackgroundSquares.forEach(function(square) {
              if ( rectX === square.x && rectY === square.y) {
                // console.log("Erasing old squares!");
                squaresToRemove.push(self.allBackgroundSquares.indexOf(square));
              }
            });
            squaresToRemove.forEach(function(index) {
              self.allBackgroundSquares.splice(index, 1);
            });
          } else if ($scope.editor.drawingCollision) {
            var squaresToRemove = [];
            self.allCollisionSquares.forEach(function(square) {
              if ( rectX === square.x && rectY === square.y) {
                squaresToRemove.push(self.allCollisionSquares.indexOf(square));
              }
            });
            squaresToRemove.forEach(function(index) {
              self.allCollisionSquares.splice(index, 1);
            });
          }
        }
        if (mouseIsDown && !$scope.editor.erasing) {
          // console.log("Drawing New Square!");
          var newSquare = new Square(rectX, rectY, gridWidth, gridHeight, color, type);
          // newSquare.draw();
          if ($scope.editor.drawingCollision) {
            self.allCollisionSquares.push(newSquare);
          } else {
            self.allBackgroundSquares.push(newSquare);
          }
        }
      }
    }
    self.draw.beginPath();
    for (var index = 0; index <= canvasWidth; index += gridWidth) {
      self.draw.moveTo(index, 0);
      self.draw.lineTo(index, canvasHeight);
    }
    for (var index = 0; index <= canvasHeight; index += gridHeight) {
      self.draw.moveTo(0, index);
      self.draw.lineTo(canvasWidth, index);
    }
    self.draw.strokeStyle = 'rgba(75, 75, 75, 0.8)';
    self.draw.stroke();
    self.draw.closePath();
    // console.log("Background array", self.allBackgroundSquares);
    // console.log("Collision array", self.allCollisionSquares);
    if (drawingObject) {
      requestAnimationFrame(drawGrid);
    } else {
      self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
      drawBackgroundSquares();
    }
  }
  // if (loopHandle) {
  //   clearInterval(loopHandle);
  // }
  // var loopHandle = setInterval(drawGrid, 50);

  // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
  $('#tool-bar').on('click', '#undoObject', function() {
    if (!$scope.editor.drawingCollision && self.allBackgroundSquares.length > 0) {
      var lastObj = self.allBackgroundSquares.pop();
      undoBackgroundArray.push(lastObj);
    } else if ($scope.editor.drawingCollision && self.allCollisionSquares.length > 0) {
      var lastObj = self.allCollisionSquares.pop();
      undoCollisionArray.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
  });

  // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
  $('#tool-bar').on('click', '#redoObject', function() {
    if (!$scope.editor.drawingCollision && undoBackgroundArray.length > 0) {
      var lastObj = undoBackgroundArray.pop();
      self.allBackgroundSquares.push(lastObj);
    } else if ($scope.editor.drawingCollision && undoCollisionArray.length > 0) {
      var lastObj = undoCollisionArray.pop();
      self.allCollisionSquares.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
  });

  // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
  // Note: may need extra testing here.
  $('#tool-bar').on('click', '#clearObject', function() {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
  });

  // When the save button is clicked
  $('.asset-container').on('click', '#saveObject', function() {
    console.log("Saving Object!");
    EditorService.saveObject(self.allBackgroundSquares, self.allCollisionSquares, $scope.editor.currentObject, self.myCanvas.toDataURL()).done(function(object) {
      console.log(object);
    });
  });

  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('mousedown', mouseDown);
  $(self.myCanvas).on('mouseup', mouseUp);
  $(self.myCanvas).on('mouseenter', function() {
    drawingObject = true;
    requestAnimationFrame(drawGrid);
  });
  $(self.myCanvas).on('mouseleave', function() {
    drawingObject = false;
  });
  $(self.myCanvas).on('mousemove', function(event) {
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;
  });

  // Experimental touch screen support
  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('touchstart', mouseDown);
  $(self.myCanvas).on('touchend', mouseUp);
  $(self.myCanvas).on('touchcancel', mouseUp);
  $(self.myCanvas).on('touchmove', function(event) {
    moveType = 'touch';
    event.preventDefault();
    touchMoveEvent = event.touches[0];
    moved = true;
  });
});
