'use strict';

angular.module("PostModern").factory('storyService', function($location) {
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