function Display() {
    console.log("Display");
    this.displayMode = null;
    this.agencyMenu = ["agency", filterMenu.District, filterMenu.Charter, filterMenu.All];
    this.levelsMenu = ["levels", filterMenu.High, filterMenu.Middle, filterMenu.Elem];
    this.expendMenu = ["expend", filterMenu.spendLifetime, filterMenu.MajorExp9815, filterMenu.spendPlanned];
    // this.zonesMenu = ["zones", filterMenu.Ward, filterMenu.FeederHS, filterMenu.FeederMS, filterMenu.Elementary];
    this.zonesMenu = ["zones", filterMenu.Ward, filterMenu.FeederHS];
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
