
// ======= ======= ======= makeSchoolsChart ======= ======= =======
// Chart.prototype.makeSchoolsChart = function(schoolDataArray) {
//     console.log("makeSchoolsChart");

function makeSchoolsChart(schoolDataArray) {
    console.log("makeSchoolsChart");

    // data: schoolName, schoolCode, schoolType, schoolLevel, schoolExpenditure, schoolSqft, schoolLng, schoolLat, schoolWard

    var chartW, chartH, shortName;
    var myJsonString = JSON.stringify(schoolDataArray);
    var fillColors = ["green", "red", "orange", "purple", "salmon", "blue", "yellow", "tomato", "darkkhaki", "goldenrod", "blueviolet", "chartreuse", "cornflowerblue"];
    // console.log("  myJsonString: ", myJsonString);

    // ======= chart formatting =======
    var chartPadding = {top: 5, right: 20, bottom: 100, left: 80},
        chartW = 700 - chartPadding.left - chartPadding.right,       // outer width of chart
        chartH = 500 - chartPadding.top - chartPadding.bottom;      // outer height of chart

    var dataMax = d3.max(schoolDataArray, function(d) {
        console.log("  d.schoolExpenditure: ", d.schoolExpenditure);
        return d.schoolExpenditure;
    });
    console.log("  dataMax: ", dataMax);

    // ======= scale mapping (data to display) =======
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, chartW], .1)
        .domain(schoolDataArray.map(function(d) {
            // subNames = d.schoolName.split(" ");
            // shortName = subNames[0];
            // console.log("  shortName: ", shortName);
            return d.schoolName;;
        }));

    var yScale = d3.scale.linear()
        .domain([0, d3.max(schoolDataArray, function(d) {
            console.log("  d.schoolExpenditure: ", d.schoolExpenditure);
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
    $("#chartData").empty();
    var svg = d3.select("#chartData").append("svg")
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
            .attr("x", function(d) { return xScale(d.schoolName); })
            .attr("width", xScale.rangeBand() - 5)
            .attr("y", function(d) { return yScale(d.schoolExpenditure); })
            .attr("height", function(d) {
                    return chartH - yScale(d.schoolExpenditure);
                })
            .style({'fill': function(d, i) {
                    whichColor = fillColors[i];
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
    $("#chartData").empty();
    var svg = d3.select("#chartData").append("svg")
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
