// ======= ======= ======= initMap ======= ======= =======
function initMap(zonesCollectionObj, displayObj) {
    console.log('initMap');

    // ======= map styles =======
    var styleArray = [
        { featureType: "all",
            stylers: [
                { saturation: -100 },
                { lightness: 40 }
            ]
        },
        { featureType: "road",
            elementType: "geometry",
            stylers: [
                { hue: "#00ffee" },
                { saturation: -50 }
            ]
        },
        { featureType: "road",
            elementType: 'labels',
            stylers: [
                { saturation: -100 },
                { invert_lightness: false },
                { visibility: "off" }
            ]
        },
        { featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    // ======= map object =======
    var href = window.location.href; // Returns path only
    var pathname = window.location.pathname; // Returns path only

    var imageBounds = {
        north: 39.164,
        south: 38.6235,
        east: -76.655,
        west: -77.375
    };

    // ======= index map =======
    if (displayObj.displayMode != "storyMap") {
        // console.log("*** toolMap ***");
        var mapContainer = document.getElementById('toolMap-container');
        var zoom = 12;

        map = new google.maps.Map(mapContainer, {
            center: {lat: 38.89, lng: -77.02},
            minZoom: 11,
            maxZoom: 12,
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            disableDragZoom: true,
            draggable: true,
            styles: styleArray,     // styles for map tiles
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoom: zoom
        });

        var historicalOverlay = new google.maps.GroundOverlay(
            'images/mapMask.png',
            imageBounds);
        historicalOverlay.setMap(map);

        google.maps.event.addListener(map, 'tilesloaded', function() {
            console.log("tilesloaded.addListener");
         });

    } else {
        console.log("*** storyMap ***");
        var zoom = 10;
        var mapContainer = document.getElementById('storyMap-container');
        map = new google.maps.Map(mapContainer, {
            center: {lat: 38.89, lng: -77.00},
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            zoomControl: false,
            draggable: true,
            scrollwheel: false,
            styles: styleArray,     // styles for map tiles
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoom: zoom
        });
    }
}

// ======= ======= ======= initOverlay ======= ======= =======
function initOverlay(zonesCollectionObj, displayObj) {
    console.log('initOverlay');

    var mapBounds1 = {
        north: 38.80978690876803,
        south: 38.97012261357596,
        east: -76.87777709960938,
        west: -77.12222290039062
    };
    console.log("  mapBounds1: ", mapBounds1);

    var overlay;
    whiteMaskR.prototype = new google.maps.OverlayView();

    var mapBounds2 = new google.maps.LatLngBounds(
        new google.maps.LatLng(38.87, -76.90),
        new google.maps.LatLng(38.82, -77.10)
    );
    console.log("  mapBounds2: ", mapBounds2);

    // The photograph is courtesy of the U.S. Geological Survey.
    var srcImage = 'images/mapWindow2.png';

    // The custom whiteMaskR object contains the USGS image,
    // the bounds of the image, and a reference to the map.
    overlay = new whiteMaskR(mapBounds2, srcImage, map);

    // ======= ======= ======= whiteMaskR ======= ======= =======
    function whiteMaskR(mapBounds2, image, map) {
        console.log('whiteMaskR');

        // Initialize all properties.
        this.bounds_ = mapBounds2;
        this.image_ = image;
        this.map_ = map;

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this.div_ = null;

        // Explicitly call setMap on this overlay.
        this.setMap(map);
    }

    // ======= ======= ======= onAdd ======= ======= =======
    // onAdd is called when the map's panes are ready and the overlay has been added to the map.
    whiteMaskR.prototype.onAdd = function() {
        console.log('onAdd');

        var div = document.createElement('div');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        // Create the img element and attach it to the div.
        var img = document.createElement('img');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';
        div.appendChild(img);

        this.div_ = div;

        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
    };

    // ======= ======= ======= draw ======= ======= =======
    whiteMaskR.prototype.draw = function() {
        console.log('draw');

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
        console.log("  sw: ", sw);
        console.log("  ne: ", ne);

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        // var divW = (ne.x - sw.x);
        // var divH = (sw.y - ne.y);
        // console.log("  divW: ", divW);
        // console.log("  divH: ", divH);
        div.style.left = '-20px';
        div.style.top = '0';
        div.style.width = '1300px';
        div.style.height = '800px';
        // div.style.left = sw.x + 'px';
        // div.style.top = ne.y + 'px';
        // div.style.width = divW + 'px';
        // div.style.height = divH + 'px';
    };

    // The onRemove() method will be called automatically from the API if
    // we ever set the overlay's map property to 'null'.
    whiteMaskR.prototype.onRemove = function() {
        console.log('onRemove');
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    };
}

// ======= ======= ======= hiliteSchoolMarker ======= ======= =======
function hiliteSchoolMarker(schoolsCollectionObj, schoolMarker) {
    console.log("hiliteSchoolMarker");

    schoolMarker.icon.fillColor = "purple";
    schoolMarker.icon.strikeColor = "black";
    schoolMarker.icon.strokeWeight = 6;
    schoolMarker.icon.scale = .6;
    schoolMarker.setMap(map);
    schoolsCollectionObj.selectedMarker = schoolMarker;
}

// ======= ======= ======= getMarkerFromCode ======= ======= =======
function getMarkerFromCode(schoolsCollectionObj, schoolCode) {
    console.log("getMarkerFromCode");
    for (var i = 0; i < schoolsCollectionObj.schoolMarkersArray.length; i++) {
        var checkMarker = schoolsCollectionObj.schoolMarkersArray[i];
        var checkCode = checkMarker.schoolCode;
        console.log("  checkCode: ", checkCode);
        if (schoolCode == checkCode) {
            return checkMarker;
        }
    }
    return null;
}

// ======= ======= ======= getSchoolFromCode ======= ======= =======
function getSchoolFromCode(schoolsCollectionObj, schoolCode) {
    console.log("getSchoolFromCode");

    var nextSchool, schoolName;

    // ======= search school data by name =======
    for (var i = 0; i < schoolsCollectionObj.jsonData.length; i++) {
        checkSchool = schoolsCollectionObj.jsonData[i];
        checkName = checkSchool.School;
        checkCode = checkSchool.School_ID;
        if (schoolCode == checkCode) {
            return checkSchool;
        }
    }
    return null;
}

// ======= ======= ======= resetMarker ======= ======= =======
function resetMarker(schoolMarker) {
    console.log("resetMarker");

    // == set color of school circle
    if (schoolMarker.schoolType == "DCPS") {
        fillColor = "#7aa25c";
        strokeColor = "black";
    } else if (schoolMarker.schoolType == "PCS") {
        fillColor = "orange";
        strokeColor = "crimson ";
    }
    if (schoolMarker.schoolLevel == "CLOSED") {
        fillColor = "white";
        strokeColor = "crimson ";
    }

    schoolMarker.icon.fillColor = schoolMarker.defaultColor;
    schoolMarker.icon.scale = 0.2;
    schoolMarker.icon.strikeColor = strokeColor;
    schoolMarker.icon.strokeWeight = 1;
    schoolMarker.setMap(map);
}

// ======= ======= ======= makeZoneGeometry ======= ======= =======
function makeZoneGeometry(feature) {
    console.log("makeZoneGeometry");
    console.log("  feature: ", feature);

    var polyCount = 0;
    var multiPolyCount = 0;
    var polygonArray = [];
    var featureType, featureBounds;

    // ======= traverse geometry paths for each feature =======
    feature.getGeometry().getArray().forEach(function(path) {
        console.log("  path: ", path);
        featureType = feature.getGeometry().getType();
        featureBounds = new google.maps.LatLngBounds();
        console.log("  featureType: ", featureType);
        if (featureType == "Polygon") {
            polyCount++;
            polygonArray.push(path);

            path.getArray().forEach(function(latLng) {
                featureBounds.extend(latLng);
            });
        } else {
            multiPolyCount++;
            console.log("  path.j: ", path.j);
            polygonArray.push(path.j[0]);

            path.j[0].getArray().forEach(function(latLng) {
                featureBounds.extend(latLng);
            });
        }
    });

    // == get center of each feature
    centerLat = featureBounds.getCenter().lat();
    centerLng = featureBounds.getCenter().lng();
    centerLatLng = new google.maps.LatLng({lat: centerLat, lng: centerLng});
    return centerLatLng;
}
