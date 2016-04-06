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
      .when("/current-state", {
          templateUrl: 'static/angular/views/current-state.html',
      })
      .when('/legacy-of-inequities', {
          templateUrl: 'static/angular/views/legacy-of-inequities.html',
      })
      .when('/bubble-chart', {
        templateUrl: 'static/angular/views/under-construction.html'
      })
      .when('/school-map', {
        templateUrl: 'static/angular/views/map.html'
      })
      .when('/appendix', {
          templateUrl: 'static/angular/views/appendix.html',
      })
      .when('/about', {
          templateUrl: 'static/angular/views/about.html',
      })
      .otherwise('/intro')
  }])

