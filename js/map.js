'use strict';

// Make map and bounds global
var map;
var bounds;
var infowindow;

var initMap = function() {
  // Create a map object and link it to #map in the DOM.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      // Center map on Fredericksburg, VA Downtown
      lat: 38.301995,
      lng: -77.458737
    },
    zoom: 16,
  });

  // Set initial bounds
  bounds = new google.maps.LatLngBounds();
  populateInitialData();
};

// Populate a place object literal with data from google based on a common name
var makeGoogleRequest = function(place, fn) {
  var request = {
    // Bias the search to Fredericksburg
    location: {
      lat: 38.300829,
      lng: -77.486540
    },
    radius: '500',
    query: place.name // search using the common name
  };

  // Create a service and pass the search request
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);

  // Passes the results from the google search request
  function callback(results, status) {
    fn(place, results[0]);
  }
};

// Get google data
var getGoogleData = function(place, info) {
  place.properName = info.name;
  place.placeID = info.place_id;
  place.address = info.formatted_address;
  place.imgSrc = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + place.address + '';
  place.location = info.geometry.location;
  getFourSquareData(urlCallback, place, info);

  $(document).ajaxComplete(function() {
    createMarker(place);
    // Center map on markers
    map.fitBounds(bounds);
  });
};

// Populate a place object literal with data from four square based on a proper name.  Get the proper name from getGoogleData (Google's search seems to be smarter and can handle a 'fuzzy' name)
var getFourSquareData = function(callback, place, info) {
  // Create URL for foursquare API using food, bar, and coffee categories
  /*jshint multistr: true */
  var fourSquareQuery = "https://api.foursquare.com/v2/venues/search" +
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
      place.category = "URL Request failed";
      place.phone = "URL Request failed";
    }
  });
};

// Callback for foursquare ajax call
var urlCallback = function(venue, place) {
  if (typeof venue != "undefined") {
    place.url = venue.url;
    place.category = venue.categories[0].name;
    place.phone = venue.contact.formattedPhone;
  } else {
    place.url = "Cannot find URL";
    place.category = "Cannot find URL";
    place.phone = "Cannot find URL";
  }
};

// Create and add a marker to a place object literal
var createMarker = function(place) {
  // temp TODO
  var marker = new google.maps.Marker({
    // map: map,
    place: {
      placeId: place.placeID,
      location: place.location,
    }
  });

  // Extend bounds
  var latLng = new google.maps.LatLng(place.location.lat(), place.location.lng());
  bounds.extend(latLng);

  // Create infowindow
  infowindow = new google.maps.InfoWindow();

  // Make content string
  /*jshint multistr: true */
  var content = '\
  <p><strong>' + place.properName + '</strong></p>\
  <p>' + place.category + '</p>\
  <p>' + place.phone + '</p>\
  <p>' + place.address + '</p>\
  <p>' + place.blurb + '</p>\
  <p><img src="' + place.imgSrc + '" alt="Streetview" height="150px" width="350px"></p>\
  <p><a href="' + place.url + '">' + place.url + '</a></p>';
  // Add to initial places object
  place.popContent = content;

  // Add click event to open popup and make marker bounce
  marker.addListener('click', function() {
    // Marker animation
    var self = this;

    // Bounce animation
    self.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.setAnimation(undefined);
    }, 1500);

    // Open info window (close old one first)
    infowindow.close();
    infowindow.setContent(content);
    infowindow.open(map, marker);
  });

  // Close infowindow when you click outside of it
  map.addListener('click', function() {
    infowindow.close();
  });

  place.infoWindow = infowindow;
  place.marker = marker;
};

// Make requests to google and foursquare to populate the initialplaces object with more data
var populateInitialData = function() {
  initialPlaces.forEach(function(place) {
    makeGoogleRequest(place, getGoogleData);
  });

  // On resize, fit to markers
  window.onresize = function() {
    map.fitBounds(bounds);
  };

  // Wait until ajax requests are done, then start knockout by instantiating a ViewModel object
  $(document).ajaxStop(function() {
    ko.applyBindings(new ViewModel());
  });
};
