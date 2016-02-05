$(document).ready(function(){
    console.log('jQuery loaded');
    console.log('document ready');
    initApp();
});

function initApp() {
    console.log('initApp');



    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======

    var schoolsCollectionObj;
    var zonesCollectionObj;
    var displayObj;
    var availableTags = [
        "Aiton", "Bancroft", "Barnard", "Beers", "Brent", "Brightwood", "Browne", "Burroughs", "Burrville", "Harris", "Cleveland", "Drew", "Eaton", "Garfield", "Garrison", "Hendley", "Houston", "Hyde-Addison", "Wilson", "Janney", "Ketcham", "Key", "Kimball", "Lafayette", "Langdon", "Langley", "Leckie", "Ludlow-Taylor", "Mann", "Marie", "Maury", "Moten", "Murch", "Nalle", "Noyes", "Old", "Orr", "Patterson", "Payne", "Peabody", "Plummer", "Powell", "Raymond", "Ross", "Savoy", "Seaton", "Shepherd", "Simon", "Smothers", "Stanton", "Stoddert", "Takoma", "Thomas", "Thomson", "Truesdell", "Tubman", "Turner", "Tyler", "Walker-Jones", "Watkins", "Wheatley", "Whittier", "Hearst", "West", "Van", "Amidon-Bowen", "Anacostia", "Coolidge", "Deal", "Eastern", "Eliot-Hine", "Ellington", "Francis-Stevens", "Cooke", "Hardy", "Hart", "Jefferson", "Kelly", "King", "Kramer", "LaSalle-Backus", "Phelps", "School", "Sousa", "Wilson", "Bruce-Monroe", "Columbia", "John", "Stuart-Hobson", "Washington", "Benjamin", "Oyster-Adams", "Brookland", "Dunbar", "Malcolm", "Old", "Cardozo", "Capitol", "Moore", "Prospect"];


    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        // == PK_K, Elem, Middle, High, ES_MS, MS_HS, Alt, SPED
        filterMenu.Ward = { id:"Ward", category:"zone", text:"Wards", column:"WARD", value:null };
        filterMenu.Elem = { id:"Elem", category:"schools", text:"Elementary Schools", column:"Level", value:"ES" };
        filterMenu.Middle = { id:"Middle", category:"schools", text:"Middle Schools", column:"Level", value:"MS" };
        filterMenu.High = { id:"High", category:"schools", text:"High Schools", column:"Level", value:"HS" };

        // == spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll
        filterMenu.spendPast = { id:"spendPast", category:"expenditures", text:"Past Spending", column:"MajorExp9815", value:null };
        filterMenu.spendLifetime = { id:"spendLifetime", category:"expenditures", text:"Total Spending", column:"LifetimeBudget", value:null };
        filterMenu.spendPlanned = { id:"spendPlanned", category:"expenditures", text:"Planned Spending", column:"TotalAllotandPlan1621", value:null };
        filterMenu.spendSqFt = { id:"spendSqFt", category:"expenditures", text:"Current/SqFt", column:"SpentPerSqFt", value:null };
        filterMenu.spendEnroll = { id:"spendEnroll", category:"expenditures", text:"Current/Student", column:"SpentPerEnroll", value:null };
    }
    function Display() {
        console.log("Display");
        this.levelsMenu = ["levels", filterMenu.High, filterMenu.Middle, filterMenu.Elem];
        this.expendMenu = ["expend", filterMenu.spendPast, filterMenu.spendLifetime, filterMenu.spendPlanned, filterMenu.spendSqFt, filterMenu.spendEnroll];
        this.filterMenusArray = [this.levelsMenu, this.expendMenu];
        this.filterTitlesArray = [];
        this.schoolNamesArray = [];
        this.categoryLabels = ["school type", "spending"];
        this.groupLabels = ["where", "what"];
        this.dataFilters = { "levels": null, "expend": null };
    }
    function ZonesCollection() {
        console.log("ZonesCollection");
        this.zoneType = "Quadrant";       // FeederHS, FeederMS, Elementary, Ward, Quadrant
        this.zoneGeojson = null;         // geojson data
        this.aggregatorArray = [];
        this.mapListenersArray = [];
        this.indexColorsArray = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];
        this.dataColorsArray = ["#0000ff", "#2200cc", "#4400aa", "#660088", "#880066", "#aa0044", "#cc0022", "#ff0000"];
        this.defaultColor = "white";
        this.dataIncrement = 0;
        this.dataBins = 8;
    }
    function SchoolsCollection() {
        console.log("SchoolsCollection");
        this.dataSource = null;
        this.schoolColorsArray = [];
        this.schoolMarkersArray = [];
        this.selectedSchoolsArray = [];
        this.jsonData = null;         // geojson data
        this.active = false;
    }
    function Menu() {
        console.log("Menu");
        this.zoneFilter = null;
        this.expendFilter = null;
        this.levelsFilter = null;
        this.agencyFilter = null;
        this.studentsFilter = null;
        this.selectedSchool = null;
        this.selectedZone = null;
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

    // ======= ======= ======= initFilterMenus ======= ======= =======
    Display.prototype.initFilterMenus = function() {
        console.log("initFilterMenus");

        // == popup bar container
        var popupContainer = $("#main-nav");

        // == build filter menu (by category)
        var menuHtml = "<ul class='nav-list'>";
        for (var i = 0; i < this.filterMenusArray.length; i++) {
            nextMenu = this.filterMenusArray[i];
            menuHtml += this.makeCategoryMenu(nextMenu, i);
            if ((i < 2) || (i == (this.filterMenusArray.length - 1))) {
                menuHtml += "<hr>";
            }
        }
        menuHtml += "</ul>";
        menuHtml += this.initSearchBar();
        menuHtml += this.initHoverDisplay();
        $(popupContainer).append(menuHtml);
        $("#chart-container").css("display", "none");

        // == activate individual filter selectors after appended to DOM
        for (var i = 0; i < this.filterMenusArray.length; i++) {
            nextMenu = this.filterMenusArray[i];
            this.activateFilterMenu(nextMenu);
        }
        this.activateSearchButton("searchButton");
        this.activateSearchWindow("searchWindow");
    }

    // ======= ======= ======= makeCategoryMenu ======= ======= =======
    Display.prototype.makeCategoryMenu = function(whichMenu, index) {
        // console.log("makeCategoryMenu");

        var nextCatLabel = this.categoryLabels[index];
        var nextGrpLabel = this.groupLabels[index];
        var nextCategory = whichMenu[0];
        var menuHtml = "<li id='" + nextCategory + "' class='category'><span class='labelText'>" + nextGrpLabel + "</span><a href='#'>" + nextCatLabel + "</a>";
        menuHtml += "<ul>";
        menuHtml += this.makeFilterMenu(whichMenu);
        menuHtml += "</ul>";
        menuHtml += "</li>";
        return menuHtml;
    }

    // ======= ======= ======= makeFilterMenu ======= ======= =======
    Display.prototype.makeFilterMenu = function(whichMenu) {
        console.log("makeFilterMenu");

        // == category name is the first item in whichMenu
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

    // ======= ======= ======= initSearchBar ======= ======= =======
    Display.prototype.initSearchBar = function() {
        // console.log("initSearchBar");
        var searchHtml = "<div id='search' class='category'><span class='labelText searchText'>search</span>";
        searchHtml += "<input id='searchWindow' type='text' placeholder='  school name'/ >";
        searchHtml += "<input type='button' id='searchButton' value='search'/ ></div>";
        return searchHtml;
    }

    // ======= ======= ======= initHoverDisplay ======= ======= =======
    Display.prototype.initHoverDisplay = function() {
        // console.log("initHoverDisplay");
        var hoverHtml = "<div id='mouseover-text'><h2>&nbsp;</h2></div>";
        return hoverHtml;
    }

    // ======= ======= ======= setMenuItem ======= ======= =======
    Display.prototype.setMenuItem = function(whichCategory, whichFilter) {
        console.log("setMenuItem");

        // == menu text creates user-friendly menu item
        var menuObject = filterMenu[whichFilter];
        var menuText = menuObject.text;

        // == modify selected filter menu item to show selection
        htmlString = "<li><a id='" + whichFilter + "' href='#'>" + menuText + "</a></li>";
        selectedFilterElement = $("#" + whichCategory);
        selectedFilterElement.children("ul").empty();
        selectedFilterElement.children("ul").html(htmlString);
        selectedFilterElement.children("ul").css("display", "block");
        this.activateFilterRelease(selectedFilterElement);
    }

    // ======= ======= ======= activateFilterMenu ======= ======= =======
    Display.prototype.activateFilterMenu = function(whichMenu) {
        console.log("activateFilterMenu");

        // == activate filter click events
        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            this.activateFilterSelect(nextItem);
        }
    }

    // ======= ======= ======= activateSearchWindow ======= ======= =======
    Display.prototype.activateSearchWindow = function(windowId) {
        console.log("activateSearchWindow");

        $("#" + windowId).on('input',function(e){
            clearProfileChart();
        });
    }


    // ======= ======= ======= activateSearchButton ======= ======= =======
    Display.prototype.activateSearchButton = function(buttonId) {
        console.log("activateSearchButton");

        var self = this;
        var buttonElement = $("#" + buttonId);

        // ======= autocomplete =======
        // availableTags = displayObj.schoolNamesArray;
        $( "#searchWindow" ).autocomplete({
            source: availableTags
        });
        $('#searchWindow').css('z-index', 999);

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

    // ======= ======= ======= activateClearButton ======= ======= =======
    Display.prototype.activateClearButton = function() {
        console.log("activateClearButton");

        var self = this;
        $("#clear-button").fadeIn( "fast", function() {
            console.log("*** FADEIN ***");
        });

        // ======= ======= ======= selectFilter ======= ======= =======
        $("#clear-button").off("click").on("click", function(event){
            console.log("\n======= clear ======= ");

            // == clear menus (html) and filters (displayObj)
            clearMenuCategory("levels");
            clearMenuCategory("expend");
            self.filterTitlesArray = [];
            self.dataFilters.expend = null;
            self.dataFilters.levels = null;

            clearProfileChart();

            // == clear filter window
            filterText = "your filters";
            var filterTitleContainer = $("#filters-title").children("h2");
            $(filterTitleContainer).removeClass("filterList");
            $(filterTitleContainer).text(filterText);
            updateHoverText(null);
            zonesCollectionObj.getZoneData();
        });
    }

    // ======= ======= ======= clearProfileChart ======= ======= =======
    function clearProfileChart() {
        console.log("clearProfileChart");

        if ($('#mouseover-text').find('table').length) {
            $("#profile").fadeOut( "slow", function() {
                console.log("*** FADEOUT ***");
                $("#profile").remove();
            });
        }
        if ($('#mouseover-text').find('#chart-container').length) {
            $("#chart-container").fadeOut( "slow", function() {
                console.log("*** FADEOUT ***");
                $("#chart-container").remove();
            });
        }
    }

    // ======= ======= ======= findSearchSchool ======= ======= =======
    Display.prototype.findSearchSchool = function(buttonId) {
        console.log("findSearchSchool");

        var self = this;
        var searchSchoolName = $("#searchWindow").val();
        var url = "Data_Schools/DCPS_Master_114_dev.csv";

        // ======= get map geojson data =======
        $.ajax({
            dataType: "text",
            url: url
        }).done(function(textData){
            console.log("*** ajax success ***");
            console.dir(textData);
            jsonData = CSV2JSON(textData);

            var nextSchool, schoolName, schoolCode;
            var foundDataArray = [];
            var filterTitleContainer = $("#filters-title").children("h2");

            // ======= search school data by name =======
            for (var i = 0; i < jsonData.length; i++) {
                var filterFlagCount = 0;

                // == zone (geography), level, agency flags
                nextSchool = jsonData[i];
                schoolName = nextSchool.School;
                schoolCode = nextSchool.SCHOOLCODE;

                // == name (school) from json is long; name (checkGeo) from geojson is short
                var checkSchool = schoolName.indexOf(searchSchoolName);
                if (checkSchool > -1) {
                    foundDataArray.push(nextSchool);
                }
            }

            // == display found school name or "no data" message
            if (foundDataArray.length > 0) {
                if (foundDataArray.length > 1) {
                    schoolText = "<span class='filterLabel'>Multiple schools: </span>";
                    $(filterTitleContainer).css("font-size", "14px");
                    var hoverText = "Re-enter correct name (from list)"
                    updateHoverText(hoverText);
                } else {
                    self.activateClearButton();
                    $(filterTitleContainer).css("font-size", "16px");
                    schoolText = "<span class='filterLabel'>Your school: </span>";
                    makeSchoolProfile(foundDataArray[0]);
                    $("#profile").css("display", "table");
                    updateHoverText(null);
                }

                $(filterTitleContainer).addClass("filterList");

                var schoolNamesArray = [];
                for (var i = 0; i < foundDataArray.length; i++) {
                    nextSchool = foundDataArray[i];
                    nextSchoolName = nextSchool.School;
                    schoolText += nextSchoolName + ", ";
                    schoolNamesArray.push(nextSchoolName);
                }
                self.dataFilters.selectedSchool = schoolNamesArray;
            } else {
                $(filterTitleContainer).addClass("filterList");
                schoolText = "No data.  Please try again.  ";
            }
            schoolText = schoolText.substring(0, schoolText.length - 2);
            $(filterTitleContainer).html(schoolText);
            $("#searchWindow").val("");

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= activateFilterSelect ======= ======= =======
    Display.prototype.activateFilterSelect = function(nextItem) {
        console.log("activateFilterSelect");

        // == id ties DOM element to menu object
        var self = this;
        var nextId = nextItem.id;
        var nextElement = $("#" + nextId);

        // ======= ======= ======= selectFilter ======= ======= =======
        $(nextElement).off("click").on("click", function(event){
            console.log("\n======= selectFilter ======= ");

            var classList = $(this).attr('class').split(/\s+/);
            var whichCategory = classList[1];
            var whichFilter = this.id;
            var menuObject = filterMenu[whichFilter];
            var whichColumn = menuObject.column;
            var whichValue = menuObject.value;
            var htmlString;
            checkFilterSelection(self, zonesCollectionObj);
            console.log("  whichCategory: ", whichCategory);

            event.stopImmediatePropagation();

            // == store selected filter value on display object (zone, levels, agency, expend, students)
            switch(whichCategory) {
                case "levels":
                    self.dataFilters.levels = whichValue;
                    if (whichValue == "HS") {
                        zonesCollectionObj.zoneType = "FeederHS";
                    } else if (whichValue == "MS") {
                        zonesCollectionObj.zoneType = "FeederMS";
                    } else if (whichValue == "ES") {
                        zonesCollectionObj.zoneType = "Elementary";
                    }
                    zonesCollectionObj.aggregatorArray = [];
                    break;
                case "expend":
                    updateHoverText(null);
                    self.dataFilters.expend = whichFilter;
                    clearZoneAggregator(zonesCollectionObj);
                    if ($('#mouseover-text').find('table').length) {
                        $("#profile").remove();
                    }
                    if (self.dataFilters.levels == null) {
                        updateHoverText("Please select school type first");
                    }
                    break;
            }
            checkFilterSelection(self, zonesCollectionObj);

            updateFilterTitles(self, menuObject.text, "add");
            self.setMenuItem(whichCategory, whichFilter);
            zonesCollectionObj.getZoneData();
        });
    }

    // ======= ======= ======= activateFilterRelease ======= ======= =======
    Display.prototype.activateFilterRelease = function(selectedFilterElement) {
        console.log("activateFilterRelease");

        var self = this;
        var menuHtml;

        // ======= ======= ======= releaseFilter ======= ======= =======
        $(selectedFilterElement).off("click").on("click", function(event){
            console.log("\n======= releaseFilter ======= ");

            var whichCategory = this.id;
            checkFilterSelection(self, zonesCollectionObj);
            clearMenuCategory(whichCategory);
            checkFilterSelection(self, zonesCollectionObj);

            if ($('#mouseover-text').find('table').length) {
                $("#profile").fadeOut( "slow", function() {
                    console.log("*** FADEOUT ***");
                    $("#profile").remove();
                });
            }
        });
    }

    // ======= ======= ======= clearMenuCategory ======= ======= =======
    function clearMenuCategory(whichCategory) {
        console.log("clearMenuCategory");

        // == find menu for selected category
        for (var i = 0; i < displayObj.filterMenusArray.length; i++) {
            nextMenu = displayObj.filterMenusArray[i];
            checkCategory = displayObj.filterMenusArray[i][0];
            if (checkCategory == whichCategory) {
                displayObj.dataFilters[whichCategory] = null;

                // == get category parent element
                filterElement = $("#" + whichCategory);

                // == get filter parent element
                var whichFilter = $(filterElement).children("ul").children("li").children("a").attr('id');

                // == clear filter html (previous selection) and build new menu html
                if (whichFilter) {
                    var menuObject = filterMenu[whichFilter];
                    var filterText = menuObject.text;
                    filterElement.children("ul").remove();
                    var menuHtml = "<ul>";
                    menuHtml += displayObj.makeFilterMenu(nextMenu);
                    filterElement.append(menuHtml);
                    displayObj.activateFilterMenu(nextMenu);
                    updateFilterTitles(displayObj, filterText, "remove");
                    break;
                } else {
                    console.log("No filter in this catagory");
                }
            }
        }
    }



    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======

    // ======= ======= ======= getZoneData ======= ======= =======
    ZonesCollection.prototype.getZoneData = function() {
        console.log("\n----- getZoneData -----");

        var self = this;

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: getZoneUrl(displayObj.dataFilters.levels)      // defaults to FeederHS
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            console.dir(geoJsonData);

            self.zoneGeojson = geoJsonData;
            if (self.aggregatorArray.length == 0) {
                makeZoneAggregator(self);
            }
            schoolsCollectionObj.getSchoolData();

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



    // ======= ======= ======= loadAutoComplete ======= ======= =======
    SchoolsCollection.prototype.loadAutoComplete = function() {
        console.log("loadAutoComplete");

        var self = this;

        // ======= get selected data =======
        $.ajax({
            url: "Data_Schools/DCPS_Master_114_dev.csv",
            method: "GET",
            dataType: "text"
        }).done(function(textData) {
            console.log("*** ajax success ***");
            jsonData = CSV2JSON(textData);
            console.dir(jsonData);

            // == store school json data
            self.jsonData = jsonData;

            // == get school names
            displayObj.schoolNamesArray = [];
            for (var i = 0; i < jsonData.length; i++) {
                var filterFlagCount = 0;

                // == level filter
                nextSchool = jsonData[i];
                displayObj.schoolNamesArray.push(processSchoolName(nextSchool.School))
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }


    // ======= ======= ======= getSchoolData ======= ======= =======
    SchoolsCollection.prototype.getSchoolData = function() {
        console.log("\n----- getSchoolData -----");
        console.log("  displayObj.zoneType: ", displayObj.zoneType);

        var self = this;

        // ======= get selected data =======
        if (this.jsonData == null) {
            $.ajax({
                url: "Data_Schools/DCPS_Master_114_dev.csv",
                method: "GET",
                dataType: "text"
            }).done(function(textData){
                console.log("*** ajax success ***");
                jsonData = CSV2JSON(textData);
                console.dir(jsonData);

                // == store school json data
                self.jsonData = jsonData;
                getSchoolData();

            // == errors/fails
            }).fail(function(){
                console.log("*** ajax fail ***");
            }).error(function() {
                console.log("*** ajax error ***");
            });

        } else {
            getSchoolData();
        }

        // ======= ======= ======= getSchoolData ======= ======= =======
        function getSchoolData() {
            console.log("\n----- getSchoolData -----");


            // ======= get school codes for selected zone, level and type =======
            var selectedCodesArray = [];
            var selectedNamesArray = [];
            var rejectedCodesArray = [];
            var selectedSchoolsArray = [];
            var nextSchool, schoolData, selectSchool;

            for (var i = 0; i < jsonData.length; i++) {
                var filterFlagCount = 0;

                // == level filter
                nextSchool = jsonData[i];
                selectSchool = self.checkFilterMatch(nextSchool);

                // == build array of schools that match filters
                if (selectSchool == true) {
                    schoolData = getDataDetails(nextSchool);
                    selectedSchoolsArray.push(schoolData)
                    selectedNamesArray.push(processSchoolName(schoolData.schoolName))
                    selectedCodesArray.push(schoolData.schoolCode)
                    if ((displayObj.dataFilters.expend != null) && (displayObj.dataFilters.levels != null) && (zonesCollectionObj.zoneType != "Quadrant")) {
                        captureSchoolData(zonesCollectionObj, displayObj, schoolData);
                    }
                } else {
                    rejectedCodesArray.push(nextSchool.SCHOOLCODE);
                }
            }
            self.selectedSchoolsArray = selectedSchoolsArray;

            var zoneNamesArray = [];
            for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
                nextZoneName = zonesCollectionObj.aggregatorArray[i].schoolName;
                zoneNamesArray.push(nextZoneName);
            }
            console.log("  selectedCodesArray: ", selectedCodesArray.length);
            console.log("  rejectedCodesArray: ", rejectedCodesArray.length);

            // ======= make map layers ======
            if (selectedSchoolsArray.length > 0) {
                zonesCollectionObj.makeZoneLayer();
                if ((displayObj.dataFilters.expend == null) && (zonesCollectionObj.zoneType != "Quadrant")) {
                    zonesCollectionObj.activateZoneListeners();
                }
                self.makeSchoolLayer();
            } else {
                updateFilterTitles("Sorry, no schools matched criteria.  Click CLEAR");
                clearProfileChart();
            }
        }
    }

    // ======= ======= ======= checkFilterMatch ======= ======= =======
    SchoolsCollection.prototype.checkFilterMatch = function(nextSchool) {
        // console.log("checkFilterMatch");

        var school = nextSchool.School;
        var schoolWard = nextSchool.WARD;
        var schoolType = nextSchool.Agency;
        var schoolLevel = nextSchool.Level;
        var shortName = processSchoolName(school);

        if (displayObj.dataFilters.levels) {
            var levelsMatch = (displayObj.dataFilters.levels == schoolLevel) ? true : false;
            if (displayObj.dataFilters.expend) {
                var expendMatch = (schoolType == "DCPS") ? true : false;
            } else {
                var expendMatch = true;
            }
        } else {
            var expendMatch = true;
            var levelsMatch = true;
        }

        if ((levelsMatch == true) && (expendMatch == true)) {
            // console.log("******* selected: ", shortName);
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
        var colorIndex = 0;
        var featureIndex = 0;
        var itemOpacity = 0.5;
        var strokeColor = "purple";
        var strokeWeight = 2;
        var itemColor, itemOpacity, centerLatLng, zoneName;

        // ======= ======= ======= cleanup ======= ======= =======
        de_activateZoneListeners(this);
        map.data.forEach(function(feature) {
            if (feature) {
                itemName = feature.getProperty('itemName');
                map.data.remove(feature);
            }
        });

        // ======= ======= ======= map legend ======= ======= =======
        if (displayObj.dataFilters.levels) {
            if (displayObj.dataFilters.expend) {
                this.dataIncrement = calcDataIncrement(this, displayObj);
                var itemOpacity = 1;
                makeMapLegend(this);
                $("#mapLegend").css("display", "block");
            } else {
                $("#mapLegend").css("display", "none");
            }
        }

        // ======= ======= ======= make data features ======= ======= =======
        map.data.addGeoJson(this.zoneGeojson);
        map.data.forEach(function(feature) {
            featureIndex++;
            colorIndex++;

            // == limit index by number of available colors
            if (colorIndex > self.indexColorsArray.length) {
                colorIndex = 0
            }

            // ======= get and validate name for each feature =======
            zoneName = removeAbbreviations(feature.getProperty('NAME'))

            // ======= special color handling for selected mode =======
            itemColor = setZoneColor(self, displayObj, featureIndex, colorIndex);

            // ======= get center lat lng of feature =======
            centerLatLng = makeZoneGeometry(feature);

            // ======= set feature properties =======
            feature.setProperty('index', featureIndex);
            feature.setProperty('itemName', zoneName);
            feature.setProperty('center', centerLatLng);
            feature.setProperty('itemColor', itemColor);
            feature.setProperty('itemOpacity', itemOpacity);
            feature.setProperty('strokeWeight', strokeWeight);

            // ======= colorize each feature based on colorList =======
            map.data.setStyle(function(feature) {
                var nextColor = feature.getProperty('itemColor');
                var nextOpacity = feature.getProperty('itemOpacity');
                var strokeWeight = feature.getProperty('strokeWeight');
                return {
                  fillColor: nextColor,
                  fillOpacity: nextOpacity,
                  strokeColor: strokeColor,
                  strokeWeight: strokeWeight
                };
            });
        });

    }

    // ======= ======= ======= activateZoneListeners ======= ======= =======
    ZonesCollection.prototype.activateZoneListeners = function() {
        console.log("activateZoneListeners");
        console.log("  this.zoneType: ", this.zoneType);

        var self = this;
        var zoneType = this.zoneType;

        // ======= ======= ======= mouseover ======= ======= =======
        var zoneMouseover = map.data.addListener('mouseover', function(event) {
            // console.log("--- mouseover ---");
            var itemName = event.feature.getProperty('itemName');
            var itemCenter = event.feature.getProperty('center');

            updateHoverText(itemName);
            updateFilterTitles("Select zone by clicking; click school marker for school profile");

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
            var featureIndex = event.feature.getProperty('index');
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
            console.log("zoneName: ", zoneName);

            // == set new zone info on menuObject
            var menuObject = filterMenu[zoneType];
            menuObject.value = zoneName;
            displayObj.dataFilters.zone = zoneType;
            displayObj.dataFilters.selectedZone = zoneName;

            updateHoverText(zoneName);
            updateFilterTitles(displayObj, zoneName, "add");
            de_activateZoneListeners(self);

            // displayObj.activateClearButton();
            zonesCollectionObj.getZoneData();

            // zoomToZone(event);
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



    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= SCHOOLS LAYER ======= ======= ======= ======= =======

    SchoolsCollection.prototype.makeSchoolLayer = function() {
        console.log("\n----- makeSchoolLayer -----");

        var selectedSchoolsArray = this.selectedSchoolsArray;

        // ======= clear existing listeners if any =======
        removeMarkers(this);

        // == get data to load on markers
        for (var i = 0; i < selectedSchoolsArray.length; i++) {
            nextSchoolData = selectedSchoolsArray[i];
            schoolMarker = null;
            nextSchool = nextSchoolData.schoolName;
            nextSchoolCode = nextSchoolData.schoolCode;
            nextSchoolType = nextSchoolData.schoolAgency;
            nextSchoolAddress = nextSchoolData.schoolAddress;
            nextLat = nextSchoolData.schoolLAT;
            nextLng = nextSchoolData.schoolLON;
            schoolLoc = new google.maps.LatLng(nextLat, nextLng);

            // == set color of school circle
            if (nextSchoolType == "DCPS") {
                fillColor = "red";
                strokeColor = "maroon";
            } else {
                fillColor = "orange";
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
                schoolIndex: i,
                schoolName: nextSchool,
                schoolCode: nextSchoolCode,
                schoolType: nextSchoolType,
                schoolAddress: nextSchoolAddress
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
            console.log("--- mouseover ---");
            var schoolName = this.schoolName;
            var schoolCode = this.schoolCode;
            var schoolType = this.schoolType;
            var schoolIndex = this.schoolIndex;
            var schoolAddress = this.schoolAddress;
            var schoolLoc = this.position;
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
                var schoolName = this.schoolName;
                var schoolCode = this.schoolCode;
                console.log("  schoolName: ", schoolName);
                console.log("  schoolCode: ", schoolCode);

                makeSchoolProfile(schoolsCollectionObj, this.schoolIndex);
                $("#profile").css("display", "table");
            });
        }
    }



    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======

    initMenuObjects();
    initDataObjects();
    initMap(zonesCollectionObj);
    displayObj.initFilterMenus();
    displayObj.activateClearButton();
    schoolsCollectionObj.loadAutoComplete();
    zonesCollectionObj.getZoneData();
}
