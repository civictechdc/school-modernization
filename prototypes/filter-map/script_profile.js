
$(document).ready(function(){
    console.log('jQuery loaded');
    console.log('document ready');
    initApp_P();
});

function initApp_P() {
    console.log('initApp_P');

    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======

    var mapDataObject2;
    var displayObject2;
    var queryString;
    var filterMenu, map;
    var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];

    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        // == Ward, FeederMS, FeederHS, Quadrant
        filterMenu.Ward = { id:"Ward", category:"geography", text:"Ward", column:"WARD", value:null };
        filterMenu.FeederHS = { id:"FeederHS", category:"geography", text:"Feeder HS", column:"FeederHS", value:null };
        filterMenu.FeederMS = { id:"FeederMS", category:"geography", text:"Feeder MS", column:"FeederMS", value:null };
        filterMenu.Quadrant = { id:"Quadrant", category:"geography", text:"Quadrant", column:null, value:null };

    }

    // ======= ======= ======= initDisplayObjects ======= ======= =======
    function initDisplayObjects() {
        console.log("initDisplayObjects");

        displayObject2 = new Display("display2");

    }

    // ======= ======= ======= initChartObjects ======= ======= =======
    function initChartObjects() {
        console.log("initChartObjects");

        mapDataObject2 = new Chart("barChart");
        console.log("  mapDataObject2: ", mapDataObject2);
    }

    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======

    function Menu(whichFilter) {
        console.log("Menu");
        this.name = whichFilter;
    }
    function Display(whichDisplay) {
        console.log("Display");
        this.name = whichDisplay;
        this.geographyMenu = ["geography", filterMenu.Ward, filterMenu.FeederHS, filterMenu.FeederMS, filterMenu.Quadrant];
        this.agencyMenu = ["agency"];
        this.levelsMenu = ["levels"];
        this.expendMenu = ["expenditures"];
        this.studentsMenu = ["students",];
        this.dataFiltersArray = [[null, null], null, null, null, null];
        this.mouseX = null;
        this.mouseY = null;
        this.zoneGeojson = null;
        this.schoolGeojson = null;
    }
    function Chart(whichChart) {
        console.log("Chart");
        this.name = whichChart;
        this.mapBounds = null;
        this.whichLevel = null;
        this.whichAgency = null;
        this.whichGeography = null;
        this.whichExpenditure = null;
        this.whichStudents = null;
        this.selectedSchoolData = null;
        this.zoneDataArray = [];
        this.mapStateArray = [null, null, null, null];
        this.schoolMarkersArray = [];
        this.mapListenersArray = [];
    }



    // ======= ======= ======= ======= ======= PROFILES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= PROFILES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= PROFILES ======= ======= ======= ======= =======



    // ======= ======= ======= makeSchoolChart ======= ======= =======
    Display.prototype.makeSchoolChart = function() {
        console.log("");
        console.log("-- makeSchoolChart --");

        var querySchoolCode = processQueryString();
        var checkSchoolCode = querySchoolCode.schoolCode;
        var url = "Data_Schools/DCPS_Master_114_dev.csv";
        var self = this;
        console.log("  querySchoolCode: ", querySchoolCode);
        console.log("  checkSchoolCode: ", checkSchoolCode);

        // ======= get selected data =======
        $.ajax({
            url: url,
            method: "GET",
            dataType: "text"
        }).done(function(textData){
            console.log("*** ajax success ***");
            jsonData = CSV2JSON(textData);
            console.dir(jsonData);

            displayObject2.schoolGeojson = jsonData;

            var nextFilter;
            var selectedSchoolData;

            // == get school codes for selected zone, level and type
            for (var i = 0; i < jsonData.length; i++) {
                nextSchoolData = jsonData[i];

                // school identity data
                schoolCode = nextSchoolData.SCHOOLCODE;
                schoolName = nextSchoolData.School;
                console.log("  schoolCode: ", schoolCode);

                if (schoolCode == checkSchoolCode) {
                    console.log("*** selected school ***");
                    console.log("  schoolCode: ", schoolCode);
                    selectedSchoolData = nextSchoolData;
                    break;
                }
            }

            self.makeSchoolProfile(selectedSchoolData);

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= makeSchoolProfile ======= ======= =======
    Display.prototype.makeSchoolProfile = function(schoolData) {
        console.log("makeSchoolProfile");
        console.log("  schoolData: ", schoolData);

        var titleString = schoolData.School;
        var chkboxString = "<div class='squaredOne'><input type='checkbox' value='None' id='squaredOne' name='check' /><label for='squaredOne'></label></div>";

        // == header == //
        var htmlString = "<table class='profile'>";
        htmlString += "<tr><th class='data'>data</th><th class='values'>values</th><th class='select'>select</th></tr>";

        htmlString += "<tr><td>Address</td><td>" + schoolData.Address + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Level</td><td>" + schoolData.Level + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Public/Charter</td><td>" + schoolData.Agency + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Ward</td><td>" + schoolData.WARD + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Feeder (MS)</td><td>" + schoolData.FeederMS + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Feeder (HS)</td><td>" + schoolData.FeederHS + "</td><td>" + chkboxString + "</td></tr>";

            // school building data
            htmlString += "<tr><td>School Code</td><td>" + schoolData.SCHOOLCODE + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Total Sqft</td><td>" + schoolData.totalSQFT + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Max Occupancy</td><td>" + schoolData.maxOccupancy + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>SqFt Per Student</td><td>" + schoolData.SqFtPerEnroll + "</td><td>" + chkboxString + "</td></tr>";

            // student population data
        htmlString += "<tr><td>Total Enrollment</td><td>" + schoolData.Total_Enrolled + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>English Enrollment</td><td>" + schoolData.Limited_English + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>At-Risk Enrollment</td><td>" + schoolData.At_Risk + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Spec-Ed Enrollment</td><td>" + schoolData.SpecEd_fake + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>ESL Percent</td><td>" + schoolData.ESLPer + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>AtRisk Percent</td><td>" + schoolData.AtRiskPer + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>SPED Percent</td><td>" + schoolData.SPEDPer + "</td><td>" + chkboxString + "</td></tr>";

            // spending data
        htmlString += "<tr><td>Past Spending</td><td>" + schoolData.MajorExp9815 + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Lifetime Spending</td><td>" + schoolData.LifetimeBudget + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Planned Spending</td><td>" + schoolData.TotalAllotandPlan1621 + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Spending per SqFt</td><td>" + schoolData.SpentPerSqFt + "</td><td>" + chkboxString + "</td></tr>";           // Sqft
        htmlString += "<tr><td>LTsqft</td><td>" + schoolData.LTBudgetPerSqFt + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "<tr><td>Spent per Enrollment</td><td>" + schoolData.SpentPerEnroll + "</td><td>" + chkboxString + "</td></tr>";       // Student
        htmlString += "<tr><td>LTenroll</td><td>" + schoolData.LTBudgetPerEnroll + "</td><td>" + chkboxString + "</td></tr>";
        htmlString += "</table>";

        $("#schoolTitle").html(titleString);
        $("#profileData").html(htmlString);

    }



    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======




    // ======= ======= ======= initMap ======= ======= =======
    function initMap() {
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

        // ======= profile map =======
        map = new google.maps.Map(document.getElementById('map2'), {
            center: {lat: 38.89, lng: -77.00},
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            zoomControl: true,
            zoomControlOpt: {
                style: 'SMALL',
                position: 'TOP_LEFT'
            },
            draggable: false,
            scrollwheel: false,
            styles: styleArray,     // styles for map tiles
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoom: 10
        });

        google.maps.event.addListener(map, 'tilesloaded', function() {
            console.log("tilesloaded.addListener");
            if (!mapDataObject2.mapBounds) {
                mapDataObject2.mapBounds = map.getBounds();
                // console.log("  mapDataObject2.mapBounds: ",mapDataObject2.mapBounds);
                // makeOverlay();
            }
        });

    }

    // ======= ======= ======= makeZoneMap ======= ======= =======
    Chart.prototype.makeZoneMap = function(geoJsonData, featureArray, zoneType) {
        console.log("");
        console.log("----- makeZoneMap -----");

        var self = this;

        // ======= clear existing listeners if any =======
        removeMapListeners();
        removeMarkers();

        // ======= clear previous geojson layer =======
        map.data.forEach(function(feature) {
            if (feature) {
                var itemName = feature.getProperty('itemName');
            }
            map.data.remove(feature);
        });

        // ======= add geojson layer =======
        map.data.addGeoJson(geoJsonData);

        // == set indexes
        var colorIndex = -1;
        var featureIndex = -1;

        // ======= add index, ward, feeder properties to each feature =======
        map.data.forEach(function(feature) {
            colorIndex++;
            featureIndex++;

            var itemName, featureType, featureBounds;

            // == repeat colors of more features than colors
            if (colorIndex == fillColors.length) {
                colorIndex = 0;
            }

            // == get name of each feature
            if ((zoneType == "Ward") || (zoneType == "Quadrant")) {
                itemName = feature.getProperty('NAME');
            } else if ((zoneType == "FeederMS") || (zoneType == "FeederHS")) {
                itemName = feature.getProperty('SCHOOLNAME');
            }

            // ======= traverse geometry paths for each feature =======
            feature.getGeometry().getArray().forEach(function(path) {
                featureType = feature.getGeometry().getType();
                featureBounds = new google.maps.LatLngBounds();
                if (featureType == "Polygon") {
                    path.getArray().forEach(function(latLng) {
                        featureBounds.extend(latLng);
                    });
                } else {
                    // console.log("  multipolygon ", itemName);
                }
            });

            // == get center of each feature
            centerLat = featureBounds.getCenter().lat();
            centerLng = featureBounds.getCenter().lng();
            centerLatLng = new google.maps.LatLng({lat: centerLat, lng: centerLng});

            // ======= set feature properties =======
            feature.setProperty('index', featureIndex);
            feature.setProperty('center', centerLatLng);
            feature.setProperty('featureBounds', featureBounds);
            if (zoneType == "Quadrant") {
                feature.setProperty('itemColor', "white");
            } else {
                feature.setProperty('itemColor', fillColors[colorIndex]);
            }
            feature.setProperty('itemName', itemName);

        });

        // ======= colorize each feature based on colorList =======
        map.data.setStyle(function(feature) {
            var nextColor = feature.getProperty('itemColor');
            // console.log("  nextColor: ", nextColor);
            return {
              fillColor: nextColor,
              strokeColor: "purple",
              strokeWeight: 1
            };
        });
    }

    // ======= ======= ======= makeDataMap ======= ======= =======
    Chart.prototype.makeDataMap = function() {
        console.log("");
        console.log("===== makeDataMap =====");
        // console.log("  displayObject2.dataFiltersArray: ", displayObject2.dataFiltersArray);

        var self = this;
        var filterFlag = false;
        var whichZoneType = displayObject2.dataFiltersArray[0][0];
        if (whichZoneType == null) {
            var whichZoneType = "Quadrant";
        } else {
            var whichZoneType = displayObject2.dataFiltersArray[0][0];
        }

        var url = getZoneUrl(whichZoneType);

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: url
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            console.dir(geoJsonData);

            displayObject2.zoneGeojson = geoJsonData;

            // == make aggregator array for aggregated zone data
            self.zoneDataArray = [];
            var zoneDataArray = []
            for (var i = 0; i < geoJsonData.features.length; i++) {
                zoneDataArray.push(0);
            }
            self.zoneDataArray = zoneDataArray;

            // == check for selected filters; get data if any selected
            for (var i = 1; i < displayObject2.dataFiltersArray.length; i++) {
                nextFilter = displayObject2.dataFiltersArray[i];
                if (nextFilter != null) {
                    filterFlag = true;
                    self.getSchoolData(geoJsonData, featureArray, whichZoneType);
                    break;
                }
            }
            if (filterFlag == false) {
                self.makeZoneMap(geoJsonData, featureArray, whichZoneType);
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }


    // ======= ======= ======= resetMap ======= ======= =======
    Chart.prototype.resetMap = function() {
        console.log("resetMap");

        // == mapStateArray:[mapZoom, mapCentre, mapLat, mapLng]
        var savedMapZoom = this.mapStateArray[0];
        var savedMapCenter = this.mapStateArray[1];
        var savedMapLat = this.mapStateArray[2];
        var savedMapLng = this.mapStateArray[3];
        map.setCenter(new google.maps.LatLng(savedMapLat,savedMapLng));
        map.setZoom(savedMapZoom);
    }

    // ======= ======= ======= makeOverlay ======= ======= =======
    function makeOverlay() {
        console.log('makeOverlay');

        var schoolOverlay1;
        schoolIconsOverlay.prototype = new google.maps.OverlayView();

        var bounds = new google.maps.LatLngBounds();
        var center = bounds.getCenter();

        // var bounds = new google.maps.LatLngBounds(
        //     new google.maps.LatLng(62.281819, -150.287132),
        //     new google.maps.LatLng(62.400471, -150.005608));

        var srcImageP = "images/15xvbd5.png";
        // var srcImageP = "images/schoolIconP.png";
        var srcImageC = "images/schoolIconC.png";

        schoolOverlay1 = new schoolIconsOverlay(bounds, srcImageP, map);

        // ======= ======= ======= Overlay.onAdd ======= ======= =======
        schoolIconsOverlay.prototype.onAdd = function() {
            console.log('Overlay.onAdd');

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

            this.iconDiv_ = div;

            // Add the element to the "overlayLayer" pane.
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
        };

        // ======= ======= ======= Overlay.draw ======= ======= =======
        schoolIconsOverlay.prototype.draw = function() {
            console.log('Overlay.draw');

            // We use the south-west and north-east
            // coordinates of the overlay to peg it to the correct position and size.
            // To do this, we need to retrieve the projection from the overlay.
            var overlayProjection = this.getProjection();

            // Retrieve the south-west and north-east coordinates of this overlay
            // in LatLngs and convert them to pixel coordinates.
            // We'll use these coordinates to resize the div.
            var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
            var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

            // Resize the image's div to fit the indicated dimensions.
            var div = this.iconDiv_;
            div.style.left = sw.x + 'px';
            div.style.top = ne.y + 'px';
            div.style.width = (ne.x - sw.x) + 'px';
            div.style.height = (sw.y - ne.y) + 'px';
        };

        // ======= ======= ======= schoolIconsOverlay ======= ======= =======
        function schoolIconsOverlay(bounds, image, map) {
            console.log('schoolIconsOverlay');

          // Initialize all properties.
          this.bounds_ = bounds;
          this.image_ = image;
          this.map_ = map;

          // Define a property to hold the image's div. We'll
          // actually create this div upon receipt of the onAdd()
          // method so we'll leave it null for now.
          this.iconDiv_ = null;

          // Explicitly call setMap on this overlay.
          this.setMap(map);
        }
    }



    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======



    // ======= ======= ======= saveMapState ======= ======= =======
    function saveMapState(map) {
        console.log('saveMapState');
        var mapZoom = map.getZoom();
        var mapCentre = map.getCenter();
        var mapLat = mapCentre.lat();
        var mapLng = mapCentre.lng();
        var mapStateArray = [mapZoom, mapCentre, mapLat, mapLng];
        mapDataObject2.mapStateArray = mapStateArray;
    }

    // ======= ======= ======= getZoneUrl ======= ======= =======
    function getZoneUrl(whichZoneType) {
        console.log("getZoneUrl");

        var url;

        switch(whichZoneType) {
            case "Ward":
                url = "Data_Geo/Ward__2012.geojson";
                break;
            case "FeederHS":
                url = "Data_Geo/School_Attendance_Zones_Senior_High.geojson";
                break;
            case "FeederMS":
                url = "Data_Geo/School_Attendance_Zones_Middle_School.geojson";
                break;
            case "Quadrant":
                url = "Data_Geo/DC_Quadrants.geojson";
                break;
            default:
                url = "Data_Geo/DC_Quadrants.geojson";
                break;
        }
        return url;
    }

    // ======= ======= ======= getDataDetails ======= ======= =======
    function getDataDetails(nextSchool) {
        console.log("getDataDetails");

        var schoolData = {
            // school identity data
            "schoolCode": nextSchool.SCHOOLCODE,
            "schoolName": nextSchool.School,
            "schoolWard": nextSchool.WARD,
            "schoolFeederMS": nextSchool.FeederMS,
            "schoolFeederHS": nextSchool.FeederHS,
            "schoolAddress": nextSchool.Address,
            "schoolLAT": nextSchool.LAT,
            "schoolLON": nextSchool.LON,
            "schoolLevel": nextSchool.Level,
            "schoolAgency": nextSchool.Agency,

            // school building data
            "schoolSqft": nextSchool.totalSQFT,
            "schoolMaxOccupancy": nextSchool.maxOccupancy,
            "schoolSqFtPerEnroll": nextSchool.SqFtPerEnroll,

            // student population data
            "schoolEnroll": nextSchool.Total_Enrolled,
            "studentEng": nextSchool.Limited_English,
            "studentAtRisk": nextSchool.At_Risk,
            "studentSpecEd": nextSchool.SpecEd_fake,
            "studentESLPer": nextSchool.ESLPer,
            "studentAtRiskPer": nextSchool.AtRiskPer,
            "studentSPEDPer": nextSchool.SPEDPer,

            // spending data (spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll)
            "spendPast": nextSchool.MajorExp9815,
            "spendLifetime": nextSchool.LifetimeBudget,
            "spendPlanned": nextSchool.TotalAllotandPlan1621,
            "spendSqFt": nextSchool.SpentPerSqFt,           // Sqft
            "spendLTsqft": nextSchool.LTBudgetPerSqFt,
            "spendEnroll": nextSchool.SpentPerEnroll,       // Student
            "spendLTenroll": nextSchool.LTBudgetPerEnroll
        }
       return schoolData;
    }

    // ======= ======= ======= removeMapListeners ======= ======= =======
    function removeMapListeners() {
        console.log("removeMapListeners");

        google.maps.event.clearListeners(map, 'mouseover');
        google.maps.event.clearListeners(map, 'mouseout');
        google.maps.event.clearListeners(map, 'click');

        console.log("  listeners_before: ", mapDataObject2.mapListenersArray.length);
        var mapListenersArray = mapDataObject2.mapListenersArray;
        if (mapListenersArray.length > 0) {
            for (var i = 0; i < mapListenersArray.length; i++) {
                google.maps.event.removeListener(mapListenersArray[i]);
            }
        }
        mapDataObject2.mapListenersArray = [];
        console.log("  listeners_after: ", mapDataObject2.mapListenersArray.length);
    }

    // ======= ======= ======= removeMarkers ======= ======= =======
    function removeMarkers() {
        console.log("removeMarkers");

        console.log("  markers_before: ", mapDataObject2.schoolMarkersArray.length);
        var schoolMarkersArray = mapDataObject2.schoolMarkersArray;
        if (schoolMarkersArray) {
            for(i = 0; i < schoolMarkersArray.length; i++){
                schoolMarkersArray[i].setMap(null);
                schoolMarkersArray[i] = null;
            }
        }
        mapDataObject2.schoolMarkersArray = [];
        console.log("  markers_after: ", mapDataObject2.schoolMarkersArray.length);
    }

    // ======= ======= ======= makeTooltip ======= ======= =======
    function makeTooltip(tooltipText, locX, locY) {
        // console.log("makeTooltip");
        if (tooltipText) {
            // console.log("  tooltipText: ", tooltipText);
            tooltipString = "<p>" + tooltipText + "</p>";
            $("#tooltips").html(tooltipString);
            $("#tooltips").css("left", locX);
            $("#tooltips").css("top", locY);
        } else {
            $("#tooltips").html("");
        }
    }

    // ======= ======= ======= showInfo ======= ======= =======
    function showInfo(infoText) {
        // console.log("showInfo");
        if (infoText) {
            // console.log("  infoText: ", infoText);
            infoText = "<p>" + infoText + "</p>";
            $("#infoText").html(infoText);
        } else {
            $("#infoText").html("");
        }
    }

    // ======= ======= ======= processQueryString ======= ======= =======
    function processQueryString() {
        console.log("processQueryString");

        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        console.log("  query_string: ", query_string);
        return query_string;
    }




    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======



    initMap();
    initMenuObjects();
    initChartObjects();
    initDisplayObjects();
    displayObject2.makeSchoolChart();
    saveMapState(map);
    mapDataObject2.makeDataMap("Quadrant");



}
