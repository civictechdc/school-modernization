
// ======= ======= ======= makeSchoolsChart ======= ======= =======
// Chart.prototype.makeSchoolsChart = function(schoolDataArray) {
//     console.log("makeSchoolsChart");

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
