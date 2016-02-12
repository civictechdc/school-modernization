var $ = function(sel){return document.querySelector(sel);},
    $_all = function(sel){return document.querySelectorAll(sel);},
    asMoney = d3.format('$,.2f')
    ;

d3.csv('data/data.csv', function (error, data) {

    var width = 1000,
        height = 800;
    
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var minExpend = d3.min(data, function(d){return +d.MajorExp9815;}),
        maxExpend = d3.max(data, function(d){return +d.MajorExp9815;}),
        toScale = d3.scale.linear().domain([minExpend, maxExpend]).rangeRound([10, 30]);

    for (var j = 0; j < data.length; j++) {
        data[j].radius = 10;
        data[j].x = Math.random() * (width);
        data[j].y = Math.random() * (height);
    }
    var padding = 4,
        maxRadius = d3.max(_.pluck(data, 'radius')),
        padding_between_nodes = .65;


    // creates circles and puts them in the starting position
    var nodes = svg.selectAll("circle")
      .data(data)  
      .enter().append("circle")
      .attr("class", "node")
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .attr("r", 2)
      .style({
        'fill': function (d) { return getColor(d.MajorExp9815);},
        'stroke': 'black',
        'stroke-width': 1
      })
      .on('mouseover', function(d){

        // GET THE X/Y COOD OF OBJECT
        var xPosition = d3.select(this)[0][0]['cx'].animVal.value,
            yPosition = d3.select(this)[0][0]['cy'].animVal.value,
            tooltipPadding = 15;

        // FORMAT THE TOOLTIP, INSERT TEXT
        d3.select('#tooltip')
            .style('left', xPosition + 'px')
            .style('top', yPosition + 'px');
        d3.select('#school')
            .text('School: ' + d.School);
        d3.select('#expPast')
            .text('Past Spending: ' + asMoney(d.MajorExp9815));
        d3.select('#ward')
            .text('Ward: ' + d.Ward);
        
        // SHOW THE TOOLTIP
        d3.select('#tooltip').classed('hidden', false);

      })
      .on('mouseout', function(){
        // HIDE THE TOOLTIP
        d3.select('#tooltip').classed('hidden', true);
      })
      ;

    nodes
        .transition()
        .duration(5000)
        .attr('r', function(d){
            if(+d.MajorExp9815 && d.MajorExp9815 !== 'NA'){
                return toScale(+d.MajorExp9815)
            } else {
                return '3';
            }
        })
        ;

    var force = d3.layout.force();

    draw('Agency');
    $_all('.btn').forEach(function(item){
        item.addEventListener('click', function(e){
            console.log(e.target.id);
            draw(e.target.id);
        });
    });

// $( ".btn" ).click(function() {
//   draw(this.id);
// });

    function draw (varname) {
      var centers = getCenters(varname, [800, 800]);
      force.on("tick", tick(centers, varname));
      labels(centers)
      force.start();
    }    

    // function draw (varname) {
    //       var foci = varname === "all" ? all_center: year_centers;
    //       force.on("tick", tick(foci, varname));
    //       labels(foci)
    //       force.start();
    //     }                              

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

    function getColor(the_data){
        var value = the_data;
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
});

// function removePopovers () {
//   $('.popover').each(function() {
//     $(tophis).remove();
//   }); 
// }

// function showPopover (d) {
//   $(this).popover({
//     placement: 'auto top',
//     container: 'body',
//     trigger: 'manual',
//     html : true,
//     content: function() { 
//         console.log(d);
//       return "Level: " + d.Level + "<br/>School: " + d.School + "<br/>Ward: " + d.Ward +
//              "<br/>Exp: " + d.MajorExp9815 + "<br/>MPG: " + d.comb; }
//   });
//   $(this).popover('show')
// }