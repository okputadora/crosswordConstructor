<?php

DEFINE ('DB_USER', 'root');
DEFINE ('DB_PASSWORD', '4011');
DEFINE ('DB_HOST', 'localhost');
DEFINE ('DB_NAME', 'crossword');

// create a connection to the DB
// @ symbol prevents errors from displaying in the browser
$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
OR die('Could Not Connect to the Database' . mysqli_connect_error());

?>
