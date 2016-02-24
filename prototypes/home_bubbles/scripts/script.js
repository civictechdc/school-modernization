"use strict";

var width = 900,
   height = 600,
   tooltipPadding = 40,
   money = d3.format('$,2f');

var svg = d3.select('#chart')
   .append('svg').attr('height', height).attr('width', width);

var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(1.5);

d3.json('data/multi_school.json', function(d){
   var node = svg.selectAll(".node")
      .data(bubble.nodes(d)
      .filter(function(d) { return !d.children; }))
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
   
   node.append("title")
      .text(function(d) { return d.name + ": " + d.value; });

   node.append("circle")
      .attr("r", function(d) { return d.r; });

   node.on('mouseenter', function(d){  
         document.querySelector('#tooltip').classList.remove('hidden'); 
         d3.select('#tooltip')
            .style('left', function(){ return (d.x + tooltipPadding) + 'px';})
            .style('top', function(){ return (d.y - tooltipPadding) + 'px';})
            .select('#ProjectType')
            .text('Project Type: ' + d.name);
         d3.select('#Amount')
            .text('Amount: ' + money(d.value));
      })
      ;

   // function update(dataset){
   //    bubbles.transition()
   //       .duration(1000)
   //       .data(dataset)
   //       .
   // }


});