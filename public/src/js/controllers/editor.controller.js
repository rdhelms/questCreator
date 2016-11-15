angular.module('questCreator').controller('editorCtrl', function($state) {
  this.backgroundName = "Testing Background";
  $('.picker').draggable();
  $('#bg-canvas').droppable({
    drop: function(event, ui){
      console.log("drop it like it's hot");
    }
  });
});
