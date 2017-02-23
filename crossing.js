var enteringRow = true;
var enteringCol = false;
var length;
var width;

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
  $("#box0-0").css("background-color", "#FFEDC3");
  for (q = 1; q < (width); q++){
    $("#box0-" + q).css("background-color", "#B2DAE7");
  }
}

function goLeft(rowId, colId, elem){
  // if first col
  if (colId === "0"){
    $("#box" + rowId + "-" + (width - 1)).focus();
  }
  else{
    $(elem).prev().focus();
  }
}

function goUp(rowId, colId){
  if (rowId === "0"){
    // focus on last row
    $("#box" + (length - 1) + "-" + colId).focus();
  }
  else{
    $("#box" + (rowId - 1) + "-" + colId).focus();
  }
}

function goRight(rowId, colId, elem){
  //if last row
  if (colId === (width - 1).toString()){
    $("#box" + rowId + "-0" ).focus();
  }
  else{
    $(elem).next().focus();
  }
}

function goDown(rowId, colId){
  //if bottom row
  if (rowId === (length - 1).toString()){
    $("#box0-" + colId).focus();
  }
  else{
    $("#box" + (parseInt(rowId) + 1) + "-" + colId).focus();
  }
}


$(document).ready(function(){
  $("#opt1").on("click", function(){
    $("#opt1").css("display", "none");
    $("#opt2").css("display", "none");
    $("#gridsize").css("display", "flex");
    $("#len").focus();
  })
  // allow enter or click to move to next screen\
  $("#main-content").on("keyup", function(){
    if (event.which === 13 && $("#gridsize").css("display") === "flex"){
      displayGrid();
    }
  })
  $("#submit").on("click", function(){
      displayGrid();
  })

    $('#grid').on("keyup", ".box", function(){
      // if keystrike on main screen+
      if ($("#crossword").css("display") === "flex"){
        // ids of current row and column
        var n = this.id.indexOf("-");
        var row = this.id.substring(3, n);
        var col = this.id.substring(n+1);
        var thisEl = this;
        // if an arrow key is being pressed
        // left
        if(event.which === 37){
          goLeft(row, col, thisEl);
        }
        // up
        else if(event.which === 38){
          goUp(row, col);
        }
        // right
        else if(event.which === 39){
          goRight(row, col, thisEl);
        }
        // down
        else if(event.which === 40){
          goDown(row, col);
        }
        // space
        else if (event.which === 32){
          $(this).css("background-color", "black");
        }
        // backspace
        else if (event.which === 8){
          // if box is full
          if ($(this).html() != ""){
            $(this).html("");
          }
          if (enteringRow = true){
            goLeft(row, col, thisEl);
          }
          else {
            goUp(row, col);
          }

        }
        else{
          // if entering row

          // if entering column
        }

        // if going along column
        // if backspacing
      }
    })

    $("#dir-row").click(function(){
      enteringRow = true;
    })
    $("#dir-col").click(function(){
      enteringRow = false;
    })
})
