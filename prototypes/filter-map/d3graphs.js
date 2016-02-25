
// ======= ======= ======= makeRankChart ======= ======= =======
function makeRankChart(zonesCollectionObj, schoolsCollectionObj, displayObj, zoneBcount) {
    console.log("\n----- makeRankChart -----");

    // ======= ======= ======= chart html ======= ======= =======
    if (displayObj.displayMode != "storyMap") {
        var chartHtml = "<table id='chart'>";
        chartHtml += "<tr><td class='profile-banner' colspan=2>";
        chartHtml += "<div class='title-container'><p id='chart-title'>data chart</p>";
        chartHtml += "<p id='chart-subtitle'>&nbsp;</p></div>";
        chartHtml += displayObj.makeSubMenu(displayObj.expendMathMenu);
        chartHtml += "</td></tr></table>";
    } else {
        var chartHtml = "<div id='chart'></div>";
    }

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
    } else {
        $("#chart-container").append(chartHtml);
        updateChartStyle();
        $("#chart-container").fadeIn( "slow", function() {
            console.log("*** FADEIN chart-container ***");
        });
    }

    // ======= ======= ======= formatting variables ======= ======= =======
    var chartW, chartH, shortName, scaleFactor, scaleLabel, formattedNumber;
    var circleValue, nextDataObject;
    var yAxisTranslate;
    var barW = 20;
    var mathText = null;
    var schoolCircleR = 6;
    var barScaleArray = [];
    var circleValuesArray = [];
    var labelTitleArray = [];
    var labelSubtitleArray = [];
    var barTicks = zonesCollectionObj.dataBins;
    var fillColors = zonesCollectionObj.dataColorsArray;
    if (displayObj.displayMode != "storyMap") {
        var schoolCircleX = 50;
    } else {
        var schoolCircleX = -30;
    }

    // ======= chart formatting =======
    if (displayObj.displayMode != "storyMap") {
        var chartPadding = {top: 20, right: 10, bottom: 40, left: 60},
            chartW = 360 - chartPadding.left - chartPadding.right,       // outer width of chart
            chartH = 300 - chartPadding.top - chartPadding.bottom;      // outer height of chart
        var yAxisLabel = "left";
    } else {
        var chartPadding = {top: 20, right: 10, bottom: 40, left: 60},
            chartW = 150 - chartPadding.left - chartPadding.right,       // outer width of chart
            chartH = 300 - chartPadding.top - chartPadding.bottom;      // outer height of chart
        var yAxisLabel = "right";
    }

    // ======= ======= ======= data variables ======= ======= =======
    var dataObjectsArray = zonesCollectionObj.aggregatorArray;
    var myJsonString = JSON.stringify(dataObjectsArray);
    var dataMax = d3.max(dataObjectsArray, function(d) {
        if (displayObj.dataFilters.math == "spendAmount") {
            return d.zoneAmount;
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            if (d.zoneEnroll != 0) {
                return parseInt(d.zoneAmount / d.zoneEnroll);
            } else {
                return 0;
            }
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            if (d.zoneSqft != 0) {
                return parseInt(d.zoneAmount / d.zoneSqft);
            } else {
                return 0;
            }
        }
    });
    var dataMin = d3.min(dataObjectsArray, function(d) {
        if (displayObj.dataFilters.math == "spendAmount") {
            return d.zoneAmount;
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            if (d.zoneEnroll != 0) {
                return parseInt(d.zoneAmount / d.zoneEnroll);
            } else {
                return 0;
            }
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            if (d.zoneSqft != 0) {
                return parseInt(d.zoneAmount / d.zoneSqft);
            } else {
                return 0;
            }
        }
    });

    // ======= bar formatting =======
    var barIncrement = dataMax/barTicks;
    for (var i = 1; i < (barTicks + 1); i++) {
        barScaleArray.push(parseInt(barIncrement * i));
    }

    // ======= scale formating =======
    if (dataMax > 1000000) {
        scaleFactor = 1000000;
        scaleLabel = "M";
        scaleRound = 1000;
        subtitle = " in $millions";
    } else if ((dataMax > 1000) && (dataMax < 1000000)) {
        scaleFactor = 1000;
        scaleLabel = "K";
        scaleRound = 10;
        subtitle = " in $thousands";
    } else {
        scaleFactor = 1;
        scaleLabel = "";
        scaleRound = 0.01;
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

    // ======= ======= ======= circle Y positioning ======= ======= =======
    for (var i = 0; i < dataObjectsArray.length; i++) {
        nextDataObject = dataObjectsArray[i];
        if (displayObj.dataFilters.math == "spendAmount") {
            circleValue = parseInt(nextDataObject.zoneAmount);
        } else if (displayObj.dataFilters.math == "spendEnroll") {
            if (nextDataObject.zoneEnroll != 0) {
                circleValue = parseInt(nextDataObject.zoneAmount/nextDataObject.zoneEnroll);
            } else {
                circleValue = 0;
            }
        } else if (displayObj.dataFilters.math == "spendSqFt") {
            if (nextDataObject.zoneSqft != 0) {
                circleValue = parseInt(nextDataObject.zoneAmount/nextDataObject.zoneSqft);
            } else {
                circleValue = 0;
            }
        }
        circleValuesArray.push(circleValue);
    }

    // ======= ======= ======= check math ======= ======= =======
    console.log("  displayObj.dataFilters.math: ", displayObj.dataFilters.math);
    console.log("  dataObjectsArray: ", dataObjectsArray);
    console.log("  circleValuesArray: ", circleValuesArray);
    console.log("  barScaleArray: ", barScaleArray);
    console.log("  dataMax: ", dataMax);
    console.log("  dataMin: ", dataMin);

    // ======= ======= ======= X SCALE ======= ======= =======
    var xScaleLabels = ["scale", "amount", "school"];
    var xScale = d3.scale.ordinal()         // maps input domain to output range
        .domain(xScaleLabels.map(function(d) {
            // console.log("  d: ", d);
            return d;;
        }))
        .range([0, chartW]);

        // ======= ======= ======= Y SCALE ======= ======= =======
    var yScale = d3.scale.linear()      // maps input domain to output range
        .domain([0, d3.max(barScaleArray, function(d, i) {
            // console.log("  d: ", d);
            return d;
        })])
        .range([chartH + 20, 0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)          // specify left scale
        .orient(yAxisLabel)
        .tickPadding(4)
        .tickSize(30, 0)
        .tickValues(barScaleArray);

    // ======= ======= ======= SVG ======= ======= =======
    var svg = d3.select("#chart").append("svg")
        .attr("width", chartW + (chartPadding.left + chartPadding.right))
        .attr("height", chartH + (chartPadding.top + chartPadding.bottom))
        .append("g")
            .attr("transform", "translate(" + chartPadding.left + "," + chartPadding.top + ")");

    // ======= yAxis =======
    if (displayObj.displayMode != "storyMap") {
        yAxisTranslate = 0;
    } else {
        yAxisTranslate = 0;
    }

    svg.append("g")                 // g group element to contain about-to-be-generated axis elements
        .attr("class", "yAxis")     // assign class of yAxis to new g element, so we can target it with CSS:
        .call(yAxis)                // call axis function; generate SVG elements of axis; takes selection as input; hands selection to function
        .attr("transform", "translate(" + yAxisTranslate + ", 0)")
        .selectAll("text")
            .attr("class", "yLabels")
            .text(function(d) {
                newD = parseInt(d/scaleFactor);
                return "$" + newD + " " + scaleLabel;
            })
            .style("text-anchor", "start")
            .style("font-size", "10px");

    // ======= ======= ======= RECTS ======= ======= =======
    svg.selectAll(".bar")
        .data(barScaleArray)
        .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                if (displayObj.displayMode != "storyMap") {
                    return 4;
                } else {
                    return 0;
                }
            })
            .attr("width", barW)
            .attr("y", function(d, i) {
                if (i < (barTicks)) {
                    return yScale(d);
                } else {
                    return null;
                }
            })
            .attr("height", function(d, i) {
                barH = ((chartH + 20)/barTicks) - 2;
                if (i < (barTicks + 1)) {
                    return barH;
                } else {
                    return 0;
                }
            })
            .style({'fill': function(d, i) {
                if (i < (barTicks + 1)) {
                    whichColor = fillColors[i];
                    return whichColor;
                } else {
                    return "white";
                }
            }});

    // ======= circles for schools =======
    svg.selectAll("circle")
        .data(dataObjectsArray)
        .enter()
            .append("circle")
            .attr("id", (function(d, i) {
                circleId = "dataChartValue_" + d.zoneIndex;
                return circleId;
            }))
            .attr("class", "dataChartValue")
            .attr("cx", function(d, i) {
                return schoolCircleX;
            })
            .attr("cy", function(d, i) {
                // console.log("  i/circleValuesArray[i]: ", i, " / ", circleValuesArray[i])
                return yScale(circleValuesArray[i]);
            })
            .attr("r", function(d) {
                // console.log("  d: ", d);
                return schoolCircleR;
            })
            .style('fill', function(d, i){
                colorIndex = assignChartColors(circleValuesArray[i]);
                whichColor = fillColors[colorIndex];
                return whichColor;
            });

    // ======= circle labels =======
    svg.selectAll(".text")
        .data(dataObjectsArray)
        .enter()
            .append("text")
                .attr("id", (function(d, i) {
                    labelId = "dataChartLabel_" + i;
                    return labelId;
                }))
                .attr("class", "dataChartLabel")
                .text(function(d, i) {
                    formattedNumber = numberWithCommas(circleValuesArray[i]);
                    var checkWard = d.zoneName.indexOf("Ward ");
                    if (checkWard > -1) {
                        var wardName = d.zoneName.replace(" ", "-");
                        labelString = wardName + " " + agencyText + schoolText + "$" + formattedNumber + " " + mathText;
                    } else {
                        labelString = d.zoneName + " " + agencyText + schoolText + "$" + formattedNumber + " " + mathText;
                    }
                    // console.log("  labelString: ", labelString);
                    return labelString;
                })
                .attr("x", function(d, i) {
                    return schoolCircleX + 15;
                })
                .attr("y", function(d, i) {
                    return yScale(circleValuesArray[i]);
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "black")
                .attr("visibility", "hidden")
                .call(insertLabelText);

    activateChartCircles(labelTitleArray, labelSubtitleArray);
    activateSubmenu();

    // ======= ======= ======= assignChartColors ======= ======= =======
    function assignChartColors(zoneAmount) {
        // console.log("assignChartColors");
        var binMin = binMax = colorIndex = null;
        for (var i = 0; i < zonesCollectionObj.dataBins; i++) {
            binMin = (zonesCollectionObj.dataIncrement * i);
            binMax = (zonesCollectionObj.dataIncrement * (i + 1));
            // console.log("  zoneAmount: ", zoneAmount)
            // console.log("   binMin: ", binMin)
            // console.log("   binMax: ", binMax)
            if ((binMin <= zoneAmount) && (zoneAmount <= binMax)) {
                colorIndex = i;
                break;
            }
        }
        // console.log("   colorIndex: ", colorIndex)
        return colorIndex;
    }

    // ======= ======= ======= activateSubmenu ======= ======= =======
    function activateSubmenu() {
        console.log("activateSubmenu");

        $('#expendMath').on({
            change: function() {
                console.log("\n------- setSubMenu -------");
                nextMath = $("select[name='expendMath'] option:selected").val()
                console.log("  event: ", event);
                console.log("  nextMath: ", nextMath);
                displayObj.dataFilters.math = nextMath;
                // clearZoneAggregator(zonesCollectionObj);
                checkFilterSelection(displayObj, zonesCollectionObj, "math");

                zonesCollectionObj.getZoneData();
            }
        });
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
            // var words = text.text().split(/\s+/).reverse();     // text as array (rebuilds in correct order below)
            var words = text.text().split(/\s+/);                // text as array (rebuilds in correct order below)
            // console.log("  words: ", words);
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
            // console.log("  words.length: ", words.length);
            // console.log("  wordString1: ", wordString1);
            // console.log("  wordString2: ", wordString2);
            words = [wordString2, wordString1];
            // console.log("  words: ", words);
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

    // ======= activateChartCircles =======
    function activateChartCircles(labelTitleArray, labelSubtitleArray) {
        console.log("activateChartCircles");

        $('.dataChartValue').each(function(i) {

            // ======= ======= ======= mouseover ======= ======= =======
            $(this).off("mouseover").on("mouseover", function(event){
                console.log("\n======= showLabel ======= ");
                if (displayObj.displayMode != "storyMap") {
                    targetLabel = $('#dataChartLabel_' + i);
                    $(targetLabel).attr("visibility", "visible");
                } else {
                    $("#data-title").text(labelTitleArray[i]);
                    $("#data-subtitle").text(labelSubtitleArray[i]);
                }
                targetMarkerIndex = this.id.split("_")[1];
                if (displayObj.dataFilters.zones == null) {
                    schoolMarker = schoolsCollectionObj.schoolMarkersArray[targetMarkerIndex];
                    schoolMarker.icon.fillColor = "white";
                    schoolMarker.icon.scale = 0.4;
                    schoolMarker.setMap(map);
                } else {
                    multiLayerOffset = zoneBcount;
                    toggleFeatureHilite((i + multiLayerOffset), "on");
                }
            });

            // ======= ======= ======= mouseout ======= ======= =======
            $(this).off("mouseout").on("mouseout", function(event){
                // console.log("\n======= hideLabel ======= ");
                if (displayObj.displayMode != "storyMap") {
                    targetLabel = $('#dataChartLabel_' + i);
                    $(targetLabel).attr("visibility", "hidden");
                } else {
                    $("#data-title").text("");
                    $("#data-subtitle").text("");
                }
                targetMarkerIndex = this.id.split("_")[1];
                if (displayObj.dataFilters.zones == null) {
                    schoolMarker = schoolsCollectionObj.schoolMarkersArray[targetMarkerIndex];
                    schoolMarker.icon.fillColor = schoolMarker.defaultColor;
                    schoolMarker.icon.scale = 0.2;
                    schoolMarker.setMap(map);
                } else {
                    multiLayerOffset = zoneBcount;
                    toggleFeatureHilite((i + multiLayerOffset), "off");
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
    function toggleFeatureHilite(i, onOrOff) {
        console.log("toggleFeatureHilite");
        var zoneFeature = zonesCollectionObj.zoneFeaturesArray[i];
        var zoneName = zoneFeature.getProperty('itemName');
        var zoneIndex = zoneFeature.getProperty('index');
        if (displayObj.displayMode != "storyMap") {
            var itemColor = zoneFeature.getProperty('itemColor');
        } else {
            var itemColor = "white";
        }

        if (onOrOff == "on") {
            map.data.overrideStyle(zoneFeature, {
                fillOpacity: 1,
                fillColor: itemColor,
                strokeColor: "red"
            });
        } else {
            map.data.revertStyle(zoneFeature);
        }
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

    // ======= ======= ======= updateChartStyle ======= ======= =======
    function updateChartStyle() {
        console.log("updateChartStyle");

        if (displayObj.displayMode == "storyMap") {
            $("#chart-container").css("top", "52%");
            $("#chart-container").css("left", "5%");
            $("#chart-container").css("width", "160px");
            $("#chart-container").css("height", "200px");
        } else {
            $("#chart-container").css("top", "42%");
            $("#chart-container").css("left", "65%");
            $("#chart-container").css("width", "360px");
            $("#chart-container").css("height", "auto");
        }
    }

    // ======= stringToInt =======
    function stringToInt(d) {
        // console.log("stringToInt");
        d.value = +d.value;
        return d;
    }
}



// ======= ======= ======= makeZoneSchoolsChart ======= ======= =======
function makeZoneSchoolsChart(dataObjectsArray) {
    console.log("makeZoneSchoolsChart");

    // data: schoolName, schoolCode, schoolType, schoolLevel, schoolExpenditure, schoolSqft, schoolLng, schoolLat, schoolWard
    // nextSchoolObject = { schoolName: null, schoolExpenditure: null }

    $("#chart-container").css("display", "block");

    var chartW, chartH, shortName, scaleFactor, scaleLabel;
    var myJsonString = JSON.stringify(dataObjectsArray);
    var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod", "blueviolet", "chartreuse", "cornflowerblue"];

    // ======= chart formatting =======
    var chartPadding = {top: 10, right: 20, bottom: 80, left: 60},
        chartW = 360 - chartPadding.left - chartPadding.right,       // outer width of chart
        chartH = 360 - chartPadding.top - chartPadding.bottom;      // outer height of chart

    var dataMax = d3.max(dataObjectsArray, function(d) {
        return d.expend;
    });

    if (dataMax > 1000000) {
        scaleFactor = 1000000;
        scaleLabel = "M$";
    } else if ((dataMax < 1000000) && (dataMax > 1000)) {
        scaleFactor = 1000;
        scaleLabel = "K$";
    } else {
        scaleFactor = 1;
        scaleLabel = "$";
    }
    console.log("  dataMax: ", dataMax);
    console.log("  scaleFactor: ", scaleFactor);

    // ======= scale mapping (data to display) =======
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, chartW], 0.1)
        .domain(dataObjectsArray.map(function(d) {
            subNames = d.schoolName.split(" ");
            shortName = subNames[0];
            d.schoolName = shortName;
            return d.schoolName;;
        }));

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataObjectsArray, function(d) {
            // return +d.expend / scaleFactor;
            return +d.expend;
        })])
        .range([chartH, 0]);

    // ======= scale label formating =======
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    // ======= build svg objects =======
    $("#chart").empty();
    var svg = d3.select("#chart").append("svg")
        .attr("width", chartW + (chartPadding.left + chartPadding.right))
        .attr("height", chartH + (chartPadding.top + chartPadding.bottom))
        .append("g")
            .attr("transform", "translate(" + chartPadding.left + "," + chartPadding.top + ")");

    // ======= X scale =======
    svg.append("g")
        .data(dataObjectsArray)
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + chartH + ")")
        .call(xAxis)
        .selectAll("text")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" )
            .style("text-anchor", "end")
            .style("font-size", "10px");

    // ======= Y scale =======
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
            // .attr("dx", "-.8em")
            // .attr("dy", ".15em")
            .style("text-anchor", "end")
            .style("font-size", "10px");

        // .append("text")
        //     .attr("y", -30)
        //     .attr("x", 30)
        //     .attr("dy", ".71em")
        //     .style("font-size", "10px")
        //     .style("text-anchor", "start");

    // ======= rects for bar graph =======
    var counter = 0;
    var multiplier = 0;
    var colorIndex = 0;
    svg.selectAll(".bar")
        .data(dataObjectsArray)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                console.log("  d.schoolName: ", d.schoolName);
                return xScale(d.schoolName);
            })
            .attr("width", xScale.rangeBand() - 2)
            .attr("y", function(d) {
                return yScale(d.expend);
            })
            .attr("height", function(d) {
                console.log("  d.expend: ", d.expend);
                    return chartH - yScale(d.expend);
                })
            .style({'fill': function(d, i) {
                    counter++;
                    if (counter == fillColors.length) {
                        multiplier++;
                        counter = 0
                    }
                    colorIndex = i - (fillColors.length * multiplier);
                    whichColor = fillColors[colorIndex];
                    return whichColor;
                }})
            .style("font-size", "10px");


    // ======= stringToInt =======
    function stringToInt(d) {
        // console.log("stringToInt");
        d.value = +d.value;
        return d;
    }
}


// ======= ======= ======= makeSchoolsChart ======= ======= =======
function makeSchoolsChart(schoolDataArray) {
    console.log("makeSchoolsChart");

    // data: schoolName, schoolCode, schoolType, schoolLevel, schoolExpenditure, schoolSqft, schoolLng, schoolLat, schoolWard
    // nextSchoolObject = { schoolName: null, schoolExpenditure: null }

    $("#chart").css("display", "block");

    var chartW, chartH, shortName, scaleFactor, scaleLabel;
    var myJsonString = JSON.stringify(schoolDataArray);
    var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod", "blueviolet", "chartreuse", "cornflowerblue"];
    // console.log("  myJsonString: ", myJsonString);

    // ======= chart formatting =======
    var chartPadding = {top: 10, right: 20, bottom: 80, left: 60},
        chartW = 360 - chartPadding.left - chartPadding.right,       // outer width of chart
        chartH = 360 - chartPadding.top - chartPadding.bottom;      // outer height of chart

    var dataMax = d3.max(schoolDataArray, function(d) {
        // if (dataMax > 1000000) {
        //     scaleFactor = 1000000;
        //     scaleLabel = "M$";
        // } else if ((dataMax < 1000000) && (dataMax > 1000)) {
        //     scaleFactor = 1000;
        //     scaleLabel = "K$";
        // } else {
        //     scaleFactor = 1;
        //     scaleLabel = "$";
        // }
        // return d.schoolExpenditure / scaleFactor;
        return d.schoolExpenditure;
    });

    if (dataMax > 1000000) {
        scaleFactor = 1000000;
        scaleLabel = "M$";
    } else if ((dataMax < 1000000) && (dataMax > 1000)) {
        scaleFactor = 1000;
        scaleLabel = "K$";
    } else {
        scaleFactor = 1;
        scaleLabel = "$";
    }
    console.log("  dataMax: ", dataMax);
    console.log("  scaleFactor: ", scaleFactor);

    // ======= scale mapping (data to display) =======
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, chartW], 0.1)
        .domain(schoolDataArray.map(function(d) {
            subNames = d.schoolName.split(" ");
            shortName = subNames[0];
            d.schoolName = shortName;
            return d.schoolName;;
        }));

    var yScale = d3.scale.linear()
        .domain([0, d3.max(schoolDataArray, function(d) {
            // return +d.schoolExpenditure / scaleFactor;
            return +d.schoolExpenditure;
        })])
        .range([chartH, 0]);

    // ======= scale label formating =======
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    // ======= build svg objects =======
    $("#chart").empty();
    var svg = d3.select("#chart").append("svg")
        .attr("width", chartW + (chartPadding.left + chartPadding.right))
        .attr("height", chartH + (chartPadding.top + chartPadding.bottom))
        .append("g")
            .attr("transform", "translate(" + chartPadding.left + "," + chartPadding.top + ")");

    // ======= X scale =======
    svg.append("g")
        .data(schoolDataArray)
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + chartH + ")")
        .call(xAxis)
        .selectAll("text")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" )
            .style("text-anchor", "end")
            .style("font-size", "10px");

    // ======= Y scale =======
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
            // .attr("dx", "-.8em")
            // .attr("dy", ".15em")
            .style("text-anchor", "end")
            .style("font-size", "10px");

        // .append("text")
        //     .attr("y", -30)
        //     .attr("x", 30)
        //     .attr("dy", ".71em")
        //     .style("font-size", "10px")
        //     .style("text-anchor", "start");

    // ======= rects for bar graph =======
    var counter = 0;
    var multiplier = 0;
    var colorIndex = 0;
    svg.selectAll(".bar")
        .data(schoolDataArray)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                console.log("  d.schoolName: ", d.schoolName);
                return xScale(d.schoolName);
            })
            .attr("width", xScale.rangeBand() - 2)
            .attr("y", function(d) {
                return yScale(d.schoolExpenditure);
            })
            .attr("height", function(d) {
                console.log("  d.schoolExpenditure: ", d.schoolExpenditure);
                    return chartH - yScale(d.schoolExpenditure);
                })
            .style({'fill': function(d, i) {
                    counter++;
                    if (counter == fillColors.length) {
                        multiplier++;
                        counter = 0
                    }
                    colorIndex = i - (fillColors.length * multiplier);
                    whichColor = fillColors[colorIndex];
                    return whichColor;
                }})
            .style("font-size", "10px");


    // ======= stringToInt =======
    function stringToInt(d) {
        // console.log("stringToInt");
        d.value = +d.value;
        return d;
    }
}




// ======= ======= ======= initHorizontalChart ======= ======= =======
function initHorizontalChart(schoolName, schoolDataArray) {
    console.log("initHorizontalChart");

    // ======= chart formatting =======
    var chartPadding = {top: 5, right: 20, bottom: 80, left: 50},
        chartW = 280 - chartPadding.left - chartPadding.right,       // outer width of chart
        chartH = 260 - chartPadding.top - chartPadding.bottom;      // outer height of chart

    var dataH = d3.max(schoolDataArray, function(d) {
        return d.value;
    });

    var dataMax = d3.max(schoolDataArray, function(d) {
        return d.value;
    })

    // ======= scale mapping (data to display) =======
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, chartW], .1)
        .domain(schoolDataArray.map(function(d) {
            return d.key;;
        }));

    var yScale = d3.scale.linear()
        .domain([0, d3.max(schoolDataArray, function(d) {
            return +d.value;
        })])
        .range([chartH, 0]);

    // ======= scale label formating =======
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    // ======= build svg objects =======
    $("#chart").empty();
    var svg = d3.select("#chart").append("svg")
        .attr("width", chartW + (chartPadding.left + chartPadding.right))
        .attr("height", chartH + (chartPadding.top + chartPadding.bottom))
        .append("g")
            .attr("transform", "translate(" + chartPadding.left + "," + chartPadding.top + ")");

    // ======= X scale =======
    svg.append("g")
        .data(schoolDataArray)
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + chartH + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );

    // ======= Y scale =======
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("y", -30)
            .attr("x", 30)
            .attr("dy", ".71em")
            .style("font-size", "10px")
            .style("text-anchor", "start");

    // ======= rects for bar graph =======
    svg.selectAll(".bar")
        .data(schoolDataArray)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.key); })
            .attr("width", xScale.rangeBand() - 20)
            .attr("y", function(d) { return yScale(d.value); })
            .attr("height", function(d) {
                    return chartH - yScale(d.value);
                })
            .style({'fill': function(d, i) {
                    whichColor = 'rebeccapurple';
                    return whichColor;
                }})
            .style("font-size", "10px");


    // ======= stringToInt =======
    function stringToInt(d) {
        // console.log("stringToInt");
        d.value = +d.value;
        return d;
    }
}
