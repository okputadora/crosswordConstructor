<?php include_once("connect.php");
function calculate_median($arr) {
$count = count($arr); //total numbers in array
$middleval = floor(($count-1)/2); // find the middle value, or the lowest middle value
if($count % 2) { // odd number, middle is the median
    $median = $arr[$middleval];
} else { // even number, calculate avg of 2 medians
    $low = $arr[$middleval];
    $high = $arr[$middleval+1];
    $median = (($low+$high)/2);
}
return $median;
}
  $partialWord = $_POST["word"];
  $crosses = $_POST["crosses"];
  $limit = 50;
  $mins = [];
  // $response = queryDB($partialWord, $limit, $dbc);
  $query = "SELECT * FROM nytclues WHERE answer LIKE '" .  $partialWord . "' LIMIT " . $limit;
  $response = @mysqli_query($dbc, $query);
  $answers = [];
  $allFreqs = [];
  // get all of the possible words
  while ($row = mysqli_fetch_array($response)){
    $freqs = [];
    $answer = $row['answer'];
    // for each crossing word
    $index = 0;
    foreach ($crosses as $value){
      // if the word is complete skip
      if ($value == "okputadora"){
        continue;
      }
      else{
        // insert the letter from $answer
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
        $count = mysqli_num_rows($response2);
      }
      array_push($freqs, $count);
      $index += 1;
      // echo $answer;
    }
    // get median
    $min = min($freqs);
    array_push($allFreqs, $freqs);
    array_push($mins, $min);
    array_push($answers, $answer);
  }
  // foreach($medians as $value){
  //   echo $value . "-";
  // }
  // get the word with the best possible crosses
  $maxIndex = array_search(max($mins),$mins);
  $answer = $answers[$maxIndex];
  $minMed = array_search(min($mins),$mins);
  $minIndex = array_search(min($allFreqs[$minMed]), $allFreqs[$minMed]);
  echo json_encode(array($answer, $minIndex));
?>
