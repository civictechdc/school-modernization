"use strict";

var width = 900,
   height = 500,
   padding = 15,
   svgWidth = (width / 2) - padding,
   tooltipPadding = 40,
   money = d3.format('$,2f');

var svg_left = d3.select('#chart_left')
   .append('svg').attr('height', height).attr('width', svgWidth),
    svg_right = d3.select('#chart_right')
   .append('svg').attr('height', height).attr('width', svgWidth);

var bubble = d3.layout.pack()
    .sort(function(a,b){return b.value - a.value;})
    .size([svgWidth, height])
    .padding(1.5);

// Make the AJAX requests, the run the graphs
d3.json('scripts/public.json', function(d){
  graph(svg_left, d);
});

d3.json('scripts/charter.json', function(d){
  graph(svg_right, d);
});

// Reusable function to make the graphs
function graph(where, data){
  var node = where.selectAll(".node")
    .data(bubble.nodes(data))
    // .filter(function(info) { return !info.children; })
    .enter()
    .append("g")
    .attr("class", "node")
    .attr('id', function(d,i){
      return "circle_" + i;
    })
    .attr("transform", function(d, i) { 
      return "translate(" + d.x + "," + d.y + ")"; })
    ;
  node.append("title")
    .text(function(d) { return d.name + ": " + d.value; });

  node.append("circle")
    .attr("r", function(d) {
      return d.r; });

  // Remove the big circle
  d3.select('#circle_0').remove();

  // Add tooltips
  node.on('mouseenter', function(d){  
    document.querySelector('#tooltip').classList.remove('hidden'); 
    d3.select('#tooltip')
      .style('left', function(){ return (d.x + tooltipPadding) + 'px';})
      .style('top', function(){ return (d.y - tooltipPadding) + 'px';})
      .select('#School')
      .text('School: ' + d.name);
    d3.select('#Amount')
      .text('Amount: ' + money(d.value));
  });
}

// Utility Functions
function node(set){
  return {name: 'Schools', children: set};
}

function get_min(dataset, column){
  d3.min(dataset, function(v){return v[column];})
}

function get_max(dataset, column){
  d3.max(dataset, function(v){return v[column];})
}

function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}