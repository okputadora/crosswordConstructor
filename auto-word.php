<?php include_once("connect.php");

function calculate_median($arr) {
  $count = count($arr); //total numbers in array
  $middleval = floor(($count-1)/2); // find the middle value, or the lowest middle value
  if ($count % 2) { // odd number, middle is the median
      $median = $arr[$middleval];
  }
  else{ // even number, calculate avg of 2 medians
      $low = $arr[$middleval];
      $high = $arr[$middleval+1];
      $median = (($low+$high)/2);
  }
return $median;
}
  $partialWord = $_POST["word"];
  $crosses = json_decode($_POST["crosses"]);
  $limit = 60;
  $blacklist = json_decode($_POST["queryAdd"]);
  $mins = [];
  $query = "SELECT * FROM nytclues WHERE answer LIKE '" .  $partialWord . "' LIMIT " . $limit;
  // $response = queryDB($partialWord, $limit, $dbc);
  if (count($blacklist) > 0){
    $limit = 60;
    // blacklist to string
    $queryExt = "";
    foreach($blacklist as $value){
      $queryExt = $queryExt . "AND answer NOT LIKE '" . $value . "' ";
    }
    $query = "SELECT * FROM nytclues WHERE answer LIKE '" .  $partialWord ."' " . $queryExt . "LIMIT " . $limit;
  }
  $response = @mysqli_query($dbc, $query);
  $answers = [];
  $allFreqs = [];
  // get all of the possible words
  while ($row = mysqli_fetch_array($response)){
    $wordGood = true;
    $freqs = [];
    $answer = $row['answer'];
    // for each crossing word
    $index = 0;
    foreach ($crosses as $value){
      // if the word is already complete skip
      if ($value == "okputadora"){
        // setting the count to 10000 so we don't accidentally navigate
        // to this word next
        $count = 10000;
      }
      else{
        // insert the letter from $answer into the corresponding crossword
        $length = strlen($value);
        for ($i = 0; $i < $length; $i++){
          // replace
          if (substr($value, $i, 1) == "!"){
            $char = substr($answer, $index, 1);
            $value = substr_replace($value, $char, $i,1);
          }
        }
        $query2 = "SELECT * FROM nytclues WHERE answer LIKE '" . $value . "'";
        $response2 = @mysqli_query($dbc, $query2);
        // IF COUNT IS ZERO THIS $ANSWER WILL NOT DO
        $count = mysqli_num_rows($response2);
        if ($count == 0){
          $wordGood = false;
          break;
        }
      }
      array_push($freqs, $count);
      $index += 1;
      // echo $answer;
    }
    // get min
    if ($wordGood){
      $min = min($freqs);
      array_push($allFreqs, $freqs);
      array_push($mins, $min);
      array_push($answers, $answer);
    }
  }
  // if we found a suitable word
  if (sizeof($mins) > 1){
    $maxIndex = array_search(max($mins),$mins);
    $answer = $answers[$maxIndex];
    $minIndex = array_search(min($allFreqs[$maxIndex]), $allFreqs[$maxIndex]);
    echo json_encode(array($answer, $minIndex));
  }
  // we didn't find a suitable word
  else{
    echo json_encode(array("need to revise", $query));
  }
?>
