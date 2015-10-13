// Points of interest
var initialPlaces = [
  {
  name: "Sammy T's",
  blurb: 'Vegetarian friendly.',
  type: 'food',
  },
  {
    name: "J Brian's",
    blurb: 'My favorite bar in town!',
    type: 'beer',
  },
  {
    name: "Hyperion",
    blurb: 'Trendy coffee spot.',
    type: 'coffee',
  },
  {
    name: "Eileens",
    blurb: 'Quick, pre-made deli sandwiches.',
    type: 'food',
  },
  {
    name: "Capitol Ale House",
    blurb: 'Near 100 different beers on tap.',
    type: 'beer',
  },
  {
    name: "Soup and Taco",
    blurb: 'Try the black bean soup!!',
    type: 'food',
  },
  {
    name: "Spencer Devon",
    blurb: 'New brewery.',
    type: 'beer',
  },
  {
    name: "Benny Vitali's",
    blurb: 'Really, really big slices of pizza.',
    type: 'food',
  },
  {
    name: "Agora",
    blurb: 'New coffee shop.',
    type: 'coffee',
  },
]

var map;
// var globalMarkerList = [];

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
}

// View Model 'class'
var ViewModel = function() {
  var self = this;

  this.layerList = ko.observableArray([]);

  this.currentLayer = ko.observable(this.layerList()[0]);

  // This gets called when an li is clicked in the map's side panel
  this.changeLayer = function(clickedLayer) {
    // Setting to current is not necessary but I may implement some functionality for this later
    self.currentLayer(clickedLayer);
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(clickedLayer.popContent());
    infoWindow.open(map, clickedLayer.marker());
  }

  // Clear all markers
  this.clearMarkers = function() {
    for (var i = 0; i < self.layerList().length; i++) {
      self.layerList()[i].marker().setMap(null);
    }
  }

  // Click functions for filter buttons (breaking DRY here :[ was having trouble figureing out how to pass parameters to knockout click data-bind)
  this.filterAll = function() {
    // Turn all layers off
    self.clearMarkers();

    // Turn all layers on
    for (var i = 0; i < self.layerList().length; i++) {
      self.layerList()[i].marker().setMap(map)
    }
  }

  this.filterFood = function() {
    // Turn all layers off
    self.clearMarkers();

    // Turn all layers on
    for (var i = 0; i < self.layerList().length; i++) {
      if (self.layerList()[i].type() == 'food') {
        self.layerList()[i].marker().setMap(map)
      }
    }
  }

  this.filterBeer = function() {
    // Turn all layers off
    self.clearMarkers();

    // Turn all layers on
    for (var i = 0; i < self.layerList().length; i++) {
      if (self.layerList()[i].type() == 'beer') {
        self.layerList()[i].marker().setMap(map)
      }
    }
  }

  this.filterCoffee = function() {
    // Turn all layers off
    self.clearMarkers();

    // Turn all layers on
    for (var i = 0; i < self.layerList().length; i++) {
      if (self.layerList()[i].type() == 'coffee') {
        self.layerList()[i].marker().setMap(map)
      }
    }
  }

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 38.301995,
      lng: -77.458737
    },
    zoom: 16,
  });

  // Used to request the place id based on common name of a place
  var getPlaceID = function(ogPlace, searchQuery, fn) {
    var request = {
      location: {
        lat: 38.300829,
        lng: -77.486540
      },
      radius: '500',
      query: searchQuery
    };

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    // Passes the reuslts from the google search request
    function callback(results, status) {
      fn(results[0]);
    }
  }

  // Produces markers and infowindows
  var makeLayer = function(layer) {
    var marker = new google.maps.Marker({
      map: map,
      place: {
        placeId: layer.placeID,
        location: layer.location,
      }
    });

    var infowindow = new google.maps.InfoWindow();

    // Make content string
    var content = "\
  <p><strong>" + layer.properName + "</strong></p>\
  <p>" + layer.address + "</p>\
  <p>" + layer.blurb + '</p>\
  <p><img src="' + layer.imgSrc + '" alt="Streetview" height="150px" width="350px"></p>';
    // Add to initial places object
    layer.popContent = content;

    marker.addListener('click', function() {
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });

    layer.infoWindow = infowindow;
    layer.marker = marker;
    console.log(marker);
    layer.clicker = function() {
      layer.infoWindow.open(map, layer.marker);
    }
  }

  // Populate data
  initialPlaces.forEach(function(place) {
    getPlaceID(place, place.name, function(info) {
      place.properName = info.name;
      place.placeID = info.place_id;
      place.address = info.formatted_address;
      place.imgSrc = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + place.address + '';
      place.location = info.geometry.location;
      makeLayer(place);
      self.layerList.push(new Layer(place));
    });
  });
}

// This gets called as a callback from google mpas api
function initMap() {
  // Create the View Model and start the application
  ko.applyBindings(new ViewModel());
}
