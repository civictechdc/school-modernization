// // **************************************
// // FORMATTING
// // **************************************

var $ = function(sel){return document.querySelector(sel);},
    $$ = function(sel){return document.querySelectorAll(sel);},
   asMoney = d3.format('$,.2f'),
   asPercent = d3.format('%'),
   maxExpend, minExpend;

// // **************************************
// // SVG SETUP
// // **************************************

var sizes = {
   width: 960,
   height: 2450,
   padding: 30
};

var formatNumber = d3.format(",.0f"),
    asMoney = d3.format("$,.2f");
    format = function(d) { return "$" + formatNumber(d); };
    // color = d3.scale.category10();

var svg  = d3.select('#chart')
   .append('svg')
   .attr('width', sizes.width)
   .attr('height', sizes.height)
   ;

var sankey = d3.sankey()
   .nodeWidth(15)
   .nodePadding(15)
   .size([sizes.width - sizes.padding, sizes.height - sizes.padding])
   ;

var path = sankey.link(),
    csvData;

d3.csv('data/DCPS_Master_114_sankey.csv', function(csv){ 
    csvData = csv; 
    maxExpend = d3.max(csv, function(d){ return +d.MajorExp9815; });
    minExpend = d3.min(csv, function(d){ return +d.MajorExp9815; });
    var toScale = d3.scale.linear().domain([+minExpend, +maxExpend]).rangeRound([0, sizes.h]);

    d3.json("scripts/data.json", function(data){
       sankey
          .nodes(data.nodes)
          .links(data.links)
          .layout(32);

       var link = svg.append('g')
          .selectAll('.links')
          .data(data.links)
          .enter()
          .append('path')
          .attr('class', 'link')
          .attr('d', path)
          .style("stroke-width", function(d) { return Math.max(1, d.dy); })
          .sort(function(a, b) { return b.dy - a.dy; });
          ;   

       link.append("title")
          .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

       var node = svg.append("g").selectAll(".node")
          .data(data.nodes)
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .call(d3.behavior.drag()
          .origin(function(d) { return d; })
          .on("dragstart", function() { this.parentNode.appendChild(this); })
          .on("drag", dragmove));
          ;

       node.append("rect")
          .attr("height", function(d) { return d.dy; }) //d.dy
          .attr("width", sankey.nodeWidth())
          // .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
          // .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
          .style('fill', function(d){
             return 'green';
          })
          .append("title")
          .text(function(d) { return d.name + "\n" + format(d.value); });
      
         node.append("text")
             .attr("x", -6)
             .attr("y", function(d) { return d.dy / 2; })
             .attr("dy", ".35em")
             .attr("text-anchor", "end")
             .attr("transform", null)
             .text(function(d) { 
                
                return d.name; 
             })
           .filter(function(d) { return d.x < sizes.width / 2; })
             .attr("x", 6 + sankey.nodeWidth())
             .attr("text-anchor", "start");

         function dragmove(d) {
           d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(sizes.height - d.dy, d3.event.y))) + ")");
           sankey.relayout();
           link.attr("d", path);}
    });
    
});
