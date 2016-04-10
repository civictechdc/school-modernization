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
      .when("/progress", {
          templateUrl: 'static/angular/views/progress.html',
      })
      .when('/legacy-of-inequities', {
          templateUrl: 'static/angular/views/legacy-of-inequities.html',
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
      .otherwise('/intro')
  }])

