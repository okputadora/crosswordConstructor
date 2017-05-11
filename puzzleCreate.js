$(document).ready(function(){
  console.log("iunb here");
  var id = $("#id").html();
  console.log(id);
  $.ajax({
    url: "buildGrid.php",
    type: "POST",
    data: id,
    success: function(data){
      var board = (data);
      console.log();
      fillInGrid(board[0], board[1], id);
    }
  })
})
