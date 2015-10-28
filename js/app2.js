'use strict';

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

  this.filter = function(newFilterOption) {
    console.log(newFilterOption);

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

  // The filter will look at the names of the places the Markers are standing
  // for, and look at the user input in the search box. If the user input string
  // can be found in the place name, then the place is allowed to remain
  // visible. All other markers are removed.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();

    // Clear out existing lists
    self.tempList.removeAll();
    self.clearAllMarkers();

    // This looks at the name of each places and then determines if the user
    // input can be found within the place name.


    // self.layerList().forEach(function(layer) {
    for (var i = 0; i < self.layerList().length; i++) {
      var layer = self.layerList()[i];

      // layer.marker.setVisible(false);

      if (layer.name().toLowerCase().indexOf(searchInput) !== -1) {
        // self.visiblePlaces.push(layer);
        self.addMarker(layer.marker());
        self.tempList.push(layer);
      }
    }
  // });


    // self.visiblePlaces().forEach(function(layer) {
    //   layer.marker.setVisible(true);
    // });
  };

  // Filter Options

  // Create observable arrays of layers

  // Create


  // Cycle through initialLayers data and create Layer objects



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

  // Start the program
  this.init();

};
