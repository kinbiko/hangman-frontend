
document.onkeypress = keyPressed;
document.getElementById("newGame").onclick = newGame;

//Global variables. YOLO.
var keyClicked;
var word;
var replaceAllRegex;
var secretWord;
var guesses;
var lives;
var status;
var playing;

newGame();

function keyPressed(e) {
  if(playing){
    keyClicked = String.fromCharCode(e.charCode); // Converts char code to character
    if (!keyClicked) {
      return false;
    }
    document.formex.keypress.value = keyClicked;
    console.log("Character clicked: " + keyClicked);
    guess(keyClicked);
    return true;
  }
}

function guess(characterPressed){
  var notGuessedBefore = hasNotBeenGuessedBefore(characterPressed);
  if(notGuessedBefore){
    if (word.indexOf(characterPressed) === -1){
      console.log("word does not contain " + characterPressed);
      modifyLives();
    } else {
      console.log("the letter '" + characterPressed + "' is found in the word.");
      modifySecretWord(characterPressed);
    }
  }
  if(secretWord === word){
    gameWon();
  } else if (lives === 0){
    gameLost();
  }

  updateView();
}

function hasNotBeenGuessedBefore(guess){
  if(guesses.indexOf(guess) >-1){
    console.log(guess + " has been guessed before.");
    return false;
  } else {
    console.log("first time guessing: " + guess);
    guesses.push(guess);
  }
  return true;
}

function newGame(){
  keyClicked = 0;
  var retrieved = httpGet("https://morning-everglades-4066.herokuapp.com/hangman");
  var json = JSON.parse(retrieved);
  word = json.word;
  replaceAllRegex = /./g //Regex: /./ = all characters, g = global (throughout the string).
  secretWord = word.replace(replaceAllRegex, "*");
  guesses = [];
  lives = 5;
  status = "";
  playing = true;
  updateView();
}

function gameWon(){
  status = "You've won!"
  playing = false;
}

function gameLost(){
  status = "You've lost! The password was '" + word + "'.";
  playing = false;
}

function modifySecretWord(guess){
  for (var i = word.length - 1; i >= 0; i--) {
    if(word[i] === guess){
      secretWord = secretWord.replaceAt(i, word[i]);
    }
  };
  console.log("updating secretWord: " + secretWord);
}

function modifyLives(){
  console.log("decrementing lives.");
  lives--;
}

String.prototype.replaceAt=function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
}

function updateView(){
  document.getElementById("guesses").innerHTML = guesses;
  document.getElementById("password").innerHTML = secretWord;
  document.getElementById("lives").innerHTML = lives;
  document.getElementById("status").innerHTML = status;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}