<?php
if (isset($_GET['idx'])){
  $id = $_GET['idx'];
}
$name = "okputadora";
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
  <script src = "../puzzleCreate.js"></script>

<head>

  <body id="main-content" class>

  <!-- <script src= "../fb.js"></script> -->
  <?php include_once("toolbar.php") ?>
  <?php include_once("tools.php") ?>
  <!-- facebook login -->

  <div id="workspace">
    <!-- idx for the sole purpose of telling js the id it can build the grid -->
    <div id='idx'><?php echo $id ?></div>
    <div id='puzName'><input type="text" id='puzNameIn'placeholder="Title"/></div>
    <div id='puzAuth'>By <?php echo $name ?></div>
    <div id="puzArea">
      <div class="clues"id="puzzleCrossClues">
        <div class="clueTitle">Across</div>
        <div class="clueBox" id="crossClueBox">

        </div>
      </div>
      <div id="puzzleGrid" tabindex="1">
        <div class="grid"id="grid<?php echo $id ?>"></div>
        <div id="suggestionBox">
          <div id="suggestionBanner">
            <div id="suggestionT">Suggestions...</div>
            <div id="suggestionI"><i class="fa fa-info-circle" aria-hidden="true"></i></div>
          </div>
          <div id="suggestionOpts">

          </div>
        </div>
      </div>
      <div class="clues"id="puzzleDownClues">
        <div class="clueTitle">Down</div>
        <div class="clueBox" id="downClueBox">

        </div>
      </div>
    </div>
  </div>

</body>
