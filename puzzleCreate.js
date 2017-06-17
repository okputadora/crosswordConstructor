var hLightedArea = [];
// for moving with arrow keys
var movingDirection = true;
var prevWordArea = [];
var currentBox = "";
var rowId = 1;
var colId = 1;

function suggestions(wordArea){
  partialWord = getPartialWord(hLightedArea, true);
  crossingAreas = getCrossAreas(wordArea, movingDirection)
  var crossingWords = [];
  for (var i in crossingAreas){
    var crossWord = getPartialWord(crossingAreas[i]);
    crossingWords.push(crossWord);
  }
  $.ajax({
    // see this file for description
    url: "../suggestions.php",
    type: "POST",
    // blacklist is the words we've already tried
    data: {word: partialWord, crosses: JSON.stringify(crossingWords)},
    success: function(data){
      console.log(data);
      var result = $.parseJSON(data);
      for (i in result){
        // put the results in the suggestion bpx
      }
    },
    error: function(xhr, parsererror, errorThrown){
       alert('request failed');
       console.log(textStatus);
    }
  })
}

function toggle(row, col){
  if (movingDirection === false){movingDirection = true}
  else {movingDirection = false};
  highlight(row, col, movingDirection);
}
function highlight(rowId, colId, movingDirection){
  for (x in prevWordArea){
    $(prevWordArea[x]).css("background-color", "rgb(255, 255, 255)");
  }
  var wordArea = getWordArea(rowId, colId, movingDirection);
  prevWordArea = wordArea;
  for (i in wordArea){
    $(wordArea[i]).css("background-color", "rgb(124, 181, 245)");
  }
  // highlight box
  $("#box" + rowId + "-" + colId).css("background-color", "rgb(249, 216, 150)");
}
function goLeft(){
  // if first col
  colId = parseInt(colId);
  if (colId === 1){
    colId = width;
  }
  else{
    colId -= 1;
  }
  // if black move again
  if ($("#box" + rowId + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){
    goLeft();
  }
  $("#box" + rowId + "-" + colId).focus();
  highlight(rowId, colId, movingDirection);
}
function goUp(){
  rowId = parseInt(rowId);
  if (rowId === 1){
    // focus on last row
    rowId = width;
  }
  else{
    rowId = rowId - 1;
  }
  // if black move again
  if ($("#box" + rowId + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){
    goUp();
  }
  $("#box" + rowId + "-" + colId).focus();
  highlight(rowId, colId, movingDirection);
}
function goRight(){
  colId = parseInt(colId);
  //if last row
  if (colId == width){
    colId = 1;
  }
  else{
    colId = colId + 1;
  }
  // if black move again
  if ($("#box" + rowId + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){goRight();}
  $("#box" + rowId + "-" + colId).focus();
  highlight(rowId, colId, movingDirection);
}
function goDown(){
  rowId = parseInt(rowId);
  //if bottom row
  if (rowId == (width)){rowId = 1;}
  else{rowId += 1;}
  // if black move again
  if ($("#box" + rowId + "-" + colId).css("background-color") === "rgb(0, 0, 0)"){goDown();}
  else{
    currentBox = "#box" + rowId + "-" + colId;
    highlight(rowId, colId, movingDirection);
  }
}

$(document).ready(function(){
  // event listener
  $('#puzzleGrid').on("click", ".box", function(){
    currentBox = this.id;
    var n = this.id.indexOf("-");
    rowId = this.id.substring(3, n);
    colId = this.id.substring(n+1);
    // if a black square is clicked do nothing
    if ($("#" + this.id).css("background-color") === "rgb(0, 0, 0)"){
      return;
    }
    // if a blue or yellow square is clicked toggle highlighted direction
    else if ($("#" + this.id).css("background-color") === "rgb(124, 181, 245)" ||
    $("#" + this.id).css("background-color") === "rgb(249, 216, 150)"){
      toggle(rowId, colId);
    }
    else{
      highlight(rowId, colId, movingDirection);
    }
  })
  $('#puzzleGrid').bind("keydown", function(){
    var thisEl = this;
    // if an arrow key is being pressed
    // left
    if(event.which === 37){
      if (movingDirection === true){
        goLeft();
      }
      else{toggle(rowId, colId);}
    }
    // up
    else if(event.which === 38){
      if (movingDirection === false){
        goUp();
      }
      else{toggle(rowId, colId);}
    }
    // right
    else if(event.which === 39){
      if (movingDirection === true){
        goRight(thisEl);
      }
      else{toggle(rowId, colId)};
    }
    // down
    else if(event.keyCode === 40){
      if (movingDirection === false){
        goDown();
      }
      else{toggle(rowId, colId);}
    }
    // space
    else if (event.which === 32){
      if (movingDirection){
        goRight();
      }
      else{
        goDown();
      }
    }
    // backspace
    else if (event.which === 8){
      // if box is full
      if ($("#box" + rowId + "-" + colId).html() === "" && movingDirection){
        goLeft();
      }
      else if ($("#box" + rowId + "-" + colId).html() === "" && !movingDirection){
        goUp();
      }
      else{
        $("#box" + rowId + "-" + colId).html("");
      }
      highlight(rowId, colId, movingDirection);
    }
    // Letters
    else if(event.which >= 65 && event.which <= 90){
      $("#box" + rowId + "-" + colId).html(event.key);
      if (movingDirection){
        goRight();
      }
      else{
        goDown();
      }
    }
  })

})
