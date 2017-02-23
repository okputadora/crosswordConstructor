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
  $("#row0").css("background-color", "blue !important");
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
        var rowId = this.id.substring(3, n);
        var colId = this.id.substring(n+1);
        console.log(rowId);
        console.log(colId);
        // if an arrow key is being pressed
        // left
        if(event.which === 37){
          // if first col
          if (colId === "0"){
            $("#box" + rowId + "-" + (width - 1)).focus();
          }
          else{
            $(this).prev().focus();
          }
        }
        // up
        else if(event.which === 38){
          //if top row
          if (rowId === "0"){
            // focus on last row
            $("#box" + (length - 1) + "-" + colId).focus();
          }
          else{
            $("#box" + (rowId - 1) + "-" + colId).focus();
          }
        }
        // right
        else if(event.which === 39){
          //if last row
          if (colId === (width - 1).toString()){
            $("#box" + rowId + "-0" ).focus();
          }
          else{
            $(this).next().focus();
          }

        }
        // down
        else if(event.which === 40){
          //if bottom row
          if (rowId === (length - 1).toString()){
            $("#box0-" + colId).focus();
          }
          else{
            $("#box" + (parseInt(rowId) + 1) + "-" + colId).focus();
          }
        }
        // space
        else if (event.which === 32){
          $(this).css("background-color", "black");
        }
        // if at the end of the row
        else if ($(this).next() === null){
          // move to next row
          console.log("end");
        }
        // if going along row

        // if going along column
        // if backspacing
        else if (event.which === 8){
          $(this).prev().focus();
        }
      }
    })

    $("#dir-row").click(function(){
      enteringRow = true;
    })
    $("#dir-col").click(function(){
      enteringRow = false;
    })
})
