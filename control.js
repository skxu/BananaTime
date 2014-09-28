Control = {
  info: [],
  hide: function(id) {
    document.getElementById(id).style.display = "none";
  },
  
  show: function(id, type) {
    if (type !== undefined) {
      document.getElementById(id).style.display = type;
    } else {
      document.getElementById(id).style.display = "block";
    }
  },
  
  closeInfos: function() {
    if (Control.info.length > 0) {
      Control.info[0].set("marker",null);
      Control.info[0].close();
      Control.info.length = 0;
    }
  
  },
  
  process: function(id) {
    switch(id) {
      case "optionA":
        Control.hide("menu");
        Control.show("map_container","block");
        console.log("clicked option A");
        Control.show("option1");
        var stopList = getCloseStops(Map.currlat,Map.currlon);
        for (var routeID in stopList) {
          var stop = stopList[routeID][0]; //grab bustop information
          var latlng = new google.maps.LatLng(stop.info.lat,stop.info.lon);
          var marker = new google.maps.Marker({
            position: latlng,
            map: Map.map,
            title: routeID
          });
          
          
         var infowindow = new google.maps.InfoWindow({
              content: routeID
          });
          
          google.maps.event.addListener(marker, 'click', (function(marker,content,infowindow) {
            return function() {
              Control.closeInfos();
              infowindow.setContent(content);
              infowindow.open(Map.map,marker);
              Control.info[0] = infowindow; //keep track to close later
            };
          })(marker,routeID, infowindow));
          var stopHTML = '<p><b>'+routeID+'</p></b><p>'+stop.info.title+'</p>';
          var stopNode = document.createElement('div');
          stopNode.innerHTML = stopHTML;
          stopNode.className = "bus-stop";
          document.getElementById("option1").appendChild(stopNode);
        }
        var currCenter = Map.map.getCenter();
        google.maps.event.trigger(Map.map, 'resize');
        Map.map.setCenter(currCenter);
        console.log(stopList);
        break;
      case "optionB":
        Control.hide("menu");
        //Control.show("map_container","block");
        var currCenter = Map.map.getCenter();
        google.maps.event.trigger(Map.map, 'resize');
        Map.map.setCenter(currCenter);
        break;
    }
  }

}