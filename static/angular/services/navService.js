"use strict"

angular.module("PostModern").factory('navService', function($location) {
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