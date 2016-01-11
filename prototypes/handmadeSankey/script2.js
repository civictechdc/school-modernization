'use strict';

// UTILITY SELECTION FUNCTION
var $ = function(sel){return document.querySelector(sel);},
	 $$ = function(sel){return document.querySelectorAll(sel);},
  asMoney = d3.format('$,.2f'),
  asPercent = d3.format('%'),
  csvData,
  wardData,
  wards
  ;

// **************************************
// SVG SETUP
// **************************************

var sizes = {
		h: 1200,
		w: 700,
		p: 15,
		multiplier: 3
	},
	rectProperties = {
		width: 40,
		color: '#116699'
	},

	lineFor = {
		elementarySchool: 200,
		middleSchool: 300,
		highSchool: 400
	},
	pathColor = '#000', //"#f0f0f0",
	pathHoverColor = '#d0d0d0',

	rectsTowardsWardsProperties = {
		x: 15,
		width: 250 //185

	};

var svg = d3.select('#chart')
	.append('svg')
	.attr('height', sizes.h)
	.attr('width', sizes.w)
	.attr('class', 'svgChart')
	;

// **************************************
// AJAX CALL FOR CSV
// **************************************

d3.csv('DCPS-schools-types_onlyESMSHS.csv', function(data){
	
	// Data Accessors
	csvData = data;
	data.sort(function(a,b){return a.Ward - b.Ward;});
	wards = propogateAllWards();
	wardData = (function(){
		var data = [];
		for(var i = 1; i <= 8; i++){
			data.push(getExpenditureByWard(i));
		}
		return data;
	}());


	// **************************************
	// SCALES
	// **************************************
	
	var maxExpend = d3.max(csvData, function(d){ return d.FakeExpend; }),
		 minExpend = d3.min(csvData, function(d){ return d.FakeExpend; }),
		 toScale = d3.scale.linear().domain([minExpend, getTotalExpenditure()]).rangeRound([0, sizes.h]);


	// **************************************
	// BUILDING THE GRAPH
	// **************************************

	// Build total expenditure block
	var rect = svg.append('rect')
		.attr({
			class: 'genFundsRect',
			width: rectProperties.width,
			height: toScale(getTotalExpenditure()),
			fill: rectProperties.color
		});
	
	// Builds the rects/paths towards the ward blocks
	var rectsTowardsWards = svg.append('g').attr('id', 'rectsTowardsWards').selectAll('rect')
		.data(wardData)
		.enter()
		.append('rect')
		.attr({
			class:'rectsTowardsWards',
			wardNum: function(d,i){ return i + 1; }
		})
		.attr({
			width: rectsTowardsWardsProperties.width,
			height: function(d){ return toScale(d) - sizes.p; },
			fill: pathColor,
			x: function(d){ return getRightEdge($('.genFundsRect')) },
			y: function(d,i){ 
				return toScale(getSum(wardData, (i-1)) - getExpenditureByWard(0)); 
			} 
		})
		.append('title')
		.text(function(d, i){
			return 'Ward ' + (i+1) + ': ' + asMoney(d.FakeExpend);
		});


	// Builds the ward blocks
	var rectsForWards = svg.append('g').attr('class', 'wardRectangles').selectAll('rect')
		.data(wardData)
		.enter()
		.append('rect')
		.attr({
			class:'rectsForWards',
			id: function(d,i){ return 'wardNum' + (i + 1); }
		})
		.attr({
			width: rectProperties.width,
			height: function(d){ return toScale(d) - sizes.p; },
			fill: function(d, i){
					// var colorByWard = ['darkgreen', 'crimson', 'tomato', 
     //              'dodgerblue', 'steelblue', 'mediumorcid', 
     //              'rebeccapurple', 'forestgreen' ],

     //           ward = parseInt(i);
     //           return colorByWard[ward - 1];
     				return rectProperties.color;
				},
			x: function(d){ return getRightEdge($('.genFundsRect')) + getRightEdge($('.rectsTowardsWards')) } , // dummy figure
			y: function(d,i){ 
				return toScale(getSum(wardData, (i-1)) - getExpenditureByWard(0)); 
			} 
		});
	
	// Builds the lines for the individual schools	
	createIndividualSchoolLines();

	//****************************************************
	// TEXT ELEMENTS
	//****************************************************

	// Text to indicate the general funnds bar
	svg.append('g').attr('id', 'genFundsText')
		.append('text')
		.text(function(){
			return 'Total Expendture: General Funds: ' + asMoney(getTotalExpenditure());
		})
		.attr({
			transform: 'translate(-575,700) rotate(270)',
			y: function(){
				return (toScale(getTotalExpenditure())/2);
			}
		})
		.attr('font-size', '18')
		;



	// Text for .rectsTowardsWards
	// -- Adds the ward numbers with the amount of money going to them
	makeTextElement('wardText', wardData)
		.text(function(d,i){ 
		 	var str = 'Ward ' + (i+1) + ': \n' + asMoney(d);
		 	return str; 
		})
		.attr({
			x: function(d){ 
				return getRightEdge($('.genFundsRect')) + 35; 
			},
			y: function(d,i){ 
				return (toScale(getSum(wardData, (i-1)) 
					- getExpenditureByWard(0))) 
					+ sizes.p+(getSvgHeight($$('.rectsTowardsWards')[i])/2); 
			}
		})
		.attr('font-size', '14')
		;

//####################################################################################
//
//    UTILITY FUNCTIONS
//
//####################################################################################

	function makeTextElement(idName, dataset){
		var text = svg.append('g').attr('id', idName)
			.selectAll('text')
			.data(dataset)
			.enter()
			.append('text');
		return text;
	}

	function createIndividualSchoolLines(){
		var index = 0,
			 j = wards.length;

		for(; index<j; index++){

			svg.append('g').attr({
					id: function(){ return 'ward' + (index + 1) + 'Lines' },
					transform: function(d,i){
						var y = 0;
						for(var i = 0, j = index; i < j; i++){
							y -= (getHeight($('#wardNum' + (i+1))) - sizes.p);
						}

						return 'translate(0,' + y + ')';
					}
				})
				.selectAll('rect')
				.data(wards[index])
				.enter()
			.append('rect')
			.attr({
				class: 'wardLine',
				height: function(d){
					// var tempMin = d3.min(wards[index], function(d){ return d.FakeExpend; }),
					// 	 tempMax = d3.max(wards[index], function(d){ return d.FakeExpend; }),
					// 	 tempScale = d3.scale.linear().domain([tempMin, tempMax]).rangeRound([2, 8]);

					// //console.log(tempScale(d.FakeExpend));
					// return tempScale(d.FakeExpend);
					return 5;
				},
				width: function(d){
					if(d.SchoolType === 'ES'){ return lineFor.elementarySchool;} 
						else if(d.SchoolType === 'MS'){ return lineFor.middleSchool;} 
						else if(d.SchoolType === 'HS'){ return lineFor.highSchool; } 
						else { return 75; }
		        }
		   	// return 
		   	,
		      x: getRightEdge($('#wardNum1')) +
		      	getRightEdge($('.genFundsRect')) + 
		      	getRightEdge($('.rectsTowardsWards')),
		      y: function(d, i){     	
		      		var baseHeight = 0,
		      			h = getSvgHeight($('#wardNum' + (index+1))),
		      			individualSchool = (i * (h / wards[index].length));
		      		return baseHeight + individualSchool;
		      },
		      fill: pathColor
			})
			.append('title')
			.text(function(d){
				return d.School + ': ' + asMoney(d.FakeExpend);
			});
		}
	}

	function getWard(ward){
		var arr = [];
		for(var i=0, j=data.length; i < j; i++){
			if(csvData.Ward === +ward){
				arr.push(csvData.Ward);
			}
		}
		return arr;
	};

	
	function getSvgHeight(svg){
		try {
			return svg.height.animVal.value;
		}
		catch(err) {
			console.log('not svg');
		}

	}

	function getSum(arr, index){
	  if(index > arr.length){
		 return 'Second arg is out of range.';
	  } 
	  var i = 0,
			j = index + 1,
			sum = 0;
	  for(; i < j; i++){
		 sum += arr[i];
	  } 
	  return sum;
	}

	function getExpenditureByWard(ward){
	 var i = 0,
		  j = csvData.length,
		  wardTotal = 0,
		  enteredWard = parseInt(ward);

	 for(; i < j; i++){
		if(parseInt(csvData[i].Ward) === enteredWard){
		  wardTotal += parseInt(csvData[i].FakeExpend);
		}
	 }
	 return wardTotal;
	};

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

	function getRightEdge(el){
	  var bounds =  el.getBoundingClientRect();
	  return bounds.right - bounds.left;
	}

	function getHeight(el){
	  var bounds =  el.getBoundingClientRect();
	  return bounds.top - bounds.bottom;
	}

	// Returns an array of an array of objects of the indicated ward
	// wards[ward-1][school]
	function propogateAllWards(){
		var allWards = [];
		
		// pushes all the wards(arrays) into one array
		for(var i=0, j=getNumWards(); i<j; i++){
			allWards.push(propogateWard(i+1));
		}

		// returns the number of total wards
		function getNumWards(){
			var len = 0,
				i = 0,
				j = data.length;
			for(; i<j; i++){
				if(+data[i].Ward > len){
					len = +data[i].Ward;
				}
			}
			return len;
		}

		// returns an array of objects of all appropiate schools of an indicated ward
		function propogateWard(ward){
			var arr = [],
				i = 0,
				j = data.length;

			for(; i<j; i++){
				if(+data[i].Ward === parseInt(ward)){
					arr.push(data[i]);
				}
			}
			return arr;
		}
		return allWards;
	}	
});


