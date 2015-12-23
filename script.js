$(document).ready(function() {
    console.log('initObjects');

    var map;

    // ======= ======= ======= initMap ======= ======= =======
    function initMap() {
        console.log('initMap');

        // ======= map styles =======
        var styleArray = [
            { featureType: "all",
                stylers: [
                    { saturation: -80 }
                ]
            },
            { featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                ]
            },
            { featureType: "poi.business",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];

        // ======= map object =======
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 38.89, lng: -77.00},
            // center: {lat: -28, lng: 137},
            scrollwheel: false,
            styles: styleArray,
            zoom: 11
            // zoom: 4
        });

        // ======= event listeners =======
        map.data.addListener('mouseover', function(event) {
            // console.log("mouseover");
            map.data.revertStyle();
            map.data.overrideStyle(event.feature, {strokeWeight: 4});
        });

        map.data.addListener('mouseout', function(event) {
            // console.log("mouseout");
            map.data.revertStyle();
        });
    }

    // ======= ======= ======= activateFilterDivs ======= ======= =======
    function activateFilterDivs() {
        console.log('activateFilterDivs');

        var filterDivs = $(".filterDivs");
        for (i = 0; i < $(filterDivs).children().length; i++) {
            nextDiv = $(filterDivs).children()[i];
            console.log("  $(nextDiv).attr('id'): " + $(nextDiv).attr('id'));

            $(nextDiv).on('click', function() {
                console.log("click");
                console.log("  this.id: " + this.id);

                getZoneData(this.id);
            });
        }

    }

    // ======= ======= ======= getZoneData ======= ======= =======
    function getZoneData(zoneType) {
        console.log("getZoneData");
        console.log("  map: " + map);
        console.log("  zoneType: " + zoneType);

        var fillColors = ["green", "red", "orange", "purple", "blue", "yellow", "tomato", "salmon"];
        var url;

        switch(zoneType) {
            case "wards":
                color = fillColors[0];
                url = "GeoData/Ward__2012.geojson";
                break;
            case "feeders":
                color = fillColors[1];
                url = "GeoData/School_Attendance_Zones_Senior_High.geojson";
                break;
            case "public":
                color = fillColors[2];
                url = "GeoData/Public_Schools.geojson";
                break;
            case "charter":
                color = fillColors[7];
                url = "GeoData/Charter_Schools.geojson";
                break;
        }

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: url
        }).done(function(geoJsonData){
            console.log("*** ajax success ***");
            console.dir(geoJsonData);

            // == clear previous geojson layer
            map.data.forEach(function(feature) {
                map.data.remove(feature);
            });

            // == add geojson layer
            map.data.addGeoJson(geoJsonData);

            // == colorize features
            var featureIndex = -1;
            map.data.setStyle(function(feature) {
                featureIndex++;
                color = fillColors[featureIndex];
                return {
                  fillColor: color,
                  strokeWeight: 1
                };
            });

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    initMap();
    activateFilterDivs();

})
