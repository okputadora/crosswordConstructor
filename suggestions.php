<?php include_once("connect.php");
$partialWord = $_POST["word"];
$crosses = json_decode($_POST["crosses"]);
$limit = 10; // should make this dynamic and allow user to change in the settings
$query = "SELECT answer FROM nytclues WHERE answer LIKE '" .  $partialWord . "' LIMIT " . $limit;
$response = @mysqli_query($dbc, $query);
$answers = [];
$freqs = [];
$index = 0;
// get all of the possible words
while ($row = mysqli_fetch_array($response)){
  $answer = $row['answer'];
  $length = strlen($value);
  // for each crossing word
  foreach ($crosses as $value){
    // put the corresponding letter in
    for ($i = 0; $i < $length; $i++){
      // replace
      if (substr($value, $i, 1) == "_"){
        $char = substr($answer, $index, 1);
        $value = substr_replace($value, $char, $i,1);
      }
    }
    $query2 = "SELECT * FROM nytclues WHERE answer LIKE '" . $value . "'";
    $response2 = @mysqli_query($dbc, $query2);
    $count = mysqli_num_rows($response2);
    if ($count == 0){
      break;
    }
    array_push($answers, $answer);
    array_push($freqs, $count);
    $index += 1;
  }
  array_push($allFreqs, $freqs)
}
// order words into array based off freqs
