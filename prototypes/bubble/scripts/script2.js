'use strict';

// CUSTOM
var $ = function(sel){return document.querySelector(sel);},
    $_all = function(sel){return document.querySelectorAll(sel);},
    asMoney = d3.format('$,')
    ;

// function Bubble(dataset){
    // $('#title').innerText = dataset;

d3.csv('data/data_master.csv', function (error, data) {
// d3.csv('data/DC_Bubbles_Master_214.csv', function (error, data) {
    //*******************************************************
    // Setup SVG
    //*******************************************************
    var width = 1200,
        height = 800;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    //*******************************************************
    // Scales
    //*******************************************************
        //Past
    var minExpendPast = d3.min(data, function(d){ return +(d.MajorExp9815); }),
        maxExpendPast = d3.max(data, function(d){ return +(d.MajorExp9815); }),
        toScalePast = d3.scale.linear().domain([minExpendPast, maxExpendPast]).rangeRound([5, 25]),
        // Lifetime
        minExpendLife = d3.min(data, function(d){ return +(d.LifetimeBudget); }),
        maxExpendLife = d3.max(data, function(d){ return +(d.LifetimeBudget); }),
        toScaleLife = d3.scale.linear().domain([minExpendPast, maxExpendPast]).rangeRound([5, 25]),
        // Future
        minExpendFuture = d3.min(data, function(d){ return +(d.TotalAllotandPlan1621); }),
        maxExpendFuture = d3.max(data, function(d){ return +(d.TotalAllotandPlan1621); }),
        toScaleFuture = d3.scale.linear().domain([minExpendFuture, maxExpendFuture]).rangeRound([5, 25]);

    for (var j = 0; j < data.length; j++) {
        data[j].radius = 10;
        data[j].x = Math.random() * (width);
        data[j].y = Math.random() * (height);
    }
    var padding = 10,
        maxRadius = d3.max(_.pluck(data, 'radius')),
        padding_between_nodes = .05;

    //*******************************************************
    // Setup CIRCLES
    //*******************************************************
    // creates circles and puts them in the starting position
    var nodes = svg.selectAll("circle")
      .data(data)  
      .enter().append("circle")
      .attr("class", "node")
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .attr("r", 2)
      .style({
        'fill': function (d) { return getColor(d.MajorExp9815, 'past');},
        'stroke': 'black',
        'stroke-width': 1,
        'opacity': 0.8
      })


        //*******************************************************
        // Circles: mousenter
        //*******************************************************
      .on('mouseenter', function(d){

        // GET THE X/Y COOD OF OBJECT
        var tooltipPadding = 30,
            xPosition = d3.select(this)[0][0]['cx'].animVal.value - tooltipPadding,
            yPosition = d3.select(this)[0][0]['cy'].animVal.value - tooltipPadding;
        
        // TOOLTIP INFO
        d3.select('#school').text('School: ' + camel(d.School));
        d3.select('#agency').text('Agency: ' + d.Agency);
        d3.select('#ward').text('Ward: ' + d.Ward);
        if(d.ProjectType && d.ProjectType !== 'NA'){
            d3.select('#project').text('Project: ' + d.ProjectType);
        } else {
            d3.select('#project').text('');
        }
        if(d.YrComplete && d.YrComplete !== 'NA'){
            d3.select('#yearComplete').text('Year Completed: ' + d.YrComplete);
        } else {
            d3.select('#yearComplete').text('');
        }
        d3.select('#majorexp').text('Total Spent: ' + asMoney(d.MajorExp9815));
        d3.select('#spent_sqft').text('Spent per Sq.Ft.: ' + asMoney(d.SpentPerSqFt) + '/sq. ft.');
        d3.select('#expPast').text('Spent per Maximum Occupancy: ' + asMoney(d.SpentPerMaxOccupancy));
        if(d.FeederHS && d.FeederHS !== "NA"){
            d3.select('#hs').text('High School: ' + d.FeederHS);
        } else {
            d3.select('#hs').text('');
        }
        
        // d3.select(this)[0][0].style.fill = 'gray';
        d3.select(this).classed('color', true);
      })

        //*******************************************************
        // Circles: mousenter
        //*******************************************************
      .on('mouseleave', function(){
        d3.select(this).classed('color', false);

      })
      ;

    nodes
        .transition()
        .duration(10000)
        .attr('r', function(d){
            if(+d.MajorExp9815 && d.MajorExp9815 !== 'NA'){
                return toScalePast(+d.MajorExp9815)
            } else {
                return '3';
            }
        })
        ;

    var force = d3.layout.force().gravity(50);

    //*******************************************************
    // Set initial state of graph
    //*******************************************************    
    draw('Agency');


    //*******************************************************
    // Add interactivity to Subdivider Buttons
    //*******************************************************
    var btns = Array.prototype.slice.call($_all('.btn'));
    console.log(btns);

    btns.forEach(function(item, e){
        item.addEventListener('click', function(e){
            draw(e.target.id);
        });
    });

    //*******************************************************
    // Changing datasets
    //*******************************************************
    d3.select('#future')
        .on('click', function(d){
            nodes
            .transition()
            .duration(1000)
            .attr('r', function(d){
                if(+d.TotalAllotandPlan1621 && d.TotalAllotandPlan1621 !== 'NA'){
                    return toScaleFuture(+d.TotalAllotandPlan1621)
                } else {
                    return '3';
                }
            })
            .style({
                'fill': function (d) { return getColor(d.TotalAllotandPlan1621, 'future');},
                'stroke': 'black',
                'stroke-width': 1,
                'opacity': 0.8
            });

            $('#budget_state').innerText = 'Planned Expenditures for 2016 - 2021';
        })
    ;
    d3.select('#past')
        .on('click', function(d){
            nodes
            .transition()
            .duration(1000)
            .attr('r', function(d){
                if(+d.MajorExp9815 && d.MajorExp9815 !== 'NA'){
                    return toScalePast(+d.MajorExp9815)
                } else {
                    return '3';
                }
            })
            .style({
                'fill': function (d) { return getColor(d.MajorExp9815, 'past');},
                'stroke': 'black',
                'stroke-width': 1,
                'opacity': 0.8
            });

            $('#budget_state').innerText = 'Expenditures from 1985 - 2015';
        })
    ;
    d3.select('#lifetime')
        .on('click', function(d){
            nodes
            .transition()
            .duration(1000)
            .attr('r', function(d){
                if(+d.LifetimeBudget && d.LifetimeBudget !== 'NA'){
                    return toScaleLife(+d.LifetimeBudget)
                } else {
                    return '3';
                }
            })
            .style({
                'fill': function (d) { return getColor(d.LifetimeBudget, 'total');},
                'stroke': 'black',
                'stroke-width': 1,
                'opacity': 0.8
            });

            $('#budget_state').innerText = 'Lifetime Budget';
        })
    ;

    //****************************************
    // UTILITY FUNCTIONS
    //****************************************
    function draw (varname) {
      var centers = getCenters(varname, [800, 800]);
      force.on("tick", tick(centers, varname));
      labels(centers)
      force.start();
    }    
    
    // Returns an array of UNIQUE objects that have the given column name
    function getCenters(vname, size) {
          var centers, map;
          centers = _.uniq(_.pluck(data, vname)).map(function (d) {
            return {name: d, value: 1};
          });

          map = d3.layout.pack().size(size);
          map.nodes({children: centers});

          return centers;
        };

    function tick (centers, varname) {
      var foci = {};
      for (var i = 0; i < centers.length; i++) {
        foci[centers[i].name] = centers[i];
      }
      // LOOK HERE
      return function (e) {
        for (var i = 0; i < data.length; i++) {
          var o = data[i];
          var f = foci[o[varname]];
          o.y += (f.y - o.y) * e.alpha;
          o.x += (f.x - o.x) * e.alpha;
        }
        nodes.each(collide(padding_between_nodes))
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; });
      }
    }

    function labels (centers) {
      svg.selectAll(".label").remove();

      svg.selectAll(".label")
      .data(centers).enter().append("text")
      .attr("class", "label")
      .text(function (d) { return d.name })
      .attr("transform", function (d) {
        return "translate(" + (d.x - ((d.name.length)*3)) + ", " + (d.y - d.r) + ")";
      });
    }

    function collide(alpha) {
      var quadtree = d3.geom.quadtree(data);
      return function(d) {
        var r = d.radius + maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }

    function getColor(the_data, set){
        // if(set)
        var value = the_data,
            bands = {
                MajorExp9815: {
                    one: 10000000,
                    two: 1000000,
                    three: 0
                },
                TotalAllotandPlan1621: {
                    one: 1000000,
                    two: 500000,
                    three: 0
                },
                LifetimeBudget: {
                    one: 10000000,
                    two: 1000000,
                    three: 0
                }
            };



        if(value > 10000000){ // 10 MILLION
            return '#77cc00';
        } else if(value < 10000000 && value > 1000000){
            return '#779900';
        } else if (value < 1000000 && value > 100000){
            return '#774400';
        } else if (value < 100000 && value > 0){
            return '#771100';
        } else {
            return '#aa0000';
        }
    }

    function camel(str){
      var camelStr = [],
          strSplit = str.split(' '),
          i =0, j = strSplit.length;
      for (; i < j; i++){
        var splitWord = strSplit[i].split('');
        for(var m = 0, n = splitWord.length; m<n; m++){
          var letter = splitWord[0],
              upperLetter = letter.toUpperCase();
          splitWord.shift();
          splitWord.unshift(upperLetter);
        }
        camelStr.push(splitWord.join(''));
      }
      
      return camelStr.join(' ');
    }
});
// }

// School
// Agency
// Ward
// ProjectType   (Project)
// YrComplete (IF NA then = blank)  Yr
// MajorExp9815  (Total Spent)
// SpentPerSqFt  (Spent per SqFt)
// SpentPerMaxOccupancy (Spent per Capacity)
// FeederHS (IF Level is = to ES, MS, ES/MS, PK3/K THEN feeder = FeederHS) (Feeder HS)

// MajorExp9815
// SpentPerMaxOccupancy
// SpentPerSqFt