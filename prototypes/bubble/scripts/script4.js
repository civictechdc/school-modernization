function Bubble(data){
   this.data = data;
   this.sizes = {width: 900, height: 1200};

}

Bubble.prototype.printData = function(){
    console.log(this.data.length);
};

Bubble.prototype.make_svg = function(){
    if(document.querySelector('svg')){
        d3.select('svg').remove();
    }
    this.svg = d3.select('#chart').append('svg')
        .attr('width', this.sizes.width)
        .attr('height', this.sizes.height);
};

// Bubble.prototype.add_info = function(){
//     this.data.forEach(function(){
        
//     });
// };

Bubble.prototype.update = function(data){
    this.circles = this.svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('r', 10)
        // .exit().remove()
        ;
};

Bubble.prototype.runit = function(data){
    this.make_svg();
    this.add_info();
    this.update(data);

}

// MAIN()
function main(params){
    d3.csv('data/data_master.csv', function(d){
        var test = params;
        // Make datasets
        // returns data = {all, public, charter}
        var data = (function makeData(){
            var all = [], public = [], charter = [];
            // Cache all data into one dataset
            for (i = 0, j = d.length; i < j; i++){
                all.push(d[i]);
            }
            // Separate d for PUBLIC schools
            for (i = 0, j = all.length; i < j; i++){
                if (d[i].Agency === 'DCPS'){
                    public.push(d[i]);
                }
            }
            // Separate d for CHARTER schools
            for (i = 0, j = all.length; i < j; i++){
                if (d[i].Agency === 'PCS'){
                    charter.push(d[i]);
                }
            }      

           return {
              all : all, // total data
              public : public, // only public schools
              charter: charter // only charter schools
           };
        }());

        // Run the graph
        var bubble = new Bubble(data.public);
            
        var public = document.getElementById('past'),
            charter = document.getElementById('future');
        
        public.addEventListener('click', function(){
            bubble.runit(data.public);
        });
        
        charter.addEventListener('click', function(){
            bubble.runit(data.charter);
        });
            
    });
}
main('test');