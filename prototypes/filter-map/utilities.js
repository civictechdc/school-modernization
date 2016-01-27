

// ======= ======= ======= CSV FILES ======= ======= =======
// ======= ======= ======= CSV FILES ======= ======= =======
// ======= ======= ======= CSV FILES ======= ======= =======


// ======= ======= ======= DCPS_Master_114 ======= ======= =======
// Agency, School, SCHOOLCODE, Address, maxOccupancy, Enroll.Cap, ProjectPhase, YrComplete, Level, totalSQFT, ProjectType, MajorExp9815, TotalAllotandPlan1621, LifetimeBudget, LON, LAT, WARD, FeederMS, FeederHS, Total.Enrolled, Limited.English.Proficient, At_Risk, AtRiskPer, SPEDPer, ESLPer, SqFtPerEnroll, SpentPerEnroll, SpentPerSqFt

// ======= ======= ======= DCPS_Master_114_dev ======= ======= =======
// Agency, School, SCHOOLCODE, Address, Level, WARD, FeederMS, FeederHS, LON, LAT, totalSQFT, maxOccupancy, Enroll_Cap, Total_Enrolled, Limited_English, At_Risk, ProjectPhase, YrComplete, ProjectType, MajorExp9815, TotalAllotandPlan1621, LifetimeBudget ... AtRiskPer, SPEDPer, ESLPer, SqFtPerEnroll, SpentPerEnroll, SpentPerSqFt


// ======= ======= ======= popup window ======= ======= =======
(function(){

    var SCROLL_WIDTH = 24;

    var btn_popup = document.getElementById("btn_popup");
    var popup = document.getElementById("popup");
    var popup_bar = document.getElementById("popup_bar");
    var btn_close = document.getElementById("btn_close");
    var smoke = document.getElementById("smoke");

    //-- let the popup make draggable & movable.
    var offset = { x: 0, y: 0 };

    popup_bar.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseUp() {
        window.removeEventListener('mousemove', popupMove, true);
    }

    function mouseDown(e){
        offset.x = e.clientX - popup.offsetLeft;
        offset.y = e.clientY - popup.offsetTop;
        window.addEventListener('mousemove', popupMove, true);
    }

    function popupMove(e){
        popup.style.position = 'absolute';
        var top = e.clientY - offset.y;
        var left = e.clientX - offset.x;
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }
    //-- / let the popup make draggable & movable.

    window.onkeydown = function(e){
        if(e.keyCode == 27){ // if ESC key pressed
            btn_close.click(e);
        }
    }

    window.onresize = function(e){
        spreadSmoke();
    }

    function spreadSmoke(flg){
        smoke.style.width = window.outerWidth + 100 + "px";
        smoke.style.height = window.outerHeight + 100 + "px";
        if (flg != undefined && flg == true) smoke.style.display = "block";
    }

}());




// ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======
// ======= ======= ======= ======= ======= UTILITIES ======= ======= ======= ======= =======


// ======= ======= ======= geoJsonToPolygon ======= ======= =======
function geoJsonToPolygon(geoCoordinates) {
    console.log("geoJsonToPolygon");
    console.log("  geoCoordinates.length: " + geoCoordinates.length);

    var opts = {};
    var paths = [];
    var exteriorDirection;
    var interiorDirection;

    // == check if each path isCCW (T/F)?
    var _ccw = function(path) {
        var isCCW;
        var a = 0;
        for (var i = 0; i < path.length-2; i++) {
            a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
        }
        if (a > 0) {
            isCCW = true;
        } else {
            isCCW = false;
        }
        return isCCW;
    };

    // == loop through LatLng coodinate pairs to define paths between pair
    for (var i = 0; i < geoCoordinates.length; i++){
        var path = [];
        for (var j = 0; j < geoCoordinates[i].length; j++) {
            var ll = new google.maps.LatLng(geoCoordinates[i][j], geoCoordinates[i][j]);
            // console.log("  ll: " + ll);
            path.push(ll);
        }
        if (!i) {
            exteriorDirection = _ccw(path);
            paths.push(path);
        } else if (i == 1) {
            interiorDirection = _ccw(path);
            if (exteriorDirection == interiorDirection) {
                paths.push(path.reverse());
            } else {
                paths.push(path);
            }
        } else {
            if (exteriorDirection == interiorDirection) {
                paths.push(path.reverse());
            } else {
                paths.push(path);
            }
        }
    }
    opts.paths = paths;
    googleObj = new google.maps.Polygon(opts);
    return googleObj;
}

// ======= ======= ======= CSVToArray ======= ======= =======
function CSVToArray(strData, strDelimiter) {
    console.log("CSVToArray");
    // Check to see if the delimiter is defined. If not, then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data with default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern matching groups.
    var arrMatches = null;
    // Loop over regular expression matches until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since new row of data, add empty row to data array.
            arrData.push([]);
        }
        // Check kind of value captured (quoted or unquoted).
        if (arrMatches[2]) {
            // Quoted value: unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // Non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Add value string to the data array.
        // console.log("  strMatchedValue: " + strMatchedValue);
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}

// ======= ======= ======= CSV2JSON ======= ======= =======
function CSV2JSON(csv) {
    console.log("CSV2JSON");
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }

    var json = JSON.stringify(objArray);
    var json2 = JSON.parse(json)
    return json2;
}
