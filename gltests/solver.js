
var possibilityMatrix = [];
var possibilitySum = 0;

function updatePossibilities() {
    var clears = [];

    for(let x = 0; x < 9; x++) {
        for(let y = 0; y < 9; y++) {
            let values = possibilityMatrix[x][y];
            if(values.length == 1) {
                clears.push([x, y, values[0]]);
            }
        }
    }

    for(clear in clears) {
        let clearX = clear[0];
        let clearY = clear[1];
        let val = clear[2];
        for(let x = 0; x < 9; x++) {
            if(x != clearX) {
                var index = possibilityMatrix[x][clearY].indexOf(val);
                if(index > -1)
                    possibilityMatrix[x][clearY].splice(index, 1);
            }
        }

        for(let y = 0; y < 9; y++) {
            if(y != clearY) {
                var index = possibilityMatrix[clearX][y].indexOf(val);
                if(index > -1)
                    possibilityMatrix[clearX][y].splice(index, 1);
            }
        }
    }
    //calculate sum
}

function compute() {
    //setup default property matrix
    for(let x = 0; x < 9; x++) {
        possibilityMatrix[x] = []
        for(let y = 0; y < 9; y++) {
            const possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            var text = $("#n" + x + y).val();
            if(text.value == "")
                possibilityMatrix[x].push([...possible]);
            else
                possibilityMatrix[x].push([parseInt(text)]);
        }
    }

    updatePossibilities();
}

$(document).ready(function(){
    //alert("awesome");
    var contents = "";
    for(let x = 0; x < 9; x++) {
        contents += "<tr>";
        for(let y = 0; y < 9; y++)
            contents += "<td><input class='numberinput' max=1 id='n" + x + y + "'></td>";
        contents += "</tr>";
    }
    $("#input").append(contents);
    //alert("done");
});