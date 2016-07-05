/// <reference path="../typings/index.d.ts" />
'use strict';
function Bubble(){ // data
    this.budget =  null;
    this.column = null;
    this.data = null;
    this.per = null;
    this.money = d3.format('$,');
    this.commas = d3.format(',');
    this.sizes = { width: 1050, height: 570, padding: 100 };
    this.force = null;
    this.circles = null;
    this.force_gravity = -0.03; // -0.018
    this.damper = 0.5; // 0.4 tightness of the bubbles
    this.center = { x: this.sizes.width / 2, y: this.sizes.height / 2 };
    this.nodes = [];
    this.unique = null;
    this.range = { min: 5, max: 35 };
    this.colorRange = { high: '#001c2b', middle: '#6f7f87', low: '#ff3233', na: '#fff' };
    this.min = null;
    this.max = null;
    this.sum = null;
    this.radius_scale = null;
    this.round = function (x) {
        return this.money(d3.round(x, 0));
    };
}
;
// Setters
Bubble.prototype.setColumn = function (column) {
    this.column = column;
};
Bubble.prototype.setData = function (newData) {
    this.data = newData;
};
Bubble.prototype.setBudget = function (budget) {
    this.budget = budget;
};
Bubble.prototype.setPer = function (newPer) {
    this.per = newPer;
};
// Getters
Bubble.prototype.getColumn = function () {
    return this.column;
};
Bubble.prototype.getData = function () {
    return this.data;
};
Bubble.prototype.getBudget = function () {
    return this.budget;
};
Bubble.prototype.getPer = function () {
    return this.per;
};
// The Rest
Bubble.prototype.make_svg = function () {
    if (document.querySelector('svg')) {
        d3.select('svg').remove();
    }
    this.svg = d3.select('#chart').append('svg')
        .attr('width', this.sizes.width)
        .attr('height', this.sizes.height);
};
Bubble.prototype.create_nodes = function () {
    if (this.nodes.length) {
        this.nodes = [];
    }

    var that = this, min, max;
    this.max = max = d3.max(this.data, function (d) { return +d[that.budget]; }),
        this.min = min = d3.min(this.data, function (d) { return +d[that.budget]; });
    var radius_scale = d3.scale.linear().domain([min, max]).range([that.range.min, that.range.max]);
    this.radius_scale = radius_scale;
    var _loop_1 = function(i, j) {
        var current = this_1.data[i];
        current.myx = this_1.center.x;
        current.myy = this_1.center.y;
        current.color = (function () {
            if (current[this.budget] === '0') {
                return '#787385';
            }
            if (current['Agency'] === 'DCPS') {
                // return '#99cc99';
                return '#7AA25C';
            }
            if (current['Agency'] === 'PCS') {
                // return '#425165';
                return 'orange';
            }
        }).call(this_1);
        current.radius = (function () {
            var amount = current[that.budget];
            if (amount !== 'NA') {
                if (amount > 0) {
                    return radius_scale(amount);
                }
                else {
                    return 5;
                }
            }
            else {
                return 7;
            }
        }());
        this_1.nodes.push(current);
    };
    var this_1 = this;
    for (var i = 0, j = this.data.length; i < j; i++) {
        _loop_1(i, j);
    }
};
Bubble.prototype.create_bubbles = function (set) {
    var that = this;
    this.circles = this.svg.append('g').attr('id', 'groupCircles')
        .selectAll('circle')
        .data(set).enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('color', function (d, i) {
        return set[i].color;
    })
        .attr('id', function (d) {
        return d['School'];
    })
        .style('fill', function (d, i) {
        return set[i].color;
    })
        .attr('cx', function (d, i) {
        return set[i].myx;
    })
        .attr('cy', function (d, i) {
        return set[i].myy;
    })
        .attr('r', function (d, i) {
        return set[i].radius;
    });
};
Bubble.prototype.update = function () {
    d3.selectAll('.circle').data(this.data).exit()
        .transition()
        .duration(3000)
        .style('opacity', '0')
        .remove();
};
Bubble.prototype.add_tootltips = function (d) {
    var that = this;
    this.circles.on('mouseenter', function (d) {
        // GET THE X/Y COOD OF OBJECT
        var tooltipPadding = 180, // 160,
        xPosition = d3.select(this)[0][0]['cx'].animVal.value, yPosition = d3.select(this)[0][0]['cy'].animVal.value; //+ tooltipPadding;
        // TOOLTIP INFO
        d3.select('#school').text(camel(d.School));
        d3.select('#agency').text('Agency: ' + d.Agency);
        d3.select('#ward').text('Ward: ' + d.Ward);
        // Enrollment
        d3.select('#enrolled').text('Enrollment (2014-15): ' + d['Total_Enrolled']);
        // Building Sq Foot
        d3.select('#buildingsize').text('Bldg sq ft 2016: ' + that.commas(d['totalSQFT']) + ' sq ft.');
        // Project Type
        if (d.ProjectType && d.ProjectType !== 'NA') {
            d3.select('#project').text('Project: ' + d.ProjectType);
        }
        else {
            d3.select('#project').text('');
        }
        // Year Completed
        if (d.YrComplete && d.YrComplete !== 'NA') {
            if (that.budget === 'TotalAllotandPlan1621') {
                d3.select('#yearComplete').text('Projected Completion: ' + d.FutureYrComplete);
            }
            else {
                d3.select('#yearComplete').text('Year Completed: ' + d.YrComplete);
            }
        }
        else {
            d3.select('#yearComplete').text('');
        }
        // Total Spent
        if (d[that.budget]) {
            d3.select('#majorexp').text('Total Spent: ' + that.round(d[that.budget]));
        }
        else {
            d3.select('#majorexp').text('');
        }
        // Spent per SQ FT
        var test = that.round(d.SpentPerSqFt, 0);
        d3.select('#spent_sqft').text(function (d) {
            if (test === '' || test === 'NA') {
                return 'Spent per Sq Ft: Not Available';
            }
            return 'Spent per Sq.Ft.: ' + test + '/sq. ft.';
        });
        // Spent per Maximum Occupancy
        d3.select('#expPast').text('Spent per Maximum Occupancy: ' + that.round(d.SpentPerMaxOccupancy));
        if (d.FeederHS && d.FeederHS !== "NA") {
            d3.select('#hs').text('High School: ' + camel(d.FeederHS));
        }
        else {
            d3.select('#hs').text('');
        }
        // Make the tooltip visisble
        d3.select('#tooltip')
            .style('left', xPosition + 'px')
            .style('top', yPosition + 'px');
        d3.select('#tooltip').classed('hidden', false);
    })
        .on('mouseleave', function () {
        d3.select('#tooltip').classed('hidden', true);
    });
};
Bubble.prototype.set_force = function () {
    var _this = this;
    // let that = this;
    this.force = d3.layout.force()
        .nodes(this.data)
        .links([])
        .size([this.sizes.width, this.sizes.height])
        .gravity(this.force_gravity) // -0.01
        .charge(function (d) { return _this.charge(d) || -15; })
        .friction(0.9); // 0.9
};
Bubble.prototype.charge = function (d) {
    var charge = (-Math.pow(d.radius, 1.8) / 2.05);
    if (charge == NaN) {
        charge = -35;
    }
    return charge;
};
Bubble.prototype.group_bubbles = function (d) {
    var _this = this;
    this.force.on('tick', function (e) {
        _this.circles.each(_this.move_towards_centers(e.alpha / 2, _this.column))
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
    });
    this.force.start();
};
Bubble.prototype.calcMaxOccupancySums = function () {
    var _this = this;
    var maxOccupancySums = {}, data = this.data;
    // These are the CSV columns we want to iterate through, and a mapping to what we want to access them 
    // as in the returned maxOccupancySums object
    var columns = ['FeederHS', 'Ward', 'Level'], columnMap = { FeederHS: 'feederhs', Ward: 'ward', Level: 'level' };
    columns.forEach(function (column) {
        var items = _this.getUnique(_this.nodes, column), lenItems = items.length, columnSums = [];
        var _loop_2 = function(index) {
            var sumForThisColumn = 0;
            data.forEach(function (node) {
                if (items[index] === node[column]) {
                    if (node['maxOccupancy'] !== 'NA' && node['Open_Now'] !== '0') {
                        sumForThisColumn += parseInt(node['maxOccupancy']);
                    }
                }
            });
            columnSums.push(sumForThisColumn);
        };
        for (var index = 0; index < lenItems; index++) {
            _loop_2(index);
        }
        ;
        maxOccupancySums[columnMap[column]] = columnSums;
    });
    return maxOccupancySums;
};
Bubble.prototype.calcTotalSqFtSums = function () {
    var _this = this;
    var totalSqFtSums = {}, data = this.data;
    // These are the CSV columns we want to iterate through, and a mapping to what we want to access them 
    // as in the returned maxOccupancySums object
    var columns = ['FeederHS', 'Ward', 'Level'], columnMap = { FeederHS: 'feederhs', Ward: 'ward', Level: 'level' };
    columns.forEach(function (column) {
        var items = _this.getUnique(_this.nodes, column), lenItems = items.length, columnSums = [];
        var _loop_3 = function(index) {
            var sumForThisColumn = 0;
            data.forEach(function (node) {
                if (items[index] === node[column]) {
                    if (node['totalSQFT'] !== 'NA' && node['Open_Now'] !== '0') {
                        sumForThisColumn += parseInt(node['totalSQFT']);
                    }
                }
            });
            columnSums.push(sumForThisColumn);
        };
        for (var index = 0; index < lenItems; index++) {
            _loop_3(index);
        }
        ;
        totalSqFtSums[columnMap[column]] = columnSums;
    });
    return totalSqFtSums;
};
Bubble.prototype.getUnique = function (data, column) {
    var items = _.uniq(_.pluck(data, column)).sort();
    return items;
};
Bubble.prototype.move_towards_centers = function (alpha, column) {
    var _this = this;
    // Make an array of unique items
    var that = this, items = this.getUnique(this.nodes, column), unique = [], totalSqFtSums = this.calcTotalSqFtSums(), maxOccupancySums = this.calcMaxOccupancySums();
    items.forEach(function (item) {
        unique.push({ name: item });
    });
    // Calculate the sums of all the unique values of the current budget
    var itemSums = items.map(function (uniqueItem, index) {
        // Makes an array of all the nodes with matching uniqueItem
        var uniqueItems = _this.nodes.filter(function (node) {
            if (node[column] === uniqueItem) {
                return node;
            }
        });
        // returns the sums of the column values
        var sum = _.reduce(uniqueItems, function (a, b) {
            var budget = b[_this.budget];
            if (budget === 'NA') {
                return a;
            }
            return a + parseInt(b[_this.budget]);
        }, 0);
        var col = _this.column.toLowerCase();
        if (_this.per === 'perstudent' && ['ward', 'feederhs', 'level'].indexOf(col) !== -1) {
            return sum / parseInt(maxOccupancySums[col][index]);
        }
        if (_this.per === 'persqft' && ['ward', 'feederhs', 'level'].indexOf(col) !== -1) {
            return sum / parseInt(totalSqFtSums[col][index]);
        }
        return sum;
    });
    // Assign unique_item a point to occupy
    var width = this.sizes.width, height = this.sizes.height, padding = this.sizes.padding;
    for (var i in unique) {
        // Make the grid here
        unique[i].x = (parseInt(i) * width / unique.length) * 0.50 + 250;
        unique[i].y = this.center.y;
    }
    // Attach the target coordinates to each node
    _.each(this.nodes, function (node) {
        for (var i = 0; i < unique.length; i++) {
            if (node[column] === unique[i].name) {
                node.target = {
                    x: unique[i].x,
                    y: unique[i].y
                };
            }
        }
    });
    // Add Text
    var text = this.svg.selectAll('text')
        .data(unique)
        .enter()
        .append('g')
        .attr('transform', function (d) {
        return 'translate(' + (d.x * 1.4 - 200) + ',' + (d.y - 150) + ') rotate(-25)';
    })
        .append('text')
        .attr('class', 'sub_titles');
    // Add the label for the group
    text.append('tspan')
        .text(function (d, i) {
        return d.name;
    });
    // Add the budget's sum for the group
    text.append('tspan')
        .attr('class', 'splitValue')
        .attr('dx', '10')
        .text(function (d, i) {
        var amount = that.round(itemSums[i]);
        if (that.budget === 'SpentPerSqFt') {
            return amount + ' per Sq. Ft.';
        }
        return amount;
    });
    // Send the nodes the their corresponding point
    return function (d) {
        d.x = d.x + (d.target.x - d.x) * (that.damper + 0.02) * alpha;
        d.y = d.y + (d.target.y - d.y) * (that.damper + 0.02) * alpha;
    };
};
Bubble.prototype.make_legend = function () {
    var _this = this;
    var that = this;
    if (get('.legendSvg')) {
        var list = getAll('.legendSvg');
        for (var i = list.length - 1; i >= 0; i--) {
            d3.select(list[i]).remove();
        }
    }
    var numDynamic = [d3.round(this.max), d3.round(this.max / 2), 0], multiplier = [1, 2.2, 2.85, 3.3];
    // Circle Radius Conparison Legend
    var legend = d3.select('#legend_cont')
        .append('svg')
        .attr('class', 'legendSvg')
        .attr('id', 'radiusLegend')
        .attr('width', '244').attr('height', '160');
    legend.selectAll('circle')
        .data(numDynamic)
        .enter()
        .append('circle')
        .attr('cx', 40)
        .attr('cy', function (d, i) { return 50 * multiplier[i]; })
        .style('fill', function (d) { return d === 0 ? '#4a445d' : _this.colorRange.high; })
        .attr('r', function (d) { return _this.radius_scale(d); });
    legend.selectAll('text')
        .data(numDynamic)
        .enter()
        .append('text')
        .attr('x', 95)
        .attr('y', function (d, i) {
        return 49 * multiplier[i] + 5;
    })
        .text(function (d) {
        return that.round(d);
    });
    // District vs Charter Legend
    var schools = ['District Schools', 'Charter Schools'];
    var schoolLegend = d3.select('#legend_cont')
        .append('svg')
        .attr('class', 'legendSvg')
        .attr('id', 'schoolLegend')
        .attr('width', '244').attr('height', '85');
    schoolLegend.selectAll('circle')
        .data(schools)
        .enter()
        .append('circle')
        .attr('cx', 40)
        .attr('cy', function (d, i) {
        return 25 + (i * 30);
    })
        .attr('r', 10)
        .style('fill', function (d, i) {
        if (i === 0) {
            return '#7AA25C';
        }
        return 'orange';
    });
    schoolLegend.selectAll('text')
        .data(schools)
        .enter()
        .append('text')
        .attr('x', 95)
        .attr('y', function (d, i) {
        return 30 + (i * 30);
    })
        .text(function (d, i) {
        return schools[i];
    });
};
Bubble.prototype.add_search_feature = function () {
    // Populate the <select> element with the schools
    for (var i = 0, j = this.nodes.length; i < j; i++) {
        var option = document.createElement('option'), newOption = get('select').appendChild(option), sortedNodes = _.sortBy(this.nodes, 'School');
        newOption.setAttribute('school', sortedNodes[i]['School']);
        newOption.innerHTML = sortedNodes[i]['School'];
    }
    // Fool with the select bar
    var selectForm = get('#select');
    selectForm.addEventListener('change', function (e) {
        // Un-highlight the previously selected node
        if (get('[shown=true]')) {
            var last = get('[shown=true]');
            last.style.fill = last.getAttribute('color');
            last.removeAttribute('shown');
        }
        // == Highlight the selected node
        var circle = document.getElementById(e.target.value);
        circle.style.fill = '#021c2a';
    });
};
Bubble.prototype.reset_svg = function () {
    d3.selectAll('#groupCircles').remove();
    d3.selectAll('.circle').remove();
    d3.selectAll('.sub_titles').remove();
};
Bubble.prototype.graph = function () {
    this.make_svg();
    this.set_force();
    this.create_nodes();
    this.create_bubbles(this.nodes);
    this.update();
    this.add_tootltips();
    this.group_bubbles();
    this.make_legend();
    this.add_search_feature();
    this.calcMaxOccupancySums();
    this.calcTotalSqFtSums();
};
Bubble.prototype.change = function () {
    this.reset_svg();
    this.create_nodes();
    this.create_bubbles(this.nodes);
    this.add_tootltips();
    this.group_bubbles();
    this.make_legend();
    this.add_search_feature();
};
// Utility functions
function get(sel) { var result = document.querySelector(sel); return result; }
function getAll(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
function camel(str) { return str.replace(/(\-[a-z])/g, function ($1) { return $1.toUpperCase(); }); }
