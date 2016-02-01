// GLOBALS
var dataforJSONfile = {},
    jsonFile;

d3.csv('data/DCPS_Master_114_sankey.csv', function(data){

    //************************************
    // SCALES
    //************************************
    var maxExpend = d3.max(data, function(d){ return +d.MajorExp9815; }),
        minExpend = d3.min(data, function(d){ return +d.MajorExp9815; }),
        toScale = d3.scale.linear().domain([+minExpend, +maxExpend]).rangeRound([3, 35]);

    //************************************
    // NEED ACTUAL DATA FOR SCALES
    //************************************
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

    // Break the data up by school; 
    var elementarySchools = data.filter(function(data){ return data.Level === 'ES'; }),
        middleSchools = data.filter(function(data){ return data.Level === 'MS'; }),
        joinedSchools = data.filter(function(data){ return data.Level === 'ES/MS'; }),
        highSchools = data.filter(function(data){ return data.Level === 'HS'; });

    //**********************************************
    // FILLS THE NODES AND LINKS IN A SINGLE OBJECT
    //**********************************************

    // NODES    
    //--------------------------------------------------------------------------

    addToNodes(elementarySchools); // elemetary
    addToNodes(middleSchools); // middle
    addToNodes(joinedSchools); // joined centers
    addToNodes(highSchools); // high

    // LINKS
    //--------------------------------------------------------------------------
    
    // Elementary
    for(var i = 0, j = elementarySchools.length; i < j; i++){
        var tempObj = {};
        // SET SOURCE
        tempObj.source = getSource();

        // SET TARGET
        if(elementarySchools[i].FeederMS){
            switch(elementarySchools[i].FeederMS){
                case 'Kelly Miller MS':
                    // console.log('kelly');
                    tempObj.target = 68;
                    break;
                case 'Kramer MS':
                    // console.log('kramer');
                    tempObj.target = 69;
                    break;
                case 'Sousa MS':
                    // console.log('sousa');
                    tempObj.target = 70;
                    break;
                case 'Deal MS':
                    // console.log('deal');
                    tempObj.target = 63;
                    break;
                case 'Truesdell or West EC (6th-8th)':
                    // console.log('Truesdell');
                    tempObj.target = 78;
                    break;
                case 'Brookland MS':
                    // console.log('Brookland');
                    tempObj.target = 73;
                    break;
                case 'Cardozo EC (6-8)':
                    // console.log('cardoza');
                    tempObj.target = 92;
                    break;
                case 'Hardy MS':
                    // console.log('hardy');
                    tempObj.target = 65;
                    break;
                case 'Hart MS':
                    // console.log('hart');
                    tempObj.target = 66;
                    break;
                case 'Stuart-Hobson MS':
                    // console.log('stuart-hobson');
                    tempObj.target = 72;
                    break;
                case 'McKinley MS':
                    // console.log('mckinley');
                    tempObj.target = 96;
                    break;
                case 'Col Hts. Ed. Campus (6-8)':
                    // console.log('col heights');
                    tempObj.target = 85;
                    break;
                case 'Eliot-Hine MS':
                    // console.log('eliot');
                    tempObj.target = 64;
                    break;
                case 'Johnson MS':
                    // console.log('johnson');
                    tempObj.target = 71;
                    break;
                case 'Jefferson Acad. MS':
                case 'Jefferson Middle School':
                    // console.log('jefferson');
                    tempObj.target = 67;
                    break;
                case 'noMiddleSchool':
                    // console.log('is a mixed school');
                    tempObj.target = 69;
                    console.log(elementarySchools[i].School, elementarySchools[i].FeederMS);
                    break;
                default:
                    // console.log('other MS');
                    console.log(elementarySchools[i].School, elementarySchools[i].FeederMS);
                    tempObj.target = 69;
                    break;
            }            
        }

        // SET VALUE
        if(elementarySchools[i].MajorExp9815){
            tempObj.value = toScale(elementarySchools[i].MajorExp9815);
        } // toScale of school expenditur
        links.push(tempObj);
    }
    
    // Middle
    for(var m = 0, n = middleSchools.length; m < n; m++){
        var tempObj = {};
        // SET SOURCE
        tempObj.source = getSource();

        // SET TARGET
        if(middleSchools[m].FeederHS){
            switch(middleSchools[m].FeederHS){
                case 'Woodson HS':
                    tempObj.target = 93;
                    break;
                case 'Wilson HS':
                    tempObj.target = 90;
                    break;
                case 'Roosevelt HS':
                    tempObj.target = 94;
                    break;
                case 'Anacostia HS':
                    tempObj.target = 87;
                    break;
                case 'Eastern HS':
                    tempObj.target = 89;
                    break;
                case 'Coolidge HS':
                    tempObj.target = 88;
                    break;
                case 'Dunbar HS':
                    tempObj.target = 91;
                    break;
                case 'Ballou HS':
                    tempObj.target = 95;
                    break;
                case 'Cardozo EC (9-12)':
                    tempObj.target = 92;
                    break;
                default:
                    console.log(middleSchools[m].School, middleSchools[m].FeederHS);
                    break;
            } 
        }

        // SET VALUE 
        // For every middle school, get the value of all the elementary schools that feed into it
        
        // Get the pattern number from the middle school
        var pattern = middleSchools[m].FeederMSNum;
        
        // Loop through all the elementary schools to find the ones with that same pattern (filter), 
        // create an array of all the expenditures (map), and add the values (reduce)
        var value = elementarySchools.filter(function(item){ if(item.FeederMSNum === pattern){ return item; }})
                                     .map(function(item){ return toScale(item.MajorExp9815); })
                                     .reduce(function(prev, curr){return prev + curr;});
        // Assign that value to tempObj.value
        tempObj.value = value;
        links.push(tempObj);
    }

    // Elementary / Middle Mixed Schools
    for(var i = 0, j = joinedSchools.length; i < j; i++){
        var tempObj = {};
        // SET SOURCE
        tempObj.source = getSource();

        // SET TARGET
        if(joinedSchools[i].FeederHS){
            switch(joinedSchools[i].FeederHS){
                case 'Woodson HS':
                    tempObj.target = 93;
                    break;
                case 'Wilson HS':
                    tempObj.target = 90;
                    break;
                case 'Roosevelt HS':
                    tempObj.target = 94;
                    break;
                case 'Anacostia HS':
                    tempObj.target = 87;
                    break;
                case 'Eastern HS':
                    tempObj.target = 89;
                    break;
                case 'Coolidge HS':
                    tempObj.target = 88;
                    break;
                case 'Dunbar HS':
                    tempObj.target = 91;
                    break;
                case 'Ballou HS':
                    tempObj.target = 95;
                    break;
                case 'Cardozo EC (9-12)':
                    tempObj.target = 92;
                    break;
                default:
                    console.log(joinedSchools[i].School, joinedSchools[i].FeederHS);
                    break;
            }
        }            

        // SET VALUE           
        if(joinedSchools[i].MajorExp9815){
            tempObj.value = toScale(joinedSchools[i].MajorExp9815);
        } // toScale of school expenditure
        links.push(tempObj);
    }

    // The dataforJSONfile object is what will be JSON.stringified into the JSON file 
    // that will be used to map the points on the graph 
    dataforJSONfile.nodes = nodes;
    dataforJSONfile.links = links;

    // This turns our data object into the JSON file we will use
    jsonFile = JSON.stringify(dataforJSONfile);

    //************************
    // FUNCTIONS
    //************************

    // Creates a temporary object, fills is with the names of the schools, then push names array
    function addToNodes(x){
        for(var m = 0, n = x.length; m < n; m++){
            var tempObj = {};
            tempObj.node = getNode();
            tempObj.name = x[m].School || 'unknown EC';                
            nodes.push(tempObj);
        }
    } 
});
