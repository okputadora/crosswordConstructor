<?php include_once("connect.php");
  $partialWord = $_POST["word"];
  $query = "SELECT * FROM nytclues WHERE answer LIKE '" .  $partialWord . "'";
  $response = @mysqli_query($dbc, $query);
  $count = mysqli_num_rows($response);
  echo $count;
?>
