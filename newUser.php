<?php include_once("connect.php");
$id = $_POST["userID"];
$name = $_POST["userName"];
$date = "DATE";

$command = "INSERT INTO users ('id', 'name', 'datejoined')
            VALUES('". $id ."', '". $name ."', '". $date ."' )";
$response = mysqli_query($dbc, $command);

// create table to store their puzzles and any other data we may want
