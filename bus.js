var routeTags = [];
var routes = {};
var routeInfos = {};

// Get the List of buses of actransit, place it in routeTags
function getRoutes() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=actransit", false);
    xmlhttp.onreadystatechange = function()
    {
        var xmlDoc=xmlhttp.responseXML;
        var nodes = xmlDoc.getElementsByTagName("route");
        for (var i=0;i<nodes.length;i++)
        {
            var n = nodes[i];
            var tag = n.getAttribute("tag");
            var title = n.getAttribute("title");

            // Populate route tags and titles
            routeTags.push(tag);
        }
        getStops();
    }
    xmlhttp.send();
}

function getStops() {
    for (var a=0;a<routeTags.length;a++)
    {
        var routeTag = routeTags[a];
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=actransit&r="+routeTag, false);     
        xmlhttp.onreadystatechange = function()
        {

            // Get the information for all of the stops, populate routeInfos
            var xmlDoc=xmlhttp.responseXML;
            var routeStops = {};

            var allStops = xmlDoc.getElementsByTagName("stop");
            for (var i=0;i<allStops.length;i++)
            {
                var n = allStops[i];
                var sTag = allStops[i].getAttribute("tag");
                if (routeStops[sTag] == undefined)
                {
                    var s = {};
                    s['tag'] = sTag;
                    s['title'] = n.getAttribute("title");
                    s['lat'] = n.getAttribute("lat");
                    s['lon'] = n.getAttribute("lon");
                    s['stopId'] = n.getAttribute("stopId");

                    // Populate route tags and titles
                    routeStops[sTag] = s;
                }
            }

            routeInfos[routeTag] = routeStops;

            // Go through the directions of this route, and get all stops, put in routes

            var rDirs = [];

            var directions = xmlDoc.getElementsByTagName("direction");

            for (var i=0;i<directions.length;i++)
            {
                var d = directions[i];
                var dirObj = {};
                var dStops = d.getElementsByTagName("stop");
                dirObj["tag"] = d.getAttribute("tag");
                dirObj["title"] = d.getAttribute("title");
                dirObj["name"] = d.getAttribute("name");
                dirObj["useForUI"] = d.getAttribute("useForUI");

                var dStopTags = [];

                for (var j=0;j<dStops.length;j++)
                {
                    var sTag = dStops[j].getAttribute("tag");
                    dStopTags.push(sTag);
                }

                dirObj["stopTags"] = dStopTags;

                rDirs.push(dirObj);
            }

            routes[routeTag] = rDirs;
        }
        xmlhttp.send();
    }
}

/*
*  Provide lat and lon to receive object containing all of the closest
* stops, one for each unique route-direction pair, and predictions.  Example usage:
*
*  predictions = getCloseStops(lat, lon);
*  for (var i=0;i<routeTags.length;i++)
*  {
*    stops = predictions[i];
*    for (var j=0;j<stops.length;j++)
*    {
*      predictionInfo = stops[j];
*      intersection = predictionInfo.info.title;
*      time = predictionInfo.predictions[0].seconds;
*      ...
*    }
*  }
*
*  getRoutes() and getStops() must be called first.
*/
function getCloseStops(lat, lon)
{
    var closeStops = {};

    for (var i=0;i<routeTags.length;i++)
    {
        var rTag = routeTags[i];
        var rDirs = routes[rTag];
        var rInfo = routeInfos[rTag];

        if (rDirs == undefined || rInfo == undefined)
        {
            continue;
        }

        var rCloseStops = [];
        for (var j=0;j<rDirs.length;j++)
        {
            var rdInfo = rDirs[j];
            var rdStops = rdInfo["stopTags"];

            // Iterate through all the stops in this direction, get the closest
            var closestStopTag = null;
            var closestStopDist = Infinity;

            // constants
            var R = 3958.75; //miles?
            var toRad = Math.PI / 180;

            for (k=0;k<rdStops.length;k++)
            {
                var sTag = rdStops[k];
                var sInfo = rInfo[sTag];

                var sLat = parseFloat(sInfo.lat);
                var sLon = parseFloat(sInfo.lon);

                // haversine
                var s1 = sLat * toRad;
                var s2 = lat * toRad;
                var ds = (s2-s1) / 2;
                var dl = (sLon-lon) * toRad / 2;

                var sds = Math.sin(ds);
                var sdl = Math.sin(dl);

                var a = sds * sds + Math.cos(s1) * Math.cos(s2) * sdl * sdl;

                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                var d = R*c;

                // within 1 mile
                if (d<1 && d<closestStopDist)
                {
                    closestStopTag = sTag;
                    closestStopDist = d;
                }
            }

            if (closestStopTag != null)
            {
                var sInfo = rInfo[closestStopTag];
                var stopPredictions = {};
                stopPredictions['info'] = sInfo;

                stopPredictions['predictions'] = getPredictions(rTag, closestStopTag, rdInfo.title);

                stopPredictions['distance'] = closestStopDist;

                rCloseStops.push(stopPredictions);

                /*for (var b=0;b<stopPredictions['predictions'].length;b++)
                {
                    console.log("Route: " + rTag + " Direction: " + rdInfo.title + " Prediction: " + stopPredictions['predictions'][b].minutes + " minutes " + stopPredictions['predictions'][b].seconds + " seconds." + " Lat: " + sInfo.lat + " Lon: " + sInfo.lon);
                }*/
            }
        }

        closeStops[rTag] = rCloseStops;
    }
    
    return closeStops;
}

function getPredictions(rTag, sTag, rdTitle)
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=actransit&r=" + rTag + "&s=" + sTag, false);

    var predictionsList = [];
    xmlhttp.onreadystatechange = function()
    {
        var xmlDoc=xmlhttp.responseXML;
        var nodes = xmlDoc.getElementsByTagName("direction");
        for (var i=0;i<nodes.length;i++)
        {
            var n = nodes[i];
            if (n.getAttribute("title") != rdTitle)
            {
                continue;
            }

            var predictions = n.getElementsByTagName("prediction");
            for (var j=0;j<predictions.length;j++)
            {
                var p = predictions[j];
                var pObj = {};
                pObj['time'] = p.getAttribute('time');
                pObj['seconds'] = p.getAttribute('seconds');
                pObj['minutes'] = p.getAttribute('minutes');
                pObj['isDeparture'] = p.getAttribute('isDeparture');
                pObj['dirTag'] = p.getAttribute('dirTag');
                pObj['vehicle'] = p.getAttribute('vehicle');
                pObj['block'] = p.getAttribute('block');
                pObj['tripTag'] = p.getAttribute('tripTag');
                predictionsList.push(pObj);
            }
        }
    }
    xmlhttp.send();
    return predictionsList;
}