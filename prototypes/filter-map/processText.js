

// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======

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

    var shortName, checkName1, checkName2, checkName3, splitZoneName;

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
        mathText = filterMenu[displayObj.dataFilters.math].text;
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
        schoolText = filterMenu[whichLevel].label;
    } else {
        schoolText = "";
    }
    if (displayObj.displayMode == "storyMap") {
        $('#chart-label').text("");
    }
    $("#chart-title").text(expendText + " " + mathText);
    $('#chart-subtitle').text(subtitle);

    return [mathText, schoolText, agencyText];
}

// ======= ======= ======= updateHoverText ======= ======= =======
function updateHoverText(itemName, schoolType, schoolCode) {
    // console.log("updateHoverText");

    var filterTitleContainer = $("#mouseover-text").children("h2");
    var filterText = $(filterTitleContainer).text();
    if (itemName) {
        $("#mouseover-text").children("h2").css("visibility", "visible");
        if (schoolType == "DCPS") {
            $("#mouseover-text").children("h2").css("color", "#7aa25c");
        } else if (schoolType == "PCS") {
            $("#mouseover-text").children("h2").css("color", "orange");
        }
        if (schoolCode) {
            $(filterTitleContainer).html(itemName + " " + schoolCode);
        } else {
            $(filterTitleContainer).html(itemName);
        }
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

// ======= ======= ======= updateFilterText ======= ======= =======
function updateFilterText(displayObj, whichMenu, filterText) {
    console.log("updateFilterText");

    // == displays current user filter selections as string in #filters-selections div
    var selectedFilterContainer = $("#filters-selections").children("h2");
    var nextFilter, checkNextFilter;

    var selectedFilterText = "<span class='filterLabel'>Data for: </span>";
    if (displayObj.filterTitlesObject.expend) {
        selectedFilterText += displayObj.filterTitlesObject.expend + " for";
    }
    if (displayObj.filterTitlesObject.agency) {
        selectedFilterText += " " + displayObj.filterTitlesObject.agency;
    }
    if (displayObj.filterTitlesObject.levels) {
        selectedFilterText += " " + displayObj.filterTitlesObject.levels;
    }
    if (displayObj.filterTitlesObject.zones) {
        selectedFilterText += " by " + displayObj.filterTitlesObject.zones;
    }

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

// ======= ======= ======= cleanupSchoolData ======= ======= =======
function cleanupSchoolData(schoolsCollectionObj, schoolData) {
    console.log("cleanupSchoolData");

    var cleanedData = {};

    // schoolIndex, schoolName, Ward, schoolCode, FeederMS, FeederHS, schoolAddress, schoolLAT, schoolLON, schoolLevel, YrComplete
    cleanedData.schoolIndex = schoolData.schoolIndex;
    cleanedData.schoolName = schoolData.schoolName;
    cleanedData.Ward = schoolData.Ward;

    if (schoolData.schoolCode == null) {
        cleanedData.schoolCode = "";
    } else {
        cleanedData.schoolCode = schoolData.schoolCode;
    }
    if (schoolData.FeederMS == null) {
        cleanedData.FeederMS = "";
    } else {
        cleanedData.FeederMS = schoolData.FeederMS;
    }
    if (schoolData.FeederHS == null) {
        cleanedData.FeederHS = "";
    } else {
        cleanedData.FeederHS = schoolData.FeederHS;
    }
    if (schoolData.schoolAddress == null) {
        cleanedData.schoolAddress = "";
    } else {
        cleanedData.schoolAddress = schoolData.schoolAddress;
    }
    if (schoolData.schoolLAT == null) {
        cleanedData.schoolLAT = "";
    } else {
        cleanedData.schoolLAT = schoolData.schoolLAT;
    }
    if (schoolData.schoolLON == null) {
        cleanedData.schoolLON = "";
    } else {
        cleanedData.schoolLON = schoolData.schoolLON;
    }
    if (schoolData.schoolLevel == null) {
        cleanedData.schoolLevel = "";
    } else {
        cleanedData.schoolLevel = schoolData.schoolLevel;
    }
    if (schoolData.schoolAgency == null) {
        cleanedData.schoolAgency = "";
    } else {
        cleanedData.schoolAgency = schoolData.schoolAgency;
    }

    if (schoolData.YrComplete == null) {
        cleanedData.YrComplete = "";
    } else {
        cleanedData.YrComplete = schoolData.YrComplete;
    }
    if (schoolData.FUTUREProjectType16_21 == null) {
        cleanedData.FUTUREProjectType16_21 = "";
    } else {
        cleanedData.FUTUREProjectType16_21 = schoolData.FUTUREProjectType16_21;
    }
    if (schoolData.FutureYrComplete == null) {
        cleanedData.FutureYrComplete = "";
    } else {
        cleanedData.FutureYrComplete = schoolData.FutureYrComplete;
    }


    // building data: ProjectType, totalSQFT, maxOccupancy, schoolSqFtPerEnroll, unqBuilding
    if (schoolData.ProjectType == null) {
        var tempProjectType = schoolData.ProjectType.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        cleanedData.ProjectType = tempProjectType;
    } else {
        cleanedData.ProjectType = schoolData.ProjectType;
    }
    var schoolSqftflag = isNumber(schoolData.totalSQFT);
    if (schoolSqftflag == true) {
        var totalSQFT = parseInt(schoolData.totalSQFT);
        cleanedData.totalSQFT = numberWithCommas(totalSQFT);
    } else {
        cleanedData.totalSQFT = "";
    }
    var schoolMaxOccupancyFlag = isNumber(schoolData.maxOccupancy);
    if (schoolMaxOccupancyFlag == true) {
        var maxOccupancy = parseInt(schoolData.maxOccupancy);
        cleanedData.maxOccupancy = numberWithCommas(maxOccupancy);
    } else {
        cleanedData.maxOccupancy = "";
    }
    var schoolSqFtPerEnrollFlag = isNumber(schoolData.schoolSqFtPerEnroll);
    if (schoolSqFtPerEnrollFlag == true) {
        var schoolSqFtPerEnroll = parseInt(schoolData.schoolSqFtPerEnroll);
        cleanedData.schoolSqFtPerEnroll = numberWithCommas(schoolSqFtPerEnroll);
    } else {
        cleanedData.schoolSqFtPerEnroll = "";
    }
    cleanedData.unqBuilding = schoolData.unqBuilding;

    // schoolEnroll, studentEng, studentAtRisk, studentSpecEd, studentESLPer, studentAtRiskPer, studentSPEDPer
    var schoolEnrollFlag = isNumber(schoolData.schoolEnroll);
    if (schoolEnrollFlag == true) {
        var schoolEnroll = parseInt(schoolData.schoolEnroll);
        cleanedData.schoolEnroll = numberWithCommas(schoolEnroll);
    } else {
        cleanedData.schoolEnroll = "";
    }
    var studentEngFlag = isNumber(schoolData.studentEng);
    if (studentEngFlag == true) {
        var studentEng = parseInt(schoolData.studentEng);
        cleanedData.studentEng = numberWithCommas(studentEng);
    } else {
        cleanedData.studentEng = "";
    }
    var studentAtRiskFlag = isNumber(schoolData.studentAtRisk);
    if (studentAtRiskFlag == true) {
        var studentAtRisk = parseInt(schoolData.studentAtRisk);
        cleanedData.studentAtRisk = numberWithCommas(studentAtRisk);
    } else {
        cleanedData.studentAtRisk = "";
    }
    var studentSpecEdFlag = isNumber(schoolData.studentSpecEd);
    if (studentSpecEdFlag == true) {
        var studentSpecEd = parseInt(schoolData.studentSpecEd);
        cleanedData.studentSpecEd = numberWithCommas(studentSpecEd);
    } else {
        cleanedData.studentSpecEd = "";
    }
    var studentESLPerFlag = isNumber(schoolData.studentESLPer);
    if (studentESLPerFlag == true) {
        var studentESLPer = parseInt(schoolData.studentESLPer);
        cleanedData.studentESLPer = numberWithCommas(studentESLPer);
    } else {
        cleanedData.studentESLPer = "";
    }
    var studentAtRiskPerFlag = isNumber(schoolData.studentAtRiskPer);
    if (studentAtRiskPerFlag == true) {
        var studentAtRiskPer = parseInt(schoolData.studentAtRiskPer);
        cleanedData.studentAtRiskPer = numberWithCommas(studentAtRiskPer);
    } else {
        cleanedData.studentAtRiskPer = "";
    }
    var studentSPEDPerFlag = isNumber(schoolData.studentSPEDPer);
    if (studentSPEDPerFlag == true) {
        var studentSPEDPer = parseInt(schoolData.studentSPEDPer);
        cleanedData.studentSPEDPer = numberWithCommas(studentSPEDPer);
    } else {
        cleanedData.studentSPEDPer = "";
    }

    // MajorExp9815, spendLifetime, spendPlanned, spendSqFt, spendEnroll, spendLTsqft, spendLTenroll
    var spendPastFlag = isNumber(schoolData.MajorExp9815);
    if (spendPastFlag == true) {
        var MajorExp9815 = parseInt(schoolData.MajorExp9815);
        cleanedData.MajorExp9815 = numberWithCommas(MajorExp9815);
    } else {
        cleanedData.MajorExp9815 = "";
    }
    var spendLifetimeFlag = isNumber(schoolData.spendLifetime);
    if (spendLifetimeFlag == true) {
        var spendLifetime = parseInt(schoolData.spendLifetime);
        cleanedData.spendLifetime = numberWithCommas(spendLifetime);
    } else {
        cleanedData.spendLifetime = "";
    }
    var spendPlannedFlag = isNumber(schoolData.spendPlanned);
    if (spendPlannedFlag == true) {
        var spendPlanned = parseInt(schoolData.spendPlanned);
        cleanedData.spendPlanned = numberWithCommas(spendPlanned);
    } else {
        cleanedData.spendPlanned = "";
    }
    var spendSqFtFlag = isNumber(schoolData.spendSqFt);
    if (spendSqFtFlag == true) {
        var spendSqFt = parseInt(schoolData.spendSqFt);
        cleanedData.spendSqFt = numberWithCommas(spendSqFt);
    } else {
        cleanedData.spendSqFt = "";
    }
    var spendEnrollFlag = isNumber(schoolData.spendEnroll);
    if (spendEnrollFlag == true) {
        var spendEnroll = parseInt(schoolData.spendEnroll);
        cleanedData.spendEnroll = numberWithCommas(spendEnroll);
    } else {
        cleanedData.spendEnroll = "";
    }

    // TotalAllotandPlan1621perMaxOcc, TotalAllotandPlan1621perGSF, LifetimeBudgetperMaxOcc, LifetimeBudgetperGSF
    // console.log("  schoolData.TotalAllotandPlan1621perMaxOcc: ", schoolData.TotalAllotandPlan1621perMaxOcc);

    var TotalAllotandPlan1621perMaxOccFlag = isNumber(schoolData.TotalAllotandPlan1621perMaxOcc);
    if (TotalAllotandPlan1621perMaxOccFlag == true) {
        var TotalAllotandPlan1621perMaxOcc = parseInt(schoolData.TotalAllotandPlan1621perMaxOcc);
        cleanedData.TotalAllotandPlan1621perMaxOcc = numberWithCommas(TotalAllotandPlan1621perMaxOcc);
    } else {
        cleanedData.TotalAllotandPlan1621perMaxOcc = "";
    }
    // console.log("  cleanedData.TotalAllotandPlan1621perMaxOcc: ", cleanedData.TotalAllotandPlan1621perMaxOcc);

    var TotalAllotandPlan1621perGSFFlag = isNumber(schoolData.TotalAllotandPlan1621perGSF);
    if (TotalAllotandPlan1621perGSFFlag == true) {
        var TotalAllotandPlan1621perGSF = parseInt(schoolData.TotalAllotandPlan1621perGSF);
        cleanedData.TotalAllotandPlan1621perGSF = numberWithCommas(TotalAllotandPlan1621perGSF);
    } else {
        cleanedData.TotalAllotandPlan1621perGSF = "";
    }
    var LifetimeBudgetperMaxOccFlag = isNumber(schoolData.LifetimeBudgetperMaxOcc);
    if (LifetimeBudgetperMaxOccFlag == true) {
        var LifetimeBudgetperMaxOcc = parseInt(schoolData.LifetimeBudgetperMaxOcc);
        cleanedData.LifetimeBudgetperMaxOcc = numberWithCommas(LifetimeBudgetperMaxOcc);
    } else {
        cleanedData.LifetimeBudgetperMaxOcc = "";
    }
    var LifetimeBudgetperGSFFlag = isNumber(schoolData.LifetimeBudgetperGSF);
    if (LifetimeBudgetperGSFFlag == true) {
        var LifetimeBudgetperGSF = parseInt(schoolData.LifetimeBudgetperGSF);
        cleanedData.LifetimeBudgetperGSF = numberWithCommas(LifetimeBudgetperGSF);
    } else {
        cleanedData.LifetimeBudgetperGSF = "";
    }
    var SpentPerMaxOccupancyFlag = isNumber(schoolData.SpentPerMaxOccupancy);
    if (SpentPerMaxOccupancyFlag == true) {
        var SpentPerMaxOccupancy = parseInt(schoolData.SpentPerMaxOccupancy);
        cleanedData.SpentPerMaxOccupancy = numberWithCommas(SpentPerMaxOccupancy);
    } else {
        cleanedData.SpentPerMaxOccupancy = "";
    }
    var SpentPerSqFtFlag = isNumber(schoolData.SpentPerSqFt);
    if (SpentPerSqFtFlag == true) {
        var SpentPerSqFt = parseInt(schoolData.SpentPerSqFt);
        cleanedData.SpentPerSqFt = numberWithCommas(SpentPerSqFt);
    } else {
        cleanedData.SpentPerSqFt = "";
    }
    var TotalAllotandPlan1621Flag = isNumber(schoolData.TotalAllotandPlan1621);
    if (TotalAllotandPlan1621Flag == true) {
        var TotalAllotandPlan1621 = parseInt(schoolData.TotalAllotandPlan1621);
        cleanedData.TotalAllotandPlan1621 = numberWithCommas(TotalAllotandPlan1621);
    } else {
        cleanedData.TotalAllotandPlan1621 = "";
    }
    // console.log("  cleanedData.LifetimeBudgetperGSF: " + cleanedData.LifetimeBudgetperGSF);

    return cleanedData;

    // == validation and formatting functions
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    }
}


// ======= ======= ======= cleanupSchoolName ======= ======= =======
function cleanupSchoolName(nextSchool) {
    // console.log("cleanupSchoolName");
    var currentName = nextSchool.School;
    // console.log("  currentName: ", currentName);
    var newName1 = currentName.replace(", ", "_");
    // console.log("  newName1: ", newName1);
    return newName1;
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
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp((
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        var strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            arrData.push([]);
        }
        if (arrMatches[2]) {
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            var strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
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
