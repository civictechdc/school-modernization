var diameter = 760,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    // .radius(function(){return '20';})
    // .padding(1.5)
    ;

var svg = d3.select("#chart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json("scripts/json/data.json", function(error, root) {
  if (error) throw error;

  var force = d3.layout.force();
  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      // .transition()
      // .duration(500)
      .attr("r", function(d) { 
        var r_scale = d3.scale.linear().domain([0, 117015598]).rangeRound([10,100]);
        return r_scale(d.value);
      })
      .style("fill", function(d) {
        return getColor(d.value);
      })
      .on('mouseenter', function(){
        this.style.fill = 'gray';
      })
      .on('mouseleave', function(d){
        this.style.fill = getColor(d.value);
      })

      ;

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });

});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

// Returns the appropriate color for the value passed into it
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

d3.select(self.frameElement).style("height", diameter + "px");