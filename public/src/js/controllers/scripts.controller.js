angular.module('questCreator').controller('scriptsCtrl', function($state) {
  this.possibleRequirements = [
    {
      type: 'Inventory',
      value: ''
    },
    {
      type: 'Achievement',
      value: 0
    },
    {
      type: 'Location',
      value: [1, 0, 0, 350, 250]
    }
  ];
  this.possibleResults = [
    {
      type: 'Inventory',
      value: ''
    },
    {
      type: 'Achievement',
      value: ''
    }
  ];
});
