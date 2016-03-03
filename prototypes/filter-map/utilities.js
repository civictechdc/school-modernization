

// ======= ======= ======= CSV FILES ======= ======= =======
// ======= ======= ======= CSV FILES ======= ======= =======
// ======= ======= ======= CSV FILES ======= ======= =======


// ======= ======= ======= DCPS_Master_114 ======= ======= =======
// Agency, School, SCHOOLCODE, Address, maxOccupancy, Enroll.Cap, ProjectPhase, YrComplete, Level, totalSQFT, ProjectType, MajorExp9815, TotalAllotandPlan1621, LifetimeBudget, LON, LAT, WARD, FeederMS, FeederHS, Total.Enrolled, Limited.English.Proficient, At_Risk, AtRiskPer, SPEDPer, ESLPer, SqFtPerEnroll, SpentPerEnroll, SpentPerSqFt

// ======= ======= ======= DCPS_Master_114_dev ======= ======= =======
// Agency, School, SCHOOLCODE, Address, Level, WARD, FeederMS, FeederHS, LON, LAT, totalSQFT, maxOccupancy, Enroll_Cap, Total_Enrolled, Limited_English, At_Risk, ProjectPhase, YrComplete, ProjectType, MajorExp9815, TotalAllotandPlan1621, LifetimeBudget ... AtRiskPer, SPEDPer, ESLPer, SqFtPerEnroll, SpentPerEnroll, SpentPerSqFt




// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======

// ======= ======= ======= polyfill for Safari ======= ======= =======
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
};

// ======= ======= ======= getZoneUrls ======= ======= =======
function getZoneUrls(displayObj, zonesCollectionObj) {
    console.log("getZoneUrls");
    console.log("  .zoneA: ", zonesCollectionObj.zoneA);
    console.log("  .zones: ", displayObj.dataFilters.zones);

    var feederFlag = false;
    if (displayObj.displayMode == "storyMap") {
        var websitePrefix = "prototypes/filter-map/";
    } else {
        var websitePrefix = "";
    }

    if (displayObj.dataFilters.zones) {
        if (displayObj.dataFilters.zones == "Ward") {
            zonesCollectionObj.zoneA = "Ward";
            urlA = websitePrefix + "Data_Geo/Ward__2012.geojson";
            urlB = null;
        } else if (displayObj.dataFilters.zones == "FeederHS") {
            zonesCollectionObj.zoneA = "FeederHS";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Senior_High__New.geojson";
            if (displayObj.dataFilters.levels == "MS") {
                feederFlag = true;
                urlB = websitePrefix + "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
            } else if (displayObj.dataFilters.levels == "ES") {
                feederFlag = true;
                urlB = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
            } else if (displayObj.dataFilters.levels == null) {
                urlB = null;
            }
        } else if (displayObj.dataFilters.zones == "FeederMS") {
            feederFlag = true;
            zonesCollectionObj.zoneA = "FeederMS";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
            urlB = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        } else if (displayObj.dataFilters.zones == "Elementary") {
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        }
    } else {
        if (displayObj.dataFilters.levels == "HS") {
            zonesCollectionObj.zoneA = "FeederHS";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Senior_High__New.geojson";
        } else if (displayObj.dataFilters.levels == "MS") {
            zonesCollectionObj.zoneA = "FeederMS";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
        } else if (displayObj.dataFilters.levels == "ES") {
            zonesCollectionObj.zoneA = "Elementary";
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        } else {
            zonesCollectionObj.zoneA = "Ward";
            urlA = websitePrefix + "Data_Geo/Ward__2012.geojson";
        }
        urlB = null;
    }
    return [urlA, urlB, feederFlag];
}

// ======= ======= ======= initAutoComplete ======= ======= =======
function initAutoComplete(displayObj) {
    console.log('initAutoComplete');
    $(function() {
        console.log("autocomplete");
        $("#searchWindow").autocomplete({
            source: displayObj.schoolNamesArray
        });
    });
    $('#searchWindow').css('z-index', 999);
}

// ======= ======= ======= removeAbbreviations ======= ======= =======
function removeAbbreviations(longName) {
    // console.log("removeAbbreviations");
    var nameNoiseIndex = longName.indexOf(", ");
    if (nameNoiseIndex > -1) {
        splitZoneName = longName.split(", ");
        shortName = splitZoneName[0];
        return shortName;
    } else {
        return longName;
    }
}

// ======= ======= ======= processSchoolName ======= ======= =======
function processSchoolName(schoolName) {
    // console.log("processSchoolName");
    // console.log("  schoolName: ", schoolName);

    var shortName;

    if (schoolName) {
        shortName = schoolName.replace("Elementary School", "");
        shortName = shortName.replace("High School", "");
        shortName = shortName.replace("Middle School", "");
        shortName = shortName.replace("Education Campus", "");
        shortName = shortName.replace("ES", "");

        checkName1 = shortName.indexOf(", ");
        if (checkName1 > -1) {
            splitZoneName = shortName.split(", ");
            shortName = splitZoneName[0];
        }
        checkName2 = shortName.indexOf(". ");
        if (checkName2 > -1) {
            splitZoneName = shortName.split(". ");
            shortName = splitZoneName[1];
        }
        checkName3 = shortName.indexOf(" ");
        if (checkName3 > -1) {
            splitZoneName = shortName.split(" ");
            shortName = splitZoneName[0];
        }
    } else {
        shortName = null;
    }

    return shortName;
}

// ======= ======= ======= checkFilterSelection ======= ======= =======
function checkFilterSelection(displayObj, zonesCollectionObj, whichCategory) {
    console.log("##### checkFilterSelection #####");

    console.log("  whichCategory: ", whichCategory);
    console.log("  zoneA: ", zonesCollectionObj.zoneA);
    console.log("  * agency: ", displayObj.dataFilters.agency);
    console.log("  * levels: ", displayObj.dataFilters.levels);
    console.log("  * expend: ", displayObj.dataFilters.expend);
    console.log("  * zones: ", displayObj.dataFilters.zones);
    console.log("  * math: ", displayObj.dataFilters.math);
}

// ======= ======= ======= updateChartText ======= ======= =======
function updateChartText(displayObj, subtitle) {
    console.log("updateChartText");

    var words, agencyText, mathText, whichLevel, schoolText;

    // == agency label
    if (displayObj.dataFilters.agency) {
        if (displayObj.dataFilters.levels) {
            agencyText = filterMenu[displayObj.dataFilters.agency].text;
            words = agencyText.split(/\s+/);
            agencyText = words[0];
        } else {
            agencyText = filterMenu[displayObj.dataFilters.agency].text;
        }
    } else {
        agencyText = "";
    }

    // == math label
    if (displayObj.dataFilters.math) {
        if (displayObj.displayMode != "storyMap") {
            mathText = filterMenu[displayObj.dataFilters.math].text;
        } else {
            mathText = filterMenu[displayObj.dataFilters.math].label;
        }
        if (mathText == "dollar amount") {
            mathText = "";
        }
    } else {
        mathText = "";
    }

    // == expend label
    if (displayObj.dataFilters.expend) {
        if (displayObj.displayMode != "storyMap") {
            expendText = filterMenu[displayObj.dataFilters.expend].text;
        } else {
            expendText = filterMenu[displayObj.dataFilters.expend].label;
        }
    } else {
        expendText = "";
    }

    // == levels label
    if (displayObj.dataFilters.levels) {
        if (displayObj.dataFilters.levels == "HS") {
            whichLevel = "High";
        } else if (displayObj.dataFilters.levels == "MS") {
            whichLevel = "Middle";
        }if (displayObj.dataFilters.levels == "ES") {
            whichLevel = "Elem";
        }
        // console.log("  filterMenu: ", filterMenu);
        // console.log("  displayObj.dataFilters.levels: ", displayObj.dataFilters.levels);
        schoolText = filterMenu[whichLevel].label;
    } else {
        schoolText = "";
    }
    // console.log("  expendText: ", expendText);
    // console.log("  subtitle: ", subtitle);
    // console.log("  displayObj.displayMode: ", displayObj.displayMode);
    if (displayObj.displayMode == "storyMap") {
        $('#chart-label').text("");
    }
    $("#chart-title").text(expendText + " " + mathText);
    $('#chart-subtitle').text(subtitle);

    return [mathText, schoolText, agencyText];
}

// ======= ======= ======= updateHoverText ======= ======= =======
function updateHoverText(itemName, schoolType) {
    // console.log("updateHoverText");

    var filterTitleContainer = $("#mouseover-text").children("h2");
    // console.log("  $(filterTitleContainer).css(): ", $(filterTitleContainer).css());
    var filterText = $(filterTitleContainer).text();
    if (itemName) {
        if (itemName.length > 35) {
            var checkName = itemName.indexOf(", ");
            if (checkName > -1) {
                splitZoneName = itemName.split(", ");
                if (splitZoneName.length > 2) {
                    itemName = splitZoneName[0] + ", " + splitZoneName[1];
                } else {
                    itemName = splitZoneName[0];
                }
            }
            if (itemName.length > 35) {
                itemName = itemName.substring(0, 32) + "...";
            }
        }
        $("#mouseover-text").children("h2").css("visibility", "visible");
        if (schoolType == "DCPS") {
            $("#mouseover-text").children("h2").css("color", "red");
        } else if (schoolType == "PCS") {
            $("#mouseover-text").children("h2").css("color", "orange");
        }
        $(filterTitleContainer).text(itemName);
    } else {
        $("#mouseover-text").children("h2").css("visibility", "hidden");
        $(filterTitleContainer).text("&nbsp;");
    }
}

// ======= ======= ======= displayHoverMessage ======= ======= =======
function displayHoverMessage(displayObj, textMessage) {
    console.log("displayHoverMessage");

    $("#mouseover-text").children("h2").text("");
    $("#mouseover-text").children("h2").text(textMessage);
    $("#mouseover-text").children("h2").css("visibility", "visible");
    $("#mouseover-text").children("h2").css("color", "purple");
}


// ======= ======= ======= updateFilterItem ======= ======= =======
function updateFilterItem(displayObj, whichCategory, whichFilter, onOrOff) {
    console.log("updateFilterItem");
    console.log("  whichCategory: ", whichCategory);
    console.log("  whichFilter: ", whichFilter);
    console.log("  onOrOff: ", onOrOff);

    var nextMenu, nextCategory;

    for (var i = 0; i < displayObj.filterMenusArray.length; i++) {
        nextMenu = displayObj.filterMenusArray[i];
        nextCategory = nextMenu[0];
        console.log("  nextCategory: ", nextCategory);
        if (nextCategory == whichCategory) {
            for (var j = 1; j < nextMenu.length; j++) {
                nextFilterObject = nextMenu[j];
                console.log("  nextFilterObject.id: ", nextFilterObject.id );
                if ((nextFilterObject.id == whichFilter) && (onOrOff == undefined)) {
                    $("#" + nextFilterObject.id).addClass("selected");
                    console.log("  selected: ", nextFilterObject.id );
                } else if ((nextFilterObject.id == whichFilter) && (onOrOff == "off")) {
                    $("#" + nextFilterObject.id).addClass("deactivated");
                    console.log("  deactivated: ", nextFilterObject.id );
                } else if ((nextFilterObject.id == whichFilter) && (onOrOff == "on")) {
                    $("#" + nextFilterObject.id).removeClass("deactivated");
                    console.log("  deactivated: ", nextFilterObject.id );
                } else {
                    $("#" + nextFilterObject.id).removeClass("selected");
                }
            }
            break;
        }
    }
}

// ======= ======= ======= setMenuState ======= ======= =======
function setMenuState(displayObj, whichMenu, whichStates) {
    console.log("setMenuState");
    // console.log("  whichMenu[0]: ", whichMenu[0]);
    // console.log("  whichStates: ", whichStates);
    // console.log("  displayObj.filterTitlesArray1: ", displayObj.filterTitlesArray);

    var selectedFilterContainer = $("#filters-selections").children("h2");
    var selectedFilterText = $(selectedFilterContainer).html();

    if (whichMenu[0] == "zones") {
        if ((whichStates[1] == "S") || (whichStates[2] == "S")) {
            // == remove previous level filters from list if any
            removeItemsArray = ["High Schools", "Middle Schools", "Elementary Schools", "FeederHS", "FeederMS"];
            for (var i = 0; i < removeItemsArray.length; i++) {
                checkItem = removeItemsArray[i];
                console.log("  checkItem: ", checkItem);
                checkIndex = $.inArray(checkItem, displayObj.filterTitlesArray);
                console.log("  checkIndex: ", checkIndex);
                if (checkIndex > -1) {
                    displayObj.filterTitlesArray.splice(checkIndex, 1);
                    // console.log("  displayObj.filterTitlesArray2: ", displayObj.filterTitlesArray);
                    break;
                }
            }
        }
    }

    console.log("  displayObj.filterTitlesArray2: ", displayObj.filterTitlesArray);

    for (var i = 0; i < whichStates.length; i++) {
        nextState = whichStates[i];
        nextMenuItem = whichMenu[i+1];
        nextMenuText = nextMenuItem.text;
        nextElement = $("#" + nextMenuItem.id);
        checkIndex = $.inArray(nextMenuText, displayObj.filterTitlesArray);
        // console.log("*** nextMenuItem.id: ", nextMenuItem.id);
        // console.log("  whichStates: ", whichStates);
        // console.log("  checkIndex: ", checkIndex);
        // console.log("  nextState: ", nextState);
        // console.log("  nextElement: ", nextElement);
        if (nextState == "A") {
            if (checkIndex > -1) {
                displayObj.filterTitlesArray.splice(checkIndex, 1);
                // console.log("  displayObj.filterTitlesArray3: ", displayObj.filterTitlesArray);
            }
            $(nextElement).addClass("active");
            $(nextElement).removeClass("selected");
            $(nextElement).removeClass("deactivated");
        } else if (nextState == "D") {
            if (checkIndex > -1) {
                displayObj.filterTitlesArray.splice(checkIndex, 1);
                // console.log("  displayObj.filterTitlesArray3: ", displayObj.filterTitlesArray);
            }
            $(nextElement).removeClass("active");
            $(nextElement).removeClass("selected");
            $(nextElement).addClass("deactivated");
        } else if (nextState == "S") {
            displayObj.filterTitlesArray.push(nextMenuText);
            $(nextElement).removeClass("deactivated");
            $(nextElement).addClass("active");
            $(nextElement).addClass("selected");
            // console.log("  displayObj.filterTitlesArray3: ", displayObj.filterTitlesArray);
        }
    }
    // console.log("  displayObj.filterTitlesArray4: ", displayObj.filterTitlesArray);

    // == build new filter text html from filterTitlesArray
    selectedFilterText = "<span class='filterLabel'>Data for: </span>";
    for (var i = 0; i < displayObj.filterTitlesArray.length; i++) {
        nextFilter = displayObj.filterTitlesArray[i];
        console.log("  nextFilter: ", nextFilter);
        if (i == (displayObj.filterTitlesArray.length - 1)) {
            selectedFilterText += nextFilter;
        } else {
            selectedFilterText += nextFilter + ", ";
        }
    }
    // console.log("  displayObj.filterTitlesArray5: ", displayObj.filterTitlesArray);
    $(selectedFilterContainer).addClass("filterList");
    $(selectedFilterContainer).html(selectedFilterText);
}

// ======= ======= ======= displayFilterMessage ======= ======= =======
function displayFilterMessage(displayObj, menuObject, whichAction) {
    console.log("displayFilterMessage");
    console.log("  displayObj.filterTitlesArray1: ", displayObj.filterTitlesArray);

    var selectedFilterContainer = $("#filters-selections").children("h2");

    // == add message for user (not filter selections)
    if (typeof displayObj == "string") {
        filterText = "<span class='filterLabel'>Message: </span>";
        filterText += displayObj;
        $(selectedFilterContainer).addClass("filterList");
        $(selectedFilterContainer).html(filterText);
    }
}



// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======

// ======= ======= ======= clearZoneAggregator ======= ======= =======
function clearZoneAggregator(zonesCollectionObj) {
    console.log("clearZoneAggregator");

    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        zonesCollectionObj.aggregatorArray[i].schoolCount = 0;
        zonesCollectionObj.aggregatorArray[i].zoneAmount = 0;
        zonesCollectionObj.aggregatorArray[i].zoneSqft = 0;
        zonesCollectionObj.aggregatorArray[i].zoneEnroll = 0;
        zonesCollectionObj.aggregatorArray[i].amountMin = 0;
        zonesCollectionObj.aggregatorArray[i].amountMax = 0;
        zonesCollectionObj.aggregatorArray[i].amountAvg = 0;
        zonesCollectionObj.aggregatorArray[i].amountMed = 0;
    }
}

// ======= ======= ======= getZoneIndex ======= ======= =======
function getZoneIndex(zonesCollectionObj, displayObj, schoolData) {
    console.log("getZoneIndex");

    var nextZone, schoolWard, nextZoneNumber, schoolZoneIndex, rootFeederHS, rootFeederMS;

    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZone = zonesCollectionObj.aggregatorArray[i].zoneName;
        // console.log("  nextZone: ", nextZone);
        if (displayObj.dataFilters.zones == "Ward") {
            schoolWard = parseInt(schoolData.schoolWard);
            nextZoneNumber = parseInt(nextZone.split(" ")[1]);
            // console.log("  nextZoneNumber: ", nextZoneNumber);
            if (nextZoneNumber == schoolWard) {
                schoolZoneIndex = i;
                // console.log("  schoolZoneIndex: ", schoolZoneIndex);
                break;
            }
        } else if (displayObj.dataFilters.zones == "FeederHS") {
            schoolFeederHS = schoolData.schoolFeederHS;
            if ((schoolFeederHS == "NA") || (schoolFeederHS == null)) {
                // console.log("******* no FeederHS data");
                schoolZoneIndex = null;
            } else {
                rootFeederHS = schoolFeederHS.split(" ")[0];
                // console.log("  rootFeederHS: ", rootFeederHS);
                if (nextZone == rootFeederHS) {
                    schoolZoneIndex = i;
                    // console.log("******* schoolZoneIndex: ", schoolZoneIndex);
                    break;
                }
            }
        } else if (displayObj.dataFilters.zones == "FeederMS") {
            schoolFeederMS = schoolData.schoolFeederMS;
            if ((schoolFeederMS == "NA") || (schoolFeederMS == null)) {
                // console.log("******* no FeederMS data");
                schoolZoneIndex = null;
            } else {
                rootFeederMS = schoolFeederMS.split(" ")[0];
                if (nextZone == rootFeederMS) {
                    schoolZoneIndex = i;
                    break;
                }
            }
        }
    }
    return schoolZoneIndex;
}

// ======= ======= ======= makeZoneAggregator ======= ======= =======
function makeZoneAggregator(zonesCollectionObj, whichGeojson) {
    console.log("makeZoneAggregator");

    zonesCollectionObj.aggregatorArray = [];
    if (whichGeojson) {
        var nextZoneName, splitZoneName, nextZoneObject;
        for (var i = 0; i < whichGeojson.features.length; i++) {
            nextZoneName = whichGeojson.features[i].properties.NAME;
            nextZoneObject = { zoneIndex:i, zoneName:nextZoneName, schoolCount:0, zoneAmount:0, zoneSqft:0, zoneEnroll:0, amountMin:0, amountMax:0, amountAvg:0, amountMed:0 }
            zonesCollectionObj.aggregatorArray.push(nextZoneObject);
            // console.log("  nextZoneObject.zoneName: ", i, "/", nextZoneObject.zoneName);
        }
    } else {
        console.log("ERROR: no geojson data");
    }
    console.dir(zonesCollectionObj.aggregatorArray);
}

// ======= ======= ======= aggregateZoneData ======= ======= =======
function aggregateZoneData(zonesCollectionObj, displayObj, schoolData, masterIndex) {
    console.log("aggregateZoneData");

    var schoolWard = nextZoneIndex = nextSchoolExpend = currentAmount = aggregatedAmount = 0;
    var currentSqft = currentEnroll = aggregatedSqft = aggregatedEnroll = 0;
    var nextSchoolSqft, nextSchoolEnroll;
    var nextZone = schoolZoneIndex = null;
    // console.log("*** .schoolName: ", schoolData.schoolName);
    // console.log("  .schoolFeederHS: ", schoolData.schoolFeederHS);
    // console.log("  .schoolFeederMS: ", schoolData.schoolFeederMS);
    // console.log("  .schoolWard: ", schoolData.schoolWard);
    // console.log("  .schoolAgency: ", schoolData.schoolAgency);

    // == match school name from geojson file with school name from csv file
    if (displayObj.dataFilters.zones) {
        schoolZoneIndex = getZoneIndex(zonesCollectionObj, displayObj, schoolData);
    }

    // == identify column holding selected expend filter data
    if (schoolZoneIndex != null) {
        // console.log("******* schoolZoneIndex: ", schoolZoneIndex);
        // console.log("  .schoolCount: ", zonesCollectionObj.aggregatorArray[schoolZoneIndex].schoolCount);
        // console.log("  .amountMax1: ", zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMax);
        // console.log("  .amountMin1: ", zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMin);

        // == defaults to lifetime budget expenditure if no expenditure selected
        if (displayObj.dataFilters.expend == null) {
            nextSchoolExpend = parseInt(schoolData.spendLifetime);
        } else {
            nextSchoolExpend = parseInt(schoolData[displayObj.dataFilters.expend]);
        }
        nextSchoolSqft = parseInt(schoolData.schoolSqft);
        nextSchoolEnroll = parseInt(schoolData.schoolEnroll);
        // console.log("  nextSchoolExpend: ", nextSchoolExpend);
        // console.log("  nextSchoolSqft: ", nextSchoolSqft);
        // console.log("  nextSchoolEnroll: ", nextSchoolEnroll);

        // == aggregate new value into zone total
        if (Number.isInteger(nextSchoolExpend)) {
            zonesCollectionObj.aggregatorArray[schoolZoneIndex].schoolCount++;
            if (nextSchoolExpend >= 0) {
                currentAmount = zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneAmount;
                aggregatedAmount = currentAmount + nextSchoolExpend;
                zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneAmount = aggregatedAmount;

                // ======= record max =======
                if (nextSchoolExpend > zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMax) {
                    zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMax = nextSchoolExpend;
                }

                // ======= record min =======
                if (zonesCollectionObj.aggregatorArray[schoolZoneIndex].schoolCount == 1) {
                    zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMin = nextSchoolExpend;
                } else {
                    if (nextSchoolExpend <= zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMin) {
                        zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMin = nextSchoolExpend;
                    }
                }

                // ======= calculate average =======
                zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountAvg = aggregatedAmount/zonesCollectionObj.aggregatorArray[schoolZoneIndex].schoolCount;
                // var medianIndex = (zonesCollectionObj.aggregatorArray.length/2) - 1;
                // if (medianIndex % 2 == 0) {
                //     var median = (zonesCollectionObj.aggregatorArray[Math.floor(medianIndex)].zoneAmount + zonesCollectionObj.aggregatorArray[Math.ceil(medianIndex)].zoneAmount)/2;
                // } else {
                //     var median = zonesCollectionObj.aggregatorArray[medianIndex].zoneAmount;
                // }
                // console.log("  medianIndex: ", medianIndex);
                // console.log("  median: ", median);
                // zonesCollectionObj.aggregatorArray[schoolZoneIndex].amountMed = median;

            } else {
                console.log("ERROR: negative values for " + schoolData.schoolName);
                nextSchoolExpend = 0;
            }

        } else {
            console.log("ERROR: nextSchoolExpend NaN " + schoolData.schoolName);
            nextSchoolExpend = 0;
        }

        // == aggregate new value into zone total
        if (Number.isInteger(nextSchoolSqft)) {
            if (nextSchoolSqft >= 0) {
                currentSqft = zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneSqft;
                aggregatedSqft = currentSqft + nextSchoolSqft;
                zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneSqft = aggregatedSqft;
            } else {
                console.log("ERROR: negative values for " + schoolData.schoolName);
                nextSchoolSqft = 0;
            }
        } else {
            console.log("ERROR: nextSchoolSqft NaN " + schoolData.schoolName);
            nextSchoolSqft = 0;
        }

        // == aggregate new value into zone total
        if (Number.isInteger(nextSchoolEnroll)) {
            if (nextSchoolEnroll >= 0) {
                currentEnroll = zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneEnroll;
                aggregatedEnroll = currentEnroll + nextSchoolEnroll;
                zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneEnroll = aggregatedEnroll;
            } else {
                console.log("ERROR: negative values for " + schoolData.schoolName);
                nextSchoolEnroll = 0;
            }
        } else {
            console.log("ERROR: nextSchoolEnroll NaN " + schoolData.schoolName);
            nextSchoolEnroll = 0;
        }
        // showAggratedData(schoolData, currentAmount, nextSchoolExpend, aggregatedAmount, currentSqft, nextSchoolSqft, aggregatedSqft, currentEnroll, nextSchoolEnroll, aggregatedEnroll);
        return null;

    // == rejected schools
    } else {
        return schoolData.schoolCode;
    }
}

// ======= ======= ======= showAggratedData ======= ======= =======
function showAggratedData(schoolData, currentAmount, nextSchoolExpend, aggregatedAmount, currentSqft, nextSchoolSqft, aggregatedSqft, currentEnroll, nextSchoolEnroll, aggregatedEnroll) {
    // console.log("showAggratedData");

    console.log("*** school/index: ", schoolData.schoolName, "/", schoolZoneIndex);
    console.log("  currentAmount: ", currentAmount);
    console.log("    nextSchoolExpend: ", nextSchoolExpend);
    console.log("    aggregatedAmount: ", aggregatedAmount);
    console.log("  currentSqft: ", currentSqft);
    console.log("    nextSchoolSqft: ", nextSchoolSqft);
    console.log("    aggregatedSqft: ", aggregatedSqft);
    console.log("  currentEnroll: ", currentEnroll);
    console.log("    nextSchoolEnroll: ", nextSchoolEnroll);
    console.log("    aggregatedEnroll: ", aggregatedEnroll);

}

// ======= ======= ======= captureSchoolData ======= ======= =======
function captureSchoolData(zonesCollectionObj, displayObj, schoolData, masterIndex) {
    // console.log("captureSchoolData");

    // == match school name from geojson file with school name from csv file
    var nextSchoolZone, zoneSuffix;
    var zoneGeojson_A = zonesCollectionObj.zoneGeojson_A;
    var zoneAggregator = zonesCollectionObj.aggregatorArray;
    var checkSchoolName = processSchoolName(schoolData.schoolName)
    // console.log("** checkSchoolName: ", checkSchoolName);

    if (displayObj.dataFilters.levels) {
        var nextZoneName, splitZoneName, nextZoneObject;
        for (var i = 0; i < zoneAggregator.length; i++) {
            nextDataObject = zoneAggregator[i];
            nextSchoolName = nextDataObject.zoneName;
            if (nextSchoolName == checkSchoolName) {
                nextSchoolExpend = parseInt(schoolData[displayObj.dataFilters.expend]);
                nextSchoolSqft = parseInt(schoolData.schoolSqft);
                nextSchoolEnroll = parseInt(schoolData.schoolEnroll);

                if (Number.isInteger(nextSchoolExpend)) {
                    if (nextSchoolExpend >= 0) {
                        currentAmount = nextDataObject.zoneAmount;
                        if (currentAmount == 0) {
                            aggregatedAmount = currentAmount + nextSchoolExpend;
                            nextDataObject.zoneAmount = aggregatedAmount;
                            nextDataObject.zoneIndex = masterIndex;
                        } else {
                            console.log("ERROR: data already captured for " + nextSchoolName);
                            break;
                        }
                    } else {
                        console.log("ERROR: negative values for " + schoolData.schoolName);
                        nextSchoolExpend = 0;
                    }
                } else {
                    nextDataObject.zoneAmount = 0;
                    nextDataObject.zoneIndex = masterIndex;
                    console.log("ERROR: non-integer amount for " + nextSchoolName);
                }

                if (Number.isInteger(nextSchoolSqft)) {
                    currentSqft = nextDataObject.zoneSqft;
                    if (currentSqft == 0) {
                        aggregatedSqft = currentSqft + nextSchoolSqft;
                        nextDataObject.zoneSqft = aggregatedSqft;
                    } else {
                        console.log("ERROR: data already captured for " + nextSchoolName);
                        break;
                    }
                } else {
                    nextDataObject.zoneSqft = 0;
                    console.log("ERROR: non-integer sqft for " + nextSchoolName);
                }

                if (Number.isInteger(nextSchoolEnroll)) {
                    currentEnroll = nextDataObject.zoneEnroll;
                    if (currentEnroll == 0) {
                        aggregatedEnroll = currentEnroll + nextSchoolEnroll;
                        nextDataObject.zoneEnroll = aggregatedEnroll;
                    } else {
                        console.log("ERROR: data already captured for " + nextSchoolName);
                        break;
                    }
                } else {
                    nextDataObject.zoneEnroll = 0;
                    console.log("ERROR: non-integer number for " + nextSchoolName);
                }
                break;
            }
        }
    }
}

// ======= ======= ======= doTheMath ======= ======= =======
function doTheMath(zonesCollectionObj, displayObj) {
    console.log("doTheMath");
    // console.log("  displayObj.dataFilters: ", displayObj.dataFilters);

    var nextSpendAmount, nextZoneValue, nextZoneSqft, nextZoneEnroll;

    // == gather all values in aggregator array
    var zoneValuesArray = [];
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextSpendAmount = zonesCollectionObj.aggregatorArray[i].zoneAmount;
        if (displayObj.dataFilters.math == "spendAmount") {
            nextZoneValue = zonesCollectionObj.aggregatorArray[i].zoneAmount;
            // console.log("  nextZoneValue: ", nextZoneValue);
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            nextZoneSqft = zonesCollectionObj.aggregatorArray[i].zoneSqft;
            // console.log("  nextZoneSqft: ", nextZoneSqft);
            if (nextZoneSqft != 0) {
                nextZoneValue = nextSpendAmount/nextZoneSqft;
            } else {
                nextZoneValue = 0;
            }
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            nextZoneEnroll = zonesCollectionObj.aggregatorArray[i].zoneEnroll;
            // console.log("  nextZoneEnroll: ", nextZoneEnroll);
            if (nextZoneEnroll != 0) {
                nextZoneValue = nextSpendAmount/nextZoneEnroll;
            } else {
                nextZoneValue = 0;
            }
        }
        // console.log("  nextZoneValue: ", nextZoneValue);
        zoneValuesArray.push(nextZoneValue);
    }

    // == get lowest/highest values, divide by number of data bins
    var fillOpacity = 1;
    var maxValue = Math.max.apply(Math, zoneValuesArray);
    var minValue = Math.min.apply(Math, zoneValuesArray);
    var dataIncrement = parseFloat(maxValue/zonesCollectionObj.dataBins);
    // console.log("  maxValue: ", maxValue);
    // console.log("  minValue: ", minValue);
    // console.log("  dataIncrement: ", dataIncrement);

    return dataIncrement;
}

// ======= ======= ======= assignDataColors ======= ======= =======
function assignDataColors(zonesCollectionObj, displayObj, featureIndex) {
    console.log("assignDataColors");
    // console.log("  -- featureIndex: ", featureIndex);

    var nextZoneValue = zonesCollectionObj.aggregatorArray[featureIndex].zoneAmount;
    var nextExpendValue;
    if (displayObj.dataFilters.math == "spendAmount") {
        nextExpendValue = zonesCollectionObj.aggregatorArray[featureIndex].zoneAmount;
    } else if (displayObj.dataFilters.math == "spendEnroll") {
        if (zonesCollectionObj.aggregatorArray[featureIndex].zoneEnroll != 0) {
            nextExpendValue = parseFloat(nextZoneValue/(zonesCollectionObj.aggregatorArray[featureIndex].zoneEnroll));
        } else {
            nextExpendValue = 0;
        }
    } else if (displayObj.dataFilters.math == "spendSqFt") {
        if (zonesCollectionObj.aggregatorArray[featureIndex].zoneSqft != 0) {
            nextExpendValue = parseFloat(nextZoneValue/(zonesCollectionObj.aggregatorArray[featureIndex].zoneSqft));
        } else {
            nextExpendValue = 0;
        }
    }
    // console.log("  nextExpendValue: ", nextExpendValue);

    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        binMin = (zonesCollectionObj.dataIncrement * i);
        binMax = (zonesCollectionObj.dataIncrement * (i + 1));
        // console.log("  binMax: ", binMax);
        if ((binMin <= nextExpendValue) && (nextExpendValue <= (binMax + 1))) {
            var colorIndex = i;
            break;
        }
    }
    // console.log("  colorIndex: ", colorIndex);
    return colorIndex;
}

// ======= ======= ======= getZoneFormat ======= ======= =======
function getZoneFormat(zonesCollectionObj, displayObj, featureIndex, zoneName, whichLayer) {
    console.log("getZoneFormat");

    var itemColor = "white";
    var strokeColor = "purple";
    var strokeWeight = 2;
    var itemOpacity = 0.5;

    // == use indexed color if selected zone
    if (displayObj.dataFilters.selectedZone) {
        if (zoneName == displayObj.dataFilters.selectedZone) {
            itemColor = zonesCollectionObj.dataColorsArray[featureIndex];
        } else {
            itemColor = "white";
        }
    } else {
        if (displayObj.dataFilters.agency != "Charter") {
            if (whichLayer == "lower") {
                itemColor = "white";
                strokeColor = "purple";
                strokeWeight = 1;
                itemOpacity = 0.6;
            } else if (whichLayer == "upper") {
                if (displayObj.dataFilters.expend) {
                    colorIndex = assignDataColors(zonesCollectionObj, displayObj, featureIndex);
                    itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                    strokeColor = "black";
                    strokeWeight = 4;
                } else {
                    itemColor = "white";
                    strokeColor = "purple";
                    strokeWeight = 2;
                }
                itemOpacity = 0.7;
            } else if (whichLayer == "single") {
                if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
                    if (displayObj.dataFilters.expend) {
                        colorIndex = assignDataColors(zonesCollectionObj, displayObj, featureIndex);
                        itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                        strokeColor = "black";
                        strokeWeight = 2;
                        itemOpacity = 0.8;
                    } else {
                        return [itemColor, strokeColor, strokeWeight, itemOpacity];
                    }
                } else {
                    return [itemColor, strokeColor, strokeWeight, itemOpacity];
                }
            }
        } else {
            return [itemColor, strokeColor, strokeWeight, itemOpacity];
        }
    }
    return [itemColor, strokeColor, strokeWeight, itemOpacity];
}

// ======= ======= ======= makeMapLegend ======= ======= =======
function makeMapLegend(zonesCollectionObj) {
    console.log("makeMapLegend");

    var zoneValuesArray = [];
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZoneValue = zonesCollectionObj.aggregatorArray[i].zoneAmount;
        zoneValuesArray.push(nextZoneValue);
    }

    var dataMax = Math.max.apply(Math, zoneValuesArray);
    var dataMin = Math.min.apply(Math, zoneValuesArray);
    // console.log("  .zoneValuesArray: ", zoneValuesArray);
    // console.log("  dataMax: ", dataMax);
    // console.log("  dataMin: ", dataMin);
    var scaleLabels = getScaleFactor(dataMax)
    var scaleFactor = scaleLabels[0];
    var scaleLabel = scaleLabels[1];
    var nextMin = 0;
    var nextMax = 0;
    var nextColor;

    // == make legend html for color chips
    var legendHtml = "";
    legendHtml += "<table id='legend'>";
    legendHtml += "<tr><th class='amount'>data</th><th class='values'>color</th></tr>";
    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        nextMin = nextMax;
        nextMax += parseInt(zonesCollectionObj.dataIncrement);
        var minString = scaleLabel + (nextMin/scaleFactor).toFixed(1).toString();
        var maxString = (nextMax/scaleFactor).toFixed(1).toString();
        legendHtml += "<tr><td class='minMaxCol'><p class='minMax'>" + minString + " - " + maxString + "</p></td>";
        legendHtml += "<td class='colorChipCol'><div id='colorChip" + i + "' class='colorChip'>&nbsp;</div></td></tr>";
    }
    legendHtml += "</table>";

    // == remove previous legend, chart or profile html if any
    if ($('#profile-container').find('#profile').length) {
        $("#profile").remove();
    }
    if ($('#chart-container').find('#chart').length) {
        $("#chart").remove();
    }
    if ($('#legend-container').find('#legend').length) {
        $("#legend").remove();
        $("#legend-container").append(legendHtml);
    } else {
        $("#legend-container").append(legendHtml);
        $("#legend-container").fadeIn( "slow", function() {
            console.log("*** FADEIN legend-container ***");
        });
    }

    // == set colors on color chips
    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        nextChip = $("#colorChip" + i);
        nextColor = zonesCollectionObj.dataColorsArray[i];
        $("#colorChip" + i).css("background-color", nextColor);
    }
}

// ======= ======= ======= getScaleFactor ======= ======= =======
function getScaleFactor(dataMax) {
    console.log("getScaleFactor");
    if (dataMax > 1000000) {
        scaleFactor = 1000000;
        scaleLabel = "$M ";
    } else if ((dataMax < 1000000) && (dataMax > 1000)) {
        scaleFactor = 1000;
        scaleLabel = "$K ";
    } else {
        scaleFactor = 1;
        scaleLabel = "$";
    }
    return [scaleFactor, scaleLabel];
}



// ======= ======= ======= ======= ======= CLEAR DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= CLEAR DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= CLEAR DISPLAY ======= ======= ======= ======= =======

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


// ======= ======= ======= removeMarkers ======= ======= =======
function removeMarkers(schoolsCollectionObj) {
    // console.log("removeMarkers");

    // console.log("  markers_before: ", mapDataObject.schoolMarkersArray.length);
    var schoolMarkersArray = schoolsCollectionObj.schoolMarkersArray;
    if (schoolMarkersArray) {
        for(i = 0; i < schoolMarkersArray.length; i++){
            schoolMarkersArray[i].setMap(null);
            schoolMarkersArray[i] = null;
        }
    }
    schoolsCollectionObj.schoolMarkersArray = [];
    // console.log("  markers_after: ", mapDataObject.schoolMarkersArray.length);
}

// ======= ======= ======= de_activateZoneListeners ======= ======= =======
function de_activateZoneListeners(zonesCollectionObj) {
    console.log("de_activateZoneListeners");

    google.maps.event.clearListeners(map, 'mouseover');
    google.maps.event.clearListeners(map, 'mouseout');
    google.maps.event.clearListeners(map, 'click');

    console.log("  listeners_before: ", zonesCollectionObj.mapListenersArray.length);
    var mapListenersArray = zonesCollectionObj.mapListenersArray;
    if (zonesCollectionObj.mapListenersArray.length > 0) {
        for (var i = 0; i < zonesCollectionObj.mapListenersArray.length; i++) {
            google.maps.event.removeListener(zonesCollectionObj.mapListenersArray[i]);
        }
    }
    zonesCollectionObj.mapListenersArray = [];
    console.log("  listeners_after: ", zonesCollectionObj.mapListenersArray.length);
}

// ======= ======= ======= makeZoneGeometry ======= ======= =======
function makeZoneGeometry(feature) {
    // console.log("makeZoneGeometry");

    var polyCount = 0;
    var multiPolyCount = 0;
    var polygonArray = [];

    // ======= traverse geometry paths for each feature =======
    feature.getGeometry().getArray().forEach(function(path) {
        featureType = feature.getGeometry().getType();
        featureBounds = new google.maps.LatLngBounds();
        if (featureType == "Polygon") {
            polyCount++;
            polygonArray.push(path);

            path.getArray().forEach(function(latLng) {
                featureBounds.extend(latLng);
            });
        } else {
            multiPolyCount++;
            polygonArray.push(path.j[0]);

            path.j[0].getArray().forEach(function(latLng) {
                featureBounds.extend(latLng);
            });
        }
    });

    // == get center of each feature
    centerLat = featureBounds.getCenter().lat();
    centerLng = featureBounds.getCenter().lng();
    centerLatLng = new google.maps.LatLng({lat: centerLat, lng: centerLng});
    return centerLatLng;
}

// ======= ======= ======= mouseoverZone ======= ======= =======
function mouseoverZone(event, itemName) {
    console.log("mouseoverZone");
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
}

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

// ======= ======= ======= getDataDetails ======= ======= =======
function getDataDetails(nextSchool, nextIndex) {
    // console.log("getDataDetails");

    // schoolCode, schoolName, schoolWard, schoolFeederMS, schoolFeederHS, schoolAddress, schoolLAT, schoolLON, schoolLevel:, schoolAgency
    // building data: schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll
    // student population data: schoolEnroll, studentEng, studentAtRisk, studentSpecEd, studentESLPer, studentAtRiskPer, studentSPEDPer
    // spending data: spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll

    var tempSchoolData = {
        // school identity data
        "schoolIndex": nextIndex,
        "schoolCode": nextSchool.School_ID,
        "schoolName": nextSchool.School,
        "schoolWard": nextSchool.Ward,
        "schoolFeederMS": nextSchool.FeederMS,
        "schoolFeederHS": nextSchool.FeederHS,
        "schoolAddress": nextSchool.Address,
        "schoolLAT": nextSchool.latitude,
        "schoolLON": nextSchool.longitude,
        "schoolLevel": nextSchool.Level,
        "schoolAgency": nextSchool.Agency,

        // building data: schoolProject, schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll, unqBuilding
        "schoolProject": nextSchool.ProjectType,
        "schoolSqft": nextSchool.totalSQFT,
        "schoolMaxOccupancy": nextSchool.schoolMaxOccupancy,
        "schoolSqFtPerEnroll": nextSchool.SqFtPerEnroll,
        "unqBuilding": nextSchool.unqBuilding,

        // student population data
        "schoolEnroll": nextSchool.Total_Enrolled,
        "studentEng": nextSchool.Limited_English,
        "studentAtRisk": nextSchool.At_Risk,
        "studentSpecEd": nextSchool.SpEd,
        "studentESLPer": nextSchool.ESLPer,
        "studentAtRiskPer": nextSchool.AtRiskPer,
        "studentSPEDPer": nextSchool.SPEDPer,

        // spending data: spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll, spendLTsqft, spendLTenroll
        "spendPast": nextSchool.MajorExp9815,
        "spendLifetime": nextSchool.LifetimeBudget,
        "spendPlanned": nextSchool.TotalAllotandPlan1621,
        "spendSqFt": nextSchool.SpentPerSqFt,           // Sqft
        "spendEnroll": nextSchool.SpentPerMaxOccupancy,       // Student
        "spendLTsqft": nextSchool.LTBudgetPerSqFt,
        "spendLTenroll": nextSchool.LTBudgetPerEnroll
    }
    return tempSchoolData;
}

// ======= ======= ======= makeSchoolProfile ======= ======= =======
function makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, schoolIndex) {
    console.log("makeSchoolProfile");
    console.log("  schoolIndex: ", schoolIndex);

    var nextValue;
    schoolsCollectionObj.selectedSchool = null;

    if ((typeof schoolIndex === 'undefined') || (typeof schoolIndex === 'null')) {
        console.log("*** SCHOOL SEARCH ***");
        var tempSchoolData = getDataDetails(schoolData, null)
        var cleanedSchoolData = cleanupSchoolData(schoolsCollectionObj, tempSchoolData);
    } else {
        var cleanedSchoolData = cleanupSchoolData(schoolsCollectionObj, schoolsCollectionObj.selectedSchoolsArray[schoolIndex]);
    }

    schoolsCollectionObj.selectedSchool = cleanedSchoolData;
    // console.log("  cleanedSchoolData: ", cleanedSchoolData);

    // == school sqft
    schoolSqft = cleanedSchoolData.schoolSqft;
    if (schoolSqft == "") {
        schoolSqft = "No data for school sqft.";
        schoolSqftSpan = "";
    } else {
        schoolSqftSpan = "<span class='value-label'>sqft</span>";
    }

    // == capacity
    schoolMaxOccupancy = cleanedSchoolData.schoolMaxOccupancy;
    if (schoolMaxOccupancy == "") {
        schoolMaxOccupancy = "No data for school capacity.";
        schoolMaxOccupancySpan = "";
    } else {
        schoolMaxOccupancySpan = "<span class='value-label'>students</span>";
    }

    // == enrollment
    schoolEnroll = cleanedSchoolData.schoolEnroll;
    if (schoolEnroll == "") {
        schoolEnroll = "No data for enrollment.";
        schoolEnrollSpan = "";
    } else {
        schoolEnrollSpan = "<span class='value-label'>students</span>";
    }

    // == sqft per enrolled student
    schoolSqFtPerEnroll = cleanedSchoolData.schoolSqFtPerEnroll;
    if (schoolSqFtPerEnroll == "") {
        schoolSqFtPerEnroll = "No data for sqFt/student.";
        schoolSqFtPerEnrollSpan = "";
    } else {
        schoolSqFtPerEnroll = parseInt(cleanedSchoolData.schoolSqFtPerEnroll);
        schoolSqFtPerEnrollSpan = "<span class='value-label'>sqft per student</span>";
    }

    // == lifetime spending
    spendLifetime = cleanedSchoolData.spendLifetime;
    if (spendLifetime == "") {
        spendLifetime = "<span class='value-label'>No data for lifetime spending</span>";
    } else {
        spendLifetime = "$" + spendLifetime;
    }

    // == future spending
    spendPlanned = cleanedSchoolData.spendPlanned;
    if (spendPlanned == "") {
        spendPlanned = "<span class='value-label'>No data for future spending</span>";
    } else {
        spendPlanned = "$" + spendPlanned;
    }

    // == past spending
    spendPast = cleanedSchoolData.spendPast;
    if (spendPast == "") {
        spendPast = "<span class='value-label'>No data for past spending</span>";
    } else {
        spendPast = "$" + spendPast;
    }

    // == spending per student
    spendEnroll = cleanedSchoolData.spendEnroll;
    if ((spendEnroll == "") || (spendEnroll == 0)) {
        spendEnroll = "<span class='value-label'>No spending per student data</span>";
        spendEnrollSpan = "";
    } else {
        spendEnroll = "$" + parseInt(spendEnroll);
        spendEnrollSpan = " <span class='value-label'>per student</span>";
    }

    // == spending per sqft
    spendSqFt = parseInt(cleanedSchoolData.spendSqFt);
    if ((spendSqFt == "") || (spendSqFt == 0)) {
        spendSqFt = "<span class='value-label'>No spending per sqft data</span>";
        spendSqFtSpan = "";
    } else {
        spendSqFt = "$" + parseInt(spendSqFt);
        spendSqFtSpan = " <span class='value-label'>per sqft</span>";
    }

    var itemName = cleanedSchoolData.schoolName;
    if (itemName.length > 35) {
        var checkName = itemName.indexOf(", ");
        if (checkName > -1) {
            splitZoneName = itemName.split(", ");
            if (splitZoneName.length > 2) {
                itemName = splitZoneName[0] + ", " + splitZoneName[1];
            } else {
                itemName = splitZoneName[0];
            }
        }
        if (itemName.length > 38) {
            itemName = itemName.substring(0, 35) + "...";
        }
    }

    var htmlString = "<table id='profile'>";
    htmlString += "<tr><td class='profile-banner' colspan=2>";
    htmlString += "<div id='close-X'><p>X</p></div>";
    htmlString += "<p class='profile-title'>" + itemName + "</p>";
    htmlString += "<p class='profile-subtitle'>" + cleanedSchoolData.schoolAddress + "</p>";
    htmlString += "<p class='profile-subtitle2'>Ward " + cleanedSchoolData.schoolWard + " / " + cleanedSchoolData.schoolLevel + "</p>";
    htmlString += displayObj.makeSubMenu(displayObj.expendMathMenu, "profile");
    htmlString += "</td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>project type</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolProject + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>HS Feeder</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolFeederHS + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>bldg Sqft</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolSqft + " " + schoolSqftSpan + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>bldg capacity</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolMaxOccupancy + " " + schoolMaxOccupancySpan + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>enrolled (2014-15)</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolEnroll + " " + schoolEnrollSpan + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>sqft/enrolled</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolSqFtPerEnroll + " " + schoolSqFtPerEnrollSpan + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>Lifetime Spending</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendLifetime' class='value-text'>&nbsp;</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>Future Spending</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>&nbsp;</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>Past Spending</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPast' class='value-text'>&nbsp;</p></td></tr>";
    htmlString += "</table>";

    // makeProfileChart(zonesCollectionObj, schoolsCollectionObj, displayObj, schoolIndex);

    // == remove previous chart or profile html if any
    if ($('#chart-container').find('#chart').length) {
        $("#chart-container").fadeOut( "fast", function() {
            console.log("*** FADEOUT chart-container ***");
        });
        // $("#chart").remove();
    }
    if ($('#legend-container').find('#legend').length) {
        $("#legend").remove();
    }
    if ($('#profile-container').find('#profile').length) {
        $("#profile").remove();
        $("#profile-container").append(htmlString);
    } else {
        $("#profile-container").append(htmlString);
        $("#profile-container").fadeIn( "slow", function() {
            console.log("*** FADEIN profile-container ***");
        });
    }

    nextMath = $("select[name='expendMath'] option:selected").val()
    if (nextMath == "spendEnroll") {
        $("#profileSpendLifetime").html(spendEnroll + spendEnrollSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per student data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per student data</span>");
    } else if (nextMath == "spendSqFt") {
        $("#profileSpendLifetime").html(spendSqFt + spendSqFtSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per sqft data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per sqft data</span>");
    } else if (nextMath == "spendAmount") {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(spendPast);
    } else {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(spendPast);
    }

    displayObj.activateCloseButton();
    activateProfileSubmenu(displayObj, zonesCollectionObj, schoolsCollectionObj);
}

// ======= ======= ======= cleanupSchoolData ======= ======= =======
function cleanupSchoolData(schoolsCollectionObj, schoolData) {
    console.log("cleanupSchoolData");

    var cleanedData = {};

    // schoolIndex, schoolName, schoolWard, schoolCode, schoolFeederMS, schoolFeederHS, schoolAddress, schoolLAT, schoolLON, schoolLevel, schoolAgency
    cleanedData.schoolIndex = schoolData.schoolIndex;
    cleanedData.schoolName = schoolData.schoolName;
    cleanedData.schoolWard = schoolData.schoolWard;

    if ((schoolData.schoolCode == "NA") || (schoolData.schoolCode == null)) {
        cleanedData.schoolCode = "";
    } else {
        cleanedData.schoolCode = schoolData.schoolCode;
    }
    if ((schoolData.schoolFeederMS == "NA") || (schoolData.schoolFeederMS == null)) {
        cleanedData.schoolFeederMS = "";
    } else {
        cleanedData.schoolFeederMS = schoolData.schoolFeederMS;
    }
    if ((schoolData.schoolFeederHS == "NA") || (schoolData.schoolFeederHS == null)) {
        cleanedData.schoolFeederHS = "";
    } else {
        cleanedData.schoolFeederHS = schoolData.schoolFeederHS;
    }
    if ((schoolData.schoolAddress == "NA") || (schoolData.schoolAddress == null)) {
        cleanedData.schoolAddress = "";
    } else {
        cleanedData.schoolAddress = schoolData.schoolAddress;
    }
    if ((schoolData.schoolLAT == "NA") || (schoolData.schoolLAT == null)) {
        cleanedData.schoolLAT = "";
    } else {
        cleanedData.schoolLAT = schoolData.schoolLAT;
    }
    if ((schoolData.schoolLON == "NA") || (schoolData.schoolLON == null)) {
        cleanedData.schoolLON = "";
    } else {
        cleanedData.schoolLON = schoolData.schoolLON;
    }
    if ((schoolData.schoolLevel == "NA") || (schoolData.schoolLevel == null)) {
        cleanedData.schoolLevel = "";
    } else {
        cleanedData.schoolLevel = schoolData.schoolLevel;
    }
    if ((schoolData.schoolAgency == "NA") || (schoolData.schoolAgency == null)) {
        cleanedData.schoolAgency = "";
    } else {
        cleanedData.schoolLevel = schoolData.schoolLevel;
    }

    // building data: schoolProject, schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll, unqBuilding
    if ((schoolData.schoolProject == "NA") || (schoolData.schoolProject == null)) {
        tempSchoolProject = schoolData.schoolProject.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        cleanedData.schoolProject = tempSchoolProject;
    } else {
        cleanedData.schoolProject = schoolData.schoolProject;
    }
    var schoolSqftflag = isNumber(schoolData.schoolSqft);
    if (schoolSqftflag == true) {
        schoolSqft = parseInt(schoolData.schoolSqft);
        cleanedData.schoolSqft = numberWithCommas(schoolSqft);
    } else {
        cleanedData.schoolSqft = "";
    }
    var schoolMaxOccupancyFlag = isNumber(schoolData.schoolMaxOccupancy);
    if (schoolMaxOccupancyFlag == true) {
        schoolMaxOccupancy = parseInt(schoolData.schoolMaxOccupancy);
        cleanedData.schoolMaxOccupancy = numberWithCommas(schoolMaxOccupancy);
    } else {
        cleanedData.schoolMaxOccupancy = "";
    }
    var schoolSqFtPerEnrollFlag = isNumber(schoolData.schoolSqFtPerEnroll);
    if (schoolSqFtPerEnrollFlag == true) {
        schoolSqFtPerEnroll = parseInt(schoolData.schoolSqFtPerEnroll);
        cleanedData.schoolSqFtPerEnroll = numberWithCommas(schoolSqFtPerEnroll);
    } else {
        cleanedData.schoolSqFtPerEnroll = "";
    }
    cleanedData.unqBuilding = schoolData.unqBuilding;

    // schoolEnroll, studentEng, studentAtRisk, studentSpecEd, studentESLPer, studentAtRiskPer, studentSPEDPer
    var schoolEnrollFlag = isNumber(schoolData.schoolEnroll);
    if (schoolEnrollFlag == true) {
        schoolEnroll = parseInt(schoolData.schoolEnroll);
        cleanedData.schoolEnroll = numberWithCommas(schoolEnroll);
    } else {
        cleanedData.schoolEnroll = "";
    }
    var studentEngFlag = isNumber(schoolData.studentEng);
    if (studentEngFlag == true) {
        studentEng = parseInt(schoolData.studentEng);
        cleanedData.studentEng = numberWithCommas(studentEng);
    } else {
        cleanedData.studentEng = "";
    }
    var studentAtRiskFlag = isNumber(schoolData.studentAtRisk);
    if (studentAtRiskFlag == true) {
        studentAtRisk = parseInt(schoolData.studentAtRisk);
        cleanedData.studentAtRisk = numberWithCommas(studentAtRisk);
    } else {
        cleanedData.studentAtRisk = "";
    }
    var studentSpecEdFlag = isNumber(schoolData.studentSpecEd);
    if (studentSpecEdFlag == true) {
        studentSpecEd = parseInt(schoolData.studentSpecEd);
        cleanedData.studentSpecEd = numberWithCommas(studentSpecEd);
    } else {
        cleanedData.studentSpecEd = "";
    }
    var studentESLPerFlag = isNumber(schoolData.studentESLPer);
    if (studentESLPerFlag == true) {
        studentESLPer = parseInt(schoolData.studentESLPer);
        cleanedData.studentESLPer = numberWithCommas(studentESLPer);
    } else {
        cleanedData.studentESLPer = "";
    }
    var studentAtRiskPerFlag = isNumber(schoolData.studentAtRiskPer);
    if (studentAtRiskPerFlag == true) {
        studentAtRiskPer = parseInt(schoolData.studentAtRiskPer);
        cleanedData.studentAtRiskPer = numberWithCommas(studentAtRiskPer);
    } else {
        cleanedData.studentAtRiskPer = "";
    }
    var studentSPEDPerFlag = isNumber(schoolData.studentSPEDPer);
    if (studentSPEDPerFlag == true) {
        studentSPEDPer = parseInt(schoolData.studentSPEDPer);
        cleanedData.studentSPEDPer = numberWithCommas(studentSPEDPer);
    } else {
        cleanedData.studentSPEDPer = "";
    }

    // spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll, spendLTsqft, spendLTenroll
    var spendPastFlag = isNumber(schoolData.spendPast);
    if (spendPastFlag == true) {
        spendPast = parseInt(schoolData.spendPast);
        cleanedData.spendPast = numberWithCommas(spendPast);
    } else {
        cleanedData.spendPast = "";
    }
    var spendLifetimeFlag = isNumber(schoolData.spendLifetime);
    if (spendLifetimeFlag == true) {
        spendLifetime = parseInt(schoolData.spendLifetime);
        cleanedData.spendLifetime = numberWithCommas(spendLifetime);
    } else {
        cleanedData.spendLifetime = "";
    }
    var spendPlannedFlag = isNumber(schoolData.spendPlanned);
    if (spendPlannedFlag == true) {
        spendPlanned = parseInt(schoolData.spendPlanned);
        cleanedData.spendPlanned = numberWithCommas(spendPlanned);
    } else {
        cleanedData.spendPlanned = "";
    }
    var spendSqFtFlag = isNumber(schoolData.spendSqFt);
    if (spendSqFtFlag == true) {
        spendSqFt = parseInt(schoolData.spendSqFt);
        cleanedData.spendSqFt = numberWithCommas(spendSqFt);
    } else {
        cleanedData.spendSqFt = "";
    }
    var spendEnrollFlag = isNumber(schoolData.spendEnroll);
    if (spendEnrollFlag == true) {
        spendEnroll = parseInt(schoolData.spendEnroll);
        cleanedData.spendEnroll = numberWithCommas(spendEnroll);
    } else {
        cleanedData.spendEnroll = "";
    }

    return cleanedData;

    // == validation and formatting functions
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    }
}

// ======= ======= ======= multiSchoolProfile ======= ======= =======
function multiSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, schoolIndex) {
    console.log("multiSchoolProfile");
    console.log("  schoolIndex: ", schoolIndex);

    var checkSchool, checkAddress, multiSchool, schoolIndex, schoolName, listIndex;
    var selectedSchoolData = schoolsCollectionObj.selectedSchoolsArray[schoolIndex];
    var schoolAddress = selectedSchoolData.schoolAddress;
    var multiSchoolsArray = [];
    var schoolNamesString = "";

    for (var i = 0; i < schoolsCollectionObj.selectedSchoolsArray.length; i++) {
        checkSchool = schoolsCollectionObj.selectedSchoolsArray[i];
        checkAddress = checkSchool.schoolAddress;
        if (checkAddress == schoolAddress) {
            multiSchoolsArray.push(checkSchool);
        }
    }

    for (var i = 0; i < multiSchoolsArray.length; i++) {
        multiSchool = multiSchoolsArray[i];
        schoolIndex = multiSchool.schoolIndex;
        schoolName = multiSchool.schoolName;
        listIndex = i + 1;

        schoolNamesString += "<tr><td class='data-key'><p class='key-text'>school " + listIndex + "</p></td>";
        schoolNamesString += "<td class='data-value'><a id='" + schoolIndex + "' class='value-text' href='#'>" + schoolName + "</a></td></tr>";
    }

    var htmlString = "<table id='profile'>";
    htmlString += "<tr><td class='profile-banner' colspan=2>";
    htmlString += "<div id='close-X'><p>X</p></div>";
    htmlString += "<p class='profile-title'>Shared address schools</p>";
    htmlString += "<p class='profile-subtitle'>" + schoolAddress + "</p>";
    htmlString += "<p class='profile-subtitle2'>&nbsp;</p>";
    htmlString += "</td></tr>";
    htmlString += schoolNamesString;
    htmlString += "</table>";

    // == remove previous chart or profile html if any
    if ($('#chart-container').find('#chart').length) {
        $("#chart-container").fadeOut( "fast", function() {
            console.log("*** FADEOUT chart-container ***");
        });
        // $("#chart").remove();
    }
    if ($('#legend-container').find('#legend').length) {
        $("#legend").remove();
    }
    if ($('#profile-container').find('#profile').length) {
        $("#profile").remove();
        $("#profile-container").append(htmlString);
    } else {
        $("#profile-container").append(htmlString);
        $("#profile-container").fadeIn( "slow", function() {
            console.log("*** FADEIN profile-container ***");
        });
    }

    for (var i = 0; i < multiSchoolsArray.length; i++) {
        multiSchool = multiSchoolsArray[i];
        schoolIndex = multiSchool.schoolIndex;
        activateMultiSchoolLink(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolIndex);
    }
}

// ======= ======= ======= activateMultiSchoolLink ======= ======= =======
function activateMultiSchoolLink(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolId) {
    console.log("activateMultiSchoolLink");

    // ======= selectSchool =======
    $("#" + schoolId).off("mouseover").on("mouseover", function(event){
        console.log("\n======= mouseover =======");
        console.log("  this: ", this);

    });

    // ======= selectSchool =======
    $("#" + schoolId).off("click").on("click", function(event){
        console.log("\n======= click =======");
        console.log("  this.id: ", this.id);
        schoolData = schoolsCollectionObj.selectedSchoolsArray[this.id];
        makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, this.id);
    });
}

// ======= ======= ======= activateProfileSubmenu ======= ======= =======
function activateProfileSubmenu(displayObj, zonesCollectionObj, schoolsCollectionObj) {
    console.log("activateProfileSubmenu");

    $('#expendMathP').on({
        change: function() {
            console.log("\n------- setSubMenu -------");
            nextMath = $("select[name='expendMath'] option:selected").val()
            console.log("  event: ", event);
            console.log("  nextMath: ", nextMath);
            displayObj.dataFilters.math = nextMath;
            checkFilterSelection(displayObj, zonesCollectionObj, "math");

            getSubProfileData(schoolsCollectionObj, nextMath);
        }
    });
}

// ======= ======= ======= getSubProfileData ======= ======= =======
function getSubProfileData(schoolsCollectionObj, nextMath) {
    console.log("getSubProfileData");

    var cleanedSchoolData = schoolsCollectionObj.selectedSchool;
    console.dir(cleanedSchoolData);

    // == lifetime spending
    spendLifetime = cleanedSchoolData.spendLifetime;
    if (spendLifetime == "") {
        spendLifetime = "<span class='value-label'>No data for lifetime spending</span>";
    } else {
        spendLifetime = "$" + spendLifetime;
    }

    // == future spending
    spendPlanned = cleanedSchoolData.spendPlanned;
    if (spendPlanned == "") {
        spendPlanned = "<span class='value-label'>No data for future spending</span>";
    } else {
        spendPlanned = "$" + spendPlanned;
    }

    // == past spending
    spendPast = cleanedSchoolData.spendPast;
    if (spendPast == "") {
        spendPast = "<span class='value-label'>No data for past spending</span>";
    } else {
        spendPast = "$" + spendPast;
    }

    // == spending per student
    spendEnroll = cleanedSchoolData.spendEnroll;
    if ((spendEnroll == "") || (spendEnroll == 0)) {
        spendEnroll = "<span class='value-label'>No spending per student data</span>";
        spendEnrollSpan = "";
    } else {
        spendEnroll = "$" + parseInt(spendEnroll);
        spendEnrollSpan = " <span class='value-label'>per student</span>";
    }

    // == spending per sqft
    spendSqFt = parseInt(cleanedSchoolData.spendSqFt);
    if ((spendSqFt == "") || (spendSqFt == 0)) {
        spendSqFt = "<span class='value-label'>No spending per sqft data</span>";
        spendSqFtSpan = "";
    } else {
        spendSqFt = "$" + parseInt(spendSqFt);
        spendSqFtSpan = " <span class='value-label'>per sqft</span>";
    }

    if (nextMath == "spendEnroll") {
        $("#profileSpendLifetime").html(spendEnroll + spendEnrollSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per student data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per student data</span>");
    } else if (nextMath == "spendSqFt") {
        $("#profileSpendLifetime").html(spendSqFt + spendSqFtSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per sqft data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per sqft data</span>");
    } else if (nextMath == "spendAmount") {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(spendPast);
    } else {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(spendPast);
    }
}

// ======= ======= ======= initMap ======= ======= =======
function initMap(zonesCollectionObj, displayObj) {
    console.log('initMap');
    console.log('  displayObj.displayMode: ', displayObj.displayMode);

    // ======= map styles =======
    var styleArray = [
        { featureType: "all",
            stylers: [
                { saturation: -100 },
                { lightness: 40 }
            ]
        },
        { featureType: "road",
            elementType: "geometry",
            stylers: [
                { hue: "#00ffee" },
                { saturation: -50 }
            ]
        },
        { featureType: "road",
            elementType: 'labels',
            stylers: [
                { saturation: -100 },
                { invert_lightness: false },
                { visibility: "off" }
            ]
        },
        { featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    // ======= map object =======
    var href = window.location.href; // Returns path only
    var pathname = window.location.pathname; // Returns path only

    // ======= index map =======
    if (displayObj.displayMode != "storyMap") {
        console.log("*** toolMap ***");
        var mapContainer = document.getElementById('toolMap-container');
        var zoom = 12;

        map = new google.maps.Map(mapContainer, {
            center: {lat: 38.89, lng: -77.00},
            disableDefaultUI: false,
            disableDoubleClickZoom: true,
            zoomControl: true,
            zoomControlOpt: {
                style: 'SMALL',
                position: 'TOP_LEFT'
            },
            draggable: true,
            scrollwheel: false,
            styles: styleArray,     // styles for map tiles
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoom: zoom
        });

        google.maps.event.addListener(map, 'tilesloaded', function() {
            console.log("tilesloaded.addListener");
            if (!zonesCollectionObj.mapBounds) {
                zonesCollectionObj.mapBounds = map.getBounds();
                // console.log("  zonesCollectionObj.mapBounds: ",zonesCollectionObj.mapBounds);
                // makeOverlay();
            }
        });
    } else {
        console.log("*** storyMap ***");
        var zoom = 10;
        var mapContainer = document.getElementById('storyMap-container');
        // console.log("  mapContainer: ", mapContainer);
        map = new google.maps.Map(mapContainer, {
            center: {lat: 38.89, lng: -77.00},
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            zoomControl: false,
            draggable: true,
            scrollwheel: false,
            styles: styleArray,     // styles for map tiles
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoom: zoom
        });
    }
}

// ======= ======= ======= checkSchoolData ======= ======= =======
function checkSchoolData(zonesCollectionObj, schoolsCollectionObj, selectedSchoolsArray, selectedCodesArray, rejectedCodesArray, rejectedAggregatorArray) {
    console.log("checkSchoolData");

    // ======= check aggregated numbers =======
    var zoneAmountArray = [];
    var zoneEnrollArray = [];
    var zoneSqftArray = [];
    var amountTotal = 0;
    var enrollTotal = 0;
    var sqftTotal = 0;

    // ======= min/max/avg/med for each individual zone =======
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZoneObject = zonesCollectionObj.aggregatorArray[i];
        zoneAmountArray.push(nextZoneObject.zoneAmount);
        zoneEnrollArray.push(nextZoneObject.zoneEnroll);
        zoneSqftArray.push(nextZoneObject.zoneSqft);
        amountTotal = amountTotal + nextZoneObject.zoneAmount;
        enrollTotal = enrollTotal + nextZoneObject.zoneEnroll;
        sqftTotal = sqftTotal + nextZoneObject.zoneSqft;
        console.log("******* min/max/avg/med for: ", nextZoneObject.zoneName);
        console.log("  schoolCount: ", nextZoneObject.schoolCount);
        console.log("  zoneAmount: ", nextZoneObject.zoneAmount);
        console.log("  zoneSqft:   ", nextZoneObject.zoneSqft);
        console.log("  zoneEnroll: ", nextZoneObject.zoneEnroll);
        console.log("  amountMin: ", nextZoneObject.amountMin);
        console.log("  amountMax: ", nextZoneObject.amountMax);
        console.log("  amountAvg: ", nextZoneObject.amountAvg);
        console.log("  amountMed: ", nextZoneObject.amountMed);
    }
    var minAmount = Math.min.apply(Math, zoneAmountArray);
    var maxAmount = Math.max.apply(Math, zoneAmountArray);
    var avgAmount = amountTotal/zonesCollectionObj.aggregatorArray.length;
    var incAmount = maxAmount/zonesCollectionObj.aggregatorArray.length;
    var minEnroll = Math.min.apply(Math, zoneEnrollArray);
    var maxEnroll = Math.max.apply(Math, zoneEnrollArray);
    var avgEnroll = enrollTotal/zonesCollectionObj.aggregatorArray.length;
    var incEnroll = maxEnroll/zonesCollectionObj.aggregatorArray.length;
    var minSqft = Math.min.apply(Math, zoneSqftArray);
    var maxSqft = Math.max.apply(Math, zoneSqftArray);
    var avgSqft = sqftTotal/zonesCollectionObj.aggregatorArray.length;
    var incSqft = maxSqft/zonesCollectionObj.aggregatorArray.length;

    // ======= min/max/avg/med for each all zones =======
    console.log("*** all zone amounts ***");
    console.log("  zoneAmountArray: ", zoneAmountArray);
    console.log("  minAmount: ", minAmount);
    console.log("  maxAmount: ", maxAmount);
    console.log("  avgAmount: ", avgAmount);
    console.log("  incAmount: ", incAmount);
    console.log("*** all zone enroll ***");
    console.log("  zoneEnrollArray: ", zoneEnrollArray);
    console.log("  minEnroll: ", minEnroll);
    console.log("  maxEnroll: ", maxEnroll);
    console.log("  avgEnroll: ", avgEnroll);
    console.log("  incEnroll: ", incEnroll);
    console.log("*** all zone sqft ***");
    console.log("  zoneSqftArray: ", zoneSqftArray);
    console.log("  minSqft: ", minSqft);
    console.log("  maxSqft: ", maxSqft);
    console.log("  avgSqft: ", avgSqft);
    console.log("  incSqft: ", incSqft);

    // == check arrays for consistency or errors
    console.log("*** all schools count: ", schoolsCollectionObj.jsonData.length);
    console.log("  selectedSchoolsCt: ", selectedSchoolsArray.length);
    console.log("  selectedCodesCt: ", selectedCodesArray.length);
    console.log("  rejectedCodesCt: ", rejectedCodesArray.length);
    console.log("  aggregatorArray: ", zonesCollectionObj.aggregatorArray.length);
    console.log("  rejectedAggCt: ", rejectedAggregatorArray.length);
}

// ======= ======= ======= floating windows ======= ======= =======
function initFloatingWindows() {
    console.log("initFloatingWindows");

    var popup = document.getElementById("popup");
    var drag_bar = document.getElementById("drag_bar");
    var offset = { x: 0, y: 0 };

    drag_bar.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseDown(e){
        console.log("mouseDown");
        offset.x = e.clientX - popup.offsetLeft;
        offset.y = e.clientY - popup.offsetTop;
        window.addEventListener('mousemove', popupMove, true);
    }
    function popupMove(e){
        console.log("popupMove");
        popup.style.position = 'absolute';
        var top = e.clientY - offset.y;
        var left = e.clientX - offset.x;
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }
    function mouseUp() {
        console.log("mouseUp");
        window.removeEventListener('mousemove', popupMove, true);
    }
}
