'use strict';

angular.module("PostModern", ['ngRoute'])
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
        // templateUrl: 'static/angular/views/bubble.html'
        templateUrl: 'static/angular/views/working.html',
      })
      .when('/school-map', {
        // templateUrl: 'static/angular/views/map.html'
        templateUrl: 'static/angular/views/working.html',
      })
      .when('/resources', {
          templateUrl: 'static/angular/views/appendix.html',
      })
      .when('/about', {
          templateUrl: 'static/angular/views/about.html',
      })
      .otherwise('/intro');
  }]);
