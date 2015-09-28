function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.300829, lng: -77.486540},
    zoom: 13,
  });
}
