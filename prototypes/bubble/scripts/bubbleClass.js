function Bubble(b){ // data
    var that = this;
    this.budget = b;
    this.asMoney = d3.format('$,');
    this.column = null;
    this.data = null;
    this.sizes = {width: 950, height: 500, padding: 100};
    this.force = null;
    this.circles = null;
    this.force_gravity = -0.05; // -0.018
    this.damper = 0.6; // 0.4 tightness of the bubbles
    this.center = {x: this.sizes.width / 2, y: this.sizes.height / 2};
    this.radius_scale = d3.scale.pow().exponent(0.4).domain([0, 115000000]).range([3, 25]); // 15
    this.nodes = [];
}

Bubble.prototype.setColumn = function(column){
    // if (this.column !== null) {
    //     this.column = column;
    // } 
    this.column = column;
};

Bubble.prototype.setData = function(newData){
    this.data = newData;
};

Bubble.prototype.setBudget = function(budget){
    this.budget = budget;
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
        current.myx = this.center.x;
        current.myy = this.center.y;
        current.radius = (function(){
            if(current[that.budget] && current[that.budget] !== 'NA'){
               return (that.radius_scale(parseInt(current[that.budget])));
            } else { 
                console.log('not ready', current);
            }        
        }());
        this.nodes.push(current);
    }
    //this.nodes.sort(function(a,b){ return b[budget] - a[budget]});
};

Bubble.prototype.add_bubbles = function(set){
     this.circles = this.svg.append('g').attr('id', 'groupCircles')
        .selectAll('circle')
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
        d3.select('#majorexp').text('Total Spent: ' + that.asMoney(d[this.budget]));
        d3.select('#spent_sqft').text('Spent per Sq.Ft.: ' + that.asMoney(d.SpentPerSqFt) + '/sq. ft.');
        d3.select('#expPast').text('Spent per Maximum Occupancy: ' + that.asMoney(d.SpentPerMaxOccupancy));
        if(d.FeederHS && d.FeederHS !== "NA"){ 
            d3.select('#hs').text('High School: ' + camel(d.FeederHS));
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
        .gravity(this.force_gravity) // -0.01
        .charge(function(d){ return that.charge(d); })
        .friction(0.9); // 0.9

};

Bubble.prototype.charge = function(d) {
    return -Math.pow(d.radius, 1.8) / 2; // 1.3
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


};

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
        items = _.uniq(_.pluck(this.nodes, column)).sort(),
        unique = [];
    for (var i = 0; i < items.length; i++) { 
        unique.push({name: items[i]}); 
    }
    console.log(items);

    // Assign unique_item a point to occupy
    var width = this.sizes.width,
        height = this.sizes.height,
        padding = this.sizes.padding;
    for (var i in unique){
        // Make the grid here
        unique[i].x = (i * width / unique.length) * 0.6 + 250; //+ 500; // * alpha
        unique[i].y = this.center.y; // * alpha
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
    return function(d){
        // d3.select('#groupCircles').attr('transform', 'translate(' + that.center.x + ', ' + that.center.y + ')');
        d.x = d.x + (d.target.x - d.x) * (that.damper + 0.02) * alpha;
        d.y = d.y + (d.target.y - d.y) * (that.damper + 0.02) * alpha;
    }
};

Bubble.prototype.graph = function(set){
    this.make_svg();
    this.set_force();
    this.create_nodes(set);
    this.add_bubbles(this.nodes);
    this.add_tootltips();
    this.group_bubbles(); 
    
};

// Utility functions
function get(sel){return document.querySelector(sel);}
function getAll(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel));}
function camel(str){ return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase();});}