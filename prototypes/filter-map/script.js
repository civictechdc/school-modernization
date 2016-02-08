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
    var schoolObjectObj;
    var zoneObjectObj;
    var mapLayersObj;
    var displayObj;

    // ======= ======= ======= initMenuObjects ======= ======= =======
    function initMenuObjects() {
        console.log("initMenuObjects");

        // == filter object properties: id, category, text, callback
        filterMenu = new Menu("filterMenu");

        // == Enrollment, AtRisk, SpecEd, EngLang
        filterMenu.Enrollment = { id:"Enrollment", category:"students", text:"percent Enrolled", column:"Total_Enrolled", value:null };
        filterMenu.AtRisk = { id:"AtRisk", category:"students", text:"percent At-Risk", column:"At_Risk", value:null };
        filterMenu.SpecEd = { id:"SpecEd", category:"students", text:"percent Spec Ed", column:"SpecEd_fake", value:null };
        filterMenu.EngLang = { id:"EngLang", category:"students", text:"percent ESL", column:"Limited_English", value:null };

        // == Ward, FeederMS, FeederHS, Quadrant
        filterMenu.Ward = { id:"Ward", category:"zone", text:"Wards", column:"WARD", value:null };
        filterMenu.FeederHS = { id:"FeederHS", category:"zone", text:"High School Feeders", column:"FeederHS", value:null };
        filterMenu.FeederMS = { id:"FeederMS", category:"zone", text:"Middle School Feeders", column:"FeederMS", value:null };
        filterMenu.Elementary = { id:"Elementary", category:"zone", text:"Elementary Zones", column:null, value:null };
        filterMenu.Quadrant = { id:"Quadrant", category:"zone", text:"Quadrant", column:null, value:null };

        // == District, Charter
        filterMenu.District = { id:"District", category:"schools", text:"District Schools", column:"Agency", value:"DCPS" };
        filterMenu.Charter = { id:"Charter", category:"schools", text:"Charter Schools", column:"Agency", value:"PCS" };

        // == PK_K, Elem, Middle, High, ES_MS, MS_HS, Alt, SPED
        filterMenu.PK3K = { id:"PK3K", category:"schools", text:"PK-K Schools", column:"Level", value:"PK3-K" };
        filterMenu.Elem = { id:"Elem", category:"schools", text:"Elementary Schools", column:"Level", value:"ES" };
        filterMenu.Middle = { id:"Middle", category:"schools", text:"Middle Schools", column:"Level", value:"MS" };
        filterMenu.High = { id:"High", category:"schools", text:"High Schools", column:"Level", value:"HS" };
        filterMenu.ES_MS = { id:"ES_MS", category:"schools", text:"Elem/Middle Schools", column:"Level", value:"ES/MS" };
        filterMenu.MS_HS = { id:"MS_HS", category:"schools", text:"Middle/High Schools", column:"Level", value:"MS/HS" };
        filterMenu.Alt = { id:"Alt", category:"schools", text:"Alternative Schools", column:"Level", value:"ALT" };
        filterMenu.SPED = { id:"SPED", category:"schools", text:"Spec Ed Schools", column:"Level", value:"SPED" };

        // == spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll
        filterMenu.spendPast = { id:"spendPast", category:"expenditures", text:"Past Spending", column:"MajorExp9815", value:null };
        filterMenu.spendLifetime = { id:"spendLifetime", category:"expenditures", text:"Total Spending", column:"LifetimeBudget", value:null };
        filterMenu.spendPlanned = { id:"spendPlanned", category:"expenditures", text:"Planned Spending", column:"TotalAllotandPlan1621", value:null };
        filterMenu.spendSqFt = { id:"spendSqFt", category:"expenditures", text:"Current/SqFt", column:"SpentPerSqFt", value:null };
        filterMenu.spendEnroll = { id:"spendEnroll", category:"expenditures", text:"Current/Student", column:"SpentPerEnroll", value:null };

        // == Capacity
        filterMenu.Capacity = { id:"Capacity", category:"buildings", text:"Capacity", column:"maxOccupancy", value:null };
    }
    function Display() {
        console.log("Display");
        this.zoneMenu = ["zone", filterMenu.Ward, filterMenu.FeederHS, filterMenu.FeederMS, filterMenu.Elementary, filterMenu.Quadrant];
        this.levelsMenu = ["levels", filterMenu.PK3K, filterMenu.Elem, filterMenu.Middle, filterMenu.High, filterMenu.ES_MS, filterMenu.MS_HS, filterMenu.Alt, filterMenu.SPED];
        this.agencyMenu = ["agency", filterMenu.District, filterMenu.Charter];
        this.expendMenu = ["expend", filterMenu.spendPast, filterMenu.spendLifetime, filterMenu.spendPlanned, filterMenu.spendSqFt, filterMenu.spendEnroll];
        this.studentsMenu = ["students", filterMenu.Enrollment, filterMenu.AtRisk, filterMenu.SpecEd, filterMenu.EngLang];
        this.filterMenusArray = [this.zoneMenu, this.expendMenu, this.levelsMenu, this.agencyMenu, this.studentsMenu];
        this.filterTitlesArray = [];
        this.categoryLabels = ["zone", "spending", "school type", "district/charter", "students"];
        this.groupLabels = ["where", "what", "who", "&nbsp;", "&nbsp;"];
        this.dataFilters = { "zone": null, "expend": null, "students": null, "levels": null, "agency": null, "selectedZone": null, "selectedSchool": null, };
    }
    function ZonesCollection() {
        console.log("ZonesCollection");
        this.zoneMode = "default";       // default, indexed, selected, gradient
        this.zoneType = "FeederHS";       // FeederHS, FeederMS, Elementary, Ward, Quadrant
        // this.dataSource = null;         // geojson file
        this.zoneGeojson = null;         // geojson data
        this.zoneDataState = "init";      // init, update, clear
        this.zoneDataArray = [];
        this.zoneNamesArray = [];
        this.mapListenersArray = [];
        this.indexColorsArray = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod"];
        this.dataColorsArray = ["#0000ff", "#2200ee", "#4400dd", "#6600cc", "#8800aa", "#aa0088", "#cc0066", "#dd0044", "#ee0022", "#ff0000"];
        this.defaultColor = "white";
        this.dataIncrement = 0;
        this.active = false;
    }
    function ZoneObject() {
        console.log("ZoneObject");
        this.name = null;
        this.index = null;
        this.color = null;
        this.center = null;
        this.zoneData = { "school": null, "schoolCode": null, "address": null };
    }
    function SchoolsCollection() {
        console.log("SchoolsCollection");
        this.schoolMode = "default";       // default, indexed, selected, gradient
        this.dataSource = null;
        this.zoneFilter = null;
        this.levelFilter = null;
        this.agencyFilter = null;
        this.studentFilter = null;
        this.schoolColorsArray = [];
        this.schoolMarkersArray = [];
        this.selectedSchoolsArray = [];
        this.selectedNamesArray = [];
        this.selectedDataArray = [];
        this.jsonData = null;         // geojson data
        this.active = false;
    }
    function SchoolObject() {
        console.log("SchoolObject");
        this.index = null;
        this.name = null;
        this.center = null;
        this.color = null;
        this.schoolData = { school: null, schoolCode: null, address: null };
    }
    function MapLayers(whichChart) {
        console.log("Chart");
        this.name = whichChart;
        this.geojsonFeatures = [];
        this.mapListenersArray = [];
        this.selectedSchoolData = [];
        this.schoolMarkersArray = [];
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
        schoolObjectObj = new SchoolObject();
        zoneObjectObj = new ZoneObject();
        mapLayersObj = new MapLayers();
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
        menuHtml += this.initChartDisplay();
        $(popupContainer).append(menuHtml);

        // == activate individual filter selectors after appended to DOM
        for (var i = 0; i < this.filterMenusArray.length; i++) {
            nextMenu = this.filterMenusArray[i];
            this.activateFilterMenu(nextMenu);
        }
        this.activateSearchButton("searchButton");
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
        // console.log("makeFilterMenu");

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

    // ======= ======= ======= initChartDisplay ======= ======= =======
    Display.prototype.initChartDisplay = function() {
        // console.log("initChartDisplay");
        var chartHtml = "<div id='chart-container'>";
        chartHtml += "<div id='chart-title' class='title_bar'><p>data chart</p></div>";
        chartHtml += "<div id='chart'></div></div>";
        return chartHtml;
    }

    // ======= ======= ======= setMenuItem ======= ======= =======
    Display.prototype.setMenuItem = function(whichCategory, whichFilter) {
        console.log("setMenuItem");
        console.log("  whichCategory: ", whichCategory);
        console.log("  whichFilter: ", whichFilter);

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
        // console.log("activateFilterMenu");

        // == activate filter click events
        for (var i = 1; i < whichMenu.length; i++) {
            nextItem = whichMenu[i];
            this.activateFilterSelect(nextItem);
        }
    }

    // ======= ======= ======= activateSearchButton ======= ======= =======
    Display.prototype.activateSearchButton = function(buttonId) {
        console.log("activateSearchButton");

        var self = this;
        var buttonElement = $("#" + buttonId);

        // ======= ======= ======= selectFilter ======= ======= =======
        $(buttonElement).off("click").on("click", function(event){
            console.log("\n-- search -- ");
            self.findSearchSchool();
        });
    }

    // ======= ======= ======= activateClearButton ======= ======= =======
    Display.prototype.activateClearButton = function() {
        console.log("activateClearButton");

        var self = this;
        $("#clear-button").css("display", "block");

        // ======= ======= ======= selectFilter ======= ======= =======
        $("#clear-button").off("click").on("click", function(event){
            console.log("\n======= clear ======= ");

            // this.dataFilters = { "zone": null, "expend": null, "students": null, "levels": null, "agency": null, "selectedZone": null, "selectedSchool": null, };
            $("#profile").remove();
            filterText = "your filters";
            var filterTitleContainer = $("#filters-title").children("h2");
            $(filterTitleContainer).removeClass("filterList");
            $(filterTitleContainer).text(filterText);
            self.dataFilters.selectedZone = null;
            self.dataFilters.selectedSchool = null;
            zonesCollectionObj.getZoneData();
        });
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
                var schoolNamesArray = [];
                if (foundDataArray.length > 1) {
                    schoolText = "<span class='filterLabel'>Multiple schools: </span>";
                } else {
                    schoolText = "<span class='filterLabel'>Your school: </span>";
                }
                $(filterTitleContainer).addClass("filterList");
                for (var i = 0; i < foundDataArray.length; i++) {
                    nextSchool = foundDataArray[i];
                    nextSchoolName = nextSchool.School;
                    schoolText += nextSchoolName + ", ";
                    schoolNamesArray.push(nextSchoolName);
                }
                self.dataFilters.selectedSchool = schoolNamesArray;
            } else {
                schoolText = "<p>No data.  Please try again.</p>";
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
        // console.log("activateFilterSelect");

        // == id ties DOM element to menu object
        var self = this;
        var nextId = nextItem.id;
        var nextElement = $("#" + nextId);

        // ======= ======= ======= selectFilter ======= ======= =======
        $(nextElement).off("click").on("click", function(event){
            console.log("\n======= selectFilter ======= ");
            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

            var classList = $(this).attr('class').split(/\s+/);
            var whichCategory = classList[1];
            var whichFilter = this.id;
            var menuObject = filterMenu[whichFilter];
            var whichColumn = menuObject.column;
            var whichValue = menuObject.value;
            var htmlString;
            console.log("  whichCategory: ", whichCategory);
            console.log("  whichFilter: ", whichFilter);
            console.log("  whichValue: ", whichValue);

            event.stopImmediatePropagation();

            // == store selected filter value on display object (zone, levels, agency, expend, students)
            switch(whichCategory) {
                case "zone":
                    zonesCollectionObj.zoneType = whichFilter;
                    self.dataFilters.zone = whichFilter;
                    break;
                case "expend":
                    self.dataFilters.expend = whichFilter;
                    break;
                case "levels":
                    self.dataFilters.levels = whichValue;
                    break;
                case "agency":
                    self.dataFilters.agency = whichValue;
                    break;
                case "students":
                    self.dataFilters.students = whichFilter;
                    break;
            }
            checkFilterSelection(self, 335);

            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

            updateFilterTitles(self, menuObject.text, "add");
            self.setMenuItem(whichCategory, whichFilter);
            zonesCollectionObj.getZoneData();
        });
    }

    // ======= ======= ======= activateFilterRelease ======= ======= =======
    Display.prototype.activateFilterRelease = function(selectedFilterElement) {
        // console.log("activateFilterRelease");

        var self = this;
        var menuHtml;

        // ======= ======= ======= releaseFilter ======= ======= =======
        $(selectedFilterElement).off("click").on("click", function(event){
            console.log("\n======= releaseFilter ======= ");
            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

            var whichCategory = this.id;

            for (var i = 0; i < self.filterMenusArray.length; i++) {
                nextMenu = self.filterMenusArray[i];
                checkCategory = self.filterMenusArray[i][0];
                if (checkCategory == whichCategory) {
                    self.dataFilters[whichCategory] = null;
                    filterElement = $("#" + whichCategory);
                    var whichFilter = $(filterElement).children("ul").children("li").children("a").attr('id');
                    if (whichFilter) {
                        var menuObject = filterMenu[whichFilter];
                        var filterText = menuObject.text;
                        selectedFilterElement.children("ul").remove();
                        var menuHtml = "<ul>";
                        menuHtml += self.makeFilterMenu(nextMenu);
                        selectedFilterElement.append(menuHtml);
                        self.activateFilterMenu(nextMenu);
                        updateFilterTitles(self, filterText, "remove");
                        break;
                    } else {
                        console.log("ERROR: no filter on menu to release");
                    }
                }
            }
            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);
            checkFilterSelection(self, 384);
            // zonesCollectionObj.getZoneData();
        });
    }



    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= ZONES ======= ======= ======= ======= =======

    // ======= ======= ======= getZoneData ======= ======= =======
    ZonesCollection.prototype.getZoneData = function() {
        console.log("\n----- getZoneData -----");
        console.log("*** zoneType ***", zonesCollectionObj.zoneType);
        console.log("*** Filters ***", displayObj.dataFilters);

        var self = this;

        // ======= get map geojson data =======
        $.ajax({
            dataType: "json",
            url: getZoneUrl(displayObj.dataFilters.zone)      // defaults to FeederHS
        }).done(function(geoJsonData, featureArray){
            console.log("*** ajax success ***");
            console.dir(geoJsonData);

            self.zoneGeojson = geoJsonData;
            console.log("  self.zoneType: ", self.zoneType);
            console.log("  self.zoneMode: ", self.zoneMode);

            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

            self.zoneMode = setZoneMode(displayObj.dataFilters.zone, displayObj.dataFilters.expend, displayObj.dataFilters.selectedZone);

            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

            console.log("  self.zoneType: ", self.zoneType);
            console.log("  self.zoneMode: ", self.zoneMode);
            if (self.zoneMode == "default") {
                makeZoneAggregator(self);
                // self.zoneType = "FeederHS";
            } else {
                clearZoneAggregator(self);
            }

            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

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
        console.log("*** zoneType ***", zonesCollectionObj.zoneType);
        console.log("*** Filters ***", displayObj.dataFilters);

        var self = this;

        // ======= get selected data =======
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

            // ======= get school codes for selected zone, level and type =======
            var selectedCodesArray = [];
            var selectedDataArray = [];
            var nextSchool, school, schoolWard, schoolFeederMS, schoolFeederHS, schoolAgency, schoolLevel, selectSchool;

            for (var i = 0; i < jsonData.length; i++) {
                var filterFlagCount = 0;

                // == zone, level, agency filters
                nextSchool = jsonData[i];
                school = nextSchool.School;
                schoolCode = nextSchool.SCHOOLCODE;
                schoolWard = nextSchool.WARD;
                schoolFeederMS = nextSchool.FeederMS;
                schoolFeederHS = nextSchool.FeederHS;
                schoolAgency = nextSchool.Agency;
                schoolLevel = nextSchool.Level;

                selectSchool = self.checkFilterMatch(schoolWard, schoolFeederMS, schoolFeederHS, schoolAgency, schoolLevel);
                displayObj.filterList

                // == build array of schools that match filters
                if (selectSchool) {
                    schoolData = getDataDetails(nextSchool);
                    selectedDataArray.push(schoolData)
                    selectedCodesArray.push(schoolData.schoolCode)
                    if (zonesCollectionObj.zoneMode == "gradient") {
                        aggregateZoneData(zonesCollectionObj, displayObj, schoolData);
                    }
                } else {
                    // console.log(schoolCode " school not selected");
                }
            }
            self.selectedSchoolsArray = selectedDataArray;
            console.log("  self.selectedSchoolsArray: ", self.selectedSchoolsArray.length);
            console.log("  zonesCollectionObj.zoneDataArray: ", zonesCollectionObj.zoneDataArray);

            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

            // ======= make map layers ======
            if (selectedDataArray.length > 0) {
                zonesCollectionObj.makeZoneLayer();
                if (zonesCollectionObj.zoneMode != "selected") {
                    zonesCollectionObj.activateZoneListeners();

                // == activate school Listeners
                } else {
                    self.schoolMode = "selected";
                }
                self.makeSchoolLayer();
            }

        // == errors/fails
        }).fail(function(){
            console.log("*** ajax fail ***");
        }).error(function() {
            console.log("*** ajax error ***");
        });
    }

    // ======= ======= ======= checkFilterMatch ======= ======= =======
    SchoolsCollection.prototype.checkFilterMatch = function(schoolWard, schoolFeederMS, schoolFeederHS, schoolAgency, schoolLevel) {
        // console.log("checkFilterMatch");

        if (zonesCollectionObj.zoneMode == "default") {
            var zoneMatch = true;
            var levelsMatch = true;
            var agencyMatch = true;
        } else if ((zonesCollectionObj.zoneMode == "gradient") || (zonesCollectionObj.zoneMode == "indexed")) {
            var zoneMatch = true;
        } else if (zonesCollectionObj.zoneMode == "selected") {
            if (zonesCollectionObj.zoneType == "ward") {
                if (schoolWard == displayObj.dataFilters.selectedZone) {
                    var zoneMatch = true;
                }
            } else if (zonesCollectionObj.zoneType == "FeederHS") {
                zoneSuffix = " " + "FeederHS".substring("FeederHS".length - 2, "FeederHS".length);
                if (schoolFeederHS == displayObj.dataFilters.selectedZone + zoneSuffix) {
                    var zoneMatch = true;
                    // console.log("  zoneMatch: ", zoneMatch);
                }
            } else if (zonesCollectionObj.zoneType == "FeederMS") {
                zoneSuffix = " " + "FeederMS".substring("FeederMS".length - 2, "FeederMS".length);
                if (schoolFeederMS == displayObj.dataFilters.selectedZone + zoneSuffix) {
                    var zoneMatch = true;
                }
            }
        } else {
            if (displayObj.dataFilters.zone == "ward") {
                var zoneMatch = (schoolWard) ? true : false;
            } else if (displayObj.dataFilters.zone == "FeederHS") {
                var zoneMatch = (schoolFeederHS) ? true : false;
            } else if (displayObj.dataFilters.zone == "FeederMS") {
                var zoneMatch = (schoolFeederMS) ? true : false;
            }
        }
        if (displayObj.dataFilters.levels) {
            var levelsMatch = (displayObj.dataFilters.levels == schoolLevel) ? true : false;
        } else {
            var levelsMatch = true;
        }
        if (displayObj.dataFilters.agency) {
            var levelsMatch = (displayObj.dataFilters.agency == schoolAgency) ? true : false;
        } else {
            var agencyMatch = true;
        }
        // console.log("  levelsMatch: ", levelsMatch);
        // console.log("  agencyMatch: ", agencyMatch);

        if ((zoneMatch) && (levelsMatch) && (agencyMatch)) {
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
        console.log("*** zoneType ***", zonesCollectionObj.zoneType);
        console.log("*** Filters ***", displayObj.dataFilters);

        var self = this;
        var colorIndex = 0;
        var featureIndex = 0;
        var fillOpacity = 0.5;
        var itemColor, centerLatLng;

        // ======= ======= ======= cleanup ======= ======= =======
        de_activateZoneListeners(this);
        map.data.forEach(function(feature) {
            if (feature) {
                itemName = feature.getProperty('itemName');
                map.data.remove(feature);
            }
        });

        // ======= ======= ======= aggregators ======= ======= =======
        if (this.zoneMode == "gradient") {
            this.dataIncrement = calcDataIncrement(this);
            makeMapLegend(this);
            $("#mapLegend").css("display", "block");
        } else {
            $("#mapLegend").css("display", "none");
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
            zoneName = feature.getProperty('NAME');
            var checkName = zoneName.indexOf(", ");
            if (checkName > -1) {
                splitZoneName = zoneName.split(", ");
                zoneName = splitZoneName[0];
            }
            // zoneSuffix = " " + zonesCollectionObj.zoneType.substring(zonesCollectionObj.zoneType.length - 2, zonesCollectionObj.zoneType.length);
            // zoneName = zoneName + zoneSuffix;

            // ======= special color handling for selected mode =======
            itemColor = setZoneColor(self, displayObj, featureIndex, colorIndex, zoneName);

            // ======= get center lat lng of feature =======
            centerLatLng = makeZoneGeometry(feature);

            // ======= set feature properties =======
            feature.setProperty('index', featureIndex);
            feature.setProperty('itemName', zoneName);
            feature.setProperty('center', centerLatLng);
            feature.setProperty('itemColor', itemColor);

            // ======= colorize each feature based on colorList =======
            map.data.setStyle(function(feature) {
                var nextColor = feature.getProperty('itemColor');
                return {
                  fillColor: nextColor,
                  fillOpacity: fillOpacity,
                  strokeColor: "purple",
                  strokeWeight: 1
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
            updateFilterTitles("Select zone by clicking");

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
            console.log("zoneName: ", zoneName);

            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

            // == identify clicked zone from zone name value
            var zoneName = event.feature.getProperty('NAME');
            var checkZone = zoneName.indexOf(", ");
            if (checkZone > -1) {
                splitZoneName = zoneName.split(", ");
                var zoneName = splitZoneName[0];
            }

            // == set new zone info on menuObject
            var menuObject = filterMenu[zoneType];
            menuObject.value = zoneName;
            displayObj.dataFilters.zone = zoneType;
            // zoneSuffix = " " + zonesCollectionObj.zoneType.substring(zonesCollectionObj.zoneType.length - 2, zonesCollectionObj.zoneType.length);
            // displayObj.dataFilters.selectedZone = zoneName + zoneSuffix;
            displayObj.dataFilters.selectedZone = zoneName;

            map.data.overrideStyle(event.feature, {
                fillColor: "blue",
                fillOpacity: 0.5,
                strokePosition: "center",
                strokeWeight: 8
            });

            console.log("zoneName: ", zoneName);
            console.log("*** zoneType ***", zonesCollectionObj.zoneType);
            console.log("*** Filters ***", displayObj.dataFilters);

            updateHoverText(zoneName);
            updateFilterTitles(displayObj, zoneName, "add");
            de_activateZoneListeners(self);
            displayObj.activateClearButton();
            zonesCollectionObj.getZoneData();

            // zoomToZone(event);
            // if (menuObject.value) {
            //     self.getSchoolData("Elementary");
            // }
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

    SchoolsCollection.prototype.makeSchoolLayer = function(selectedDataArray, checkExpend) {
        console.log("\n----- makeSchoolLayer -----");
        console.log("  zonesCollectionObj.zoneType: ", zonesCollectionObj.zoneType);
        console.log("*** Filters ***", displayObj.dataFilters);

        var selectedDataArray = this.selectedSchoolsArray;

        // ======= clear existing listeners if any =======
        removeMarkers(this);

        // == get data to load on markers
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
            // console.log("  nextSchoolCode: ", nextSchoolCode);

            // == set color of school circle
            if (zonesCollectionObj.zoneMode == "default") {
                fillColor = "#eee";
                strokeColor = "gray";
            } else {
                if (nextSchoolType == "DCPS") {
                    fillColor = "red";
                    strokeColor = "maroon";
                } else {
                    fillColor = "orange";
                    strokeColor = "crimson ";
                }
            }

            // == indicate missing info if required
            if (((nextLat == "NA") || (nextLng == "NA") || (nextLat == null) || (nextLng == null)) && (nextSchoolCode)) {
                console.log("*** missing data ***");
                infoFlag = true;

            // == show markers for available data
            } else {

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
                    schoolAddress: nextSchoolAddress
                });

                schoolMarker.setMap(map);

                // == store marker on chart object
                this.schoolMarkersArray.push(schoolMarker);

                // == activate marker mouseover/mouseout
                if (this.schoolMode == "selected") {
                    this.activateSchoolMarker(schoolMarker);
                }
            }
        }
    }

    // ======= ======= ======= activateSchoolMarker ======= ======= =======
    SchoolsCollection.prototype.activateSchoolMarker = function(schoolMarker) {
        // console.log("activateSchoolMarker");

        // ======= mouseover event listener =======
        google.maps.event.addListener(schoolMarker, 'mouseover', function (event) {
        // var schoolMouseover = schoolMarker.addListener('mouseover', function(event) {
            // console.log("--- mouseover ---");
            var schoolName = this.schoolName;
            var schoolCode = this.schoolCode;
            var schoolIndex = this.schoolIndex;
            var schoolAddress = this.schoolAddress;
            var schoolLoc = this.position;

            updateHoverText(schoolName);

        });

        // ======= mouseout event listener =======
        google.maps.event.addListener(schoolMarker, 'mouseout', function (event) {
        // var schoolMouseout = schoolMarker.addListener('mouseout', function(event) {
            // console.log("--- mouseout ---");
            updateHoverText(null);
        });

        // ======= click event listener =======
        google.maps.event.addListener(schoolMarker, 'click', function (event) {
        // var schoolMouseClick = schoolMarker.addListener('click', function(event) {
            console.log("--- click ---");
            var schoolName = this.schoolName;
            var schoolCode = this.schoolCode;
            console.log("  schoolName: ", schoolName);
            console.log("  schoolCode: ", schoolCode);

            makeSchoolProfile(schoolsCollectionObj, this.schoolIndex);
            $("#profile").css("display", "table");
        });

        // this.mapListenersArray.push(schoolMouseover);
        // this.mapListenersArray.push(schoolMouseout);
        // this.mapListenersArray.push(schoolMouseClick);
        // console.log("  schoolMouseover: ", schoolMouseover);
    }



    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======
    // ======= ======= ======= ======= ======= INIT ======= ======= ======= ======= =======

    initMenuObjects();
    initDataObjects();
    initMap(zonesCollectionObj);
    displayObj.initFilterMenus();
    zonesCollectionObj.getZoneData();
}
