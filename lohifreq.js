/// New intelligence. the goal here is to search through many possible words
// that could fit in the desired space and select the one that leads to highest
// frequency of possibilities for the words going
// global variable for autoPuzzle
var enteredPartWords = [];
var enteredWords = [];
var enteredAreas = [];
var gridId = 0;
var width = 0;
var board = {};
// getPartialWord takes the current boxes and returns a string with "_"
// signifying empty boxes. returns false if the word is already filled in
function getPartialWord(hLightedArea, crossing){
  var partialWord = "";
  var alreadyComplete = true;
  console.log("hlighted: " + hLightedArea);
  for (i in hLightedArea){
    var box = hLightedArea[i].toString();
    console.log("box: " + box);
    var letter = $(box).html();
    console.log("letter: " + letter);
    if (letter === "" || letter === "_" || (letter === "!" && crossing === false)){
        letter = "_";
        alreadyComplete = false;
    }
    partialWord += letter
  }
  if (alreadyComplete){
    return "okputadora";
  }
  else {return partialWord;}
}
// takes a string of the box is ("#box2-10") and return the row and col id's
function getRowColIds(box){
  var n = box.indexOf("-");
  var y = box.indexOf("x");
  var row = parseInt(box.substring((y+1), n));
  var col = parseInt(box.substring((n+1)));
  return [row, col];
}
// takes a partial word, words that have already been tried, and any additional
// query information. makes an ajax call to auto-word.php and returns a
// complete word that matches the partial word
function autoWord(partialWord, crossingWords, blacklist, callback){
  console.log(blacklist);
  console.log("Partial Word: " + partialWord);
  $.ajax({
    // see this file for description
    url: "../auto-word.php",
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
    var val = $(wordArea[x]).html();
    if(val == "" || val == "_"){
      $(wordArea[x]).html("!");
      // hide the !'s
      // $(wordArea[x]).css("font-size", "0px");
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
      $(area[i]).html("");
    }
    else{$(area[i]).html(answer.charAt(i));}

  }
  console.log("ANSWER: " + answer);
  callback();
}
// saves the word data and metadata so it can be accessed during revision
function saveWord(partialWord, word, area){
  enteredPartWords.push(partialWord);
  enteredWords.push(word);
  enteredAreas.push(area);
}
// returns
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
function buildJSONword(letter, direction, num){
  var parentId =  $("#number" + num).parent().attr('id');
  var rowCol = getRowColIds(parentId);
  var wordArea = getWordArea(rowCol[0], rowCol[1], direction);
  console.log("word area: " + wordArea);
  var partialWord = getPartialWord(wordArea);
  board[num + letter] = {'word': partialWord, 'area': wordArea};
}
function buildJSONboard(){
  var letter = 'A';
  var direction = true;
  $(".crossClueNum").each(function(){
    num = $(this).html();
    buildJSONword(letter, direction, num);
  });
  letter = 'D';
  direction = false;
  $(".downClueNum").each(function(){
    num = $(this).html();
    buildJSONword(letter, direction, num);
  });
  console.log(board);
}
// while the puzzle is unsolved...try to solve it
function autoPuzzle(hLightedArea, enteringRow, blacklist, partWord){
    // if this is a revision
    if (partWord){
      var partialWord = partWord;
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
      hLightedArea = getWordArea(r, c, enteringRow);
      autoPuzzle(hLightedArea, enteringRow);
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
// takes 2 ints (row and column) and a boolean (enteringRow = true/false) and
// returns an array of box id's for that current word
function getWordArea(r, c, direction){
  var begFound = false;
  var endFound = false;
  var box = "#box" + r + "-" + c;
  var wordArea = [box];
  c = parseInt(c);
  r = parseInt(r);
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
          c = parseInt(c - 1);
        }
        else{
          r = parseInt( r - 1);
        }
    }
    else{
      begFound = true;
    }
    // or if this box is white
    r2 = parseInt(r2);
    c2 = parseInt(c2);
    if ($("#box" + r2 + "-" + c2).css("background-color") === "rgb(255, 255, 255)" ||
    $("#box" + r2 + "-" + c2).css("background-color") === "rgb(249, 216, 150)"){
      // add it to the end of the array
      box = "#box" + r2 + "-" + c2;
      wordArea.push(box);
      if (direction){
        c2 = parseInt(c2 + 1);
      }
      else{
        r2 = parseInt(r2 + 1);
      }
    }
    else{
      endFound = true;
    }
  }
  while (begFound === false || endFound === false);
  return wordArea;
}
function addNumber(row, col, id, sqNum){
  $("#bocksesBox" + row + "-" + col + "-" + id).append("<div class='number'>" + sqNum + "</div>");
  // add a clue to the down column
  if (row === 1 || $("#bocksesBox" + (row -1) + "-" + col + "-" + id).css('background-color') === "rgb(255, 255, 255)"){
    $("#crossClueBox").append("<div class='crossClue'>" + sqNum + ". </div>");
  }
  // add a clue to the cross column
  if (col === 1 || $("#bocksesBox" + row + "-" + (col - 1) + "-" + id).css('background-color') === "rgb(255, 255, 255)"){
    $("#downClueBox").append("<div class='downClue'>" + sqNum + ". </div>");
  }
}
// fills in the gird for the girdOpts asd well as the larger grid for
// the mainscreen puzzle
function fillInGridOpts(board, width, id){
  gridId = id;
  $("#grid" + id).append("<div class='grid' id='grid'" + id + "'");
  var length = board.length;
  var row = 0;
  var col = 1;
  var sqNum = 1;
  var addNumber = true;
  for (var i = 0; i < length; i++){
    // check if its time to make a new row
    if (i%width === 0){
      row += 1;
      $("#grid" + gridId).append("<div class='row' id='row" + row + "-" + id + "'></div>");
      col = 1;
    }
    //add a box
    $("#row" + row + "-" + id).append("<div class='bocksesBox' id='bocksesBox" + row + "-" + col +  "-" + id +
    "'><div class='box' id='box" + row + "-" + col + "-" + id + "'></div></div>");

    // put in black square
    if (board.charAt(i) === "&"){
      $("#box" + row + "-" + col + "-" + id).css("background-color", "black");
    }
    // put in white square
    else if (board.charAt(i) === "#"){
      // console.log($("#bocksesBox" + row + "-" + (col - 1) + "-" + id).css("background-color");
      $("#box" + row + "-" + col + "-" + id).css("background-color", "white");
    }
    col += 1;
  }
}
function fillInGrid(board, width, id){
  gridId = id;
  $("#grid" + id).append("<div class='grid' id='grid'" + id + "'");
  var length = board.length;
  var row = 0;
  var col = 1;
  var sqNum = 1;
  var addNumber = true;
  for (var i = 0; i < length; i++){
    // check if its time to make a new row
    if (i%width === 0){
      row += 1;
      $("#grid" + gridId).append("<div class='row' id='row" + row + "'></div>");
      col = 1;
    }
    //add a box
    $("#row" + row).append("<div class='bocksesBox' id='bocksesBox" + row + "-" + col +
    "'><div class='box' id='box" + row + "-" + col + "'></div></div>");

    // put in black square
    if (board.charAt(i) === "&"){
      $("#box" + row + "-" + col).css("background-color", "black");
    }
    // put in white square
    else if (board.charAt(i) === "#"){
      // console.log($("#bocksesBox" + row + "-" + (col - 1) + "-" + id).css("background-color");
      $("#box" + row + "-" + col + "-" + id).css("background-color", "white");
        // check if the box needs a number
        if (row === 1 || $("#box" + (row - 1) + "-" + col).css('background-color') === "rgb(0, 0, 0)" ||
            col === 1 || $("#box" + row + "-" + (col - 1)).css('background-color') === "rgb(0, 0, 0)"){
            $("#bocksesBox" + row + "-" + col).append("<div class='number' id='number" + sqNum + "'>" + sqNum + "</div>");
            if (row === 1 || $("#box" + (row - 1) + "-" + col).css('background-color') === "rgb(0, 0, 0)"){
              $("#downClueBox").append("<div class='downClue'><div class='downClueNum'>" + sqNum + "</div><textarea class='clueIn'></textarea></div>");

            }
            if (col === 1 || $("#box" + row + "-" + (col - 1)).css('background-color') === "rgb(0, 0, 0)"){
              $("#crossClueBox").append("<div class='crossClue'><div class='crossClueNum'>" + sqNum + "</div><textarea class='clueIn'></textarea></div>")

            }
          sqNum += 1;
        }
    }
    col += 1;
  }
}
function displayGridOpts(){
  $.ajax({
    url: "get-boards.php",
    type: "POST",
    success: function(data){
      var boards = JSON.parse(data);
      for (var i in boards){
        var stringer = boards[i][0];
        width = boards[i][1];
        gridId = boards[i][2];
        var gridName = parseInt(gridId) + 1;
        $("#gridOpts").append("<div class='gridOpt' id='grid" + gridId + "'></div>");
        $("#grid" + gridId).append("<div class='gTitle'>Grid " + gridName + "</div>");
        fillInGridOpts(stringer, width, gridId);
      }
    }
  });
}
// when all is loaded
$(document).ready(function(){
  $("#puzAuth").on("click", function(){
  buildJSONboard();
  })
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
        // $("#loginPage").css("display", "none");
        //   $("#welcome").css("display", "flex");
        //   $("#p1").animate({marginRight: ("0px")}, 400);
        //   setTimeout(function(){
        //     $("#p1").animate({marginRight: ("6000px")}, 1000);
        //     $("#p2").animate({marginRight: ("0px")}, 1000);
        //     setTimeout(function(){
        //       $("#p2").animate({marginRight: ("6000px")}, 1000);
        //       $("#p3").animate({marginRight: ("0px")}, 1000);
        //       setTimeout(function(){
        //         $("#p3").animate({marginRight: ("6000px")}, 1000);
                $(".intro-box").css("display", "none");
                $("#gridsize").css("display", "flex");
                displayGridOpts();
        //       }, 3000)
        //     }, 3000);
        //   }, 3000);
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
  /// FOR CREATING PUZZLE on MAINSCREEN
  var id = $("#idx").html();
  $("#idx").remove();
  console.log(id);
  $.ajax({
    url: "../buildGrid.php",
    type: "POST",
    data: {id: id},
    success: function(data){
      var board = $.parseJSON(data);
      console.log(board[1]);
      width = board[1];
      fillInGrid(board[0], board[1], id)
    }
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
  $("#autoPuzzle").on("click", function(){
    // set focus to first square
    $("#box0-0").focus();
    var rowId = 1;
    var colId = 1;
    var enteringRow = true;
    movingDirection = true;
    var area = getWordArea(rowId, colId, enteringRow);
    var blacklist = [];
    autoPuzzle(area, enteringRow, blacklist);
  })
})
