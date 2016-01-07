//'use strict';

// UTILITY SELECTION FUNCTION
var $ = function(sel){return document.querySelector(sel);},
  asMoney = d3.format('$,.2f'),
  scaler = d3.scale.linear().domain([1, 1000]).rangeRound([1, 10]),
  csvData,
  wardData;

function getRightEdge(el){
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
  },

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
  csvData = data,
  csvSortedByWard = csvData.sort(function(a,b){return a.Ward - b.Ward;});
// **************************************
//  console.log(typeof data.FakeExpend);
//  console.log(typeof data); // object
//  console.log(Array.isArray(data)); // true
//  console.log(csvData) // returns data
// **************************************

  wardData = [
    getExpenditureByWard(1),
    getExpenditureByWard(2),
    getExpenditureByWard(3),
    getExpenditureByWard(4),
    getExpenditureByWard(5),
    getExpenditureByWard(6),
    getExpenditureByWard(7),
    getExpenditureByWard(8)
  ];

  function getExpenditureByWard(ward){
    var i = 0,
        j = csvData.length,
        wardTotal = 0,
        enteredWard = parseInt(ward);

    for(; i < j; i++){
      if(parseInt(csvData[i].Ward) === enteredWard){
        wardTotal += parseInt(csvData[i].FakeExpend);
      }
    }

    return wardTotal;
  };

  // **************************************
  // SCALES
  // **************************************
  var maxExpend = d3.max(csvData, function(d){ return d.FakeExpend; }),
      minExpend = d3.min(csvData, function(d){ return d.FakeExpend; });

  var rectStrokeForSchoolExpend = d3.scale.linear()
      .domain([minExpend, maxExpend])
      .rangeRound([5,20])
      ;

  var wardScales = d3.scale.linear()
      .domain([])
      .rangeRound([])
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
  // Build paths towards wards
  // **************************************

  var rectsTowardsWards = svg.append('g').attr('class', 'rectsTowardsWards').selectAll('rect')
    .data(wardData)
    .enter()
    .append('rect')
    .attr({
      width: 200,
      height: function(d){ return rectStrokeForSchoolExpend(d); },
      x: getRightEdge($('.genFundsRect')),
      y: function(d,i){
        return i * 200;
      }
    })
    .style('fill', 'lightgrey')
    ;

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
            return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect'));
          },
      y1: function(d,i){
            // return i * (sizes.h / data.length) + sizes.p;},
            return rectStrokeForSchoolExpend(maxExpend) * i},
      x2: function(d){
            if(d.SchoolType === 'ES'){
              return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect')) + lineFor.elementarySchool;
            } else if(d.SchoolType === 'MS'){
              return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect')) + lineFor.middleSchool;
            } else if(d.SchoolType === 'HS'){
              return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect')) + lineFor.highSchool;
            } else {
              return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect')) + 75;
            }
          },
      y2: function(d,i){
            return rectStrokeForSchoolExpend(maxExpend) * i},
      stroke: function(d){
                var colorByWard = ['orange', 'crimson', 'tomato', 
                  'dodgerblue', 'steelblue', 'hotpink', 
                  'red', 'orchid' ],

                ward = parseInt(d.Ward);
                return colorByWard[ward - 1];
                //return '#D1D1D1';
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
              return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect')) + lineFor.elementarySchool;
            } else if(d.SchoolType === 'MS'){
              return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect')) + lineFor.middleSchool;
            } else if(d.SchoolType === 'HS'){
              return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect')) + lineFor.highSchool;
            } else {
              return getRightEdge($('.rectsTowardsWards')) + getRightEdge($('.genFundsRect')) + 75;
            }
          },
      y: function(d,i){
        return rectStrokeForSchoolExpend(maxExpend) * i;
      }
    });


});
