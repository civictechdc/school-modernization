'use stric';

function bigChart(selection) {

  var height = 700;
  var width = 600;
  var margin = 20;
  var innerWidth = width - margin;


  // Define offset based on ward
  // xscale    
  var xScale = d3.scale.ordinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .rangeRoundPoints([0, innerWidth])

  var yScale = d3.scale.linear()
    .domain([0, 3000])
    .range([0, 200]);


  var colorScale = d3.scale.linear()
    .domain([0, 1])
    .range(['green', 'red'])

  // TODO Create a color scale based on dollars per student

  function chart() {
    var svg = selection.append('svg')
      .attr('width', width)
      .attr('height', height);

    var innerChart = svg.append('g')
      .attr('class', 'inner-chart')
      .attr('transform', 'translate(' + margin + ',' + margin + ')');

    queue()
      .defer(d3.csv, "DCPS-schools-types.csv")
      .awaitAll(ready);

    function ready(error, results) {
      if (error !== null) {
        console.log(error);
        return
      }

      var schoolRows = results[0]

      layoutCache = []
      for (var i = 0; i < 8; i++) {
        var colObj = {}
        layoutCache.push(colObj);
      }

      function schoolPos(d) {
        if (d.Ward === "NA") {
          return typeOffset(d.Type);
        }

        var colObj = layoutCache[d.Ward-1];
        if (colObj.hasOwnProperty(d.Type)) {
          colObj[d.Type] += 1;
        } else {
          colObj[d.Type] = 1;
        }

        var t = colObj[d.Type];
        return t*25 + typeOffset(d.Type); 
      }

      function typeOffset(typ) {
        switch (typ) {
          case "HS":
            return 0
          case "EC":
            return 100 
          case "MS":
            return 200
          case "ES":
            return 300
          default:
            return 600
        }
      }

      var schools = innerChart.selectAll('.school')
      .data(schoolRows).enter().append('rect')
        .attr('class', 'school')
        .attr('x', function(d){ return xScale(d.Ward);})
        .attr('y', schoolPos)
        .attr('height', 20)//function(d){ return yScale(d.Enrolled);})
        .attr('width', 30)
        .attr('fill', function(d){ return colorScale(d.AtRiskPct);})

      schools.attr('opacity', 0.2)

      schools.on('mouseover', displaySchool)

      schools.on('mouseout', function(_) {
          infoBox.style('opacity', 0);
          infoBox.style('left', -200 + 'px');
          infoBox.style('top', -200 + 'px');
      })

      var infoBox = d3.select(".school-info")
        .style('opacity', 0)

      function displaySchool(d) {
        infoBox.transition()
          .duration(200)
          .style('opacity', 1);

        var x = d3.event.pageX + 30;
        var y = d3.event.pageY - 30;
        
        infoBox.style('left', x + 'px');
        infoBox.style('top', y + 'px');
        var name = d.School.split(' ')[0] + ' ' + d.Type;
        infoBox.select('.name')
          .text(function(){ return name });
        infoBox.select('.num-std')
          .text(function(){ return d.Enrolled});
      }

    }

  }


  return chart;
}
