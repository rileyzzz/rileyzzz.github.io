
var possibilityMatrix = [];
var possibilitySum = 0;

function output(str) {
    var formattedStr = String(str);
    console.log(formattedStr);
    var text = $("#output").val();
    text += formattedStr + '\n';
    $("#output").val(text);
}

window.onerror = function(message, source, lineno, colno, error) {
    this.output("ERROR: " + message + " line: " + lineno + " col: " + colno);
};

function RemoveFrom(arr, val) {
    let index = arr.indexOf(val);
    if(index > -1)
        arr.splice(index, 1);
}

function possibleAnd(A, B) {
    let bitwiseA = 0;
    let bitwiseB = 0;
    for(let i = 0; i < A.length; i++)
        bitwiseA |= 1 << (A[i] - 1);

    for(let i = 0; i < B.length; i++)
        bitwiseB |= 1 << (B[i] - 1);

    //alert(bitwiseA + " " + bitwiseB);
    let bitwise = bitwiseA & bitwiseB;
    //alert(bitwise);
    let ret = [];
    for(let i = 0; i < 9; i++)
        if(bitwise & (1 << i))
            ret.push(i + 1);

    return ret;
}

function updatePossibilities() {
    var clears = [];

    //alert("finding");

    //verified
    for(let y = 0; y < 9; y++) {
        for(let x = 0; x < 9; x++) {
            let values = possibilityMatrix[x][y];
            //output("values " + x + " " + y + ": " + values);
            if(values.length == 1) {
                clears.push([x, y, values[0]]);
            }
        }
    }
    
    //output("CLEARS: " + clears);
    //alert("clearing");
    for(let i = 0; i < clears.length; i++) {
        let clear = clears[i];
        let clearX = clear[0];
        let clearY = clear[1];
        let val = clear[2];

        output("clear " + clearX + " " + clearY + " " + val);
        for(let x = 0; x < 9; x++) {
            if(x != clearX)
                RemoveFrom(possibilityMatrix[x][clearY], val);
        }

        //for(let x = 0; x < 9; x++)
            //output("clear row " + x + ": " + possibilityMatrix[x][clearY]);

        for(let y = 0; y < 9; y++) {
            if(y != clearY)
                RemoveFrom(possibilityMatrix[clearX][y], val);
        }
    }

    for(let blockY = 0; blockY < 9; blockY += 3) {
        for(let blockX = 0; blockX < 9; blockX += 3) {
            output("block " + blockX / 3 + " " + blockY / 3 + ": ");
            let possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];

            for(let y = blockY; y < blockY + 3; y++) {
                for(let x = blockX; x < blockX + 3; x++) {
                    let values = possibilityMatrix[x][y];
                    if(values.length == 1)
                        RemoveFrom(possible, values[0]);
                }
            }

            output("possible: " + possible);

            //and with block possibilities
            for(let y = blockY; y < blockY + 3; y++)
                for(let x = blockX; x < blockX + 3; x++) {
                    let values = possibilityMatrix[x][y];
                    if(values.length != 1)
                        possibilityMatrix[x][y] = possibleAnd(values, possible);
                    //console.log("before " + x + " " + y + " " + possibilityMatrix[x][y]);
                    //console.log("after " + x + " " + y + " " + possibilityMatrix[x][y]);
                }
                    
            //per number tallies
            let numberTallies = [];
            for(let i = 0; i < 9; i++) {
                numberTallies.push([]);

                for(let x = 0; x < 3; x++)
                    numberTallies[i][x] = [];
                
                for(let y = 0; y < 3; y++)
                    for(let x = 0; x < 3; x++)
                        numberTallies[i][x][y] = false;
            }
            
            for(let y = blockY; y < blockY + 3; y++) {
                for(let x = blockX; x < blockX + 3; x++) {
                    let possible = possibilityMatrix[x][y];
                    //for each possibility, tally
                    for(let i = 0; i < possible.length; i++)
                        numberTallies[possible[i] - 1][x - blockX][y - blockY] = true;
                }
            }

            for(let i = 0; i < 9; i++) {
                //tally for each number
                let tally = numberTallies[i];
                let count = 0;
                let flatTally = [];
                //output("number " + (i + 1) + ": ");
                
                for(let y = 0; y < 3; y++) {
                    for(let x = 0; x < 3; x++) {
                        //output(x + " " + y + ": " + numberTallies[i][x][y]);
                        if(numberTallies[i][x][y] == true) {
                            count += tally[x][y];
                            flatTally.push([x, y]);
                        }
                    }
                }
                
                if(count == 1) {
                    output("Single tally possibility.");
                    let location = flatTally[0];
                    let valX = location[0] + blockX;
                    let valY = location[1] + blockY;
                    possibilityMatrix[valX][valY] = [i + 1];
                }
            }
        }
    }

    //calculate sum

    //alert("setting");
    //update display
    for(let y = 0; y < 9; y++) {
        for(let x = 0; x < 9; x++) {
            let values = possibilityMatrix[x][y];
            if(values.length == 1) {
                $("#n" + x.toString() + y.toString()).val(values[0]);
            }
        }
    }
    output("done");
    //output(possibilityMatrix);
}

function compute() {
    //setup default property matrix
    if(possibilityMatrix.length == 0) {
        output("rebuilding possibility matrix");
        for(let x = 0; x < 9; x++)
            possibilityMatrix[x] = []
        
        for(let y = 0; y < 9; y++) {
            for(let x = 0; x < 9; x++) {
                const possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                var text = $("#n" + x.toString() + y.toString()).val();
                if(text == "")
                    possibilityMatrix[x].push([...possible]);
                else
                    possibilityMatrix[x].push([parseInt(text)]);

            }
            //output("matrix update " + possibilityMatrix[x]);
        }
    }
    output("begin update");
    updatePossibilities();
}

$(document).ready(function(){
    //alert("awesome");

    //output(possibleAnd([1, 2, 3], [3, 4, 5, 6, 7]));

    var contents = "";
    for(let y = 0; y < 9; y++) {
        contents += "<tr>";
        for(let x = 0; x < 9; x++)
            contents += "<td><input class='numberinput' max=1 id='n" + x.toString() + y.toString() + "'></td>";
        contents += "</tr>";
    }

    // var possiblecontents = "";
    // for(let x = 0; x < 9; x++) {
    //     possiblecontents += "<tr>";
    //     for(let y = 0; y < 9; y++)
    //         possiblecontents += "<td><input class='numberinput' max=1 id='np" + x.toString() + y.toString() + "'></td>";
    //     possiblecontents += "</tr>";
    // }

    $("#input").append(contents);
    $("#possible").append(possiblecontents);
    //alert("done");
});