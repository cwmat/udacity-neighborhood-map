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

  this.filterOption = ko.observable("all");
  this.layerList = ko.observableArray([]);
  this.tempList = ko.observableArray([]);
  this.currentList = ko.computed(function() {
    // Remove all from tempList
    self.tempList.removeAll();

    // Cycle through layers
    for (var i = 0; i < self.layerList().length; i++) {
      // If filter option is all add all layers to the sidebar
      if (self.filterOption() == "all") {
        self.tempList.push(self.layerList()[i])
          // Else add only the ones that match the current filterOption
      } else if (self.layerList()[i].type() == self.filterOption()) {
        self.tempList.push(self.layerList()[i])
      }
    }
  }, this);

  this.init = function() {
    initialPlaces.forEach(function(place) {
      self.layerList.push(new Layer(place));
    });

    self.addAllMarkers();
  }

  // Clear all markers
  this.clearAllMarkers = function() {
    for (var i = 0; i < self.layerList().length; i++) {
      self.layerList()[i].marker().setMap(null);
    }
  }

  // Add all markers
  this.addAllMarkers = function() {
    for (var i = 0; i < self.layerList().length; i++) {
      self.layerList()[i].marker().setMap(map);
    }
  }

  // Filter Options

  // Create observable arrays of layers

  // Create


  // Cycle through initialPlaces data and create Layer objects



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

  this.init();

}
