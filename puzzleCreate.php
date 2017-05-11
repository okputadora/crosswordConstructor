<?php
if (isset($_GET['idx'])){
  $id = $_GET['idx'];
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="content-type" content="text/xml; charset=utf-8" />
  <!--ensures proper rendering and touch zooming on mobile devices-->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Create Puzzle</title>
  <!--import google font-->
  <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
  <!--import style sheet-->

  <link rel="stylesheet" type = "text/css"
  href="../tbstyle.css">
  <link rel="stylesheet" type = "text/css"
  href="../puzstyle.css">
  <body id="main-content" class>

  <!-- Facebook login -->
  <script src = "../jQuery.js"></script>
  <script src = "../lohifreq.js"></script>
  <script src = "../puzzleCreate.js"</script>

<head>

  <body id="main-content" class>

  <script src= "../fb.js"></script>

  <!-- facebook login -->
  <?php include_once("toolbar.php") ?>
  <div id="workspace">
    <div id='id'>></div>
    <div id="puzzleGrid">

    </div>
    <div id="puzzleCrossClues">

    </div>
    <div id="puzzleDownClues">

    </div>

  </div>

</body>
