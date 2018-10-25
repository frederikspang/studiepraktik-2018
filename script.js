function getPeriodsCount(str) {
  // Regex matching for any character in ".", "?", "!", and return /g (global matches)
  var matches = str.match(/[\.?!]/g);

  // Matches present, and its length, or default to 0
  return (matches && matches.length) || 0;
}

function getWordCount(str) {
  // Regex matching \w (letter/word characters), + means 1 or more
  var matches = str.match(/\w+/g) || []

  return (typeof matches == 'object') && matches.length || 0;
  // return str.split(/[ ]/).filter(function(s){ return s.trim() != '' }).length;
}

// Get all long words, more than 7 characters.
function getLongWordCount(str) {
  // Regex matching \w (letter/word characters), {7,} means between 7 or infinity (7 or more)
  var matches = str.match(/[\w]{7,}/g);

  return matches && matches.length || 0
}

// By formula in sheet
function getLixNumber(str) {
  if (getWordCount(str) == 0) return 1;
  if (getPeriodsCount(str) == 0) return 1;

  return getWordCount(str) / getPeriodsCount(str) + getLongWordCount(str) * (100 / getWordCount(str));
}

// Simple falldown method. Only check for < becuase return will exit the method with a return value.
function getClass(lixNumber) {
  if (lixNumber < 10) return 1;
  if (lixNumber < 20) return 2;
  if (lixNumber < 25) return 3;
  if (lixNumber < 30) return 4;
  if (lixNumber < 35) return 5;
  if (lixNumber < 40) return 6;
  if (lixNumber < 45) return 7;
  if (lixNumber < 50) return 8;

  return 9;
}

function mostCommonWord(str) {
  let word = {};
  $.each(str.split(' '), function(i, s){
    word[s] = (word[s] ? word[s] + 1 : 1);
  });
  return Object.keys(word).reduce(function(acc, v) { return (word[v] > word[acc]) ? v : acc; });
}

// Scales colour from 0 to 255 based on percentage
function getGreenToRed(percent){
  r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
  g = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
  return 'rgb(' + r + ', ' + g + ', 0)';
}

$(document).ready(function(){
  button = document.getElementById("calc_button");
  textArea = document.getElementsByName("Text1")[0];
  lixScoreField = document.getElementById("lixScore_field");
  numWordsField = document.getElementById("numWords_field");
  numPeriodsField = document.getElementById("numPeriods_field");
  numSentencesField = document.getElementById("numSentences_field");
  avgSentenceLengthField = document.getElementById("avgSentenceLength_field");
  classField = document.getElementById("class_field");
  commonWord = document.getElementById("common_word");

  /* ------------- ARBEJDE -------------- */
  button.onclick = function () {
    /* I kan hente teksten indtastet af brugeren således: */
    var userInput = textArea.value.trim(); // Trim to remove whitespace.
    var lixNumber = getLixNumber(userInput);

    /* Udfyld kasser */
    lixScoreField.innerHTML = lixNumber;

    numWordsField.innerHTML = getWordCount(userInput)
    numPeriodsField.innerHTML = getPeriodsCount(userInput)

    // Matches all .!? that is followed by a space or a word. That is the sentence count.
    numSentencesField.innerHTML = userInput.split(/[\.?!][ \w]/).length;

    // Length will be split by all dots. Map by reuse of the getWordCount from above; And then summed of and divided
    // by the count. (reduce can be used to sum as seen below.)
    avgSentenceLengthField.innerHTML = function (userInput) {
      var counts = $.map(userInput.split(/[\.?!]/), function(s){ return getWordCount(s); });
      return counts.reduce(function(i, s) { return s + i }) / counts.length;
    }(userInput);

    classField.innerHTML = getClass(lixNumber);
    // Adds a background colour to parent element; Given percentage of grade, 5/9 for 5th grade.
    classField.parentElement.style.backgroundColor = getGreenToRed(getClass(lixNumber) / 9 * 100);

    commonWord.innerHTML = mostCommonWord(userInput);
  }
})
