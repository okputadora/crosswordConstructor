<?php include_once("connect.php");
  $partialWord = $_POST["word"];
  $triedWords = json_decode(stripslashes($_POST["blacklist"]));
  // could i add the blacklist to the query so theres fewer results to filter through
  $query = "SELECT * FROM nytclues WHERE answer LIKE '" .  $partialWord . "'";
  $response = @mysqli_query($dbc, $query);
  $count = mysqli_num_rows($response);
  $answer = 'okputadora';
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
  if ($answer == 'okputadora'){
    echo "OKPUTADORA";
  }
?>
