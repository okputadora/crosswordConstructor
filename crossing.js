// TO DO
//  1. Unhighlight when changing direction
//  2. space = black box
//  3. go to next box after typing letter (skip black boxes)
//


var enteringRow = true;
var hLightedArea = [];
var length;
var width;
var rowId = 0;
var colId = 0;

function displayGrid(){
  length = $("#len").val();
  width = $("#wid").val();
  $("#gridsize").css("display", "none");
  $("#crossword").css("display", "flex");
  $("#tools").css("display", "flex");
  for (i = 0; i < length; i++){
    $("#grid").append("<div class='row' id='row" + i + "'></div>");
    for (p = 0; p < width; p++){
      $("#row" + i).append("<input class='box' id='box" + i + "-" + p + "' maxlength='1'/>");
    }
  }
  // set focus
  $("#box0-0").focus();
  // highlight first row
  highlight();
  highlightBox();
}

function highlight(){
  console.log("row: " + rowId + " col: " + colId);
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
        console.log("Background black;");
        begFound = true;
        x += 1;
      }
      else if (x === 0){
        begFound = true;
      }
      else{
        console.log(x);
        x -= 1;
      }
    }
    // highlight until blackbox or end found
    for (x; x < width; x++){
      // abstract this out later
      if ($("#box" + rowId + "-" + x).css("background-color") === "rgb(0, 0, 0)"){
        console.log(x);
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
    for (x; x < length; x++){
      // abstract this out later
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
    console.log("colId = " + colId);
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
  $("#dir-col").css("background-color", "white");
  $("#box" + rowId + "-" + colId).focus()
  highlight();
  highlightBox();
}

function toggleCol(){
  enteringRow = false;
  console.log(colId);
  $("#dir-col").css("background-color", "#B2DAE7");
  $("#dir-row").css("background-color", "white");
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
      displayGrid();
    }
  })
  $("#submit").on("click", function(){
      displayGrid();
  })

    $('#grid').on("keyup", ".box", function(){
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
          console.log("spcae clicked");
          $("#box" + rowId + "-" + colId).css("background-color", "black");
          console.log($("#box" + rowId + "-" + colId).css("background-color"));
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
          if ($(this).html() != ""){
            $(this).html("");
          }
          else if (enteringRow){
            goLeft(thisEl);
          }
          else{
            goUp();
          }
        }
        // letter
        else if(event.which >= 65 && event.which <= 90){
          if (enteringRow){
            goRight(thisEl);
          }
          else{
            goDown(thisEl);
          }
        }
        else if (event.which === 49){
          if($(this).val() === "1"){
            $(this).val("");
          }
          toggleRow();
        }
        else if (event.which === 50){
          if($(this).val() === "2"){
            $(this).val("");
          }
          toggleCol();
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
})
