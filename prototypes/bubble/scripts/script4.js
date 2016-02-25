'use strict';
//*********************************
// public class Bubble
//*********************************
function Bubble(data, column){
    this.column = column;
    this.data = data;
    this.sizes = {width: 600, height: 600};
    this.force = null;
    this.circles = null;
    this.force_gravity = -0.01;
    this.damper = 0.4;
    this.center = {x: this.sizes.width / 2, y: this.sizes.width / 2};
    this.maxAmount = function(){
        var that = this;
        // console.log(this.column);
        d3.max(this.data, function(d){
            return parseInt(d[that.column]);
        });
    };
    this.minAmount = function(){
        d3.min(this.data, function(d){
            console.log(+d[this.column]);
            return +d[this.column];
        });
    };
    // this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, (this.maxAmount())]).range([2, 85]);
    this.radius_scale = d3.scale.pow().exponent(0.3).domain([0, 115000000]).range([2, 11]);
    this.nodes = [];

}

Bubble.prototype.make_svg = function(){
    if(document.querySelector('svg')){
        d3.select('svg').remove();
    }
    this.svg = d3.select('#chart').append('svg')
        .attr('width', this.sizes.width)
        .attr('height', this.sizes.height);
};

Bubble.prototype.add_info_to_data = function(set){
    if(this.nodes.length){
        this.nodes = [];
    }
    for(var i = 0, j = set.length; i < j; i++){
        var that = this;
        var current = set[i];
        var randH = parseInt(Math.random() * this.sizes.width),
            randW = parseInt(Math.random() * this.sizes.height);

        current.myx = randH;
        current.myy = randW;
        current.color = '#2956B2';
        current.radius = (function(){
            if(current.MajorExp9815 && current.MajorExp9815 !== 'NA'){
               // return (that.radius_scale(parseInt(current.MajorExp9815)));
               return (that.radius_scale(parseInt(current.MajorExp9815)));
            } else { 
                console.log('not ready', current);
                console.log(current.MajorExp9815); 
                return 5;
            }        
        }());
        this.nodes.push(current);
    }
    this.nodes.sort(function(a,b){ return b.MajorExp9815 - a.MajorExp9815});
    // console.log(this.nodes);
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
    return -Math.pow(d.radius, 2.0);
};


Bubble.prototype.together = function(d){
    var that = this;
    this.force.on('tick', function(e){
        that.circles.each(that.move_towards_center(e.alpha/2))
            .attr('cx', function(d){ return d.x;}) //d.x
            .attr('cy', function(d){ return d.y;}); //d.y
        })
        ;   
    this.force.start();
};

Bubble.prototype.move_towards_center = function(alpha){
    var already_done = false;
    var that = this;
    return function(d){
        d.x = d.x + (that.center.x - d.x) * (that.damper + 0.02) * alpha;
        d.y = d.y + (that.center.y - d.y) * (that.damper + 0.02) * alpha;    
    };
}

Bubble.prototype.runit = function(set){
    this.make_svg();
    this.set_force();
    this.add_info_to_data(set);
    this.update(this.nodes);

    
    // this.printData(set);
};

// MAIN()
function main(params){
    d3.csv('data/data_master.csv', function(d){
        // Make datasets
        // returns data = {all, public, charter}
        var data = (function makeData(){
            var both = [], public_schools = [], charter = [];
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
                    charter.push(d[i]);
                }
            }      

           return {
              both : both, // total data
              public_schools : public_schools, // only public schools
              charter: charter // only charter schools
           };
        }());

        // Run the graph
        var bubble = new Bubble(data.both, 'MajorExp9815');
        bubble.runit(data.both); 
        
        // Make the buttons interactive
        var public_schools = document.getElementById('past'),
            charter = document.getElementById('future');        
        public_schools.addEventListener('click', function(){ bubble.together(); });
        charter.addEventListener('click', function(){ bubble.together(); });
            
    });
}
main('test');

