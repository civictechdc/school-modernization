
// ======= ======= ======= makeRankChart ======= ======= =======
function makeRankChart(zonesCollectionObj, schoolsCollectionObj, displayObj, zoneBcount) {
    console.log("\n----- makeRankChart -----");

    var chartHtml = "<div id='chart'>";
    chartHtml += makeChartHtml();
    chartHtml += makeMessageHtml();
    chartHtml += "</div>";
    clearChartContainer(chartHtml);

    // ======= ======= ======= data source/display ======= ======= =======
    var aggregatorArray = zonesCollectionObj.aggregatorArray;
    var dataColorsArray = zonesCollectionObj.dataColorsArray;

    // ======= ======= ======= sort aggregatorArray by zone values ======= ======= =======
    if (displayObj.dataFilters.zones == "Ward") {
        sortByWard(aggregatorArray);
    }

    // ======= ======= ======= data variables ======= ======= =======
    var dataMin = d3.min(aggregatorArray, function(d) {
        var nextZoneValue;
        if (displayObj.dataFilters.math == "spendAmount") {
            nextZoneValue = d.zoneAmount;
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            nextZoneValue = d.expendPerSqft;
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            nextZoneValue = d.expendPerEnroll;
        }
        return nextZoneValue;
    });
    if (dataMin < 0) {
        dataMin = 0;
    }

    var dataMax = d3.max(aggregatorArray, function(d) {
        var nextZoneValue;
        if (displayObj.dataFilters.math == "spendAmount") {
            nextZoneValue = d.zoneAmount;
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            nextZoneValue = d.expendPerSqft;
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            nextZoneValue = d.expendPerEnroll;
        }
        return nextZoneValue;
    });

    // ======= ======= ======= formatting variables ======= ======= =======
    var chartW, chartH, shortName, scaleFactor, scaleLabel, formattedNumber, barValue, nextDataObject, yAxisTranslate;
    var barW = 20;
    var mathText = null;
    var barIncrement = null;
    var graphElementX = 50;
    var graphElementR = 6;
    var barScaleArray = [];
    var labelTitleArray = [];
    var barValuesArray = [];
    var labelSubtitleArray = [];
    var barTicks = zonesCollectionObj.dataBins;

    // ======= chart formatting =======
    var chartPadding = {top: 20, right: 10, bottom: 20, left: 60},
        chartW = 520 - chartPadding.left - chartPadding.right,       // outer width of chart
        chartH = 300 - chartPadding.top - chartPadding.bottom;      // outer height of chart
    var yAxisLabel = "left";

    // ======= bar formatting =======
    var barIncrement = dataMax/barTicks;
    for (var i = 1; i < (barTicks + 1); i++) {
        barScaleArray.push(parseInt(barIncrement * i));
    }

    // ======= scale formating =======
    if (dataMax > 10000000) {
        scaleFactor = 1000000;
        scaleLabel = "M";
        scaleRound = "M";
        subtitle = " in $millions";
    } else if ((dataMax > 1000000) && (dataMax < 10000000)) {
        scaleFactor = 1000000;
        scaleLabel = "M";
        scaleRound = "decM";
        subtitle = " in $millions";
    } else if ((dataMax > 1000) && (dataMax < 1000000)) {
        scaleFactor = 1000;
        scaleLabel = "K";
        scaleRound = "K";
        subtitle = " in $thousands";
    } else {
        scaleFactor = 1;
        scaleLabel = "";
        scaleRound = "1";
        subtitle = " in dollars";
    }

    // ======= ======= ======= label/title formatting ======= ======= =======
    labelTextArray = updateChartText(displayObj, subtitle);
    mathText = labelTextArray[0];
    schoolText = labelTextArray[1];
    agencyText = labelTextArray[2];
    if (schoolText.length > 0) {
        schoolText = schoolText + " ";
    }
    if (agencyText.length > 0) {
        agencyText = agencyText + " ";
    }

    // ======= ======= ======= Y SCALE ======= ======= =======
    yAxisTranslate = 0;
    var yScale = d3.scale.linear()      // maps input domain to output range
        .domain([0, d3.max(barScaleArray, function(d, i) {
            return d;
        })])
        .range([chartH, chartPadding.top]);
        // .range([chartH + chartPadding.bottom, chartPadding.top]);
    var yAxis = d3.svg.axis()
        .scale(yScale)          // specify left scale
        .orient(yAxisLabel)
        .tickPadding(4)
        .tickSize(30, 0)
        .tickValues(barScaleArray);

    // ======= ======= ======= check math ======= ======= =======
    // console.log("  displayObj.dataFilters.expend: ", displayObj.dataFilters.expend);
    // console.log("  displayObj.dataFilters.math: ", displayObj.dataFilters.math);
    // console.log("  aggregatorArray: ", aggregatorArray);
    // console.log("  barValuesArray: ", barValuesArray);
    console.log("  barScaleArray: ", barScaleArray);
    // console.log("  barIncrement: ", parseInt(barIncrement));
    // console.log("  ...yScale(barIncrement): ", parseInt(yScale(barIncrement)));
    console.log("  dataMax: ", dataMax);
    console.log("  dataMin: ", dataMin);
    console.log("  chartH: ", chartH);
    console.log("  chartW: ", chartW);

    // ======= ======= ======= SVG ======= ======= =======
    var svg = d3.select("#chart").append("svg")
        .attr("width", chartW + (chartPadding.left + chartPadding.right))
        .attr("height", chartH + (chartPadding.top + chartPadding.bottom))
        .append("g")
            .attr("transform", "translate(" + chartPadding.left + "," + chartPadding.top + ")");

    svg.append("g")                 // g group element to contain about-to-be-generated axis elements
        .attr("class", "yAxis")     // assign class of yAxis to new g element, so we can target it with CSS:
        .call(yAxis)                // call axis function; generate SVG elements of axis; takes selection as input; hands selection to function
        .attr("transform", "translate(" + yAxisTranslate + ", 0)")
        .selectAll("text")
            .attr("class", "yLabels")
            .text(function(d) {
                if ((scaleRound == "decM") || (scaleRound == "K")) {
                    newD = (d/scaleFactor).toFixed(1);
                } else {
                    newD = parseInt(d/scaleFactor);
                }
                return "$" + newD + " " + scaleLabel;
            })
            .style("text-anchor", "start")
            .style("font-size", "10px");

    // ======= ======= ======= DATA INCREMENTS ======= ======= =======
    svg.selectAll(".bar")
        .data(barScaleArray)
        .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return 10;
            })
            .attr("width", barW)
            .attr("y", function(d, i) {
                if (i < (barTicks)) {
                    return parseInt(yScale(d));
                } else {
                    return null;
                }
            })
            .attr("height", function(d, i) {
                barH = parseInt((chartH/barTicks) - 2);
                // barH = parseInt(((chartH + 20)/barTicks) - 2);
                // var barH = chartH - parseInt(yScale(((chartH + 20)/barTicks) - 2));
                if (i < (barTicks + 1)) {
                    return barH;
                } else {
                    return 0;
                }
            })
            .style({'fill': function(d, i) {
                if (i < (barTicks + 1)) {
                    whichColor = dataColorsArray[i];
                    return whichColor;
                } else {
                    return "white";
                }
            }});

    // ======= bar graph =======
    svg.selectAll(".databar")
        .data(aggregatorArray)
        .enter()
            .append("rect")
            .attr("id", (function(d, i) {
                barId = "dataChartValue_" + i;
                return barId;
            }))
            .attr("class", "dataChartValue")
            .attr("x", function(d, i) {
                return graphElementX + (i * 25);
            })
            .attr("y", function(d, i) {
                var nextZoneValue;
                if (displayObj.dataFilters.math == "spendAmount") {
                    nextZoneValue = d.zoneAmount;
                } else if (displayObj.dataFilters.math == "spendSqFt") {
                    nextZoneValue = d.expendPerSqft;
                } else if (displayObj.dataFilters.math == "spendEnroll") {
                    nextZoneValue = d.expendPerEnroll;
                }
                if (isNaN(nextZoneValue) || (nextZoneValue < 0)) {
                    nextZoneValue = 0;
                }
                return parseInt(yScale(nextZoneValue));
            })
            .attr("width", barW)
            .attr("height", function(d, i) {
                var nextZoneValue;
                if (displayObj.dataFilters.math == "spendAmount") {
                    nextZoneValue = d.zoneAmount;
                } else if (displayObj.dataFilters.math == "spendSqFt") {
                    nextZoneValue = d.expendPerSqft;
                } else if (displayObj.dataFilters.math == "spendEnroll") {
                    nextZoneValue = d.expendPerEnroll;
                }
                if (isNaN(nextZoneValue) || (nextZoneValue < 0)) {
                    nextZoneValue = 0;
                }
                var barH = chartH - parseInt(yScale(nextZoneValue));
                return barH;
            })
            .style('fill', function(d){
                var nextZoneValue;
                if (displayObj.dataFilters.math == "spendAmount") {
                    nextZoneValue = d.zoneAmount;
                } else if (displayObj.dataFilters.math == "spendSqFt") {
                    nextZoneValue = d.expendPerSqft;
                } else if (displayObj.dataFilters.math == "spendEnroll") {
                    nextZoneValue = d.expendPerEnroll;
                }
                if (isNaN(nextZoneValue) || (nextZoneValue < 0)) {
                    nextZoneValue = 0;
                }
                colorIndex = assignChartColors(nextZoneValue);
                whichColor = dataColorsArray[colorIndex];
                // console.log(d.zoneName, " chart: ", i, colorIndex, whichColor);
                return whichColor;
            });

    // ======= circle labels =======
    svg.selectAll(".text")
        .data(aggregatorArray)
        .enter()
            .append("text")
                .attr("id", (function(d, i) {
                    labelId = "dataChartLabel_" + i;
                    return labelId;
                }))
                .attr("class", "dataChartLabel")
                .text(function(d, i) {
                    var nextZoneValue;
                    if (displayObj.dataFilters.math == "spendAmount") {
                        nextZoneValue = d.zoneAmount;
                    } else if (displayObj.dataFilters.math == "spendSqFt") {
                        nextZoneValue = d.expendPerSqft;
                    } else if (displayObj.dataFilters.math == "spendEnroll") {
                        nextZoneValue = d.expendPerEnroll;
                    }
                    formattedNumber = numberWithCommas(nextZoneValue);
                    var checkWard = i;
                    if (checkWard > -1) {
                        var wardName = d.zoneName.replace(" ", "-");
                        labelString = wardName + " " + agencyText + schoolText + "$" + formattedNumber + " " + mathText;
                    } else {
                        labelString = d.zoneName + " " + agencyText + schoolText + "$" + formattedNumber + " " + mathText;
                    }
                    return labelString;
                })
                .attr("x", function(d, i) {
                    var labelOffsetX = graphElementX  + (i * 25) + 10;
                    return labelOffsetX;
                })
                .attr("y", function(d, i) {
                    // == position t bar top
                    // var nextZoneValue;
                    // if (displayObj.dataFilters.math == "spendAmount") {
                    //     nextZoneValue = d.zoneAmount;
                    // } else if (displayObj.dataFilters.math == "spendSqFt") {
                    //     nextZoneValue = d.expendPerSqft;
                    // } else if (displayObj.dataFilters.math == "spendEnroll") {
                    //     nextZoneValue = d.expendPerEnroll;
                    // }
                    // return yScale(nextZoneValue) - 20;

                    // == position at chart top
                    return yScale(dataMax) - 20;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "black")
                .attr("visibility", "hidden")
                .call(insertLabelText);

    activateChartElements(labelTitleArray, labelSubtitleArray);
    activateMessageHide();
    activateSubmenu();

    // ======= activateChartElements =======
    function activateChartElements(labelTitleArray, labelSubtitleArray) {
        console.log("activateChartElements");

        $('.dataChartValue').each(function(i) {

            // ======= ======= ======= mouseover ======= ======= =======
            $(this).off("mouseover").on("mouseover", function(event){
                // console.log("\n======= showLabel ======= ");
                $("#chart-message").css("display", "none");
                var targetLabel = $('#dataChartLabel_' + i);
                var targetCircleId = $(this).attr('id');
                var subIndex = targetCircleId.indexOf("_") + 1;
                var featureIndex = parseInt(targetCircleId.substring(subIndex, targetCircleId.length));
                $(targetLabel).attr("visibility", "visible");
                targetMarkerIndex = this.id.split("_")[1];
                if (displayObj.dataFilters.zones == null) {
                    schoolMarker = schoolsCollectionObj.schoolMarkersArray[targetMarkerIndex];
                    schoolMarker.icon.fillColor = "white";
                    schoolMarker.icon.scale = 0.4;
                    schoolMarker.setMap(map);
                } else {
                    multiLayerOffset = zoneBcount;
                    var featureOffset = featureIndex + multiLayerOffset;
                    toggleFeatureHilite(featureOffset, "on");
                }
            });

            // ======= ======= ======= mouseout ======= ======= =======
            $(this).off("mouseout").on("mouseout", function(event){
                // console.log("\n======= hideLabel ======= ");
                targetLabel = $('#dataChartLabel_' + i);
                $(targetLabel).attr("visibility", "hidden");
                targetMarkerIndex = this.id.split("_")[1];
                var targetCircleId = $(this).attr('id');
                var subIndex = targetCircleId.indexOf("_") + 1;
                var featureIndex = parseInt(targetCircleId.substring(subIndex, targetCircleId.length));
                if (displayObj.dataFilters.zones == null) {
                    schoolMarker = schoolsCollectionObj.schoolMarkersArray[targetMarkerIndex];
                    schoolMarker.icon.fillColor = schoolMarker.defaultColor;
                    schoolMarker.icon.scale = 0.2;
                    schoolMarker.setMap(map);
                } else {
                    multiLayerOffset = zoneBcount;
                    var zoneFeature = zonesCollectionObj.zoneFeaturesArray[featureIndex];
                    var featureOffset = featureIndex + multiLayerOffset;
                    toggleFeatureHilite(featureOffset, "off");
                }
            });

            // ======= ======= ======= mouseout ======= ======= =======
            $(this).off("click").on("click", function(event){
                console.log("\n======= click ======= ");
                schoolIndex = this.id.split("_")[1];
                if (displayObj.dataFilters.zones == null) {
                    makeSchoolProfile(schoolsCollectionObj, schoolIndex);
                    $("#profile").css("display", "table");
                    schoolMarker = schoolsCollectionObj.schoolMarkersArray[targetMarkerIndex];
                    schoolMarker.icon.fillColor = "yellow";
                    schoolMarker.icon.scale = 0.2;
                    schoolMarker.setMap(map);
                }
            });

        });
    }

    // ======= toggleFeatureHilite =======
    function toggleFeatureHilite(featureIndex, onOrOff) {
        // console.log("toggleFeatureHilite");
        if (featureIndex < zonesCollectionObj.zoneFeaturesArray.length) {
            var zoneFeature = zonesCollectionObj.zoneFeaturesArray[featureIndex];
            var zoneName = zoneFeature.getProperty('zoneName');
            var itemColor = zoneFeature.getProperty('itemColor');

            if (onOrOff == "on") {
                updateHoverText(zoneName);
                map.data.overrideStyle(zoneFeature, {
                    fillOpacity: 0.1,
                    fillColor: "white",
                    strokeColor: "red"
                });
            } else {
                updateHoverText(null);
                map.data.revertStyle(zoneFeature);
            }
        }
    }

    // ======= ======= ======= makeChartHtml ======= ======= =======
    function makeChartHtml() {
        console.log("\n----- makeChartHtml -----");
        var chartHtml = "<table id='chart'>";
        chartHtml += "<tr><td class='profile-banner' colspan=2>";
        chartHtml += "<div class='title-container'><p id='chart-title'>data chart</p>";
        chartHtml += "<p id='chart-subtitle'>&nbsp;</p></div>";
        chartHtml += displayObj.makeMathSelect(displayObj.expendMathMenu, "chart");
        chartHtml += "</td></tr></table>";
        return chartHtml;
    }

    // ======= ======= ======= makeMessageHtml ======= ======= =======
    function makeMessageHtml() {
        console.log("----- makeMessageHtml -----");
        var messageHtml = "<div id='chart-message'>";
        messageHtml += "<p>View data details by moving mouse over columns in chart</p>";
        messageHtml += "</div>";
        return messageHtml;
    }

    // ======= ======= ======= assignChartColors ======= ======= =======
    function assignChartColors(zoneAmount) {
        // console.log("assignChartColors");
        var binMin = binMax = colorIndex = null;
        if (zoneAmount < 0) {
            zoneAmount = 0;
        }
        for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
            binMin = (zonesCollectionObj.dataIncrement * i);
            binMax = (zonesCollectionObj.dataIncrement * (i + 1));
            if ((binMin <= zoneAmount) && (zoneAmount <= binMax)) {
                colorIndex = i;
                break;
            }
        }
        return colorIndex;
    }

    // ======= ======= ======= numberWithCommas ======= ======= =======
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // ======= ======= ======= insertLabelText ======= ======= =======
    function insertLabelText(text) {
        console.log("insertLabelText");

        text.each(function() {
            var text = d3.select(this);                         // text as sentence
            var words = text.text().split(/\s+/);                // text as array (rebuilds in correct order below)
            var wordString1 = "";
            var wordString2 = "";
            if (mathText) {
                var lineSplit = 3;
            } else {
                var lineSplit = 2;
            }
            for (var i = 0; i < (words.length - lineSplit); i++) {
                nextWord = words[i];
                wordString1 = wordString1 + " " + nextWord;
            }
            for (var i = (words.length - lineSplit); i < words.length; i++) {
                nextWord = words[i];
                wordString2 = wordString2 + " " + nextWord;
            }

            words = [wordString2, wordString1];
            var x = text.attr("x");
            var y = text.attr("y");
            var word;
            var width = 200;
            var lineNumber = 0;
            var lineHeight = 10;
            var lineArray = [];                         // line built word by word
            var tspan = text.text(null)                 // new container for line 1
                .append("tspan")
                .attr("x", x)
                .attr("y", y);

            // == loop through word list to assign lines
            while (word = words.pop()) {                // add words until width exceeded
                lineArray.push(word);
                tspan.text(lineArray.join(" "));

                // == new line when word count exceeds 1 word
                if (lineArray.length > 1) {
                    lineArray.pop();                    // remove too-long word
                    labelTitleArray.push(lineArray.join(" "));
                    tspan.text(lineArray.join(" "));    // space before adding new tspan element
                    lineArray = [word];                 // add too-long word to line array
                    newX = parseInt(parseInt(x) + 5);   // offset values for new line (must be integer)
                    newY = parseInt(parseInt(y) + 14);
                    labelSubtitleArray.push(word);
                    tspan = text.append("tspan")        // make tspan for line 2
                        .text(word)
                        .attr("x", newX + "px")
                        .attr("y", newY + "px")
                        .attr("font-size", "12px")
                        .attr("fill", "purple");
                }
            }
        });
    }

    // ======= activateMessageHide =======
    function activateMessageHide() {
        console.log("activateMessageHide");

        // ======= ======= ======= mouseover ======= ======= =======
        $("#chart-message").off("mouseover").on("mouseover", function(event){
            console.log("======= hideMessage ======= ");
            $("#chart-message").css("display", "none");
        });

        // ======= ======= ======= mouseover ======= ======= =======
        $("#filter-container ").off("mouseover").on("mouseover", function(event){
            console.log("======= showMessage ======= ");
            $("#chart-message").css("display", "block");
        });
    }

    // ======= ======= ======= activateSubmenu ======= ======= =======
    function activateSubmenu() {
        console.log("activateSubmenu");

        $('#expendMathC').on({
            change: function() {
                console.log("\n------- setSubMenu -------");
                nextMath = $("select[name='expendMath'] option:selected").val()
                displayObj.dataFilters.math = nextMath;
                zonesCollectionObj.importZoneDataA();
            }
        });
    }

    // ======= tweakSchoolLabels =======
    function tweakSchoolLabels() {
        console.log("tweakSchoolLabels");
        var yVal, newY, changeFlag;
        var locOK = false;
        var prevYarray = [];

        $('.dataChartLabel').each(function(i) {
            yVal = parseInt(this.getAttribute("y"));
            prevYarray.push(yVal);
        });

        for (var i = 0; i < prevYarray.length; i++) {
            checkY = prevYarray[i];
            for (var j = 0; j < prevYarray.length; j++) {
                if (j == i) {
                } else {
                    checkNext = prevYarray[j];
                    checkDiff = Math.abs(checkY - checkNext);
                    if (checkDiff < 14) {
                        prevYarray[j] = checkNext + (14 - checkDiff);
                    }
                }
            }
        }

        $('.dataChartLabel').each(function(i) {
            nextYloc = prevYarray[i];
            this.setAttribute("y", nextYloc);
        });
    }

    // ======= ======= ======= clearChartContainer ======= ======= =======
    function clearChartContainer(chartHtml) {
        console.log("clearChartContainer");
        // ======= remove previous chart or profile html if any =======
        if ($('#profile-container').find('#profile').length) {
            $("#profile").remove();
        }
        if ($('#legend-container').find('#legend').length) {
            $("#legend").remove();
        }

        if ($('#chart-container').find('#chart').length) {
            $("#chart").remove();
            $("#chart-container").append(chartHtml);
            updateChartStyle();
            $("#chart-container").fadeIn( "slow", function() {
                // console.log("*** FADEIN chart-container ***");
            });
        } else {
            $("#chart-container").append(chartHtml);
            updateChartStyle();
            $("#chart-container").fadeIn( "slow", function() {
                // console.log("*** FADEIN chart-container ***");
            });
        }
    }

    // ======= ======= ======= updateChartStyle ======= ======= =======
    function updateChartStyle() {
        console.log("updateChartStyle");

        $("#chart-container").css("position", "absolute");
        $("#chart-container").css("top", "410px");
        $("#chart-container").css("left", "0");
        $("#chart-container").css("width", "520px");
        $("#chart-container").css("height", "auto");
    }

    // ======= stringToInt =======
    function stringToInt(d) {
        // console.log("stringToInt");
        d.value = +d.value;
        return d;
    }
}

// // ======= ======= ======= extract zone values ======= ======= =======
// var nextZoneValue;
// var zoneIndex = -1;
// aggregatorArray.sort(function(a, b) {
//     zoneIndex++;
//     if (displayObj.dataFilters.math == "spendAmount") {
//         nextZoneValueA = a.zoneAmount;
//         nextZoneValueB = b.zoneAmount;
//     } else if (displayObj.dataFilters.math == "spendSqFt") {
//         nextZoneValueA = a.expendPerSqft;
//         nextZoneValueB = b.expendPerSqft;
//     } else if (displayObj.dataFilters.math == "spendEnroll") {
//         nextZoneValueA = a.expendPerEnroll;
//         nextZoneValueB = b.expendPerEnroll;
//     }
//     if (isNaN(nextZoneValueA)) {
//         nextZoneValueA = 0;
//     }
//     if (isNaN(nextZoneValueB)) {
//         nextZoneValueB = 0;
//     }
//     return nextZoneValueB - nextZoneValueA;
// });
