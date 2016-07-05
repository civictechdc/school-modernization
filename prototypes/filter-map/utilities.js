
// ======= ======= ======= getZoneUrls ======= ======= =======
function getZoneUrls(displayObj, zonesCollectionObj) {
    console.log("getZoneUrls");
    console.log("  displayObj.dataFilters.zones: ", displayObj.dataFilters.zones);
    console.log("  displayObj.dataFilters.levels: ", displayObj.dataFilters.levels);

    var feederFlag = false;
    var urlA, urlB;

    if (displayObj.dataFilters.zones) {
        if (displayObj.dataFilters.zones == "Ward") {
            zonesCollectionObj.zoneA = "Ward";
            urlA = "Data_Geo/Ward__2012.geojson";
            urlB = null;
        } else if (displayObj.dataFilters.zones == "FeederHS") {
            zonesCollectionObj.zoneA = "FeederHS";
            urlA = "Data_Geo/School_Attendance_Zones_Senior_High__New.geojson";
            if (displayObj.dataFilters.levels == "MS") {
                feederFlag = true;
                urlB = "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
            } else if (displayObj.dataFilters.levels == "ES") {
                feederFlag = true;
                urlB = "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
            } else if (displayObj.dataFilters.levels == null) {
                urlB = null;
            }
        } else if (displayObj.dataFilters.zones == "FeederMS") {
            feederFlag = true;
            zonesCollectionObj.zoneA = "FeederMS";
            urlA = "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
            urlB = "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        } else if (displayObj.dataFilters.zones == "Elementary") {
            urlA = "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        }
    } else {
        if (displayObj.dataFilters.levels == "HS") {
            zonesCollectionObj.zoneA = "FeederHS";
            urlA = "Data_Geo/School_Attendance_Zones_Senior_High__New.geojson";
        } else if (displayObj.dataFilters.levels == "MS") {
            zonesCollectionObj.zoneA = "FeederMS";
            urlA = "Data_Geo/School_Attendance_Zones_Middle_School__New.geojson";
        } else if (displayObj.dataFilters.levels == "ES") {
            zonesCollectionObj.zoneA = "Elementary";
            urlA = "Data_Geo/School_Attendance_Zones_Elementary__New.geojson";
        } else {
            zonesCollectionObj.zoneA = "Ward";
            urlA = "Data_Geo/Ward__2012.geojson";
        }
        urlB = null;
    }
    return [urlA, urlB, feederFlag];
}



// ======= ======= ======= ======= ======= MATH PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= MATH PROCESSING & DISPLAY ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= MATH PROCESSING & DISPLAY ======= ======= ======= ======= =======

// ======= ======= ======= polyfill for Safari ======= ======= =======
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
};

// ======= ======= ======= calcDataIncrement ======= ======= =======
function calcDataIncrement(zonesCollectionObj, displayObj) {
    console.log("calcDataIncrement");

    var nextZoneValue;
    var zoneValuesArray = [];

    // == gather selected expenditure (past/future/total) and sqft/enrollment values from aggregator array
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        nextZoneValue = filterExpendData(displayObj, zonesCollectionObj, i);
        zoneValuesArray.push(nextZoneValue);
    }

    // == get lowest/highest values, divide by number of data bins
    var fillOpacity = 1;
    var maxValue = Math.max.apply(Math, zoneValuesArray);
    var minValue = Math.min.apply(Math, zoneValuesArray);
    var dataIncrement = parseFloat(maxValue/zonesCollectionObj.dataBins);
    return dataIncrement;
}

// ======= ======= ======= calcMinMedMax ======= ======= =======
function calcMinMedMax(zonesCollectionObj, zoneDataObject, schoolsInZone) {
    console.log("calcMinMedMax");

    // == median
    if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
        if (zoneDataObject.schoolCount % 2 == 0) {
            var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
            var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
            var amountMed = (parseInt(schoolA[expendFilter]) + parseInt(schoolB[expendFilter]))/2;
        } else {
            var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
            var amountMed = parseInt(schoolA[expendFilter]);
        }
    }

    // == min/max
    if (filteredAmount > zoneDataObject.amountMax) {
        var amountMax = filteredAmount;
    }
    if (index == 0) {
        var amountMin = filteredAmount;
    } else {
        if (filteredAmount <= zoneDataObject.amountMin) {
            var amountMin = filteredAmount;
        }
    }
    return [amountMin, amountMed, amountMax];
}

// ======= ======= ======= getZoneFormat ======= ======= =======
function getZoneFormat(zonesCollectionObj, displayObj, featureIndex, zoneName, whichLayer) {
    // console.log("getZoneFormat");
    // console.log("  featureIndex: ", featureIndex);
    // console.log("  zoneName: ", zoneName);
    // console.log("  whichLayer: ", whichLayer);

    var itemColor = "white";
    var strokeColor = "purple";
    var strokeWeight = 2;
    var itemOpacity = 0.5;

    // ======= ======= ======= SELECTED ZONE (disabled) ======= ======= =======
    if (displayObj.dataFilters.selectedZone) {
        if (zoneName == displayObj.dataFilters.selectedZone) {
            itemColor = zonesCollectionObj.dataColorsArray[featureIndex];
        } else {
            itemColor = "white";
        }

    // ======= ======= ======= LOWER LAYER (ES, MS boundaries) ======= ======= =======
    } else {
        if (whichLayer == "lower") {
            itemColor = "white";
            strokeColor = "purple";
            strokeWeight = 1;
            itemOpacity = 0.6;

        // ======= ======= ======= UPPER LAYER (HS Feeder boundaries) ======= ======= =======
        } else if (whichLayer == "upper") {
            if (displayObj.dataFilters.expend) {
                var colorIndex = assignDataColors(zonesCollectionObj, displayObj, featureIndex);
                if (colorIndex >= 0) {
                    itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                } else {
                    itemColor = "#b2bdc7";
                }
                console.log(zoneName, " map: ", i, colorIndex, itemColor);
                strokeColor = "black";
                strokeWeight = 4;
            } else {
                itemColor = "white";
                strokeColor = "purple";
                strokeWeight = 2;
            }
            // itemOpacity = 1;
            itemOpacity = 0.7;

        // ======= ======= ======= SINGLE LAYER (Wards) ======= ======= =======
        } else if (whichLayer == "single") {
            if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
                if (displayObj.dataFilters.expend) {
                    var colorIndex = assignDataColors(zonesCollectionObj, displayObj, featureIndex);
                    itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                    if (colorIndex >= 0) {
                        itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                    } else {
                        itemColor = "#b2bdc7";
                    }
                    // console.log(zoneName, " map: ", i, colorIndex, itemColor);
                    strokeColor = "black";
                    strokeWeight = 2;
                    // itemOpacity = 1;
                    itemOpacity = 0.8;
                } else {
                    return [itemColor, strokeColor, strokeWeight, itemOpacity];
                }
            } else {
                return [itemColor, strokeColor, strokeWeight, itemOpacity];
            }
        }
        return [itemColor, strokeColor, strokeWeight, itemOpacity];
    }
    return [itemColor, strokeColor, strokeWeight, itemOpacity];
}

// ======= ======= ======= assignDataColors ======= ======= =======
function assignDataColors(zonesCollectionObj, displayObj, featureIndex) {
    // console.log("assignDataColors");

    var nextExpendValue = filterExpendData(displayObj, zonesCollectionObj, featureIndex);
    // console.log("  featureIndex: ", featureIndex, nextExpendValue);

    if (nextExpendValue < 0) {
        var colorIndex = -1;
    } else {
        var binMin, binMax;
        for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
            binMin = (zonesCollectionObj.dataIncrement * i);
            binMax = (zonesCollectionObj.dataIncrement * (i + 1));
            // console.log(i, "  bins: ", parseInt(binMin), "   ", nextExpendValue, "   ", parseInt(binMax));
            if (isNaN(nextExpendValue)) {
                nextExpendValue = 0;
            }
            if ((binMin <= nextExpendValue) && (nextExpendValue <= (binMax + 1))) {
                if (nextExpendValue < 0) {
                    var colorIndex = -1;
                } else {
                    var colorIndex = i;
                }
                break;
            }
        }
    }
    return colorIndex;
}

// ======= ======= ======= getScaleFactor ======= ======= =======
function getScaleFactor(dataMax) {
    console.log("getScaleFactor");
    if (dataMax > 1000000) {
        var scaleFactor = 1000000;
        var scaleLabel = "$M ";
    } else if ((dataMax < 1000000) && (dataMax > 1000)) {
        var scaleFactor = 1000;
        var scaleLabel = "$K ";
    } else {
        var scaleFactor = 1;
        var scaleLabel = "$";
    }
    return [scaleFactor, scaleLabel];
}

// ======= ======= ======= filterExpendData ======= ======= =======
function filterExpendData(displayObj, zonesCollectionObj, zoneIndex) {
    // console.log("filterExpendData");
    var nextZoneValue;
    if (displayObj.dataFilters.math == "spendAmount") {
        nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].zoneAmount;
    } else if (displayObj.dataFilters.math == "spendSqFt") {
        nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].expendPerSqft;
    } else if (displayObj.dataFilters.math == "spendEnroll") {
        nextZoneValue = zonesCollectionObj.aggregatorArray[zoneIndex].expendPerEnroll;
    }
    if (isNaN(nextZoneValue)) {
        nextZoneValue = 0;
    }
    return nextZoneValue;
}

// ======= ======= ======= sortByWard ======= ======= =======
function sortByWard(aggregatorArray, arrayType) {
    console.log("sortByWard");

    aggregatorArray.sort(function(a, b) {
        if (arrayType == "map") {
            var zoneNameA = a.getProperty('NAME');
            var zoneNameB = b.getProperty('NAME');
            var nextZoneValueA = zoneNameA.substring(zoneNameA.length-1, zoneNameA.length);
            var nextZoneValueB = zoneNameB.substring(zoneNameB.length-1, zoneNameB.length);
        } else if (arrayType == "chart") {
            var nextZoneValueA = a.zoneName.substring(a.zoneName.length-1, a.zoneName.length);
            var nextZoneValueB = b.zoneName.substring(b.zoneName.length-1, b.zoneName.length);
        }
        if (isNaN(nextZoneValueA)) {
            nextZoneValueA = 0;
        }
        if (isNaN(nextZoneValueB)) {
            nextZoneValueB = 0;
        }
        return nextZoneValueA - nextZoneValueB;
    });
}

// ======= ======= ======= setFeatureIndexes ======= ======= =======
function setFeatureIndexes(featureArray) {
    console.log("setFeatureIndexes");
    var featureIndex = -1;
    featureArray.forEach(function(feature) {
        featureIndex++;
        feature.setProperty('featureIndex', featureIndex);
    });
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

    var schoolMarkersArray = schoolsCollectionObj.schoolMarkersArray;
    if (schoolMarkersArray) {
        for(i = 0; i < schoolMarkersArray.length; i++){
            schoolMarkersArray[i].setMap(null);
            schoolMarkersArray[i] = null;
        }
    }
    schoolsCollectionObj.schoolMarkersArray = [];
    if (schoolsCollectionObj.selectedMarker) {
        schoolsCollectionObj.selectedMarker.setMap(null);
        schoolsCollectionObj.selectedMarker = null;
    }
}

// ======= ======= ======= de_activateZoneListeners ======= ======= =======
function de_activateZoneListeners(zonesCollectionObj) {
    console.log("de_activateZoneListeners");

    google.maps.event.clearListeners(map, 'mouseover');
    google.maps.event.clearListeners(map, 'mouseout');
    google.maps.event.clearListeners(map, 'click');

    // console.log("  listeners_before: ", zonesCollectionObj.mapListenersArray.length);
    var mapListenersArray = zonesCollectionObj.mapListenersArray;
    if (zonesCollectionObj.mapListenersArray.length > 0) {
        for (var i = 0; i < zonesCollectionObj.mapListenersArray.length; i++) {
            google.maps.event.removeListener(zonesCollectionObj.mapListenersArray[i]);
        }
    }
    zonesCollectionObj.mapListenersArray = [];
}

// ======= ======= ======= getDataDetails ======= ======= =======
function getDataDetails(nextSchool, nextIndex) {
    // console.log("getDataDetails");

    var cleanSchoolName = cleanupSchoolName(nextSchool);

    var tempSchoolData = {

        // ======= ok =======
        "schoolIndex": nextIndex,
        "schoolCode": nextSchool.School_ID,
        "schoolName": cleanSchoolName,
        // "schoolName": nextSchool.School,
        "Ward": nextSchool.Ward,
        "FeederMS": nextSchool.FeederMS,
        "FeederHS": nextSchool.FeederHS,
        "schoolAddress": nextSchool.Address,
        "schoolLAT": nextSchool.latitude,
        "schoolLON": nextSchool.longitude,
        "schoolLevel": nextSchool.Level,
        "schoolAgency": nextSchool.Agency,

        "totalSQFT": nextSchool.totalSQFT,
        "maxOccupancy": nextSchool.maxOccupancy,

        "ProjectType": nextSchool.ProjectType,
        "schoolSqFtPerEnroll": nextSchool.SqFtPerEnroll,
        "schoolEnroll": nextSchool.Total_Enrolled,
        "studentEng": nextSchool.Limited_English,
        "studentAtRisk": nextSchool.At_Risk,
        "studentSpecEd": nextSchool.SPED,
        "studentESLPer": nextSchool.ESLPer,
        "studentAtRiskPer": nextSchool.AtRiskPer,
        "studentSPEDPer": nextSchool.SPEDPer,

        "MajorExp9815": nextSchool.MajorExp9815,
        "spendPlanned": nextSchool.TotalAllotandPlan1621,
        "spendLifetime": nextSchool.LifetimeBudget,

        "YrComplete": nextSchool.YrComplete,
        "SqFtPerEnroll": nextSchool.SqFtPerEnroll,
        "Open_Now": nextSchool.Open_Now,
        "ProjectPhase": nextSchool.ProjectPhase,

        "TotalAllotandPlan1621perMaxOcc": nextSchool.TotalAllotandPlan1621perMaxOcc,
        "TotalAllotandPlan1621perGSF": nextSchool.TotalAllotandPlan1621perGSF,
        "LifetimeBudgetperMaxOcc": nextSchool.LifetimeBudgetperMaxOcc,
        "LifetimeBudgetperGSF": nextSchool.LifetimeBudgetperGSF,
        "SpentPerMaxOccupancy": nextSchool.SpentPerMaxOccupancy,
        "SpentPerSqFt": nextSchool.SpentPerSqFt,

        "FutureYrComplete": nextSchool.FutureYrComplete,
        "FUTUREProjectType16_21": nextSchool.FUTUREProjectType16_21

    }

    return tempSchoolData;
}

// ======= ======= ======= makeSchoolProfile ======= ======= =======
function makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, schoolMarker) {
    console.log("makeSchoolProfile");

    var nextValue;

    // == clear existing selected (hilite) marker
    if (schoolsCollectionObj.selectedMarker) {
        resetMarker(schoolsCollectionObj.selectedMarker);
    }

    // == get school data from clicked marker (via school index)
    if (schoolMarker) {
        var schoolIndex = schoolMarker.schoolIndex;
        var cleanedSchoolData = cleanupSchoolData(schoolsCollectionObj, schoolsCollectionObj.selectedSchoolsArray[schoolIndex]);
        schoolsCollectionObj.selectedMarker = schoolMarker;
        hiliteSchoolMarker(schoolsCollectionObj, schoolMarker);
    }

    // == hilite marker and display profile from select or search function
    if (schoolData) {
        var tempSchoolData = getDataDetails(schoolData, null);
        var cleanedSchoolData = cleanupSchoolData(schoolsCollectionObj, tempSchoolData);
        if (!schoolMarker) {
            var schoolMarker = schoolsCollectionObj.setSchoolMarker(tempSchoolData, null);
            schoolsCollectionObj.selectedMarker = schoolMarker;
            hiliteSchoolMarker(schoolsCollectionObj, schoolMarker);
        }
    }
    schoolsCollectionObj.selectedSchool = cleanedSchoolData;

    // == school sqft
    var totalSQFT = cleanedSchoolData.totalSQFT;
    if (totalSQFT == "") {
        totalSQFT = "No data";
        var schoolSqftSpan = "";
    } else {
        var schoolSqftSpan = "<span class='value-label'>sqft</span>";
    }

    // == capacity
    var maxOccupancy = cleanedSchoolData.maxOccupancy;
    if (maxOccupancy == "") {
        maxOccupancy = "No data";
        var schoolMaxOccupancySpan = "";
    } else {
        var schoolMaxOccupancySpan = "<span class='value-label'>students</span>";
    }

    // == enrollment
    var schoolEnroll = cleanedSchoolData.schoolEnroll;
    if (schoolEnroll == "") {
        schoolEnroll = "No data";
        var schoolEnrollSpan = "";
    } else {
        var schoolEnrollSpan = "<span class='value-label'>students</span>";
    }

    // == sqft per enrolled student
    var schoolSqFtPerEnroll = cleanedSchoolData.schoolSqFtPerEnroll;
    if (schoolSqFtPerEnroll == "") {
        schoolSqFtPerEnroll = "No data";
        var schoolSqFtPerEnrollSpan = "";
    } else {
        schoolSqFtPerEnroll = parseInt(cleanedSchoolData.schoolSqFtPerEnroll);
        var schoolSqFtPerEnrollSpan = "<span class='value-label'>sqft per student</span>";
    }

    // == lifetime spending
    var spendLifetime = cleanedSchoolData.spendLifetime;
    if (spendLifetime == "") {
        var spendLifetime = "<span class='value-label'>No data</span>";
    } else {
        var spendLifetime = "$" + spendLifetime;
    }

    // == future spending
    var spendPlanned = cleanedSchoolData.spendPlanned;
    if (spendPlanned == "") {
        spendPlanned = "<span class='value-label'>No data</span>";
    } else {
        spendPlanned = "$" + spendPlanned;
    }

    // == past spending
    var MajorExp9815 = cleanedSchoolData.MajorExp9815;
    if (MajorExp9815 == "") {
        MajorExp9815 = "<span class='value-label'>No data</span>";
    } else {
        MajorExp9815 = "$" + MajorExp9815;
    }

    // == spending per student
    var spendEnroll = cleanedSchoolData.spendEnroll;
    if (spendEnroll == "") {
        spendEnroll = "<span class='value-label'>No data</span>";
        var spendEnrollSpan = "";
    } else {
        spendEnroll = "$" + parseInt(spendEnroll);
        var spendEnrollSpan = " <span class='value-label'>per student</span>";
    }

    // == spending per sqft
    var spendSqFt = parseInt(cleanedSchoolData.spendSqFt);
    if (spendSqFt == "") {
        spendSqFt = "<span class='value-label'>No data</span>";
        var spendSqFtSpan = "";
    } else {
        spendSqFt = "$" + parseInt(spendSqFt);
        var spendSqFtSpan = " <span class='value-label'>per sqft</span>";
    }

    // == spending LifetimeBudgetperMaxOcc
    var LifetimeBudgetperMaxOcc = cleanedSchoolData.LifetimeBudgetperMaxOcc;
    if (LifetimeBudgetperMaxOcc == "") {
        LifetimeBudgetperMaxOcc = "<span class='value-label'>No data</span>";
        var LifetimeBudgetperMaxOccSpan = "";
    } else {
        LifetimeBudgetperMaxOcc = "$" + LifetimeBudgetperMaxOcc;
        var LifetimeBudgetperMaxOccSpan = " <span class='value-label'>per student</span>";
    }

    // == spending LifetimeBudgetperGSF
    var LifetimeBudgetperGSF = cleanedSchoolData.LifetimeBudgetperGSF;
    if (LifetimeBudgetperGSF == "") {
        LifetimeBudgetperGSF = "<span class='value-label'>No data</span>";
        var LifetimeBudgetperGSFSpan = "";
    } else {
        LifetimeBudgetperGSF = "$" + LifetimeBudgetperGSF;
        var LifetimeBudgetperGSFSpan = " <span class='value-label'> per sqft</span>";
    }

    // == spending TotalAllotandPlan1621perMaxOcc
    var TotalAllotandPlan1621perMaxOcc = cleanedSchoolData.TotalAllotandPlan1621perMaxOcc;
    if (TotalAllotandPlan1621perMaxOcc == "") {
        TotalAllotandPlan1621perMaxOcc = "<span class='value-label'>No data</span>";
        var TotalAllotandPlan1621perMaxOccSpan = "";
    } else {
        TotalAllotandPlan1621perMaxOcc = "$" + TotalAllotandPlan1621perMaxOcc;
        var TotalAllotandPlan1621perMaxOccSpan = " <span class='value-label'> per student</span>";
    }

    // == spending TotalAllotandPlan1621perMaxOcc
    var TotalAllotandPlan1621perGSF = cleanedSchoolData.TotalAllotandPlan1621perGSF;
    if (TotalAllotandPlan1621perGSF == "") {
        TotalAllotandPlan1621perGSF = "<span class='value-label'>No data</span>";
        var TotalAllotandPlan1621perGSFSpan = "";
    } else {
        TotalAllotandPlan1621perGSF = "$" + TotalAllotandPlan1621perGSF;
        var TotalAllotandPlan1621perGSFSpan = " <span class='value-label'> per sqft</span>";
    }

    // == spending SpentPerSqFt
    var SpentPerSqFt = cleanedSchoolData.SpentPerSqFt;
    if (SpentPerSqFt == "") {
        SpentPerSqFt = "<span class='value-label'>No data</span>";
        var SpentPerSqFtSpan = "";
    } else {
        SpentPerSqFt = "$" + SpentPerSqFt;
        var SpentPerSqFtSpan = " <span class='value-label'> per sqft</span>";
    }

    // == spending SpentPerMaxOccupancy
    var SpentPerMaxOccupancy = cleanedSchoolData.SpentPerMaxOccupancy;
    if (SpentPerMaxOccupancy == "") {
        SpentPerMaxOccupancy = "<span class='value-label'>No data</span>";
        var SpentPerMaxOccupancySpan = "";
    } else {
        SpentPerMaxOccupancy = "$" + SpentPerMaxOccupancy;
        var SpentPerMaxOccupancySpan = " <span class='value-label'> per student</span>";
    }

    // == spending TotalAllotandPlan1621
    var TotalAllotandPlan1621 = cleanedSchoolData.TotalAllotandPlan1621;
    if (TotalAllotandPlan1621 == "") {
        TotalAllotandPlan1621 = "<span class='value-label'>No data</span>";
    } else {
        TotalAllotandPlan1621 = "$" + TotalAllotandPlan1621;
    }

    // == spending MajorExp9815
    var MajorExp9815 = cleanedSchoolData.MajorExp9815;
    if (MajorExp9815 == "") {
        MajorExp9815 = "<span class='value-label'>No data</span>";
    } else {
        MajorExp9815 = "$" + MajorExp9815;
    }

    var itemName = cleanedSchoolData.schoolName;
    if (itemName.length > 35) {
        var checkName = itemName.indexOf(", ");
        if (checkName > -1) {
            var splitZoneName = itemName.split(", ");
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

    // Enrollment (2014-15)                == Total_Enrolled
    // Bldg sq ft 2016                     == totalSQFT
    // Bldg capacity 2016                  == maxOccupancy
    // Past spending (FY1998-2015)         == MajorExp9815
    // Past facilities improvements        == ProjectType
    // Year completed                      == YrComplete
    // Future spending (FY2016-2021)       ==
    // Future facilities improvements      == FUTUREProjectType16_21
    // Projected completion                == FutureYrComplete
    // Lifetime budget authority 1998-2021 == LifetimeBudget
    // Lifetime budget per student         == LifetimeBudgetperMaxOcc
    // Lifetime budget per GSF             == LifetimeBudgetperGSF
    // Past spending per student           == SpentPerMaxOccupancy
    // Past spending per GSF               == SpentPerSqFt
    // Future spending per student         == TotalAllotandPlan1621perMaxOcc
    // Future spending per GSF             == TotalAllotandPlan1621perGSF

    var htmlString = "<table id='profile'>";
    htmlString += "<tr><td class='profile-banner' colspan=2>";
    htmlString += "<div id='close-X'><p>X</p></div>";
    htmlString += "<p class='profile-title'>" + itemName + "</p>";
    htmlString += "<p class='profile-subtitle'>" + cleanedSchoolData.schoolAddress + "</p>";
    htmlString += "<p class='profile-subtitle2'>Ward " + cleanedSchoolData.Ward + " / " + cleanedSchoolData.schoolLevel + " / ";
    htmlString += "HS Feeder: " + cleanedSchoolData.FeederHS +  "</p>";
    // htmlString += displayObj.makeMathSelect(displayObj.expendMathMenu, "profile");
    htmlString += "</td></tr>";

    // Enrollment (2014-15)                == Total_Enrolled
    htmlString += "<tr><td class='data-key'><p class='key-text'>Enrollment (2014-15)</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolEnroll + " " + schoolEnrollSpan + "</p></td></tr>";

    // Bldg sq ft 2016                     == totalSQFT
    htmlString += "<tr><td class='data-key'><p class='key-text'>Bldg sq ft 2016</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + totalSQFT + " " + schoolSqftSpan + "</p></td></tr>";

    // Bldg capacity 2016                  == maxOccupancy
    htmlString += "<tr><td class='data-key'><p class='key-text'>Bldg capacity 2016</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + maxOccupancy + " " + schoolMaxOccupancySpan + "</p></td></tr>";

    // Past spending (FY1998-2015)         == MajorExp9815
    htmlString += "<tr><td class='data-key'><p class='key-text'>Past spending (FY1998-2015)</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPast' class='value-text'>" + MajorExp9815 + "</p></td></tr>";

    // Past facilities improvements        == ProjectType
    htmlString += "<tr><td class='data-key'><p class='key-text'>Past facilities improvements</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.ProjectType + "</p></td></tr>";

    // Year completed                      == YrComplete
    htmlString += "<tr><td class='data-key'><p class='key-text'>Year completed</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + cleanedSchoolData.YrComplete + "</p></td></tr>";

    // Future spending (FY2016-2021)       ==
    htmlString += "<tr><td class='data-key'><p class='key-text'>Future spending (FY2016-2021)</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + spendPlanned + "</p></td></tr>";

    // Future facilities improvements      == FUTUREProjectType16_21
    htmlString += "<tr><td class='data-key'><p class='key-text'>Future facilities improvements</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + cleanedSchoolData.FUTUREProjectType16_21 + "</p></td></tr>";

    // Projected completion                == FutureYrComplete
    htmlString += "<tr><td class='data-key'><p class='key-text'>Projected completion</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + cleanedSchoolData.FutureYrComplete + "</p></td></tr>";

    // Lifetime budget authority 1998-2021 == LifetimeBudget
    htmlString += "<tr><td class='data-key'><p class='key-text'>Lifetime budget authority 1998-2021</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + spendLifetime + "</p></td></tr>";

    // Lifetime budget per student         == LifetimeBudgetperMaxOcc
    htmlString += "<tr><td class='data-key'><p class='key-text'>Lifetime budget per student</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + LifetimeBudgetperMaxOcc + " " + LifetimeBudgetperMaxOccSpan + "</p></td></tr>";

    // Lifetime budget per GSF             == LifetimeBudgetperGSF
    htmlString += "<tr><td class='data-key'><p class='key-text'>Lifetime budget per GSF</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + LifetimeBudgetperGSF + " " + LifetimeBudgetperGSFSpan + "</p></td></tr>";

    // Past spending per student           == SpentPerMaxOccupancy
    htmlString += "<tr><td class='data-key'><p class='key-text'>Past spending per student</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + SpentPerMaxOccupancy + " " + SpentPerMaxOccupancySpan + "</p></td></tr>";

    // Past spending per GSF               == SpentPerSqFt
    htmlString += "<tr><td class='data-key'><p class='key-text'>Past spending per GSF</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + SpentPerSqFt + SpentPerSqFtSpan + "</p></td></tr>";

    // Future spending per student         == TotalAllotandPlan1621perMaxOcc
    htmlString += "<tr><td class='data-key'><p class='key-text'>Future spending per student</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + TotalAllotandPlan1621perMaxOcc + TotalAllotandPlan1621perMaxOccSpan + "</p></td></tr>";

    // Future spending per GSF             == TotalAllotandPlan1621perGSF
    htmlString += "<tr><td class='data-key'><p class='key-text'>Future spending per GSF</p></td>";
    htmlString += "<td class='data-value'><p id='profileSpendPlanned' class='value-text'>" + TotalAllotandPlan1621perGSF + TotalAllotandPlan1621perGSFSpan + "</p></td></tr>";

    htmlString += "</table>";

    // == remove previous chart or profile html if any
    if ($('#chart-container').find('#chart').length) {
        $("#chart-container").fadeOut( "fast", function() {
            // console.log("*** FADEOUT chart-container ***");
        });
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
            // console.log("*** FADEIN profile-container ***");
        });
    }

    displayObj.activateCloseButton();
    activateProfileSubmenu(displayObj, zonesCollectionObj, schoolsCollectionObj);
}

// ======= ======= ======= multiSchoolProfile ======= ======= =======
function multiSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, schoolIndex) {
    console.log("multiSchoolProfile");

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
        var schoolData = schoolsCollectionObj.selectedSchoolsArray[this.id];
        makeSchoolProfile(schoolsCollectionObj, zonesCollectionObj, displayObj, schoolData, this.id);
    });
}

// ======= ======= ======= activateProfileSubmenu ======= ======= =======
function activateProfileSubmenu(displayObj, zonesCollectionObj, schoolsCollectionObj) {
    console.log("activateProfileSubmenu");

    $('#expendMathP').on({
        change: function() {
            console.log("\n------- setSubMenu -------");
            var nextMath = $("select[name='expendMath'] option:selected").val()
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
    var spendLifetime = cleanedSchoolData.spendLifetime;
    if (spendLifetime == "") {
        spendLifetime = "<span class='value-label'>No data for lifetime spending</span>";
    } else {
        spendLifetime = "$" + spendLifetime;
    }

    // == lifetime spending
    var SpentPerMaxOccupancy = cleanedSchoolData.SpentPerMaxOccupancy;
    if (SpentPerMaxOccupancy == "") {
        SpentPerMaxOccupancy = "<span class='value-label'>No data for lifetime spending</span>";
    } else {
        SpentPerMaxOccupancy = "$" + SpentPerMaxOccupancy;
    }

    // == future spending
    var spendPlanned = cleanedSchoolData.spendPlanned;
    if (spendPlanned == "") {
        spendPlanned = "<span class='value-label'>No data for future spending</span>";
    } else {
        spendPlanned = "$" + spendPlanned;
    }

    // == past spending
    var MajorExp9815 = cleanedSchoolData.MajorExp9815;
    if (MajorExp9815 == "") {
        MajorExp9815 = "<span class='value-label'>No data for past spending</span>";
    } else {
        MajorExp9815 = "$" + MajorExp9815;
    }

    // == spending per student
    var spendEnrollSpan;
    var spendEnroll = cleanedSchoolData.spendEnroll;
    if ((spendEnroll == "") || (spendEnroll == 0)) {
        spendEnroll = "<span class='value-label'>No spending per student data</span>";
        spendEnrollSpan = "";
    } else {
        spendEnroll = "$" + parseInt(spendEnroll);
        spendEnrollSpan = " <span class='value-label'>per student</span>";
    }

    // == spending per sqft
    var spendSqFtSpan;
    var spendSqFt = parseInt(cleanedSchoolData.spendSqFt);
    if ((spendSqFt == "") || (spendSqFt == 0)) {
        spendSqFt = "<span class='value-label'>No spending per sqft data</span>";
        spendSqFtSpan = "";
    } else {
        spendSqFt = "$" + parseInt(spendSqFt);
        spendSqFtSpan = " <span class='value-label'>per sqft</span>";
    }

    if (nextMath == "spendEnroll") {
        $("#profileSpendLifetime").html(spendEnroll + spendEnrollSpan);
        $("#profileSpendPlanned").html(cleanedSchoolData.spendSqFt);
        $("#profileSpendPast").html("<span class='value-label'>no past per student data</span>");
    } else if (nextMath == "spendSqFt") {
        $("#profileSpendLifetime").html(spendSqFt + spendSqFtSpan);
        $("#profileSpendPlanned").html("<span class='value-label'>no future per sqft data</span>");
        $("#profileSpendPast").html("<span class='value-label'>no past per sqft data</span>");
    } else if (nextMath == "spendAmount") {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(MajorExp9815);
    } else {
        $("#profileSpendLifetime").html(spendLifetime);
        $("#profileSpendPlanned").html(spendPlanned);
        $("#profileSpendPast").html(MajorExp9815);
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
    var nextZoneObject;
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

    var popup = document.getElementById("filter-container");
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
