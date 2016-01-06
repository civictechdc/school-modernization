
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

    // Charter School Data:
    // OBJECTID, NAME, ADDRESS, DIRECTOR, PHONE, AUTHORIZER, GRADES, ENROLLMENT, GIS_ID, WEB_URL, ADDRID, X, Y, AUTHORIZAT, MYSCHOOL
    // Charter Capacity Data:
    // LEA ID, School ID(s), School Name(s), School Address(es), Former DCPS Facility Name, Maximum Occupancy, Total Square Footage, Number of Students Enrolled, Square Footage per Student, LEA Enrollment Ceiling, Percentage of LEA Enrollment Ceiling Filled, FACILITY NOTES
    // At Risk Enrollment
    // Sector, LEA or School Name, % At-Risk for FY15 Projections, # FY15 Total Enrollment Projection
    // Spending Plan
    // Owner Agency, Project ID, School, Description, Agency, FY-2009, FY-2010, FY-2011, FY-2012, FY-2013, FY-2014
    // Spending Plan 2
    //Project No, Project Title, Lifetime Budget, LTD Allotments, Exp 2013, Allotments  in FY 2014, Exp  2014, Allotments  in FY 2015, Exp 2015, Allotments  in FY 2016, Exp 2016, LTD Expenditures, Unspent Allotments, Encumbrances, Pre Encumbrances, ID Advances, LifeTime Balance, FY 2017, FY 2018, FY 2019, FY 2020, FY 2021, FY 2022, 6-yr Total

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
        this.whichSchools = [null, null];
        this.whichStudents = null;
        this.whichBuildings = null;
        this.whichGeography = null;
        this.selectedSchoolData = null;
    }



    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= CHARTS ======= ======= ======= ======= =======



    // ======= ======= ======= getFilteredData ======= ======= =======
    Chart.prototype.getFilteredData = function(whichMenu) {
        console.log("getFilteredData");

        // Agency, School, totalSQFT, Address, Enrolled, SqFtperStudent, SchoolCode, Longitude, Latitude, Ward, AtRiskPct, SQFTgroup, Enrollgroup, SQFTpergroup, FakeExpend, Level

        console.log("  whichYears: " + chartObject.whichYears);
        console.log("  whichSchools: " + chartObject.whichSchools);
        console.log("  whichStudents: " + chartObject.whichStudents);
        console.log("  whichBuildings: " + chartObject.whichBuildings);
        console.log("  whichGeography: " + chartObject.whichGeography);

        this.getSchoolData();

    }

    // ======= ======= ======= setSelectedFilter ======= ======= =======
    Chart.prototype.setSelectedFilter = function(filterElement) {
        console.log("setSelectedFilter");
        whichFilter = $(filterElement).attr('id');
        whichCategory = $(filterElement).attr('class').split(/\s+/)[1];
        console.log("  whichFilter1: ", whichFilter);
        console.log("  this.whichSchools1: ", this.whichSchools);
        if (whichCategory != "schools") {
            $(filterElement).siblings("li:not(:last-child)").css("background-color", "#ddd");
            $(filterElement).siblings("li:not(:last-child)").children("p").css("color", "black");
        }

        switch(whichCategory) {
            case "years":
                $(filterElement).css("background-color", "yellow");
                $(filterElement).children("p").css("color", "black");
                this.whichYears = whichFilter;
                break;
            case "students":
                $(filterElement).css("background-color", "purple");
                $(filterElement).children("p").css("color", "white");
                this.whichStudents = whichFilter;
                break;
            case "buildings":
                $(filterElement).css("background-color", "red");
                $(filterElement).children("p").css("color", "white");
                this.whichBuildings = whichFilter;
                break;
            case "geography":
                $(filterElement).css("background-color", "blue");
                $(filterElement).children("p").css("color", "white");
                this.whichGeography = whichFilter;
                this.getZoneData(whichFilter);
                break;
            case "schools":
                if (whichFilter == "Public") {
                    $("#Charter").css("background-color", "#ddd");
                    $("#Charter").children("p").css("color", "black");
                    this.whichSchools[0] = "Public";
                } else if (whichFilter == "Charter") {
                    $("#Public").css("background-color", "#ddd");
                    $("#Public").children("p").css("color", "black");
                    this.whichSchools[0] = "Charter";
                } else if (!(whichFilter == "Public") || (whichFilter == "Charter")) {
                    console.log("  whichFilter2: ", whichFilter);
                    this.whichSchools[1] = whichFilter;
                    $(filterElement).siblings("li:not(:last-child, #Public, #Charter)").css("background-color", "#ddd");
                    $(filterElement).siblings("li:not(:last-child, #Public, #Charter)").children("p").css("color", "black");
                }
                $(filterElement).css("background-color", "green");
                $(filterElement).children("p").css("color", "white");
                break;
        }
        console.log("  this.whichGeography: ", this.whichGeography);
        console.log("  this.whichSchools2: ", this.whichSchools);
    }



    // ======= ======= ======= ======= ======= DATA ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DATA ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DATA ======= ======= ======= ======= =======



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

    // ======= ======= ======= getSchoolData ======= ======= =======
    Chart.prototype.getSchoolData = function() {
        console.log("getSchoolData");

        var self = this;
        var whichType, whichLevel, checkType, checkLevel;

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

            if (self.whichGeography) {
                whichGeoType = self.whichGeography[0];
                whichGeoValue = self.whichGeography[1];

                switch(whichGeoType) {
                    case "Ward":
                        checkGeo = whichGeoValue;
                        break;
                    case "Feeder":
                        checkGeo = null;
                        break;
                    case "Quadrant":
                        checkGeo = null;
                        break;
                    default:
                        checkGeo = null;
                }
            } else {
                whichGeoType = null;
            }

            if (self.whichSchools) {
                whichType = self.whichSchools[0];
                whichLevel = self.whichSchools[1];
                switch(whichType) {
                    case "Public":
                        checkType = "DCPS";
                        break;
                    case "Charter":
                        checkType = "PCS";
                        break;
                    default:
                        checkType = null;
                }

                switch(whichLevel) {
                    case "Elem":
                        checkLevel = "ES";
                        break;
                    case "Middle":
                        checkLevel = "MS";
                        break;
                    case "High":
                        checkLevel = "HS";
                        break;
                    case "Youth":
                        checkLevel = "YE";
                        break;
                    default:
                        checkLevel = null;
                }
            } else {
                checkType = null;
                checkLevel = null;
            }

            var selectedTypeArray = [];
            var selectedLevelArray = [];
            var selectedDataArray = [];
            var checkDataArray = [];

            // == get school codes for selected level and type
            for (var i = 0; i < jsonData.length; i++) {
                nextSchool = jsonData[i];
                schoolCode = nextSchool.SchoolCode;
                schoolType = nextSchool.Agency;
                schoolLevel = nextSchool.Level;
                schoolWard = nextSchool.Ward;

                // == check if public or charter type selected
                if (checkType) {
                    if (schoolType == checkType) {
                        selectedTypeArray.push(schoolCode);
                    }
                } else {
                    selectedTypeArray.push(schoolCode);
                }

                // == check ES, MS, HS, YE school type
                if (checkLevel) {
                    if (schoolLevel == checkLevel) {

                        // == check if ward selected
                        if (whichGeoType) {
                            if (whichGeoType == "Ward") {
                                if (schoolWard == checkGeo) {
                                    selectedLevelArray.push(schoolCode);
                                }
                            // } else if (whichGeoType == "Feeder") {
                            //     if (schoolFeeder == checkGeo) {
                            //         selectedLevelArray.push(schoolCode);
                            //     }
                            // } else if (whichGeoType == "Quadrant") {
                            //     if (schoolQuadrant == checkGeo) {
                            //         selectedLevelArray.push(schoolCode);
                            //     }
                            }
                        } else {
                            selectedLevelArray.push(schoolCode);
                        }
                    }
                } else {
                    selectedLevelArray.push(schoolCode);
                }
            }

            var selectedSchoolcodesArray = getArrayIntersect(selectedTypeArray, selectedLevelArray);

            // == iterate through all json school data
            for (var i = 0; i < jsonData.length; i++) {
                nextSchool = jsonData[i];
                checkSchoolCode = nextSchool.SchoolCode;

                // == check each school for match to selected schools via school code
                for (var j = 0; j < selectedSchoolcodesArray.length; j++) {
                    nextSchoolCode = selectedSchoolcodesArray[j];
                    if (nextSchoolCode == checkSchoolCode) {
                        console.log("  nextSchool.School: ", nextSchool.School);
                        nextData = getDataDetails(nextSchool);
                        console.log("  nextData.schoolName: ", nextData.schoolName);
                        selectedDataArray.push(nextData);
                        checkDataArray.push(nextSchoolCode);
                    }
                }
            }

            console.log("  selectedSchoolcodesArray.length: ", selectedSchoolcodesArray.length);
            console.log("  selectedDataArray.length: ", selectedDataArray.length);
            console.log("  checkDataArray.length: ", checkDataArray.length);
            console.log("  checkDataArray: ", checkDataArray);
            console.log("  selectedDataArray: ", selectedDataArray);

            // == store school data on chart object
            this.selectedSchoolData = selectedDataArray;
            makeSchoolsChart(this.selectedSchoolData);


            // ======= ======= ======= getDataDetails ======= ======= =======
            function getDataDetails(nextSchool) {
                console.log("getDataDetails");

                var schoolName = nextSchool.School;
                var schoolCode = nextSchool.SchoolCode;
                var schoolType = nextSchool.Agency;
                var schoolLevel = nextSchool.Level;
                var schoolExpenditure = nextSchool.FakeExpend;
                var schoolSqft = nextSchool.totalSQFT;
                var schoolEnroll = nextSchool.Enrolled;
                var schoolLng = nextSchool.Longitude;
                var schoolLat = nextSchool.Latitude;
                var schoolLat = nextSchool.Latitude;
                var schoolWard = nextSchool.Ward;
                var schoolData = { "schoolName": schoolName, "schoolCode": schoolCode, "schoolType": schoolType, "schoolLevel": schoolLevel, "schoolExpenditure": schoolExpenditure, "schoolSqft": schoolSqft, "schoolLng": schoolLng, "schoolLat": schoolLat, "schoolWard": schoolWard };
                return schoolData;
            }

            // ======= ======= ======= getArrayIntersect ======= ======= =======
            function getArrayIntersect(arrayA, arrayB) {
                console.log("getArrayIntersect");

                return $.grep(arrayA, function(i) {
                    return $.inArray(i, arrayB) > -1;
                });

            }

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
                url = "Data_Geo/Ward__2012.geojson";
                break;
            case "Feeder":
                url = "Data_Geo/School_Attendance_Zones_Senior_High.geojson";
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
                        chartObject.whichGeography = ["Ward", whichWard];
                        console.log("  wardName: " + wardName);
                    });
                    break;
                case "Feeder":
                    map.data.addListener('click', function(event) {
                        console.log("--- click feeders ---");
                        var gis_id = event.feature.getProperty('GIS_ID');
                        var bldg = event.feature.getProperty('BLDG_NUM');
                        var schoolName = event.feature.getProperty('SCHOOLNAME');
                        chartObject.whichGeography = ["Feeder", gis_id];
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



    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======



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
        console.log("makeFilterMenu");

        // == category list for making reset buttons
        var whichCategory = whichMenu[0];
        var whichClass = whichCategory;

        // == build html string for filter lists
        filterHtml = "";
        filterHtml += "<ul class='filterList'>";

        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            nextId = nextItem.id;
            nextText = nextItem.text;
            filterHtml += "<li id='" + nextId + "' class='filter " + whichClass + "'><p class='filterText'>" + nextText + "</p></li>";

            // == separate school type (Charter/Public) from school level (E/M/S/Y)
            // if ((whichCategory == "schools") && (nextId == "Charter")) {
            //     filterHtml +=  "</ul>";
            //     filterHtml += "<ul class='filterList'>";
            //     whichClass = "level";
            // }
        }

        // == add clear button to end of filter buttons
        filterHtml += "<li id='reset" + whichCategory + "' class='reset'><p class='filterText'>clear</p></li>";
        filterHtml +=  "</ul>";

        // == ad master getData button to end of menu
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

        // // == get menu item parameters
        nextId = whichItem.id;
        nextCategory = whichItem.category;
        nextCallback = whichItem.callback;
        nextItemElement = $("#" + nextId);

        // // ======= hover states =======
        // $(nextItemElement).off("mouseenter").on("mouseenter", function(event){
        //     console.log("-- mouseenter --");
        //     indexElement = event.currentTarget;
        //     indexElementId = event.currentTarget.id;
        // });
        // $(nextItemElement).off("mouseout").on("mouseout", function(event){
        //     // console.log("-- mouseout --");
        //     indexElement = event.currentTarget;
        // });

        // ======= click listeners =======
        $(nextItemElement).off("click").on("click", function(){
            console.log("-- selectFilter -- ");
            chartObject.setSelectedFilter(this);
        });
    }

    // ======= ======= ======= resetMenuItems ======= ======= =======
    Display.prototype.resetMenuItems = function(filterElement, menuCategory) {
        console.log("resetMenuItems");
        $(filterElement).siblings("li:not(:last-child)").css("background-color", "#ddd");
        $(filterElement).siblings("li:not(:last-child)").children("p").css("color", "black");

        switch(menuCategory) {
            case "years":
                chartObject.whichYears = null;
                break;
            case "schools":
                chartObject.whichSchools = [null, null];
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



    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======



    // ======= ======= ======= geoJsonToPolygon ======= ======= =======
    function geoJsonToPolygon(geoCoordinates) {
        console.log("geoJsonToPolygon");
        console.log("  geoCoordinates.length: " + geoCoordinates.length);

        var opts = {};
        var paths = [];
        var exteriorDirection;
        var interiorDirection;

        // == check if each path isCCW (T/F)?
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

        // == loop through LatLng coodinate pairs to define paths between pair
        for (var i = 0; i < geoCoordinates.length; i++){
            var path = [];
            for (var j = 0; j < geoCoordinates[i].length; j++) {
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
    }

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
