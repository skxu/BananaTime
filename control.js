Control = {
  hide: function(id) {
    document.getElementById(id).style.display = "none";
  },
  
  show: function(id) {
    document.getElementById(id).style.display = "block";
  }
  
  process: function(id) {
    switch(id) {
      case "optionA":
        this.hide("menu");
        this.show("map-canvas");
    }
  }

}