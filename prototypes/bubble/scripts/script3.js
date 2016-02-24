// 
//**********************************************
var Bubble = (function(dataset){


    // Utility functions
    var get = function(sel){return document.querySelector(sel);},
        getAll = function(sel){return document.querySelectorAll(sel);},
        asMoney = d3.format('$,');

    // Define the Datasets
    var schools = (function(){
        var all = [], public = [], charter = [];
        
            // Cache all data into one dataset
            for (i = 0, j = dataset.length; i < j; i++){
                all.push(dataset[i]);
            }
            // Separate dataset for PUBLIC schools
            for (i = 0, j = all.length; i < j; i++){
                if (dataset[i].Agency === 'DCPS'){
                    public.push(dataset[i]);
                }
            }
            // Separate dataset for CHARTER schools
            for (i = 0, j = all.length; i < j; i++){
                if (dataset[i].Agency === 'PCS'){
                    charter.push(dataset[i]);
                }
            }      

       return {
          all : all, // total data
          public : public, // only public schools
          charter: charter // only charter schools
       };
    }());
    var sizes = {width: 900, height: 1200};
    var svg = d3.select('#chart')
                .append('svg')
                .attr('height', sizes.height)
                .attr('width', sizes.width)
                ;

    var update = function(dataset){
        svg.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr("r", 0)
            .attr('x', Math.random()* sizes.height)
            .attr('y', Math.random()* sizes.width)            
            .style({
                'fill': 'green',
                'stroke': 'black',
                'stroke-width': 1,
                'opacity': 0.8
            })
            .transition()
            .duration(1000)
            .attr('r', 10)
            .attr('x', Math.random()* sizes.height)
            .attr('y', Math.random()* sizes.width)
        ;
    }

    // Return the functions necessary to do the graph in the main()
    // 
    return {
        schools: schools,
        update: update
    };
}());

d3.csv('data/data_master.csv', function(d){
    Bubble(d);
});
