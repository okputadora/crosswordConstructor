<?php include_once("connect.php");
  $partialWord = $_POST["word"];
  $triedWords = json_decode(stripslashes($_POST["blacklist"]));
  // could i add the blacklist to the query so theres fewer results to filter through
  $query = "SELECT * FROM nytclues WHERE answer LIKE '" .  $partialWord . "'";
  $response = @mysqli_query($dbc, $query);
  $count = mysqli_num_rows($response);
  $answer = 'okputadora';
  if ($count == 0){
    $answer = '';
    echo "okputadora";
  }
  while ($row = mysqli_fetch_array($response)){
    $answer = $row["answer"];
    if(empty($triedWords)){
      echo $answer;
      break;
    }
    if (in_array($answer, $triedWords)){
      continue;
    }
    else{
      echo $answer;
      break;
    }
  }
?>
