/**
 * Use a combination of data attributes and classes to monitor filter state
 */

$(document).ready(function(){
    $(".filter").off("click");

    $(".filter").on("click", clickFilter);

    $("#FeederHS").on("click", function() {
        disable(["#Charter", "#All"]);
    });
    $("#Ward").on("click", function() {
        enable(["#Charter", "#All"]);
    });
});

// call back for filter selection
function clickFilter(e) {
    if($(this).hasClass("deactivated")) {
        return;
    }
    
    var category = $(this).data("category"); // pull the category from the data-category attribute
    $(".filter[data-category="+category+"]").removeClass("selected"); //deselect every filter in this category
    $(this).addClass("selected"); // select the clicked filter

    // business logic goes here, for this prototype we just display/print the selected filters
    updateFilterText();
    console.log(JSON.stringify(getFilterState()));
}

// print all selected filter ids
function updateFilterText() {
    var selections = $.map($(".filter.selected"), function(selection) {
        return selection.id;
    });
    $("#filter-selection-text").text(selections.join(", "));
}

// enable any number of filters
function enable(targets) {
    $.each(targets, function(i, target) {
        $(target).removeClass("deactivated");
        $(target).addClass("active");
    });
}

// disable any number of filters
function disable(targets) {
    $.each(targets, function(i, target) {
        $(target).removeClass("selected");
        $(target).removeClass("active");
        $(target).addClass("deactivated");
    });
}

// convert filter state to a javascript object
function getFilterState() {
    var filterState = {};
    $(".filter.selected").each(function(i, filter) {
        var category = $(filter).data("category");
        var id = filter.id;
        filterState[category] = id;
    });
    return filterState;
}