<?php
include_once("connect.php");
$id = $_GET['id'];
$name = $_GET['n'];
date_default_timezone_set('America/New_York');
$date = date('m/d/Y h:i:s a', time());
// SANITIZE
$query = "SELECT * FROM users WHERE id LIKE '" . $id . "'";
$response = @mysqli_query($dbc, $query);
if ($response){
  // load the users content
}
else{
  $command = "INSERT INTO users ('id', 'name', 'datejoined')
              VALUES('". $id ."', '". $name ."', '". $date ."' )";
  $response = mysqli_query($dbc, $command);
  echo "inserting into table";
}
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="content-type" content="text/xml; charset=utf-8" />
  <!--ensures proper rendering and touch zooming on mobile devices-->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo $name ?></title>
  <!--import google font-->
  <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
  <!--import style sheet-->
  <link rel="stylesheet" type = "text/css"
  href="../style.css">
  <link rel="stylesheet" type = "text/css"
  href="../tbstyle.css">
  <body id="main-content" class>

  <!-- Facebook login -->
  <script src = "../jQuery.js"></script>

<head>

  <body id="main-content" class>

  <!-- Facebook login -->
  <script src= "../fb.js"></script>

  <!-- facebook login -->
  <?php include_once("toolbar.php") ?>

</body>
