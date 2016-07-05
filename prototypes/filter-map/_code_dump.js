

    // var y = d3.scale.ordinal()
    //     .domain(data.map(function(d) { return d.name; }))
    //     .rangeRoundBands([0, height], .2);
    //
    // svg.selectAll(".bar")
    //     .data(data)
    //   .enter().append("rect")
    //     .attr("class", "bar")
    //     .attr("x", function(d) { return x(Math.min(0, d.value)); })
    //     .attr("y", function(d) { return y(d.name); })
    //     .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
    //     .attr("height", y.rangeBand());



    // ======= ======= ======= d3 SCALE ======= ======= =======
    // ======= ======= ======= d3 SCALE ======= ======= =======
    // ======= ======= ======= d3 SCALE ======= ======= =======

    var margin = {top: 20, right: 30, bottom: 40, left: 30},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);
    // var x = d3.scale.linear()
    //     .domain(d3.extent(data, function(d) { return d.value; }))
    //     .range([0, width]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.1);
    // var y = d3.scale.ordinal()
    //     .domain(data.map(function(d) { return d.name; }))
    //     .rangeRoundBands([0, height], .2);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(0)
        .tickPadding(6);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data.tsv", type, function(error, data) {
        x.domain(d3.extent(data, function(d) { return d.value; })).nice();
        y.domain(data.map(function(d) { return d.name; }));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
        .attr("x", function(d) { return x(Math.min(0, d.value)); })
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
        .attr("height", y.rangeBand());

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ",0)")
        .call(yAxis);
        });

    function type(d) {
        d.value = +d.value;
        return d;
    }








// ======= bar graph =======
svg.selectAll(".databar")
    .data(circleValuesArray)
    .enter()
        .append("rect")
        .attr("id", (function(d) {
            barId = "dataChartValue_" + d[1];
            return barId;
        }))
        .attr("class", "dataChartValue")
        .attr("x", function(d, i) {
            return schoolCircleX + (i * 25);
        })
        .attr("y", function(d) {
            // var nextZoneValue = filterExpendData(displayObj, zonesCollectionObj, i);
            var nextZoneValue = d[0];
            if (isNaN(nextZoneValue)) {
                nextZoneValue = 0;
            }
            return yScale(nextZoneValue);
        })
        .attr("width", barW)
        .attr("height", function(d) {
            // barH = filterExpendData(displayObj, zonesCollectionObj, i);
            var barH = d[0];
            return barH;
        })
        .style('fill', function(d){
            // var nextZoneValue = filterExpendData(displayObj, zonesCollectionObj, i);
            var nextZoneValue = d[0];
            colorIndex = assignChartColors(nextZoneValue);
            whichColor = dataColorsArray[colorIndex];
            console.log("whichColor:", whichColor);
            return whichColor;
        });

// ======= circle labels =======
svg.selectAll(".text")
    .data(aggregatorArray)
    .enter()
        .append("text")
            .attr("id", (function(d, i) {
                // labelId = "dataChartLabel_" + d.featureIndex;
                var featureIndex = circleValuesArray[i][1];
                labelId = "dataChartLabel_" + featureIndex;
                console.log("featureIndex:", featureIndex);
                console.log("circleValuesArray[i][0]:", circleValuesArray[i][0]);
                return labelId;
            }))
            .attr("class", "dataChartLabel")
            .text(function(d, i) {
                // formattedNumber = numberWithCommas(circleValuesArray[d.featureIndex]);
                var featureIndex = circleValuesArray[i][1];
                var nextValue = circleValuesArray[featureIndex][0];
                // formattedNumber = numberWithCommas(circleValuesArray[circleValuesArray[i][1]][0]);
                formattedNumber = numberWithCommas(nextValue);
                console.log("formattedNumber:", formattedNumber);
                // var checkWard = d.zoneName.indexOf("Ward ");
                var checkWard = featureIndex;
                if (checkWard > -1) {
                    var wardName = d.zoneName.replace(" ", "-");
                    labelString = wardName + " " + agencyText + schoolText + "$" + formattedNumber + " " + mathText;
                } else {
                    labelString = d.zoneName + " " + agencyText + schoolText + "$" + formattedNumber + " " + mathText;
                }
                return labelString;
            })
            .attr("x", function(d, i) {
                var featureIndex = circleValuesArray[i][1];
                var labelOffsetX = schoolCircleX  + (featureIndex * 25) + 10;
                console.log("labelOffsetX:", labelOffsetX);
                return labelOffsetX;
            })
            .attr("y", function(d, i) {
                var featureIndex = circleValuesArray[i][1];
                console.log("featureIndex:", featureIndex);
                return yScale(circleValuesArray[featureIndex][0]) - 20;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("visibility", "hidden")
            .call(insertLabelText);

activateChartCircles(labelTitleArray, labelSubtitleArray);
activateMessageHide();
activateSubmenu();



// ======= ======= ======= expendMathFilters ======= ======= =======
function expendMathFilters(nextSchool) {
    // console.log("expendMathFilters");
    // expend: MajorExp9815, spendPlanned, spendLifetime
    // math: spendAmount, spendEnroll, spendSqFt

    // == check expend (past/future/total) and math (amount/perEnroll/perSqft) filter matches
    var expendMatch = false;
    var mathMatch = false;

    // == past
    if (displayObj.dataFilters.expend == "MajorExp9815") {
        if (nextSchool.MajorExp9815 != "NA") {
            expendMatch = true;

            // == expenditure per student (max capacity) or per sqft
            if (displayObj.dataFilters.math) {
                if (displayObj.dataFilters.math == "spendEnroll") {
                    if ((nextSchool.maxOccupancy != "NA") && (nextSchool.Open_Now > 0)) {
                    // if (nextSchool.maxOccupancy != "NA") {
                        mathMatch = true;
                    }
                } else if (displayObj.dataFilters.math == "spendSqFt") {
                    if ((nextSchool.totalSQFT != "NA") && (nextSchool.Open_Now > 0)) {
                    // if (nextSchool.totalSQFT != "NA") {
                        console.log("  nextSchool.schoolName: ", nextSchool.schoolName);
                        mathMatch = true;
                    }
                } else {
                    mathMatch = true;
                }
            } else {
                mathMatch = true;
            }
        }

    // == future
    } else if (displayObj.dataFilters.expend == "spendPlanned") {
        if (nextSchool.TotalAllotandPlan1621 != "NA") {
            expendMatch = true;

            // == expenditure per student (max capacity) or per sqft
            if (displayObj.dataFilters.math) {
                if (displayObj.dataFilters.math == "spendEnroll") {
                    if ((nextSchool.maxOccupancy != "NA") && (nextSchool.Open_Now > 0)) {
                    // if (nextSchool.maxOccupancy != "NA") {
                        mathMatch = true;
                    }
                } else if (displayObj.dataFilters.math == "spendSqFt") {
                    if ((nextSchool.totalSQFT != "NA") && (nextSchool.Open_Now > 0)) {
                    // if (nextSchool.totalSQFT != "NA") {
                        mathMatch = true;
                    }
                } else {
                    mathMatch = true;
                }
            } else {
                mathMatch = true;
            }
        }

    // == total
    } else if (displayObj.dataFilters.expend == "spendLifetime") {
        if (nextSchool.LifetimeBudget != "NA") {
            expendMatch = true;

            // == expenditure per student (max capacity) or per sqft
            if (displayObj.dataFilters.math) {
                if (displayObj.dataFilters.math == "spendEnroll") {
                    if ((nextSchool.maxOccupancy != "NA") && (nextSchool.Open_Now > 0)) {
                    // if (nextSchool.maxOccupancy != "NA") {
                        mathMatch = true;
                    }
                } else if (displayObj.dataFilters.math == "spendSqFt") {
                    if ((nextSchool.totalSQFT != "NA") && (nextSchool.Open_Now > 0)) {
                    // if (nextSchool.totalSQFT != "NA") {
                        mathMatch = true;
                    }
                } else {
                    mathMatch = true;
                }
            } else {
                mathMatch = true;
            }
        }
    }

    // == return match result
    if ((expendMatch == true) && (mathMatch == true)) {
        return true;
    } else {
        return false;
    }
}





var zoneDataObject, dataCheckString;

// == create array and calculate average, perEnroll and perSqft values
var dataCheckString = "";
var aggregatorArray = _.map(zoneTotalsObject, function(value, key){
    zoneDataObject = {
        featureIndex:value.featureIndex,
        zoneName:value.zoneName,
        schoolCount:value.schoolCount,
        SqFtPerEnroll:value.SqFtPerEnroll,

        zoneAmount:value.zoneAmount,
        amountMin:value.amountMin,
        amountMax:value.amountMax,
        amountAvg:parseInt(value.zoneAmount/value.schoolCount),
        amountMed:value.amountMed,

        zonePastPerEnroll:parseInt(value.zonePastPerEnroll/value.schoolCount),
        zoneFuturePerEnroll:parseInt(value.zoneFuturePerEnroll/value.schoolCount),
        zoneTotalPerEnroll:parseInt(value.zoneTotalPerEnroll/value.schoolCount),
        zoneEnroll:value.zoneEnroll,
        enrollMin:value.enrollMin,
        enrollMax:value.enrollMax,
        enrollAvg:parseInt(value.zoneEnroll/value.schoolCount),
        enrollMed:value.enrollMed,
        expendPerEnroll:value.expendPerEnroll,

        zonePastPerSqft:parseInt(value.zonePastPerSqft/value.schoolCount),
        zoneFuturePerSqft:parseInt(value.zoneFuturePerSqft/value.schoolCount),
        zoneTotalPerSqft:parseInt(value.zoneTotalPerSqft/value.schoolCount),
        zoneSqft:value.zoneSqft,
        sqftMin:value.sqftMin,
        sqftMax:value.sqftMax,
        sqftAvg:parseInt(value.zoneSqft/value.schoolCount),
        sqftMed:value.sqftMed,
        expendPerSqft:value.expendPerSqft
    }

    return zoneDataObject;
    // dataCheckString += printTESTdata(zoneDataObject, value, dataCheckString);
});
// == Dollar Amount
// dataCheckString += value.zoneName + ": " + value.zoneAmount + "\n";
// console.log(key, " zoneAmount: ", value.zoneAmount);

// == Enroll
// dataCheckString += value.zoneName + ": " + value.zoneAmount + ": " + value.zoneEnroll + ": " + zoneDataObject.expendPerEnroll + "\n";
dataCheckString += value.zoneName + ": " + value.zoneEnroll + "\n";

// == Sqft
// dataCheckString += value.zoneName + ": " + value.zoneAmount + ": " + value.zoneSqft + ": " + zoneDataObject.expendPerSqft + "\n";
dataCheckString += value.zoneName + ": " + value.zoneSqft + "\n";

// dataCheckString += value.zoneName + ": " + value.zoneEnroll + ": " + value.expendPerEnroll + ": " + "\n";
// dataCheckString += value.zoneName + ": " + value.zoneEnroll + "\n";
// dataCheckString += value.zoneName + ": " + value.zoneSqft + value.expendPerSqft + ": " + "\n";
// dataCheckString += value.zoneName + ": " + value.zoneSqft + "\n";

// == Dollar Amount
// dataCheckString += value.zoneName + ": " + value.zoneAmount + "\n";

// == Enroll
// dataCheckString += value.zoneName + ": " + value.schoolCount + ": " +
// parseInt(value.zonePastPerEnroll/value.schoolCount) + ": " +
// parseInt(value.zoneFuturePerEnroll/value.schoolCount) + ": " +
// parseInt(value.zoneTotalPerEnroll/value.schoolCount) + "\n";

// == Sqft
// dataCheckString += value.zoneName + ": " + value.schoolCount + ": " +
// parseInt(value.zonePastPerSqft/value.schoolCount) + ": " +
// parseInt(value.zoneFuturePerSqft/value.schoolCount) + ": " +
// parseInt(value.zoneTotalPerSqft/value.schoolCount) + "\n";

// console.log(key, " value: ", value);
// console.log(key, ":", value.zoneAmount);
// console.log(key, " zoneDataObject: ", zoneDataObject);
// console.log(key, " featureIndex: ", value.featureIndex);
// console.log(key, "*** zoneName: ", value.zoneName);
// console.log(key, " schoolCount: ", value.schoolCount);
// console.log(key, " SqFtPerEnroll: ", value.SqFtPerEnroll);
// console.log(key, " zoneAmount: ", value.zoneAmount);
// console.log(key, " amountMin: ", value.amountMin);
// console.log(key, " amountMax: ", value.amountMax);
// console.log(key, " amountAvg: ", value.amountAvg);
// console.log(key, " amountMed: ", value.amountMed);
// console.log(key, " zonePastPerEnroll: " value.zonePastPerEnroll);
// console.log(key, " zoneFuturePerEnroll: ", value.zoneFuturePerEnroll);
// console.log(key, " zoneTotalPerEnroll: ", value.zoneTotalPerEnroll);
// console.log(key, " zoneEnroll: ", value.zoneEnroll);
// console.log(key, " enrollMin: ", value.enrollMin);
// console.log(key, " enrollMax: ", value.enrollMax);
// console.log(key, " enrollAvg: ", value.enrollAvg);
// console.log(key, " enrollMed: ", value.enrollMed);
// console.log(key, " zonePastPerSqft: ", value.zonePastPerSqft);
// console.log(key, " zoneFuturePerSqft: ", value.zoneFuturePerSqft);
// console.log(key, " zoneTotalPerSqft: ", value.zoneTotalPerSqft);
// console.log(key, " zoneSqft: ", value.zoneSqft);
// console.log(key, " sqftMin: ", value.sqftMin);
// console.log(key, " sqftMax: ", value.sqftMax);
// console.log(key, " sqftAvg: ", value.sqftAvg);
// console.log(key, " sqftMed: ", value.sqftMed);

console.log("dataCheckString: ", dataCheckString);
console.log(dataCheckString);
return aggregatorArray;
}

// ======= ======= ======= printTESTdata ======= ======= =======
function printTESTdata(zoneDataObject, value, dataCheckString) {
console.log("printTESTdata");

if (dataCheckString == "") {
    dataCheckString += "zone  amount  enrollORsqft  amount per... \n"
} else {
    // == Dollar Amount
    // dataCheckString += value.zoneName + ": " + value.zoneAmount + "\n";

    // == Enroll
    // dataCheckString += value.zoneName + ": " +
    // value.zoneAmount + ": " +
    // value.zoneEnroll + ": " +
    // zoneDataObject.expendPerEnroll + "\n";

    // == Sqft
    dataCheckString += value.zoneName + ": " +
    value.zoneAmount + ": " +
    value.zoneSqft +     ": " +
    zoneDataObject.expendPerSqft + "\n";
    // console.log("  dataCheckString: ", dataCheckString);

    // console.log(key, " value: ", value);
    // console.log(key, ":", value.zoneAmount);
    // console.log(key, " zoneDataObject: ", zoneDataObject);
    //
    // console.log(key, " featureIndex: ", value.featureIndex);
    // console.log(key, "*** zoneName: ", value.zoneName);
    // console.log(key, " schoolCount: ", value.schoolCount);
    // console.log(key, " SqFtPerEnroll: ", value.SqFtPerEnroll);
    // console.log(key, " zoneAmount: ", value.zoneAmount);
    // console.log(key, " amountMin: ", value.amountMin);
    // console.log(key, " amountMax: ", value.amountMax);
    // console.log(key, " amountAvg: ", value.amountAvg);
    // console.log(key, " amountMed: ", value.amountMed);
    // console.log(key, " zonePastPerEnroll: " value.zonePastPerEnroll);
    // console.log(key, " zoneFuturePerEnroll: ", value.zoneFuturePerEnroll);
    // console.log(key, " zoneTotalPerEnroll: ", value.zoneTotalPerEnroll);
    // console.log(key, " zoneEnroll: ", value.zoneEnroll);
    // console.log(key, " enrollMin: ", value.enrollMin);
    // console.log(key, " enrollMax: ", value.enrollMax);
    // console.log(key, " enrollAvg: ", value.enrollAvg);
    // console.log(key, " enrollMed: ", value.enrollMed);
    // console.log(key, " zonePastPerSqft: ", value.zonePastPerSqft);
    // console.log(key, " zoneFuturePerSqft: ", value.zoneFuturePerSqft);
    // console.log(key, " zoneTotalPerSqft: ", value.zoneTotalPerSqft);
    // console.log(key, " zoneSqft: ", value.zoneSqft);
    // console.log(key, " sqftMin: ", value.sqftMin);
    // console.log(key, " sqftMax: ", value.sqftMax);
    // console.log(key, " sqftAvg: ", value.sqftAvg);
    // console.log(key, " sqftMed: ", value.sqftMed);

    // dataCheckString += value.zoneName + ": " + value.schoolCount + ": " +
    // parseInt(value.zonePastPerEnroll/value.schoolCount) + ": " +
    // parseInt(value.zoneFuturePerEnroll/value.schoolCount) + ": " +
    // parseInt(value.zoneTotalPerEnroll/value.schoolCount) + "\n";

    // dataCheckString += value.zoneName + ": " + value.schoolCount + ": " +
    // parseInt(value.zonePastPerSqft/value.schoolCount) + ": " +
    // parseInt(value.zoneFuturePerSqft/value.schoolCount) + ": " +
    // parseInt(value.zoneTotalPerSqft/value.schoolCount) + "\n";
}
return dataCheckString;
}
