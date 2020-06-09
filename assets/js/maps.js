function initMap() {
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: {
            lat: 46.619261,
            lng: -33.134766
        }
    });

    let labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // create some labels for the map

    let locations = [ // Locations array, containing a set of objects, each object will be lat and long of a place rosie has visited
        { lat: 40.785091, lng: -73.968285 },
        { lat: 41.084045, lng: -73.874245 },
        { lat: 40.754932, lng: -73.9844016 }
    ];

    let markers = locations.map(function (location, i) { // use .map to itereate through the array above and assign it a letter from our labels
        /* console.log(i, location); */
        return new google.maps.Marker({ // so we create a new google map with the location and a label, which uses i to get a label from the label array
            position: location,
            label: labels[i % labels.length] // i % label length will always give a number between 0 and label length. 1%26 = 1, 13%26 = 13, 28 % 26 = 2 and so on..
        });
    });

    /* To create both the marker image for our map, 
    and it's also going to create them in a cluster if they're close 
    together using that clusterer library that we already loaded */
    let markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
}
