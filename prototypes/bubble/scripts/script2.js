var $ = function(sel){return document.querySelector(sel);},
    $$ = function(sel){return document.querySelectorAll(sel);};

d3.csv('data/data.csv', function (error, data) {

    var width = 1000,
        height = 800;
    
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var minExpend = d3.min(data, function(d){return +d.MajorExp9815;}),
        maxExpend = d3.max(data, function(d){return +d.MajorExp9815;}),
        toScale = d3.scale.linear().domain([minExpend, maxExpend]).rangeRound([10, 100]);

    for (var j = 0; j < data.length; j++) {
        data[j].radius = (function(){
            if(+data[j].MajorExp9815 && data[j].MajorExp9815 !== 'NA'){
                return toScale(+data[j].MajorExp9815)
            } else {
                return '10';
            }
        }());
        data[j].x = Math.random() * width;
        data[j].y = Math.random() * height;
    }
    var padding = 4;
    var maxRadius = d3.max(_.pluck(data, 'radius'));

    var nodes = svg.selectAll("circle")
      .data(data);

    nodes.enter().append("circle")
      .attr("class", "node")
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .attr("r", 2)
      .style("fill", function (d) { return getColor(d.MajorExp9815); })
      // .on("mouseover", function (d) { showPopover.call(this, d); })
      // .on("mouseout", function (d) { removePopovers(); })
      ;

    nodes
        .transition()
        .duration(1000)
        .attr("r", function (d) { return d.radius; })

    var force = d3.layout.force();

    // draw('Level');
    $$('.btn').forEach(function(item){
        item.addEventListener('click', function(e){
            console.log(e.target.id);
            draw(e.target.id);
        });
    });

    // .addEventListener('click', function(e){
    //     console.log(e.target.id);
    //     draw(e.target.id);
    // });

// $( ".btn" ).click(function() {
//   draw(this.id);
// });



function draw (varname) {
  var centers = getCenters(varname, [800, 800]);
  console.log(centers);
  force.on("tick", tick(centers, varname));
  // labels(centers)
  force.start();
}

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
  return function (e) {
    for (var i = 0; i < data.length; i++) {
      var o = data[i];
      var f = foci[o[varname]];
      o.y += (f.y - o.y) * e.alpha;
      o.x += (f.x - o.x) * e.alpha;
    }
    nodes.each(collide(.07))
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
    console.log(d);
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

// function removePopovers () {
//   $('.popover').each(function() {
//     $(this).remove();
//   }); 
// }

// function showPopover (d) {
//   $(this).popover({
//     placement: 'auto top',
//     container: 'body',
//     trigger: 'manual',
//     html : true,
//     content: function() { 
//       return "Make: " + d.make + "<br/>Model: " + d.model + "<br/>Drive: " + d.drive +
//              "<br/>Trans: " + d.trans + "<br/>MPG: " + d.comb; }
//   });
//   $(this).popover('show')
// }

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