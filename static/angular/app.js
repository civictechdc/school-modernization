'use strict';

angular.module("PostModern", ['ngRoute'])
  .config(["$routeProvider", function($routeProvider, navService) {
      console.log("ang:routeProvider");
      $routeProvider.when("/intro", {
          templateUrl: 'static/angular/views/intro.html',
      })
      .when("/dig-out", {
          templateUrl: 'static/angular/views/dig-out.html',
      })
      .when('/appendix', {
          templateUrl: 'static/angular/views/appendix.html',
      })
      .when('/about', {
          templateUrl: 'static/angular/views/about.html',
      })
      .otherwise('/intro')
  }])
  
  .factory('mapService', function() {
    console.log("ang:mapService");
    var filterSelector = initApp("storyMap");
    return filterSelector;
  })
  .factory('navService', function($location) {
    console.log("ang:navService");

    var currentIdx = 0;
    var paths = [
      { path: 'dig-out', text: "Digging Out"},
      { path: 'dig-in', text: "Modernized"},
      { path: 'branch-off', text: "Charters Built"},
      { path: 'planned', text: "Future Spend"},
    ];

    var cp = $location.path().split('/')[2]
    currentIdx = paths.findIndex(x => x.path == cp)
    if (currentIdx == -1) {
        currentIdx = 0;
    }
    paths[currentIdx].active = true;

    return {
      'SetPath': function(idx) {
        paths[currentIdx].active = false;
        currentIdx = idx;
        paths[idx].active = true;
        return paths[idx]
      },
      'GetPath': function() {
        return paths[currentIdx]
      },
      'GetPaths': function() {
        return paths
      },
    }
  })
  .factory('storyService', function($location) {
    console.log("ang:storyService");
    var stories = {
      "intro": {
        title: "Take a retrospective look at School Spending in DC",
        para: "Since 1998, Washington school facilities have gone under enormous transformation, with more than $4 billion spent on district and charter schools.\nUnfortunately, spending data has not been available until now.\nThe aim of this site is to provide a holistic view of how Washington has allocated its resources and to bring historical perspective to future budget discussions."
      },
      "dig-out": {
        title: "Digging Out: Stabilizing DCPS Facilities",
        para: "In 1995, DCPS buildings and grounds were unhealthy, unsafe, unpleasant, and under-utilized.  The accumulation of deferred maintenance was est imated at $1.2 billion in 2015 dollars. From 1999-2015 the D.C. Council appropriated $1 billion to bring DCPS facilities up to a minimum standard and reduce the amount of under utilized space in DCPS schools that had resulted from dramatic city population decline.",
        mapDisplay: function(filterSelector) {
            filterSelector("District", null, null, "Ward", "spendAmount", "storyMap");
        },
      },
      "dig-in": {
        title: "Progress: DCPS Modernizations 2000-2015",
        para: "Using 21st century facilities standards for health, sustainability, education and community use, DCPS embarks upon an unprecedented modernization program.",
        mapDisplay: function(filterSelector) {
            filterSelector("District", null, "spendPast", "Ward", "spendAmount", "storyMap");
        },
      },
      "branch-off": {
        includeTop: true,
        mapDisplay: function(filterSelector) {
            filterSelector("Charter", null, null, "Ward", "spendAmount", "storyMap");
        },
      },
      "planned": {
        includeTop: true,
        mapDisplay: function(filterSelector) {
            filterSelector("District", null, "spendPlanned", "Ward", "spendSqFt", "storyMap");
        },
        bubbleDisplay: function(selector) {
          // make_plan_bubbles(selector); 
          // Parameters to pass in
          // 1) Type of spend (column)
          // 2) Public, Charter, or Both
          // 3) Categories (split by level, agency, ward, feeders)
        }
      }
    }
    return stories;
  });

// Document progress
