

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

// ======= ======= ======= getZoneUrls ======= ======= =======
function getZoneUrls(displayObj) {
    console.log("getZoneUrls");
    console.log("  .zoneA: ", displayObj.zoneA);
    console.log("  .zones: ", displayObj.dataFilters.zones);

    var feederFlag = false;
    if (displayObj.displayMode == "storyMap") {
        var websitePrefix = "prototypes/filter-map/";
    } else {
        var websitePrefix = "";
    }

    if (displayObj.dataFilters.zones) {
        if (displayObj.dataFilters.zones == "Ward") {
            urlA = websitePrefix + "Data_Geo/Ward__2012.geojson";
            urlB = null;
        } else if (displayObj.dataFilters.zones == "FeederHS") {
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
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
            urlB = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        }
    } else {
        if (displayObj.dataFilters.levels == "HS") {
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Senior_High__New.geojson";
        } else if (displayObj.dataFilters.levels == "MS") {
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
        } else if (displayObj.dataFilters.levels == "ES") {
            urlA = websitePrefix + "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        } else {
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

    var shortName;

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
        // if (checkName3 == (shortName.length - 1)) {
        //     shortName = shortName.substring(0, (shortName.length - 1));
        // }
    }
    return shortName;
}

// ======= ======= ======= checkFilterSelection ======= ======= =======
function checkFilterSelection(displayObj, zonesCollectionObj, whichCategory) {
    console.log("checkFilterSelection");

    console.log("  whichCategory: ", whichCategory);
    console.log("  zoneA: ", zonesCollectionObj.zoneA);
    console.log("  * agency: ", displayObj.dataFilters.agency);
    console.log("  * levels: ", displayObj.dataFilters.levels);
    console.log("  * expend: ", displayObj.dataFilters.expend);
    console.log("  * zones: ", displayObj.dataFilters.zones);
    console.log("  * math: ", displayObj.dataFilters.math);
}

// ======= ======= ======= updateChartText ======= ======= =======
function updateChartText(displayObj, expendText, subtitle) {
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
        mathText = filterMenu[displayObj.dataFilters.math].text;
        if (mathText == "dollar amount") {
            mathText = "";
        }
    } else {
        mathText = "";
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
        console.log("  filterMenu: ", filterMenu);
        console.log("  displayObj.dataFilters.levels: ", displayObj.dataFilters.levels);
        schoolText = filterMenu[whichLevel].text;
    } else {
        schoolText = "";
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


// ======= ======= ======= updateFilterTitles ======= ======= =======
function updateFilterTitles(displayObj, whichFilterText, addRemove) {
    console.log("updateFilterTitles");
    console.log("  whichFilterText: ", whichFilterText);
    console.log("  displayObj.filterTitlesArray.length: ", displayObj.filterTitlesArray.length);

    var filterTitleContainer = $("#filters-title").children("h2");
    var filterText = $(filterTitleContainer).html();
    var checkArray;

    // == add message for user (not filter selections)
    if (typeof displayObj == "string") {
        filterText = "<span class='filterLabel'>Message: </span>";
        filterText += displayObj;
        $(filterTitleContainer).addClass("filterList");

    // == add filter selections
    } else {

        // == selected zone filter
        if ((displayObj.dataFilters.selectedZone != null) && (addRemove == "add")) {
            displayObj.filterTitlesArray = [];
            displayObj.filterTitlesArray.push(whichFilterText);
            filterText = "<span class='filterLabel'>Selected Zone: </span>" + whichFilterText;
            $(filterTitleContainer).addClass("filterList");

        // == no selected zone (normal filter processing)
        } else {
            if ((addRemove == "add") || (addRemove == "FeederHS") || (addRemove == "FeederMS")) {
                console.log("  addRemove: ", addRemove);
                // if (displayObj.filterTitlesArray.length == 1) {
                //     console.log("  displayObj.filterTitlesArray.length: ", displayObj.filterTitlesArray.length);
                //     filterText = "<span class='filterLabel'>Data for: </span>" + whichFilterText;
                // } else {

                    // == remove previously selected levels filters (added back based on zone selection)
                    if ((addRemove == "FeederHS") || (addRemove == "FeederMS")) {
                        console.log("  displayObj.filterTitlesArray: ", displayObj.filterTitlesArray);
                        removeItemsArray = ["High Schools", "Middle Schools", "Elementary Schools", "FeederHS", "FeederMS"];
                        for (var i = 0; i < removeItemsArray.length; i++) {
                            checkItem = removeItemsArray[i];
                            checkArray = $.inArray(checkItem, displayObj.filterTitlesArray);
                            if (checkArray > -1) {
                                displayObj.filterTitlesArray.splice(checkArray, 1);
                            }
                        }
                        displayObj.filterTitlesArray.push(addRemove);
                    }
                    displayObj.filterTitlesArray.push(whichFilterText);
                    console.log("  displayObj.filterTitlesArray: ", displayObj.filterTitlesArray);

                    // == build new filter text html from filterTitlesArray
                    filterText = "<span class='filterLabel'>Data for: </span>";
                    if (displayObj.filterTitlesArray.length > 0) {
                        for (var i = 0; i < displayObj.filterTitlesArray.length; i++) {
                            nextFilter = displayObj.filterTitlesArray[i];
                            if (i == (displayObj.filterTitlesArray.length - 1)) {
                                filterText += whichFilterText;
                            } else {
                                filterText += nextFilter + ", ";
                            }
                        }
                    }
                // }
                $(filterTitleContainer).addClass("filterList");

            // == removing previous filters
            } else {

                // == find selected filter (whichFilterText) in array and remove it
                for (var i = 0; i < displayObj.filterTitlesArray.length; i++) {
                    checkFilter = displayObj.filterTitlesArray[i];
                    if (checkFilter == whichFilterText) {
                        displayObj.filterTitlesArray.splice(i, 1);
                        break;
                    }
                }

                // == all filters have been removed; return to init state
                if (displayObj.filterTitlesArray.length == 0) {
                    filterText = "your filters";
                    $(filterTitleContainer).removeClass("filterList");

                // == display remaining filters after removing selected filter
                } else {
                    filterText = "<span class='filterLabel'>Data for: </span>";
                    for (var i = 0; i < displayObj.filterTitlesArray.length; i++) {
                        nextFilter = displayObj.filterTitlesArray[i];
                        if (i == (displayObj.filterTitlesArray.length - 1)) {
                            filterText += nextFilter;
                        } else {
                            filterText += nextFilter + ", ";
                        }
                    }
                    $(filterTitleContainer).addClass("filterList");
                }
            }
        }
    }
    $(filterTitleContainer).html(filterText);
}



// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= AGGREGATORS ======= ======= ======= ======= =======

// ======= ======= ======= makeZoneAggregator ======= ======= =======
function makeZoneAggregator(zonesCollectionObj, whichGeojson) {
    console.log("makeZoneAggregator");

    zonesCollectionObj.aggregatorArray = [];
    if (whichGeojson) {
        var nextZoneName, splitZoneName, nextZoneObject;
        for (var i = 0; i < whichGeojson.features.length; i++) {
            nextZoneName = whichGeojson.features[i].properties.NAME;
            nextZoneObject = { zoneIndex:i, zoneName:nextZoneName, zoneAmount:0, zoneSqft:0, zoneEnroll:0 }
            zonesCollectionObj.aggregatorArray.push(nextZoneObject);
            // console.log("  nextZoneObject.zoneName: ", i, "/", nextZoneObject.zoneName);
        }
    } else {
        console.log("ERROR: no geojson data");
    }
    console.dir(zonesCollectionObj.aggregatorArray);
}

// ======= ======= ======= clearZoneAggregator ======= ======= =======
function clearZoneAggregator(zonesCollectionObj) {
    console.log("clearZoneAggregator");

    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        zonesCollectionObj.aggregatorArray[i].zoneAmount = 0;
        zonesCollectionObj.aggregatorArray[i].zoneSqft = 0;
        zonesCollectionObj.aggregatorArray[i].zoneEnroll = 0;
    }
}

// ======= ======= ======= aggregateZoneData ======= ======= =======
function aggregateZoneData(zonesCollectionObj, displayObj, schoolData, masterIndex) {
    // console.log("aggregateZoneData");

    var schoolWard = nextZoneIndex = nextSchoolExpend = currentAmount = aggregatedAmount = 0;
    var nextZone = schoolZoneIndex = null;
    // console.log("*** .schoolName: ", schoolData.schoolName);
    // console.log("  .schoolFeederHS: ", schoolData.schoolFeederHS);
    // console.log("  .schoolFeederMS: ", schoolData.schoolFeederMS);
    // console.log("  .schoolWard: ", schoolData.schoolWard);

    // == match school name from geojson file with school name from csv file
    if (displayObj.dataFilters.zones) {
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
    }

    // == identify column holding selected expend filter data
    // console.log("  schoolZoneIndex: ", schoolZoneIndex);
    if (schoolZoneIndex != null) {
        // console.log("*** schoolZoneIndex: ", schoolZoneIndex);
        nextSchoolExpend = parseInt(schoolData[displayObj.dataFilters.expend]);
        nextSchoolSqft = parseInt(schoolData.schoolSqft);
        nextSchoolEnroll = parseInt(schoolData.schoolEnroll);
        // console.log("  nextSchoolExpend: ", nextSchoolExpend);
        // console.log("  nextSchoolSqft: ", nextSchoolSqft);
        // console.log("  nextSchoolEnroll: ", nextSchoolEnroll);

        // == aggregate new value into zone total
        if (Number.isInteger(nextSchoolExpend)) {
            if (nextSchoolExpend >= 0) {
                currentAmount = zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneAmount;
                aggregatedAmount = currentAmount + nextSchoolExpend;
                zonesCollectionObj.aggregatorArray[schoolZoneIndex].zoneAmount = aggregatedAmount;
            } else {
                console.log("ERROR: negative values for " + schoolData.schoolName);
                nextSchoolExpend = 0;
            }
        } else {
            // console.log("ERROR: nextSchoolExpend NaN " + schoolData.schoolName);
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
            // console.log("ERROR: nextSchoolSqft NaN " + schoolData.schoolName);
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
            // console.log("ERROR: nextSchoolEnroll NaN " + schoolData.schoolName);
            nextSchoolEnroll = 0;
        }

        // console.log("*** school/index: ", schoolData.schoolName, "/", schoolZoneIndex);
        // console.log("  currentAmount: ", currentAmount);
        // console.log("    nextSchoolExpend: ", nextSchoolExpend);
        // console.log("    aggregatedAmount: ", aggregatedAmount);
        // console.log("  currentSqft: ", currentSqft);
        // console.log("    nextSchoolSqft: ", nextSchoolSqft);
        // console.log("    aggregatedSqft: ", aggregatedSqft);
        // console.log("  currentEnroll: ", currentEnroll);
        // console.log("    nextSchoolEnroll: ", nextSchoolEnroll);
        // console.log("    aggregatedEnroll: ", aggregatedEnroll);

        return null;
    } else {
        return schoolData.schoolCode;
    }
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
    updateFilterTitles("Select zone or school");
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
function getDataDetails(nextSchool) {
    // console.log("getDataDetails");

    // schoolCode, schoolName, schoolWard, schoolFeederMS, schoolFeederHS, schoolAddress, schoolLAT, schoolLON, schoolLevel:, schoolAgency
    // building data: schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll
    // student population data: schoolEnroll, studentEng, studentAtRisk, studentSpecEd, studentESLPer, studentAtRiskPer, studentSPEDPer
    // spending data: spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll

    var schoolData = {
        // school identity data
        "schoolCode": nextSchool.SCHOOLCODE,
        "schoolName": nextSchool.School,
        "schoolWard": nextSchool.WARD,
        "schoolFeederMS": nextSchool.FeederMS,
        "schoolFeederHS": nextSchool.FeederHS,
        "schoolAddress": nextSchool.Address,
        "schoolLAT": nextSchool.LAT,
        "schoolLON": nextSchool.LON,
        "schoolLevel": nextSchool.Level,
        "schoolAgency": nextSchool.Agency,

        // school building data
        "schoolProject": nextSchool.ProjectType,
        "schoolSqft": nextSchool.totalSQFT,
        "schoolMaxOccupancy": nextSchool.maxOccupancy,
        "schoolSqFtPerEnroll": nextSchool.SqFtPerEnroll,

        // student population data
        "schoolEnroll": nextSchool.Total_Enrolled,
        "studentEng": nextSchool.Limited_English,
        "studentAtRisk": nextSchool.At_Risk,
        "studentSpecEd": nextSchool.SpecEd_fake,
        "studentESLPer": nextSchool.ESLPer,
        "studentAtRiskPer": nextSchool.AtRiskPer,
        "studentSPEDPer": nextSchool.SPEDPer,

        // spending data
        "spendPast": nextSchool.MajorExp9815,
        "spendLifetime": nextSchool.LifetimeBudget,
        "spendPlanned": nextSchool.TotalAllotandPlan1621,
        "spendSqFt": nextSchool.SpentPerSqFt,           // Sqft
        "spendLTsqft": nextSchool.LTBudgetPerSqFt,
        "spendEnroll": nextSchool.SpentPerEnroll,       // Student
        "spendLTenroll": nextSchool.LTBudgetPerEnroll
    }
   return schoolData;
}

// ======= ======= ======= makeSchoolProfile ======= ======= =======
function makeSchoolProfile(collectionOrSchool, displayObj, schoolIndex) {
    console.log("makeSchoolProfile");
    console.log("  schoolIndex: ", schoolIndex);

    if ((typeof schoolIndex === 'undefined') || (typeof schoolIndex === 'null')) {
        console.log("*** TRUE ***");
        var processedSchoolData = getDataDetails(collectionOrSchool);
        var cleanedSchoolData = validateSchoolData(processedSchoolData);
    } else {
        var selectedSchoolData = collectionOrSchool.selectedSchoolsArray[schoolIndex];
        var cleanedSchoolData = validateSchoolData(selectedSchoolData);
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
        if (itemName.length > 45) {
            itemName = itemName.substring(0, 42) + "...";
        }
    }

    var htmlString = "<table id='profile'>";
    htmlString += "<tr><td class='profile-banner' colspan=2><div id='close-X'>X</div>";
    htmlString += "<p class='profile-title'>" + itemName + "</p><p class='profile-subtitle'>" + cleanedSchoolData.schoolAddress + "</p>";
    htmlString += "<p class='profile-subtitle'>Ward " + cleanedSchoolData.schoolWard + " / " + cleanedSchoolData.schoolLevel + "</p>";
    htmlString += "</td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>project type</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolProject + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>HS Feeder</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolFeederHS + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>bldg Sqft</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolSqft + " <span class='value-label'>sqft</span></p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>bldg capacity</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolMaxOccupancy + " <span class='value-label'>students</span></p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>enrolled (2014-15)</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolEnroll + " <span class='value-label'>students</span></p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>sqft/enrolled</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.schoolSqFtPerEnroll + " <span class='value-label'>sqft per student</span></p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>Lifetime Spending</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>$" + cleanedSchoolData.spendLifetime + "</p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>spending/enrolled</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>$" + cleanedSchoolData.spendEnroll + " <span class='value-label'>per student</span></p></td></tr>";
    htmlString += "<tr><td class='data-key'><p class='key-text'>spending/sqft</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>$" + cleanedSchoolData.spendSqFt + " <span class='value-label'>per sqft</span></p></td></tr>";
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
    displayObj.activateCloseButton();
}

// ======= ======= ======= validateSchoolData ======= ======= =======
function validateSchoolData(selectedSchoolData) {
    console.log("validateSchoolData");
    // console.log("  selectedSchoolData: ", selectedSchoolData);

    // school data: schoolCode, schoolName, schoolWard, schoolFeederMS, schoolFeederHS, schoolAddress, schoolLAT, schoolLON, schoolLevel:, schoolAgency
    // building data: schoolSqft, schoolMaxOccupancy, schoolSqFtPerEnroll
    // student data: schoolEnroll, studentEng, studentAtRisk, studentSpecEd, studentESLPer, studentAtRiskPer, studentSPEDPer
    // spending data: spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll
    if (selectedSchoolData.schoolLevel == "ES") {
        selectedSchoolData.schoolLevel = "elementary school";
    }
    if (selectedSchoolData.schoolLevel == "MS") {
        selectedSchoolData.schoolLevel = "middle school";
    }
    if (selectedSchoolData.schoolLevel == "HS") {
        selectedSchoolData.schoolLevel = "high school";
    }
    if (selectedSchoolData.schoolLevel == "ES/MS") {
        selectedSchoolData.schoolLevel = "elementary/middle school";
    }
    if (selectedSchoolData.schoolLevel == "ALT") {
        selectedSchoolData.schoolLevel = "alternative school";
    }
    if (selectedSchoolData.schoolLevel == "NA") {
        selectedSchoolData.schoolLevel = "&nbsp;";
    }

    selectedSchoolData.schoolProject =  selectedSchoolData.schoolProject.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    selectedSchoolData.schoolSqft = numberWithCommas(selectedSchoolData.schoolSqft);
    selectedSchoolData.schoolMaxOccupancy = selectedSchoolData.schoolMaxOccupancy;
    selectedSchoolData.schoolEnroll = selectedSchoolData.schoolEnroll;

    var schoolSqFtPerEnroll = isNumber(selectedSchoolData.schoolSqFtPerEnroll);
    if (schoolSqFtPerEnroll == true) {
        // schoolSqFtPerEnroll = Math.round(selectedSchoolData.schoolSqFtPerEnroll * 100)/100;
        schoolSqFtPerEnroll = parseInt(selectedSchoolData.schoolSqFtPerEnroll);
        selectedSchoolData.schoolSqFtPerEnroll = schoolSqFtPerEnroll;
    } else {
        selectedSchoolData.schoolSqFtPerEnroll = "";
    }

    var spendLifetime = isNumber(selectedSchoolData.spendLifetime);
    if (spendLifetime == true) {
        spendLifetime = numberWithCommas(selectedSchoolData.spendLifetime)
        selectedSchoolData.spendLifetime = spendLifetime;
    } else {
        selectedSchoolData.spendLifetime = "";
    }

    var spendEnroll = isNumber(selectedSchoolData.spendEnroll);
    if (spendEnroll == true) {
        spendEnroll = parseInt(selectedSchoolData.spendEnroll);
        spendEnroll = numberWithCommas(spendEnroll);
        spendEnrollStr = spendEnroll;
        selectedSchoolData.spendEnroll = spendEnrollStr;
    } else {
        selectedSchoolData.spendEnroll = "";
    }

    var spendSqFt = isNumber(selectedSchoolData.spendSqFt);
    if (spendSqFt == true) {
        spendSqFt = parseInt(selectedSchoolData.spendSqFt);
        spendSqFtStr = spendSqFt;
        selectedSchoolData.spendSqFt = spendSqFtStr;
    } else {
        selectedSchoolData.spendSqFt = "";
    }

    // == validation and formatting functions
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    }

    return selectedSchoolData;
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
    }
}

// ======= ======= ======= floating windows ======= ======= =======
(function(){
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
}());
