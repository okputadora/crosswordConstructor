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
var lowestFreq = -1;
var lowFreqRow;
var lowFreqCol;
var foundWord;
var sqNum = 1;
var prevFreq = 1000;
var testWord;
var debug = 0;
var frequencies = [];
var previousFreqs = [];
var enteredWords = [];

// INTELLIGENCE
function getPartialWord(){
  // find the highlighted word
  var partialWord = "";
  var alreadyComplete = true;
  for (i in hLightedArea){
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

// lastCheck()
function lastCheck(){
  // check if the previous word had a lower freuqency
  console.log("previous Frequencies: " + previousFreqs);
  var foundPrevFreq = false;
  for (var i in previousFreqs){
    console.log("previous FREAKS " + previousFreqs[i][0]);
    if (lowestFreq > previousFreqs[i][0]){
      foundPrevFreq = true;
      lowestFreq = previousFreqs[i][0];
      // find the coordinates of this previous word
      rowId = previousFreqs[i][1];
      colId = previousFreqs[i][2];
    }
  }
  if (foundPrevFreq == true){
    if (enteringRow){
      enteringRow = false;
    }
    else{enteringRow = true;}
    frequencies = [];
    console.log("last word had a lower freq");
    console.log("entering that row at " + rowId + " " + colId);
  }
  else{
    previousFreqs = [];
    previousFreqs = frequencies;
    console.log("previous Frequencies: " + previousFreqs);
    frequencies = [];
    console.log("found last row/col lowest Freq: " + lowestFreq);
    console.log("At row " + lowFreqRow + " and col " + lowFreqCol);
    // Fill in the lowest frequency word
    rowId = lowFreqRow;
    colId = lowFreqCol;
    // save this info // should probably save it in JSON
    previousFoundWord = [foundWord, testWord, rowId, colId, !enteringRow, last, testWordArea];
    enteredWords.push(previousFoundWord);
    lowestFreq = -1;
    // remove this freuqency from the previous
    var index = previousFreqs.indexOf(freqToRemove);
    console.log("freqtoremove: " + freqToRemove + " + " + index);
    previousFreqs.splice(index, 1);
    console.log("previouse freqs: " + previousFreqs);
    console.log("entering row: " + enteringRow);
  }
  highlight("puzzle");
}

function getCross(){
  console.log("getCross()");
  console.log("row: " + rowId + " col: " + colId + " entering row: " + enteringRow);
  partialWord = getPartialWord();
  // if there aren't any blanks we don't need to check this word
  if (partialWord){
    $.ajax({
    url: "get-down.php",
    type: "post",
    data: ({word: partialWord}),
    success: function(data){
      data = parseInt(data);
      var freq = [data, rowId, colId];
      frequencies.push(freq);
      console.log("Frequencies: " + frequencies);
      // if this is the first check of a word
      // if there were no possible words
      if (data === 0){
        console.log("No possible words going across at row" + rowId + " col " + colId);
        // reset the test word to the previous partial word
        for (i in testWordArea){
          $(testWordArea[i]).val(testWord.charAt(i));
        }
        // reset the row and column
        var n = testWordArea[0].indexOf("-");
        rowId = parseInt(testWordArea[0].substring(n-1));
        colId = parseInt(testWordArea[0].substring(n+1));
        if (!enteringRow){
          enteringRow = true;
        }
        else {enteringRow = false};
        lowestFreq = -1;
        console.log("Retrying current partial word");
        frequencies = [];
        highlight("puzzle");
        return;
      }
      if (lowestFreq === -1){
        lowestFreq = data;
        lowFreqRow = rowId;
        lowFreqCol = colId;
        freqToRemove = freq;
        console.log("Freq to remove: ");
      }
      // if this is the lowest frequency word
      else if (data <= lowestFreq){
        // then replace current lowestFreq
        lowestFreq = data;
        lowFreqRow = rowId;
        lowFreqCol = colId;
        freqToRemove = freq;
        console.log("low freq row: " + lowFreqRow + " col: " + lowFreqCol);
      }
      console.log("data: " + data + " lowestfreq: " + lowestFreq);

      // if this was the last check
      if ((colId === last & !enteringRow) || (rowId === last & enteringRow)){
        lastCheck();
      }
      else{
        // I THINK THESE MULTIPLE FUNCTION CALLS ARE FUCKING IT UP
        if (enteringRow){
          goDown();
        }
        else {goRight();}
        highlight("checkDown");
      }
    }
  })
}

  // if this word was already complete
  else {
    // if this is the last check;
    if ((colId === last & !enteringRow) || (rowId === last & enteringRow)){
      lastCheck();
    }
    else {
      if (enteringRow){
        console.log("Already filled in");
        goDown();
        console.log(rowId);
      }
      else {goRight();}
      highlight("checkDown")};
  }
}

function autoWord(solving){
  //return focus to the board
  // $(idInFocus).focus();
  if (solving == "revise"){
    partialWord = testWord;
    var query = revQuery;
    console.log("Revising: partialWord: " + partialWord + "revquery " + revQuery);
  }
  else{
    partialWord = getPartialWord();
    var query = '';
  }
  // if there's some blanks
  if (partialWord){
    console.log("partial found word: " + partialWord);
    var jsonTriedWords = JSON.stringify(triedWords);
    // querey the database for a word that fits the partialWord
    $.ajax({
      url: "auto-word.php",
      type: "POST",
      // blacklist is the words we've already tried
      data: 'word='+ partialWord + '&blacklist=' + jsonTriedWords + '&addQuery=' + query,
      success: function(data){
        foundWord = data;
        // if the database had no words satisfying the criteria
        if (foundWord === 'OKPUTADORA'){
          // revise the prior word
          // 1. locate the problematic letter
          //// its going to be the box shared by this word and the previous word
          // filter through this words boxes
          var len = enteredWords.length;
          console.log(enteredWords);
          var prevArea = enteredWords[len-1][6];
          testWord = enteredWords[len-1][1];
          for (var d in hLightedArea){
            // and check them against boxes from the previous word;
            for (var l in prevArea){
              if (hLightedArea[d] == prevArea[l]){
                var badBox = prevArea[l]
                var badLet = $(prevArea[l]).val()
                break;
              }
            }
          }
          // 2. create string for revised query
          var badString = "";
          console.log("PREVAREA: " + prevArea);
          console.log("BADBOIX: " + badBox);
          console.log("TESTWIORD: " + testWord + testWord.charAt(0));
          for (var s in prevArea){
            if (prevArea[s] == badBox){
              badString += badLet;
            }
            else{
              badString += testWord.charAt(s)
            }
          }
          console.log("badString : " + badString);
          // 2. enter it into a partial query

          revQuery = " AND (answer NOT LIKE '" + badString + "')";
          // 3. retrieve the location of the previous word
          triedWords.push(enteredWords[len-1][0]);
          rowId = enteredWords[len-1][2];
          colId = enteredWords[len-1][3];
          enteringRow = enteredWords[len-1][4];
          last = enteredWords[len-1][5];
          console.log("HAVE TO REVISE: " + enteredWords);
          console.log("Revise coords: " + testWord + " " + enteredWords[len-1][0]);
          // remove from enteredWords
          // 4. delete this entry now that it is the current word and not most recent
          enteredWords.splice(len - 1);
          console.log("revise after splice: " + enteredWords);
          highlight("revise");
        }
        else{
          // enter the word into the grid
          console.log("Found word: " + foundWord + " " + typeof foundWord);
          for (i in hLightedArea){
            $(hLightedArea[i]).val(foundWord.charAt(i));
          }
          if (solving === "puzzle" || solving === "revise"){
            if (solving == "revise"){

            }
            // save as testword so we can revert back if need be
            testWord = partialWord;
            // store this location on the grid so we can navigate to the next one
            testWordArea = hLightedArea;
            console.log("testWord area: " + testWordArea);
            var len = testWordArea.length;
            var n = testWordArea[len-1].indexOf("-");
            var x = testWordArea[0].indexOf("-");
            var y = testWordArea[len-1].indexOf("x");
            // reset row and col id's to the first box
            colId = parseInt(testWordArea[0].substring(x+1));
            rowId = parseInt(testWordArea[0].substring(x-1));
            // save this information in case this word needs to be revised
            if (enteringRow){
              last = parseInt(testWordArea[len-1].substring(n+1));
              console.log("last col: " + last);
              enteringRow = false;
            }
            else{
              last = parseInt(testWordArea[len-1].substring((y+1), n))
              console.log("last row: " + last);
              enteringRow = true;
            }
            // add to tried words
            triedWords.push(foundWord);
            // getDown via highlight
            testWords = [];
            highlight("checkDown");
          }
        }
      }
    })
  }
  else{
    if (enteringRow){
      goDown();
    }
    else{
      goRight();
    }
    highlight("puzzle");
  }
}
// highlights the current word. hLightedArea is an array of the #box's the make
// up the current word. takes one argument solving which can = "puzzle" or
// "getDown" and determines which function to call next. if the user is just
// moving around the board no argument is passed.
function highlight(solving){
  console.log("highlight() + " + solving);
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
  // try a random word
  if (solving === "puzzle"){
    autoWord("puzzle");
  }
  else if (solving === "checkDown"){
    // var n = hLightedArea[0].indexOf("-")
    // rowId = hLightedArea[0].substring(4, n);
    // rowId = parseInt(rowId);
    // console.log("ROW: " + rowId + " String: " + hLightedArea[0]);
    // colId = hLightedArea[0].substring(n+1);
    // colId = parseInt(colId);
    getCross();
  }

  else if (solving === "revise"){
    autoWord("revise");
  }
}

function shadeBlack(row, column){
}

function addNumbers(row, col){
  $("#boxes-box" + row + "-" + col).append("<div class='number'>" + sqNum + "</div>");
  sqNum += 1;
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
      highlight("puzzle");
    })

})
