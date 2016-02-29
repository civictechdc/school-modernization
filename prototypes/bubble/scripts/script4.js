'use strict';
//*********************************
// public class Bubble
//*********************************
function Bubble(data, column){
    var that = this;
    this.asMoney = d3.format('$,');
    this.column = column;
    this.data = data;
    this.sizes = {width: 900, height: 600, padding: 100};
    this.force = null;
    this.circles = null;
    this.force_gravity = -0.01;
    this.damper = 0.4;
    this.center = {x: this.sizes.width / 2, y: this.sizes.width / 2};
    this.maxAmount = (function(d){
            d3.max(that.data, function(d){
                return parseInt(d[that.column]);
            });
        }());
    this.minAmount = function(){
        d3.min(this.data, function(d){
            console.log(+d[this.column]);
            return +d[this.column];
        });
    };
    // this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, (this.maxAmount())]).range([2, 85]);
    this.radius_scale = d3.scale.pow().exponent(0.3).domain([0, 115000000]).range([4, 15]);
    this.nodes = [];
    console.log(this.maxAmount);
}

Bubble.prototype.make_svg = function(){
    if(document.querySelector('svg')){
        d3.select('svg').remove();
    }
    this.svg = d3.select('#chart').append('svg')
        .attr('width', this.sizes.width)
        .attr('height', this.sizes.height);
};

Bubble.prototype.create_nodes = function(set){
    if(this.nodes.length){
        this.nodes = [];
    }
    for(var i = 0, j = set.length; i < j; i++){
        var that = this,
            current = set[i];

        // current.myx = parseInt(Math.random() * this.sizes.width);
        // current.myy = parseInt(Math.random() * this.sizes.height);
        current.myx = this.center.x;
        current.myy = this.center.y;
        // current.color = '#2956B2';
        current.radius = (function(){
            if(current.MajorExp9815 && current.MajorExp9815 !== 'NA'){
               return (that.radius_scale(parseInt(current.MajorExp9815)));
            } else { 
                console.log('not ready', current);
            }        
        }());
        this.nodes.push(current);
    }
    this.nodes.sort(function(a,b){ return b.MajorExp9815 - a.MajorExp9815});
};

Bubble.prototype.update = function(set){
     this.circles = this.svg.selectAll('circle')
        .data(set)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .style('fill', function(d,i){
            return set[i].color;
        })
        .attr('cx', function(d,i){
            return set[i].myx;
        })
        .attr('cy', function(d,i){
            return set[i].myy;
        })
        .attr('r', function(d,i){ 
            return set[i].radius;})
        ;
};

Bubble.prototype.add_tootltips = function(d){
    var that = this;
    this.circles.on('mouseenter', function(d){

        // GET THE X/Y COOD OF OBJECT
        var tooltipPadding = 160,
            xPosition = d3.select(this)[0][0]['cx'].animVal.value + tooltipPadding,
            yPosition = d3.select(this)[0][0]['cy'].animVal.value;
        
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
        d3.select('#majorexp').text('Total Spent: ' + that.asMoney(d.MajorExp9815));
        d3.select('#spent_sqft').text('Spent per Sq.Ft.: ' + that.asMoney(d.SpentPerSqFt) + '/sq. ft.');
        d3.select('#expPast').text('Spent per Maximum Occupancy: ' + that.asMoney(d.SpentPerMaxOccupancy));
        if(d.FeederHS && d.FeederHS !== "NA"){
            d3.select('#hs').text('High School: ' + d.FeederHS);
        } else {
            d3.select('#hs').text('');
        }

        // Make the tooltip visisble
        d3.select('#tooltip')
            .style('left', xPosition + 'px')
            .style('top', yPosition + 'px');
        d3.select('#tooltip').classed('hidden', false);
    })
    .on('mouseleave', function(){
        d3.select('#tooltip').classed('hidden', true);
    });
}

Bubble.prototype.set_force = function() {
    var that = this;
    this.force = d3.layout.force()
        .nodes(this.data)
        .links([])
        .size([this.sizes.width, this.sizes.height])
        .gravity(-0.05)
        .charge(function(d){ return that.charge(d); })
        .friction(0.9);

};


Bubble.prototype.charge = function(d) {
    return -Math.pow(d.radius, 1.8);
};


Bubble.prototype.group_bubbles = function(d){
    var that = this;
    this.force.on('tick', function(e){
        that.circles.each(that.move_towards_centers(e.alpha/2, that.column))
            .attr('cx', function(d){ return d.x;})
            .attr('cy', function(d){ return d.y;});
        })
        ;   
    this.force.start();
    console.log(this.column);
};


// Tick functions
Bubble.prototype.move_towards_center = function(alpha){
    var that = this;
    return function(d){
        d.x = d.x + (that.center.x - d.x) * (that.damper + 0.02) * alpha;
        d.y = d.y + (that.center.y - d.y) * (that.damper + 0.02) * alpha;    
    };
}

Bubble.prototype.move_towards_centers = function(alpha, column) {
    // Make an array of unique items
    var that = this,
        items = _.uniq(_.pluck(this.nodes, column)),
        unique = [];
    for (var i = 0; i < items.length; i++) { 
        unique.push({name: items[i]}); 
    }
    // Assign unique_item a point to occupy
    var width = this.sizes.width,
        height = this.sizes.height,
        padding = this.sizes.padding;
    for (var i in unique){
        // Make the grid here
        unique[i].x = (i) * (width / unique.length) + padding * alpha;
        unique[i].y = (i) * (height / unique.length) + padding * alpha;
    }
    // Attach the target coordinates to each node
    _.each(this.nodes, function(node){
        for (var i = 0; i < unique.length; i++) {
            if (node[column] === unique[i].name){
                node.target = {
                    x: unique[i].x,
                    y: unique[i].y
                };
            }
        }
    });

    // Send the nodes the their corresponding point
    var done = false;
    return function(d){
        d.x = d.x + (d.target.x - d.x) * (that.damper + 0.02) * alpha;
        d.y = d.y + (d.target.y - d.y) * (that.damper + 0.02) * alpha;
    }

    // var pack = d3.layout.pack()
    //     .size([this.sizes.width, this.sizes.height])
    //     .nodes(unique_items)
    //     ;
};

Bubble.prototype.graph = function(set){
    this.make_svg();
    this.set_force();
    this.create_nodes(set);
    this.update(this.nodes);
    this.add_tootltips();
    this.group_bubbles(); 
    
};

// MAIN()
function main(params){
    d3.csv('data/data_master.csv', function(d){
        // Make datasets
        // returns data = {all, public, charter}
        var data = (function makeData(){
            var both = [], public_schools = [], charter_schools = [];
            // Cache all data into one dataset
            for (var i = 0, j = d.length; i < j; i++){
                both.push(d[i]);
            }
            // Separate d for PUBLIC schools
            for (var i = 0, j = both.length; i < j; i++){
                if (d[i].Agency === 'DCPS'){
                    public_schools.push(d[i]);
                }
            }
            // Separate d for CHARTER schools
            for (var i = 0, j = both.length; i < j; i++){
                if (d[i].Agency === 'PCS'){
                    charter_schools.push(d[i]);
                }
            }      

           return {
              both : both, // total data
              public_schools : public_schools, // only public schools
              charter_schools: charter_schools // only charter schools
           };
        }());

        // Run the graph
        var bubble = new Bubble(data.both, 'Agency');
        bubble.graph(data.both); 
        
        // Get buttons from the DOM
        var public_schools = document.getElementById('past'),
            charter = document.getElementById('future');        
        
        // Make the buttons interactive
        public_schools.addEventListener('click', function(){ 
            bubble.graph(data.public_schools); });

        charter.addEventListener('click', function(){ 
            bubble.graph(data.charter_schools); });    
    });
}
main('test');



// Utility
function print(x){console.log(x);}
function get(sel){return document.querySelector(sel);}
function getAll(sel){return document.querySelectorAll(sel);}
function camel(str){ return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase();});}


