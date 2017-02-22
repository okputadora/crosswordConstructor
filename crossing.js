$(document).ready(function(){
  $("#opt1").on("click", function(){
    $("#opt1").css("display", "none");
    $("#opt2").css("display", "none");
    $("#gridsize").css("display", "flex");
    console.log("hi");
  })

  $("#submit").on("click", function(){
      var length = $("#len").val();
      var width = $("#wid").val();
      $("#gridsize").css("display", "none");
      $("#crossword").css("display", "flex");
      for (i = 0; i < length; i++){
        $("#grid").append("<div class='row' id='row" + i + "'></div>");
        console.log("in here");
        for (p = 0; p < width; p++){
          $("#row" + i).append("<input class='box' maxlength='1'></div>");
        }
      }
  })

})
