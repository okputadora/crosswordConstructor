/// New intelligence. the goal here is to search through many possible words
// that could fit in the desired space and select the one that leads to highest
// frequency of possibilities for the words going

// global variable for autoPuzzle
var enteredPartWords = [];
var enteredWords = [];
var enteredAreas = [];
// getPartialWord takes the current boxes and returns a string with "_"
// signifying empty boxes. returns false if the word is already filled in
function getPartialWord(hLightedArea, crossing){
  var partialWord = "";
  var alreadyComplete = true;
  for (i in hLightedArea){
    var box = hLightedArea[i].toString();
    var letter = $(box).val();
    if (letter === "" || letter === "_" || (letter === "!" && crossing === false)){
        letter = "_";
        alreadyComplete = false;
    }
    partialWord += letter;
  }
  if (alreadyComplete){
    return "okputadora";
  }
  else {return partialWord;}
}

// takes a string of the box is ("#box2-10") and return the row and col id's
function getRowColIds(box){
  var n = box.indexOf("-");
  var x = box.indexOf("-");
  var y = box.indexOf("x");
  var row = parseInt(box.substring((y+1), n));
  var col = parseInt(box.substring((n+1)));
  return [row, col];
}
// find the intersection of crossing Words and partial word so that when
// we query the database and get a complete word returned we know where to
// enter it into the crossing words to check for their freqs
function getIntersection(wordArea, crossWord){
  var box = wordArea[0];
  for (var i in crossWord){
    if (box === crossWord[i]){
      // intersection found
      return i;
    }
  }
}
// takes a partial word, words that have already been tried, and any additional
// query information. makes an ajax call to auto-word.php and returns a
// complete word that matches the partial word
function autoWord(partialWord, crossingWords, blacklist, callback){
  console.log(blacklist);
  console.log("Partial Word: " + partialWord);
  $.ajax({
    // see this file for description
    url: "auto-word.php",
    type: "POST",
    // blacklist is the words we've already tried
    data: {word: partialWord, crosses: JSON.stringify(crossingWords), queryAdd: JSON.stringify(blacklist)},
    success: function(data){
      console.log(data);
      var result = $.parseJSON(data);
      callback(result[0], result[1]);
    },
    error: function(xhr, parsererror, errorThrown){
       alert('request failed');
       console.log(textStatus);
    }
  })
}

// toggle row to column to row to...
function togRowCol(enteringRow){
  if (enteringRow){
    enteringRow = false;
  }
  else{enteringRow = true;}
  return enteringRow;
}

// filter through a word area and return the crossing word areas
// for each letter
function getCrossAreas(wordArea, direction){
  var crosses = [];
  direction = togRowCol(direction);
  for (var x in wordArea){
    var rowCol = getRowColIds(wordArea[x]);
    var val = $(wordArea[x]).val();
    if(val == "" || val == "_"){
      $(wordArea[x]).val("!");
    }
    var crossArea = getWordArea(rowCol[0], rowCol[1], direction);
    crosses.push(crossArea);
  }
  return crosses;
}

// puts the returned answer into the board
function fillInWord(answer, area, callback){
  for (var i in area){
    if (answer.charAt(i) == "_" || answer.charAt(i) == "!"){
      $(area[i]).val("");
    }
    else{$(area[i]).val(answer.charAt(i));}

  }
  console.log("ANSWER: " + answer);
  callback();
}

function saveWord(partialWord, word, area){
  enteredPartWords.push(partialWord);
  enteredWords.push(word);
  enteredAreas.push(area);
}

function getPrevWordInfo(callback){
  var length = enteredPartWords.length;
  var partialWord = enteredPartWords[length-1];
  var bList = enteredWords[length-1];
  var area = enteredAreas[length-1];
  // remove from list
  enteredAreas.pop();
  enteredWords.pop();
  enteredPartWords.pop();
  console.log(enteredPartWords);
  console.log("GPA: " + area);
  console.log("GPA: " + partialWord);
  var wordInfo = [area, partialWord, bList];
  callback(wordInfo);
}

function revise(){};

// while the puzzle is unsolved...try to solve it
function autoPuzzle(hLightedArea, enteringRow, blacklist, partWord){
    console.log("AP hlight: " + hLightedArea);
    // if this is a revision
    if (partWord){
      console.log("...revising")
      var partialWord = partWord;
      console.log("revising: " + partialWord);
    }
    // if this the first search for this area
    else{
      // second argument tells function if we are getting cross partial words
      var partialWord = getPartialWord(hLightedArea, false);
    }
    if (partialWord == "okputadora"){
      var rowCol = getRowColIds(hLightedArea[0]);
      r = rowCol[0] + 1;
      c = rowCol[1] + 1;
      console.log("SHOULDNZT BE IN HERE");
      hLightedArea = getWordArea(r, c, direction);
      autoPuzzle(hLightedArea, direction);
    }
    console.log("partial word: " + partialWord);
    var crossingAreas = getCrossAreas(hLightedArea, enteringRow);
    console.log("AP crosses " + crossingAreas);
    // get crossing partial words
    var crossWord = "";
    var crossingWords = [];
    var crossing = true;
    for (var i in crossingAreas){
      var crossWord = getPartialWord(crossingAreas[i], crossing);
      crossingWords.push(crossWord);
    }
    console.log("AP crossingWords: " + crossingWords);
    // get downs from partial word
    autoWord(partialWord, crossingWords, blacklist, function(word, index){
      var direction = togRowCol(enteringRow);
      if (word == "need to revise"){
        // clear previous word
        fillInWord(partialWord, hLightedArea, function(){})
        // get the previous word info
        console.log("NEED TO REVISE");
        console.log(index);
        getPrevWordInfo(function(prevWordInfo){
          blacklist.push(prevWordInfo[2]);
          // clear word area
          fillInWord(prevWordInfo[1], prevWordInfo[0], function(){
            autoPuzzle(prevWordInfo[0], direction, blacklist, prevWordInfo[1]);
          })
        });
      }
      else{
        var area = crossingAreas[index];
        fillInWord(word, hLightedArea, function(){
          console.log("area: " + area + "direction " + direction);
          saveWord(partialWord, word, hLightedArea);
          autoPuzzle(area, direction, blacklist);
        });
      }
    });
    // check if we're done
}

// scan the board for and find the lowest frequency position to start
function scanForStart(){

}

// takes 2 ints (row and column) and a boolean (enteringRow = true/false) and
// returns an array of box id's for that current word
function getWordArea(r, c, direction){
  var begFound = false;
  var endFound = false;
  var box = "#box" + r + "-" + c;
  var wordArea = [box];
  // increment
  if (direction){
    var c2 = c + 1;
    var r2 = r;
    c -= 1;
  }
  else{
    var r2 = r + 1;
    var c2 = c;
    r -= 1;
  }
  do{
    // if this box is white
    if ($("#box" + r + "-" + c).css("background-color") === "rgb(255, 255, 255)"){
        // add to beginning of the array
        box = "#box" + r + "-" + c;
        wordArea.unshift(box);
        if (direction){
          c -= 1;
        }
        else{
          r -= 1;
        }
    }
    else{
      begFound = true;
    }
    // or if this box is white
    if ($("#box" + r2 + "-" + c2).css("background-color") === "rgb(255, 255, 255)"){
      // add it to the end of the array
      box = "#box" + r2 + "-" + c2;
      wordArea.push(box);
      if (direction){
        c2 += 1;
      }
      else{
        r2 += 1;
      }
    }
    else{
      endFound = true;
    }
  }
  while (begFound === false || endFound === false);
  return wordArea;
}

function highlight(wordArea){

}
function addNumbers(row, col, sqNum){
  $("#boxes-box" + row + "-" + col).append("<div class='number'>" + sqNum + "</div>");
  sqNum += 1;
}

function readGrid(board, width){
  var length = board.length;
  console.log(length);
  console.log(width);
  var row = 0;
  $("#grid").append("<div class='row' id='row" + row + "'></div>");
  for (var i = 0; i < length; i++){
    // check if its time to make a new row
    if (i%width === 0){
      row += 1;
      $("#grid").append("<div class='row' id='row" + row + "'></div>");
      var col = 0;
    }
    //add a box
    $("#row" + row).append("<div class='boxes-box' id='boxes-box" + row + "-" + col + "'><input class='box' id='box" + row + "-" + col + "' maxlength='1'/></div>");
    // put in black square
    if (board.charAt(i) === "&"){
      $("#box" + row + "-" + col).css("background-color", "black");
    }
    // put in white square
    else if (board.charAt(i) === "#"){
      $("#box" + row + "-" + col).css("background-color", "white");
    }
    col += 1;
  }
}

function displayGrid(){
  var sqNum = 1;
  length = $("#len").val();
  width = $("#wid").val();
  $("#premade").css("display", "none");
  $("#crossword").css("display", "flex");
  $("#tools").css("display", "flex");
  for (i = 0; i < length; i++){
    $("#grid").append("<div class='row' id='row" + i + "'></div>");
    for (p = 0; p < width; p++){
      $("#row" + i).append("<div class='boxes-box' id='boxes-box" + i + "-" + p + "'><input class='box' id='box" + i + "-" + p + "' maxlength='1'/></div>");
      // Add in default black squares
      if (template1){
        if (i <= 2 || i >= 12){
          if (p === 7){
            $("#box" + i + "-" + p).css("background-color", "black");
          }
        }
        else if (i === 3 && (p === 0 || p === 8)){
          $("#box" + i + "-" + p).css("background-color", "black");
        }
        else if(i === 4 & (p <= 3 || p === 9 || p === 14)){
          $("#box" + i + "-" + p).css("background-color", "black");
        }
        else if((i === 5 || i === 9) && (p === 4 || p === 10)){
          $("#box" + i + "-" + p).css("background-color", "black");
        }
        else if((i === 6 || i === 10) && (p === 5 || p === 11)){
          $("#box" + i + "-" + p).css("background-color", "black");
        }
        else if(i === 8 && (p === 3 || p === 9)){
          $("#box" + i + "-" + p).css("background-color", "black");
        }
        else if (i === 10 && (p === 0 || p === 5 || p >= 11)){
          $("#box" + i + "-" + p).css("background-color", "black");
        }
        else if (i === 11 && (p === 6 || p === 14)){
          $("#box" + i + "-" + p).css("background-color", "black");
        }
      }
      if ($("#box" + i + "-" + p).css("background-color") != "rgb(0, 0, 0)"){
        // add numbers
        if (i === 0 || p === 0 || $("#box" + (i) + "-" + (p - 1)).css("background-color") === "rgb(0, 0, 0)" || $("#box" + (i - 1) + "-" + p).css("background-color") === "rgb(0, 0, 0)"){
          $("#boxes-box" + i + "-" + p).append("<div class='number'>" + sqNum + "</div>");
          sqNum += 1;
        }
      }
    }
  }
}

function goLeft(elem){
  // if first col
  colId = parseInt(colId);
  if (colId === 0){
    colId = width - 1;
  }
  else{
    colId -= 1;
  }
  // if black move again
  if ($("#box" + rowId + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){
    goLeft(elem);
  }
  $("#box" + rowId + "-" + colId).focus();
   // highlight();
}
function goUp(){
  rowId = parseInt(rowId);
  if (rowId === 0){
    // focus on last row
    rowId = length - 1;
  }
  else{
    rowId = rowId - 1;
  }
  // if black move again
  if ($("#box" + rowId + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){
    goUp();
  }
  $("#box" + rowId + "-" + colId).focus();
   // highlight();
}
function goRight(elem){
  colId = parseInt(colId);
  //if last row
  if (colId === (width - 1)){
    colId = 0;
  }
  else{
    colId = colId + 1;
  }
  // if black move again
  if ($("#box" + rowId + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){
    goRight(elem);
  }
  $("#box" + rowId + "-" + colId).focus();
   // highlight();
}
function goDown(){
  rowId = parseInt(rowId);
  //if bottom row
  if (rowId === (length - 1)){
    rowId = 0;
  }
  else{
    rowId += 1;
  }
  // if black move again
  if ($("#box" + rowId + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){
    goDown();
  }
  $("#box" + rowId + "-" + colId).focus();
   // highlight();
}

function toggleRow(){
  enteringRow = true;
  $("#dir-row").css("background-color", "#B2DAE7");
  $("#dir-col").css("background-color", "whitesmoke");
  $("#box" + rowId + "-" + colId).focus()
   // highlight();
   // highlightbox();
}

function toggleCol(){
  enteringRow = false;
  $("#dir-col").css("background-color", "#B2DAE7");
  $("#dir-row").css("background-color", "whitesmoke");
  $("#box" + rowId + "-" + colId).focus()
   // highlight();
   // highlightbox();
}
function fillInGrid(board, width, id){
  console.log("filling in the gird");
  $("#grid" + id).append("<div class='grid' id='grid'" + id + "'");
  var length = board.length;
  var row = 0;
  var col = 0;
  $("#grid" + id).append("<div class='row' id='row" + row + "'></div>");
  for (var i = 0; i < length; i++){
    // check if its time to make a new row
    if (i%width === 0){
      row += 1;
      $("#grid" + id).append("<div class='row' id='row" + row + "-" + id + "'></div>");
      col = 0;
    }
    //add a box
    $("#row" + row + "-" + id).append("<div class='boxes-box' id='boxes-box" + row + "-" + col + "-" + id + "'><input class='box' id='box" + row + "-" + col + "-" + id + "' maxlength='1'/></div>");
    // put in black square
    if (board.charAt(i) === "&"){
      $("#box" + row + "-" + col + "-" + id).css("background-color", "black");
    }
    // put in white square
    else if (board.charAt(i) === "#"){
      $("#box" + row + "-" + col + "-" + id).css("background-color", "white");
    }
    col += 1;
  }
}

function displayGridOpts(){
  console.log("getting boards")
  $.ajax({
    url: "get-boards.php",
    type: "POST",
    success: function(data){
      var boards = JSON.parse(data);
      console.log(boards[0]);
      for (var i in boards){
        var stringer = boards[i][0];
        var width = boards[i][1];
        var gridId = boards[i][2];
        var gridName = parseInt(gridId) + 1;
        $("#gridOpts").append("<div class='gridOpt' id='grid" + gridId + "'></div>");
        $("#grid" + gridId).append("<div class='gTitle'>Grid " + gridName + "</div>");
        fillInGrid(stringer, width, gridId);
      }
    }
});
}

// when all is loaded
$(document).ready(function(){
  $("#loginB").on("click", function(){
    $(".lButton").animate({marginRight: ("6000px")}, 500);
    setTimeout(function(){
      $("#loginPage").css("display", "none");
      $("#loginBox").css("display", "flex");
    }, 500)
  });

  $("#signUp").on("click", function(){
    $(".lButton").animate({marginRight: ("6000px")}, 500);
    setTimeout(function(){
      $("#loginPage").css("display", "none");
      $("#signUpBox").css("display", "flex");
    }, 500)
  });

  $("#create").on("click", function(){
    $(".lButton").animate({marginRight: ("6000px")}, 500);
    if ( $(window).width() > 700){
      setTimeout(function(){
        $("#loginPage").css("display", "none");
          $("#welcome").css("display", "flex");
          $("#p1").animate({marginRight: ("0px")}, 400);
          setTimeout(function(){
            $("#p1").animate({marginRight: ("6000px")}, 1000);
            $("#p2").animate({marginRight: ("0px")}, 1000);
            setTimeout(function(){
              $("#p2").animate({marginRight: ("6000px")}, 1000);
              $("#p3").animate({marginRight: ("0px")}, 1000);
              setTimeout(function(){
                $("#p3").animate({marginRight: ("6000px")}, 1000);
                $(".intro-box").css("display", "none");
                $("#gridsize").css("display", "flex");
                displayGridOpts();
              }, 3000)
            }, 3000);
          }, 3000);
        }, 500);
      }
      else{
        $("#loginPage").css("display", "none");
        $("#gridsize").css("display", "flex");
        displayGridOpts();
      }

  })

  $("#gridsize").on("click", ".gridOpt", function(){
    var idx = this.id;
    idx = idx.substring(4);
    console.log(idx);
    window.location.href = "puzzleCreate.php/?idx=" + idx;
  })



  $("#enter").on("click", function(){
    $("#welcome").css("display", "none");
    $("#opt1").css("display", "flex");
  })

  $("#opt1").on("click", function(){
    $("#opt1").css("display", "none");
    $("#gridsize").css("display", "flex");
    $("#len").focus();
  })

  // allow enter or click to move to next screen
  $("#main-content").on("keyup", function(){
    if (event.which === 13 && $("#gridsize").css("display") === "flex"){
      $("#gridsize").css("display", "none");
      $("#premade").css("display", "flex");
    }
  })
  $("#submit").on("click", function(){
      $("#gridsize").css("display", "none");
      $("#premade").css("display", "flex");
  })

  $("#layout1").on("click", function(){
    template1 = true;
    displayGrid();
  })
  $("#blanklayout").on("click", function(){
    template1 = false;
    displayGrid();
  })
    $('#grid').on("click", ".box", function(){
      var n = this.id.indexOf("-");
      rowId = this.id.substring(3, n);
      colId = this.id.substring(n+1);
       // highlight();
       // highlightbox();
    })
    $('#grid').on("keypress", ".box", function(){
      if (event.which === 49){
        if($(this).val() === "1"){
          $(this).val("");
        }
        toggleRow();
        return false;
      }
      else if (event.which === 50){
        if($(this).val() === "2"){
          $(this).val("");
        }
        toggleCol();
        return false;
      }
    })
    $('#grid').on("keydown", ".box", function(){
      // toggle color

      // $(this).css("background-color", "white");
      // // if keystrike on main screen
      // if ($("#crossword").css("display") === "flex"){
      //   // ids of current row and column
      //   var n = this.id.indexOf("-");
      //   rowId = this.id.substring(3, n);
      //   colId = this.id.substring(n+1);
      //   var thisEl = this;
      //   // if an arrow key is being pressed
      //   // left
      //   if(event.which === 37){
      //       goLeft(thisEl);
      //   }
      //   // up
      //   else if(event.which === 38){
      //     goUp();
      //   }
      //   // right
      //   else if(event.which === 39){
      //     goRight(thisEl);
      //   }
      //   // down
      //   else if(event.which === 40){
      //     goDown();
      //   }
      //   // space
      //   else if (event.which === 32){
      //     $("#box" + rowId + "-" + colId).css("background-color", "black");
      //     if (enteringRow){
      //       goRight(thisEl);
      //     }
      //     else{
      //       goDown(thisEl);
      //     }
      //
      //   }
      //   // backspace
      //   else if (event.which === 8){
      //     // if box is full
      //     if ($(this).val() !== ""){
      //       $(this).val("");
      //     }
      //     else if (enteringRow && $(this).val() === ""){
      //       goLeft(thisEl);
      //     }
      //     else{
      //       goUp();
      //     }
      //   }
      //   else if(event.which >= 65 && event.which <= 90){
      //     if (enteringRow){
      //       goRight(thisEl);
      //     }
      //     else{
      //       goDown(thisEl);
      //     }
      //   }
      // }
       // highlightbox();
    })


      $("#dir-row").click(function(){
      toggleRow();
    })
    $("#dir-col").click(function(){
      toggleCol();
    })

    // solve puzzle/word
    $("#auto-word").on("click", function(){
      autoWord();
    })
    $("#auto-puzzle").on("click", function(){
      // set focus to first square
      $("#box0-0").focus();
      var rowId = 0;
      var colId = 0;
      var enteringRow = true;
      var area = getWordArea(rowId, colId, enteringRow);
      var blacklist = [];
      autoPuzzle(area, enteringRow, blacklist);
    })
})
