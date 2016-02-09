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

    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        // == PK_K, Elem, Middle, High, ES_MS, MS_HS, Alt, SPED
        filterMenu.Elem = { id:"Elem", category:"schools", text:"Elementary Schools", column:"Level", value:"ES" };
        filterMenu.Middle = { id:"Middle", category:"schools", text:"Middle Schools", column:"Level", value:"MS" };
        filterMenu.High = { id:"High", category:"schools", text:"High Schools", column:"Level", value:"HS" };

        // == spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll
        filterMenu.spendPast = { id:"spendPast", category:"expenditures", text:"Past Spending", column:"MajorExp9815", value:null };
        filterMenu.spendLifetime = { id:"spendLifetime", category:"expenditures", text:"Total Spending", column:"LifetimeBudget", value:null };
        filterMenu.spendPlanned = { id:"spendPlanned", category:"expenditures", text:"Planned Spending", column:"TotalAllotandPlan1621", value:null };
        filterMenu.spendSqFt = { id:"spendSqFt", category:"expenditures", text:"Current/SqFt", column:"SpentPerSqFt", value:null };
        filterMenu.spendEnroll = { id:"spendEnroll", category:"expenditures", text:"Current/Student", column:"SpentPerEnroll", value:null };

        // == zones
        filterMenu.Ward = { id:"Ward", category:"zone", text:"Wards", column:"WARD", value:null };
        filterMenu.FeederHS = { id:"FeederHS", category:"zone", text:"High School Feeders", column:"FeederHS", value:null };
        filterMenu.FeederMS = { id:"FeederMS", category:"zone", text:"Middle School Feeders", column:"FeederMS", value:null };

    }
    function Display() {
        console.log("Display");
        this.zonesMenu = ["zones", filterMenu.Ward, filterMenu.FeederHS, filterMenu.FeederMS];
        this.levelsMenu = ["levels", filterMenu.High, filterMenu.Middle, filterMenu.Elem];
        this.expendMenu = ["expend", filterMenu.spendPast, filterMenu.spendLifetime, filterMenu.spendPlanned, filterMenu.spendSqFt, filterMenu.spendEnroll];
        this.filterMenusArray = [this.levelsMenu, this.expendMenu, this.zonesMenu];
        this.filterTitlesArray = [];
        this.schoolNamesArray = [];
        this.categoryLabels = ["schools", "spending", "locations"];
        this.groupLabels = ["who", "what", "where"];
        this.dataFilters = { "levels": null, "expend": null, "zones": null, "selectedZone": null  };
    }
    function ZonesCollection() {
        console.log("ZonesCollection");
        this.zoneType = "Ward";       // FeederHS, FeederMS, Elementary, Ward, Quadrant
        this.zoneGeojson = null;         // geojson data
        this.aggregatorArray = [];
        this.mapListenersArray = [];
        this.zoneFeaturesArray = [];
        this.indexColorsArray = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];
        // this.dataColorsArray = ["#0000ff", "#2200cc", "#4400aa", "#660088", "#880066", "#aa0044", "#cc0022", "#ff0000"];
        this.dataColorsArray = ["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"];
        this.defaultColor = "white";
        this.dataIncrement = 0;
        this.dataBins = 8;
    }
    function SchoolsCollection() {
        console.log("SchoolsCollection");
        this.dataSource = null;
        this.aggregatorArray = [];
        this.schoolColorsArray = [];
        this.schoolMarkersArray = [];
        this.selectedSchoolsArray = [];
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
        var menuHtml = "<p class='all-filters'>[ all ]</p>";
        menuHtml += "<li id='" + nextCategory + "' class='category'><span class='labelText'>" + nextGrpLabel + "</span><a href='#'>" + nextCatLabel + "</a>";
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
        var skipFlag = [];
        console.log("  whichCategory: ", whichCategory);
        console.log("  this.dataFilters.zones: ", this.dataFilters.zones);

        if (whichCategory == "levels") {
            if (this.dataFilters.zones == "FeederHS") {
                skipFlag = [1];
            } else if (this.dataFilters.zones == "FeederMS") {
                skipFlag = [1, 2];
            } else {
                skipFlag = [];
            }
        }

        // == build html string for filter lists
        filterHtml = "";
        for (var i = 1; i < whichMenu.length; i++) {
            console.log("  $.inArray(i, skipFlag): ", $.inArray(i, skipFlag));
            if ($.inArray(i, skipFlag) < 0) {
                nextItem = whichMenu[i];
                nextId = nextItem.id;
                nextText = nextItem.text;
                filterHtml += "<li id='" + nextId + "' class='filter " + whichClass + "'><a class='filterText' href='#'>" + nextText + "</a></li>";
            } else {
                continue;
            }
        }
        return filterHtml;
    }

    // ======= ======= ======= modFilterMenu ======= ======= =======
    Display.prototype.modFilterMenu = function(whichMenu) {
        // console.log("modFilterMenu");

        $("#levels").children("ul").remove();
        var menuHtml = "<ul>";
        menuHtml += this.makeFilterMenu(whichMenu);
        menuHtml += "</ul>";
        $("#levels").children("a").after(menuHtml);
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
                    $("#profile-container").css("display", "table");
                    console.log("*** display profile-container ***");
                    updateHoverText(null);
                }

                // == change to display mode
                $(filterTitleContainer).addClass("filterList");

                // == create autoComplete array, save on display object
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
            // clearProfileChart();
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
            clearMenuCategory("levels");
            clearMenuCategory("expend");
            clearMenuCategory("zones");
            zonesCollectionObj.aggregatorArray = [];
            self.filterTitlesArray = [];
            self.dataFilters.expend = null;
            self.dataFilters.levels = null;
            self.dataFilters.zones = null;

            // == restore levels menu
            self.modFilterMenu(self.filterMenusArray[0]);
            self.activateFilterMenu(self.filterMenusArray[0]);

            // == clear filter window
            filterText = "your filters";
            var filterTitleContainer = $("#filters-title").children("h2");
            $(filterTitleContainer).removeClass("filterList");
            $(filterTitleContainer).text(filterText);
            updateHoverText(null);

            // == load default map
            zonesCollectionObj.getZoneData();

            // == remove mapLegend, profile or chart container if present
            clearProfileChart();
        });
    }

    // ======= ======= ======= clearProfileChart ======= ======= =======
    function clearProfileChart() {
        console.log("clearProfileChart");

        // == remove mapLegend, profile or chart html if any
        if ($('#chart-container').find('#chart').length) {
            $("#chart-container").fadeOut( "fast", function() {
                console.log("*** FADEOUT chart-container ***");
            });
            $("#chart").remove();
        }
        if ($('#legend-container').find('#legend').length) {
            $("#legend-container").fadeOut( "fast", function() {
                console.log("*** FADEOUT legend-container ***");
            });
            $("#legend").remove();
        }
        if ($('#profile-container').find('#profile').length) {
            $("#profile-container").fadeOut( "fast", function() {
                console.log("*** FADEOUT profile-container ***");
            });
            $("#profile").remove();
        }
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
            var whichText = menuObject.text;
            var htmlString;
            checkFilterSelection(self, zonesCollectionObj, whichCategory);
            event.stopImmediatePropagation();

            // == store selected filter value on display object (levels, expend, zone, agency, students)
            switch(whichCategory) {
                case "levels":
                    updateHoverText(null);
                    self.dataFilters.levels = whichValue;
                    if (self.dataFilters.zones != "Ward") {
                        if (whichValue == "HS") {
                            zonesCollectionObj.zoneType = "FeederHS";
                        } else if (whichValue == "MS") {
                            zonesCollectionObj.zoneType = "FeederMS";
                        } else if (whichValue == "ES") {
                            zonesCollectionObj.zoneType = "Elementary";
                        }
                        if (self.dataFilters.zones != null) {
                            clearZoneAggregator(zonesCollectionObj);
                        } else {
                            zonesCollectionObj.aggregatorArray = [];
                        }
                    }
                    break;
                case "expend":
                    updateHoverText(null);
                    clearZoneAggregator(zonesCollectionObj);
                    self.dataFilters.expend = whichFilter;
                    // if (self.dataFilters.levels == null) {
                    //     updateHoverText("Please select school type first");
                    // }
                    break;
                case "zones":
                    zonesCollectionObj.aggregatorArray = [];
                    self.dataFilters.zones = whichFilter;
                    zonesCollectionObj.zoneType = whichFilter;
                    if ((self.dataFilters.levels == null) && (self.dataFilters.expend == null)) {
                        updateHoverText("Select school or spending filter");
                    }
                    // == modify levels menu to remove HS and/or MS options for feeders
                    if ((whichFilter == "FeederHS") || (whichFilter == "FeederMS")) {
                        self.dataFilters.levels = null;
                        self.modFilterMenu(self.filterMenusArray[0]);
                        self.activateFilterMenu(self.filterMenusArray[0]);
                    }
                    break;
            }
            checkFilterSelection(self, zonesCollectionObj, whichCategory);
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
        console.log("  this.aggregatorArray.length: ", this.aggregatorArray.length);
        console.dir(this.aggregatorArray);

        var self = this;

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: getZoneUrl(displayObj)
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
            initAutoComplete(displayObj);

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

        var self = this;

        // ======= get school data =======
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
            console.log("getSchoolData");

            // ======= variables and temp arrays =======
            var schoolIndex = -1;
            var selectedCodesArray = [];
            var selectedNamesArray = [];
            var rejectedCodesArray = [];
            var selectedSchoolsArray = [];
            var rejectedAggregatorArray = [];
            var nextSchool, schoolData, selectSchool, rejectedAggregatorCode;

            // ======= SCHOOL DATA LOOP =======
            for (var i = 0; i < jsonData.length; i++) {
                var filterFlagCount = 0;

                // == check school with filter settings
                nextSchool = jsonData[i];
                selectSchool = self.checkFilterMatch(nextSchool);

                // == build arrays of selected/not selected schools
                if (selectSchool == true) {
                    schoolIndex++;
                    schoolData = getDataDetails(nextSchool);
                    selectedSchoolsArray.push(schoolData)
                    selectedCodesArray.push(schoolData.schoolCode)
                    selectedNamesArray.push(processSchoolName(schoolData.schoolName))

                    // == store school that matches school zone (e.g. Deal Middle School with Deal Middle School Zone)
                    if ((displayObj.dataFilters.expend != null) && (displayObj.dataFilters.levels != null) && (displayObj.dataFilters.zones == null)) {
                        captureSchoolZone(zonesCollectionObj, displayObj, schoolData, schoolIndex);

                    // == aggregate multiple school data for selected zone type (e.g all-school totals for Ward 3)
                    } else if (displayObj.dataFilters.zones != null)  {
                        rejectedAggregatorCode = aggregateZoneData(zonesCollectionObj, displayObj, schoolData, schoolIndex);
                        if (rejectedAggregatorCode) {
                            rejectedAggregatorArray.push(rejectedAggregatorCode);
                        }
                    }
                } else {
                    rejectedCodesArray.push(nextSchool.SCHOOLCODE);
                }
            }
            self.selectedSchoolsArray = selectedSchoolsArray;
            console.log("  selectedSchoolsCt: ", selectedSchoolsArray.length);
            console.log("  selectedCodesCt: ", selectedCodesArray.length);
            console.log("  rejectedCodesCt: ", rejectedCodesArray.length);
            console.log("  rejectedAggCt: ", rejectedAggregatorArray.length);

            // ======= make map layers ======
            if (selectedSchoolsArray.length > 0) {
                zonesCollectionObj.makeZoneLayer();
                if ((displayObj.dataFilters.expend == null) && (displayObj.dataFilters.selectedZone == null)) {
                    // zonesCollectionObj.activateZoneListeners();
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
        var schoolWard = "Ward " + nextSchool.WARD;
        var schoolType = nextSchool.Agency;
        var schoolLevel = nextSchool.Level;
        var schoolFeederHS = nextSchool.FeederHS;
        var schoolFeederMS = nextSchool.FeederMS;
        var shortName = processSchoolName(school);
        // console.log("******* school: ", school);
        // console.log("  schoolLevel: ", schoolLevel);
        // console.log("  schoolWard: ", schoolWard);
        // console.log("  schoolFeederHS: ", schoolFeederHS);
        // console.log("  displayObj.dataFilters.zones: ", displayObj.dataFilters.zones);

        if (displayObj.dataFilters.levels) {
            var levelsMatch = (displayObj.dataFilters.levels == schoolLevel) ? true : false;
        } else {
            var levelsMatch = true;
        }

        if (displayObj.dataFilters.expend) {
            var expendMatch = (schoolType == "DCPS") ? true : false;
        } else {
            var expendMatch = true;
        }

        if (displayObj.dataFilters.agency) {
            var agencyMatch = (schoolType == displayObj.dataFilters.agency) ? true : false;
        } else {
            var agencyMatch = true;
        }

        if (displayObj.dataFilters.selectedZone) {
            var selectedZoneMatch = (schoolWard == displayObj.dataFilters.selectedZone) ? true : false;
        } else {
            var selectedZoneMatch = true;
        }
        // console.log("  levels/expend/zone: ", levelsMatch, "/", expendMatch, "/", selectedZoneMatch);

        if ((levelsMatch == true) && (expendMatch == true) && (agencyMatch == true) && (selectedZoneMatch == true)) {
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
        this.zoneFeaturesArray = [];

        // ======= ======= ======= show rankings chart ======= ======= =======
        if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
            if (displayObj.dataFilters.expend) {
                this.dataIncrement = calcDataIncrement(this, displayObj);
                var itemOpacity = 0.7;
                makeRankChart(zonesCollectionObj, schoolsCollectionObj, displayObj);
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
            if (displayObj.dataFilters.expend) {
                strokeColor = "white";
            } else {
                strokeColor = "purple";
            }

            // ======= get and validate name for each feature =======
            zoneName = removeAbbreviations(feature.getProperty('NAME'))

            // ======= special color handling for selected mode =======
            itemColor = setZoneColor(self, displayObj, featureIndex, colorIndex, zoneName);

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
            self.zoneFeaturesArray.push(feature);
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
            updateHoverText(itemName);
            updateFilterTitles("Select zone or school");
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
            // var menuObject = filterMenu[zoneType];
            // menuObject.value = zoneName;
            // displayObj.dataFilters.zone = zoneType;
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

    // ======= ======= ======= makeSchoolLayer ======= ======= =======
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
            if (displayObj.dataFilters.expend) {
                fillColor = "yellow";
                strokeColor = "black";
            } else {
                if (nextSchoolType == "DCPS") {
                    fillColor = "red";
                    strokeColor = "maroon";
                } else {
                    fillColor = "orange";
                    strokeColor = "crimson ";
                }
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

        // == check array content for consistency
        console.log("\n******* ******* arrays check ******* *******");
        console.dir(this.aggregatorArray);
        console.log("  .aggregatorArray: ", zonesCollectionObj.aggregatorArray);
        console.log("  aggregatorArrayCt: ", zonesCollectionObj.aggregatorArray.length);
        console.log("  zoneFeaturesArrayCt: ", zonesCollectionObj.zoneFeaturesArray.length);
        console.log("  selectedSchoolsCt: ", schoolsCollectionObj.selectedSchoolsArray.length);
        console.log("  schoolMarkersArrayCt: ", schoolsCollectionObj.schoolMarkersArray.length);

        // ======= ======= ======= schoolMarkerOverlay [future] ======= ======= =======

        // == make marker overlay object
        // schoolMarkerOverlay.prototype = new google.maps.OverlayView();
        // var schoolMarkerImageD = 'images/DCPSmarker.png';
        // var schoolMarkerImageC = 'images/PCSmarker.png';
        // var schoolMarker = new schoolMarkerOverlay(bounds, schoolMarkerImageD, map);
        // icon: schoolMarkerImage

        function schoolMarkerOverlay(bounds, image, map) {
            console.log("schoolMarkerOverlay");

            // Initialize all properties.
            this.bounds_ = bounds;
            this.image_ = image;
            this.map_ = map;

            // Define a property to hold the image's div. We'll
            // actually create this div upon receipt of the onAdd()
            // method so we'll leave it null for now.
            this.div_ = null;

            // Explicitly call setMap on this overlay.
            this.setMap(map);
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
                var schoolName = this.schoolName;
                var schoolCode = this.schoolCode;
                console.log("  schoolCode: ", schoolCode);

                makeSchoolProfile(schoolsCollectionObj, this.schoolIndex);
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
