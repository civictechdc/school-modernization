'use strict';
// var bubble = null;
(function(){
    // d3.csv('data/data_master.csv', function(data){
    // d3.csv('data/data_openschools_master_214.csv', function(data){
    d3.csv('data/data_master_321.csv', function(data){
        var bubble = new Bubble('MajorExp9815'); // data
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
            }(data))}; // return both, public, charter

        // Run the graph
        bubble.setData(schools.both);
        bubble.graph();

        // To change the subdivides, SUBDIVIDES
        var subdivides = Array.prototype.slice.call(getAll('.subdivides'));
        subdivides.forEach(function(item, e){
            item.addEventListener('click', function(e){
                subdivides.forEach(function(sel){
                    if(sel.classList.contains('selected')){
                        sel.classList.remove('selected');
                    }
                });
                bubble.setColumn(e.target.id);
                bubble.change();
                makeSelected(e);
                // Change the title
                // get('#sub_state').innerHTML = 'Split By:  ' + e.target.dataset.title;
            });
        });

        // To change the bubble radii, BUDGET COLUMNS
        var dataChange = Array.prototype.slice.call(getAll('.dataChange'));
        dataChange.forEach(function(item, e){
            item.addEventListener('click', function(e){  
                dataChange.forEach(function(sel){
                    if(sel.classList.contains('selected')){
                        sel.classList.remove('selected');
                    }
                });
                bubble.setBudget(e.target.id);
                bubble.change();
                makeSelected(e);
                // Change the title
                // get('#budget_state').innerHTML = e.target.dataset.title;
            });
        });

        // To change the bubble radii, SCHOOL SET
        // var schoolChange = Array.prototype.slice.call(getAll('.school'));
        // schoolChange.forEach(function(item, e){
        //     item.addEventListener('click', function(e){ 
        //         schoolChange.forEach(function(sel){
        //             if(sel.classList.contains('selected')){
        //                 sel.classList.remove('selected');
        //             }
        //         });
        //         bubble.setData(schools[e.target.id]);
        //         bubble.change();

        //         // Change the title
        //         // get('#school_state').innerHTML = e.target.dataset.title + ' Schools';
        //     });
        // });
    });
}())


// Utility functions
function makeSelected(e){e.target.classList.add('selected');}
function get(sel){return document.querySelector(sel);}
function getAll(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel));}
function camel(str){ return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase();});}

