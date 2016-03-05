"use strict";

var width = 900,
   height = 600,
   padding = 5,
   svgWidth = (width / 2),
   tooltipPadding = 40,
   money = d3.format('$,2f'),
   data = null;

var svg_left = d3.select('#chart_left')
   .append('svg').attr('height', height).attr('width', svgWidth).style('background-color', 'green'),
    svg_right = d3.select('#chart_right')
   .append('svg').attr('height', height).attr('width', svgWidth).style('background-color', 'blue');
// var bubble = d3.layout.pack()
//     .sort(function(a,b){return b.value - a.value;})
//     .size([width, height])
//     .padding(1.5);

d3.json('scripts/phase4.json', function(d){

  data = {
    public: (function(datum){
      console.log(datum);
      return datum.children.filter(function(item){
        if (item.agency === 'DCPS'){
          return datum;
        }
      })
    }(d)),
    charter: (function(datum){
      return datum.children.filter(function(item){
        if (item.agency === 'PCS'){
          return datum;
        }
      })
    }(d))
  };  

   // var node = svg.selectAll(".node")
   //    .data(bubble.nodes(d)
   //    .filter(function(d) { return !d.children; }))
   //    .enter().append("g")
   //    .attr("class", "node")
   //    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
   
   // node.append("title")
   //    .text(function(d) { return d.name + ": " + d.value; });

   // node.append("circle")
   //    .attr("r", function(d) { return d.r; });

   // node.on('mouseenter', function(d){  
   //       document.querySelector('#tooltip').classList.remove('hidden'); 
   //       d3.select('#tooltip')
   //          .style('left', function(){ return (d.x + tooltipPadding) + 'px';})
   //          .style('top', function(){ return (d.y - tooltipPadding) + 'px';})
   //          .select('#ProjectType')
   //          .text('Project Type: ' + d.name);
   //       d3.select('#Amount')
   //          .text('Amount: ' + money(d.value));
   //    })
   //    ;
});