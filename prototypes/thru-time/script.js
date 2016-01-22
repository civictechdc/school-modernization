

function timeChart(selection) {

    var height = 500;
    var width = 600;
    var margin = 20;
    var innerWidth = width - margin;

    var tScale = d3.time.scale()
      .domain([new Date(2012, 0, 0), new Date(2020, 0, 0)])
      .range([0, width-2*margin])

    var xAxis = d3.svg.axis()
      .scale(tScale)
      .orient('top')
      .ticks(d3.time.years)

    d3.json('all-schools.json', function(err, data) {
        console.log(err)
        update(data);
    })

    function update(allSchools) {
        allSchools.sort(function(a, b) { 
            return a['est_cost'] - b['est_cost'];
        })
        // NOTE cut all Schools in half
        allSchools = allSchools.slice(allSchools.length/2)

        var yScale = d3.scale.linear()
        .domain([0, allSchools.length])
        .range([0, height-(margin*2)])


        var svg = selection.append('svg')
        .attr('width', width)
        .attr('height', height);

        svg.append('g')
          .attr("transform", "translate("+margin+","+margin+")")
          .attr("class", "x axis") 
          .call(xAxis);


        var innerChart = svg.append('g')
        .attr('class', 'inner-chart')
        .attr('transform', 'translate(' + margin + ',' + margin + ')');

        var projects = innerChart.selectAll('.projects').data(allSchools)
        .enter().append('g')
        .attr('class', 'projects')
        .attr('transform', function(d, i) { 
            return 'translate(0,' + yScale(i) + ')';
        })
        .append('circle')
        .attr('r', function(d) {
            return d['est_cost']/10000000;
        })
        .attr('cx', function(d) {
            return tScale(new Date(d['last_year'], 0, 0));
        })
        .attr('fill', function(d) {
            return colorScale(parseInt(d.ward));
        })

        projects.on('mouseover', displaySchool)
        projects.on('mouseout', hideBox)
    }

    function chart() {
    }
    return chart
}

// Input str --> Date
// "FY 2015" --> Date(2015, 0, 0)
function fyToDate(str) {
    y = str.match(/\d+/)[0]
    return new Date(y, 0, 0)
}

function hideBox() {
    infoBox.style('opacity', 0)
      .style('left', -200 + 'px')
      .style('top', -200 + 'px')
}

var infoBox = d3.select(".school-info").style('opacity', 0)

var colorScale = d3.scale.category10()
.domain([1,2,3,4,5,6,7,8])

function displaySchool(d) {
    infoBox.transition()
      .duration(200)
      .style('opacity', 1);

    var x = d3.event.pageX + 30;
    var y = d3.event.pageY - 30;

    infoBox.style('left', x + 'px')
      .style('top', y + 'px')
    infoBox.select('.facility')
      .text(function(){ return d.facility });
    infoBox.select('.est-cost')
      .text(function(){ return d.est_cost});
    infoBox.select('.p-code')
      .text(function(){ return d.project_no});
    infoBox.select('.ward')
      .text(function(){ return d.ward})
      .style('color', function() {
          return colorScale(parseInt(d.ward));
      })
}
