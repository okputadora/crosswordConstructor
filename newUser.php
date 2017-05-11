<?php include_once("connect.php");
$id = $_GET["userID"];
$name = $_GET["username"];
$date = "DATE";

$command = "INSERT INTO users ('id', 'name', 'datejoined')
            VALUES('". $id ."', '". $name ."', '". $date ."' )";
$response = mysqli_query($dbc, $command);

// create table to store their puzzles and any other data we may want
?>
