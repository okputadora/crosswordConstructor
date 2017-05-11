<?php
  include_once("connect.php");
  $id = $_POST("id");
  $query = "SELECT * FROM boards WHERE id LIKE '" . $id . "'";
  $response = @mysqli_query($dbc, $query);
  while ($row = mysqli_fetch_array($response)){
    $stringer = $row['stringer'];
    $width = $row['width'];
  }
  $returnValue = [];
  array_push($returnValue, $stringer);
  array_push($returnValue, $width);
  // echo json_encode($returnValue);
  echo "hello";
?>
