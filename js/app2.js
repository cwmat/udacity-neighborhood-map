// Map layer 'class'
var Layer = function(data) {
  this.name = ko.observable(data.name);
  this.blurb = ko.observable(data.blurb);
  this.properName = ko.observable(data.properName);
  this.address = ko.observable(data.address);
  this.imgSrc = ko.observable(data.imgSrc);
  this.infoWindow = ko.observable(data.infoWindow);
  this.clicker = ko.observable(data.clicker);
  this.placeID = ko.observable(data.placeID);
  this.marker = ko.observable(data.marker);
  this.popContent = ko.observable(data.popContent);
  this.type = ko.observable(data.type);
  this.url = ko.observable(data.url);
}

// View Model 'class'
var ViewModel = function() {
  var self = this;

  // Create observable arrays of layers

  // Create


  // Cycle through initialPlaces data and create Layer objects

}

// // Test
// initialPlaces.forEach(function(place) {
//   console.log(place.name);
//   makeGoogleRequest(place, getGoogleData);
// });

// Test BS function
// var bsFunction = function() {
//   console.log('farts');
// }

// $(document).ajaxComplete(function() {
//   console.log(initialPlaces[0].properName);
// });