<?php include_once("connect.php");
  $partialWord = $_POST["word"];
  $query = "SELECT * FROM nytclues WHERE answer LIKE '" .  $partialWord . "'";
  $response = @mysqli_query($dbc, $query);
  while ($row = mysqli_fetch_array($response)){
    $answer = $row["answer"];
    echo $answer;
    break;
  }?>
