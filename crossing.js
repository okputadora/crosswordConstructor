var enteringRow = true;
var enteringCol = false;

function displayGrid(){
  var length = $("#len").val();
  var width = $("#wid").val();
  $("#gridsize").css("display", "none");
  $("#crossword").css("display", "flex");
  $("#tools").css("display", "flex");
  for (i = 0; i < length; i++){
    $("#grid").append("<div class='row' id='row" + i + "'></div>");
    for (p = 0; p < width; p++){
      $("#row" + i).append("<input class='box' id='box" + i + "" + p + "' maxlength='1'/>");
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
      if ($("#crossword").css("display") === "flex"){
        if (event.which === 32){
          $(this).css("background-color", "black");
        }
        // if going along row
        $(this).next().focus();
        // if going along column
      }
    })
})
