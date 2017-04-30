/// New intelligence. the goal here is to search through many possible words
// that could fit in the desired space and select the one that leads to highest
// frequency of possibilities for the words going

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
    return false;
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
  console.log("row: " + row);
  console.log("col: " + col);
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
function autoWord(partialWord, crossingWords, callback){
  $.ajax({
    // see this file for description
    url: "auto-word.php",
    type: "POST",
    // blacklist is the words we've already tried
    data: {word: partialWord, crosses: crossingWords},
    success: function(data){
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
    console.log("GC wordarea " + wordArea[x]);
    var val = $(wordArea[x]).val();
    if(val == "" || val == "_"){
      $(wordArea[x]).val("!");
      console.log("!");
    }
    var crossArea = getWordArea(rowCol[0], rowCol[1], direction);
    crosses.push(crossArea);
  }
  return crosses;
}

function fillInWord(answer, area, callback){
  for (var i in area){
    $(area[i]).val(answer.charAt(i));
    callback();
  }
}

function autoPuzzle(hLightedArea, enteringRow){
  // NEED TO DEFINE ENTERING ROW;
    // an array that point to the id's of the squares in the HTML. E.g.,
    // "#box0-0" is the top left square
    console.log("AP hlight: " + hLightedArea);
    // determines how many words to search through before picking the one with
    // the highest frequency crossing words
    var optimizer = 10;
    // while the puzzle is unsolved...try to solve it
    // while puzzle
    var partialWord = getPartialWord(hLightedArea);
    console.log(partialWord);
    var crossingAreas = getCrossAreas(hLightedArea, enteringRow);
    console.log("AP crosses " + crossingAreas);
    // get crossing partial words
    var crossWord = "";
    var crossingWords = [];
    var crossing = true;
    for (var i in crossingAreas){
      crossWord = getPartialWord(crossingAreas[i], crossing);
      crossingWords.push(crossWord);
    }
    console.log("AP crossingWords: " + crossingWords);
    // this seems unnecessary -- shoulkd be able to find the intersection
    // when getting crosses
    var intersection = getIntersection(hLightedArea, crossingAreas[0]);
    // get downs from partial word
    autoWord(partialWord, crossingWords, function(word, index){
      var area = crossingAreas[index];
      console.log("WORD " + word + "index " + index);
      console.log("HLIGHT: " + hLightedArea);
      fillInWord(word, hLightedArea, function(){
        var direction = togRowCol(enteringRow);
        console.log("auto-puzzle");
        autoPuzzle(area, direction);
      });
    });
    // change highlighted area to next word space

    // check if we're done
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

// when all is loaded
$(document).ready(function(){
  $("#opt1").on("click", function(){
    $("#opt1").css("display", "none");
    $("#opt2").css("display", "none");
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
    });
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
      autoPuzzle(area, enteringRow);
    })
})
