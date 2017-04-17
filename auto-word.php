<?php include_once("connect.php");
  $partialWord = $_POST["word"];
  $triedWords = json_decode(stripslashes($_POST["blacklist"]));
  $queryPart = $_POST["addQuery"];
  // could i add the blacklist to the query so theres fewer results to filter through
  $query = "SELECT * FROM nytclues WHERE (answer LIKE '" .  $partialWord . "'") + $queryPart;
  $response = @mysqli_query($dbc, $query);
  $count = mysqli_num_rows($response);
  $answer = 'okputadora';
  // if theres no words
  if ($count == 0){
    echo "nothing in database that matches partial word";
  }
  while ($row = mysqli_fetch_array($response)){

    if (in_array($row["answer"], $triedWords)){
      continue;
    }
    else{
      $answer = $row["answer"];
      echo $answer;
      break;
    }
  }
  // if there are words but they;ve all been blacklisted
  if ($answer == 'okputadora'){
    echo "OKPUTADORA";
  }
?>
