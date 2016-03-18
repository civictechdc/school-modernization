'use strict';
var bubble = null;
// (function(that){
    d3.csv('data/data_master.csv', function(data){
        bubble = new Bubble('MajorExp9815'); // data
        var schools = {
            both: data,
            public: (function(d){
                return d.filter(function(item){
                    if (item.Agency === 'DCPS'){
                        return item;
                    }
                });
            }(data)),
            charter: (function(d){
                return d.filter(function(item){
                    if (item.Agency === 'PCS'){
                        return item;
                    }
                });
            }(data))};

        // Run the graph
        bubble.setData(schools.both);
        // bubble.setColumn('MajorExp9815');
        bubble.graph();

        // To change the subdivides, SUBDIVIDES
        var subdivides = Array.prototype.slice.call(getAll('.subdivides'));
        subdivides.forEach(function(item, e){
            item.addEventListener('click', function(e){
                bubble.setColumn(e.target.id);
                bubble.change();
                // bubble.group_bubbles();

                // Change the title
                get('#sub_state').innerHTML = 'Split By:  ' + e.target.dataset.title;
            });
        });

        // To change the bubble radii, BUDGET COLUMNS
        var dataChange = Array.prototype.slice.call(getAll('.dataChange'));
        dataChange.forEach(function(item, e){
            item.addEventListener('click', function(e){  
                bubble.setBudget(e.target.id);
                bubble.change();
                // bubble.group_bubbles();

                // Change the title
                get('#budget_state').innerHTML = e.target.dataset.title;
            });
        });

        // To change the bubble radii, SCHOOL SET
        var schoolChange = Array.prototype.slice.call(getAll('.school'));
        schoolChange.forEach(function(item, e){
            item.addEventListener('click', function(e){  
                bubble.setData(schools[e.target.id]);
                bubble.change();
                // bubble.group_bubbles();

                // Change the title
                get('#school_state').innerHTML = e.target.dataset.title + ' Schools';
            });
        });
    });
// }(this))


// Utility functions
function get(sel){return document.querySelector(sel);}
function getAll(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel));}
function camel(str){ return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase();});}