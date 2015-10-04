// Gets called once google maps api is loaded
function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 38.300829,
      lng: -77.486540
    },
    zoom: 13,
  });

  // Points of interest
  // var initialPlaces = [{
  //   name: "Sammy T's",
  //   placeID: '',
  //   imgSrc: '',
  //   blurb: '',
  // }, {
  //   name: "J Brian's",
  //   placeID: '',
  //   imgSrc: '',
  //   blurb: '',
  // }, {
  //   name: "Paul's Bakery",
  //   placeID: '',
  //   imgSrc: '',
  //   blurb: '',
  // }, ]

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

    // Checks that the PlacesServiceStatus is OK, and adds a marker
    // using the place ID and location from the PlacesService.
    function callback(results, status) {
      // if (status == google.maps.places.PlacesServiceStatus.OK) {
      //   var marker = new google.maps.Marker({
      //     map: map,
      //     place: {
      //       placeId: results[0].place_id,
      //       location: results[0].geometry.location
      //     }
      //   });




      // fn(results[0].place_id);
      fn(results[0]);




      //   // Make and attach infowindow
      //   var request = {
      //     placeId: results[0].place_id
      //   };
      //   var service = new google.maps.places.PlacesService(map);
      //   var infowindow = new google.maps.InfoWindow();
      //   service.getDetails(request, function(place, status) {
      //     if (status == google.maps.places.PlacesServiceStatus.OK) {
      //       // If the request succeeds, draw the place location on the map
      //       // as a marker, and register an event to handle a click on the marker.
      //       marker.addListener('click', function() {
      //         infowindow.setContent(place.name);
      //         infowindow.open(map, marker);
      //       });
      //     }
      //   });
      // }
    }
  }

  var makeLayer = function(layer) {
    var marker = new google.maps.Marker({
      map: map,
      place: {
        placeId: layer.placeID,
        location: layer.location,
      }
    });

    // var request = {
    //   placeId: results[0].place_id
    // };
    // var service = new google.maps.places.PlacesService(map);
    var infowindow = new google.maps.InfoWindow();

    marker.addListener('click', function() {
      var content = "\
      <p><strong>" + layer.properName + "</strong></p>\
      <p>" + layer.address + "</p>\
      <p>" + layer.blurb + '</p>\
      <p><img src="' + layer.imgSrc + '" alt="Streetview" height="150px" width="350px"></p>';
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });
  }

  // Populate data
  initialPlaces.forEach(function(place) {
    getPlaceID(place, place.name, function(info) {
      // http://stackoverflow.com/questions/6847697/how-to-return-value-from-an-asynchronous-callback-function
      // console.log(placeThing);
      place.properName = info.name;
      place.placeID = info.place_id;
      place.address = info.formatted_address;
      place.imgSrc = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + place.address + '';
      place.location = info.geometry.location;
      // console.log(place);
      makeLayer(place);
    });
  });




  // var contentString = '<div id="content">' +
  //   '<div id="siteNotice">' +
  //   '</div>' +
  //   '<h1 id="firstHeading" class="firstHeading">Heading</h1>' +
  //   '<div id="bodyContent">' +
  //   '<p>Text</p>' +
  //   '<p>Attribution: Link, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
  //   'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
  //   '</p>' +
  //   '</div>' +
  //   '</div>';








  // Create and send the request to obtain details for a specific place,
  // using its Place ID.
  // var request = {
  //   placeId: 'ChIJJeDquuvBtokRoZGmIQpFpn8'
  // };
  //
  // var service = new google.maps.places.PlacesService(map);
  // var infowindow = new google.maps.InfoWindow();
  // service.getDetails(request, function(place, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     // If the request succeeds, draw the place location on the map
  //     // as a marker, and register an event to handle a click on the marker.
  //     var marker = new google.maps.Marker({
  //       position: {
  //         lat: 38.300829,
  //         lng: -77.486540
  //       },
  //       map: map,
  //       title: 'Fred-Vegas!'
  //     });
  //     marker.addListener('click', function() {
  //       infowindow.setContent(place.name);
  //       infowindow.open(map, marker);
  //     });
  //   }
  // });






}

// var clicker = function(layer, infoWindow, marker) {
//   var content = "\
//   <p><strong>" + layer.properName + "</strong></p>\
//   <p>" + layer.address + "</p>\
//   <p>" + layer.blurb + '</p>\
//   <p><img src="' + layer.imgSrc + '" alt="Streetview" height="150px" width="350px"></p>';
//   infoWindow.setContent(content);
//   infoWindow.open(map, marker);
// }
