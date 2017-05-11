$(document).ready(function(){
  console.log("iunb here");
  var id = $("#id").html();
  $("#id").remove();
  console.log(id);
  $.ajax({
    url: "../buildGrid.php",
    type: "POST",
    data: {id: id},
    success: function(data){
      var board = $.parseJSON(data);
      console.log(board[0]);
      fillInGrid(board[0], board[1], id);
    }
  })
})
