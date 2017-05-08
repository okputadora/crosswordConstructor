<?php
  include_once("connect.php");
  $query = "SELECT * FROM boards";
  $response = mysqli_query($dbc, $query);
  $boards = [];
  while ($row = mysqli_fetch_array($response)){
    $stringer = $row['stringer'];
    $width = $row['width'];
    $id = $row['id'];
    $board = [$stringer, $width, $id];
    array_push($boards, $board);
  }
  echo json_encode($boards);
?>
