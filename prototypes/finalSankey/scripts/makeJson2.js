// GLOBALS
var dataJSON = {},
    csvData,
    jsonFile;

d3.csv('data/DCPS_Master_114_sankey.csv', function(data){ 
    csvData = data; });

var nodes = [],
    links = [];

var getNode = (function(){
    var node = 0;
    return function(){
       return node++;
    };
}());

var getSource = (function(){
    var source = 0;
    return function(){
       return source++;
    };
}());

