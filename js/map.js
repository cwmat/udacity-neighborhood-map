function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 38.300829,
      lng: -77.486540
    },
    zoom: 13,
  });

  var initialPlaces = [{
    name: "Sammy T's",
    placeID: '',
    imgSrc: '',
    blurb: '',
  }, {
    name: "J Brian's",
    placeID: '',
    imgSrc: '',
    blurb: '',
  }, {
    name: "Paul's Bakery",
    placeID: '',
    imgSrc: '',
    blurb: '',
  }, ]



  // Used to request the palce id based on common name of a place
  var getPlaceID = function(ogPlace, searchQuery, fn) {
    var request = {
      location: {
        lat: 38.300829,
        lng: -77.486540
      },
      radius: '500',
      query: searchQuery
    };

    // console.log(ogPlace);
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    // Checks that the PlacesServiceStatus is OK, and adds a marker
    // using the place ID and location from the PlacesService.
    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
          map: map,
          place: {
            placeId: results[0].place_id,
            location: results[0].geometry.location
          }
        });
        fn(results[0].place_id);
        // Make and attach infowindow
        var request = {
          placeId: results[0].place_id
        };
        var service = new google.maps.places.PlacesService(map);
        var infowindow = new google.maps.InfoWindow();
        service.getDetails(request, function(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            // If the request succeeds, draw the place location on the map
            // as a marker, and register an event to handle a click on the marker.
            marker.addListener('click', function() {
              infowindow.setContent(place.name);
              infowindow.open(map, marker);
            });


            // google.maps.event.addListener(marker, 'click', function() {
            //   infowindow.setContent(place.name);
            //   infowindow.open(map, this);
            // });

          }

        });


      }
      // console.log(ogPlace);
      ogPlace.placeID = results[0].place_id;
      // console.log(ogPlace);
      // console.log(ogPlace.placeID);
    }
  }

  initialPlaces.forEach(function(place) {
    // console.log(place);
    getPlaceID(place, place.name, function(placeThing) {
      // OMG OMG OMG NO WAY!
      // http://stackoverflow.com/questions/6847697/how-to-return-value-from-an-asynchronous-callback-function
      console.log(placeThing);
    });
    // console.log(place);
  });


  // // Load data into initialPLaces
  // initialPlaces.forEach(function(place) {
  //   // console.log(place.name);
  //   // place.placeID = getPlaceID(place.name);
  //   // console.log(getPlaceID(place.name));
  //   getPlaceID(place.name);
  //   // console.log(place.placeID);
  // });



  ///////////////////

  // initialPlaces.forEach(function(place) {
  //   var request = {
  //     location: {
  //       lat: 38.300829,
  //       lng: -77.486540
  //     },
  //     radius: '500',
  //     query: place.name
  //   };
  //
  //   var service = new google.maps.places.PlacesService(map);
  //   // var placeID = service.textSearch(request, callback);
  //   service.textSearch(request, callback);
  //
  //   function callback(results, status) {
  //     if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       // console.log(results[0].place_id);
  //       //return results[0].place_id;
  //       place.placeID = results[0].place_id;
  //       // obj.placeID = results[0].place_id;
  //
  //     }
  //   }
  // });




  // for (var i = 0; i < initialPlaces.length; i++) {
  //   var request = {
  //     location: {
  //       lat: 38.300829,
  //       lng: -77.486540
  //     },
  //     radius: '500',
  //     query: initialPlaces[i].name
  //   };
  //
  //   var service = new google.maps.places.PlacesService(map);
  //   // var placeID = service.textSearch(request, callback);
  //   service.textSearch(request, callback);
  //
  //   function callback(results, status) {
  //     if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       // console.log(results[0].place_id);
  //       //return results[0].place_id;
  //       results[0].place_id;
  //       // obj.placeID = results[0].place_id;
  //
  //     }
  //   }
  // }
  //
  // initialPlaces.forEach(function(place) {
  //   console.log(place.placeID);
  // });









  var contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h1 id="firstHeading" class="firstHeading">Heading</h1>' +
    '<div id="bodyContent">' +
    '<p>Text</p>' +
    '<p>Attribution: Link, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
    '</p>' +
    '</div>' +
    '</div>';








  // Create and send the request to obtain details for a specific place,
  // using its Place ID.
  var request = {
    placeId: 'ChIJJeDquuvBtokRoZGmIQpFpn8'
  };

  var service = new google.maps.places.PlacesService(map);
  var infowindow = new google.maps.InfoWindow();
  service.getDetails(request, function(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // If the request succeeds, draw the place location on the map
      // as a marker, and register an event to handle a click on the marker.
      var marker = new google.maps.Marker({
        position: {
          lat: 38.300829,
          lng: -77.486540
        },
        map: map,
        title: 'Fred-Vegas!'
      });
      marker.addListener('click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
      });


      // google.maps.event.addListener(marker, 'click', function() {
      //   infowindow.setContent(place.name);
      //   infowindow.open(map, this);
      // });
    }
  });



  // SEARCH FOR PLACE ID!!!!!!!!!!!!!!!!!!!
  //   var request = {
  //     location: {lat: 38.300829, lng: -77.486540},
  //     radius: '500',
  //     query: 'Fredericksburg'
  //   };
  //
  //   var service = new google.maps.places.PlacesService(map);
  //   service.textSearch(request, callback);
  // }
  //
  // // Checks that the PlacesServiceStatus is OK, and adds a marker
  // // using the place ID and location from the PlacesService.
  // function callback(results, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     console.log(results[0].place_id);
  //   }









  // OLD CODE SHOWING HOW TO USE INFO WINDOWS
  // var infowindow = new google.maps.InfoWindow({
  //   content: contentString
  // });
  //
  // var marker = new google.maps.Marker({
  //   position: {
  //     lat: 38.300829,
  //     lng: -77.486540
  //   },
  //   map: map,
  //   title: 'Fred-Vegas!'
  // });
  // marker.addListener('click', function() {
  //   infowindow.open(map, marker);
  // });

}
