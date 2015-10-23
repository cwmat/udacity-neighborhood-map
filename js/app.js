// Points of interest
var initialPlaces = [{
  name: "Sammy T's",
  blurb: 'Vegetarian friendly.',
  type: 'food',
}, {
  name: "J Brian's",
  blurb: 'My favorite bar in town!',
  type: 'beer',
}, {
  name: "Hyperion",
  blurb: 'Trendy coffee spot.',
  type: 'coffee',
}, {
  name: "Eileens",
  blurb: 'Quick, pre-made deli sandwiches.',
  type: 'food',
}, {
  name: "Capitol Ale House",
  blurb: 'Near 100 different beers on tap.',
  type: 'beer',
}, {
  name: "Soup and Taco",
  blurb: 'Try the black bean soup!!',
  type: 'food',
}, {
  name: "Spencer Devon",
  blurb: 'New brewery.',
  type: 'beer',
}, {
  name: "Benny Vitali's",
  blurb: 'Really, really big slices of pizza.',
  type: 'food',
}, {
  name: "Agora",
  blurb: 'New coffee shop.',
  type: 'coffee',
}, ]

var map;

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

    // Change filter option
    self.filterOption("all");

    // Turn all layers on
    for (var i = 0; i < self.layerList().length; i++) {
      self.layerList()[i].marker().setMap(map)
    }
  }

  this.filterFood = function() {
    // Turn all layers off
    self.clearMarkers();

    // Change filter option
    self.filterOption("food");

    // Turn all layers on
    for (var i = 0; i < self.layerList().length; i++) {
      if (self.layerList()[i].type() == 'food') {
        self.layerList()[i].marker().setMap(map)
      } else {
        // self.removeItem(self.layerList()[i]);
      }
    }
  }

  this.filterBeer = function() {
    // Turn all layers off
    self.clearMarkers();

    // Change filter option
    self.filterOption("beer");

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

    // Change filter option
    self.filterOption("coffee");

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

  // Marker animation
  var toggleBounce = function() {
    var self = this;
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else { // timeout isnt working
      self.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        self.setAnimation(null);
      }, 3000);
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

    marker.addListener('click', toggleBounce);

    var infowindow = new google.maps.InfoWindow();

    // Make content string
    var content = "\
  <p><strong>" + layer.properName + "</strong></p>\
  <p>" + layer.address + "</p>\
  <p>" + layer.blurb + '</p>\
  <p><img src="' + layer.imgSrc + '" alt="Streetview" height="150px" width="350px"></p>\
  <p><a href="' + layer.url + '">' + layer.url + '</a></p>';
    // Add to initial places object
    layer.popContent = content;

    marker.addListener('click', function() {
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });

    layer.infoWindow = infowindow;
    layer.marker = marker;
    layer.clicker = function() {
      layer.infoWindow.open(map, layer.marker);
    }
  }

  var getURL = function(callback, place, info) {
    // Create URL for foursquare API using food, bar, and coffee categories
    fourSquareQuery = "https://api.foursquare.com/v2/venues/search" +
      "?client_id=JCP1A22LFDAQ4KWQI2ZGLOPAV2GW2ZQWB03ES0G20L0FTLYS" +
      "&client_secret=HYDXYR3TRLPTCZQDA0OQUWZ5PNXMGCSFDAM2ZPQYXHOC1JSA" +
      "&v=20130815&ll=" + info.geometry.location.lat() + "," + info.geometry.location.lng() + "&intent=checkin&radius=500" +
      "&limit=1&categoryId=4d4b7105d754a06374d81259,4bf58dd8d48988d116941735,4bf58dd8d48988d1e0931735" +
      "&query=" + encodeURIComponent(info.name);

    $.ajax({
      dataType: "json",
      url: fourSquareQuery,
      success: function(data) {
        var venue, venueURL;
        venue = data.response.venues[0];
        urlCallback(venue, place);
      },
      error: function() {
        place.url = "URL Request failed";
      }
    });
  }

  var urlCallback = function(venue, place) {
    if (typeof venue != "undefined") {
      venueURL = venue.url;
      place.url = venueURL;
      console.log(venueURL);
    } else {
      place.url = "Cannot find URL";
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
      getURL(urlCallback, place, info);




      // Wait for ajax to finish then
      $(document).ajaxStop(function() {
        makeLayer(place);
        self.layerList.push(new Layer(place));
      });
    });
  });
  // Call autocomplete
  initAutocomplete();
}

// Search Bar function
function initAutocomplete() {
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var searchMarkers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old searchMarkers.
    searchMarkers.forEach(function(marker) {
      marker.setMap(null);
    });
    searchMarkers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      searchMarkers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// This gets called as a callback from google mpas api
function initMap() {
  // Create the View Model and start the application
  ko.applyBindings(new ViewModel());
}
