
function initApp(presetMode) {
    console.log('initApp');
    console.log('  presetMode: ', presetMode);



    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= OBJECTS ======= ======= ======= ======= =======

    var schoolsCollectionObj;
    var zonesCollectionObj;
    var displayObj;
    // var map;

    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // school -- School, Address, Agency, Level, longitude, latitude, Ward, FeederMS, FeederHS
        // students -- Total.Enrolled, At_Risk, SPED, Limited.English.Proficient, AtRiskPer, SPEDPer, ESLPer
        // building -- unqBuilding, totalSQFT, maxOccupancy, SqFtPerEnroll, ProjectPhase, YrComplete, ProjectType, YearsOpen, Open, Open.Now
        // expenditures -- MajorExp9815, TotalAllotandPlan1621, LifetimeBudget, SpentPerMaxOccupancy, SpentPerSqFt, AnnualExpenseAverage, AnnualSpentPerMaxOccupany, AnnualSpentPerSqFt

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        // == District, Charter
        filterMenu.District = { id:"District", category:"schools", label:"DCPS Schools", text:"DCPS Schools", column:"Agency", value:"DCPS" };
        filterMenu.Charter = { id:"Charter", category:"schools", label:"Charter Schools", text:"Charter Schools", column:"Agency", value:"PCS" };
        filterMenu.All = { id:"All", category:"schools", label:"All Schools", text:"All school types", column:"Agency", value:"All" };

        // == PK_K, Elem, Middle, High, ES_MS, MS_HS, Alt, SPED
        filterMenu.Elem = { id:"Elem", category:"schools", label:"Elementary Schools", text:"Elementary Schools", column:"Level", value:"ES" };
        filterMenu.Middle = { id:"Middle", category:"schools", label:"Middle Schools", text:"Middle Schools", column:"Level", value:"MS" };
        filterMenu.High = { id:"High", category:"schools", label:"High Schools", text:"High Schools", column:"Level", value:"HS" };

        // == spendPast, spendLifetime, spendPlanned
        filterMenu.spendPast = { id:"spendPast", category:"expenditures", label:"Past Spending", text:"Past Spending 1998-2015", column:"MajorExp9815", value:null };
        filterMenu.spendPlanned = { id:"spendPlanned", category:"expenditures", label:"Future Spend", text:"Future Spending 2016-2021", column:"TotalAllotandPlan1621", value:null };
        filterMenu.spendLifetime = { id:"spendLifetime", category:"expenditures", label:"Total Spend", text:"Total Spending", column:"LifetimeBudget", value:null };

        // == spendSqFt, spendEnroll
        filterMenu.spendSqFt = { id:"spendSqFt", category:"expenditures", label:"/sqft", text:"per sqFt", column:"SpentPerSqFt", value:null };
        filterMenu.spendEnroll = { id:"spendEnroll", category:"expenditures", label:"/student", text:"per student", column:"SpentPerMaxOccupancy", value:null };
        filterMenu.spendAmount = { id:"spendAmount", category:"expenditures", label:"", text:"dollar amount", column:null, value:null };

        // == zones
        filterMenu.Ward = { id:"Ward", category:"zone", label:"Wards", text:"Wards", column:"Ward", value:null };
        filterMenu.FeederHS = { id:"FeederHS", category:"zone", label:"HSfeeders", text:"High School feeder zones", column:"FeederHS", value:null };
        filterMenu.FeederMS = { id:"FeederMS", category:"zone", label:"MSfeeders", text:"Middle School feeder zones", column:"FeederMS", value:null };
        filterMenu.Elementary = { id:"Elementary", category:"zone", label:"Elementary zones", text:"Elementary zones", column:null, value:null };

    }
    function Display() {
        console.log("Display");
        this.displayMode = null;
        this.agencyMenu = ["agency", filterMenu.All, filterMenu.District, filterMenu.Charter];
        this.levelsMenu = ["levels", filterMenu.High, filterMenu.Middle, filterMenu.Elem];
        this.expendMenu = ["expend", filterMenu.spendLifetime, filterMenu.spendPast, filterMenu.spendPlanned];
        this.zonesMenu = ["zones", filterMenu.Ward, filterMenu.FeederHS, filterMenu.FeederMS, filterMenu.Elementary];
        this.expendMathMenu = ["expendMath", filterMenu.spendAmount, filterMenu.spendEnroll, filterMenu.spendSqFt];
        this.filterMenusArray = [this.agencyMenu, this.levelsMenu, this.zonesMenu, this.expendMenu];
        this.filterTitlesArray = [];
        this.schoolNamesArray = [];
        this.categoryLabels = ["sector", "schools", "spending", "location"];
        this.groupLabels = ["who", "what", "when", "where"];
        this.dataFilters = { "agency": null, "levels": null, "expend": null, "zones": "Ward", "math": "spendAmount", "selectedZone": null  };
    }
    function ZonesCollection() {
        console.log("ZonesCollection");
        this.zoneA = "Ward";       // FeederHS, FeederMS, Elementary, Ward, Quadrant
        this.zoneGeojson_A = null;         // geojson data
        this.zoneGeojson_B = null;       // geojson data
        this.zoneGeojson_AB = null;       // geojson data
        this.aggregatorArray = [];
        this.mapListenersArray = [];
        this.zoneFeaturesArray = [];
        this.indexColorsArray = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];
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
        this.sharedAddressArray = [];
        this.schoolMarkersArray = [];
        this.selectedSchoolsArray = [];
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

        var popupContainer = ("#popup");
        var menuHtml = "";
        menuHtml += this.makeSearchDisplay();
        menuHtml += this.makeHoverDisplay();
        $(popupContainer).append(menuHtml);
        this.activateSearchButton("searchButton");
        this.activateSearchWindow("searchWindow");
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

        // == popup bar container
        var subMenuContainer = $("#sub-nav-container");

        // == build sub-menu; attach to chart or profile div
        var nextCategory = whichMenu[0];
        if (chartOrProfile == "chart") {
            var subMenuHtml = "<select id='expendMathC' name='expendMath'>";
        } else if (chartOrProfile == "profile") {
            var subMenuHtml = "<select id='expendMathP' name='expendMath'>";
        }
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
            console.log("  nextMenu[0]: ", nextMenu[0]);
            for (var j = 1; j < nextMenu.length; j++) {
                nextFilter = nextMenu[j];
                console.log("  nextFilter.text: ", nextFilter.text);
                this.activateFilterLink(nextFilter);
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
            clearFilterSelctions();
            clearProfileChart();
            checkFilterSelection(self, zonesCollectionObj);

            // == clear filter window
            filterText = "your filters";
            var filterTitleContainer = $("#filters-selections").children("h2");
            $(filterTitleContainer).removeClass("filterList");
            $(filterTitleContainer).text(filterText);
            updateHoverText(null);

            // == load default map
            zonesCollectionObj.getZoneData();
        });
    }

    // ======= ======= ======= activateSearchWindow ======= ======= =======
    Display.prototype.activateSearchWindow = function(windowId) {
        console.log("activateSearchWindow");

        $("#" + windowId).on('input',function(e){
            clearProfileChart();
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

    // ======= ======= ======= activateFilterLink ======= ======= =======
    Display.prototype.activateFilterLink = function(nextItem) {
        console.log("activateFilterLink");

        // == id ties DOM element to menu object
        var self = this;
        var nextId = nextItem.id;
        var nextElement = $("#" + nextId);

        // ======= ======= ======= mouseover ======= ======= =======
        $(nextElement).off("mouseover").on("mouseover", function(event){
            // console.log("\n======= mouseover ======= ");
            var whichFilter = this.id;
            var menuObject = filterMenu[whichFilter];
            var whichText = menuObject.text;
            updateHoverText(whichText);
        });

        // ======= ======= ======= mouseout ======= ======= =======
        $(nextElement).off("mouseout").on("mouseout", function(event){
            // console.log("\n======= mouseout ======= ");
            updateHoverText("");
        });

        // ======= ======= ======= selectFilter ======= ======= =======
        $(nextElement).off("click").on("click", function(event){
            console.log("\n======= selectFilter ======= ");

            var classList = $(this).attr('class').split(/\s+/);
            var whichCategory = classList[1];
            var whichFilter = this.id;
            var menuObject = filterMenu[whichFilter];
            var whichValue = menuObject.value;
            var whichText = menuObject.text;
            var htmlString;
            // console.log("  whichCategory: ", whichCategory);
            // console.log("  whichFilter: ", whichFilter);
            // console.log("  whichText: ", whichText);
            checkFilterSelection(self, zonesCollectionObj, whichCategory);
            event.stopImmediatePropagation();

            // == store selected filter value  (agency, levels, expend, zone) on display object
            switch(whichCategory) {

                // == agency filter (all, district, charter)
                case "agency":
                    self.dataFilters.agency = whichFilter;
                    clearZoneAggregator(zonesCollectionObj);
                    if (whichFilter == "All") {
                        setMenuState(displayObj, self.agencyMenu, ["S", "A", "A"]);
                        resetMenuState(displayObj, "zones");
                    } else if (whichFilter == "District") {
                        setMenuState(displayObj, self.agencyMenu, ["A", "S", "A"]);
                        resetMenuState(displayObj, "zones");
                    } else if (whichFilter == "Charter") {
                        self.dataFilters.zones = "Ward";
                        zonesCollectionObj.zoneA = "Ward";
                        zonesCollectionObj.zoneGeojson_AB = null;
                        zonesCollectionObj.aggregatorArray = [];
                        setMenuState(displayObj, self.agencyMenu, ["A", "A", "S"]);
                        if (self.dataFilters.levels == "HS") {
                            setMenuState(displayObj, self.levelsMenu, ["S", "A", "A"]);
                        } else if (self.dataFilters.levels == "MS") {
                            setMenuState(displayObj, self.levelsMenu, ["A", "S", "A"]);
                        } else if (self.dataFilters.levels == "ES") {
                            setMenuState(displayObj, self.levelsMenu, ["A", "A", "S"]);
                        }
                        setMenuState(displayObj, self.zonesMenu, ["S", "D", "D"]);
                    }
                    break;

                // == levels filter (ES, MS, HS)
                case "levels":
                    self.dataFilters.levels = whichValue;
                    zonesCollectionObj.aggregatorArray = [];
                    if (whichValue == "HS") {
                        zonesCollectionObj.zoneA = "FeederHS";
                        resetMenuState(displayObj, "levels");
                    } else if (whichValue == "MS") {
                        zonesCollectionObj.zoneA = "FeederMS";
                        resetMenuState(displayObj, "levels");
                    } else if (whichValue == "ES") {
                        zonesCollectionObj.zoneA = "Elementary";
                        resetMenuState(displayObj, "levels");
                    } else {
                        zonesCollectionObj.zoneA = "Ward";
                    }
                    break;

                // == expenditures filter (past, present, planed, etc.)
                case "expend":
                    self.dataFilters.expend = whichFilter;
                    if (whichFilter == "spendLifetime") {
                        setMenuState(displayObj, self.expendMenu, ["S", "A", "A"]);
                    } else if (whichFilter == "spendPast") {
                        setMenuState(displayObj, self.expendMenu, ["A", "S", "A"]);
                    } else if (whichFilter == "spendPlanned") {
                        setMenuState(displayObj, self.expendMenu, ["A", "A", "S"]);
                    }
                    clearZoneAggregator(zonesCollectionObj);
                    break;

                // == wards or feeder zones for map
                case "zones":
                    self.dataFilters.zones = whichFilter;
                    zonesCollectionObj.zoneA = whichFilter;
                    zonesCollectionObj.zoneGeojson_AB = null;
                    zonesCollectionObj.aggregatorArray = [];

                    // == high school feeder zone selected
                    if (whichFilter == "FeederHS") {
                        setMenuState(displayObj, self.zonesMenu, ["A", "S", "A"]);
                        tempLevels = self.dataFilters.levels;

                        // == high school feeder zones apply to middle or elem schools
                        if (tempLevels == "ES") {
                            self.dataFilters.levels = "ES";
                            setMenuState(displayObj, self.levelsMenu, ["D", "A", "S"]);
                            levelObject = filterMenu["Elem"];
                        } else if ((tempLevels == "MS") || (tempLevels == "HS") || (tempLevels == null))  {
                            self.dataFilters.levels = "MS";
                            setMenuState(displayObj, self.levelsMenu, ["D", "S", "A"]);
                            levelObject = filterMenu["Middle"];
                        }

                    // == middle school feeder zone selected
                    } else if (whichFilter == "FeederMS") {

                        // == middle school feeder zones apply to elementary schools only
                        self.dataFilters.levels = "ES";
                        setMenuState(displayObj, self.zonesMenu, ["A", "A", "S"]);
                        setMenuState(displayObj, self.levelsMenu, ["D", "D", "S"]);
                        levelObject = filterMenu["Elem"];

                    // == elementary zone selected
                    } else if (whichFilter == "Elementary") {
                        self.dataFilters.levels = "ES";
                        setMenuState(displayObj, self.zonesMenu, ["A", "A", "A"]);
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "A"]);

                    // == no zone or Ward selected
                    } else {
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "A"]);
                        setMenuState(displayObj, self.zonesMenu, ["S", "A", "A"]);
                    }
                    break;
            }

            if (self.dataFilters.expend == null) {
                clearProfileChart();
            }

            updateHoverText(null);
            checkFilterSelection(self, zonesCollectionObj, whichCategory);
            zonesCollectionObj.getZoneData();
        });
    }

    // ======= ======= ======= resetMenuState ======= ======= =======
    function resetMenuState(displayObj, whichMenu) {
        console.log("resetMenuState");

        // == restore levels menu for new zones selection (e.g. deactivate HS for feeders)
        if (whichMenu == "zones") {
            if (displayObj.dataFilters.zones == "Ward") {
                setMenuState(displayObj, displayObj.zonesMenu, ["S", "A", "A"]);
            } else if (displayObj.dataFilters.zones == "FeederHS") {
                if ((displayObj.dataFilters.levels == "HS") || (displayObj.dataFilters.levels == "MS")) {
                    setMenuState(displayObj, displayObj.levelsMenu, ["D", "S", "A"]);
                } else if (displayObj.dataFilters.levels == "ES") {
                    setMenuState(displayObj, displayObj.levelsMenu, ["D", "A", "S"]);
                }
                setMenuState(displayObj, displayObj.zonesMenu, ["A", "S", "A"]);
            } else if (displayObj.dataFilters.zones == "FeederMS") {
                setMenuState(displayObj, displayObj.levelsMenu, ["D", "D", "S"]);
                setMenuState(displayObj, displayObj.zonesMenu, ["A", "A", "S"]);
            } else {
                setMenuState(displayObj, displayObj.zonesMenu, ["A", "A", "A"]);
            }

        // == set levels menu according to zones selection (e.g. deactivate HS for feeders)
        } else if (whichMenu == "levels") {
            if (displayObj.dataFilters.levels == "HS") {
                if (displayObj.dataFilters.zones == "Ward") {
                    setMenuState(displayObj, displayObj.levelsMenu, ["S", "A", "A"]);
                } else if ((displayObj.dataFilters.zones == "FeederHS") || (displayObj.dataFilters.zones == "FeederMS")) {
                    setMenuState(displayObj, displayObj.levelsMenu, ["D", "S", "A"]);
                }
            } else if (displayObj.dataFilters.levels == "MS") {
                if (displayObj.dataFilters.zones == "Ward") {
                    setMenuState(displayObj, displayObj.levelsMenu, ["A", "S", "A"]);
                } else if ((displayObj.dataFilters.zones == "FeederHS") || (displayObj.dataFilters.zones == "FeederMS")) {
                    setMenuState(displayObj, displayObj.levelsMenu, ["D", "S", "A"]);
                }
            } else if (displayObj.dataFilters.levels == "ES") {
                if (displayObj.dataFilters.zones == "Ward") {
                    setMenuState(displayObj, displayObj.levelsMenu, ["A", "A", "S"]);
                } else if (displayObj.dataFilters.zones == "FeederHS") {
                    setMenuState(displayObj, displayObj.levelsMenu, ["D", "A", "S"]);
                } else if (displayObj.dataFilters.zones == "FeederMS") {
                    setMenuState(displayObj, displayObj.levelsMenu, ["D", "D", "S"]);
                }
            }
        }
    }

    // ======= ======= ======= clearFilterSelctions ======= ======= =======
    function clearFilterSelctions() {
        console.log("clearFilterSelctions");

        setMenuState(displayObj, displayObj.agencyMenu, ["S", "A", "A"]);
        setMenuState(displayObj, displayObj.levelsMenu, ["A", "A", "A"]);
        setMenuState(displayObj, displayObj.expendMenu, ["A", "A", "A"]);
        setMenuState(displayObj, displayObj.zonesMenu, ["S", "A", "A"]);
        displayObj.filterTitlesArray = [];
        displayObj.dataFilters.agency = "All";
        displayObj.dataFilters.levels = null;
        displayObj.dataFilters.expend = null;
        displayObj.dataFilters.zones = "Ward";
        displayObj.dataFilters.math = "spendAmount";
        zonesCollectionObj.zoneGeojson_A = null;
        zonesCollectionObj.zoneGeojson_B = null;
        zonesCollectionObj.zoneGeojson_AB = null;
        zonesCollectionObj.aggregatorArray = [];
        zonesCollectionObj.zoneA = "Ward";
    }

    // ======= ======= ======= findSearchSchool ======= ======= =======
    Display.prototype.findSearchSchool = function(buttonId) {
        console.log("findSearchSchool");

        var self = this;
        var searchSchoolName = $("#searchWindow").val();
        var url = "Data_Schools/DC_OpenSchools_Master_214.csv";
        var filterTitleContainer = $("#filters-selections").children("h2");
        var jsonData, foundDataArray, schoolText, tempSchoolText;

        // ======= get map geojson data =======
        $.ajax({
            dataType: "text",
            url: url
        }).done(function(textData){
            console.log("*** ajax success ***");
            jsonData = CSV2JSON(textData);
            console.dir(jsonData);
            foundDataArray = buildSearchArray(jsonData, searchSchoolName);
            tempSchoolText = displayFoundSchool(foundDataArray);
            schoolText = tempSchoolText.substring(0, tempSchoolText.length - 2);
            $(filterTitleContainer).html(schoolText);
            $("#searchWindow").val("");

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
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
            var checkSchool = schoolName.indexOf(searchSchoolName);
            if (checkSchool > -1) {
                foundDataArray.push([i, nextSchool]);
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
            if (foundDataArray.length > 1) {
                $(filterTitleContainer).css("font-size", "14px");
                schoolText = "<span class='filterLabel'>Multiple schools: </span>";
                hoverText = "Re-enter detailed name (from list)"
                updateHoverText(hoverText);
            } else {
                displayObj.activateClearButton();
                makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, foundDataArray[0][1]);
                hiliteSchoolMarker(foundDataArray);
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

    // ======= ======= ======= hiliteSchoolMarker ======= ======= =======
    function hiliteSchoolMarker(foundDataArray) {
        console.log("hiliteSchoolMarker");

        var schoolMarker = schoolsCollectionObj.schoolMarkersArray[foundDataArray[0][0]];
        console.dir(schoolMarker);

        schoolMarker.icon.fillColor = "white";
        schoolMarker.icon.strikeColor = "black";
        schoolMarker.icon.strokeWeight = 6;
        schoolMarker.icon.scale = 0.4;
        schoolMarker.setMap(map);

        setTimeout(resetMarker, 3000);

        function resetMarker() {
            schoolMarker.icon.fillColor = schoolMarker.defaultColor;
            schoolMarker.icon.scale = 0.2;
            schoolMarker.icon.strikeColor = "purple";
            schoolMarker.icon.strokeWeight = 2;
            schoolMarker.setMap(map);
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
            console.log("******* zoneGeojson_A");
            console.dir(self.zoneGeojson_A );

            // == aggregate for urlA zones
            if (self.aggregatorArray.length == 0) {
                makeZoneAggregator(self, self.zoneGeojson_A);
            }
            console.log("  self.aggregatorArray: ", self.aggregatorArray);

            // == get secondary map data for urlB
            if (feederFlag == true) {
                self.getFeederZones(urlB);
            } else {
                schoolsCollectionObj.getSchoolData();
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



    // ======= ======= ======= getSchoolData ======= ======= =======
    SchoolsCollection.prototype.getSchoolData = function() {
        console.log("\n----- getSchoolData -----");
        console.log("  zonesCollectionObj.zoneA: ", zonesCollectionObj.zoneA);
        console.log("  displayObj.displayMode: ", displayObj.displayMode);

        var self = this;
        var presetMode = displayObj.displayMode;

        if ((displayObj.displayMode == "storyMap")  || (displayObj.displayMode == "toolMap")) {
            var websitePrefix = "prototypes/filter-map/";
        } else {
            var websitePrefix = "";
        }

        // ======= get school data =======
        if (this.jsonData == null) {
            $.ajax({
                url: websitePrefix + "Data_Schools/DC_OpenSchools_Master_214.csv",
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
            var sharedAddressArray = [];
            var selectedCodesArray = [];
            var selectedNamesArray = [];
            var rejectedCodesArray = [];
            var selectedSchoolsArray = [];
            var rejectedAggregatorArray = [];
            var nextSchool, schoolData, selectSchool, rejectedAggregatorCode;

            // ======= SCHOOL DATA LOOP =======
            if (displayObj.displayMode != "noSchools") {
                for (var i = 0; i < jsonData.length; i++) {
                    var filterFlagCount = 0;

                    // == check school with filter settings
                    nextSchool = jsonData[i];
                    selectSchool = self.checkFilterMatch(nextSchool);

                    // == build arrays of selected/not selected schools
                    if (selectSchool == true) {
                        schoolIndex++;
                        schoolData = getDataDetails(nextSchool, schoolIndex);

                        selectedSchoolsArray.push(schoolData)
                        selectedCodesArray.push(schoolData.schoolCode)
                        selectedNamesArray.push(processSchoolName(schoolData.schoolName))

                        // == store school that matches school zone (e.g. Deal Middle School with Deal Middle School Zone)
                        if ((displayObj.dataFilters.expend != null) && (displayObj.dataFilters.levels != null) && (displayObj.dataFilters.zones == null)) {
                            captureSchoolData(zonesCollectionObj, displayObj, schoolData, schoolIndex);

                        // == aggregate multiple school data for selected zone type (e.g all-school totals for Ward 3)
                        } else {
                            rejectedAggregatorCode = aggregateZoneData(zonesCollectionObj, displayObj, schoolData, schoolIndex);
                            if (rejectedAggregatorCode) {
                                rejectedAggregatorArray.push(rejectedAggregatorCode);
                            }
                        }

                        // == handle multiple schools at same Address
                        if (schoolData.unqBuilding == 2) {
                            sharedAddressArray.push(schoolData.schoolAddress);
                        }

                    } else {
                        rejectedCodesArray.push(nextSchool.School_ID);
                    }
                }
                self.sharedAddressArray = sharedAddressArray;
                self.selectedSchoolsArray = selectedSchoolsArray;
                // checkSchoolData(zonesCollectionObj, schoolsCollectionObj, selectedSchoolsArray, selectedCodesArray, rejectedCodesArray, rejectedAggregatorArray);

                // ======= make map layers ======
                if (selectedSchoolsArray.length > 0) {
                    zonesCollectionObj.makeZoneLayer();
                    self.makeSchoolLayer();
                } else {
                    displayFilterMessage("Sorry, no schools matched criteria.  Click CLEAR");
                    clearProfileChart();
                }

            } else {
                zonesCollectionObj.makeZoneLayer();
                self.makeSchoolLayer();
            }
        }
    }

    // ======= ======= ======= checkFilterMatch ======= ======= =======
    SchoolsCollection.prototype.checkFilterMatch = function(nextSchool) {
        // console.log("checkFilterMatch");

        var checkAgency = false;
        var school = nextSchool.School;
        var schoolType = nextSchool.Agency;
        var schoolLevel = nextSchool.Level;
        var schoolWard = "Ward " + nextSchool.Ward;
        var schoolFeederHS = nextSchool.FeederHS;
        var schoolFeederMS = nextSchool.FeederMS;
        var shortName = processSchoolName(school);
        // checkFilterData(school, schoolType, schoolLevel, schoolWard, schoolFeederMS, schoolFeederHS);

        // == check agency match
        if (displayObj.dataFilters.agency) {
            if (displayObj.dataFilters.agency != "All") {
                if (displayObj.dataFilters.agency == "District") {
                    checkAgency = "DCPS";
                } else if (displayObj.dataFilters.agency == "Charter") {
                    checkAgency = "PCS";
                }
                if (checkAgency == schoolType) {
                    var agencyMatch = true;
                } else {
                    var agencyMatch = false;
                }
                // var agencyMatch = (checkAgency) ? true : false;
            } else {
                var agencyMatch = true;
            }
        } else {
            var agencyMatch = true;
        }
        // console.log("  checkAgency: ", checkAgency);


        // == check levels match
        if (displayObj.dataFilters.levels) {
            var levelsMatch = (displayObj.dataFilters.levels == schoolLevel) ? true : false;
        } else {
            var levelsMatch = true;
        }

        // == return match result
        if ((levelsMatch == true) && (agencyMatch == true)) {
            // console.log("******* selected: ", shortName);
            return true;
        } else {
            return false;
        }
    }

    // ======= ======= ======= checkFilterMatch ======= ======= =======
    function checkFilterMatch(school, schoolType, schoolLevel, schoolWard, schoolFeederMS, schoolFeederHS) {
        console.log("checkFilterMatch");

        console.log("******* school: ", school);
        console.log("  schoolAgency: ", schoolType);
        console.log("  schoolLevel: ", schoolLevel);
        console.log("  schoolWard: ", schoolWard);
        console.log("  schoolFeederMS: ", schoolFeederMS);
        console.log("  schoolFeederHS: ", schoolFeederHS);
        console.log("  displayObj.dataFilters.agency: ", displayObj.dataFilters.agency);
        console.log("  displayObj.dataFilters.levels: ", displayObj.dataFilters.levels);
        console.log("  displayObj.dataFilters.zones: ", displayObj.dataFilters.zones);
    }

    // ======= ======= ======= loadAutoComplete ======= ======= =======
    SchoolsCollection.prototype.loadAutoComplete = function() {
        console.log("loadAutoComplete");

        var self = this;

        if ((displayObj.displayMode == "storyMap")  || (displayObj.displayMode == "toolMap")) {
            var websitePrefix = "prototypes/filter-map/";
        } else {
            var websitePrefix = "";
        }

        // ======= get selected data =======
        $.ajax({
            url: "Data_Schools/DC_OpenSchools_Master_214.csv",
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



    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONE LAYER ======= ======= ======= ======= =======



    ZonesCollection.prototype.makeZoneLayer = function() {
        console.log("\n----- makeZoneLayer -----");

        var self = this;
        var colorIndex = -1;
        var featureIndex = -1;
        var itemOpacity = 0.5;
        var strokeColor = "purple";
        var strokeWeight = 2;
        var itemColor, itemOpacity, centerLatLng, zoneName;

        // ======= ======= ======= cleanup ======= ======= =======
        de_activateZoneListeners(this);
        var featureCount = 0
        map.data.forEach(function(feature) {
            if (feature) {
                featureCount++;
                itemName = feature.getProperty('itemName');
                // console.log("  removing: ", featureCount, "/", itemName);
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
        console.log("  zoneAcount: ", zoneAcount);
        console.log("  zoneBcount: ", zoneBcount);
        console.log("  displayObj.dataFilters.levels: ", displayObj.dataFilters.levels);
        console.log("  displayObj.dataFilters.zones: ", displayObj.dataFilters.zones);

        // ======= ======= ======= calculate min, max, increment, average, median ======= ======= =======
        if (displayObj.dataFilters.expend) {
            this.dataIncrement = doTheMath(this, displayObj);
        }

        // ======= FEATURES DATA LOOP =======
        map.data.forEach(function(feature) {
            featureIndex++;

            // ======= get and validate name for each feature =======
            zoneName = removeAbbreviations(feature.getProperty('NAME'))

            // ======= get center lat lng of feature =======
            centerLatLng = makeZoneGeometry(feature);

            // ======= set feature properties =======
            feature.setProperty('itemName', zoneName);
            feature.setProperty('center', centerLatLng);
            feature.setProperty('index', featureIndex);

            // ======= store feature properties =======
            self.zoneFeaturesArray.push(feature);
        });
        console.log("*** new features Ct ", self.zoneFeaturesArray.length);

        // ======= FEATURES FORMATTING LOOPS =======
        var featureIndex = -1;
        var dataDelayCount = 0;
        if (zoneBcount > 0) {

            // == elementary or middle school zones in feeder areas
            console.log("*** LOWER ZONES ***");
            for (var i = 0; i < zoneBcount; i++) {
                var start = new Date().getTime();
                feature = self.zoneFeaturesArray[i];
                nextName = feature.getProperty('itemName');
                featureIndex++;

                zoneFormatArray = getZoneFormat(self, displayObj, featureIndex, nextName, "lower");

                feature.setProperty('itemColor', zoneFormatArray[0]);
                feature.setProperty('strokeColor', zoneFormatArray[1]);
                feature.setProperty('strokeWeight', zoneFormatArray[2]);
                feature.setProperty('itemOpacity', zoneFormatArray[3]);

                setFeatureStyle(feature);

                var end = new Date().getTime();
                var time = end - start;
                // console.log("*** LOWER layer");
                // console.log("    index/name: ", featureIndex, "/", nextName);
                // console.log("    zoneFormatArray: ", zoneFormatArray);
                if (time > 0) {
                    dataDelayCount++;
                    // console.log("    --time: ", time);
                }
            }
            console.log(" featureCount: ", featureIndex + 1);
            console.log(" dataDelayCount: ", dataDelayCount);

            // == feeder zones or wards
            console.log("*** UPPER ZONES ***");
            for (var i = zoneBcount; i < self.zoneFeaturesArray.length; i++) {
                var start = new Date().getTime();
                feature = self.zoneFeaturesArray[i];
                nextName = feature.getProperty('itemName');
                featureIndex++;

                zoneAIndex = featureIndex - zoneBcount;
                zoneFormatArray = getZoneFormat(self, displayObj, zoneAIndex, nextName, "upper");

                feature.setProperty('itemColor', zoneFormatArray[0]);
                feature.setProperty('strokeColor', zoneFormatArray[1]);
                feature.setProperty('strokeWeight', zoneFormatArray[2]);
                feature.setProperty('itemOpacity', zoneFormatArray[3]);

                setFeatureStyle(feature);

                var end = new Date().getTime();
                var time = end - start;
                // console.log("*** UPPER layer");
                // console.log("    index/name: ", featureIndex, "/", nextName);
                // console.log("    zoneFormatArray: ", zoneFormatArray);
                if (time > 0) {
                    dataDelayCount++;
                    // console.log("    --time: ", time);
                }
            }
            console.log(" featureCount: ", featureIndex + 1);
            console.log(" dataDelayCount: ", dataDelayCount);

        // == single zone layer
        } else {
            for (var i = 0; i < self.zoneFeaturesArray.length; i++) {
                var start = new Date().getTime();
                feature = self.zoneFeaturesArray[i];
                nextName = feature.getProperty('itemName');
                featureIndex++;
                colorIndex++;

                zoneFormatArray = getZoneFormat(self, displayObj, featureIndex, nextName, "single");

                feature.setProperty('itemColor', zoneFormatArray[0]);
                feature.setProperty('strokeColor', zoneFormatArray[1]);
                feature.setProperty('strokeWeight', zoneFormatArray[2]);
                feature.setProperty('itemOpacity', zoneFormatArray[3]);

                setFeatureStyle(feature);

                var end = new Date().getTime();
                var time = end - start;
                // console.log("*** SINGLE layer");
                // console.log("    index/name: ", featureIndex, "/", nextName);
                // console.log("    zoneFormatArray: ", zoneFormatArray);
                if (time > 0) {
                    dataDelayCount++;
                    console.log("    --time: ", time);
                }
            }
            console.log(" featureCount: ", featureIndex + 1);
            console.log(" dataDelayCount: ", dataDelayCount);
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

        // ======= ======= ======= show rankings chart ======= ======= =======
        // console.log("  displayObj.dataFilters.levels: ", displayObj.dataFilters.levels);
        // console.log("  displayObj.dataFilters.zones: ", displayObj.dataFilters.zones);
        // console.log("  displayObj.dataFilters.expend: ", displayObj.dataFilters.expend);
        if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
            if (displayObj.dataFilters.expend) {
                makeRankChart(zonesCollectionObj, schoolsCollectionObj, displayObj, zoneBcount);
            } else {
                console.log("  displayObj.displayMode: ", displayObj.displayMode);
                if (displayObj.displayMode == "storyMap") {
                    var chartHtml = "<div id='chart'>&nbsp;</div>";
                    $("#chart-container").append(chartHtml);
                }
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
            var itemName = event.feature.getProperty('itemName');
            updateHoverText(itemName);
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
            // var menuObject = filterMenu[zoneA];
            // menuObject.value = zoneName;
            // displayObj.dataFilters.zone = zoneA;
            displayObj.dataFilters.selectedZone = zoneName;

            updateHoverText(zoneName);
            displayFilterMessage(displayObj, zoneName, "add");
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
            unqBuilding = nextSchoolData.unqBuilding;
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
            if (displayObj.displayMode == "storyMap") {
                var iconSize = 0.15;
            } else {
                var iconSize = 0.2;
            }
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
                unqBuilding: unqBuilding,
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
        console.log("\n******* ******* arrays check *******");
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

        // function schoolMarkerOverlay(bounds, image, map) {
        //     console.log("schoolMarkerOverlay");
        //
        //     // Initialize all properties.
        //     this.bounds_ = bounds;
        //     this.image_ = image;
        //     this.map_ = map;
        //
        //     // Define a property to hold the image's div. We'll
        //     // actually create this div upon receipt of the onAdd()
        //     // method so we'll leave it null for now.
        //     this.div_ = null;
        //
        //     // Explicitly call setMap on this overlay.
        //     this.setMap(map);
        // }
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
            var unqBuilding = this.unqBuilding;
            if (unqBuilding == 2) {
                schoolName = "multiple schools/shared address";
                schoolType = "";
            }
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
                var schoolIndex = this.schoolIndex;
                var schoolName = this.schoolName;
                var schoolCode = this.schoolCode;
                var unqBuilding = this.unqBuilding;
                console.log("  schoolCode: ", schoolCode);
                if (unqBuilding == 2) {
                    multiSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, null, schoolIndex);
                } else {
                    makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, null, schoolIndex);
                }
            });
        }
    }

    // ======= ======= ======= setFilterSelections ======= ======= =======
    function setFilterSelections(agency, levels, expend, zones, math, presetMode) {
        console.log("******* setFilterSelections *******");

        // == pre-defined filter settings for introductory map displays
        displayObj.displayMode = presetMode;
        clearFilterSelctions();
        updateHoverText(null);
        initMap(zonesCollectionObj, displayObj);

        // == agency
        if (agency) {
            displayObj.dataFilters.agency = agency;
            if (zonesCollectionObj.aggregatorArray.length > 0) {
                clearZoneAggregator();
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
    console.log("  displayObj.displayMode: ", displayObj.displayMode);

    if (displayObj.displayMode != "storyMap") {
        this.jsonData = null;
        displayObj.activateFilterMenus();
        displayObj.makeSearchAndHoverDisplay();
        displayObj.activateClearButton();
        setMenuState(displayObj, displayObj.agencyMenu, ["S", "A", "A"]);
        setMenuState(displayObj, displayObj.zonesMenu, ["S", "A", "A"]);
        schoolsCollectionObj.loadAutoComplete();
        checkFilterSelection(displayObj, zonesCollectionObj, "init");
        initFloatingWindows();
        zonesCollectionObj.getZoneData();
    }

    // == see getZoneData for parameter values
    return setFilterSelections;
}
