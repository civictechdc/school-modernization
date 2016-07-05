
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
        this.zoneA = "Ward";       // FeederHS, FeederMS, Elementary, Ward, Quadrant
        this.zoneGeojson_A = null;         // geojson data
        this.zoneGeojson_B = null;       // geojson data
        this.zoneGeojson_AB = null;       // geojson data
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
        this.selectedSchool = null;
        this.jsonData = null;         // geojson data
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
            zonesCollectionObj.getZoneData();
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

    // ======= ======= ======= activateSelectBox ======= ======= =======
    Display.prototype.activateSelectBox = function(windowId) {
        console.log("activateSelectBox");

        var self = this;
        $("#school-select").on('change',function(e){
            console.log("school-select");
            $("#searchWindow").val("");
            if ($('#profile-container').find('#profile').length) {
                $("#profile-container").fadeIn( "fast", function() {
                    console.log("*** FADEIN profile-container ***");
                });
            } else {
                clearProfileChart();
            };
            self.findSearchSchool();
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

    // ======= ======= ======= activateSearchButton ======= ======= =======
    Display.prototype.activateSearchButton = function(buttonId) {
        console.log("activateSearchButton");

        var self = this;
        var buttonElement = $("#" + buttonId);

        // ======= selectFilter =======
        $(buttonElement).off("click").on("click", function(event){
            console.log("\n======= search =======");
            self.findSearchSchool();
        });
        // ======= selectFilter =======
        $( window ).bind('keypress', function(event){
            if ( event.keyCode == 13 ) {
                console.log("\n======= search =======");
                self.findSearchSchool();
            }
        });
    }

    // ======= ======= ======= findSearchSchool ======= ======= =======
    Display.prototype.findSearchSchool = function() {
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
                hiliteSchoolMarker(schoolsCollectionObj, foundDataArray);
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


    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======

    // ======= ======= ======= getZoneData ======= ======= =======
    ZonesCollection.prototype.getZoneData = function() {
        console.log("\n----- getZoneData -----");

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
                self.getFeederZones(urlB);
            } else {
                schoolsCollectionObj.processSchoolData();
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= getFeederZones ======= ======= =======
    ZonesCollection.prototype.getFeederZones = function(urlB) {
        console.log("\n----- getFeederZones -----");

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
            schoolsCollectionObj.processSchoolData();

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }


    // ======= ======= ======= ======= ======= SCHOOLS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SCHOOLS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SCHOOLS ======= ======= ======= ======= =======

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
            zonesCollectionObj.getZoneData();

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= processSchoolData ======= ======= =======
    SchoolsCollection.prototype.processSchoolData = function() {
        console.log("\n----- processSchoolData -----");

        // ======= variables and temp arrays =======
        var jsonData = this.jsonData;
        // var closedSchoolsArray = [];
        var selectedSchoolsArray = [];
        var rejectedSchoolsArray = [];
        var rejectedAggregatorArray = [];
        var nextSchool, filteredSchools, selectedSchool, schoolData;
        var rejectedAggregatorCode;

        // == filters
        var partitionKey = displayObj.dataFilters.zones;
        var expendFilter = displayObj.dataFilters.expend;

        // ======= SCHOOL DATA LOOP =======
        for (var i = 0; i < (jsonData.length - 1); i++) {
            schoolIndex = i;
            nextSchool = jsonData[i];
            selectedSchool = this.checkFilterMatch(nextSchool);

            // == build arrays of selected/not selected schools
            if (selectedSchool == true) {
                schoolData = getDataDetails(nextSchool, schoolIndex);
                selectedSchoolsArray.push(schoolData);
            } else {
                rejectedSchoolsArray.push(schoolData);
            }
        }
        this.selectedSchoolsArray = selectedSchoolsArray;
        var aggregatedValues = aggregateZoneData(displayObj, zonesCollectionObj, selectedSchoolsArray, partitionKey, expendFilter);
        zonesCollectionObj.aggregator = aggregatedValues;
        console.dir(aggregatedValues);
        console.log("  selectedSchoolsArray: ", selectedSchoolsArray.length);
        console.log("  rejectedSchoolsArray: ", rejectedSchoolsArray.length);
        console.log("  rejectedAggregatorArray: ", rejectedAggregatorArray.length);


        // ======= make map layers ======
        if (selectedSchoolsArray.length > 0) {
            zonesCollectionObj.makeZoneLayer();
            this.makeSchoolLayer();
        } else {
            displayFilterMessage("Sorry, no schools matched criteria.  Click CLEAR");
            clearProfileChart();
        }
    }

    // ======= ======= ======= checkFilterMatch ======= ======= =======
    SchoolsCollection.prototype.checkFilterMatch = function(nextSchool) {
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
        } else {
            map.data.addGeoJson(this.zoneGeojson_A);
            zoneBcount = 0;
        }

        // ======= ======= ======= AGGREGATOR OBJECT-to-ARRAY/CALC AVG ======= ======= =======
        var zoneDataObject;
        var zoneIndex = -1;
        console.log(" this.aggregator: ", this.aggregator);

        var aggregatorArray = _.map(zonesCollectionObj.aggregator, function(value, key){
            zoneDataObject = {
                featureIndex:null,
                zoneIndex:value.zoneIndex,
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

            // console.log(key, " value: ", value);
            // console.log(key, ":", value.zoneAmount);
            // console.log(key, " zoneDataObject: ", zoneDataObject);

            // console.log(key, " featureIndex: ", value.featureIndex);
            // console.log(key, " zoneIndex: ", value.zoneIndex);
            // console.log(key, " zoneName: ", value.zoneName);
            // console.log(key, " schoolCount: ", value.schoolCount);
            // console.log(key, " SqFtPerEnroll: ", value.SqFtPerEnroll);
            // console.log(key, " zoneAmount: ", value.zoneAmount);
            // console.log(key, " amountMin: ", value.amountMin);
            // console.log(key, " amountMax: ", value.amountMax);
            // console.log(key, " amountAvg: ", value.amountAvg);
            // console.log(key, " amountMed: ", value.amountMed);
            // console.log(key, " zonePastPerEnroll: ", value.zonePastPerEnroll);
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
        this.aggregatorArray = aggregatorArray;

        // == remove City-Wide zone from aggregator
        for (var i = 0; i < this.aggregatorArray.length; i++) {
            var nextZone = this.aggregatorArray[i];
            var nextZoneName = nextZone.zoneName;
            if (nextZoneName == "City-Wide") {
                this.aggregatorArray.splice(i, 1);
                break;
            }
        }

        // == no Charter schools in zone 3; add "empty" zone 3 to prevent missing item error
        if (displayObj.dataFilters.agency == "Charter") {
            this.aggregatorArray.push({
                featureIndex:null,
                zoneIndex:2,
                zoneName:"3",
                schoolCount:0,
                SqFtPerEnroll:0,
                zoneAmount:0,
                amountMin:0,
                amountMax:0,
                amountAvg:null,
                amountMed:null,
                zonePastPerEnroll:0,
                zoneFuturePerEnroll:0,
                zoneTotalPerEnroll:0,
                zoneEnroll:0,
                enrollMin:0,
                enrollMax:0,
                enrollAvg:null,
                enrollMed:null,
                zonePastPerSqft:0,
                zoneFuturePerSqft:0,
                zoneTotalPerSqft:0,
                zoneSqft:0,
                sqftMin:0,
                sqftMax:0,
                sqftAvg:null,
                sqftMed:null
            });
        }

        // ======= ======= ======= FEATURE PROPERTIES LOOP ======= ======= =======
        var featureIndex = -1;
        var zoneIndex;
        map.data.forEach(function(feature) {
            featureIndex++;
            zoneName = removeAbbreviations(feature.getProperty('NAME'))
            zoneIndex = getZoneIndex(zoneName, zonesCollectionObj.aggregatorArray);
            centerLatLng = makeZoneGeometry(feature);
            feature.setProperty('center', centerLatLng);
            feature.setProperty('zoneName', zoneName);
            feature.setProperty('zoneIndex', zoneIndex);
            feature.setProperty('featureIndex', featureIndex);
            setFeatureIndex(featureIndex, zonesCollectionObj.aggregatorArray[zoneIndex]);
            // console.log("    zoneName: ", feature.getProperty('zoneName'));
            // console.log("    zoneIndex: ", feature.getProperty('zoneIndex'));
            // console.log("    featureIndex: ", feature.getProperty('featureIndex'));
            zonesCollectionObj.zoneFeaturesArray.push([featureIndex, feature]);
        });
        console.log("  this.aggregatorArray.length: ", this.aggregatorArray.length);
        console.log("  this.aggregatorArray: ", this.aggregatorArray);
        console.log("  zonesCollectionObj.zoneFeaturesArray.length: ", zonesCollectionObj.zoneFeaturesArray.length);
        console.log("  zonesCollectionObj.zoneFeaturesArray: ", zonesCollectionObj.zoneFeaturesArray);

        // ======= ======= ======= calculate perSqft, perStudent, min, max, average, median, increment ======= ======= =======
        if (displayObj.dataFilters.expend) {
            // this.dataIncrement = calcPerAmounts(this, displayObj);
            this.dataIncrement = calcDataIncrement(this, displayObj);
        }

        // ======= FEATURES FORMATTING LOOPS =======
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

        } else {
            zonesCollectionObj.aggregatorArray.forEach(function(zone, zoneIndex) {
                var zoneName = zone.zoneName;
                // console.log("*** zone.zoneIndex: ", zone.zoneIndex);
                // console.log("  zone.zoneName: ", zone.zoneName);

                // == build map feature if not "City-Wide"
                if (zone.zoneIndex != null) {
                // if ((zone.zoneIndex != null) && (zoneName != "City-Wide")) {
                    setZoneProperties("single", zone.zoneIndex);
                }
            });
        }


        // ======= ======= ======= setZoneProperties ======= ======= =======
        function setZoneProperties(whichLayer, zoneIndex) {
            console.log("setZoneProperties");
            feature = zonesCollectionObj.zoneFeaturesArray[zoneIndex][1];
            nextName = feature.getProperty('zoneName');
            // console.log("  whichLayer: ", whichLayer);
            // console.log("  zoneIndex: ", zoneIndex);
            // console.log("  nextName: ", nextName);
            zoneFormatArray = getZoneFormat(zonesCollectionObj, displayObj, zoneIndex, nextName, whichLayer);
            feature.setProperty('itemColor', zoneFormatArray[0]);
            feature.setProperty('strokeColor', zoneFormatArray[1]);
            feature.setProperty('strokeWeight', zoneFormatArray[2]);
            feature.setProperty('itemOpacity', zoneFormatArray[3]);
            setFeatureStyle(feature);
            // [itemColor, strokeColor, strokeWeight, itemOpacity];
            console.log("  zoneFormatArray: ", zoneFormatArray);
        }

        // if (zoneBcount > 0) {
        //
        //     // == elementary or middle school zones in feeder areas
        //     console.log("*** LOWER ZONES ***");
        //     for (var i = 0; i < zoneBcount; i++) {
        //         featureIndex++;
        //         feature = self.zoneFeaturesArray[i];
        //         nextName = feature.getProperty('itemName');
        //         featureIndex = i;
        //         zoneFormatArray = getZoneFormat(self, displayObj, featureIndex, nextName, "lower");
        //         feature.setProperty('itemColor', zoneFormatArray[0]);
        //         feature.setProperty('strokeColor', zoneFormatArray[1]);
        //         feature.setProperty('strokeWeight', zoneFormatArray[2]);
        //         feature.setProperty('itemOpacity', zoneFormatArray[3]);
        //         setFeatureStyle(feature);
        //     }
        //
        //     // == feeder zones or wards
        //     console.log("*** UPPER ZONES ***");
        //     for (var i = zoneBcount; i < self.zoneFeaturesArray.length; i++) {
        //         featureIndex++;
        //         feature = self.zoneFeaturesArray[i];
        //         nextName = feature.getProperty('itemName');
        //         zoneAIndex = featureIndex - zoneBcount;
        //         zoneFormatArray = getZoneFormat(self, displayObj, zoneAIndex, nextName, "upper");
        //         feature.setProperty('itemColor', zoneFormatArray[0]);
        //         feature.setProperty('strokeColor', zoneFormatArray[1]);
        //         feature.setProperty('strokeWeight', zoneFormatArray[2]);
        //         feature.setProperty('itemOpacity', zoneFormatArray[3]);
        //         setFeatureStyle(feature);
        //     }
        //
        // // == single zone layer
        // } else {
        //     for (var i = 0; i < self.zoneFeaturesArray.length; i++) {
        //         featureIndex++;
        //         feature = self.zoneFeaturesArray[i];
        //         nextName = feature.getProperty('itemName');
        //         zoneFormatArray = getZoneFormat(self, displayObj, featureIndex, nextName, "single");
        //         feature.setProperty('itemColor', zoneFormatArray[0]);
        //         feature.setProperty('strokeColor', zoneFormatArray[1]);
        //         feature.setProperty('strokeWeight', zoneFormatArray[2]);
        //         feature.setProperty('itemOpacity', zoneFormatArray[3]);
        //         setFeatureStyle(feature);
        //     }
        // }

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

        // ======= ======= ======= show rankings chart ======= ======= =======
        if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
            if (displayObj.dataFilters.expend) {
                makeRankChart(zonesCollectionObj, schoolsCollectionObj, displayObj, zoneBcount);
            }
        }
    }

    // ======= ======= ======= activateZoneListeners ======= ======= =======
    ZonesCollection.prototype.activateZoneListeners = function() {
        console.log("activateZoneListeners");
        console.log("  this.zoneA: ", this.zoneA);

        var self = this;
        var zoneA = this.zoneA;

        // ======= ======= ======= mouseover ======= ======= =======
        var zoneMouseover = map.data.addListener('mouseover', function(event) {
            // console.log("--- mouseover ---");
            var zoneName = event.feature.getProperty('zoneName');
            updateHoverText(zoneName);
            displayFilterMessage("Select zone or school");
            if (map.get('clickedZone')!= event.feature ) {
                map.data.overrideStyle(event.feature, {
                    fillColor: "white",
                    fillOpacity: 0.5,
                    strokePosition: "center",
                    strokeWeight: 8
                });
            }
        });

        // ======= ======= ======= mouseout ======= ======= =======
        var zoneMouseout = map.data.addListener('mouseout', function(event) {
            // console.log("--- mouseout ---");
            var featureIndex = event.feature.getProperty('featureIndex');
            var itemColor = event.feature.getProperty('itemColor');
            if (map.get('clickedZone')!= event.feature ) {
                map.data.overrideStyle(event.feature, {
                    fillColor: itemColor,
                    strokeWeight: 1
                });
            }
            updateHoverText(null);
        });

        // ======= ======= ======= click ======= ======= =======
        var zoneMouseClick = map.data.addListener('click', function(event) {
            console.log("\n======= select zone =======");

            // == identify clicked zone from zone name value
            var zoneName = event.feature.getProperty('NAME');
            var checkZone = zoneName.indexOf(", ");
            if (checkZone > -1) {
                splitZoneName = zoneName.split(", ");
                var zoneName = splitZoneName[0];
            }

            // == set new zone info on menuObject
            displayObj.dataFilters.selectedZone = zoneName;
            updateHoverText(zoneName);
            displayFilterMessage(displayObj, zoneName, "add");
            de_activateZoneListeners(self);
            zonesCollectionObj.getZoneData();
        });

        // == add listeners to listeners array
        this.mapListenersArray.push(zoneMouseover);
        this.mapListenersArray.push(zoneMouseout);
        this.mapListenersArray.push(zoneMouseClick);

        // ======= ======= ======= zoomToZone ======= ======= =======
        function zoomToZone(event) {
            console.log("zoomToZone");
            var clickedZone = map.get('clickedZone');
            if (clickedZone && clickedZone != event.feature) {
                map.data.revertStyle(clickedZone);
            }
            map.set('clickedZone', event.feature);
            map.data.overrideStyle(event.feature, {
                fillOpacity: 0.9,
                fillColor: "gray",
                strokeWeight: 4
            });

            var bounds = new google.maps.LatLngBounds();
            var center = bounds.getCenter();
            processPoints(event.feature.getGeometry(), bounds.extend, bounds);
            map.fitBounds(bounds);
        }

        // ======= ======= ======= processPoints ======= ======= =======
        function processPoints(geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                callback.call(thisArg, geometry.get());
            } else {
                geometry.getArray().forEach(function(g) {
                    processPoints(g, callback, thisArg);
                });
            }
        }
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
            nextSchoolIndex = nextSchoolData.schoolIndex;
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

        // == check array content for consistency
        // console.log("\n******* ******* arrays check *******");
        // console.dir(this.aggregatorArray);
        // console.log("  .aggregatorArray: ", zonesCollectionObj.aggregatorArray);
        // console.log("  aggregatorArrayCt: ", zonesCollectionObj.aggregatorArray.length);
        // console.log("  zoneFeaturesArrayCt: ", zonesCollectionObj.zoneFeaturesArray.length);
        // console.log("  selectedSchoolsCt: ", schoolsCollectionObj.selectedSchoolsArray.length);
        // console.log("  schoolMarkersArrayCt: ", schoolsCollectionObj.schoolMarkersArray.length);

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
        zonesCollectionObj.getZoneData();
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

    // == see getZoneData for parameter values
    return setFilterSelections;
}
