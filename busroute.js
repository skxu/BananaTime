var directionsService = new google.maps.DirectionsService();

function getBusRoutes(olat,olon,slat,slon)
{
    var request = {
        origin: olat+", "+olon,
        destination: slat+", "+slon,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.TRANSIT
    };
    var result = null;
    directionsService.route(request, function(r, status) {
       result = r; 
    });
    return result;
}