
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

    var barChartObject;
    var displayObject;
    var filterMenu, map;
    var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];

    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        filterMenu.Ward = { id:"Ward", category:"geography", text:"Ward", callback:"getFilteredData" };
        filterMenu.Feeder = { id:"Feeder", category:"geography", text:"Feeder", callback:"getFilteredData" };
        filterMenu.Quadrant = { id:"Quadrant", category:"geography", text:"Quadrant", callback:"getFilteredData" };

        filterMenu.Public = { id:"Public", category:"schools", text:"Public Schools", callback:"getFilteredData" };
        filterMenu.Charter = { id:"Charter", category:"schools", text:"Charter Schools", callback:"getFilteredData" };

        filterMenu.Elem = { id:"Elem", category:"schools", text:"Elementary Schools", callback:"getFilteredData" };
        filterMenu.Middle = { id:"Middle", category:"schools", text:"Middle Schools", callback:"getFilteredData" };
        filterMenu.High = { id:"High", category:"schools", text:"High Schools", callback:"getFilteredData" };
        filterMenu.Campus = { id:"Campus", category:"schools", text:"Education Campus", callback:"getFilteredData" };

        filterMenu.Yprev = { id:"Yprev", category:"years", text:"1998-2016", callback:"setYears" };
        filterMenu.Y2016 = { id:"Y2016", category:"years", text:"2016", callback:"setYears" };
        filterMenu.Ynext = { id:"Ynext", category:"years", text:"2016-2021", callback:"setYears" };

        filterMenu.All = { id:"All", category:"students", text:"All Students", callback:"setStudents" };
        filterMenu.AtRisk = { id:"AtRisk", category:"students", text:"At-Risk Students", callback:"setStudents" };
        filterMenu.SpecEd = { id:"SpecEd", category:"students", text:"Spec Ed Students", callback:"setStudents" };
        filterMenu.EngLang = { id:"EngLang", category:"students", text:"ESL Students", callback:"setStudents" };

        filterMenu.Sqft = { id:"Sqft", category:"buildings", text:"Square Footage", callback:"setBuilding" };
        filterMenu.Capacity = { id:"Capacity", category:"buildings", text:"Capacity", callback:"setBuilding" };
        filterMenu.PopNow = { id:"PopNow", category:"buildings", text:"Current Population", callback:"setBuilding" };
        filterMenu.PopFuture = { id:"PopFuture", category:"buildings", text:"Future Population", callback:"setBuilding" };
    }

    // ======= ======= ======= initDisplayObjects ======= ======= =======
    function initDisplayObjects() {
        console.log("initDisplayObjects");

        displayObject = new Display("display1");
    }

    // ======= ======= ======= initChartObjects ======= ======= =======
    function initChartObjects() {
        console.log("initChartObjects");

        barChartObject = new Chart("barChart");
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
        this.geographyMenu = ["geography", filterMenu.Ward, filterMenu.Feeder, filterMenu.Quadrant];
        this.levelsMenu = ["levels", filterMenu.Elem, filterMenu.Middle, filterMenu.High, filterMenu.Campus];
        this.agencyMenu = ["agency", filterMenu.Public, filterMenu.Charter];
        this.dataFilterArray = [null, null, null];
        this.dataTitleArray = [null, null, null];
    }
    function Chart(whichChart) {
        console.log("Chart");
        this.name = whichChart;
        this.geoJson = null;
        this.mapBounds = null;
        this.whichLevel = null;
        this.whichAgency = null;
        this.whichGeography = null;
        this.selectedSchoolData = null;
        this.mapStateArray = null;
        this.schoolMarkersArray = null;
    }



    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======



    // ======= ======= ======= initFilterMenus ======= ======= =======
    Display.prototype.initFilterMenus = function() {
        console.log("initFilterMenus");

        var filtersArray = [this.geographyMenu, this.levelsMenu, this.agencyMenu];
        var filterContainer = $("#main-nav");
        var menuHtml = "<ul>";

        // == build next filter category html
        for (var i = 0; i < filtersArray.length; i++) {
            nextMenu = filtersArray[i];
            nextCategory = nextMenu[0];
            menuHtml += "<li id='" + nextCategory + "'>";
            menuHtml += "<a href='#'>" + nextCategory + "<span class='caret'></span></a>";
            menuHtml += "<ul>";

            menuHtml += this.makeFilterMenu(nextMenu);

            menuHtml += "</ul>";
            menuHtml += "</li>";
        }

        // == append to DOM
        $(filterContainer).append(menuHtml);

        // == activate individual filter selectors after appended to DOM
        for (var i = 0; i < filtersArray.length; i++) {
            nextMenu = filtersArray[i];
            this.activateFilterMenu(nextMenu);
        }
    }

    // ======= ======= ======= makeFilterMenu ======= ======= =======
    Display.prototype.makeFilterMenu = function(whichMenu) {
        console.log("makeFilterMenu");

        // == category list for making reset buttons
        var whichCategory = whichMenu[0];
        var whichClass = whichCategory;

        // == build html string for filter lists
        filterHtml = "";

        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            nextId = nextItem.id;
            nextText = nextItem.text;
            filterHtml += "<li id='" + nextId + "' class='filter " + whichClass + "'><a class='filterText' href='#'>" + nextText + "</a></li>";
        }
        return filterHtml;
    }

    // ======= ======= ======= activateFilterMenu ======= ======= =======
    Display.prototype.activateFilterMenu = function(whichMenu) {
        console.log("activateFilterMenu");

        // == activate filter events and callbacks
        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            displayObject.activateFilter(nextItem);
        }
    }

    // ======= ======= ======= activateFilter ======= ======= =======
    Display.prototype.activateFilter = function(nextItem) {
        console.log("activateFilter");

        var nextId = nextItem.id;
        var nextElement = $("#" + nextId);

        // == [Ward or Feeder, Ward or Feeder number]
        var geoFilterArray = [null, null];

        // ======= ======= ======= selectFilter ======= ======= =======
        $(nextElement).off("click").on("click", function(event){
            console.log("-- selectFilter -- ");
            var classList = $(this).attr('class').split(/\s+/);
            var whichCategory = classList[1];
            event.stopImmediatePropagation();

            removeMarkers();

            // == set selected filter value on display object
            switch(whichCategory) {
                case "geography":
                    geoFilterArray[0] = this.id;
                    displayObject.dataFilterArray[0] = geoFilterArray;
                    google.maps.event.clearListeners(map);
                    break;
                case "levels":
                    displayObject.dataFilterArray[1] = this.id;
                    break;
                case "agency":
                    displayObject.dataFilterArray[2] = this.id;
                    break;
            }

            // == evoke callback stored on object
            console.log("  displayObject.dataFilterArray: ", displayObject.dataFilterArray);
            displayObject[filterMenu[this.id].callback]();
        });
    }

    // ======= ======= ======= getFilteredData ======= ======= =======
    Display.prototype.getFilteredData = function() {
        console.log("getFilteredData");

        // == geoFilter: [ward/feeder, whichWard/whichFeeder]
        var geoFilterArray = displayObject.dataFilterArray[0];
        var levelsFilter = displayObject.dataFilterArray[1];
        var agencyFilter = displayObject.dataFilterArray[2];

        if (geoFilterArray) {
            if (geoFilterArray[0]) {
                console.log("  geoFilterArray[0]: ", geoFilterArray[0]);
                displayObject.updateMenuItem("geography", geoFilterArray);
                barChartObject.getZoneData(geoFilterArray);
            }
        }
        if ((levelsFilter) || (agencyFilter)) {
            if (agencyFilter) {
                console.log("  agencyFilter: ", agencyFilter);
                displayObject.updateMenuItem("agency", agencyFilter);
            }
            if (levelsFilter) {
                console.log("  levelsFilter: ", levelsFilter);
                displayObject.updateMenuItem("levels", levelsFilter);
            }
            barChartObject.getSchoolData();
        }
    }

    // ======= ======= ======= updateMenuItem ======= ======= =======
    Display.prototype.updateMenuItem = function(whichCategory, whichFilter) {
        console.log("updateMenuItem");
        console.log("  whichCategory: ", whichCategory);
        console.log("  whichFilter: ", whichFilter);

        // == get Ward or Feeder selection
        if (whichCategory == "geography") {
            whichFilter = whichFilter[0];
        }
        htmlString = "<a id='" + whichFilter + "' href='#'>" + whichFilter + "</a>";
        // htmlString = "<a id='" + whichFilter + "' href='#' class='activeFilter'>" + whichFilter + "</a>";
        // htmlString += "<button class='clear' type='button'>Clear</button>";
        selectedFilterElement = $("#" + whichCategory);
        selectedFilterElement.addClass("activeFilter");
        selectedFilterElement.addClass(whichCategory + "-set");
        selectedFilterElement.empty();
        selectedFilterElement.html(htmlString);
        displayObject.activateFilterRelease(selectedFilterElement);
    }

    // ======= ======= ======= activateFilterRelease ======= ======= =======
    Display.prototype.activateFilterRelease = function(selectedFilterElement) {
        console.log("activateFilterRelease");

        var self = this;
        var menuHtml;

        // ======= ======= ======= releaseFilter ======= ======= =======
        $(selectedFilterElement).off("click").on("click", function(event){
            console.log("-- releaseFilter -- ");
            console.log("  self.dataFilterArray: ", self.dataFilterArray);

            switch(this.id) {
                case "geography":
                    self.dataFilterArray[0] = [null, null];
                    nextMenu = self.geographyMenu;
                    prevClass = "geography-set";
                    barChartObject.resetMap();
                    break;
                case "levels":
                    self.dataFilterArray[1] = null;
                    nextMenu = self.levelsMenu;
                    prevClass = "levels-set";
                    break;
                case "agency":
                    self.dataFilterArray[2] = null;
                    nextMenu = self.agencyMenu;
                    prevClass = "agency-set";
                    break;
            }

            removeMarkers();

            // == restore filter menu list
            selectedFilterElement.removeClass("activeFilter");
            selectedFilterElement.removeClass(prevClass);
            selectedFilterElement.empty();
            menuHtml = "<a href='#'>" + nextMenu[0] + "<span class='caret'></span></a>";
            menuHtml += "<ul>";
            menuHtml += displayObject.makeFilterMenu(nextMenu);
            menuHtml += "</ul>";
            menuHtml += "</li>";

            // == append to DOM
            $(selectedFilterElement).append(menuHtml);
            self.activateFilterMenu(nextMenu);
        });
    }



    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======



    // ======= ======= ======= getSchoolData ======= ======= =======
    Chart.prototype.getSchoolData = function() {
        console.log("getSchoolData");

        // SchoolCode, School, Address, Latitude, Longitude, Ward, Feeder
        // Level, Agency, maxOccupancy, totalSQFT, Total.Enrolled, Limited.English.Proficient, At_Risk, SPED, ESLPer, AtRiskPer, SPEDPer, SqFtPerEnroll
        // Level.1, Level.2, Level.3, Level.4
        // TotalExp9815, TotalAllot1621, LifetimeBudget, LTBudgetPerEnroll, LTBudgetPerSqFt

        var geoFilterArray = displayObject.dataFilterArray[0];
        var levelsFilter = displayObject.dataFilterArray[1];
        var agencyFilter = displayObject.dataFilterArray[2];
        var self = this;
        // console.log("  geoFilter: ", geoFilter);
        // console.log("  levelsFilter: ", levelsFilter);
        // console.log("  agencyFilter: ", agencyFilter);

        // url = "Data_Schools/Public_Charter_data.csv";
        url = "Data_Schools/DCSchoolsRough_dev.csv";

        // ======= get selected data =======
        $.ajax({
            url: url,
            method: "GET",
            dataType: "text"
        }).done(function(textData){
            console.log("*** ajax success ***");
            jsonData = CSV2JSON(textData);
            console.dir(jsonData);

            // ======= geography =======
            if (geoFilterArray) {
                if (geoFilterArray[0]) {
                    var checkGeoType = geoFilterArray[0];
                    var checkGeo = geoFilterArray[1];
                } else {
                    var checkGeoType = null;
                    var checkGeo = null;
                    // $("#message").children("p").text("No geography filter selected");
                }
            }

            // ======= levels =======
            if (levelsFilter) {
                switch(levelsFilter) {
                    case "Elem":
                        checkLevel = "Elementary";
                        break;
                    case "Middle":
                        checkLevel = "Middle";
                        break;
                    case "High":
                        checkLevel = "High";
                        break;
                    case "Campus":
                        checkLevel = "Mixed";
                        break;
                    default:
                        checkLevel = null;
                }
            } else {
                checkLevel = null;
            }

            // ======= agency =======
            if (agencyFilter) {
                switch(agencyFilter) {
                    case "Public":
                        checkType = "DCPS";
                        break;
                    case "Charter":
                        checkType = "PCS";
                        break;
                    default:
                        checkType = null;
                }
            } else {
                checkType = null;
            }
            console.log("  checkGeo: ", checkGeo);
            console.log("  checkGeoType: ", checkGeoType);
            console.log("  checkType: ", checkType);
            console.log("  checkLevel: ", checkLevel);
            console.log("  -------  ");

            // var selectedGeoArray = [];
            var selectedTypeArray = [];
            var selectedLevelArray = [];
            var selectedDataArray = [];
            var checkDataArray = [];

            // == get school codes for selected level and type
            var geoCount = 0;
            var levelCount = 0;
            for (var i = 0; i < jsonData.length; i++) {
                // SchoolCode, School, Address, Latitude, Longitude, Ward, Feeder
                nextSchool = jsonData[i];
                schoolName = nextSchool.School;
                schoolCode = nextSchool.SchoolCode;
                schoolWard = nextSchool.Ward;
                schoolFeeder = nextSchool.Feeder;
                schoolType = nextSchool.Agency;
                schoolLevel = nextSchool.Level;
                schoolLat = nextSchool.Latitude;
                schoolLng = nextSchool.Longitude;

                // == check if public or charter type selected
                if (checkType) {
                    if (schoolType == checkType) {
                        console.log("  schoolType: ", schoolType);
                        selectedTypeArray.push(schoolCode);
                    }
                } else {
                    selectedTypeArray.push(schoolCode);
                }

                // == check ES, MS, HS, YE school type
                if (checkLevel) {
                    if (schoolLevel == checkLevel) {
                        levelCount++;
                        // console.log("  ***  ");
                        // console.log("  schoolName: ", levelCount, "/", schoolName);

                        // == check if ward selected
                        if (checkGeoType) {
                            if (checkGeoType == "Ward") {
                                if (checkGeo) {
                                    if (schoolWard == checkGeo) {
                                        geoCount++;
                                        // console.log("  schoolWard: ", geoCount, "/", schoolWard);
                                        selectedLevelArray.push(schoolCode);
                                    }
                                } else {
                                    selectedLevelArray.push(schoolCode);
                                }
                            } else if (checkGeoType == "Feeder") {
                                if (checkGeo) {
                                    if (schoolFeeder == checkGeo) {
                                        geoCount++;
                                        // console.log("  schoolFeeder: ", geoCount, "/", schoolFeeder);
                                        selectedLevelArray.push(schoolCode);
                                    }
                                } else {
                                    selectedLevelArray.push(schoolCode);
                                }
                            } else if (checkGeoType == "Quadrant") {
                                if (checkGeo) {
                                    if (schoolQuadrant == checkGeo) {
                                        selectedLevelArray.push(schoolCode);
                                    }
                                } else {
                                    selectedLevelArray.push(schoolCode);
                                }
                            }
                        } else {
                            selectedLevelArray.push(schoolCode);
                        }
                    }
                } else {
                    selectedLevelArray.push(schoolCode);
                }
            }

            var selectedSchoolCodesArray = getArrayIntersect(selectedTypeArray, selectedLevelArray);
            console.log("  selectedTypeArray.length: ", selectedTypeArray.length);
            console.log("  selectedLevelArray.length: ", selectedLevelArray.length);
            console.log("  selectedSchoolCodesArray: ", selectedSchoolCodesArray);

            // == iterate through all json school data
            for (var i = 0; i < jsonData.length; i++) {
                nextSchool = jsonData[i];
                checkSchoolCode = nextSchool.SchoolCode;

                // == check each school for match to selected schools via school code
                for (var j = 0; j < selectedSchoolCodesArray.length; j++) {
                    nextSchoolCode = selectedSchoolCodesArray[j];
                    if (nextSchoolCode == checkSchoolCode) {
                        // console.log("  nextSchool.School: ", nextSchool.School);
                        nextData = getDataDetails(nextSchool);
                        // console.log("  nextData.schoolName: ", nextData.schoolName);
                        selectedDataArray.push(nextData);
                        checkDataArray.push(nextSchoolCode);
                    }
                }
            }

            console.log("  selectedSchoolCodesArray.length: ", selectedSchoolCodesArray.length);
            console.log("  selectedDataArray.length: ", selectedDataArray.length);
            console.log("  checkDataArray.length: ", checkDataArray.length);
            // console.log("  checkDataArray: ", checkDataArray);

            // == store school data on chart object
            self.selectedSchoolData = selectedDataArray;
            self.makeSchoolsMap(selectedDataArray);

            // ======= ======= ======= getDataDetails ======= ======= =======
            function getDataDetails(nextSchool) {
                console.log("getDataDetails");

                // school identity -- SchoolCode, School, Address, Ward, Feeder, Latitude, Longitude, Level, Agency,
                // building -- maxOccupancy, totalSQFT
                // money -- TotalExp9815, TotalAllot1621, LifetimeBudget
                // students -- Total.Enrolled, Limited.English.Proficient, Level.1, Level.2, Level.3, Level.4, At_Risk, SPED
                // calculated -- AtRiskPer, SPEDPer, SqFtPerEnroll, LTBudgetPerEnroll, LTBudgetPerSqFt, ESLPer

                var schoolName = nextSchool.School;
                var schoolCode = nextSchool.SchoolCode;
                var schoolType = nextSchool.Agency;
                var schoolLevel = nextSchool.Level;
                var schoolWard = nextSchool.Ward;
                var schoolFeeder = nextSchool.Feeder;
                var schoolLat = nextSchool.Latitude;
                var schoolLng = nextSchool.Longitude;
                var schoolSqft = nextSchool.totalSQFT;
                var schoolEnroll = nextSchool.Total_Enrolled;

                var schoolData = { "schoolName": schoolName, "schoolCode": schoolCode, "schoolType": schoolType, "schoolLevel": schoolLevel, "schoolWard": schoolWard, "schoolFeeder": schoolFeeder, "schoolLng": schoolLng, "schoolLat": schoolLat, "schoolSqft": schoolSqft, "schoolEnroll": schoolEnroll };
                return schoolData;
            }

            // ======= ======= ======= getArrayIntersect ======= ======= =======
            function getArrayIntersect(arrayA, arrayB) {
                console.log("getArrayIntersect");

                var itemFound;
                var counter = 0;
                var itemArray = [];

                var newArray = $.grep(arrayA, function(item, index) {
                    itemFound = $.inArray(item, arrayB);
                    if (itemFound > -1) {
                        counter++;
                        // console.log("  item: ", counter, "/", item);
                        itemArray.push(item);
                    }
                });
                return itemArray;
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }


    // ======= ======= ======= makeSchoolsMap ======= ======= =======
    Chart.prototype.makeSchoolsMap = function(selectedDataArray) {
        console.log("makeSchoolsMap");

        var schoolMarkersArray = [];

        for (var i = 0; i < selectedDataArray.length; i++) {
            nextSchoolData = selectedDataArray[i];
            nextSchool = nextSchoolData.schoolName;
            nextSchoolCode = nextSchoolData.schoolCode;
            // console.log("  nextSchoolCode: " + nextSchoolCode);
            nextLat = nextSchoolData.schoolLat;
            nextLng = nextSchoolData.schoolLng;
            var schoolLoc = new google.maps.LatLng(nextLat, nextLng);

            // var school = new google.maps.Circle({
            //     // position: schoolLoc,
            //     map: map,
            //     title: nextSchool,
            //     center: schoolLoc,
            //     radius: 200,
            //     strokeColor: "#0000FF",
            //     strokeOpacity: 0.8,
            //     strokeWeight: 1,
            //     fillColor: "#ffffff",
            //     fillOpacity: 1
            // });

            var marker = new google.maps.Marker({
                position: schoolLoc,
                map: map,
                title: nextSchool
            });

            schoolMarkersArray.push(marker);
        }
        this.schoolMarkersArray = schoolMarkersArray;
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

    // ======= ======= ======= getZoneData ======= ======= =======
    Chart.prototype.getZoneData = function(zoneArray) {
        console.log("getZoneData");
        // console.log("  zoneArray: " + zoneArray);

        var self = this;
        if (!zoneArray) {
            var zoneType = "Quadrant";
        } else {
            var zoneType = zoneArray[0];
        }
        var url, nextFeature;

        switch(zoneType) {
            case "Ward":
                url = "Data_Geo/Ward__2012.geojson";
                break;
            case "Feeder":
                url = "Data_Geo/School_Attendance_Zones_Senior_High.geojson";
                break;
            case "Quadrant":
                url = "Data_Geo/DC_Quadrants.geojson";
                break;
        }

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: url
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            console.dir(geoJsonData);

            barChartObject.geoJson = geoJsonData;

            // ======= clear previous geojson layer =======
            map.data.forEach(function(feature) {
                map.data.remove(feature);
            });

            // ======= add geojson layer =======
            map.data.addGeoJson(geoJsonData);

            // ======= set large map bounds =======
            // var bounds_M = new google.maps.LatLngBounds();
            // bounds_M = map.getBounds();
            // console.log("  bounds_M: " + bounds_M);
            // var NE_M = bounds_M.getNorthEast();
            // var SW_M = bounds_M.getSouthWest();
            // bounds_M.extend(NE_M);
            // bounds_M.extend(SW_M);
            // map.fitBounds(bounds_M);
            // self.mapBounds = bounds_M;

            // var centerLat_M = bounds_M.getCenter().lat();
            // var centerLng_M = bounds_M.getCenter().lng();
            // var NElat_M = bounds_M.getNorthEast().lat();
            // var NElng_M = bounds_M.getNorthEast().lng();
            // var SWlat_M = bounds_M.getSouthWest().lat();
            // var SWlng_M = bounds_M.getSouthWest().lng();
            // var Xratio_M = (centerLat_M - SWlat_M) / (NElat_M - SWlat_M)
            // var Yratio_M = (centerLng_M - SWlng_M) / (NElng_M - SWlng_M)

            // ======= add index, ward, feeder properties to each feature =======
            var featureIndex = -1;
            map.data.forEach(function(feature) {
                featureIndex++;
                var ward = feature.getProperty('WARD');
                var feeder = feature.getProperty('SCHOOLNAME');
                var type = feature.getGeometry().getType()
                var bounds;

                // google.maps.event.clearListeners(feature, 'mouseover');
                // google.maps.event.clearListeners(feature, 'mouseout');


                // == iterate over the paths
                feature.getGeometry().getArray().forEach(function(path) {
                        bounds = new google.maps.LatLngBounds();
                        path.getArray().forEach(function(latLng) {
                            bounds.extend(latLng);
                        });
                    });

                // == get center of feature
                centerLat = bounds.getCenter().lat();
                centerLng = bounds.getCenter().lng();
                centerLatLng = new google.maps.LatLng({lat: centerLat, lng: centerLng});

                // == set feature properties
                feature.setProperty('bounds', bounds);
                feature.setProperty('index', featureIndex);
                feature.setProperty('center', centerLatLng);

                // centerLat = bounds.getCenter().lat();
                // centerLng = bounds.getCenter().lng();
                // NElat = bounds.getNorthEast().lat();
                // NElng = bounds.getNorthEast().lng();
                // SWlat = bounds.getSouthWest().lat();
                // SWlng = bounds.getSouthWest().lng();
                //
                // var Xratio = (centerLat - SWlat_M) / (NElat_M - SWlat_M)
                // var Yratio = (centerLng - SWlng_M) / (NElng_M - SWlng_M)
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

            $("#message").children("p").text("Click map to select " + zoneType);

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

        var featureIndex, feeder, ward;
        var infowindow = null;

        google.maps.event.clearListeners(map, 'mouseover');
        google.maps.event.clearListeners(map, 'mouseout');

        // ======= mouseover event listener =======
        map.data.addListener('mouseover', function(event) {
            // console.log("--- mouseover ---");
            showHoverEffects(event, zoneType, this);
        });

        // ======= click event listeners =======
        switch(zoneType) {
            case "Ward":

                // == zoom to the clicked feature
                map.data.addListener('click', function(event) {
                    console.log("--- select ward ---");
                    var wardName = event.feature.getProperty('NAME');
                    var wardNumber = event.feature.getProperty('WARD');
                    displayObject.dataFilterArray[0][1] = wardNumber;
                    barChartObject.whichGeography = ["Ward", wardNumber];
                    var selectedWard = $("#Ward");
                    $(selectedWard).text("Ward " + wardNumber);

                    // == set selected ward on displayObject
                    var geoFilterArray = displayObject.dataFilterArray[0];

                    // == bounds: rectangle surrounding geo area
                    removeMarkers();
                    zoomToZone(event);
                });
                break;

            case "Feeder":

                map.data.addListener('click', function(event) {
                    console.log("--- select feeder ---");
                    var bldg = event.feature.getProperty('BLDG_NUM');
                    var gis_id = event.feature.getProperty('GIS_ID');
                    var whichFeeder = event.feature.getProperty('SCHOOLNAME');
                    displayObject.dataFilterArray[0][1] = whichFeeder;
                    barChartObject.whichGeography = ["Feeder", gis_id];
                    // $("#message").children("p").text(whichFeeder + " feeder selected");

                    // == bounds: rectangle surrounding geo area
                    removeMarkers();
                    zoomToZone(event);
                });
                break;
        }

        // ======= mouseout event listeners =======
        map.data.addListener('mouseout', function(event) {
            // console.log("--- mouseout ---");
            featureIndex = event.feature.getProperty('index');
            // InfoWindow = event.feature.getProperty('InfoWindow');
            map.data.overrideStyle(event.feature, {
                fillColor: fillColors[featureIndex],
                strokeWeight: 1
            });
            // InfoWindow.close();
        });

        // ======= ======= ======= showHoverEffects ======= ======= =======
        function showHoverEffects(event, zoneType, zoneElement) {
            console.log("showHoverEffects");
            console.log("  zoneType: ", zoneType);

            if (zoneType == "Ward") {
                infoText = event.feature.getProperty('NAME');
            } else if (zoneType == "Feeder") {
                infoText = event.feature.getProperty('SCHOOLNAME');
            } else if (zoneType == "Quadrant") {
                infoText = ('Quadrant');
            }
            center = event.feature.getProperty('center');
            map.data.overrideStyle(event.feature, {
                fillColor: "gray",
                strokeWeight: 4
            });

            // infoBubble = new InfoBubble({
            //       map: map,
            //       content: "<div class='mylabel'>" + infoText + "</div>",
            //       position: center,
            //       shadowStyle: 1,
            //       padding: 0,
            //       backgroundColor: 'rgb(57,57,57)',
            //       borderRadius: 5,
            //       arrowSize: 10,
            //       borderWidth: 1,
            //       borderColor: '#2c2c2c',
            //       hideCloseButton: true,
            //       arrowPosition: 30,
            //       backgroundClassName: 'transparent',
            //       arrowStyle: 2
            // });
            // event.feature.setProperty('infoBubble', infoBubble);
            // infoBubble.open(map, zoneElement);

            // var InfoWindow = new google.maps.InfoWindow({
            //     content: infoText,
            //     map: map,
            //     position: center
            // });
            //
            // event.feature.setProperty('InfoWindow', InfoWindow);
        }

        // ======= ======= ======= zoomToZone ======= ======= =======
        function zoomToZone(event) {
            console.log("zoomToZone");
            var bounds = new google.maps.LatLngBounds();
            var center = bounds.getCenter();
            processPoints(event.feature.getGeometry(), bounds.extend, bounds);
            map.fitBounds(bounds);
            console.log("  center: " + center);
        }

        // ======= ======= ======= processPoints ======= ======= =======
        function processPoints(geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                // console.log("  ** google.maps.LatLng");
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                // console.log("  ** bounds.extend");
                callback.call(thisArg, geometry.get());
            } else {
                // console.log("  ** geometry.getArray");
                geometry.getArray().forEach(function(g) {
                    processPoints(g, callback, thisArg);
                });
            }
        }
    }

    // ======= ======= ======= getYearsData ======= ======= =======
    Chart.prototype.getYearsData = function(whichYears) {
        console.log("getYearsData");
        console.log("  whichYears: " + whichYears);

        // url = "Data_Schools/DCPS_schools_dev.csv";
        url = "Data_Schools/Public_Charter_data.csv";

        // ======= get selected data =======
        $.ajax({
            url: url,
            method: "GET",
            dataType: "text"
        }).done(function(textData){
            console.log("*** ajax success ***");
            jsonData = CSV2JSON(textData);
            console.dir(jsonData);

            // switch(whichYears) {
            //
            // }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }



    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======



    // ======= ======= ======= initMap ======= ======= =======
    function initMap() {
        console.log('initMap');

        // road.arterial, poi.business

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
        console.log("  href: ", href);
        console.log("  pathname: ", pathname);

        if ((pathname == "/") || (pathname == "/index.html")) {

            // var mapBounds = new GLatLngBounds();
            // var NE_M = new google.maps.LatLng(38.79640926765663, -77.14762878417969);
            // var SW_M = new google.maps.LatLng(38.98346758223197, -76.85237121582031);

            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 38.89, lng: -77.00},
                disableDefaultUI: true,
                draggable: false,
                scrollwheel: false,
                styles: styleArray,     // styles for map tiles
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                zoom: 12
            });

            // mapBounds.extend(NE_M);
            // mapBounds.extend(SW_M);
            // map.setCenter(mapBounds.getCenter());
            // map.getBoundsZoomLevel(mapBounds);

            google.maps.event.addListener(map, 'bounds_changed', function() {
                if (!barChartObject.mapBounds) {
                    barChartObject.mapBounds = map.getBounds();
                }
            });

        } else {

            map = new google.maps.Map(document.getElementById('map2'), {
                center: {lat: 38.89, lng: -77.00},
                disableDefaultUI: true,
                draggable: false,
                scrollwheel: false,
                styles: styleArray,     // styles for map tiles
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                zoom: 10
            });
        }
    }

    // ======= ======= ======= saveMapState ======= ======= =======
    function saveMapState(map) {
        console.log('saveMapState');
        var mapZoom = map.getZoom();
        var mapCentre = map.getCenter();
        var mapLat = mapCentre.lat();
        var mapLng = mapCentre.lng();
        var mapStateArray = [mapZoom, mapCentre, mapLat, mapLng];
        barChartObject.mapStateArray = mapStateArray;
    }

    // ======= ======= ======= removeMarkers ======= ======= =======
    function removeMarkers() {
        console.log("removeMarkers");
        var schoolMarkersArray = barChartObject.schoolMarkersArray;
        if (schoolMarkersArray) {
            for(i = 0; i < schoolMarkersArray.length; i++){
                schoolMarkersArray[i].setMap(null);
            }
        }
    }





    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======



    initMap();
    initMenuObjects();
    initChartObjects();
    initDisplayObjects();
    displayObject.initFilterMenus();
    saveMapState(map);
    barChartObject.getZoneData();



}
