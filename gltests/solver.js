
var possibilityMatrix = [];



$(document).ready(function(){
    //alert("awesome");
    var contents = "";
    for(let x = 0; x < 9; x++)
        contents += "<tr>";
        for(let y = 0; y < 9; y++)
            contents += "<td></td>";
        contents += "</tr>";
    $("#input").append(contents);
    alert("done");
});