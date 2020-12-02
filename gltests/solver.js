
var possibilityMatrix = [];
var possibilitySum = 0;

function RemoveFrom(arr, val) {
    let index = arr.indexOf(val);
    if(index > -1)
        arr.splice(index, 1);
}

function possibleAnd(A, B) {
    var bitwiseA = 0;
    var bitwiseB = 0;
    for(let i = 0; i < A.length; i++)
        bitwiseA |= 1 << (A[i] - 1);

    for(let i = 0; i < B.length; i++)
        bitwiseB |= 1 << (B[i] - 1);

    alert(bitwiseA + " " + bitwiseB);
    var bitwise = bitwiseA & bitwiseB;
    alert(bitwise);
    var ret = [];
    for(let i = 0; i < 9; i++)
        if(bitwise & (1 << i) == (1 << i))
            ret.push(i + 1);
    return ret;
}

function updatePossibilities() {
    var clears = [];

    //alert("finding");
    for(let x = 0; x < 9; x++) {
        for(let y = 0; y < 9; y++) {
            let values = possibilityMatrix[x][y];
            if(values.length == 1) {
                clears.push([x, y, values[0]]);
            }
        }
    }

    //alert("clearing");
    for(let i = 0; i < clears.length; i++) {
        let clear = clears[i];
        let clearX = clear[0];
        let clearY = clear[1];
        let val = clear[2];
        //alert("clear " + clearX + clearY + " " + val);
        for(let x = 0; x < 9; x++) {
            if(x != clearX)
                RemoveFrom(possibilityMatrix[x][clearY], val);
        }

        for(let y = 0; y < 9; y++) {
            if(y != clearY)
                RemoveFrom(possibilityMatrix[clearX][y], val);
        }
    }

    for(let blockX = 0; blockX < 9; blockX += 3) {
        for(let blockY = 0; blockY < 9; blockY += 3) {
            let possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];

            for(let x = blockX; x < blockX + 3; x++) {
                for(let y = blockY; y < blockY + 3; y++) {
                    let values = possibilityMatrix[x][y];
                    if(values.length == 1)
                        RemoveFrom(possible, values[0]);
                }
            }


        }
    }

    //calculate sum

    //alert("setting");
    //update display
    for(let x = 0; x < 9; x++) {
        for(let y = 0; y < 9; y++) {
            let values = possibilityMatrix[x][y];
            if(values.length == 1) {
                $("#n" + x + y).val(values[0]);
            }
        }
    }
    alert("done");
}

function compute() {
    //setup default property matrix
    if(possibilityMatrix.length == 0) {
        for(let x = 0; x < 9; x++) {
            possibilityMatrix[x] = []
            for(let y = 0; y < 9; y++) {
                const possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                var text = $("#n" + x + y).val();
                if(text == "")
                    possibilityMatrix[x].push([...possible]);
                else
                    possibilityMatrix[x].push([parseInt(text)]);
            }
        }
    }

    updatePossibilities();
}

$(document).ready(function(){
    //alert("awesome");

    alert(possibleAnd([1, 2, 3, 4], [2, 3, 4, 5]));

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