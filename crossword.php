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
  <script src="crossing.js"></script>
  <script src="intelligence.js"></script>

  <?php include_once("connect.php"); ?>

<body id="main-content" class>
  <?php include_once("toolbar.php") ?>
  <div id="opt1"class="option main-box">
    <h2 class="optTitle"> set grid</h2>
    <img class="optImg" src="opt1.jpg"/>
    <p class="optDesc"> set your length and width first.</p>
  </div>
  <div id="opt2"class="option main-box">
    <h2 class="optTitle"> build as you go</h2>
    <img class="optImg"/>
    <p class="optDesc"> Just start connecting words, figure out the grid
    size later.</p>
  </div>
  <div id="gridsize" class="option main-box">
    <h2>grid size</h2>
    <input id="len"class="input"type="text" placeholder="length" />
    <input id="wid"class="input"type="text" placeholder="width" />
    <div id="submit">
      create grid
    </div>
  </div>
  <div id="premade" class="main-box">
    <h2>Choose a layout</h2>
    <div id="layout1">Layout 1</div>
    <div id="blanklayout">Blank</div>
  </div>
  <div id="crossword" class="main-box">
    <div id="grid">

    </div>
  </div>
</body>
