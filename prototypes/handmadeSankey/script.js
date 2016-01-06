// UTILITY SELECTION FUNCTION
var $ = function(sel){return document.querySelector(sel);},
  asMoney = d3.format('$,.2f'),
  scaler = d3.scale.linear().domain([1, 1000]).rangeRound([1, 10]),
  csvData;

function moveToRightEdge(el){
  var bounds =  el.getBoundingClientRect();
  return bounds.right - bounds.left;
}

// **************************************
// SVG SETUP
// **************************************

var sizes = {
    h: 2500,
    w: 700,
    p: 10,
    multiplier: 3
  },
  rectProperties = {
    width: 15,
    color: 'green'
  }

  lineFor = {
    elementarySchool: 200,
    middleSchool: 300,
    highSchool: 400
  };

var svg = d3.select('#chart')
    .append('svg')
    .attr('height', sizes.h)
    .attr('width', sizes.w)
    .attr('class', 'svgChart')
    ;

// **************************************
// AJAX CALL FOR CSV
// **************************************

d3.csv('DCPS-schools-types_onlyESMSHS.csv', function(data){
  csvData = data;
// **************************************
//  console.log(typeof data.FakeExpend);
//  console.log(typeof data); // object
//  console.log(Array.isArray(data)); // true
//  console.log(csvData) // returns data
// **************************************
  


  // **************************************
  // SCALES
  // **************************************
  var maxExpend = d3.max(csvData, function(d){ return d.FakeExpend; }),
      minExpend = d3.min(csvData, function(d){ return d.FakeExpend; });

  var rectStrokeForSchoolExpend = d3.scale.linear()
      .domain([minExpend, maxExpend])
      .rangeRound([5,20])
      ;

  // Returns the sum off all FakeExpends
  function getTotalExpenditure(){
    var totalExpenditures = 0,
      i = 0,
      j = data.length;
    for(; i < j; i++){
      totalExpenditures += parseInt(data[i].FakeExpend);
    }

    return totalExpenditures;
  }
 
 // **************************************
 // Build rectangle
 // **************************************
  var rect = svg.append('rect')
    .attr('class', 'genFundsRect')
    .attr('width', rectProperties.width)
    .attr('height', sizes.h)
    .style('fill', rectProperties.color);


  // **************************************
  // Build lines for different schools
  // **************************************
  var lines = svg.append('g')
    .attr('class', 'groupLines')
    .selectAll('line')
    .data(data)
    .enter()
    .append('line');

  lines.attr('class', 'linkLine')
    .attr({
      x1: function(){
            return moveToRightEdge($('.genFundsRect'));
          },
      y1: function(d, i){
            // return i * (sizes.h / data.length) + sizes.p;},
            return rectStrokeForSchoolExpend(maxExpend) * i},
      x2: function(d){
            if(d.SchoolType === 'ES'){
              return lineFor.elementarySchool;
            } else if(d.SchoolType === 'MS'){
              return lineFor.middleSchool;
            } else if(d.SchoolType === 'HS'){
              return lineFor.highSchool;
            } else {
              return 75;
            }
          },
      y2: function(d, i){
            return rectStrokeForSchoolExpend(maxExpend) * i},
      stroke: function(d){
                // var colorByWard = ['orange', 'crimson', 'blue', 
                //   'dodgerblue', 'coral', 'hotpink', 
                //   'greenyellow', 'orchid' ],

                // ward = parseInt(d.Ward);
                // return colorByWard[ward - 1];
                return '#D0D0D0';
              }
    });

  lines.style('stroke-width', function(d){
    return rectStrokeForSchoolExpend(d.FakeExpend);
  });

  lines.append('title').text(function(d){ return d.School + ': ' + asMoney(d.FakeExpend); })

  
  // **************************************
  // Build rect for individual schools
  // **************************************

  var rectsForIndividualSchool = svg.append('g').attr('class', 'individualSchoolRects').selectAll('rect')
    .data(data)
    .enter()
    .append('rect');

  rectsForIndividualSchool
    .attr({
      class: 'rectsForIndividualSchools',
      width: rectProperties.width,
      height: function(d){ 
                return rectStrokeForSchoolExpend(d.FakeExpend);
              },
      fill: rectProperties.color,
      x: function(d){
          if(d.SchoolType === 'ES'){
            return lineFor.elementarySchool;
          } else if(d.SchoolType === 'MS'){
            return lineFor.middleSchool;
          } else if(d.SchoolType === 'HS'){
            return lineFor.highSchool;
          } else {
            return 75;
          };
        },
      y: function(d,i){
        return rectStrokeForSchoolExpend(maxExpend) * i;}
    });


});



