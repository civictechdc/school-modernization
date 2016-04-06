'use strict';
(function(){
    d3.csv('data/data_master_321.csv', function(data){
        var bubble = new Bubble('LifetimeBudget'); // data

        // Filter the data
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
            }(data))
        };

        // To change the subdivides, CATEGORY
        // District vs Charter, Grade Level, Ward, Feeder Pattern
        var subdivides = Array.prototype.slice.call(getAll('.subdivides'));
        subdivides.forEach(function(item, e){
            item.addEventListener('click', function(e){
                subdivides.forEach(function(sel){
                    if(sel.classList.contains('selected')){
                        sel.classList.remove('selected');
                    }
                });

                // Reset available school data changes
                get('#both').classList.remove('invalid');
                get('#public').classList.remove('invalid');
                get('#charter').classList.remove('invalid');


                if(e.target.id === 'FeederHS'){
                    bubble.setData(schools['public']);
                    get('#both').classList.remove('selected');
                    get('#charter').classList.remove('selected');
                    get('#public').classList.add('selected');

                    // Make charter-only budget unavailable, because charter schools dont have feeder information
                    get('#charter').classList.add('invalid');
                    get('#both').classList.add('invalid');
                }
                if(e.target.id === 'Agency'){
                    bubble.setData(schools['both']);
                    get('#both').classList.add('selected');
                    get('#charter').classList.remove('selected');
                    get('#public').classList.remove('selected');

                    // Make charter-only budget unavailable, because a split by Agecy should show both agencies
                    get('#charter').classList.add('invalid');
                    get('#public').classList.add('invalid');

                }
                bubble.setColumn(e.target.id);
                bubble.change();
                makeSelected(e);

                // Change the title
                get('#sub_state').innerHTML = e.target.innerHTML;
            });
        });

        // To change the bubble radii, BUDGET COLUMNS
        // Past, Future, Lifetime, Per Sq Ft
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
                get('#budget_state').innerHTML = e.target.innerHTML;
            });
        });

        // To change the bubble radii, SCHOOL SET
        // District Schools, Charter Schools, All Schools
        var schoolChange = Array.prototype.slice.call(getAll('.school'));
        schoolChange.forEach(function(item, e){
            item.addEventListener('click', function(e){ 
                schoolChange.forEach(function(sel){
                    if(sel.classList.contains('selected')){
                        sel.classList.remove('selected');
                    }
                });
                bubble.setData(schools[e.target.id]);
                bubble.change();
                makeSelected(e);

                // Change the title
                get('#school_state').innerHTML = e.target.innerHTML;
            });
        });

        // Run the graph
        get('#Agency').classList.add('selected');
        get('#LifetimeBudget').classList.add('selected');
        get('#both').classList.add('selected');
        bubble.setData(schools.both);
        bubble.setColumn('Agency');
        bubble.graph();

    });
}());


// Utility functions
function makeSelected(e){e.target.classList.add('selected');}
function get(sel){return document.querySelector(sel);}
function getAll(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel));}
function camel(str){ return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase();});}

