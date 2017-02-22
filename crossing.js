$(document).ready(function(){
  $("#opt1").on("click", function(){
    $("#opt1").css("display", "none");
    $("#opt2").css("display", "none");
    $("#gridsize").css("display", "flex");
  })

  $("#submit").on("click", function(){
      var length = $("#len").val();
      var width = $("#wid").val();
      $("#gridsize").css("display", "none");
      $("#crossword").css("display", "flex");
      for (i = 0; i < length; i++){
        $("#grid").append("<div class='row' id='row" + i + "'></div>");
        for (p = 0; p < width; p++){
          $("#row" + i).append("<input class='box' id='box" + i + "" + p + "' maxlength='1'/>");
        }
      }
  })

    $('#grid').on("keyup", ".box", function(e){
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
