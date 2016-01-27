
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

    var mapDataObject;
    var displayObject;
    var filterMenu, map;
    var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];

    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // ======= DCPS_Master_114_dev =======
        // school -- SCHOOLCODE, School, Address, WARD, FeederMS, FeederHS, LAT, LON
        // building -- Level, Agency, totalSQFT, maxOccupancy, SqFtPerEnroll, Enroll_Cap
        // students -- Total_Enrolled, Limited_English, At_Risk, SpecEd_fake, ESLPer, AtRiskPer, SPEDPer
        // money -- MajorExp9815, TotalAllotandPlan1621, LifetimeBudget, SpentPerEnroll, SpentPerSqFt
        // projects -- ProjectPhase, YrComplete, ProjectType

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        // == Ward, FeederMS, FeederHS, Quadrant
        filterMenu.Ward = { id:"Ward", category:"geography", text:"Ward", column:"WARD", value:null };
        filterMenu.FeederHS = { id:"FeederHS", category:"geography", text:"High School Feeders", column:"FeederHS", value:null };
        filterMenu.FeederMS = { id:"FeederMS", category:"geography", text:"Middle School Feeders", column:"FeederMS", value:null };
        filterMenu.Elementary = { id:"Elementary", category:"geography", text:"Elementary Zones", column:null, value:null };
        filterMenu.Quadrant = { id:"Quadrant", category:"geography", text:"Quadrant", column:null, value:null };

        // == Public, Charter
        filterMenu.Public = { id:"Public", category:"schools", text:"Public Schools", column:"Agency", value:"DCPS" };
        filterMenu.Charter = { id:"Charter", category:"schools", text:"Charter Schools", column:"Agency", value:"PCS" };

        // == PK_K, Elem, Middle, High, ES_MS, MS_HS, Alt, SPED
        filterMenu.PK3K = { id:"PK3K", category:"schools", text:"PK-K Schools", column:"Level", value:"PK3-K" };
        filterMenu.Elem = { id:"Elem", category:"schools", text:"Elementary Schools", column:"Level", value:"ES" };
        filterMenu.Middle = { id:"Middle", category:"schools", text:"Middle Schools", column:"Level", value:"MS" };
        filterMenu.High = { id:"High", category:"schools", text:"High Schools", column:"Level", value:"HS" };
        filterMenu.ES_MS = { id:"ES_MS", category:"schools", text:"Elem/Middle Schools", column:"Level", value:"ES/MS" };
        filterMenu.MS_HS = { id:"MS_HS", category:"schools", text:"Middle/High Schools", column:"Level", value:"MS/HS" };
        filterMenu.Alt = { id:"Alt", category:"schools", text:"Alternative Schools", column:"Level", value:"ALT" };
        filterMenu.SpecEd = { id:"SpecEd", category:"schools", text:"Spec Ed Schools", column:"Level", value:"SPED" };

        // == spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll
        filterMenu.spendPast = { id:"spendPast", category:"expenditures", text:"Past Spending", column:"MajorExp9815", value:null };
        filterMenu.spendLifetime = { id:"spendLifetime", category:"expenditures", text:"Total Spending", column:"LifetimeBudget", value:null };
        filterMenu.spendPlanned = { id:"spendPlanned", category:"expenditures", text:"Planned Spending", column:"TotalAllotandPlan1621", value:null };
        filterMenu.spendSqFt = { id:"spendSqFt", category:"expenditures", text:"$ per Sq Ft", column:"SpentPerSqFt", value:null };
        filterMenu.spendEnroll = { id:"spendEnroll", category:"expenditures", text:"$ per Student", column:"SpentPerEnroll", value:null };

        // == Enrollment, AtRisk, SpecEd, EngLang
        filterMenu.Enrollment = { id:"Enrollment", category:"students", text:"percent Enrolled", column:"Total_Enrolled", value:null };
        filterMenu.AtRisk = { id:"AtRisk", category:"students", text:"percent At-Risk", column:"At_Risk", value:null };
        filterMenu.SpecEd = { id:"SpecEd", category:"students", text:"percent Spec Ed", column:"SpecEd_fake", value:null };
        filterMenu.EngLang = { id:"EngLang", category:"students", text:"percent ESL", column:"Limited_English", value:null };

        // == Capacity
        filterMenu.Capacity = { id:"Capacity", category:"buildings", text:"Capacity", column:"maxOccupancy", value:null };
    }

    // ======= ======= ======= initDisplayObjects ======= ======= =======
    function initDisplayObjects() {
        console.log("initDisplayObjects");

        displayObject = new Display("display1");

    }

    // ======= ======= ======= initChartObjects ======= ======= =======
    function initChartObjects() {
        console.log("initChartObjects");

        mapDataObject = new Chart("barChart");
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
        this.geographyMenu = ["geography", filterMenu.Ward, filterMenu.FeederHS, filterMenu.FeederMS, filterMenu.Elementary, filterMenu.Quadrant];
        this.agencyMenu = ["agency", filterMenu.Public, filterMenu.Charter];
        this.levelsMenu = ["levels", filterMenu.PK3K, filterMenu.Elem, filterMenu.Middle, filterMenu.High, filterMenu.ES_MS, filterMenu.MS_HS, filterMenu.Alt, filterMenu.SpecEd];
        this.expendMenu = ["expenditures", filterMenu.spendPast, filterMenu.spendLifetime, filterMenu.spendPlanned, filterMenu.spendSqFt, filterMenu.spendEnroll];
        this.studentsMenu = ["students", filterMenu.Enrollment, filterMenu.AtRisk, filterMenu.SpecEd, filterMenu.EngLang];
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



    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======



    // ======= ======= ======= initFilterMenus ======= ======= =======
    Display.prototype.initFilterMenus = function() {
        console.log("initFilterMenus");

        var filtersArray = [this.geographyMenu, this.levelsMenu, this.agencyMenu, this.expendMenu, this.studentsMenu];
        var filterContainer = $("#main-nav");
        var menuHtml = "<ul>";

        // == build next filter category html
        for (var i = 0; i < filtersArray.length; i++) {
            nextMenu = filtersArray[i];
            nextCategory = nextMenu[0];
            console.log("  nextCategory: ", nextCategory);

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
            displayObject.activateFilterSelect(nextItem);
        }
    }

    // ======= ======= ======= updateMenuItem ======= ======= =======
    Display.prototype.updateMenuItem = function(whichCategory, whichFilter) {
        console.log("updateMenuItem");
        console.log("  whichFilter: ", whichFilter);
        console.log("  whichCategory: ", whichCategory);

        if ($.isArray(whichFilter)) {
            whichFilter = whichFilter[0];
        }

        var menuObject = filterMenu[whichFilter];
        var menuText = menuObject.text;

        // == modify selected filter menu item to show selection
        htmlString = "<a id='" + whichFilter + "' href='#'>" + menuText + "</a>";
        selectedFilterElement = $("#" + whichCategory);
        selectedFilterElement.empty();
        selectedFilterElement.html(htmlString);
        selectedFilterElement.addClass("activeFilter");
        selectedFilterElement.addClass(whichCategory + "-set");
        this.activateFilterRelease(selectedFilterElement);
    }

    // ======= ======= ======= activateFilterSelect ======= ======= =======
    Display.prototype.activateFilterSelect = function(nextItem) {
        console.log("activateFilterSelect");

        var self = this;
        var nextId = nextItem.id;
        var nextElement = $("#" + nextId);

        // == [Ward or Feeder, Ward or Feeder number]
        var geoFilterArray = [null, null];

        // ======= ======= ======= selectFilter ======= ======= =======
        $(nextElement).off("click").on("click", function(event){
            console.log("");
            console.log("-- selectFilter -- ");
            console.log("  self.dataFiltersArray: ", self.dataFiltersArray);

            var classList = $(this).attr('class').split(/\s+/);
            var whichCategory = classList[1];
            var whichFilter = this.id;
            var menuObject = filterMenu[whichFilter];
            var whichColumn = menuObject.column;
            var whichValue = menuObject.value;

            if (whichCategory != "geography") {
                var infoWindow = $("#info").css("display", "block")
            }
            event.stopImmediatePropagation();

            // == set selected filter value on display object (geography, levels, agency, expenditures, students)
            switch(whichCategory) {
                case "geography":
                    if (self.dataFiltersArray[0][0] == null) {
                        self.dataFiltersArray[0][0] = whichFilter;
                    }
                    break;
                case "levels":
                    self.dataFiltersArray[1] = whichFilter;
                    break;
                case "agency":
                    self.dataFiltersArray[2] = whichFilter;
                    break;
                case "expenditures":
                    self.dataFiltersArray[3] = whichFilter;
                    break;
                case "students":
                    self.dataFiltersArray[4] = whichFilter;
                    break;
            }
            self.updateMenuItem(whichCategory, whichFilter);
            console.log("  self.dataFiltersArray: ", self.dataFiltersArray);
            mapDataObject.makeDataMap();
        });
    }

    // ======= ======= ======= activateFilterRelease ======= ======= =======
    Display.prototype.activateFilterRelease = function(selectedFilterElement) {
        console.log("activateFilterRelease");

        var self = this;
        var menuHtml;

        // ======= ======= ======= releaseFilter ======= ======= =======
        $(selectedFilterElement).off("click").on("click", function(event){
            console.log("");
            console.log("-- releaseFilter -- ");

            var whichFilter = this.id;

            switch(whichFilter) {
                case "geography":
                    if (self.dataFiltersArray[0][1]) {
                        restoreGeoMenu(selectedFilterElement);
                    } else {
                        self.dataFiltersArray[0] = [null, null];
                        nextMenu = self.geographyMenu;
                        prevClass = "geography-set";
                        restoreFilterMenu(this, nextMenu);
                        mapDataObject.makeDataMap("Quadrant");
                    }
                    break;
                case "levels":
                    self.dataFiltersArray[1] = null;
                    nextMenu = self.levelsMenu;
                    prevClass = "levels-set";
                    restoreFilterMenu(this, nextMenu);
                    break;
                case "agency":
                    self.dataFiltersArray[2] = null;
                    nextMenu = self.agencyMenu;
                    prevClass = "agency-set";
                    restoreFilterMenu(this, nextMenu);
                    break;
                case "expenditures":
                    self.dataFiltersArray[3] = null;
                    nextMenu = self.expendMenu;
                    prevClass = "expenditures-set";
                    restoreFilterMenu(this, nextMenu);
                    break;
                case "students":
                    self.dataFiltersArray[4] = null;
                    nextMenu = self.studentsMenu;
                    prevClass = "students-set";
                    restoreFilterMenu(this, nextMenu);
                    break;
            }

            // ======= ======= ======= restoreGeoMenu ======= ======= =======
            function restoreGeoMenu(selectedFilterElement) {
                console.log("restoreGeoMenu");
                self.dataFiltersArray[0][1] = null;
                self.updateMenuItem("geography", self.dataFiltersArray[0]);
                mapDataObject.resetMap();
            }

            // ======= ======= ======= restoreFilterMenu ======= ======= =======
            function restoreFilterMenu(selectedFilterElement, nextMenu) {
                console.log("restoreFilterMenu");
                $(selectedFilterElement).removeClass("activeFilter");
                $(selectedFilterElement).removeClass(prevClass);
                $(selectedFilterElement).empty();
                menuHtml = "<a href='#'>" + nextMenu[0] + "<span class='caret'></span></a>";
                menuHtml += "<ul>";
                menuHtml += self.makeFilterMenu(nextMenu);
                menuHtml += "</ul>";
                menuHtml += "</li>";
                $(selectedFilterElement).append(menuHtml);
                self.activateFilterMenu(nextMenu);
                var infoWindow = $("#info").css("display", "none")
            }

            restoreZoneListeners(self.dataFiltersArray[0][0]);
            removeMarkers();

            // ======= ======= ======= restoreZoneListeners ======= ======= =======
            function restoreZoneListeners(zoneType) {
                console.log("restoreZoneListeners");

                mapDataObject.activateZoneData(zoneType);
            }
        });
        // console.log("  self.dataFiltersArray: ", self.dataFiltersArray);
    }



    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======




    // ======= ======= ======= makeDataMap ======= ======= =======
    Chart.prototype.makeDataMap = function() {
        console.log("");
        console.log("===== makeDataMap =====");
        // console.log("  displayObject.dataFiltersArray: ", displayObject.dataFiltersArray);

        var self = this;
        var filterFlag = false;
        var whichZoneType = displayObject.dataFiltersArray[0][0];
        if (whichZoneType == null) {
            var whichZoneType = "Quadrant";
        } else {
            var whichZoneType = displayObject.dataFiltersArray[0][0];
        }

        var url = getZoneUrl(whichZoneType);

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: url
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            console.dir(geoJsonData);

            displayObject.zoneGeojson = geoJsonData;

            // == make aggregator array for aggregated zone data
            self.zoneDataArray = [];
            var zoneDataArray = []
            for (var i = 0; i < geoJsonData.features.length; i++) {
                zoneDataArray.push(0);
            }
            self.zoneDataArray = zoneDataArray;

            // == check for selected filters; get data if any selected
            for (var i = 1; i < displayObject.dataFiltersArray.length; i++) {
                nextFilter = displayObject.dataFiltersArray[i];
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

    // ======= ======= ======= getSchoolData ======= ======= =======
    Chart.prototype.getSchoolData = function(geoJsonData, featureArray, whichZoneType) {
        console.log("getSchoolData");

        var self = this;
        var filterSelectArray;
        var filterFlag = false;
        var url = "Data_Schools/DCPS_Master_114_dev.csv";
        var checkGeoType = checkGeo = checkLevel = checkAgency = checkExpend = checkStudents = null;

        var GeoTypeFilter = displayObject.dataFiltersArray[0][0];
        var GeoFilter = displayObject.dataFiltersArray[0][1];
        var LevelFilter = displayObject.dataFiltersArray[1];
        var AgencyFilter = displayObject.dataFiltersArray[2];
        var ExpendFilter = displayObject.dataFiltersArray[3];
        var StudentsFilter = displayObject.dataFiltersArray[4];

        if (GeoTypeFilter) {
            var checkGeoType = GeoTypeFilter;
            if ((GeoTypeFilter == "FeederHS") || (GeoTypeFilter == "FeederMS")) {
                var geoSuffix = " " + checkGeoType.substring(checkGeoType.length - 2, checkGeoType.length);
                console.log("  geoSuffix: ", geoSuffix);
                if (GeoFilter) {
                    var checkGeo = filterMenu[GeoTypeFilter].value + geoSuffix;
                }
            } else {
                if (GeoFilter) {
                    var checkGeo = filterMenu[GeoTypeFilter].value;
                }
            }
        }
        if (LevelFilter) {
            var checkLevel = filterMenu[LevelFilter].value;
        }
        if (AgencyFilter) {
            var checkAgency = filterMenu[AgencyFilter].value;
        }
        if (ExpendFilter) {
            var checkExpend = filterMenu[ExpendFilter].value;
        }
        if (StudentsFilter) {
            var checkStudents = filterMenu[StudentsFilter].value;
        }

        console.log("  GeoTypeFilter: ", GeoTypeFilter);
        console.log("    checkGeoType: ", checkGeoType);
        console.log("  GeoFilter: ", GeoFilter);
        console.log("    checkGeo: ", checkGeo);
        console.log("  LevelFilter: ", LevelFilter);
        console.log("    checkLevel: ", checkLevel);
        console.log("  AgencyFilter: ", AgencyFilter);
        console.log("    checkAgency: ", checkAgency);

        // ======= get selected data =======
        $.ajax({
            url: url,
            method: "GET",
            dataType: "text"
        }).done(function(textData){
            console.log("*** ajax success ***");
            jsonData = CSV2JSON(textData);
            console.dir(jsonData);

            displayObject.schoolGeojson = jsonData;

            var nextFilter;
            var selectedCodesArray = [];
            var selectedDataArray = [];

            // == get school codes for selected zone, level and type
            for (var i = 0; i < jsonData.length; i++) {
                var filterFlagCount = 0;

                filterSelectArray = [null, null, null];
                nextSchool = jsonData[i];
                school = nextSchool.School;
                schoolCode = nextSchool.SCHOOLCODE;
                schoolWard = nextSchool.WARD;
                schoolFeederMS = nextSchool.FeederMS;
                schoolFeederHS = nextSchool.FeederHS;
                schoolAgency = nextSchool.Agency;
                schoolLevel = nextSchool.Level;

                // == checkGeoType, checkGeo, checkLevel, checkAgency, ExpendFilter, StudentsFilter
                if (checkGeoType) {
                    if (checkGeo == null) {
                        filterSelectArray[0] = true;
                    } else {
                        if (checkGeoType == "Ward") {
                            if (checkGeo == schoolWard) {
                                filterSelectArray[0] = true;
                            }
                        } else if (checkGeoType == "FeederMS") {
                            if (checkGeo == schoolFeederMS) {
                                filterSelectArray[0] = true;
                            }
                        } else if (checkGeoType == "FeederHS") {
                            // console.log("-- school: ", school);
                            // console.log("  checkGeo: ", checkGeo);
                            // console.log("  FeederHS: ", schoolFeederHS);
                            if (checkGeo === schoolFeederHS) {
                                console.log("  *** HS match ");
                                filterSelectArray[0] = true;
                            }
                        }
                    }
                }

                if (checkLevel) {
                    var checkLevelString = schoolLevel.indexOf(checkLevel);
                    console.log("  checkLevelString: ", checkLevelString);
                    if ((checkLevel == schoolLevel) || (checkLevelString > -1)) {
                        console.log("  *** level match ");
                        filterSelectArray[1] = true;
                    }
                } else {
                    filterSelectArray[1] = true;
                }
                if (checkAgency) {
                    if (checkAgency == schoolAgency) {
                        filterSelectArray[2] = true;
                    }
                } else {
                    filterSelectArray[2] = true;
                }
                console.log("  filterSelectArray: ", filterSelectArray);

                for (var j = 0; j < filterSelectArray.length; j++) {
                    nextFilter = filterSelectArray[j];
                    if (nextFilter) {
                        filterFlagCount++;
                    }
                }
                if (filterFlagCount == 3) {
                    schoolData = getDataDetails(nextSchool);
                    selectedDataArray.push(schoolData)
                    selectedCodesArray.push(schoolData.schoolCode)
                }
            }
            console.log("  selectedDataArray.length: ", selectedDataArray.length);
            console.log("  selectedCodesArray: ", selectedCodesArray);

            // == build zone and data layers on map
            if (selectedDataArray.length > 0) {
                $("#info").css("display", "block");
                infoText = "<p>" + selectedDataArray.length + " schools match selected filters.</p>";
                $("#infoText").html(infoText);
                self.makeSchoolsMap(selectedDataArray);
            } else {
                if (checkGeoType == "Ward") {
                    infoText = "<p>No schools at selected level in selected ward</p>";
                } else if ((checkGeoType == "FeederMS") || (checkGeoType == "FeederHS")) {
                    infoText = "<p>No schools at selected level in selected feeder zone</p>";
                } else {
                    infoText = "<p>No geography filter selected</p>";
                }
                $("#info").css("display", "block");
                $("#infoText").html(infoText);
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
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
        // console.log("  map.data0: ", map.data);

        // == set indexes
        var colorIndex = -1;
        var featureIndex = -1;
        var nameString = "";

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
            } else if ((zoneType == "FeederMS") || (zoneType == "FeederHS") || (zoneType == "Elementary")) {
                itemName = feature.getProperty('SCHOOLNAME');
            }
            nameString += itemName + ", ";

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
        // console.log("  nameString: " + nameString);

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

        self.activateZoneData(zoneType);
    }

    // ======= ======= ======= activateZoneData ======= ======= =======
    Chart.prototype.activateZoneData = function(zoneType) {
        console.log("activateZoneData");

        var self = this;

        // ======= add mouseover event listeners =======
        var zoneMouseover = map.data.addListener('mouseover', function(event) {
            // console.log("--- mouseover ---");
            var itemName = event.feature.getProperty('itemName');
            var itemCenter = event.feature.getProperty('center');

            var overlay = new google.maps.OverlayView();
            overlay.draw = function() {};
            overlay.setMap(map);
            overlay.onAdd = function() {
                var projection = this.getProjection();
                var pixel = projection.fromLatLngToContainerPixel(itemCenter);
                var locX = parseInt(pixel.x - 30);
                var locY = parseInt(pixel.y + 100);
                makeTooltip(itemName, locX, locY);
            };

            map.data.overrideStyle(event.feature, {
                fillColor: "white",
                strokeWeight: 2
            });
        });

        // ======= add mouseout event listeners =======
        var zoneMouseout = map.data.addListener('mouseout', function(event) {
            // console.log("--- mouseout ---");
            var featureIndex = event.feature.getProperty('index');
            var itemColor = event.feature.getProperty('itemColor');
            map.data.overrideStyle(event.feature, {
                fillColor: itemColor,
                strokeWeight: 1
            });
            makeTooltip(null);
        });

        // ========= click event listeners =========
        if (zoneType == "Ward") {

            // ========= zoom to the clicked feature =========
            var zoneMouseClick = map.data.addListener('click', function(event) {
                console.log("");
                console.log("--- select ward ---");
                var wardName = event.feature.getProperty('NAME');
                var wardNumber = event.feature.getProperty('WARD');
                var menuObject = filterMenu["Ward"];
                menuObject.value = wardNumber;
                displayObject.dataFiltersArray[0][1] = wardNumber;
                mapDataObject.whichGeography = ["Ward", wardNumber];
                var selectedWard = $("#" + zoneType);
                $(selectedWard).text(zoneType + " " + wardNumber);
                console.log("  displayObject.dataFiltersArray: ", displayObject.dataFiltersArray);

                // == bounds: rectangle surrounding geo area
                // removeMarkers();
                zoomToZone(event);
            });

        } else if ((zoneType == "FeederMS") || (zoneType == "FeederHS")) {

            // ========= zoom to the clicked feature =========
            var zoneMouseClick = map.data.addListener('click', function(event) {
                console.log("");
                console.log("--- select feeder ---");
                var whichFeeder = event.feature.getProperty('SCHOOLNAME');
                var menuObject = filterMenu[zoneType];
                menuObject.value = whichFeeder;
                displayObject.dataFiltersArray[0][1] = whichFeeder;
                mapDataObject.whichGeography = ["Feeder", whichFeeder];
                var selectedFeeder = $("#" + zoneType);
                $(selectedFeeder).text(whichFeeder);
                console.log("zoneType: ", zoneType);
                console.log("whichFeeder: ", whichFeeder);
                console.log("displayObject.dataFiltersArray: ", displayObject.dataFiltersArray);

                // == bounds: rectangle surrounding geo area
                // removeMarkers();
                zoomToZone(event);
            });
        }

        // == add listeners to listeners array
        this.mapListenersArray.push(zoneMouseover);
        this.mapListenersArray.push(zoneMouseout);
        this.mapListenersArray.push(zoneMouseClick);


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

    // ======= ======= ======= makeSchoolsMap ======= ======= =======
    Chart.prototype.makeSchoolsMap = function(selectedDataArray) {
        console.log("");
        console.log("----- makeSchoolsMap -----");

        var nextSchoolData, nextSchool, nextSchoolCode, nextSchoolType, nextLat, nextLng, schoolLoc, typeColor;
        var schoolMarkersArray = [];
        var schoolMarker;
        var infoFlag = false;
        var infoText = "<p>";

        // ======= clear existing listeners if any =======
        removeMapListeners();
        removeMarkers();

        // == make school markers
        for (var i = 0; i < selectedDataArray.length; i++) {
            nextSchoolData = selectedDataArray[i];
            schoolMarker = null;
            nextSchool = nextSchoolData.schoolName;
            nextSchoolCode = nextSchoolData.schoolCode;
            nextSchoolType = nextSchoolData.schoolAgency;
            nextSchoolAddress = nextSchoolData.schoolAddress;
            nextLat = nextSchoolData.schoolLAT;
            nextLng = nextSchoolData.schoolLON;
            schoolLoc = new google.maps.LatLng(nextLat, nextLng);
            console.log("  nextSchoolCode: ", nextSchoolCode);

            // == set color of school circle
            if (nextSchoolType == "DCPS") {
                fillColor = "red";
                strokeColor = "maroon";
            } else {
                fillColor = "orange";
                strokeColor = "crimson ";
            }

            // == indicate missing info if required
            if ((nextLat == "NA") || (nextLng == "NA") || (nextLat == null) || (nextLng == null)) {
                infoText += nextSchoolCode + " ";
                infoFlag = true;

            // == show markers for available data
            } else {

                var iconSize = 0.3;
                var icon = {
                    path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                    fillColor: fillColor,
                    strokeColor: strokeColor,
                    fillOpacity: 1,
                    strokeWeight: 1,
                    scale: iconSize
                }

                var schoolMarker = new google.maps.Marker({
                    position: schoolLoc,
                    icon: icon,
                    // icon: {
                    //     path: google.maps.SymbolPath.CIRCLE,
                    //     scale: 5
                    // },
                    draggable: true,
                    map: map,
                    title: nextSchool,
                    schoolName: nextSchool,
                    schoolCode: nextSchoolCode,
                    schoolAddress: nextSchoolAddress,
                    schoolIndex: i
                });

                schoolMarker.setMap(map);

                // == store marker on chart object
                this.schoolMarkersArray.push(schoolMarker);

                // == activate marker mouseover/mouseout
                this.activateSchoolMarker(schoolMarker);
            }
        }

        if (infoFlag == true) {
            $("#info").css("display", "block");
            infoText += " info not available.</p>";
            $("#infoText").html(infoText);
        }
        // this.checkSchoolMarkers();
    }


    // ======= ======= ======= activateSchoolMarker ======= ======= =======
    Chart.prototype.activateSchoolMarker = function(schoolMarker) {
        console.log("activateSchoolMarker");

        // ======= mouseover event listener =======
        google.maps.event.addListener(schoolMarker, 'mouseover', function (event) {
        // var schoolMouseover = schoolMarker.addListener('mouseover', function(event) {
            // console.log("--- mouseover ---");
            var schoolName = this.schoolName;
            var schoolCode = this.schoolCode;
            var schoolIndex = this.schoolIndex;
            var schoolAddress = this.schoolAddress;
            var schoolLoc = this.position;

            var overlay = new google.maps.OverlayView();
            overlay.draw = function() {};
            overlay.setMap(map);
            overlay.onAdd = function() {
                var projection = this.getProjection();
                var pixel = projection.fromLatLngToContainerPixel(schoolLoc);
                var locX = parseInt(pixel.x + 5);
                var locY = parseInt(pixel.y + 115);
                makeTooltip(schoolName, locX, locY);
                showInfo(schoolName + "<br>" + schoolAddress);
            };
        });

        // ======= mouseout event listener =======
        google.maps.event.addListener(schoolMarker, 'mouseout', function (event) {
        // var schoolMouseout = schoolMarker.addListener('mouseout', function(event) {
            // console.log("--- mouseout ---");
            makeTooltip(null);
            showInfo(null);
        });

        // ======= click event listener =======
        google.maps.event.addListener(schoolMarker, 'click', function (event) {
        // var schoolMouseClick = schoolMarker.addListener('click', function(event) {
            console.log("--- click ---");
            var schoolName = this.schoolName;
            var schoolCode = this.schoolCode;
            console.log("  schoolName: ", schoolName);
            console.log("  schoolCode: ", schoolCode);

            loadProfilePage(schoolCode);
        });

        // this.mapListenersArray.push(schoolMouseover);
        // this.mapListenersArray.push(schoolMouseout);
        // this.mapListenersArray.push(schoolMouseClick);
        // console.log("  schoolMouseover: ", schoolMouseover);
    }

    // ======= ======= ======= checkSchoolMarkers ======= ======= =======
    Chart.prototype.checkSchoolMarkers = function(schoolMarker) {
        console.log("checkSchoolMarkers");

        console.log("  markers_count: ", this.schoolMarkersArray.length);
        for (var i = 0; i < this.schoolMarkersArray.length; i++) {
            nextMarker = this.schoolMarkersArray[i];
            if (i == 0) {
                console.log("  nextMarker: ", nextMarker);
            }
            if ((nextMarker.ua[0].R == null) || (nextMarker.ua[1].R == null) || (nextMarker.ua[2].R == null)) {
                console.log("  ** missing listeners");
            }
            console.log("  nextMarker.ua[0].R: ", nextMarker.ua[0].R);
        }
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



    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= MAP ======= ======= ======= ======= =======



    // ======= ======= ======= loadProfilePage ======= ======= =======
    function loadProfilePage(schoolCode) {
        console.log('loadProfilePage');
        var href = window.location.href; // Returns path only
        var pathname = window.location.pathname; // Returns path only
        console.log("  href: ", href);
        console.log("  pathname: ", pathname);
        console.log("  schoolCode: ", schoolCode);

        // ======= index map =======
        if ((pathname == "/") || (pathname == "/index.html") || (pathname == "/schoolMod/" || (pathname == "/schoolMod/index.html"))) {
            // window.location.href = pathname + "profile.html";
            window.location.href = "profile.html" + "?schoolCode=" + schoolCode;
        }
    }

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

        // ======= map object =======
        var href = window.location.href; // Returns path only
        var pathname = window.location.pathname; // Returns path only
        console.log("  href: ", href);
        console.log("  pathname: ", pathname);

        // ======= index map =======
        if ((pathname == "/") || (pathname == "/index.html") || (pathname == "/schoolMod/" || (pathname == "/schoolMod/index.html"))) {

            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 38.89, lng: -77.00},
                disableDefaultUI: false,
                disableDoubleClickZoom: true,
                zoomControl: true,
                zoomControlOpt: {
                    style: 'SMALL',
                    position: 'TOP_LEFT'
                },
                draggable: true,
                scrollwheel: false,
                styles: styleArray,     // styles for map tiles
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                zoom: 12
            });

        } else {

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
        }
        google.maps.event.addListener(map, 'tilesloaded', function() {
            console.log("tilesloaded.addListener");
            if (!mapDataObject.mapBounds) {
                mapDataObject.mapBounds = map.getBounds();
                // console.log("  mapDataObject.mapBounds: ",mapDataObject.mapBounds);
                // makeOverlay();
            }
        });

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
        mapDataObject.mapStateArray = mapStateArray;
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
            case "Elementary":
                url = "Data_Geo/School_Attendance_Zones_Elementary.geojson";
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

        // console.log("  listeners_before: ", mapDataObject.mapListenersArray.length);
        var mapListenersArray = mapDataObject.mapListenersArray;
        if (mapListenersArray.length > 0) {
            for (var i = 0; i < mapListenersArray.length; i++) {
                google.maps.event.removeListener(mapListenersArray[i]);
            }
        }
        mapDataObject.mapListenersArray = [];
        // console.log("  listeners_after: ", mapDataObject.mapListenersArray.length);
    }

    // ======= ======= ======= removeMarkers ======= ======= =======
    function removeMarkers() {
        console.log("removeMarkers");

        // console.log("  markers_before: ", mapDataObject.schoolMarkersArray.length);
        var schoolMarkersArray = mapDataObject.schoolMarkersArray;
        if (schoolMarkersArray) {
            for(i = 0; i < schoolMarkersArray.length; i++){
                schoolMarkersArray[i].setMap(null);
                schoolMarkersArray[i] = null;
            }
        }
        mapDataObject.schoolMarkersArray = [];
        // console.log("  markers_after: ", mapDataObject.schoolMarkersArray.length);
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







    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INITIALIZE ======= ======= ======= ======= =======



    initMap();
    initMenuObjects();
    initChartObjects();
    initDisplayObjects();
    displayObject.initFilterMenus();
    saveMapState(map);
    mapDataObject.makeDataMap("Quadrant");



}
