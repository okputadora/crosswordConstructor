<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="content-type" content="text/xml; charset=utf-8" />
  <!--ensures proper rendering and touch zooming on mobile devices-->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Crossword</title>
  <!--import google font-->
  <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
  <!--import style sheet-->
  <link rel="stylesheet" type = "text/css"
  href="style.css">
<head>
  <script src="../jQuery.js"></script>
  <!-- <script src="crossing.js"></script> -->
  <script src="lohifreq.js"></script>
  <!-- <script src="intelligence.js"></script> -->
  <?php include_once("toolbar.php") ?>
<body id="main-content" class>
  <div id="#welcome" class="option intro-box">
    <p class="welcomeP" id="p1">Crossword constructor allows you to create your own crossword
    puzzles from scratch.</p>
    <p class="welcomeP" id="p2">You can fill in as much of the grid as you want</p>
    <p class="welcomeP" id="p3">And have the constructor do the rest</p>
  </div>
  <div id="gridsize" class="option main-box">
    <h2>Select a grid</h2>
    <div id="gridOpts">
      <div class="gridOpt" id="customGrid">
        <div class="gTitle">custom grid</div>
        <div class="gPic"></div>
        <input id="len"class="input"type="text" placeholder="length" />
        <input id="wid"class="input"type="text" placeholder="width" />
        <div id="submit">
          create grid
        </div>
      </div>
    </div>
  </div>

</body>
