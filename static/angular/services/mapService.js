"use strict"

angular.module("PostModern").factory('mapService', function() {
    console.log("ang:mapService");
    var filterSelector = initApp("storyMap");
    return filterSelector;
  })