$(document).ready(function(){
  // if auto-fill word is clicked
  $("#auto-word").on("click", function(){
    // find the highlighted word
    var partialWord = "";
    for (i in hLightedArea){
      var box = hLightedArea[i].toString();
      var letter = $(box).val();
      if (letter === ""){
        letter = "_";
      }
      partialWord += letter;
    }

    $.ajax({
      url: "auto-word.php",
      type: "POST",
      data: ({word: partialWord}),
      success: function(data){
        var foundWord = data;
        console.log(hLightedArea);
        console.log(foundWord);
        for (i in hLightedArea){
          console.log(foundWord.length);
          $(hLightedArea[i]).val(foundWord.charAt(i));
        }
      }

    })
  })
})
