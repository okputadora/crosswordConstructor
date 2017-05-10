<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="content-type" content="text/xml; charset=utf-8" />
  <!--ensures proper rendering and touch zooming on mobile devices-->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Crossword Constructor</title>
  <!--import google font-->
  <link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
  <!--import style sheet-->
  <link rel="stylesheet" type = "text/css"
  href="style.css">
<head>
  <script src="jQuery.js"></script>
  <!-- <script src="crossing.js"></script> -->
  <script src="lohifreq.js"></script>
  <!-- <script src="intelligence.js"></script> -->
<body id="main-content" class>

<!-- Facebook login -->
<script src= "fb.js"></script>

<!-- facebook login -->
<?php include_once("toolbar.php") ?>
  <div id="loginPage" class="intro-box">
    <div id="loginB" class="lButton">Sign Up</div>
    <div id="signUp" class="lButton">Login</div>
    <div id="create" class="lButton">Create A Puzzle</div>
  </div>
  <div id="loginBox" class="lBox intro-box">
    <h2 class="lboxTitle">Login to Crossword Constructor</h2>
    <div class="fb-login-button" data-width="300" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="true"></div>
    <div style="margin-top: 10px;">or login manually</div>
    <input class="manualLogin" id="emailL" type="email" placeholder="email"></form>
    <input class="manualLogin" id="pwL" type="password" placeholder="password"></form>
    <div class="enterB" id="login">Login</div>
  </div>
  <div id="signUpBox" class="lbox intro-box">
    <h2 class="lboxTitle">Create an Account</h2>
    <div class="fb-login-button" data-width="300" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"></div>
    <div style="margin-top: 10px;">or create a new account</div>
    <input class="manualLogin" id="emailC" type="email" placeholder="email"></form>
    <input class="manualLogin" id="pwC" type="password" placeholder="password"></form>
    <div class="enterB" id="createNew">create new account</div>
  </div>
  <div id="welcome" class="option intro-box">
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
