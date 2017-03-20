// tracks which direction the next box will be pulled from when highlighting,
// filling in, or checking a word
var enteringRow = true;
// array of highlighted boxes
var hLightedArea = [];
// length and width of grid
var length;
var width;
// Ids points to the number row or column
var rowId = 0;
var colId = 0;
// function displayGrid() puts in preset black squares when this is true
var template1 = false;
// not sure -- can probably delete
var idInFocus;
// when solving puzzle testWordArea is the wordSpace of the across word. It is
// needed so we can get back to this location after checking the crossing down
// words.
var testWordArea = [];
// an array of words we've already tried in the current wordspace
var triedWords = [];
// last column of the wordspace
var lastCol;


// INTELLIGENCE
function getPartialWord(){
  // find the highlighted word
  var partialWord = "";
  for (i in hLightedArea){
    var box = hLightedArea[i].toString();
    var letter = $(box).val();
    if (letter === ""){
      letter = "_";
    }
    partialWord += letter;
  }
  return partialWord;
}
function checkFreq(){
  // check the frequency of the crossing-words

  // select the lowest frequency word and call autoword
}

function autoWord(solving){
  console.log("TRIED WORDS: " + triedWords);
  //return focus to the board
  // $(idInFocus).focus();
  partialWord = getPartialWord();
  var jsonString = JSON.stringify(triedWords);
  $.ajax({
    url: "auto-word.php",
    type: "POST",
    data: 'word='+ partialWord + '&blacklist=' + jsonString,
    success: function(data){
      console.log(data);
      var foundWord = data;
      // enter the word into the grid
      for (i in hLightedArea){
        $(hLightedArea[i]).val(foundWord.charAt(i));
      }
      if (solving === "puzzle"){
        // NEW CODE HERE

        highlight("checkDown");
      }
    }
  })
}

function shadeBlack(row, column){
  $("#box" + row + "-" + column).css("background-color", "black");
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
      $("#row" + i).append("<input class='box' id='box" + i + "-" + p + "' maxlength='1'/>");
      // Add in default black squares

      if (template1){
        if (i <= 2 || i >= 12){
          if (p === 7){
            shadeBlack(i, p);
          }
        }
        else if (i === 3 && (p === 0 || p === 8)){
          shadeBlack(i, p);
        }
        else if(i === 4 & (p <= 3 || p === 9 || p === 14)){
          shadeBlack(i,p);
        }
        else if((i === 5 || i === 9) && (p === 4 || p === 10)){
          shadeBlack(i,p);
        }
        else if((i === 6 || i === 10) && (p === 5 || p === 11)){
          shadeBlack(i,p);
        }
        else if(i === 8 && (p === 3 || p === 9)){
          shadeBlack(i,p);
        }
        else if (i === 10 && (p === 0 || p === 5 || p >= 11)){
          shadeBlack(i,p);
        }
        else if (i === 11 && (p === 6 || p === 14)){
          shadeBlack(i,p);
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

// highlights the current word. hLightedArea is an array of the #box's the make
// up the current word. takes one argument solving which can = "puzzle" or
// "getDown" and determines which function to call next. if the user is just
// moving around the board no argument is passed.
function highlight(solving){
  // remove current highlighted area
  for (i in hLightedArea){
    if ($(hLightedArea[i]).css("background-color") !== "rgb(0, 0, 0)"){
        $(hLightedArea[i]).css("background-color", "white");
    }
  }
  hLightedArea = [];
  // if row
  if (enteringRow){
    // find beginning
    var begFound = false;
    var x = parseInt(colId);
    while (begFound === false){
      if ($("#box" + rowId + "-" + x).css("background-color") === "rgb(0, 0, 0)"){
        begFound = true;
        x += 1;
      }
      else if (x === 0){
        begFound = true;
      }
      else{
        x -= 1;
      }
    }
    // highlight until blackbox or end found
    for (x; x < width; x++){
      if ($("#box" + rowId + "-" + x).css("background-color") === "rgb(0, 0, 0)"){
        break;
      }
      else{
        // record the current highlighted area/
        var str = "#box" + rowId + "-" + x;
        hLightedArea.push(str);
        // highlight
        $("#box" + rowId + "-" + x).css("background-color", "#B2DAE7");
      }
    }
  }
  // if column
  if (!enteringRow){
    // toggle button colors
    var begFound = false;
    var distance = width;
    x = parseInt(rowId);
    while (begFound === false){
      if($("#box" + x + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){
        x += 1;
        begFound = true;
      }
      else if (x === 0){
        begFound = true;
      }
      else{
        x -= 1;
      }
    }
    // highklight the word
    for (x; x < length; x++){
      if ($("#box" + x + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){
        break;
      }
      else{
        var str = "#box" + x + "-" + colId;
        hLightedArea.push(str);
        $("#box" + x + "-" + colId).css("background-color", "#B2DAE7");
      }
    }
  }
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
    colId = colId - 1;
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
    rowId = rowId + 1;
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
      colId = 0;
      highlight("puzzle");
    })

    function deleteForever(){
          console.log("filtering...");
          $.ajax({
            url: "auto-clue.php",
            type: "post",
            success: function(data){
              console.log("rows deleted " + data);
              // deleteForever();
            }
        })
    }
    $("#auto-clue").on("click", function(){
      deleteForever();
    })

    $("#title").on("click", function(){
      deleteForever();
      partialWord = "sta";
      $.ajax({
        url: "duplicate.php",
        type: "post",
        data: ({word: partialWord}),
        success: function(data){
          console.log(" Word: " + data);

        }
    })
    })

})
