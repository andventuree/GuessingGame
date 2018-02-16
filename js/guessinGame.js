console.log('JS file is connected');
function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

function generateWinningNumber(){
	return Math.floor(Math.random() * 100) + 1; //num 1-100;
}

function newGame(){ //this makes a clean game but doesn't necessarily reset the game
	let game = new Game();
	return game;
	//creates new Game instances
}

Game.prototype.difference = function(){
	return Math.abs(this.winningNumber - this.playersGuess); 
	//used to indicate how close the player is
}

Game.prototype.isLower = function(){
	return this.winningNumber > this.playersGuess ? true : false;
	//returns true if the playersGuess is lower than winningNumber, 
	//and false if not.
}

Game.prototype.playersGuessSubmission = function(guess){
	if(guess < 1 || guess > 100 || isNaN(guess)) {
		throw "That is an invalid guess.";
	} 
	this.playersGuess = guess;
	return this.checkGuess();		
}

function endGameMessages(){
	$('#submit').prop('disabled', true); //multiple selectors breaks this method
	$('#hint').prop('disabled', true);
	$('#player-input').prop('disabled', true); //so no more input is accepted
	$('#player-input').attr('placeholder', "^ o ^");
	$('#subtitle').text("Click the reset button or the 'r' key to play again!!");
};

Game.prototype.checkGuess = function(){
	if(this.playersGuess === this.winningNumber){
		// $('#title').text("You Win!"); //will be done by guessProcess func below
		endGameMessages();
		this.pastGuesses.push(this.playersGuess); //just cause you win doesn't mean you shouldnt store the number!
		$('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess); //what is this line???
		return "You Win!";
	} 
	else {//&& this.pastGuesses.length <= 5
		if(this.pastGuesses.indexOf(this.playersGuess) !== -1 ){ //&gt; num -----> greater than 
			// $('#title').text("You've already guessed that! Guess again"); //will be done by guessProcess func below
			return "You have already guessed that number.";
		} else {
			this.pastGuesses.push(this.playersGuess);
			$('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess); //what is this line???
			
			if(this.pastGuesses.length >= 5){		
			//technically, you shouldnt be able to guess if you've already hit 5 guesses before this attempt;
				// $('#title').text("You Lose."); //will be done by guessProcess func below
				endGameMessages();
				return "You Lose.";
			} 
			else { //if (this.pastGuesses.length < 5) was not the solution to prevent further numbers
				var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
				if(this.difference() < 10){		
				//need to call the difference method to get the value
					return "You're burning up!";
				} else if(this.difference() < 25){
					return "You're lukewarm.";
				} else if(this.difference() < 50){
					return "You're a bit chilly.";
				} else if(this.difference() < 100){ //&lt; num -----> less than 
					return "You're ice cold!";
				}
			}
		} 
	}
}

Game.prototype.provideHint = function(){
	let hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber() ]; //array will store 3 hints
	return shuffle(hintArr);
}

function shuffle(arr){ //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
	let leftoverElem = arr.length,		//have an arr length counter 
		tempHoldingElem, 	
		randNum;
	
	while(leftoverElem){ 	//while m is positive???? 
				//if you set leftoverElem = 0, while loop would not run
		randNum = Math.floor(Math.random() * leftoverElem--); //generate a random number between index 0 and remaining arr.length (e.g., 0-2)	
		// console.log(randNum);
		tempHoldingElem = arr[leftoverElem] //temp store the last elem somewhere
		arr[leftoverElem] = arr[randNum]; //the last elem of the arr will go to a random index
		arr[randNum] = tempHoldingElem;
	}
	return arr;
}

//-----------------------------------------------------------------------------

//made this function to DRY up code
function guessProcess(game){ //should this be above doucment ready?
	var playerGuess = $('#player-input').val(); //retains the player's guess
	$('#player-input').val(""); //clears the player's guess

	console.log(playerGuess);
	var output = game.playersGuessSubmission(parseInt(playerGuess, 10)); 
	//pass in the guess so JS can start running
	$('#title').text(output); //updates the title with .checkGuess() output which comes from playersGuessSubmission()
}

function resetGame(){
	game = newGame(); //resets the game
	//reset back to original text
	$('#title').text("Guessing Game"); 
	$('#subtitle').text("Guess a number between 1-100");
	$('.guess').text('-');
	$('#player-input').attr('placeholder', "#");
	//undisable buttons
	$('#submit').prop('disabled', false); //multiple selectors breaks this method
	$('#hint').prop('disabled', false);
	$('#player-input').prop('disabled', false); 
	console.log('Game has been reset');
}

//Place this ready function at the bottom to only run when all HTML CSS and JS has loaded.
$(document).ready(function(){
	var game = new Game(); //starting the first game when page loads
	$('#player-input').select();
	$('#submit').on('click', function(e){
		guessProcess(game); //after submitted guess, calculations start	
	});
	
	$('#player-input').on('keypress', function(event){ //this is where the player will most likely type enter //this is different from submitting a button
		if( event.which == 13 ){ //13 is enter key
			guessProcess(game);
		}
	});

	$('#hint').on('click', function(e){
		var hint = game.provideHint();
		$('#title').text('The right number is either ' + hint[0] + ", " + hint[1] + ", or " + hint[2] + ".");
		console.log('Hint provided')
	});

	$('#reset').on('click', function(){
		resetGame();
	});

	// $('#reset').on('keypress', function(event){
	// 	if( event.keyCode == 114 ) { //try to use r key to reset game but not working
	// 		resetGame();
	// 	}
	// });  
});