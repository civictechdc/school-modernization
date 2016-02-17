'use strict';

angular.module("PostModern", ['ngRoute'])
  .config(["$routeProvider", function($routeProvider) {
      $routeProvider.when("/story/:name", {
          controller: 'storyCtrl',
          templateUrl: 'static/angular/story.html',
      })
  }])
  .controller('storyCtrl', function($scope, navService, storyService) {

    var fs = initApp("storyMap");
    fs("District", "ES", "spendLifetime", "FeederMS", "storyMap");

    var path = navService.GetPath();
    $scope.story = storyService[path.path];
  })
  .controller('navCtrl', function($scope, navService) {
    $scope.paths = navService.GetPaths()         
    $scope.callSetPath = function(idx) {
      navService.SetPath(idx); 
    }
  })
  .factory('navService', function($location) {
    var currentIdx = 0;
    var paths = [
      { path: 'intro', text: "Introduction", active: true},
      { path: 'dig-out', text: "Digging Out"},
      { path: 'dig-in', text: "Modernized"},
      { path: 'branch-off', text: "Charters Built"},
    ];

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
    var stories = { 
      "intro": {
        title: "Take a retrospective look at School Spending in DC",
        para: "Since 1998, Washington school facilities have gone under enormous transformation, with more than $4 billion spent on district and charter schools.\nUnfortunately, spending data has not been available until now.\nThe aim of this site is to provide a holistic view of how Washington has allocated its resources and to bring historical perspective to future budget discussions."
      },
      "dig-out": {
        title: "The DC Government Spent $1.2 Billion to Bail the Public Schools Out",
        para: "Beginning in the late 1980's, Washington school facilities were decrepit and unfit for daily operations.\nStarting in 1998 and over the next 15 years, the city would spend more than $1B for basic building needs to eliminate its backlog of unhealthy, unsafe and unworkable conditions.  Projects included replacing roofs, installing HVAC systems, replacing windows and building security systems among other projects.\nThis initial $1B investment in basic facility needs would set the stage for full-scale modernization of our public schools.",
      },
      "dig-in": {
        title: "Between 2002 and 2015 Over 2.6 Billion was spent Modernizing Public Schools",
        para: "While instituting these basic building needs, the city embarked on a major modernization program, which would expend $2.6B through 2015.",
      },
      "branch-off": {
        title: "In 1998 The Charter School System Lauched in DC",
        para: "Decades of disinvestment before 2000 helped drive families to charter schools. Starting in 1998 charter schools secured a per student facility allowance, allowying them to lease, buy and improve facilities. Since 1998, charter schools have received $963 million from the District.",
      },
    }
    return stories;
  });
