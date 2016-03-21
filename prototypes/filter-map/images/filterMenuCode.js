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
function Menu() {
    console.log("Menu");
}

// ======= ======= ======= initDataObjects ======= ======= =======
function initDataObjects() {
    console.log("initDataObjects");
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
        for (var j = 1; j < nextMenu.length; j++) {
            nextFilter = nextMenu[j];
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
                    if (displayObj.dataFilters.levels == "HS") {
                        setMenuState(displayObj, self.levelsMenu, ["S", "A", "A"]);
                    } else if (displayObj.dataFilters.levels == "MS") {
                        setMenuState(displayObj, self.levelsMenu, ["A", "S", "A"]);
                    } else if (displayObj.dataFilters.levels == "ES") {
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "S"]);
                    } else {
                        setMenuState(displayObj, self.levelsMenu, ["A", "A", "A"]);
                    }
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
    setMenuState(displayObj, displayObj.zonesMenu, ["S", "A", "A"]);
    setMenuState(displayObj, displayObj.expendMenu, ["A", "A", "A"]);
    displayObj.filterTitlesArray = [];
    displayObj.dataFilters.agency = "All";
    displayObj.dataFilters.levels = null;
    displayObj.dataFilters.zones = "Ward";
    displayObj.dataFilters.expend = null;
    displayObj.dataFilters.math = "spendAmount";
    zonesCollectionObj.zoneGeojson_A = null;
    zonesCollectionObj.zoneGeojson_B = null;
    zonesCollectionObj.zoneGeojson_AB = null;
    zonesCollectionObj.aggregatorArray = [];
    zonesCollectionObj.zoneA = "Ward";
    displayObj.filterTitlesArray = [displayObj.agencyMenu[1].text, displayObj.zonesMenu[1].text];
    console.log("  displayObj.filterTitlesArray: ", displayObj.filterTitlesArray);
    updateFilterSelections(displayObj);
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

// ======= ======= ======= HTML ======= ======= =======
// ======= ======= ======= HTML ======= ======= =======
// ======= ======= ======= HTML ======= ======= =======


<!-- ======= filters ======= -->
<div class="column col-md-12 mapCol">
    <div id="popup" class="filter-container">
        <table id="filters-table">
            <tr id="drag_bar" class="filters-banner">
                <td class="title-text" colspan="4">
                    <p id="filter-title">filters</p>
                    <div id='clear-button'><span class='btn-text'>clear</span></div>
                </td>
            </tr>
            <tr class="filter-row">
                <td class="filter-label">schools</td>
                <td><div id="All" class="filter agency active"><a href="#" class="filter-link">all</a></div></td>
                <td><div id="District" class="filter agency active"><a href="#" class="filter-link">DCPS</a></div></td>
                <td><div id="Charter" class="filter agency active"><a href="#" class="filter-link">PCS</a></div></td>
            </tr>
            <tr class="filter-row">
                <td class="filter-label">levels</td>
                <td><div id="High" class="filter levels active"><a href="#" class="filter-link">HS</a></div></td>
                <td><div id="Middle" class="filter levels active"><a href="#" class="filter-link">MS</a></div></td>
                <td><div id="Elem" class="filter levels active"><a href="#" class="filter-link">ES</a></div></td>
            </tr>
            <tr class="filter-row">
                <td class="filter-label">zones</td>
                <td><div id="Ward" class="filter zones active"><a href="#" class="filter-link">W</a></div></td>
                <td><div id="FeederHS" class="filter zones active"><a href="#" class="filter-link">HS</a></div></td>
                <td><div id="FeederMS" class="filter zones active"><a href="#" class="filter-link">MS</a></div></td>
            </tr>
            <tr class="filter-row">
                <td class="filter-label">spending</td>
                <td><div id="spendLifetime" class="filter expend active"><a href="#" class="filter-link">total</a></div></td>
                <td><div id="spendPast" class="filter expend active"><a href="#" class="filter-link">past</a></div></td>
                <td><div id="spendPlanned" class="filter expend active"><a href="#" class="filter-link">future</a></div></td>
            </tr>
        </table>
    </div>

    <div id="toolMap-container"></div>
    <div id='profile-container'></div>
    <div id='chart-container'></div>
