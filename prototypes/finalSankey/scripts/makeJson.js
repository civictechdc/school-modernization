// GLOBALS
var dataJSON = {},
    jsonFile;

d3.csv('data/DCPS_Master_114_sankey.csv', function(data){
    // console.log(Array.isArray(data)); // true
    // dataMap = data.map(function(num){ return num; })

    //************************************
    // NEED ACTUAL DATA FOR SCALES
    //************************************
        // var maxExpend = d3.max(data, function(d){ return d.FakeExpend; }),
        //     minExpend = d3.min(data, function(d){ return d.FakeExpend; }),
        //     toScale = d3.scale.linear().domain([minExpend, maxExpend]).rangeRound([10, 50]);

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
        // ARRAYS
        var elementarySchools = data.filter(function(data){ return data.Level === 'ES'; }),
            middleSchools = data.filter(function(data){ return data.Level === 'MS'; }),
            joinedSchools = data.filter(function(data){ return data.Level === 'ES/MS'; }),
            highSchools = data.filter(function(data){ return data.Level === 'HS'; });
        
        // These represent the target for the middle schools and high schools
        var firstMSindex = elementarySchools.length;
            firstHSindex = firstMSindex + middleSchools.length,
            firstECindex = firstMSindex + middleSchools.length + highSchools.length;

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
            tempObj.source = getSource();

            switch(data[i].FeederMS){
                case 'Kelly Miller MS':
                    // console.log('kelly');
                    tempObj.target = 69;
                    break;
                case 'Kramer MS':
                    // console.log('kramer');
                    tempObj.target = 70;
                    break;
                case 'Sousa MS':
                    // console.log('sousa');
                    tempObj.target = 71;
                    break;
                case 'Deal MS':
                    // console.log('deal');
                    tempObj.target = 64;
                    break;
                case 'Truesdell or West EC (6th-8th':
                    // console.log('Truesdell');
                    break;
                case 'Brookland MS':
                    // console.log('Brookland');
                    break;
                case 'Cardozo EC (6-8)':
                    // console.log('cardoza');
                    break;
                case 'Hardy MS':
                    // console.log('hardy');
                    tempObj.target = 66;
                    break;
                case 'Hart MS':
                    // console.log('hart');
                    tempObj.target = 67;
                    break;
                case 'Stuart-Hobson MS':
                    // console.log('stuart-hobson');
                    break;
                case 'McKinley MS':
                    // console.log('mckinley');
                    break;
                case 'Col Hts. Ed. Campus (6-8)':
                    // console.log('col heights');
                    break;
                case 'Eliot-Hine MS':
                    // console.log('eliot');
                    tempObj.target = 65;
                    break;
                case 'Jefferson Acad. MS':
                    // console.log('jefferson');
                    tempObj.target = 68;
                    break;
                case 'noMiddleSchool':
                    // console.log('is a mixed school');
                    break;


                default:
                    console.log('other');
                    break;
            }
            tempObj.value = 10; // toScale of school expenditure
            console.log(tempObj);
            links.push(tempObj);
        }
            // Middle
        for(var m = 0, n = middleSchools.length; m < n; m++){
            var tempObj = {};
            // tempObj.source = firstMSindex + parseInt([m]);
            tempObj.source = getSource();

            tempObj.target = firstMSindex;
            tempObj.value = 10; // toScale of school expenditure
            links.push(tempObj);
        }
            // High
        for(var i = 0, j = highSchools.length; i < j; i++){
            var tempObj = {};
            // tempObj.source = firstHSindex + parseInt([i]);
            tempObj.source = getSource();
            tempObj.target = i;
            tempObj.value = 10; // toScale of school expenditure

            links.push(tempObj);
        }
            // Education Centers
        for(var i = 0, j = joinedSchools.length; i < j; i++){
            var tempObj = {};
            // tempObj.source = firstECindex + parseInt([i]);
            tempObj.source = getSource();
            tempObj.target = i;
            tempObj.value = 10; // toScale of school expenditure

            links.push(tempObj);
        }

        // The dataJSON object is what will be JSON.stringified into the JSON file 
        // that will be used to map the points on the graph 
        dataJSON.nodes = nodes;
        dataJSON.links = links;
        
        // This turns our data object into the JSON file we will use
        jsonFile = JSON.stringify(dataJSON);


        //************************
        // FUNCTIONS
        //************************

        // Creates a temporary object, fills is with the names of the schools, then push names array
        function addToNodes(x){
            for(var m = 0, n = x.length; m < n; m++){
                var tempObj = {};
                tempObj.name = x[m].School || 'unknown EC';
                tempObj.node = getNode();
                nodes.push(tempObj);
            }
        }

        // Returns the sum off all FakeExpends
        function getTotalExpenditure(){
            var totalExpenditures = 0,
                i = 0,
                j = data.length;
            for(; i < j; i++){
                totalExpenditures += parseInt(data[i].FakeExpend);
            }
            return totalExpenditures;
        }

        
});

// toScale(data[i].FakeExpend)



