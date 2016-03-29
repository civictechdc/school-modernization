function Bubble(budget){ // data
    this.budget = budget;
    this.money = d3.format('$,.2f');
    this.commas = d3.format(',');
    this.column = null;
    this.data = null;
    this.sizes = {width: 950, height: 425, padding: 100};
    this.force = null;
    this.circles = null;
    this.force_gravity = -0.03; // -0.018
    this.damper = 0.5; // 0.4 tightness of the bubbles
    this.center = {x: this.sizes.width / 2, y: this.sizes.height / 2};
    this.nodes = [];
    this.unique = null;
    this.range = { min: 5, max: 35 };
    this.colorRange = { high: '#001c2b', middle: '#6f7f87', low: '#ff3233', na: '#fff' };
    this.min = null;
    this.max = null;
};

Bubble.prototype.setColumn = function(column){
    this.column = column; 
};

Bubble.prototype.setData = function(newData){
    this.data = newData;
};

Bubble.prototype.setBudget = function(budget){
    this.budget = budget;
};

Bubble.prototype.make_svg = function(){
    if(document.querySelector('svg')){
        d3.select('svg').remove();
    }
    this.svg = d3.select('#chart').append('svg')
        .attr('width', this.sizes.width)
        .attr('height', this.sizes.height);
};

Bubble.prototype.create_nodes = function(){
    if(this.nodes.length){
        this.nodes = [];
    }
    var that = this;
        this.max = max = d3.max(this.data, function(d){ return +d[that.budget]; }),
        this.min = min = d3.min(this.data, function(d){ return +d[that.budget]; }),
        radius_scale = d3.scale.linear().domain([min, max]).range([that.range.min, that.range.max]);

    for(var i = 0, j = this.data.length; i < j; i++){
        var that = this,
        current = this.data[i];
        current.myx = this.center.x;
        current.myy = this.center.y;
        current.color = (function(){
            // var cur_budget = current[this.budget];
            // // console.log(current[this.budget]);
            // if(cur_budget > (max / 10)){
            //     return this.colorRange.high;
            // }
            // if(cur_budget < (max / 10) && cur_budget > 0){
            //     return this.colorRange.middle;
            // }
            // if(cur_budget === 'NA'){ return this.colorRange.na;}
            // return this.colorRange.low;
            // console.log(current['Agency']);
            if(current['Agency'] === 'DCPS'){
                return '#021c2a';
            }
            if(current[this.budget] === '0'){
                return '#ff3233';
            }
            return '#425165';


        }).call(this);
        current.radius = (function(){
            var amount= current[that.budget].trim();
            if (amount !== 'NA'){
                if(amount > 0){
                    // console.log(radius_scale(amount));
                    return radius_scale(amount);
                } else {
                    return 5;
                }   
            } else {
                return 7;
            }
        }());
        this.nodes.push(current);
    }
    this.nodes.sort(function(a,b){ return b.value - a.value});
};

Bubble.prototype.create_bubbles = function(set){
    var that = this;
    this.circles = this.svg.append('g').attr('id', 'groupCircles')
    .selectAll('circle')
    .data(set).enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('color', function(d,i){
        return set[i].color;
    })
    .attr('id', function(d){
        return d['School'];
    })
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

Bubble.prototype.update = function() {
    d3.selectAll('.circle').data(this.data).exit()
    .transition()
    .duration(3000)
    .style('opacity', '0')
    .remove();
};

Bubble.prototype.add_tootltips = function(d){
    var that = this;
    this.circles.on('mouseenter', function(d){

        // GET THE X/Y COOD OF OBJECT
        var tooltipPadding = 160,
            xPosition = d3.select(this)[0][0]['cx'].animVal.value + tooltipPadding,
            yPosition = d3.select(this)[0][0]['cy'].animVal.value;
        
        // TOOLTIP INFO
        d3.select('#school').text(camel(d.School));
        d3.select('#agency').text('Agency: ' + d.Agency);
        d3.select('#ward').text('Ward: ' + d.Ward);
        // Project Type
        if(d.ProjectType && d.ProjectType !== 'NA'){
            d3.select('#project').text('Project: ' + d.ProjectType);
        } else {
            d3.select('#project').text('');
        }
        // Year Completed
        if(d.YrComplete && d.YrComplete !== 'NA'){
            d3.select('#yearComplete').text('Year Completed: ' + d.YrComplete);
        } else {
            d3.select('#yearComplete').text('');
        }

        // Total Spent
        if(d[that.budget]){
            d3.select('#majorexp').text('Total Spent: ' + that.money(d[that.budget]));
        } else {
            d3.select('#majorexp').text('');
        }
        // Spent per SQ FT
        d3.select('#spent_sqft').text('Spent per Sq.Ft.: ' + that.money(d.SpentPerSqFt) + '/sq. ft.');

        // Spent per Maximum Occupancy
        d3.select('#expPast').text('Spent per Maximum Occupancy: ' + that.money(d.SpentPerMaxOccupancy));
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
        .charge(function(d){ return that.charge(d) || -15; })
        .friction(0.9); // 0.9
};

Bubble.prototype.charge = function(d) {
    var charge = (-Math.pow(d.radius, 1.8) / 2.05); // 1.3
    if(charge == NaN){
        charge = -35;
    }
    return charge;
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
        items = _.uniq(_.pluck(this.nodes, column)).sort();
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
        unique[i].x = (i * width / unique.length) * 0.55 + 250; // + 250; //+ 500; // * alpha
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

    // Add Text
    this.svg.selectAll('text')
        .data(unique)
        .enter()
        .append('text')
        .attr('class', 'sub_titles')
        .attr('transform', function(d){
            return 'translate(' + (d.x * 1.5 - 250) + ',0) rotate(-15)'
        })
        // .attr('x', function(d){
        //     return d.x * 1.5 - 250;
        // })
        // .attr('x', function(d){return d.x *1.8 - 450;})
        .attr('y', function(d,i){
            // if(i%2 === 0){
            //     return d.y - 175;
            // }
            return d.y - 150;
        })

        .text(function(d){
            return d.name;
        })
        ;
    // Send the nodes the their corresponding point
    return function(d){
        // d3.select('#groupCircles').attr('transform', 'translate(' + that.center.x + ', ' + that.center.y + ')');
        d.x = d.x + (d.target.x - d.x) * (that.damper + 0.02) * alpha;
        d.y = d.y + (d.target.y - d.y) * (that.damper + 0.02) * alpha;
    }
};

Bubble.prototype.make_legend = function(){
    var that = this,
        nums = this.budget !== 'AnnualSpentPerSqFt' ? [100000000, 50000000 ,10000000, 1, 0] : [50, 25, 15, 1, 0];

    if(get('#legend_cont svg')){
        d3.select('#legend_cont svg').remove('svg');
    }

    var legend = d3.select('#legend_cont')
        .append('svg').attr('width','250').attr('height', 192);
    legend.selectAll('circle')
        .data(nums)
        .enter()
        .append('circle')
        .attr('cx', 40)
        .attr('cy', function(d,i){
            return 40 * (i+1);
        })
        .style('fill', function(d){
            return d === 0 ? that.colorRange.low : that.colorRange.high;
        })
        .attr('r', function(d){
            max = d3.max(that.data, function(d){return +d[that.budget];}),
            min = d3.min(that.data, function(d){return +d[that.budget];}),
            radius_scale = d3.scale.linear().domain([min, max]).range([that.range.min, that.range.max]); // 15
            return radius_scale(d);
        })
        ;
    legend.selectAll('text')
        .data(nums)
        .enter()
        .append('text')
        .attr('x', 95)
        .attr('y', function(d,i){
            return 5 + 37 * (i+1);
        })
        .text(function(d){
            if(that.budget === 'AnnualSpentPerSqFt'){ return that.money(d) + ' / Sq. Ft.';}
            return that.money(d);
        })
        ;
};

Bubble.prototype.add_search_feature = function() {  
    // Populate the <select> element with the schools
    for(var i=0, j=this.nodes.length; i<j; i++){
        var option = document.createElement('option'),
            newOption = get('select').appendChild(option),
            sortedNodes = _.sortBy(this.nodes, 'School');
        newOption.setAttribute('school', sortedNodes[i]['School'])
        newOption.innerHTML = sortedNodes[i]['School'];  
    }

    // Fool with the select bar
    var selectForm = get('#select');
    selectForm.addEventListener('change', function(e){
        if(get('[shown=true]')){
            var last = get('[shown=true]');
            last.style.fill = last.getAttribute('color');
            last.removeAttribute('shown');
        }
        var circle = document.getElementById(e.target.value);
        console.log(circle);
        circle.setAttribute('shown', true);
        circle.style.fill = 'yellowgreen';
    });
};

Bubble.prototype.reset_svg = function() {
    d3.selectAll('#groupCircles').remove();
    d3.selectAll('.circle').remove();
    d3.selectAll('.sub_titles').remove();
};

Bubble.prototype.graph = function(){
    this.make_svg();
    this.set_force();
    this.create_nodes();
    this.create_bubbles(this.nodes);
    this.update();
    this.add_tootltips();
    this.group_bubbles(); 
    this.make_legend();
    this.add_search_feature();  
};

Bubble.prototype.change = function(){
    this.reset_svg();
    this.create_nodes();
    this.create_bubbles(this.nodes);
    this.add_tootltips();
    this.group_bubbles(); 
    this.make_legend();
    this.add_search_feature();
};

// Utility functions
function get(sel){return document.querySelector(sel);}
function getAll(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel));}
function camel(str){ return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase();});}

