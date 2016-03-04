

// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= TEXT PROCESSING & DISPLAY ======= ======= ======= ======= =======

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
        var tempSchoolProject = schoolData.schoolProject.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        cleanedData.schoolProject = tempSchoolProject;
    } else {
        cleanedData.schoolProject = schoolData.schoolProject;
    }
    var schoolSqftflag = isNumber(schoolData.schoolSqft);
    if (schoolSqftflag == true) {
        var schoolSqft = parseInt(schoolData.schoolSqft);
        cleanedData.schoolSqft = numberWithCommas(schoolSqft);
    } else {
        cleanedData.schoolSqft = "";
    }
    var schoolMaxOccupancyFlag = isNumber(schoolData.schoolMaxOccupancy);
    if (schoolMaxOccupancyFlag == true) {
        var schoolMaxOccupancy = parseInt(schoolData.schoolMaxOccupancy);
        cleanedData.schoolMaxOccupancy = numberWithCommas(schoolMaxOccupancy);
    } else {
        cleanedData.schoolMaxOccupancy = "";
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

    // spendPast, spendLifetime, spendPlanned, spendSqFt, spendEnroll, spendLTsqft, spendLTenroll
    var spendPastFlag = isNumber(schoolData.spendPast);
    if (spendPastFlag == true) {
        var spendPast = parseInt(schoolData.spendPast);
        cleanedData.spendPast = numberWithCommas(spendPast);
    } else {
        cleanedData.spendPast = "";
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

    return cleanedData;

    // == validation and formatting functions
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
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
