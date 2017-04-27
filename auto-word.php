<?php include_once("connect.php");
  // $partialWord = $_POST["word"];
  // $strlen = strlen($partialWord);
  // $crosses = $_POST["crosses"];
  // $freqs = [];
  // // $index = $_POST["intersection"];
  // $triedWords = json_decode(stripslashes($_POST["blacklist"]));
  // $queryPart = $_POST["addQuery"];
  // // could i add the blacklist to the query so theres fewer results to filter through
  // $query = "SELECT * FROM nytclues WHERE (answer LIKE '" .  $partialWord . "')" . $queryPart;
  // $response = @mysqli_query($dbc, $query);
  // $count = mysqli_num_rows($response);
  // $ticker = 0;
  // $answer = 'okputadora';
  // $allFreqs = [];

  echo "he";
  // if theres no words
  // if ($count == 0){
  //   echo "nothing in database that matches partial word";
  // }
  // else{
  //   while ($row = mysqli_fetch_array($response)){
  //     // if (in_array($row["answer"], $triedWords)){
  //     //   continue;
  //     // }
  //     // else{
  //       // put the letters from this word in the crossing words
  //       for ($i = 0; $i <= $strlen; $i++){
  //         $char = substr($str, $i, 1);
  //         // the line below is in JS need PHP equiv
  //         $altCross = substr_replace($crosses[$i],$char,$index,1);
  //         // check the frequency of this word
  //         $query2 = "SELECT * FROM nytclues WHERE answer LIKE '" . $altCross . "'";
  //         $crossResponse = @mysqli_query($dbc, $query2);
  //         $crossCount = mysqli_num_rows($crossResponse);
  //         // if count is zero we need to change the original query
  //         // otherwise save this info
  //         array_push($freqs, $crossCount);
  //       }
  //       // save for compairson
  //       array_push($allFreqs, $freqs);
  //       // check the crossing words
  //       $ticker += 1;
  //       // if ($ticker > 9){
  //       //   break;
  //       // }
  //       break;
  //     // }
  //   }
  //   // if there are words but they;ve all been blacklisted
  //   if ($answer == 'okputadora'){
  //     echo "OKPUTADORA";
  //   }
  //   echo json_encode($allFreqs);
  // }
?>
