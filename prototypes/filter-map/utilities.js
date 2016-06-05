
// ======= ======= ======= getZoneUrls ======= ======= =======
function getZoneUrls(displayObj, zonesCollectionObj) {
    console.log("getZoneUrls");
    console.log("  displayObj.dataFilters.zones: ", displayObj.dataFilters.zones);

    var feederFlag = false;

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
    // console.log("  [urlA, urlB, feederFlag]: ", [urlA, urlB, feederFlag]);
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

    var nextSpendAmount, nextZoneValue, nextZoneSqft, nextZoneEnroll;
    var zoneValuesArray = [];

    // == gather selected expenditure (past/future/total) and sqft/enrollment values from aggregator array
    for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
        var nextZoneValue = filterExpendData(displayObj, zonesCollectionObj, i);
        zoneValuesArray.push(nextZoneValue);
    }

    // == get lowest/highest values, divide by number of data bins
    var fillOpacity = 1;
    var maxValue = Math.max.apply(Math, zoneValuesArray);
    var minValue = Math.min.apply(Math, zoneValuesArray);
    var dataIncrement = parseFloat(maxValue/zonesCollectionObj.dataBins);
    return dataIncrement;
}

// ======= ======= ======= aggregateZoneData ======= ======= =======
function aggregateZoneData(displayObj, zonesCollectionObj, selectedSchoolsArray, partitionKey, expendFilter) {
    console.log("\n----- aggregateZoneData -----");
    // console.log("  partitionKey: ", partitionKey);
    // console.log("  expendFilter: ", expendFilter);
    console.log("  selectedSchoolsArray.length: ", selectedSchoolsArray.length);

    var zones = {};

    if (displayObj.dataFilters.zones == "Ward") {
        var zonesArray = [1, 2, 3, 4, 5, 6, 7, 8];
    } else if (displayObj.dataFilters.zones == "FeederHS") {
        var zonesArray = ["Woodson HS", "Eastern HS", "Anacostia HS", "Ballou HS", "Wilson HS", "Roosevelt HS", "Coolidge HS", "Dunbar HS", "Cardozo HS (9-12)", "City-Wide"];
    }

    zonesArray.forEach(function(zone) {
        console.log("  zone: ", zone);
        if (!zones[zone]) {
            zones[zone] = [];
        }
    });
    console.log("  zones: ", zones);

    selectedSchoolsArray.forEach(function(school) {
        var zone = school[partitionKey];
        console.log("  zone: ", zone);
        if ((zone) && (zone != "NA")) {
            // if (!zones[zone]) {
            //     zones[zone] = [];
            // }
            zones[zone].push(school);
        }
    });

    var zoneNamesArray = [];
    var amountNAarray = [];
    var zeroAmountArray = [];
    var aggregatedValues = {};
    var zoneIndex = -1;
    var featureIndex;

    // == aggregate total values for each zone
    for (zone in zones) {

        // == if "City-Wide" use null zoneIndex to flag missing map geojson
        if (zone != "City-Wide") {
            zoneIndex++;
        } else {
            // zoneIndex--;
            continue;
        }
        if (partitionKey == "Ward") {
            zoneName = "Ward " + zone;
        } else {
            var feederFlag = zone.indexOf(" HS");
            if (feederFlag > -1) {
                zoneName = zone.slice(0,feederFlag);
            }
        }
        // console.log("  agg zoneName: ", zoneName);
        // console.log("  zone: ", zone);
        zoneNamesArray.push(zoneName);

        // featureIndex, zoneIndex, zoneName, schoolCount, SqFtPerEnroll
        // zoneAmount, amountMin, amountMax, amountAvg, amountMed
        // zonePastPerEnroll, zoneFuturePerEnroll, zoneTotalPerEnroll, zoneEnroll, enrollMin, enrollMax, enrollAvg, enrollMed
        // zonePastPerSqft, zoneFuturePerSqft, zoneTotalPerSqft, zoneSqft, sqftMin, sqftMax, sqftAvg, sqftMed

        var zoneDataObject = {
            featureIndex: null,
            zoneIndex: zoneIndex,
            zoneName: zoneName,
            schoolCount: zones[zone].length,
            SqFtPerEnroll: 0,

            zoneAmount: 0,
            amountMin: 0,
            amountMax: 0,
            amountAvg: 0,
            amountMed: 0,

            zonePastPerEnroll: 0,
            zoneFuturePerEnroll: 0,
            zoneTotalPerEnroll: 0,
            zoneEnroll: 0,
            enrollMin: 0,
            enrollMax: 0,
            enrollAvg: 0,
            enrollMed: 0,

            zonePastPerSqft: 0,
            zoneFuturePerSqft: 0,
            zoneTotalPerSqft: 0,
            zoneSqft: 0,
            sqftMin: 0,
            sqftMax: 0,
            sqftAvg: 0,
            sqftMed: 0
        };
        if (zone == "City-Wide") {
            zoneDataObject.zoneIndex = null;
        }

        // console.log("  * math: ", displayObj.dataFilters.math);
        var schoolsInZone = zones[zone];
        schoolsInZone.forEach(function(school, index) {
            // console.log("  school[expendFilter]: ", school[expendFilter]);
            // console.log("  school.schoolEnroll: ", school.schoolEnroll);
            // console.log("  school.schoolSqft: ", school.schoolSqft);

            // ======= ======= ======= EXPENDITURE (past/future/total) ======= ======= =======
            if (school[expendFilter] != "NA") {
                zoneDataObject.zoneAmount += parseInt(school[expendFilter]);
                // zoneDataObject.zonePast += parseInt(school.MajorExp9815);
                // zoneDataObject.zoneFuture += parseInt(school.TotalAllotandPlan1621);
                // zoneDataObject.zoneTotal += parseInt(school.LifetimeBudget);
                // console.log("  expendFilter: ", zoneDataObject.zoneAmount);

                // == calculate past/future/total median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var amountMed = (parseInt(schoolA[expendFilter]) + parseInt(schoolB[expendFilter]))/2;
                        // console.log("  schoolA[expendFilter]:", schoolA[expendFilter]);
                        // console.log("  schoolB[expendFilter]:", schoolB[expendFilter]);
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var amountMed = parseInt(schoolA[expendFilter]);
                    }
                    zoneDataObject.amountMed = parseInt(amountMed);
                    // console.log("  zoneDataObject.amountMed: ", zoneDataObject.amountMed);
                }

                // == calculate past/future/total min/max
                if (parseInt(school[expendFilter]) > zoneDataObject.amountMax) {
                    zoneDataObject.amountMax = parseInt(school[expendFilter]);
                }
                if (index == 0) {
                    zoneDataObject.amountMin = parseInt(school[expendFilter]);
                } else {
                    if (parseInt(school[expendFilter]) <= zoneDataObject.amountMin) {
                        zoneDataObject.amountMin = parseInt(school[expendFilter]);
                    }
                }
            } else if (school[expendFilter] == "NA"){
                console.log("  NA index: ", school.schoolIndex);
                amountNAarray.push(school);
            } else {
                console.log("  0 VALUE index: ", school.schoolIndex);
                zeroAmountArray.push(school);
            }

            // ======= ======= ======= ENROLLMENT ======= ======= =======
            if (school.schoolEnroll != "NA") {
                zoneDataObject.zoneEnroll += parseInt(school.schoolEnroll);

                // == calculate enrollment median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var enrollMed = (parseInt(schoolA.schoolEnroll) + parseInt(schoolB.schoolEnroll))/2;
                        // console.log("  schoolA.schoolEnroll:", schoolA.schoolEnroll);
                        // console.log("  schoolB.schoolEnroll:", schoolB.schoolEnroll);
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var enrollMed = parseInt(schoolA.schoolEnroll);
                        // console.log("  schoolA.schoolEnroll:", schoolA.schoolEnroll);
                    }
                    zoneDataObject.enrollMed = enrollMed;
                    // console.log("  zoneDataObject.enrollMed: ", zoneDataObject.enrollMed);
                }

                // == calculate enrollment min/max
                if (parseInt(school.schoolEnroll) > zoneDataObject.enrollMax) {
                    zoneDataObject.enrollMax = parseInt(school.schoolEnroll);
                }
                if (index == 0) {
                    zoneDataObject.enrollMin = parseInt(school.schoolEnroll);
                } else {
                    if (parseInt(school.schoolEnroll) <= zoneDataObject.enrollMin) {
                        zoneDataObject.enrollMin = parseInt(school.schoolEnroll);
                    }
                }
            } else if (school.schoolEnroll == "NA"){
                // console.log("  NA index: ", index);
            } else {
                // console.log("  0 VALUE index: ", index);
            }
            if (school.SpentPerMaxOccupancy != "NA") {
                zoneDataObject.zonePastPerEnroll += parseInt(school.SpentPerMaxOccupancy);
            }
            if (school.TotalAllotandPlan1621perMaxOcc != "NA") {
                zoneDataObject.zoneFuturePerEnroll += parseInt(school.TotalAllotandPlan1621perMaxOcc);
            }
            if (school.LifetimeBudgetperMaxOcc != "NA") {
                zoneDataObject.zoneTotalPerEnroll += parseInt(school.LifetimeBudgetperMaxOcc);
            }
            // console.log("  past/enroll: ", zoneDataObject.zonePastPerEnroll);
            // console.log("  future/enroll: ", zoneDataObject.zoneFuturePerEnroll);
            // console.log("  total/enroll: ", zoneDataObject.zoneTotalPerEnroll);

            // ======= ======= ======= SQFT ======= ======= =======
            if (school.schoolSqft != "NA") {
                zoneDataObject.zoneSqft += parseInt(school.schoolSqft);

                // == calculate sqft median
                if (index == Math.ceil(zoneDataObject.schoolCount/2)) {
                    if (zoneDataObject.schoolCount % 2 == 0) {
                        var schoolA = schoolsInZone[zoneDataObject.schoolCount/2 - 1];
                        var schoolB = schoolsInZone[zoneDataObject.schoolCount/2];
                        var sqftMed = (parseInt(schoolA.schoolSqft) + parseInt(schoolB.schoolSqft))/2;
                        // console.log("  schoolA.schoolSqft:", schoolA.schoolSqft);
                        // console.log("  schoolB.schoolSqft:", schoolB.schoolSqft);
                    } else {
                        var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
                        var sqftMed = parseInt(schoolA.schoolSqft);
                        // console.log("  schoolA.schoolSqft:", schoolA.schoolSqft);
                    }
                    zoneDataObject.sqftMed = sqftMed;
                    // console.log("  zoneDataObject.sqftMed: ", zoneDataObject.sqftMed);
                }

                // == calculate sqft min/max
                if (parseInt(school.schoolSqft) > zoneDataObject.sqftMax) {
                    zoneDataObject.sqftMax = parseInt(school.schoolSqft);
                }
                if (index == 0) {
                    zoneDataObject.sqftMin = parseInt(school.schoolSqft);
                } else {
                    if (parseInt(school.schoolSqft) <= zoneDataObject.sqftMin) {
                        zoneDataObject.sqftMin = parseInt(school.schoolSqft);
                    }
                }
            } else if (school.schoolSqft == "NA"){
                // console.log("  NA index: ", index);
            } else {
                // console.log("  0 VALUE index: ", index);
            }
            if (school.SpentPerSqFt != "NA") {
                zoneDataObject.zonePastPerSqft += parseInt(school.SpentPerSqFt);
            }
            if (school.TotalAllotandPlan1621perGSF != "NA") {
                zoneDataObject.zoneFuturePerSqft += parseInt(school.TotalAllotandPlan1621perGSF);
            }
            if (school.LifetimeBudgetperGSF != "NA") {
                zoneDataObject.zoneTotalPerSqft += parseInt(school.LifetimeBudgetperGSF);
            }
            // console.log("  past/sqft: ", zoneDataObject.zonePastPerSqft);
            // console.log("  future/sqft: ", zoneDataObject.zoneFuturePerSqft);
            // console.log("  total/sqft: ", zoneDataObject.zoneTotalPerSqft);

        });
        // console.dir(zoneDataObject);
        aggregatedValues[zone] = zoneDataObject;
    }
    console.log("  zoneNamesArray: ", zoneNamesArray);
    return aggregatedValues;
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
            console.log("  schoolA[expendFilter]:", schoolA[expendFilter]);
            console.log("  schoolB[expendFilter]:", schoolB[expendFilter]);
        } else {
            var schoolA = schoolsInZone[Math.ceil(zoneDataObject.schoolCount/2)];
            var amountMed = parseInt(schoolA[expendFilter]);
        }
    }

    // == min/max
    if (filteredAmount > zoneDataObject.amountMax) {
        amountMax = filteredAmount;
    }
    if (index == 0) {
        amountMin = filteredAmount;
    } else {
        if (filteredAmount <= zoneDataObject.amountMin) {
            amountMin = filteredAmount;
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
                colorIndex = assignDataColors(zonesCollectionObj, displayObj, featureIndex);
                itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                strokeColor = "black";
                strokeWeight = 4;
                console.log("  colorIndex: ", colorIndex);
                // console.log("  itemColor: ", itemColor);
            } else {
                itemColor = "white";
                strokeColor = "purple";
                strokeWeight = 2;
            }
            itemOpacity = 0.7;

        // ======= ======= ======= SINGLE LAYER (Wards) ======= ======= =======
        } else if (whichLayer == "single") {
            if ((displayObj.dataFilters.levels) || (displayObj.dataFilters.zones)) {
                if (displayObj.dataFilters.expend) {
                    colorIndex = assignDataColors(zonesCollectionObj, displayObj, featureIndex);
                    itemColor = zonesCollectionObj.dataColorsArray[colorIndex];
                    strokeColor = "black";
                    strokeWeight = 2;
                    itemOpacity = 0.8;
                    // console.log("  colorIndex: ", colorIndex);
                    // console.log("  itemColor: ", itemColor);
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

    for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
        binMin = (zonesCollectionObj.dataIncrement * i);
        binMax = (zonesCollectionObj.dataIncrement * (i + 1));
        if ((binMin <= nextExpendValue) && (nextExpendValue <= (binMax + 1))) {
            // console.log("  i: ", i);
            // console.log("  nextExpendValue: ", nextExpendValue);
            var colorIndex = i;
            break;
        }
    }
    return colorIndex;
}

// ======= ======= ======= getZoneIndex ======= ======= =======
function getZoneIndex(zoneName, aggregatorArray) {
    // console.log("getZoneIndex");
    // console.log("  zoneName: ", zoneName);

    var checkName;
    for (var i = 0; i < aggregatorArray.length; i++) {
        checkName = aggregatorArray[i].zoneName;
        // console.log("  zoneIndex1: ", i);
        // console.log("  zoneIndex2: ", zone.zoneIndex);
        // console.log("  checkName: ", checkName);
        if (zoneName == checkName) {
            // console.log("  MATCH: ", i);
            return i;
            // break;
        }
    }
    return null;
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

    var tempSchoolData = {

        // ======= ok =======
        "schoolIndex": nextIndex,
        "schoolCode": nextSchool.School_ID,
        "schoolName": nextSchool.School,
        "Ward": nextSchool.Ward,
        "FeederMS": nextSchool.FeederMS,
        "FeederHS": nextSchool.FeederHS,
        "schoolAddress": nextSchool.Address,
        "schoolLAT": nextSchool.latitude,
        "schoolLON": nextSchool.longitude,
        "schoolLevel": nextSchool.Level,
        "schoolAgency": nextSchool.Agency,

        "ProjectType": nextSchool.ProjectType,
        "schoolSqft": nextSchool.totalSQFT,
        "schoolMaxOccupancy": nextSchool.maxOccupancy,
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
    console.log("  schoolData: ", schoolData);
    console.log("  schoolMarker: ", schoolMarker);

    var nextValue;
    if (schoolsCollectionObj.selectedMarker) {
        resetMarker(schoolsCollectionObj.selectedMarker);
    }
    if (schoolMarker) {
        var schoolIndex = schoolMarker.schoolIndex;
        schoolsCollectionObj.selectedMarker = schoolMarker;
        hiliteSchoolMarker(schoolsCollectionObj, null, schoolMarker.schoolIndex);
    }

    if ((typeof schoolIndex === 'undefined') || (typeof schoolIndex === 'null')) {
        console.log("*** SCHOOL SEARCH ***");
        var tempSchoolData = getDataDetails(schoolData, null);
        var cleanedSchoolData = cleanupSchoolData(schoolsCollectionObj, tempSchoolData);
    } else {
        var cleanedSchoolData = cleanupSchoolData(schoolsCollectionObj, schoolsCollectionObj.selectedSchoolsArray[schoolIndex]);
    }
    schoolsCollectionObj.selectedSchool = cleanedSchoolData;

    // == school sqft
    var schoolSqft = cleanedSchoolData.schoolSqft;
    if (schoolSqft == "") {
        schoolSqft = "No data";
        var schoolSqftSpan = "";
    } else {
        var schoolSqftSpan = "<span class='value-label'>sqft</span>";
    }

    // == capacity
    var schoolMaxOccupancy = cleanedSchoolData.schoolMaxOccupancy;
    if (schoolMaxOccupancy == "") {
        schoolMaxOccupancy = "No data";
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
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolSqft + " " + schoolSqftSpan + "</p></td></tr>";

    // Bldg capacity 2016                  == maxOccupancy
    htmlString += "<tr><td class='data-key'><p class='key-text'>Bldg capacity 2016</p></td>";
    htmlString += "<td class='data-value'><p class='value-text'>" + schoolMaxOccupancy + " " + schoolMaxOccupancySpan + "</p></td></tr>";

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

    // == lifetime spending
    SpentPerMaxOccupancy = cleanedSchoolData.SpentPerMaxOccupancy;
    if (SpentPerMaxOccupancy == "") {
        SpentPerMaxOccupancy = "<span class='value-label'>No data for lifetime spending</span>";
    } else {
        SpentPerMaxOccupancy = "$" + SpentPerMaxOccupancy;
    }

    // == future spending
    spendPlanned = cleanedSchoolData.spendPlanned;
    if (spendPlanned == "") {
        spendPlanned = "<span class='value-label'>No data for future spending</span>";
    } else {
        spendPlanned = "$" + spendPlanned;
    }

    // == past spending
    MajorExp9815 = cleanedSchoolData.MajorExp9815;
    if (MajorExp9815 == "") {
        MajorExp9815 = "<span class='value-label'>No data for past spending</span>";
    } else {
        MajorExp9815 = "$" + MajorExp9815;
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

// // ======= ======= ======= calcPerAmounts ======= ======= =======
// function calcPerAmounts(zonesCollectionObj, displayObj) {
//     console.log("calcPerAmounts");
//
//     var nextSpendAmount, nextZoneValue, nextZoneSqft, nextZoneEnroll;
//
//     // == gather selected expenditure (past/future/total) and sqft/enrollment values from aggregator array
//     var zoneValuesArray = [];
//     for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
//         nextSpendAmount = zonesCollectionObj.aggregatorArray[i].zoneAmount;
//
//         // == past/future/total amounts for each zone
//         if (displayObj.dataFilters.math == "spendAmount") {
//             nextZoneValue = zonesCollectionObj.aggregatorArray[i].zoneAmount;
//
//         // == calculate spending per sqft for each zone
//         } else if (displayObj.dataFilters.math == "spendSqFt") {
//             nextZoneSqft = zonesCollectionObj.aggregatorArray[i].zoneSqft;
//             if (nextZoneSqft != 0) {
//                 nextZoneValue = nextSpendAmount/nextZoneSqft;
//             } else {
//                 nextZoneValue = 0;
//             }
//
//         // == calculate spending per student for each zone
//         } else if (displayObj.dataFilters.math == "spendEnroll") {
//             nextZoneEnroll = zonesCollectionObj.aggregatorArray[i].zoneEnroll;
//             if (nextZoneEnroll != 0) {
//                 nextZoneValue = nextSpendAmount/nextZoneEnroll;
//             } else {
//                 nextZoneValue = 0;
//             }
//         }
//         zoneValuesArray.push(nextZoneValue);
//     }
//     console.log("  zoneValuesArray: ", zoneValuesArray);
//
//     // == get lowest/highest values, divide by number of data bins
//     var fillOpacity = 1;
//     var maxValue = Math.max.apply(Math, zoneValuesArray);
//     var minValue = Math.min.apply(Math, zoneValuesArray);
//     var dataIncrement = parseFloat(maxValue/zonesCollectionObj.dataBins);
//     console.log("  dataIncrement: ", dataIncrement);
//     return dataIncrement;
// }
//

// ======= ======= ======= clearZoneAggregator ======= ======= =======
// function clearZoneAggregator(zonesCollectionObj) {
//     console.log("clearZoneAggregator");
//
//     for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
//         zonesCollectionObj.aggregatorArray[i].schoolCount = 0;
//         zonesCollectionObj.aggregatorArray[i].zoneAmount = 0;
//         zonesCollectionObj.aggregatorArray[i].zoneSqft = 0;
//         zonesCollectionObj.aggregatorArray[i].zoneEnroll = 0;
//         zonesCollectionObj.aggregatorArray[i].amountMin = 0;
//         zonesCollectionObj.aggregatorArray[i].amountMax = 0;
//         zonesCollectionObj.aggregatorArray[i].amountAvg = 0;
//         zonesCollectionObj.aggregatorArray[i].amountMed = 0;
//     }
// }

// ======= ======= ======= getZoneIndex ======= ======= =======
// function getZoneIndex(zonesCollectionObj, displayObj, schoolData) {
//     // console.log("getZoneIndex");
//
//     var nextZone, Ward, nextZoneNumber, schoolZoneIndex, rootFeederHS, rootFeederMS;
//
//     for (var i = 0; i < zonesCollectionObj.aggregatorArray.length; i++) {
//         nextZone = zonesCollectionObj.aggregatorArray[i].zoneName;
//         if (displayObj.dataFilters.zones == "Ward") {
//             Ward = parseInt(schoolData.Ward);
//             nextZoneNumber = parseInt(nextZone.split(" ")[1]);
//             if (nextZoneNumber == Ward) {
//                 schoolZoneIndex = i;
//                 break;
//             }
//         } else if (displayObj.dataFilters.zones == "FeederHS") {
//             FeederHS = schoolData.FeederHS;
//             if ((FeederHS == "NA") || (FeederHS == null)) {
//                 schoolZoneIndex = null;
//             } else {
//                 rootFeederHS = FeederHS.split(" ")[0];
//                 if (nextZone == rootFeederHS) {
//                     schoolZoneIndex = i;
//                     break;
//                 }
//             }
//         } else if (displayObj.dataFilters.zones == "FeederMS") {
//             FeederMS = schoolData.FeederMS;
//             if ((FeederMS == "NA") || (FeederMS == null)) {
//                 schoolZoneIndex = null;
//             } else {
//                 rootFeederMS = FeederMS.split(" ")[0];
//                 if (nextZone == rootFeederMS) {
//                     console.log("  schoolZoneIndex: ", schoolZoneIndex);
//                     schoolZoneIndex = i;
//                     break;
//                 }
//             }
//         }
//     }
//     return schoolZoneIndex;
// }
