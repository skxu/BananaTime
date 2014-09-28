Control = {
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
  
  process: function(id) {
    switch(id) {
      case "optionA":
        Control.hide("menu");
        Control.show("map_container","block");
        google.maps.event.trigger(Map.map, 'resize');
        break;
      case "optionB":
        Control.hide("menu");
        Control.show("map_container","block");
        google.maps.event.trigger(Map.map, 'resize');
        break;
    }
  }

}