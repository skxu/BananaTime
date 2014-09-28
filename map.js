var Map  = {
  map: null,
  
  initialize: function() {
    
    var autoOptions = {
        types: ["geocode"]
    },
    autoInput = document.getElementById("locationsearch");
    autocomplete = new google.maps.places.Autocomplete(autoInput, autoOptions);
    
    
     var mapOptions = {
      zoom: 18,
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    
    //If we support geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

        var infowindow = new google.maps.InfoWindow({
          map: Map.map,
          position: pos,
          content: 'Location found using HTML5.'
        });
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      Map.map.setCenter(pos);
      }, function() {
        Map.handleNoGeolocation(true);
      });
    } else {
      // Browser doesn't support Geolocation
      Map.handleNoGeolocation(false);
    }
    
    var markers = [];
    var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
    Map.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));
    
    
    
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
      for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
      }

      // For each place, get the icon, place name, and location.
      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          position: place.geometry.location
        });

        markers.push(marker);

        bounds.extend(place.geometry.location);
      }

      map.fitBounds(bounds);
    });
    
  },
  
  handleNoGeolocation: function(denied) {
    console.log(denied);
    if (denied == true) {
        console.log("User denied geolocation");
        document.getElementById("message").textContent = "Please allow location services";
    } else {
        console.log("User not have geolocation");
        document.getElementById("message").textContent = "Sorry, your browser does not support geolocation. Using default location: Soda Hall";
    }
      
    var pos = new google.maps.LatLng(37.8756081,-122.2587463);
    var infowindow = new google.maps.InfoWindow({
          map: Map.map,
          position: pos,
          content: 'Location hardcoded.'
        });
    
    Map.map.setCenter(pos);
    Control.hide("message");
    Control.show("menu");
  }
  
}