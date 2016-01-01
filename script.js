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

    var chart1;
    var filterMenu;
    var displayObject;

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
        chart1 = new Chart("chart1");
    }

    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======

    function Chart(whichChart) {
        console.log("Chart");
        this.name = whichChart;
    }
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
            this.activateFilterMenu(nextMenu);
            this.activateClearItem(nextMenu);
        }
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
        return filterHtml;
    }

    // ======= ======= ======= activateClearItem ======= ======= =======
    Display.prototype.activateClearItem = function(whichMenu) {
        // console.log("activateClearItem");

        var menuCategory = whichMenu[0];
        var clearItem = $("#reset" + menuCategory);

        $(clearItem).off("click").on("click", function(){
            console.log("-- clear " + menuCategory + " -- ");
            resetMenuItems(clearItem);
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

    // ======= ======= ======= activateFilterItem ======= ======= =======
    Display.prototype.activateFilterItem = function(whichItem) {
        console.log("activateFilterItem");

        var self = this;

        // == get menu item parameters
        nextId = whichItem.id;
        nextCategory = whichItem.category;
        nextCallback = whichItem.callback;
        nextItemElement = $("#" + nextId);
        console.log("  nextId: " + nextId);

        // ======= hover states =======
        $(nextItemElement).off("mouseenter").on("mouseenter", function(event){
            console.log("-- mouseenter --");
            indexElement = event.currentTarget;
            indexElementId = event.currentTarget.id;
            console.log("  indexElementId: " + indexElementId);
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
                    indexElement = event.currentTarget;
                    chart1.setYearsFilter(indexElement);
                });
                break;
            case "setSchools":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setSchools -- ");
                    indexElement = event.currentTarget;
                    chart1.setSchoolsFilter(indexElement);
                });
                break;
            case "setStudents":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setStudents -- ");
                    indexElement = event.currentTarget;
                    chart1.setStudentsFilter(indexElement);
                });
                break;
            case "setBuilding":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setBuilding -- ");
                    indexElement = event.currentTarget;
                    chart1.setBldgFilter(indexElement);
                });
                break;
            case "setGeography":
                $(nextItemElement).off("click").on("click", function(){
                    console.log("-- setYears -- ");
                    indexElement = event.currentTarget;
                    chart1.setGeoFilter(indexElement);
                });
                break;
        }
    }

    // ======= ======= ======= setYearsFilter ======= ======= =======
    Chart.prototype.setYearsFilter = function(whichYears) {
        console.log("setYearsFilter");
        resetMenuItems(whichYears);
        $(whichYears).css("background-color", "yellow");
        $(whichYears).children("p").css("color", "black");
    }

    // ======= ======= ======= setSchoolsFilter ======= ======= =======
    Chart.prototype.setSchoolsFilter = function(whichSchools) {
        console.log("setSchoolsFilter");
        resetMenuItems(whichSchools);
        $(whichSchools).css("background-color", "green");
        $(whichSchools).children("p").css("color", "white");
    }

    // ======= ======= ======= setStudentsFilter ======= ======= =======
    Chart.prototype.setStudentsFilter = function(whichStudents) {
        console.log("setStudentsFilter");
        resetMenuItems(whichStudents);
        $(whichStudents).css("background-color", "purple");
        $(whichStudents).children("p").css("color", "white");
    }

    // ======= ======= ======= setBldgFilter ======= ======= =======
    Chart.prototype.setBldgFilter = function(whichBldg) {
        console.log("setBldgFilter");
        resetMenuItems(whichBldg);
        $(whichBldg).css("background-color", "red");
        $(whichBldg).children("p").css("color", "white");
    }

    // ======= ======= ======= setGeoFilter ======= ======= =======
    Chart.prototype.setGeoFilter = function(whichGeo) {
        console.log("setGeoFilter");
        resetMenuItems(whichGeo);
        $(whichGeo).css("background-color", "blue");
        $(whichGeo).children("p").css("color", "white");
        getZoneData($(whichGeo).attr('id'));
    }

    // ======= ======= ======= resetMenuItems ======= ======= =======
    function resetMenuItems(whichItem) {
        console.log('resetMenuItems');
        $(whichItem).siblings("li:not(:last-child)").css("background-color", "#ddd");
        $(whichItem).siblings("li:not(:last-child)").children("p").css("color", "black");
    }

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
            scrollwheel: false,
            styles: styleArray,     // styles for map tiles
            zoom: 10
        });

    }

    // ======= ======= ======= getZoneData ======= ======= =======
    function getZoneData(zoneType) {
        console.log("getZoneData");
        console.log("  map: " + map);
        console.log("  zoneType: " + zoneType);

        var url, nextFeature;
        var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];

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

    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= initialize ======= ======= ======= ======= =======

    initMap();
    initChartObjects();
    initFilterObjects();
    initDisplayObjects();
    displayObject.initFilterMenus();
}
