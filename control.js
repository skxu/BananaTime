var Control = {
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
      //Control.info[0].set("marker",null);
      Control.info[0].close();
      Control.info.length = 0;
    }
  
  },
  
  checkStop: function(stop, routeID) {
    //TODO: use schedule if no prediction available
    if (stop === undefined || stop.predictions === undefined || stop.predictions.length == 0) return;
    var meta = stop.predictions[0].dirTag;
    var dir = tagToDirection[meta];
    var dirTitle = (dir === undefined) ? "N/A" : dir[0];
    var dirName = (dir === undefined) ? "" : '('+dir[1]+')';
    
    var stopHTML = '<h2><p><b>'+routeID+'</h2> '+dirTitle + dirName+'</p><p></b>'+stop.info.title+'</p><h2>';
    
    var stopNode = document.createElement('div');
    
    
    for (var p_index in stop.predictions) {
      var prediction = stop.predictions[p_index];
       stopHTML+=prediction.minutes + ", ";
      
    }
    stopHTML = stopHTML.substring(0, stopHTML.length - 2) + " min</h2>";
    


    stopNode.innerHTML = stopHTML;
    stopNode.className = "bus-stop";
    document.getElementById("option1").appendChild(stopNode);
    
  },
  
  process: function(id) {
    switch(id) {
      case "optionA":
        Control.hide("menu");
        Control.show("map_container","block");
        console.log("clicked option A");
        Control.show("option1");
        var stopList = getCloseStops(Map.currlat,Map.currlon);
        var currCenter = Map.map.getCenter();
        google.maps.event.trigger(Map.map, 'resize');
        Map.map.setCenter(currCenter);
        console.log(stopList);
        
        for (var routeID in stopList) {
          var stop = stopList[routeID][0]; //grab bustop information
          var stop2;
          if (stopList[routeID].length > 1) stop2 = stopList[routeID][1]; 
          Control.checkStop(stop, routeID);
          Control.checkStop(stop2, routeID);
         
          
          //Mark the map with bustop location
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
              console.log(content);
              console.log(infowindow);
              infowindow.open(Map.map,marker);
              Control.info[0] = infowindow; //keep track to close later
            };
          })(marker,routeID,infowindow));
            
            
          
        }
       
        /*   
        var pos = new google.maps.LatLng(Map.currlat,Map.currlon);
        var infowindow2 = new google.maps.InfoWindow({
              map: Map.map,
              position: pos,
              content: "You are here",
            });
        */
        
        
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