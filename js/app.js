'use strict';

// Map layer 'class'
var Layer = function(data) {
  this.name = ko.observable(data.name);
  this.blurb = ko.observable(data.blurb);
  this.properName = ko.observable(data.properName);
  this.address = ko.observable(data.address);
  this.imgSrc = ko.observable(data.imgSrc);
  this.infoWindow = ko.observable(data.infoWindow);
  this.placeID = ko.observable(data.placeID);
  this.marker = ko.observable(data.marker);
  this.popContent = ko.observable(data.popContent);
  this.type = ko.observable(data.type);
  this.url = ko.observable(data.url);
  this.category = ko.observable(data.category);
  this.phone = ko.observable(data.phone);
};

// View Model 'class'
var ViewModel = function() {
  var self = this;

  // This, along with the data-bind on the <input> element, lets KO keep
  // constant awareness of what the user has entered. It stores the user's
  // input at all times.
  this.userInput = ko.observable('');
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
  };

  // Clear all markers
  this.clearAllMarkers = function() {
    for (var i = 0; i < self.layerList().length; i++) {
      self.layerList()[i].marker().setMap(null);
    }
  };

  // Add a marker
  this.addMarker = function(inputMarker) {
    inputMarker.setMap(map);
  };

  // Add all markers
  this.addAllMarkers = function() {
    for (var i = 0; i < self.layerList().length; i++) {
      self.addMarker(self.layerList()[i].marker());
    }
  };

  // Button filter based on place type
  this.filter = function(newFilterOption) {
    // Turn off all layers
    self.clearAllMarkers();

    // Set new filter option when a filter button is clicked
    self.filterOption(newFilterOption);

    // Cycle through layers and only turn on those that match filter option
    for (var i = 0; i < self.layerList().length; i++) {
      if (self.filterOption() == 'all') {
        self.addAllMarkers();
        break;
        // self.addMarker(self.layerList()[i].marker());
      } else if (self.layerList()[i].type() == self.filterOption()) {
        self.addMarker(self.layerList()[i].marker());
      }
    }
  };

  // Filter markers based on typed input from user
  // Big help from http://codepen.io/prather-mcs/pen/KpjbNN?editors=001
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();

    // Clear out existing lists
    self.tempList.removeAll();
    self.clearAllMarkers();

    // Check if any layer's names match the user input
    for (var i = 0; i < self.layerList().length; i++) {
      var layer = self.layerList()[i];

      if (layer.name().toLowerCase().indexOf(searchInput) !== -1) {
        self.addMarker(layer.marker());
        self.tempList.push(layer);
      }
    }
  };

  // This gets called when an li is clicked in the map's side panel
  this.changeLayer = function(clickedLayer) {
    // Setting to current is not necessary but I may implement some functionality for this later
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(clickedLayer.popContent());
    infoWindow.open(map, clickedLayer.marker());
    // Close infowindow when you click outside of it
    map.addListener('click', function() {
      infoWindow.close();
    });
  }

  // Start the program
  this.init();

};
