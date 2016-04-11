'use strict';


angular.module("PostModern", ['ngRoute', 'ngCookies'])
  .config(["$routeProvider", function($routeProvider) {
      $routeProvider.when("/intro", {
          templateUrl: 'static/angular/views/intro.html',
      })
      .when("/dig-out", {
          templateUrl: 'static/angular/views/dig-out.html',
      })
      .when("/progress", {
          templateUrl: 'static/angular/views/progress.html',
      })
      .when('/bubble-chart', {
        templateUrl: 'static/angular/views/bubble.html'
      })
      .when('/school-map', {
        templateUrl: 'static/angular/views/map.html'
      })
      .when('/resources', {
          templateUrl: 'static/angular/views/appendix.html',
      })
      .when('/about', {
          templateUrl: 'static/angular/views/about.html',
      })
      .otherwise('/intro');
  }])
  .controller("mainCtrl", ["$scope", "$cookies", function($scope, $cookies) {
    var cookVal = $cookies.get('visited');
    $scope.visited_before = cookVal === 'yes';
    if (!$scope.visited_before) {
      $cookies.put('visited', 'yes', {
        expires: new Date(2020, 1, 1),
      });

      $scope.modalVisibility = {display: 'block'};
      $scope.modalClose = function() {
        $scope.modalVisibility.display = 'none';
      };
    }
}]);

