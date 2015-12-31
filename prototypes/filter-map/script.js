$(document).ready(function() {
    console.log("initObjects");
    console.log("  this: " + this);

    var self;
    var map, infoWindow;
    var schoolFilters = [];
    var studentFilters = [];
    var geographyFilters = [];

    var filterFunctions = {};

    // ======= ======= ======= Y1998_2013_yea ======= ======= =======
    function Y1998_2013_yea() {
        console.log("Y1998_2013_yea");
    }

    // ======= ======= ======= initMap ======= ======= =======
    function initMap() {
        console.log('initMap');
        console.log("  this: " + this);

        self = this;
        console.log("  self: " + self);

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
            scrollwheel: false,
            styles: styleArray,     // styles for map tiles
            zoom: 10
        });

        // ======= Info Window =======
        infoWindow = new google.maps.InfoWindow({
          content: ""
        });
    }

    // ======= ======= ======= activateDisplayDivs ======= ======= =======
    function activateDisplayDivs() {
        console.log('activateDisplayDivs');

        // == activate display menu div click functions
        var displayDivs = $(".displayDivs");
        for (i = 0; i < $(displayDivs).children().length; i++) {
            nextDiv = $(displayDivs).children()[i];

            $(nextDiv).on('click', function() {
                console.log("clickDisplay");
                console.log("  this.id: " + this.id);
                getZoneData(this.id);
            });
        }
    }

    // ======= ======= ======= activateFilterDivs ======= ======= =======
    function activateFilterDivs() {
        console.log('activateFilterDivs');

        // == activate filter menu div click functions
        var filterDivs = $(".filterDivs");
        for (i = 0; i < $(filterDivs).children().length; i++) {
            nextDiv = $(filterDivs).children()[i];

            $(nextDiv).on('click', function() {
                console.log("clickFilter");
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

        var url, nextFeature;
        var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];

        switch(zoneType) {
            case "wards":
                url = "GeoData/Ward__2012.geojson";
                break;
            case "feeders":
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
                case "wards":
                    map.data.addListener('click', function(event) {
                        console.log("--- click wards ---");
                        var name = event.feature.getProperty('NAME');
                        console.log("  name: " + name);
                    });
                    break;
                case "feeders":
                    map.data.addListener('click', function(event) {
                        console.log("--- click feeders ---");
                        var gis_id = event.feature.getProperty('GIS_ID');
                        var bldg = event.feature.getProperty('BLDG_NUM');
                        var schoolName = event.feature.getProperty('SCHOOLNAME');
                        console.log("  bldg: " + bldg);
                        console.log("  gis_id: " + gis_id);
                        console.log("  schoolName: " + schoolName);
                    });
                    break;
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }


    // ======= ======= ======= initFilterDivs ======= ======= =======
    function initFilterDivs(zoneType) {
        console.log("initFilterDivs");

        var nextCategory, nextStudentFilter, nextSchoolFilter, nextGeoFilter, filterHtml;

        // ======= filter menu contents =======
        var categories = ["years", "schools", "students", "buildings", "geography"];
        var timeFilters = ["Y1998-2013", "Y2014", "Y2015", "Y2016", "Y2016-2021"];
        var schoolFilters = ["Public", "Charter", "Elementary", "Middle School", "High School", "Youth Engagement"];
        var studentFilters = ["All Students", "At Risk", "Spec Ed", "Graduated"];
        var buildingFilters = ["Square Footage", "Capacity", "Population Now", "Population Future"];
        var geographyFilters = ["Ward", "Feeder", "Quadrant"];
        var filters = [timeFilters, schoolFilters, studentFilters, buildingFilters, geographyFilters];

        // ======= filter menu actions =======


        // ======= menus by category =======
        var menuHtml = "";
        var getDataHtml = "<div><input type='button' id='getDataButton' value='get data'></div>";
        for (var i = 0; i < categories.length; i++) {
            nextCategory = categories[i];
            nextFilters = filters[i];
            nextFilterCat = nextCategory.substring(0, 3);
            menuHtml += "<div id='" + nextCategory + "' class='category'><span class='label'>" + nextCategory + "</span>";
            menuHtml += makeFilterMenu(nextFilterCat, nextFilters);
            menuHtml +=  "</div>";
        }

        // ======= makeFilterMenu =======
        function makeFilterMenu(whichFilterCat, whichFilters) {
            console.log("makeFilterMenu");
            var spaceCheck;
            filterHtml = "";
            filterHtml += "<ul class='filterList'>";
            for (var j = 0; j < whichFilters.length; j++) {
                nextFilter = whichFilters[j];
                nextFilterId = replaceChar(nextFilter);
                filterHtml += "<li id='" + nextFilterId + "_" + whichFilterCat + "' class='activeFilter'><a href='#'>" + nextFilter + "</a></li>";
            }
            filterHtml += "</ul>";
            return filterHtml;
        }

        // ======= append menus to DOM =======
        $("#filterNav").empty;
        $("#filterNav").append(menuHtml);
        activateFilterMenu();
        $("#filterNav").append(getDataHtml);

        $("#getDataButton").off("click").on("click", function(){
            console.log("-- -- -- getData -- -- -- ");
        });

        // ======= activateFilterMenu =======
        function activateFilterMenu() {
            console.log("activateFilterMenu");

            for (var i = 0; i < categories.length; i++) {
                nextCategory = categories[i];
                nextFilterList = filters[i];
                nextFilterCat = nextCategory.substring(0, 3);
                for (var j = 0; j < nextFilterList.length; j++) {
                    nextFilter = nextFilterList[j];
                    nextFilter = replaceChar(nextFilter);
                    nextFilterId = nextFilter + "_" + nextFilterCat;
                    activateFilter(nextFilterId);
                    activateCallbacks(nextFilterId, nextFilterCat);
                }
            }
        }

        // ======= activateCallbacks =======
        function activateCallbacks(filterId, nextFilterCat) {
            // console.log("activateCallbacks");
            // console.log("  filterId: " + filterId);
            // console.log("  nextFilterCat: " + nextFilterCat);

            var textInput;
            var parentElementId = "#" + filterId;
            var filterType = getFilterType(filterId);
            console.log("  filterType: " + filterType);

            // ======= getFilterType =======
            function getFilterType(filterId) {
                console.log("getFilterType");
                var spaceCheck = filterId.indexOf("_");
                if (spaceCheck > -1) {
                    var substr1 = filterId.substr(0, spaceCheck);
                    return substr1;
                }
            }

            switch(nextFilterCat) {
                case "stu":
                    $(parentElementId).off("click").on("click", function(){
                        console.log("-- " + filterId + " --");
                        console.log("  $(this).attr('id'): " + $(this).attr('id'));
                        $(this).css("background-color", "red");
                        $(this).children().css("color", "white");
                    });
                    break;
                case "geo":
                    $(parentElementId).off("click").on("click", function(){
                        console.log("-- " + filterId + " --");
                        console.log("  nextFilterCat: " + nextFilterCat);
                        console.log("  filterType: " + filterType);
                        $(this).css("background-color", "blue");
                        $(this).children().css("color", "white");
                    });
                    break;
                case "sch":
                    $(parentElementId).off("click").on("click", function(){
                        console.log("-- " + filterId + " --");
                        console.log("  nextFilterCat: " + nextFilterCat);
                        console.log("  filterType: " + filterType);
                        $(this).css("background-color", "gray");
                        $(this).children().css("color", "white");
                        getSchoolData(filterType);
                    });
                    break;
                case "yea":
                    $(parentElementId).off("click").on("click", function(){
                        console.log("-- " + filterId + " --");
                        console.log("  nextFilterCat: " + nextFilterCat);
                        console.log("  filterType: " + filterType);
                        $(this).css("background-color", "yellow");
                        $(this).children().css("color", "black");
                    });
                    break;
                case "bui":
                    $(parentElementId).off("click").on("click", function(){
                        console.log("-- " + filterId + " --");
                        console.log("  nextFilterCat: " + nextFilterCat);
                        console.log("  filterType: " + filterType);
                        $(this).css("background-color", "purple");
                        $(this).children().css("color", "white");
                    });
                    break;
            }

        }

        // ======= activateFilter =======
        function activateFilter(filterId) {
            // console.log("activateFilter");
            // console.log("  filterId: " + filterId);

            var textInput;
            var parentElementId = "#" + filterId;

            // ======= hover =======
            $(parentElementId).off("mouseenter").on("mouseenter", function(event) {
                // console.log("-- mouseenter --");
                indexElement = event.target;
                indexElementId = event.target.id;
                // console.log("  indexElementId: " + indexElementId);
            });

            $(parentElementId).off("mouseout").on("mouseout", function(event){
                // console.log("-- mouseout --");
                indexElement = event.target;
            });
        }

        // ======= replaceChar =======
        function replaceChar(nextFilter) {
            // console.log("replaceChar");
            spaceCheck = nextFilter.indexOf(" ");
            if (spaceCheck > -1) {
                var substr1 = nextFilter.substr(0, spaceCheck);
                var substr2 = nextFilter.substr(spaceCheck + 1, nextFilter.length);
                var newFilter = substr1 + substr2;
                return newFilter;
            } else {
                return nextFilter;
            }
        }

        // ======= makeTextInput =======
        function makeTextInput(whichInput, whichValue) {
            console.log("makeTextInput");
            var entryString = "";
            entryString += "<div class='filterEntry'>" + whichInput +
                " - <input type='text' name='" + whichInput + "' value=" + whichValue + "></div>";
            return entryString;
        }
    }

    // ======= ======= ======= getSchoolData ======= ======= =======
    function getSchoolData(zoneType) {
        console.log("getSchoolData");
        console.log("  map: " + map);
        console.log("  zoneType: " + zoneType);

        var fillColors = ["green", "red", "orange", "purple", "blue", "yellow", "tomato", "salmon"];
        var url;

        switch(zoneType) {
            case "Public":
                color = fillColors[2];
                url = "GeoData/Public_Schools.geojson";
                break;
            case "charter":
                color = fillColors[7];
                url = "GeoData/Charter_Schools.geojson";
                break;
        }
    }

    // ======= ======= ======= getAllSchoolData ======= ======= =======
    function getAllSchoolData(whichDistrict) {
        console.log("getAllSchoolData");

        // == get school profile data from file
        $.ajax({
            dataType: "text",
            url: "Public_Schools_dev.csv",
        }).done(function(textData){
            console.log("*** ajax success ***");

            // == parse csv text to js object
            var jsonData = CSV2JSON(textData);
            console.dir(jsonData);

            // == get data for selected school
            schoolData = getSchoolData(jsonData, whichDistrict)
            makeDataPanel(schoolData);
            makeDataGraph(schoolData);

            // == errors/fails
            }).fail(function(){
                console.log("*** ajax fail ***");
            }).error(function() {
                console.log("*** ajax error ***");
        });
    }

    initMap();
    initFilterDivs();
    activateDisplayDivs();
    activateFilterDivs();

})
