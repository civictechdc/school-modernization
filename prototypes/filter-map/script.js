
function initApp(presetMode) {
    console.log('initApp');

    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======

    var schoolsCollectionObj;
    var zonesCollectionObj;
    var displayObj;

    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        // == District, Charter
        filterMenu.District = { id:"District", category:"schools", label:"DCPS Schools", text:"District Schools", column:"Agency", value:"DCPS" };
        filterMenu.Charter = { id:"Charter", category:"schools", label:"Charter Schools", text:"Public Charter Schools", column:"Agency", value:"PCS" };
        filterMenu.All = { id:"All", category:"schools", label:"All Schools", text:"District and Charter Schools", column:"Agency", value:"Both" };

        // == PK_K, Elem, Middle, High, ES_MS, MS_HS, Alt, SPED
        filterMenu.EMH = { id:"EMH", category:"schools", label:"All Levels", text:"All Grade Levels", column:"Level", value:"EMH" };
        filterMenu.Elem = { id:"Elem", category:"schools", label:"Elementary Schools", text:"Elementary, Elem/Middle, Early Childhood Schools", column:"Level", value:"ES" };
        filterMenu.Middle = { id:"Middle", category:"schools", label:"Middle Schools", text:"Middle Schools, Special Ed", column:"Level", value:"MS" };
        filterMenu.High = { id:"High", category:"schools", label:"High Schools", text:"High Schools, 6-12 MS/HS, Adult, Alternative Schools", column:"Level", value:"HS" };

        // == MajorExp9815, spendLifetime, spendPlanned
        filterMenu.MajorExp9815 = { id:"MajorExp9815", category:"expenditures", label:"Past Spending", text:"Past facility spending (1998-2015)", column:"MajorExp9815", value:null };
        filterMenu.spendPlanned = { id:"spendPlanned", category:"expenditures", label:"Future Spend", text:"Planned facility spending (2016-2021)", column:"TotalAllotandPlan1621", value:null };
        filterMenu.spendLifetime = { id:"spendLifetime", category:"expenditures", label:"Total Spend", text:"Total facility spending (1998-2021)", column:"LifetimeBudget", value:null };

        // == spendSqFt, spendEnroll
        // (SqFtPerEnroll, SpentPerMaxOccupancy, SpentPerSqFt, TotalAllotandPlan1621perGSF, TotalAllotandPlan1621perMaxOcc)
        // (sqftPerStudent, pastPerStudent, pastPerSqft, futurePerGSF, futurePerStudent)
        filterMenu.spendSqFt = { id:"spendSqFt", category:"expenditures", label:"/sqft", text:"per sqFt", column:"SpentPerSqFt", value:null };
        filterMenu.spendEnroll = { id:"spendEnroll", category:"expenditures", label:"/student", text:"per student", column:"SpentPerMaxOccupancy", value:null };
        filterMenu.spendAmount = { id:"spendAmount", category:"expenditures", label:"", text:"dollar amount", column:null, value:null };

        // == zones
        filterMenu.Ward = { id:"Ward", category:"zone", label:"Wards", text:"Ward", column:"Ward", value:null };
        filterMenu.FeederHS = { id:"FeederHS", category:"zone", label:"HSfeeders", text:"High School Feeder Pattern", column:"FeederHS", value:null };
        filterMenu.FeederMS = { id:"FeederMS", category:"zone", label:"MSfeeders", text:"Middle School Boundary", column:"FeederMS", value:null };
        filterMenu.Elementary = { id:"Elementary", category:"zone", label:"Elementary zones", text:"Elementary zones", column:null, value:null };

    }
    function Display() {
        console.log("Display");
        this.displayMode = null;
        this.agencyMenu = ["agency", filterMenu.District, filterMenu.Charter, filterMenu.All];
        this.levelsMenu = ["levels", filterMenu.High, filterMenu.Middle, filterMenu.Elem];
        this.expendMenu = ["expend", filterMenu.spendLifetime, filterMenu.MajorExp9815, filterMenu.spendPlanned];
        this.zonesMenu = ["zones", filterMenu.Ward, filterMenu.FeederHS, filterMenu.FeederMS, filterMenu.Elementary];
        this.expendMathMenu = ["expendMath", filterMenu.spendAmount, filterMenu.spendEnroll, filterMenu.spendSqFt];
        this.filterMenusArray = [this.agencyMenu, this.levelsMenu, this.zonesMenu, this.expendMenu];
        this.filterTitlesObject = { "agency":"All", "levels":null, "expend":null, "zones": "Ward" };
        this.filterTitlesArray = [];
        this.schoolNamesArray = [];
        this.categoryLabels = ["sector", "schools", "spending", "location"];
        this.groupLabels = ["who", "what", "when", "where"];
        this.dataFilters = { agency: "All", levels: null, expend: null, zones: "Ward", math: "spendAmount", selectedZone: null  };
    }
    function ZonesCollection() {
        console.log("ZonesCollection");
        this.zoneA = "Ward";
        this.zoneGeojson_A = null;
        this.zoneGeojson_B = null;
        this.zoneGeojson_AB = null;
        this.mapBounds = null;
        this.aggregator = {};
        this.aggregatorArray = [];
        this.mapListenersArray = [];
        this.zoneFeaturesArray = [];
        this.indexColorsArray = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];
        this.dataColorsArray = ["#b2bdc7", "#99a8b5", "#7f92a2", "#667c90", "#4c677d", "#32516a", "#193b58", "#002646"];
        this.defaultColor = "white";
        this.dataIncrement = 0;
        this.dataBins = 8;
    }
    function SchoolsCollection() {
        console.log("SchoolsCollection");
        this.dataSource = null;
        this.schoolColorsArray = [];
        this.sharedAddressArray = [];
        this.schoolMarkersArray = [];
        this.selectedSchoolsArray = [];
        this.closedSchoolsArray = [];
        this.selectedMarker = null;
        this.selectedSchool = null;
        this.jsonData = null;
        this.active = false;
    }
    function Menu() {
        console.log("Menu");
    }

    // ======= ======= ======= initDataObjects ======= ======= =======
    function initDataObjects() {
        console.log("initDataObjects");
        schoolsCollectionObj = new SchoolsCollection();
        zonesCollectionObj = new ZonesCollection();
        displayObj = new Display();
    }



    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= DISPLAY ======= ======= ======= ======= =======


    // ======= ======= ======= makeSearchAndHoverDisplay ======= ======= =======
    Display.prototype.makeSearchAndHoverDisplay = function() {
        console.log("makeSearchAndHoverDisplay");

        var filterContainer = ("#filter-container ");
        var menuHtml = "";
        this.makeColorLegend();
        menuHtml += this.makeSearchDisplay();
        menuHtml += this.makeHoverDisplay();
        $(filterContainer).append(menuHtml);
        this.activateSearchButton("searchButton");
        this.activateSearchWindow("searchWindow");
    }

    // ======= ======= ======= makeColorLegend ======= ======= =======
    Display.prototype.makeColorLegend = function() {
        console.log("makeColorLegend");
        var legendHtml = "<div id='legend'>";
        legendHtml += "<div><p class='legend-text'>District Schools</p><div class=legend-color-dcps>&nbsp;</div></div>";
        legendHtml += "<div><p class='legend-text'>Charter Schools</p><div class=legend-color-pcs>&nbsp;</div></div>";
        legendHtml += "</div>";
        $("body").append(legendHtml);
    }

    // ======= ======= ======= makeSelectBox ======= ======= =======
    Display.prototype.makeSelectBox = function(jsonData) {
        console.log("makeSelectBox");

        var selectBox = null
        var selectHtml = "<select id='school-select'>";
        var nextSchool, nextSchoolName;
        for (var i = 0; i < jsonData.length; i++ ) {
            nextSchool = jsonData[i];
            nextSchoolName = nextSchool.School;
            selectHtml += "<option value='" + nextSchoolName + "'>" + nextSchoolName + "</option>";
        }
        selectHtml += "</select>";

        var filterContainer = ("#filter-container ");
        selectBox = $("#filter-container").children("select");
        if (selectBox) {
            $(filterContainer).append(selectHtml);
            this.activateSelectBox();
        }

    }

    // ======= ======= ======= makeSearchDisplay ======= ======= =======
    Display.prototype.makeSearchDisplay = function() {
        // console.log("makeSearchDisplay");
        var searchHtml = "<div id='search' class='category'>";
        searchHtml += "<input id='searchWindow' type='text' placeholder='  school name'/ >";
        searchHtml += "<input type='button' id='searchButton' value='search'/ ></div>";
        return searchHtml;
    }

    // ======= ======= ======= makeHoverDisplay ======= ======= =======
    Display.prototype.makeHoverDisplay = function() {
        // console.log("makeHoverDisplay");
        var hoverHtml = "<div id='mouseover-text'><h2>&nbsp;</h2></div>";
        return hoverHtml;
    }

    // ======= ======= ======= makeMathSelect ======= ======= =======
    Display.prototype.makeMathSelect = function(whichMenu, chartOrProfile) {
        console.log("makeMathSelect");

        // == filter-container  bar container
        var subMenuContainer = $("#sub-nav-container");

        // == build sub-menu; attach to chart or profile div
        var nextCategory = whichMenu[0];
        if (chartOrProfile == "chart") {
            var subMenuHtml = "<select id='expendMathC' name='expendMath'>";
        } else if (chartOrProfile == "profile") {
            var subMenuHtml = "<select id='expendMathP' name='expendMath'>";
        }

        var nextItem, nextId, nextText;
        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            nextId = nextItem.id;
            nextText = nextItem.text;
            if (displayObj.dataFilters.math == nextId) {
                subMenuHtml += "<option selected='selected' value='" + nextId + "'>" + nextText + "</option>";
            } else {
                subMenuHtml += "<option value='" + nextId + "'>" + nextText + "</option>";
            }
        }
        subMenuHtml += "</select>";
        return subMenuHtml;
    }

    // ======= ======= ======= activateClearButton ======= ======= =======
    Display.prototype.activateClearButton = function() {
        console.log("activateClearButton");

        var self = this;
        $("#clear-button").fadeIn( "slow", function() {
            console.log("*** FADEIN ***");
        });

        // ======= ======= ======= selectFilter ======= ======= =======
        $("#clear-button").off("click").on("click", function(event){
            console.log("\n======= clear ======= ");

            // == clear menus (html) and filters (displayObj)
            checkFilterSelection(self, zonesCollectionObj);
            clearFilterSelctions(displayObj, zonesCollectionObj);
            clearProfileChart();
            checkFilterSelection(self, zonesCollectionObj);
            $("#searchWindow").val('');
            updateHoverText(null);

            // == load default map
            zonesCollectionObj.importZoneDataA();
        });
    }

    // ======= ======= ======= activateFilterMenus ======= ======= =======
    Display.prototype.activateFilterMenus = function() {
        console.log("activateFilterMenus");

        var nextMenu, nextFilter;

        for (var i = 0; i < this.filterMenusArray.length; i++) {
            nextMenu = this.filterMenusArray[i];
            for (var j = 1; j < nextMenu.length; j++) {
                nextFilter = nextMenu[j];
                activateFilterLink(displayObj, zonesCollectionObj, nextFilter);
            }
        }
    }

    // ======= ======= ======= activateSelectBox ======= ======= =======
    Display.prototype.activateSelectBox = function(windowId) {
        console.log("activateSelectBox");

        var self = this;
        $("#school-select").on('change',function(e){
            console.log("\nschool-select");
            if (schoolsCollectionObj.selectedMarker) {
                resetMarker(schoolsCollectionObj.selectedMarker);
                schoolsCollectionObj.selectedMarker = null;
            }
            schoolsCollectionObj.selectedSchool = null;
            $("#searchWindow").val("");
            if ($('#profile-container').find('#profile').length) {
                $("#profile-container").fadeIn( "fast", function() {
                    console.log("*** FADEIN profile-container ***");
                });
            } else {
                clearProfileChart();
            };
            findSearchSchool();
        });
    }

    // ======= ======= ======= activateSearchWindow ======= ======= =======
    Display.prototype.activateSearchWindow = function(windowId) {
        console.log("activateSearchWindow");

        $("#" + windowId).on('input',function(e){
            console.log("input");
            clearProfileChart();
        });
    }

    // ======= ======= ======= activateSearchButton ======= ======= =======
    Display.prototype.activateSearchButton = function(buttonId) {
        console.log("activateSearchButton");

        var self = this;
        var buttonElement = $("#" + buttonId);

        // ======= selectFilter =======
        $(buttonElement).off("click").on("click", function(event){
            console.log("\n======= search =======");
            findSearchSchool();
        });
        // ======= selectFilter =======
        $( window ).bind('keypress', function(event){
            if ( event.keyCode == 13 ) {
                console.log("\n======= search =======");
                findSearchSchool();
            }
        });
    }

    // ======= ======= ======= activateCloseButton ======= ======= =======
    Display.prototype.activateCloseButton = function(buttonId) {
        console.log("activateCloseButton");

        var self = this;
        var buttonElement = $("#close-X");

        // ======= selectFilter =======
        $(buttonElement).off("click").on("click", function(event){
            console.log("\n======= close =======");

            // == remove previous chart or profile html if any
            $("#profile-container").fadeOut( "fast", function() {
                    console.log("*** FADEOUT profile-container ***");
                    $("#profile").remove();
            });
            if ($('#chart-container').find('#chart').length) {
                $("#chart-container").fadeIn( "slow", function() {
                    console.log("*** FADEIN chart-container ***");
                });
            }
            if ($('#legend-container').find('#legend').length) {
                $("#legend").remove();
            }
        });
    }

    // ======= ======= ======= findSearchSchool ======= ======= =======
    function findSearchSchool() {
        console.log("findSearchSchool");

        var searchSchoolName = null;
        updateHoverText(null);
        updateFilterSelections(displayObj);
        if ($("#searchWindow").val()) {
            searchSchoolName = $("#searchWindow").val();
        } else {
            searchSchoolName = $("#school-select").val();
        }
        console.log("  searchSchoolName: ", searchSchoolName);

        var filterTitleContainer = $("#filters-selections").children("h2");
        var jsonData = schoolsCollectionObj.jsonData;
        var foundDataArray = buildSearchArray(jsonData, searchSchoolName);
        var tempSchoolText = displayFoundSchool(foundDataArray);
        var schoolText = tempSchoolText.substring(0, tempSchoolText.length - 2);
        $(filterTitleContainer).html(schoolText);
        $("#searchWindow").val("");
    }

    // ======= ======= ======= buildSearchArray ======= ======= =======
    function buildSearchArray(jsonData, searchSchoolName) {
        console.log("buildSearchArray");

        var nextSchool, schoolName;
        var foundDataArray = [];

        // ======= search school data by name =======
        for (var i = 0; i < jsonData.length; i++) {
            nextSchool = jsonData[i];
            schoolName = nextSchool.School;
            if (schoolName) {
                var checkSchool = schoolName.indexOf(searchSchoolName);
                if (checkSchool > -1) {
                    foundDataArray.push([i, nextSchool]);
                }
            }
        }
        return foundDataArray;
    }

    // ======= ======= ======= displayFoundSchool ======= ======= =======
    function displayFoundSchool(foundDataArray) {
        console.log("displayFoundSchool");

        var filterTitleContainer = $("#filters-selections").children("h2");
        var schoolText, hoverText, nextSchool, nextSchoolName;

        // == display found school name or "no data" message
        if (foundDataArray.length > 0) {

            // == more than one school matches search
            if (foundDataArray.length > 1) {
                $(filterTitleContainer).css("font-size", "14px");
                schoolText = "<span class='filterLabel'>Multiple schools: </span>";
                hoverText = "<span class='filterLabel'>Multiple schools found. </span>Re-enter choice from options above map.";
                updateHoverText(hoverText);

            // == single school matches search
            } else {
                displayObj.activateClearButton();
                makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, foundDataArray[0][1]);
                hiliteSchoolMarker(schoolsCollectionObj, foundDataArray[0][0]);
                updateHoverText(null);
                $(filterTitleContainer).css("font-size", "16px");
                schoolText = "<span class='filterLabel'>Your school: </span>";
                $("#profile-container").css("display", "table");
            }

            // == change to display mode
            $(filterTitleContainer).addClass("filterList");

            // == create autoComplete array, save on display object
            var schoolNamesArray = [];
            for (var i = 0; i < foundDataArray.length; i++) {
                nextSchool = foundDataArray[i][1];
                nextSchoolName = nextSchool.School;
                schoolText += nextSchoolName + ", ";
                schoolNamesArray.push(nextSchoolName);
            }
            displayObj.dataFilters.selectedSchool = schoolNamesArray;
        } else {
            $(filterTitleContainer).addClass("filterList");
            schoolText = "No data.  Please try again.  ";
        }
        return schoolText;
    }


    // ======= ======= ======= ======= ======= AJAX DATA ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= AJAX DATA ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= AJAX DATA ======= ======= ======= ======= =======

    // ======= ======= ======= importZoneDataA ======= ======= =======
    ZonesCollection.prototype.importZoneDataA = function() {
        console.log("\n----- importZoneDataA -----");

        var self = this;
        var selectedZonesArray = getZoneUrls(displayObj, zonesCollectionObj);
        var urlA = selectedZonesArray[0];
        var urlB = selectedZonesArray[1];
        var feederFlag = selectedZonesArray[2];

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: urlA
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            self.zoneGeojson_A = geoJsonData;
            console.dir(geoJsonData);

            // == get secondary map data for urlB
            if (feederFlag == true) {
                self.importZoneDataB(urlB);
            } else {
                self.makeZoneLayer();
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= importZoneDataB ======= ======= =======
    ZonesCollection.prototype.importZoneDataB = function(urlB) {
        console.log("\n----- importZoneDataB -----");

        var featuresA, featuresB, featuresAll;
        var self = this;

        $.ajax({
            dataType: "json",
            url: urlB
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            self.zoneGeojson_B = geoJsonData;
            featuresA = self.zoneGeojson_A.features;
            featuresB = self.zoneGeojson_B.features;
            featuresAll = featuresB.concat(featuresA);
            mergedGeojsonData = {
                "type": "FeatureCollection",
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": featuresAll
            }
            self.zoneGeojson_AB = mergedGeojsonData;
            console.log("******* geoJson *******");
            console.dir(self.zoneGeojson_A);
            console.dir(self.zoneGeojson_B);
            console.dir(self.zoneGeojson_AB);
            self.makeZoneLayer();

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= importSchoolData ======= ======= =======
    SchoolsCollection.prototype.importSchoolData = function() {
        console.log("\n----- importSchoolData -----");

        var self = this;
        var url = "https://rawgit.com/codefordc/school-modernization/master/Output%20Data/DCSchools_FY1415_Master_412.csv";

        // ======= get selected data =======
        $.ajax({
            url: url,
            method: "GET",
            dataType: "text"
        }).done(function(textData) {
            console.log("*** ajax success ***");
            jsonData = CSV2JSON(textData);
            console.dir(jsonData);
            self.jsonData = jsonData;
            displayObj.makeSelectBox(jsonData);
            displayObj.makeSearchAndHoverDisplay();

            // == get school names
            displayObj.schoolNamesArray = [];
            for (var i = 0; i < jsonData.length - 1; i++) {
                nextSchool = jsonData[i];
                if (nextSchool) {
                    displayObj.schoolNamesArray.push(processSchoolName(nextSchool.School))
                }
            }
            initAutoComplete(displayObj);
            zonesCollectionObj.importZoneDataA();

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }



    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======

    ZonesCollection.prototype.makeZoneLayer = function() {
        console.log("\n----- makeZoneLayer -----");

        var self = this;
        var itemOpacity = 0.5;
        var strokeColor = "purple";
        var strokeWeight = 2;
        var itemColor, itemOpacity, centerLatLng, zoneName;

        // ======= ======= ======= cleanup ======= ======= =======
        de_activateZoneListeners(this);
        map.data.forEach(function(feature) {
            if (feature) {
                zoneName = feature.getProperty('zoneName');
                map.data.remove(feature);
            }
        });
        this.zoneFeaturesArray = [];

        // ======= ======= ======= add single or merged geoJson to map ======= ======= =======
        zoneAcount = this.zoneGeojson_A.features.length;
        if (this.zoneGeojson_AB) {
            map.data.addGeoJson(this.zoneGeojson_AB);
            zoneBcount = this.zoneGeojson_B.features.length;
            zoneABcount = this.zoneGeojson_AB.features.length;
        } else {
            map.data.addGeoJson(this.zoneGeojson_A);
            zoneBcount = 0;
        }
        console.log("  zoneAcount: ", zoneAcount);
        console.log("  zoneBcount: ", zoneBcount);
        console.log("  zoneABcount: ", zoneBcount);

        // ======= ======= ======= ZONE AGGREGATOR ======= ======= =======
        zonesCollectionObj.zoneFeaturesArray = makeZoneFeatures();
        var zoneSchoolsArray = makeZonePartitions();
        addZonePartitions(zoneSchoolsArray);
        schoolsCollectionObj.selectedSchoolsArray = selectFilteredSchools(zoneSchoolsArray);

        // ======= make map layers ======
        if (schoolsCollectionObj.selectedSchoolsArray.length > 0) {
            schoolsCollectionObj.makeSchoolLayer();
            partitionSelectedSchools(zoneSchoolsArray);
            var zoneTotalsObject = aggregateAllZones(zoneSchoolsArray);
            zonesCollectionObj.aggregator = zoneTotalsObject;
            zonesCollectionObj.aggregatorArray = zoneObjectToArray(zoneTotalsObject);
            // console.log("  ...selectedSchoolsArray: ", schoolsCollectionObj.selectedSchoolsArray);
            console.log("  ...zoneFeaturesArray: ", zonesCollectionObj.zoneFeaturesArray);
            console.log("  ...aggregator: ", zonesCollectionObj.aggregator);
            console.log("  ...aggregatorArray: ", zonesCollectionObj.aggregatorArray);
            setDataIncrement();
            formatZoneFeatures(zoneBcount);
        } else {
            displayFilterMessage("Sorry, no schools matched criteria.  Click CLEAR");
            clearProfileChart();
        }

        // ======= ======= ======= show rankings chart ======= ======= =======
        if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
            if (displayObj.dataFilters.expend) {
                makeRankChart(zonesCollectionObj, schoolsCollectionObj, displayObj, zoneBcount);
            }
        }
    }

    // ======= ======= ======= setZoneProperties ======= ======= =======
    function setZoneProperties(whichLayer, featureIndex) {
        // console.log("setZoneProperties");
        feature = zonesCollectionObj.zoneFeaturesArray[featureIndex];
        nextName = feature.getProperty('zoneName');

        // [itemColor, strokeColor, strokeWeight, itemOpacity];
        zoneFormatArray = getZoneFormat(zonesCollectionObj, displayObj, featureIndex, nextName, whichLayer);
        feature.setProperty('itemColor', zoneFormatArray[0]);
        feature.setProperty('strokeColor', zoneFormatArray[1]);
        feature.setProperty('strokeWeight', zoneFormatArray[2]);
        feature.setProperty('itemOpacity', zoneFormatArray[3]);
        setFeatureStyle(feature);
    }

    // ======= ======= ======= setFeatureStyle ======= ======= =======
    function setFeatureStyle(feature) {
        // console.log("setFeatureStyle");

        // ======= colorize each feature based on colorList =======
        map.data.setStyle(function(feature) {
            var nextColor = feature.getProperty('itemColor');
            var strokeColor = feature.getProperty('strokeColor');
            var strokeWeight = feature.getProperty('strokeWeight');
            var nextOpacity = feature.getProperty('itemOpacity');
            return {
              fillColor: nextColor,
              strokeColor: strokeColor,
              strokeWeight: strokeWeight,
              fillOpacity: nextOpacity
            };
        });
    }

    // ======= ======= ======= addZonePartitions ======= ======= =======
    function addZonePartitions(zoneSchools) {
        console.log("addZonePartitions");
        if (displayObj.dataFilters.zones == "FeederHS") {
            zoneSchools.CityWide = [];
        }
    }

    // ======= ======= ======= formatZoneFeatures ======= ======= =======
    function formatZoneFeatures(zoneBcount) {
        console.log("formatZoneFeatures");
        console.log("  zoneBcount: ", zoneBcount);

        // == format zone "layers" independently
        if (zoneBcount > 0) {
            var featureIndex = -1;

            // == elementary or middle school zones in feeder areas
            console.log("*** LOWER ZONES ***");
            for (var i = 0; i < zoneBcount; i++) {
                featureIndex++;
                setZoneProperties("lower", i);
            }

            // == feeder zones or wards
            console.log("*** UPPER ZONES ***");
            for (var i = zoneBcount; i < zonesCollectionObj.zoneFeaturesArray.length; i++) {
                featureIndex++;
                zoneAIndex = featureIndex - zoneBcount;
                setZoneProperties("upper", zoneAIndex);
            }

        // == format single zone layer
        } else {
            zonesCollectionObj.zoneFeaturesArray.forEach(function(feature) {
                var zoneName = feature.getProperty('NAME');
                var featureIndex = feature.getProperty('featureIndex');

                // == build map feature if not "City-Wide"
                if (zoneName != "CityWide") {
                    setZoneProperties("single", featureIndex);
                }
            });
        }
    }

    // ======= ======= ======= setDataIncrement ======= ======= =======
    function setDataIncrement(schoolsInZone, zoneDataObject, zoneTotals) {
        console.log("setDataIncrement");
        if (displayObj.dataFilters.expend) {
            zonesCollectionObj.dataIncrement = calcDataIncrement(zonesCollectionObj, displayObj);
        }
    }

    // ======= ======= ======= zoneObjectToArray ======= ======= =======
    function zoneObjectToArray(zoneTotalsObject) {
        console.log("zoneObjectToArray");
        var dataCheckString = "     past     future     total \n";
        var zoneDataObject;
        var aggregatorArray = _.map(zoneTotalsObject, function(value, key){
            zoneDataObject = {
                featureIndex:value.featureIndex,
                zoneName:value.zoneName,
                schoolCount:value.schoolCount,
                SqFtPerEnroll:value.SqFtPerEnroll,

                zoneAmount:value.zoneAmount,
                amountMin:value.amountMin,
                amountMax:value.amountMax,
                amountAvg:parseInt(value.zoneAmount/value.schoolCount),
                amountMed:value.amountMed,

                zonePastPerEnroll:value.zonePastPerEnroll,
                zoneFuturePerEnroll:value.zoneFuturePerEnroll,
                zoneTotalPerEnroll:value.zoneTotalPerEnroll,
                zoneEnroll:value.zoneEnroll,
                enrollMin:value.enrollMin,
                enrollMax:value.enrollMax,
                enrollAvg:parseInt(value.zoneEnroll/value.schoolCount),
                enrollMed:value.enrollMed,

                zonePastPerSqft:value.zonePastPerSqft,
                zoneFuturePerSqft:value.zoneFuturePerSqft,
                zoneTotalPerSqft:value.zoneTotalPerSqft,
                zoneSqft:value.zoneSqft,
                sqftMin:value.sqftMin,
                sqftMax:value.sqftMax,
                sqftAvg:parseInt(value.zoneSqft/value.schoolCount),
                sqftMed:value.sqftMed
            }

            // == Enroll
            // dataCheckString += value.zoneName + ": " + value.zoneAmount + "\n";

            // == Enroll
            // dataCheckString += value.zoneName + ": " + value.zonePastPerEnroll + ": " + value.zoneFuturePerEnroll + ": " + value.zoneTotalPerEnroll + "\n";

            // == Sqft
            // dataCheckString += value.zoneName + ": " + value.zonePastPerSqft + ": " + value.zoneFuturePerSqft + ": " + value.zoneTotalPerSqft + "\n";

            // console.log(key, " value: ", value);
            // console.log(key, ":", value.zoneAmount);
            // console.log(key, " zoneDataObject: ", zoneDataObject);
            //
            // console.log(key, " featureIndex: ", value.featureIndex);
            // console.log(key, "*** zoneName: ", value.zoneName);
            // console.log(key, " schoolCount: ", value.schoolCount);
            // console.log(key, " SqFtPerEnroll: ", value.SqFtPerEnroll);
            // console.log(key, " zoneAmount: ", value.zoneAmount);
            // console.log(key, " amountMin: ", value.amountMin);
            // console.log(key, " amountMax: ", value.amountMax);
            // console.log(key, " amountAvg: ", value.amountAvg);
            // console.log(key, " amountMed: ", value.amountMed);
            // console.log(key, " zonePastPerEnroll: " value.zonePastPerEnroll);
            // console.log(key, " zoneFuturePerEnroll: ", value.zoneFuturePerEnroll);
            // console.log(key, " zoneTotalPerEnroll: ", value.zoneTotalPerEnroll);
            // console.log(key, " zoneEnroll: ", value.zoneEnroll);
            // console.log(key, " enrollMin: ", value.enrollMin);
            // console.log(key, " enrollMax: ", value.enrollMax);
            // console.log(key, " enrollAvg: ", value.enrollAvg);
            // console.log(key, " enrollMed: ", value.enrollMed);
            // console.log(key, " zonePastPerSqft: ", value.zonePastPerSqft);
            // console.log(key, " zoneFuturePerSqft: ", value.zoneFuturePerSqft);
            // console.log(key, " zoneTotalPerSqft: ", value.zoneTotalPerSqft);
            // console.log(key, " zoneSqft: ", value.zoneSqft);
            // console.log(key, " sqftMin: ", value.sqftMin);
            // console.log(key, " sqftMax: ", value.sqftMax);
            // console.log(key, " sqftAvg: ", value.sqftAvg);
            // console.log(key, " sqftMed: ", value.sqftMed);

            return zoneDataObject;
        });
        console.log(dataCheckString);
        return aggregatorArray;
    }

    // ======= ======= ======= aggregateEachZone ======= ======= =======
    function aggregateEachZone(schoolsInZone, zoneDataObject, zoneTotals) {
        // console.log("aggregateEachZone");
        var amountNAarray = [];
        var zeroAmountArray = [];
        var expendFilter = displayObj.dataFilters.expend;

        schoolsInZone.forEach(function(school, index) {

            // ======= ======= ======= EXPENDITURE (past/future/total) ======= ======= =======
            if (school[expendFilter] != "NA") {
                zoneDataObject.zoneAmount += parseInt(school[expendFilter]);
                // zoneDataObject.zonePast += parseInt(school.MajorExp9815);
                // zoneDataObject.zoneFuture += parseInt(school.TotalAllotandPlan1621);
                // zoneDataObject.zoneTotal += parseInt(school.LifetimeBudget);

                // == calculate past/future/total median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var amountMed = (parseInt(schoolA[expendFilter]) + parseInt(schoolB[expendFilter]))/2;
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var amountMed = parseInt(schoolA[expendFilter]);
                    }
                    zoneDataObject.amountMed = parseInt(amountMed);
                }

                // == calculate past/future/total min/max
                if (parseInt(school[expendFilter]) > zoneDataObject.amountMax) {
                    zoneDataObject.amountMax = parseInt(school[expendFilter]);
                }
                if (index == 0) {
                    zoneDataObject.amountMin = parseInt(school[expendFilter]);
                } else {
                    if (parseInt(school[expendFilter]) <= zoneDataObject.amountMin) {
                        zoneDataObject.amountMin = parseInt(school[expendFilter]);
                    }
                }
            } else if (school[expendFilter] == "NA"){
                // console.log("  NA index: ", school.schoolIndex);
                amountNAarray.push(school);
            } else {
                // console.log("  0 VALUE index: ", school.schoolIndex);
                zeroAmountArray.push(school);
            }

            // ======= ======= ======= ENROLLMENT ======= ======= =======
            if (school.schoolEnroll != "NA") {
                zoneDataObject.zoneEnroll += parseInt(school.schoolEnroll);

                // == calculate enrollment median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var enrollMed = (parseInt(schoolA.schoolEnroll) + parseInt(schoolB.schoolEnroll))/2;
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var enrollMed = parseInt(schoolA.schoolEnroll);
                    }
                    zoneDataObject.enrollMed = enrollMed;
                }

                // == calculate enrollment min/max
                if (parseInt(school.schoolEnroll) > zoneDataObject.enrollMax) {
                    zoneDataObject.enrollMax = parseInt(school.schoolEnroll);
                }
                if (index == 0) {
                    zoneDataObject.enrollMin = parseInt(school.schoolEnroll);
                } else {
                    if (parseInt(school.schoolEnroll) <= zoneDataObject.enrollMin) {
                        zoneDataObject.enrollMin = parseInt(school.schoolEnroll);
                    }
                }
            } else if (school.schoolEnroll == "NA"){
                // console.log("  NA index: ", index);
            } else {
                // console.log("  0 VALUE index: ", index);
            }
            if (school.SpentPerMaxOccupancy != "NA") {
                zoneDataObject.zonePastPerEnroll += parseInt(school.SpentPerMaxOccupancy);
            }
            if (school.TotalAllotandPlan1621perMaxOcc != "NA") {
                zoneDataObject.zoneFuturePerEnroll += parseInt(school.TotalAllotandPlan1621perMaxOcc);
            }
            if (school.LifetimeBudgetperMaxOcc != "NA") {
                zoneDataObject.zoneTotalPerEnroll += parseInt(school.LifetimeBudgetperMaxOcc);
            }

            // ======= ======= ======= SQFT ======= ======= =======
            if (school.schoolSqft != "NA") {
                zoneDataObject.zoneSqft += parseInt(school.schoolSqft);

                // == calculate sqft median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var sqftMed = (parseInt(schoolA.schoolSqft) + parseInt(schoolB.schoolSqft))/2;
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var sqftMed = parseInt(schoolA.schoolSqft);
                    }
                    zoneDataObject.sqftMed = sqftMed;
                }

                // == calculate sqft min/max
                if (parseInt(school.schoolSqft) > zoneDataObject.sqftMax) {
                    zoneDataObject.sqftMax = parseInt(school.schoolSqft);
                }
                if (index == 0) {
                    zoneDataObject.sqftMin = parseInt(school.schoolSqft);
                } else {
                    if (parseInt(school.schoolSqft) <= zoneDataObject.sqftMin) {
                        zoneDataObject.sqftMin = parseInt(school.schoolSqft);
                    }
                }
            } else if (school.schoolSqft == "NA"){
                // console.log("  NA index: ", index);
            } else {
                // console.log("  0 VALUE index: ", index);
            }
            if (school.SpentPerSqFt != "NA") {
                zoneDataObject.zonePastPerSqft += parseInt(school.SpentPerSqFt);
            }
            if (school.TotalAllotandPlan1621perGSF != "NA") {
                zoneDataObject.zoneFuturePerSqft += parseInt(school.TotalAllotandPlan1621perGSF);
            }
            if (school.LifetimeBudgetperGSF != "NA") {
                zoneDataObject.zoneTotalPerSqft += parseInt(school.LifetimeBudgetperGSF);
            }
        });
        // console.dir(zoneDataObject);
        zoneTotals[zone] = zoneDataObject;
    }

    // ======= ======= ======= aggregateAllZones ======= ======= =======
    function aggregateAllZones(zoneSchools) {
        // console.log("aggregateAllZones");
        var featureIndex = -1;
        var zoneTotals = {};
        for (zone in zoneSchools) {
            // console.log("*** zone: ", zone);
            featureIndex++;
            // featureIndex, zoneName, schoolCount, SqFtPerEnroll
            // zoneAmount, amountMin, amountMax, amountAvg, amountMed
            // zonePastPerEnroll, zoneFuturePerEnroll, zoneTotalPerEnroll, zoneEnroll, enrollMin, enrollMax, enrollAvg, enrollMed
            // zonePastPerSqft, zoneFuturePerSqft, zoneTotalPerSqft, zoneSqft, sqftMin, sqftMax, sqftAvg, sqftMed
            var zoneDataObject = {
                featureIndex: featureIndex,
                zoneName: zone,
                schoolCount: zoneSchools[zone].length,
                SqFtPerEnroll: 0,

                zoneAmount: 0,
                amountMin: 0,
                amountMax: 0,
                amountAvg: 0,
                amountMed: 0,

                zonePastPerEnroll: 0,
                zoneFuturePerEnroll: 0,
                zoneTotalPerEnroll: 0,
                zoneEnroll: 0,
                enrollMin: 0,
                enrollMax: 0,
                enrollAvg: 0,
                enrollMed: 0,

                zonePastPerSqft: 0,
                zoneFuturePerSqft: 0,
                zoneTotalPerSqft: 0,
                zoneSqft: 0,
                sqftMin: 0,
                sqftMax: 0,
                sqftAvg: 0,
                sqftMed: 0
            };
            var schoolsInZone = zoneSchools[zone];
            aggregateEachZone(schoolsInZone, zoneDataObject, zoneTotals);
        }
        return zoneTotals;
    }

    // ======= ======= ======= partitionSelectedSchools ======= ======= =======
    function partitionSelectedSchools(zoneSchools) {
        console.log("partitionSelectedSchools");
        var partitionKey = displayObj.dataFilters.zones;
        schoolsCollectionObj.selectedSchoolsArray.forEach(function(school) {
            var zone = school[partitionKey];
            var zoneName = standardizeZoneName(zone);
            if ((zoneName) && (zoneName != "NA")) {
                zoneSchools[zoneName].push(school);
            }
        });
    }

    // ======= ======= ======= selectFilteredSchools ======= ======= =======
    function selectFilteredSchools() {
        console.log("selectFilteredSchools");
        var selectedSchoolsArray = [];
        var jsonData = schoolsCollectionObj.jsonData;
        for (var i = 0; i < (jsonData.length - 1); i++) {
            schoolIndex = i;
            nextSchool = jsonData[i];
            selectedSchool = checkFilterMatch(nextSchool);

            // == build arrays of selected/not selected schools
            if (selectedSchool == true) {
                schoolData = getDataDetails(nextSchool, schoolIndex);
                selectedSchoolsArray.push(schoolData);
            }
        }
        return selectedSchoolsArray;
    }

    // ======= ======= ======= makeZonePartitions ======= ======= =======
    function makeZonePartitions() {
        console.log("makeZonePartitions");
        var zones = {};
        map.data.forEach(function(feature) {
            zoneName = removeAbbreviations(feature.getProperty('NAME'))
            if (!zones[zoneName]) {
                zones[zoneName] = [];
            }
        });
        return zones;
    }

    // ======= ======= ======= makeZoneFeatures ======= ======= =======
    function makeZoneFeatures() {
        console.log("makeZoneFeatures");
        var featureIndex = -1;
        var zoneFeaturesArray = [];
        map.data.forEach(function(feature) {
            featureIndex++;
            zoneName = removeAbbreviations(feature.getProperty('NAME'))
            centerLatLng = makeZoneGeometry(feature);
            feature.setProperty('center', centerLatLng);
            feature.setProperty('zoneName', zoneName);
            feature.setProperty('featureIndex', featureIndex);
            zoneFeaturesArray.push(feature);
        });
        return zoneFeaturesArray;
    }

    // ======= ======= ======= checkFilterMatch ======= ======= =======
    function checkFilterMatch(nextSchool) {
        console.log("checkFilterMatch");

        var checkAgency = false;
        var agencyMatch, levelsMatch;

        // == check agency match (DCPS, PCS)
        if (displayObj.dataFilters.agency) {
            if (displayObj.dataFilters.agency != "All") {
                if (displayObj.dataFilters.agency == "District") {
                    checkAgency = "DCPS";
                } else if (displayObj.dataFilters.agency == "Charter") {
                    checkAgency = "PCS";
                }
                if (checkAgency == nextSchool.Agency) {
                    agencyMatch = true;
                } else {
                    agencyMatch = false;
                }
            } else {
                agencyMatch = true;
            }
        } else {
            agencyMatch = true;
        }

        // == check levels match (HS, ADULT, MS/HS, ALT; MS, SPED; ES, ES/MS; CLOSED)
        if (displayObj.dataFilters.levels) {
            if (displayObj.dataFilters.levels == "HS") {
                levelFilter = ["HS", "ADULT", "MS/HS", "ALT"];
                var checkLevel = levelFilter.indexOf(nextSchool.Level);
                if (checkLevel > -1) {
                    levelsMatch = true;
                }
            } else if (displayObj.dataFilters.levels == "MS") {
                levelFilter = ["MS", "SPED"];
                var checkLevel = levelFilter.indexOf(nextSchool.Level);
                if (checkLevel > -1) {
                    levelsMatch = true;
                }
            } else if (displayObj.dataFilters.levels == "ES") {
                levelFilter = ["ES", "ES/MS", "PK3-K"];
                var checkLevel = levelFilter.indexOf(nextSchool.Level);
                if (checkLevel > -1) {
                    levelsMatch = true;
                }
            }
        } else {
            levelsMatch = true;
        }

        if (nextSchool.Level == "CLOSED") {
            levelsMatch = true;
        }

        // == return match result
        if ((levelsMatch == true) && (agencyMatch == true)) {
            return true;
        } else {
            return false;
        }
    }

    // ======= ======= ======= standardizeZoneName ======= ======= =======
    function standardizeZoneName(zone) {
        // console.log("standardizeZoneName");
        if (displayObj.dataFilters.zones == "Ward") {
            var zoneName = "Ward " + zone;
        } else if (displayObj.dataFilters.zones == "FeederHS") {
            var feederFlag = zone.indexOf(" HS");
            if (feederFlag > -1) {
                zoneName = zone.slice(0,feederFlag);
            }
            if (zone == "City-Wide") {
                var zoneName = "CityWide";
            }
        }
        return zoneName;
    }



    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======

    // ======= ======= ======= makeSchoolLayer ======= ======= =======
    SchoolsCollection.prototype.makeSchoolLayer = function(closedSchoolsArray) {
        console.log("\n----- makeSchoolLayer -----");

        var self = this;

        // ======= clear existing listeners if any =======
        removeMarkers(this);

        // == get data to load on markers
        for (var i = 0; i < this.selectedSchoolsArray.length; i++) {
            nextSchoolData = this.selectedSchoolsArray[i];
            schoolMarker = null;
            nextSchool = nextSchoolData.schoolName;
            nextSchoolCode = nextSchoolData.schoolCode;
            nextSchoolType = nextSchoolData.schoolAgency;
            nextSchoolLevel = nextSchoolData.schoolLevel;
            nextSchoolIndex = i;
            nextSchoolAddress = nextSchoolData.schoolAddress;
            nextLat = nextSchoolData.schoolLAT;
            nextLng = nextSchoolData.schoolLON;
            schoolLoc = new google.maps.LatLng(nextLat, nextLng);

            // == set color of school circle
            if (nextSchoolType == "DCPS") {
                fillColor = "#7aa25c";
                strokeColor = "black";
            } else if (nextSchoolType == "PCS") {
                fillColor = "orange";
                strokeColor = "crimson ";
            }
            if (nextSchoolLevel == "CLOSED") {
                fillColor = "white";
                strokeColor = "crimson ";
            }

            // == show markers for available data
            var iconSize = 0.2;
            var icon = {
                path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                fillColor: fillColor,
                strokeColor: strokeColor,
                fillOpacity: 1,
                strokeWeight: 1,
                scale: iconSize
            }

            var schoolMarker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: nextSchool,
                draggable: false,
                position: schoolLoc,
                schoolIndex: nextSchoolIndex,
                schoolName: nextSchool,
                schoolLevel: nextSchoolLevel,
                schoolCode: nextSchoolCode,
                schoolType: nextSchoolType,
                schoolAddress: nextSchoolAddress,
                defaultColor: fillColor
            });
            schoolMarker.setMap(map);

            // == store marker on chart object
            this.schoolMarkersArray.push(schoolMarker);

            // == activate marker mouseover/mouseout
            this.activateSchoolMarker(schoolMarker, true);
        }
    }

    // ======= ======= ======= activateSchoolMarker ======= ======= =======
    SchoolsCollection.prototype.activateSchoolMarker = function(schoolMarker, mouseClick) {
        // console.log("activateSchoolMarker");

        // ======= mouseover event listener =======
        google.maps.event.addListener(schoolMarker, 'mouseover', function (event) {
            // console.log("--- mouseover ---");
            var schoolIndex = this.schoolIndex;
            var schoolName = this.schoolName;
            var schoolType = this.schoolType;
            updateHoverText(schoolName, schoolType);
        });

        // ======= mouseout event listener =======
        google.maps.event.addListener(schoolMarker, 'mouseout', function (event) {
            // console.log("--- mouseout ---");
            updateHoverText(null);
        });

        // ======= click event listener =======
        if (mouseClick == true) {
            google.maps.event.addListener(schoolMarker, 'click', function (event) {
                console.log("--- click ---");
                makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, null, this);
            });
        }
    }

    // ======= ======= ======= setFilterSelections ======= ======= =======
    function setFilterSelections(agency, levels, expend, zones, math, presetMode) {
        console.log("******* setFilterSelections *******");

        // == pre-defined filter settings for introductory map displays
        displayObj.displayMode = presetMode;
        clearFilterSelctions(displayObj, zonesCollectionObj);
        updateHoverText(null);
        initMap(zonesCollectionObj, displayObj);

        // == agency
        if (agency) {
            displayObj.dataFilters.agency = agency;
            if (zonesCollectionObj.aggregatorArray.length > 0) {
                zonesCollectionObj.aggregatorArray = [];
                // clearZoneAggregator();
            }
        }

        // == levels
        if (levels) {
            displayObj.dataFilters.levels = levels;
            zonesCollectionObj.aggregatorArray = [];
            if (levels == "HS") {
                zonesCollectionObj.zoneA = "FeederHS";
            } else if (levels == "MS") {
                zonesCollectionObj.zoneA = "FeederMS";
            } else if (levels == "ES") {
                zonesCollectionObj.zoneA = "Elementary";
            } else {
                zonesCollectionObj.zoneA = "Ward";
            }
        }

        // == expend
        if (expend) {
            displayObj.dataFilters.expend = expend;
            if (zonesCollectionObj.aggregatorArray.length > 0) {
                clearZoneAggregator();
            }
        }

        // == zones
        if (zones) {
            zonesCollectionObj.zoneA = zones;
            displayObj.dataFilters.zones = zones;
            zonesCollectionObj.aggregatorArray = [];
        }

        // == math
        if (math) {
            console.log("math filter");
            displayObj.dataFilters.math = math;
        }

        updateHoverText(null);
        checkFilterSelection(displayObj, zonesCollectionObj);
        zonesCollectionObj.importZoneDataA();
    }



    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======

    initMenuObjects();
    initDataObjects();
    displayObj.displayMode = presetMode;
    initMap(zonesCollectionObj, displayObj);

    this.jsonData = null;
    displayObj.activateFilterMenus();
    displayObj.activateClearButton();
    setMenuState(displayObj, displayObj.agencyMenu, ["A", "A", "S"]);
    setMenuState(displayObj, displayObj.zonesMenu, ["S", "A", "A"]);
    schoolsCollectionObj.importSchoolData();
    checkFilterSelection(displayObj, zonesCollectionObj, "init");

    // == see importZoneDataA for parameter values
    return setFilterSelections;
}
