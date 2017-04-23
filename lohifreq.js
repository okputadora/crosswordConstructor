/// New intelligence. the goal here is to search through many possible words
// that could fit in the desired space and select the one that leads to highest
// frequency of possibilities for the words going

// getPartialWord takes the current boxes and returns a string with "_"
// signifying empty boxes. returns false if the word is already filled in
function getPartialWord(hLightedArea){
  var partialWord = "";
  var alreadyComplete = true;
  for (i in hLightedArea){
    // save the crossing string to an array
    xingWord = getCross(hLightedArea);
    xingWords.push(xingWord);
    var box = hLightedArea[i].toString();
    var letter = $(box).val();
    if (letter === "" || letter === "_"){
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
  var col = parseInt(box.substring((n+1);
  return [row, col];
}
// takes a partial word, words that have already been tried, and any additional
// query information. makes an ajax call to auto-word.php and returns a
// complete word that matches the partial word
function autoWord(partialWord, crossingWords, jsonTriedWords, query){
  $.ajax({
    // see this file for description
    url: "auto-word.php",
    type: "POST",
    // blacklist is the words we've already tried
    data: 'word='+ partialWord + '&blacklist=' + jsonTriedWords + '&addQuery=' + query,
    success: function(data){
      foundWord = data;
      return foundWord;
    }
  }
}

function togRowCol(enteringRow){
  if (enteringRow){
    enteringRow = false;
  }
  else{enteringRow = true;}
  return enteringRow;
}

// filter through a word area and return the crossing word areas
// for each letter
function getCrosses(wordArea, direction){
  crosses = [];
  direction = togRowCol(direction)
  for (var x in WordArea){
    var rowCol = getRowColIds(x);
    var crossArea = wordArea(rowCol[0], rowCol[1], direction);
    crosses.push(crossArea);
  }
  return crosses;
}

function autoPuzzle(){
  // NEED TO DEFINE ENTERING ROW;
    // an array that point to the id's of the squares in the HTML. E.g.,
    // "#box0-0" is the top left square
    hLightedArea = wordArea(row, col, enteringRow);
    // determines how many words to search through before picking the one with
    // the highest frequency crossing words
    var optimizer = 10;
    // while the puzzle is unsolved...try to solve it
    while puzzle
    partialWord = getPartialWord(hLightedArea);
    crossingWords = getCrosses(hLightedArea);
    // get downs from partial word
    var word = autoWord(partialWord, crossingWords);
    // change highlighted area to next word space
    
    // check if we're done
}

// takes 2 ints (row and column) and a boolean (enteringRow = true/false) and
// returns an array of box id's for that current word
function getWordArea(r, c, direction){
  var begFound = false;
  var endFound = false;
  var str = "#box" + r + "-" + c;
  var wordArea = [str];
  // increment
  var r2 = r + 1;
  var c2 = c + 1;
  c -= 1;
  r -= 1;
  do{
    // if the box is white
    if($("#box" + r + "-" + c).css("background-color") === "rgb(255, 255, 255)"){
        // add to beginning of the array
        str = "#box" + r "-" + c;
        wordArea.unshift(str);
        if (direction == true){
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
      str = "#box" + r2 + "-" + c2;
      wordArea.push(str);
      if (direction == true){
        c2 += 1;
      }
      else{
        r2 += 1;
      }
    }
    else{
      endFound = true;
    }
  while (begFound == false && endFound == false);
  return wordArea;
}

function highlight(wordArea){

}
function displayGrid(){
  length = $("#len").val();
  width = $("#wid").val();
  $("#premade").css("display", "none");
  $("#crossword").css("display", "flex");
  $("#tools").css("display", "flex");
  for (i = 0; i < length; i++){
    $("#grid").append("<div class='row' id='row" + i + "'></div>");
    for (p = 0; p < width; p++){
      $("#row" + i).append("<div class='boxes-box' id='boxes-box" + i + "-" + p + "'><input class='box' id='box" + i + "-" + p + "' maxlength='2'/></div>");
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
          addNumbers(i,p);
        }
      }
    }
  }
  // set focus
  $("#box0-0").focus();
  // highlight first row
  highlight();
  highlightBox();
}

function highlightBox(){
  $("input:focus").css("background-color", "#FFEDC3");
  idInFocus = "#box" + rowId + "-" + colId;
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
  highlight();
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
  highlight();
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
  highlight();
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
  highlight();
}

function toggleRow(){
  enteringRow = true;
  $("#dir-row").css("background-color", "#B2DAE7");
  $("#dir-col").css("background-color", "whitesmoke");
  $("#box" + rowId + "-" + colId).focus()
  highlight();
  highlightBox();
}

function toggleCol(){
  enteringRow = false;
  $("#dir-col").css("background-color", "#B2DAE7");
  $("#dir-row").css("background-color", "whitesmoke");
  $("#box" + rowId + "-" + colId).focus()
  highlight();
  highlightBox();
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
      highlight();
      highlightBox();
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
    });
    $('#grid').on("keydown", ".box", function(){
      // toggle color

      $(this).css("background-color", "white");
      // if keystrike on main screen
      if ($("#crossword").css("display") === "flex"){
        // ids of current row and column
        var n = this.id.indexOf("-");
        rowId = this.id.substring(3, n);
        colId = this.id.substring(n+1);
        var thisEl = this;
        // if an arrow key is being pressed
        // left
        if(event.which === 37){
            goLeft(thisEl);
        }
        // up
        else if(event.which === 38){
          goUp();
        }
        // right
        else if(event.which === 39){
          goRight(thisEl);
        }
        // down
        else if(event.which === 40){
          goDown();
        }
        // space
        else if (event.which === 32){
          $("#box" + rowId + "-" + colId).css("background-color", "black");
          if (enteringRow){
            goRight(thisEl);
          }
          else{
            goDown(thisEl);
          }

        }
        // backspace
        else if (event.which === 8){
          // if box is full
          if ($(this).val() !== ""){
            $(this).val("");
          }
          else if (enteringRow && $(this).val() === ""){
            goLeft(thisEl);
          }
          else{
            goUp();
          }
        }
        else if(event.which >= 65 && event.which <= 90){
          if (enteringRow){
            goRight(thisEl);
          }
          else{
            goDown(thisEl);
          }
        }
      }
      highlightBox();
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
      rowId = 0;
      colId = 6;
      enteringRow = false;
      highlight("puzzle");
    })

})
