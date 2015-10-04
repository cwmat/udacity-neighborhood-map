// Points of interest - map.js will populate this
var initialPlaces = [{
  name: "Sammy T's",
  blurb: 'Good place to go and stuff',
}, {
  name: "J Brian's",
  blurb: 'Favorite bar',
}, {
  name: "Paul's Bakery",
  blurb: 'Good doughnuts!',
}, ]

// function init() {
//   // initMap();
//   setTimeout(initMap(), 5000);
// }

var Layer = function(data) {
  this.name = ko.observable(data.name);
  this.blurb = ko.observable(data.blurb);
  this.properName = ko.observable(data.properName);
  this.address = ko.observable(data.address);
  this.imgSrc = ko.observable(data.imgSrc);
  this.infoWindow = ko.observable(data.infoWindow);
  this.clicker = ko.observable(data.clicker);
  this.placeID = ko.observable(data.placeID);
}

var ViewModel = function() {
  var self = this;

  this.layerList = ko.observableArray([]);

  initialPlaces.forEach(function(layerItem) {
    self.layerList.push(new Layer(layerItem));
  });

  this.currentLayer = ko.observable(this.layerList()[0]);

  this.changeLayer = function(clickedLayer) {
    self.currentLayer(clickedLayer);
    // self.currentLayer().clicker();
    console.log(self.currentLayer());
  }
}





// ko.applyBindings(new ViewModel());
setTimeout(ko.applyBindings(new ViewModel()), 5000);
