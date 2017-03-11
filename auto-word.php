<?php include_once("connect.php");
  $partialWord = $_POST["word"];
  $triedWords = json_decode(stripslashes($_POST["blacklist"]));
  $query = "SELECT * FROM nytclues WHERE answer LIKE '" .  $partialWord . "'";
  $response = @mysqli_query($dbc, $query);
  $count = mysqli_num_rows($response);
  while ($row = mysqli_fetch_array($response)){
    $answer = $row["answer"];
    if(empty($triedWords)){
      echo $answer;
      break;
    }
    else{
      if (in_array($answer, $triedWords)){
        continue;
      }
      else{
        echo $answer;
        break;
      }
    }
  }
?>
