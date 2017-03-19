<?php include_once("connect.php");
  $query = "SELECT * FROM nytclues ORDER BY answer";
  $response = @mysqli_query($dbc, $query);
  $count = mysqli_num_rows($response);
  $previousAnswer = "";
  $toBeDeleted = [];
  while ($row = mysqli_fetch_array($response)){
    $answer = $row['answer'];
    if($answer == $previousAnswer){
      $id = $row["id"];
      array_push($toBeDeleted, $id);
    }
    $previousAnswer = $answer;
  }
  echo $previousAnswer;
  foreach($toBeDeleted as $value){
    $query = "DELETE FROM nytclues WHERE id='" . $value . "'";
    $response = @mysqli_query($dbc, $query);
    // echo $value . "-";
  }
?>
