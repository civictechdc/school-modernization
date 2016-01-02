$(document).ready(function(){
    console.log('jQuery loaded');
    console.log('document ready');
    initApp();
});

function initApp() {
    console.log('initApp');

    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======

    var chartObject;
    var displayObject;
    var filterMenu, map;
    var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];


    // ======= ======= ======= initFilterObjects ======= ======= =======
    function initFilterObjects() {
        console.log("initFilterObjects");

        // == filter object properties: id, category, text, callback
        filterMenu = new Filter("filterMenu");
        filterMenu.Yprev = { id:"Yprev", category:"years", text:"1998-2013", callback:"setYears" };
        filterMenu.Y2014 = { id:"Y2014", category:"years", text:"2014", callback:"setYears" };
        filterMenu.Y2015 = { id:"Y2015", category:"years", text:"2015", callback:"setYears" };
        filterMenu.Y2016 = { id:"Y2016", category:"years", text:"2016", callback:"setYears" };
        filterMenu.Ynext = { id:"Ynext", category:"years", text:"2016-2021", callback:"setYears" };
        filterMenu.Public = { id:"Public", category:"schools", text:"Public Schools", callback:"setSchools" };
        filterMenu.Charter = { id:"Charter", category:"schools", text:"Charter Schools", callback:"setSchools" };
        filterMenu.Elem = { id:"Elem", category:"schools", text:"Elementary Schools", callback:"setSchools" };
        filterMenu.Middle = { id:"Middle", category:"schools", text:"Middle Schools", callback:"setSchools" };
        filterMenu.High = { id:"High", category:"schools", text:"High Schools", callback:"setSchools" };
        filterMenu.Youth = { id:"Youth", category:"schools", text:"Youth Engagement", callback:"setSchools" };
        filterMenu.All = { id:"All", category:"students", text:"All Students", callback:"setStudents" };
        filterMenu.AtRisk = { id:"AtRisk", category:"students", text:"At-Risk Students", callback:"setStudents" };
        filterMenu.SpecEd = { id:"SpecEd", category:"students", text:"Spec Ed Students", callback:"setStudents" };
        filterMenu.Grad = { id:"Grad", category:"students", text:"Graduated Students", callback:"setStudents" };
        filterMenu.Sqft = { id:"Sqft", category:"buildings", text:"Square Footage", callback:"setBuilding" };
        filterMenu.Capacity = { id:"Capacity", category:"buildings", text:"Capacity", callback:"setBuilding" };
        filterMenu.PopNow = { id:"PopNow", category:"buildings", text:"Current Population", callback:"setBuilding" };
        filterMenu.PopFuture = { id:"PopFuture", category:"buildings", text:"Future Population", callback:"setBuilding" };
        filterMenu.Ward = { id:"Ward", category:"geography", text:"Ward", callback:"setGeography" };
        filterMenu.Feeder = { id:"Feeder", category:"geography", text:"Feeder", callback:"setGeography" };
        filterMenu.Quadrant = { id:"Quadrant", category:"geography", text:"Quadrant", callback:"setGeography" };
    }

    // ======= ======= ======= initDisplayObjects ======= ======= =======
    function initDisplayObjects() {
        console.log("initDisplayObjects");

        // == display object properties: name, yearsMenu, schoolsMenu, studentsMenu, buildingsMenu, geographyMenu
        displayObject = new Display("display1");
    }

    // ======= ======= ======= initChartObjects ======= ======= =======
    function initChartObjects() {
        console.log("initChartObjects");

        // == display object properties: name, yearsMenu, schoolsMenu, studentsMenu, buildingsMenu, geographyMenu
        chartObject = new Chart("chart1");
    }

    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======

    function Filter(whichFilter) {
        console.log("Filter");
        this.name = whichFilter;
    }
    function Display(whichDisplay) {
        console.log("Display");
        this.name = whichDisplay;
        this.yearsMenu = ["years", filterMenu.Yprev, filterMenu.Y2014, filterMenu.Y2015, filterMenu.Y2016, filterMenu.Ynext];
        this.schoolsMenu = ["schools", filterMenu.Public, filterMenu.Charter, filterMenu.Elem, filterMenu.Middle, filterMenu.High, filterMenu.Youth];
        this.studentsMenu = ["students", filterMenu.All, filterMenu.AtRisk, filterMenu.SpecEd, filterMenu.Grad];
        this.buildingsMenu = ["buildings", filterMenu.Sqft, filterMenu.Capacity, filterMenu.PopNow, filterMenu.PopFuture];
        this.geographyMenu = ["geography", filterMenu.Ward, filterMenu.Feeder, filterMenu.Quadrant];
    }
    function Chart(whichChart) {
        console.log("Chart");
        this.name = whichChart;
        this.geoJson = null;
        this.whichYears = null;
        this.whichSchools = null;
        this.whichStudents = null;
        this.whichBuildings = null;
        this.whichGeography = null;
    }

    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======

    // ======= ======= ======= getFilteredData ======= ======= =======
    Chart.prototype.getFilteredData = function(whichMenu) {
        console.log("getFilteredData");

        console.log("  whichYears: " + chartObject.whichYears);
        console.log("  whichSchools: " + chartObject.whichSchools.length);
        console.log("  whichStudents: " + chartObject.whichStudents);
        console.log("  whichBuildings: " + chartObject.whichBuildings);
        console.log("  whichGeography: " + chartObject.whichGeography);

        var polygon, nextFeature, nextGeo;

        if (chartObject.whichGeography) {
            var geoType = chartObject.whichGeography[0];
            var geoValue = chartObject.whichGeography[1];
            var geoJsonData = chartObject.geoJson;
            console.dir(geoJsonData);
            console.log("  geoJsonData.features.length: " + geoJsonData.features.length);

            for (var i = 0; i < geoJsonData.features.length; i++ ) {
                nextFeature = geoJsonData.features[i];
                if (geoType == "ward") {
                    nextGeo = nextFeature.properties.WARD;
                } else if (geoType == "feeder") {
                    nextGeo = nextFeature.properties.GIS_ID;
                }
                console.log("  nextGeo: " + nextGeo);
                if (nextGeo == geoValue) {
                    console.log("  geoValue: " + geoValue);
                    console.log("  nextFeature.geometry.coordinates[0].length: " + nextFeature.geometry.coordinates[0].length);
                    polygon = geoJsonToPolygon(nextFeature.geometry.coordinates[0]);
                    console.log("  polygon: " + polygon);
                    console.dir(polygon);
                }
            }
        }

        // == get map feature geo data if geography filter selected
        for (var i = 0; i < chartObject.whichSchools.length; i++) {
            nextSchool = chartObject.whichSchools[i];
            schoolName = nextSchool[0];
            totalExp = nextSchool[1];
            schoolLong = nextSchool[2];
            schoolLat = nextSchool[3];
            schoolType = nextSchool[4];
            console.log("  schoolName: " + schoolName);

            if (chartObject.whichGeography) {
                var schoolLatLng = new google.maps.LatLng(parseFloat(schoolLat), parseFloat(schoolLong));
                console.log("  schoolLatLng: " + schoolLatLng);
                console.log(google.maps.geometry.poly.containsLocation(schoolLatLng, polygon));
                // google.maps.geometry.poly.containsLocation(schoolLatLng, geometry);
            }
        }
    }

    // ======= ======= ======= geoJsonToPolygon ======= ======= =======
    function geoJsonToPolygon(geoCoordinates) {
        console.log("geoJsonToPolygon");
        console.log("  geoCoordinates.length: " + geoCoordinates.length);

        var opts = {};
        var _ccw = function(path) {
            var isCCW;
            var a = 0;
            for (var i = 0; i < path.length-2; i++) {
                a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
            }
            if (a > 0) {
                isCCW = true;
            } else {
                isCCW = false;
            }
            return isCCW;
        };

        var paths = [];
        var exteriorDirection;
        var interiorDirection;
        for (var i = 0; i < geoCoordinates.length; i++){
            var path = [];
            for (var j = 0; j < geoCoordinates[i].length; j++) {
                // console.log("  geoCoordinates[i][j]: " + geoCoordinates[i][j]);
                // console.log("  geoCoordinates[i][j]: " + geoCoordinates[i][j]);
                // var ll = new google.maps.LatLng(geoCoordinates[i][j][1], geoCoordinates[i][j][0]);
                var ll = new google.maps.LatLng(geoCoordinates[i][j], geoCoordinates[i][j]);
                // console.log("  ll: " + ll);
                path.push(ll);
            }
            if (!i) {
                exteriorDirection = _ccw(path);
                paths.push(path);
            } else if (i == 1) {
                interiorDirection = _ccw(path);
                if (exteriorDirection == interiorDirection) {
                    paths.push(path.reverse());
                } else {
                    paths.push(path);
                }
            } else {
                if (exteriorDirection == interiorDirection) {
                    paths.push(path.reverse());
                } else {
                    paths.push(path);
                }
            }
        }
        opts.paths = paths;
        googleObj = new google.maps.Polygon(opts);
        return googleObj;
        // if (geojsonProperties) {
        //     googleObj.set("geojsonProperties", geojsonProperties);
        // }
    }

    // ======= ======= ======= setYearsFilter ======= ======= =======
    Chart.prototype.setYearsFilter = function(whichYears) {
        console.log("setYearsFilter");
        displayObject.resetMenuItems(whichYears);
        $(whichYears).css("background-color", "yellow");
        $(whichYears).children("p").css("color", "black");
    }

    // ======= ======= ======= setSchoolsFilter ======= ======= =======
    Chart.prototype.setSchoolsFilter = function(whichSchools) {
        console.log("setSchoolsFilter");
        displayObject.resetMenuItems(whichSchools);
        $(whichSchools).css("background-color", "green");
        $(whichSchools).children("p").css("color", "white");
        this.getSchoolData(whichSchools.id);
    }

    // ======= ======= ======= setStudentsFilter ======= ======= =======
    Chart.prototype.setStudentsFilter = function(whichStudents) {
        console.log("setStudentsFilter");
        displayObject.resetMenuItems(whichStudents);
        $(whichStudents).css("background-color", "purple");
        $(whichStudents).children("p").css("color", "white");
    }

    // ======= ======= ======= setBldgFilter ======= ======= =======
    Chart.prototype.setBldgFilter = function(whichBldg) {
        console.log("setBldgFilter");
        displayObject.resetMenuItems(whichBldg);
        $(whichBldg).css("background-color", "red");
        $(whichBldg).children("p").css("color", "white");
    }

    // ======= ======= ======= setGeoFilter ======= ======= =======
    Chart.prototype.setGeoFilter = function(whichGeo) {
        console.log("setGeoFilter");
        displayObject.resetMenuItems(whichGeo);
        $(whichGeo).css("background-color", "blue");
        $(whichGeo).children("p").css("color", "white");
        this.getZoneData($(whichGeo).attr('id'));
    }

    // ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= FILTERS ======= ======= ======= ======= =======

    // ======= ======= ======= initFilterMenus ======= ======= =======
    Display.prototype.initFilterMenus = function() {
        console.log("initFilterMenus");

        var filtersArray = [this.yearsMenu, this.schoolsMenu, this.studentsMenu, this.buildingsMenu, this.geographyMenu];
        var filterContainer = $("#filterNav");
        var menuHtml = "";

        // == clear previous filter category html
        $(filterContainer).empty();

        // == build next filter category html
        for (var i = 0; i < filtersArray.length; i++) {
            nextMenu = filtersArray[i];
            nextCategory = nextMenu[0];
            menuHtml += "<div class='category " + nextCategory + "'><span class='label'>" + nextCategory + "</span>";
            menuHtml += this.makeFilterMenu(nextMenu);
            menuHtml += "</div>";
            $(filterContainer).append(menuHtml);
            menuHtml = "";
            this.activateClearItem(nextMenu);
            this.activateFilterMenu(nextMenu);
        }
        this.activateGetData(nextMenu);
    }

    // ======= ======= ======= makeFilterMenu ======= ======= =======
    Display.prototype.makeFilterMenu = function(whichMenu) {
        // console.log("makeFilterMenu");

        // == category list for making reset buttons
        var whichCategory = whichMenu[0];

        // == build html string for filter lists
        filterHtml = "";
        filterHtml += "<ul class='filterList'>";

        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            nextId = nextItem.id;
            nextText = nextItem.text;
            filterHtml += "<li id='" + nextId + "' class='filter'><p class='filterText'>" + nextText + "</p></li>";
        }
        filterHtml += "<li id='reset" + whichCategory + "' class='reset'><p class='filterText'>clear</p></li>";
        filterHtml +=  "</ul>";

        if (whichCategory == "geography") {
            filterHtml += "<ul class='filterList'>";
            filterHtml += "<li id='getData' class='filter'><p class='filterText'>Get Data</p></li>";
            filterHtml +=  "</ul>";
        }

        return filterHtml;
    }

    // ======= ======= ======= activateClearItem ======= ======= =======
    Display.prototype.activateClearItem = function(whichMenu) {
        // console.log("activateClearItem");

        var menuCategory = whichMenu[0];
        var clearItem = $("#reset" + menuCategory);

        $(clearItem).off("click").on("click", function(){
            console.log("-- clear " + menuCategory + " -- ");
            displayObject.resetMenuItems(clearItem, menuCategory);
        });
    }

    // ======= ======= ======= activateFilterMenu ======= ======= =======
    Display.prototype.activateFilterMenu = function(whichMenu) {
        // console.log("activateFilterMenu");

        // == activate filter events and callbacks
        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            this.activateFilterItem(nextItem);
        }
    }

    // ======= ======= ======= activateGetData ======= ======= =======
    Display.prototype.activateGetData = function(whichMenu) {
        // console.log("activateGetData");
        var self = this;
        var getData = $("#getData");

        $(getData).off("click").on("click", function(){
            console.log("-- getData -- ");
            chartObject.getFilteredData();
        });
    }

    // ======= ======= ======= activateFilterItem ======= ======= =======
    Display.prototype.activateFilterItem = function(whichItem) {
        // console.log("activateFilterItem");

        var self = this;

        // == get menu item parameters
        nextId = whichItem.id;
        nextCategory = whichItem.category;
        nextCallback = whichItem.callback;
        nextItemElement = $("#" + nextId);

        // ======= hover states =======
        $(nextItemElement).off("mouseenter").on("mouseenter", function(event){
            // console.log("-- mouseenter --");
            indexElement = event.currentTarget;
            indexElementId = event.currentTarget.id;
        });
        $(nextItemElement).off("mouseout").on("mouseout", function(event){
            // console.log("-- mouseout --");
            indexElement = event.currentTarget;
        });

        // ======= general =======
        switch(nextCallback) {
            case "setYears":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setYears -- ");
                    clickedItem = event.currentTarget;
                    chartObject.setYearsFilter(clickedItem);
                });
                break;
            case "setSchools":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setSchools -- ");
                    clickedItem = event.currentTarget;
                    chartObject.setSchoolsFilter(clickedItem);
                });
                break;
            case "setStudents":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setStudents -- ");
                    clickedItem = event.currentTarget;
                    chartObject.setStudentsFilter(clickedItem);
                });
                break;
            case "setBuilding":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setBuilding -- ");
                    clickedItem = event.currentTarget;
                    chartObject.setBldgFilter(clickedItem);
                });
                break;
            case "setGeography":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setYears -- ");
                    clickedItem = event.currentTarget;
                    chartObject.setGeoFilter(clickedItem);
                });
                break;
        }
    }

    // ======= ======= ======= resetMenuItems ======= ======= =======
    Display.prototype.resetMenuItems = function(whichItem, menuCategory) {
        console.log("resetMenuItems");
        console.log("  menuCategory: " + menuCategory);
        $(whichItem).siblings("li:not(:last-child)").css("background-color", "#ddd");
        $(whichItem).siblings("li:not(:last-child)").children("p").css("color", "black");

        switch(menuCategory) {
            case "years":
                chartObject.whichYears = null;
                break;
            case "schools":
                chartObject.whichSchools = null;
                break;
            case "students":
                chartObject.whichStudents = null;
                break;
            case "buildings":
                chartObject.whichBuildings = null;
                break;
            case "geography":
                chartObject.whichGeography = null;
                break;
        }
    }

    // ======= ======= ======= getSchoolData ======= ======= =======
    Chart.prototype.getSchoolData = function(whichSchools) {
        console.log("getSchoolData");
        console.log("  whichSchools: " + whichSchools);

        // Agency, School, totalSQFT, Address, Enrolled, SqFtperStudent, SchoolCode, Longitude, Latitude, Ward, AtRiskPct, SQFTgroup, Enrollgroup, SQFTpergroup, FakeExpend, Unknown
        // School, SchoolCode, Address, Ward, Longitude, Latitude, Enrolled, totalSQFT, AtRiskPct, FakeExpend, Level

        url = "SchoolData/DCPS_schools_dev.csv";

        // ======= get selected data =======
        $.ajax({
            url: url,
            method: "GET",
            dataType: "text"
        }).done(function(textData){
            console.log("*** ajax success ***");
            jsonData = CSV2JSON(textData);
            console.dir(jsonData);

            switch(whichSchools) {
                case "Public":
                    checkType = null;
                    break;
                case "Charter":
                    checkType = "charter";
                    break;
                case "Elem":
                    checkType = "ES";
                    break;
                case "Middle":
                    checkType = "MS";
                    break;
                case "High":
                    checkType = "HS";
                    break;
                case "Youth":
                    checkType = "YE";
                    break;
            }

            var expendArray = [];

            for (var i = 0; i < jsonData.length; i++) {
                nextSchool = jsonData[i];
                nextName = nextSchool.School;
                nextTotal = nextSchool.FakeExpend;
                schoolLong = nextSchool.Longitude;
                schoolLat = nextSchool.Latitude;
                schoolType = nextSchool.Level;
                nextData = [nextName, nextTotal, schoolLong, schoolLat, schoolType];
                if (checkType) {
                    if (schoolType == checkType) {
                        expendArray.push(nextData);
                    }
                } else {
                    expendArray.push(nextData);
                }
            }
            chartObject.whichSchools = null;
            chartObject.whichSchools = expendArray;
            console.log("  chartObject.whichSchools.length: " + chartObject.whichSchools.length);

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= getZoneData ======= ======= =======
    Chart.prototype.getZoneData = function(zoneType) {
        console.log("getZoneData");

        var url, nextFeature;
        var self = this;

        switch(zoneType) {
            case "Ward":
                url = "GeoData/Ward__2012.geojson";
                break;
            case "Feeder":
                url = "GeoData/School_Attendance_Zones_Senior_High.geojson";
                break;
        }

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: url
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            console.dir(geoJsonData);

            chartObject.geoJson = geoJsonData;

            // ======= clear previous geojson layer =======
            map.data.forEach(function(feature) {
                map.data.remove(feature);
            });

            // ======= add geojson layer =======
            map.data.addGeoJson(geoJsonData);

            // ======= add index property to each feature =======
            var featureIndex = -1;
            map.data.forEach(function(feature) {
                featureIndex++;
                feature.setProperty('index', featureIndex);
            });

            // ======= colorize each feature based on colorList =======
            var colorIndex = -1;
            map.data.setStyle(function(feature) {
                colorIndex++;
                return {
                  fillColor: fillColors[colorIndex],
                  strokeColor: "purple",
                  strokeWeight: 1
                };
            });

            self.activateZoneData(zoneType);

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= activateZoneData ======= ======= =======
    Chart.prototype.activateZoneData = function(zoneType) {
        console.log("activateZoneData");
        console.log("  zoneType: " + zoneType);

            // ======= mouseover/out event listeners =======
            map.data.addListener('mouseover', function(event) {
                // console.log("--- mouseover ---");
                map.data.overrideStyle(event.feature, {
                    fillColor: "gray",
                    strokeWeight: 4
                });
            });
            map.data.addListener('mouseout', function(event) {
                // console.log("--- mouseout ---");
                featureIndex = event.feature.getProperty('index');
                map.data.overrideStyle(event.feature, {
                    fillColor: fillColors[featureIndex],
                    strokeWeight: 1
                });
            });

            // ======= click event listeners =======
            switch(zoneType) {
                case "Ward":
                    map.data.addListener('click', function(event) {
                        console.log("--- click wards ---");
                        var whichWard = event.feature.getProperty('WARD');
                        var wardName = event.feature.getProperty('NAME');
                        chartObject.whichGeography = ["ward", whichWard];
                        console.log("  wardName: " + wardName);
                    });
                    break;
                case "Feeder":
                    map.data.addListener('click', function(event) {
                        console.log("--- click feeders ---");
                        var gis_id = event.feature.getProperty('GIS_ID');
                        var bldg = event.feature.getProperty('BLDG_NUM');
                        var schoolName = event.feature.getProperty('SCHOOLNAME');
                        chartObject.whichGeography = ["feeder", gis_id];
                        console.log("  gis_id: " + gis_id);
                        console.log("  schoolName: " + schoolName);
                    });
                    break;
            }
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
            disableDefaultUI: true,
            draggable: false,
            scrollwheel: false,
            styles: styleArray,     // styles for map tiles
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoom: 10
        });

    }

    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======

    // ======= ======= ======= CSVToArray ======= ======= =======
    function CSVToArray(strData, strDelimiter) {
        console.log("CSVToArray");
        // Check to see if the delimiter is defined. If not, then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data with default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern matching groups.
        var arrMatches = null;
        // Loop over regular expression matches until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                // Since new row of data, add empty row to data array.
                arrData.push([]);
            }
            // Check kind of value captured (quoted or unquoted).
            if (arrMatches[2]) {
                // Quoted value: unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"), "\"");
            } else {
                // Non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Add value string to the data array.
            // console.log("  strMatchedValue: " + strMatchedValue);
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }

    // ======= ======= ======= CSV2JSON ======= ======= =======
    function CSV2JSON(csv) {
        console.log("CSV2JSON");
        var array = CSVToArray(csv);
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
            objArray[i - 1] = {};
            for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                var key = array[0][k];
                objArray[i - 1][key] = array[i][k]
            }
        }

        var json = JSON.stringify(objArray);
        var json2 = JSON.parse(json)
        return json2;
    }

    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======

    initMap();
    initChartObjects();
    initFilterObjects();
    initDisplayObjects();
    displayObject.initFilterMenus();
}
