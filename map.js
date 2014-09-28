var Map  = {
  
  map: null,
  currlat: null,
  currlon: null,
  
  initialize: function() {
    Control.show("loading_div");
    
    document.getElementById("optionA").addEventListener("click", function(e) {
      Control.process("optionA"), e.preventDefault()
    });
  
    document.getElementById("optionB").addEventListener("click", function(e) {
      Control.process("optionB"), e.preventDefault()
    });
  
    document.getElementById("optionC").addEventListener("click", function(e) {
      Control.process("optionC"), e.preventDefault()
    });
    
    var autoOptions = {
        types: ["geocode"]
    },
    autoInput = document.getElementById("locationsearch");
    locationInput = document.getElementById("locator");
    autocomplete = new google.maps.places.Autocomplete(autoInput, autoOptions);
    autocomplete2 = new google.maps.places.Autocomplete(locationInput, autoOptions);
    
    
     var mapOptions = {
      zoom: 15,
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    document.getElementById("map_container").style.display = "none";
    //If we support geolocation
    if(navigator.geolocation) {
      
      navigator.geolocation.getCurrentPosition(function(position) {
        
        getRoutes();
        Control.hide("loading_div");
        Control.hide("message");
        Control.show("menu");
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        Map.currlat = position.coords.latitude;
        Map.currlon = position.coords.longitude;
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
   // Map.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
   // var searchBox = new google.maps.places.SearchBox((input));
    
    
    /*
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
    */
    
  },
  
  handleNoGeolocation: function(denied) {
    console.log(denied);
    if (denied == true) {
        console.log("User denied geolocation");
        document.getElementById("message").textContent = "Please allow location services";
        Control.hide("loading_div");
        Control.show("locator_container");
    } else {
        console.log("User not have geolocation");
        document.getElementById("message").textContent = "Sorry, your browser does not support geolocation. Using default location: Soda Hall";
        Control.hide("loading_div");
        Control.show("locator_container");
    }
      
    document.getElementById("uselocation").addEventListener("click", function() {
      var address = document.getElementById("locator").value;
      geocoder = new google.maps.Geocoder;
      var currentlatlng;
      geocoder.geocode({address: address}, function(results, status) {
            console.log("manual location:" + address);
            if (status == google.maps.GeocoderStatus.OK) {
              currentlatlng = results[0].geometry.location;
              Map.currlat = currentlatlng.lat();
              Map.currlon = currentlatlng.lng();
              
              var pos = new google.maps.LatLng(currentlatlng.lat(),currentlatlng.lng());
              var infowindow = new google.maps.InfoWindow({
                    map: Map.map,
                    position: pos,
                    content: "You're somewhere here",
                  });
              Map.map.setCenter(pos);
              Control.hide("message");
              Control.show("menu");
            } else {
              console.log("Geocode was not successful for the following reason: " + status);
              document.getElementById("message").textContent = "Couldn't fucking find you, try again";
            }
      
      
        });

    });
  }
  
}