// ======= ======= ======= initMap ======= ======= =======
function initMap(zonesCollectionObj, displayObj) {
    console.log('initMap');
    console.log('  displayObj.displayMode: ', displayObj.displayMode);

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
        console.log("*** toolMap ***");
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

        // map.setOptions({ minZoom: 10, maxZoom: 11 });

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

    // google.maps.event.addDomListener(window, 'load', initMap);
}



// // ======= ======= ======= getZoneData ======= ======= =======
// ZonesCollection.prototype.getZoneData = function() {
//     console.log("\n----- getZoneData -----");
//
//     var self = this;
//     var selectedZonesArray = getZoneUrls(displayObj, zonesCollectionObj);
//     var urlA = selectedZonesArray[0];
//     var urlB = selectedZonesArray[1];
//     var feederFlag = selectedZonesArray[2];
//
//     // ======= get map geojson data =======
//     $.ajax({
//         dataType: "json",
//         url: urlA
//     }).done(function(geoJsonData, featureArray){
//         console.log("*** ajax success ***");
//         self.zoneGeojson_A = geoJsonData;
//         console.dir(self.zoneGeojson_A );
//
//         // == aggregate for urlA zones
//         if (self.aggregatorArray.length == 0) {
//             makeZoneAggregator(self, self.zoneGeojson_A);
//         }
//
//         // == get secondary map data for urlB
//         if (feederFlag == true) {
//             self.getFeederZones(urlB);
//         } else {
//             schoolsCollectionObj.getSchoolData();
//         }
//
//     // == errors/fails
//     }).fail(function(){
//         console.log("*** ajax fail ***");
//     }).error(function() {
//         console.log("*** ajax error ***");
//     });
// }
//
// // ======= ======= ======= makeZoneLayer ======= ======= =======
// ZonesCollection.prototype.makeZoneLayer = function() {
//     console.log("\n----- makeZoneLayer -----");
//
//     var self = this;
//     var colorIndex = -1;
//     var featureIndex = -1;
//     var itemOpacity = 0.5;
//     var strokeColor = "purple";
//     var strokeWeight = 2;
//     var itemColor, itemOpacity, centerLatLng, zoneName;
//
//     // ======= ======= ======= cleanup ======= ======= =======
//     de_activateZoneListeners(this);
//     var featureCount = 0
//     map.data.forEach(function(feature) {
//         if (feature) {
//             featureCount++;
//             itemName = feature.getProperty('itemName');
//             map.data.remove(feature);
//         }
//     });
//     this.zoneFeaturesArray = [];
//
//     // ======= ======= ======= add single or merged geoJson to map ======= ======= =======
//     zoneAcount = this.zoneGeojson_A.features.length;
//     if (this.zoneGeojson_AB) {
//         map.data.addGeoJson(this.zoneGeojson_AB);
//         zoneBcount = this.zoneGeojson_B.features.length;
//     } else {
//         map.data.addGeoJson(this.zoneGeojson_A);
//         zoneBcount = 0;
//     }
//
//     // ======= ======= ======= calculate min, max, increment, average, median ======= ======= =======
//     // ======= FEATURES DATA LOOP =======
//     map.data.forEach(function(feature) {
//         featureIndex++;
//
//         // ======= get and validate name for each feature =======
//         zoneName = removeAbbreviations(feature.getProperty('NAME'))
//
//         // ======= get center lat lng of feature =======
//         centerLatLng = makeZoneGeometry(feature);
//
//         // ======= set feature properties =======
//         feature.setProperty('itemName', zoneName);
//         feature.setProperty('center', centerLatLng);
//         feature.setProperty('index', featureIndex);
//
//         // ======= store feature properties =======
//         self.zoneFeaturesArray.push(feature);
//     });
//
//     // ======= FEATURES FORMATTING LOOPS =======
//     var featureIndex = -1;
//     var dataDelayCount = 0;
//     if (zoneBcount > 0) {
//
//         // == elementary or middle school zones in feeder areas
//         console.log("*** LOWER ZONES ***");
//         for (var i = 0; i < zoneBcount; i++) {
//             var start = new Date().getTime();
//             feature = self.zoneFeaturesArray[i];
//             nextName = feature.getProperty('itemName');
//             featureIndex++;
//
//             zoneFormatArray = getZoneFormat(self, displayObj, featureIndex, nextName, "lower");
//
//             feature.setProperty('itemColor', zoneFormatArray[0]);
//             feature.setProperty('strokeColor', zoneFormatArray[1]);
//             feature.setProperty('strokeWeight', zoneFormatArray[2]);
//             feature.setProperty('itemOpacity', zoneFormatArray[3]);
//
//             setFeatureStyle(feature);
//         }
//
//         // == feeder zones or wards
//         console.log("*** UPPER ZONES ***");
//         for (var i = zoneBcount; i < self.zoneFeaturesArray.length; i++) {
//             var start = new Date().getTime();
//             feature = self.zoneFeaturesArray[i];
//             nextName = feature.getProperty('itemName');
//             featureIndex++;
//
//             zoneAIndex = featureIndex - zoneBcount;
//             zoneFormatArray = getZoneFormat(self, displayObj, zoneAIndex, nextName, "upper");
//
//             feature.setProperty('itemColor', zoneFormatArray[0]);
//             feature.setProperty('strokeColor', zoneFormatArray[1]);
//             feature.setProperty('strokeWeight', zoneFormatArray[2]);
//             feature.setProperty('itemOpacity', zoneFormatArray[3]);
//
//             setFeatureStyle(feature);
//         }
//
//     // == single zone layer
//     } else {
//         for (var i = 0; i < self.zoneFeaturesArray.length; i++) {
//             var start = new Date().getTime();
//             feature = self.zoneFeaturesArray[i];
//             nextName = feature.getProperty('itemName');
//             featureIndex++;
//             colorIndex++;
//
//             zoneFormatArray = getZoneFormat(self, displayObj, featureIndex, nextName, "single");
//
//             feature.setProperty('itemColor', zoneFormatArray[0]);
//             feature.setProperty('strokeColor', zoneFormatArray[1]);
//             feature.setProperty('strokeWeight', zoneFormatArray[2]);
//             feature.setProperty('itemOpacity', zoneFormatArray[3]);
//
//             setFeatureStyle(feature);
//         }
//     }
//
//     // ======= ======= ======= setFeatureStyle ======= ======= =======
//     function setFeatureStyle(feature) {
//         // console.log("setFeatureStyle");
//
//         // ======= colorize each feature based on colorList =======
//         map.data.setStyle(function(feature) {
//             var nextColor = feature.getProperty('itemColor');
//             var strokeColor = feature.getProperty('strokeColor');
//             var strokeWeight = feature.getProperty('strokeWeight');
//             var nextOpacity = feature.getProperty('itemOpacity');
//             return {
//               fillColor: nextColor,
//               strokeColor: strokeColor,
//               strokeWeight: strokeWeight,
//               fillOpacity: nextOpacity
//             };
//         });
//     }
//
//     // ======= ======= ======= show rankings chart ======= ======= =======
//     if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
//         if (displayObj.dataFilters.expend) {
//             makeRankChart(zonesCollectionObj, schoolsCollectionObj, displayObj, zoneBcount);
//         } else {
//             console.log("  displayObj.displayMode: ", displayObj.displayMode);
//             if (displayObj.displayMode == "storyMap") {
//                 var chartHtml = "<div id='chart'>&nbsp;</div>";
//                 $("#chart-container").append(chartHtml);
//             }
//         }
//     }
// }
//
// // ======= ======= ======= activateZoneListeners ======= ======= =======
// ZonesCollection.prototype.activateZoneListeners = function() {
//     console.log("activateZoneListeners");
//     console.log("  this.zoneA: ", this.zoneA);
//
//     var self = this;
//     var zoneA = this.zoneA;
//
//     // ======= ======= ======= mouseover ======= ======= =======
//     var zoneMouseover = map.data.addListener('mouseover', function(event) {
//         // console.log("--- mouseover ---");
//         var itemName = event.feature.getProperty('itemName');
//         updateHoverText(itemName);
//         displayFilterMessage("Select zone or school");
//         if (map.get('clickedZone')!= event.feature ) {
//             map.data.overrideStyle(event.feature, {
//                 fillColor: "white",
//                 fillOpacity: 0.5,
//                 strokePosition: "center",
//                 strokeWeight: 8
//             });
//         }
//     });
//
//     // ======= ======= ======= mouseout ======= ======= =======
//     var zoneMouseout = map.data.addListener('mouseout', function(event) {
//         // console.log("--- mouseout ---");
//         var featureIndex = event.feature.getProperty('index');
//         var itemColor = event.feature.getProperty('itemColor');
//         if (map.get('clickedZone')!= event.feature ) {
//             map.data.overrideStyle(event.feature, {
//                 fillColor: itemColor,
//                 strokeWeight: 1
//             });
//         }
//         updateHoverText(null);
//     });
//
//     // ======= ======= ======= click ======= ======= =======
//     var zoneMouseClick = map.data.addListener('click', function(event) {
//         console.log("\n======= select zone =======");
//
//         // == identify clicked zone from zone name value
//         var zoneName = event.feature.getProperty('NAME');
//         var checkZone = zoneName.indexOf(", ");
//         if (checkZone > -1) {
//             splitZoneName = zoneName.split(", ");
//             var zoneName = splitZoneName[0];
//         }
//         console.log("zoneName: ", zoneName);
//
//         // == set new zone info on menuObject
//         displayObj.dataFilters.selectedZone = zoneName;
//
//         updateHoverText(zoneName);
//         displayFilterMessage(displayObj, zoneName, "add");
//         de_activateZoneListeners(self);
//
//         zonesCollectionObj.getZoneData();
//         // zoomToZone(event);
//     });
//
//     // == add listeners to listeners array
//     this.mapListenersArray.push(zoneMouseover);
//     this.mapListenersArray.push(zoneMouseout);
//     this.mapListenersArray.push(zoneMouseClick);
//
//     // ======= ======= ======= zoomToZone ======= ======= =======
//     function zoomToZone(event) {
//         console.log("zoomToZone");
//         var clickedZone = map.get('clickedZone');
//         if (clickedZone && clickedZone != event.feature) {
//             map.data.revertStyle(clickedZone);
//         }
//         map.set('clickedZone', event.feature);
//         map.data.overrideStyle(event.feature, {
//             fillOpacity: 0.9,
//             fillColor: "gray",
//             strokeWeight: 4
//         });
//
//         var bounds = new google.maps.LatLngBounds();
//         var center = bounds.getCenter();
//         processPoints(event.feature.getGeometry(), bounds.extend, bounds);
//         map.fitBounds(bounds);
//     }
//
//     // ======= ======= ======= processPoints ======= ======= =======
//     function processPoints(geometry, callback, thisArg) {
//         if (geometry instanceof google.maps.LatLng) {
//             // console.log("  ** google.maps.LatLng");
//             callback.call(thisArg, geometry);
//         } else if (geometry instanceof google.maps.Data.Point) {
//             // console.log("  ** bounds.extend");
//             callback.call(thisArg, geometry.get());
//         } else {
//             // console.log("  ** geometry.getArray");
//             geometry.getArray().forEach(function(g) {
//                 processPoints(g, callback, thisArg);
//             });
//         }
//     }
// }
//
// // ======= ======= ======= makeSchoolLayer ======= ======= =======
// SchoolsCollection.prototype.makeSchoolLayer = function() {
//     console.log("\n----- makeSchoolLayer -----");
//
//     var selectedSchoolsArray = this.selectedSchoolsArray;
//
//     // ======= clear existing listeners if any =======
//     removeMarkers(this);
//
//     // == get data to load on markers
//     for (var i = 0; i < selectedSchoolsArray.length; i++) {
//         nextSchoolData = selectedSchoolsArray[i];
//         schoolMarker = null;
//         nextSchool = nextSchoolData.schoolName;
//         nextSchoolCode = nextSchoolData.schoolCode;
//         nextSchoolType = nextSchoolData.schoolAgency;
//         nextSchoolAddress = nextSchoolData.schoolAddress;
//         unqBuilding = nextSchoolData.unqBuilding;
//         nextLat = nextSchoolData.schoolLAT;
//         nextLng = nextSchoolData.schoolLON;
//         schoolLoc = new google.maps.LatLng(nextLat, nextLng);
//
//         // == set color of school circle
//         if (nextSchoolType == "DCPS") {
//             fillColor = "red";
//             strokeColor = "maroon";
//         } else {
//             fillColor = "orange";
//             strokeColor = "crimson ";
//         }
//
//         // == show markers for available data
//         if (displayObj.displayMode == "storyMap") {
//             var iconSize = 0.15;
//         } else {
//             var iconSize = 0.2;
//         }
//         var icon = {
//             path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
//             fillColor: fillColor,
//             strokeColor: strokeColor,
//             fillOpacity: 1,
//             strokeWeight: 1,
//             scale: iconSize
//         }
//
//         var schoolMarker = new google.maps.Marker({
//             map: map,
//             icon: icon,
//             title: nextSchool,
//             draggable: false,
//             position: schoolLoc,
//             schoolIndex: i,
//             schoolName: nextSchool,
//             schoolCode: nextSchoolCode,
//             schoolType: nextSchoolType,
//             unqBuilding: unqBuilding,
//             schoolAddress: nextSchoolAddress,
//             defaultColor: fillColor
//         });
//         schoolMarker.setMap(map);
//
//         // == store marker on chart object
//         this.schoolMarkersArray.push(schoolMarker);
//
//         // == activate marker mouseover/mouseout
//         this.activateSchoolMarker(schoolMarker, true);
//     }
//
// // ======= ======= ======= activateSchoolMarker ======= ======= =======
// SchoolsCollection.prototype.activateSchoolMarker = function(schoolMarker, mouseClick) {
//     // console.log("activateSchoolMarker");
//
//     // ======= mouseover event listener =======
//     google.maps.event.addListener(schoolMarker, 'mouseover', function (event) {
//         // console.log("--- mouseover ---");
//         var schoolIndex = this.schoolIndex;
//         var schoolName = this.schoolName;
//         var schoolType = this.schoolType;
//         var unqBuilding = this.unqBuilding;
//         if (unqBuilding == 2) {
//             schoolName = "multiple schools/shared address";
//             schoolType = "";
//         }
//         updateHoverText(schoolName, schoolType);
//     });
//
//     // ======= mouseout event listener =======
//     google.maps.event.addListener(schoolMarker, 'mouseout', function (event) {
//         // console.log("--- mouseout ---");
//         updateHoverText(null);
//     });
//
//     // ======= click event listener =======
//     if (mouseClick == true) {
//         google.maps.event.addListener(schoolMarker, 'click', function (event) {
//             console.log("--- click ---");
//             var schoolIndex = this.schoolIndex;
//             var schoolName = this.schoolName;
//             var schoolCode = this.schoolCode;
//             var unqBuilding = this.unqBuilding;
//             console.log("  schoolCode: ", schoolCode);
//             if (unqBuilding == 2) {
//                 multiSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, null, schoolIndex);
//             } else {
//                 makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, null, schoolIndex);
//             }
//         });
//     }
// }
//
// // ======= ======= ======= hiliteSchoolMarker ======= ======= =======
// function hiliteSchoolMarker(foundDataArray) {
//     console.log("hiliteSchoolMarker");
//
//     var schoolMarker = schoolsCollectionObj.schoolMarkersArray[foundDataArray[0][0]];
//     console.dir(schoolMarker);
//
//     schoolMarker.icon.fillColor = "white";
//     schoolMarker.icon.strikeColor = "black";
//     schoolMarker.icon.strokeWeight = 6;
//     schoolMarker.icon.scale = 0.4;
//     schoolMarker.setMap(map);
//
//     setTimeout(resetMarker, 3000);
//
//     function resetMarker() {
//         schoolMarker.icon.fillColor = schoolMarker.defaultColor;
//         schoolMarker.icon.scale = 0.2;
//         schoolMarker.icon.strikeColor = "purple";
//         schoolMarker.icon.strokeWeight = 2;
//         schoolMarker.setMap(map);
//     }
// }
