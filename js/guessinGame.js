function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

function generateWinningNumber(){
	return Math.floor(Math.random() * 100) + 1; //num 1-100;
}

function newGame(){
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

Game.prototype.checkGuess = function(){
	if(this.playersGuess === this.winningNumber){
		return "You Win!";
	} else if(this.pastGuesses.indexOf(this.playersGuess) !== -1){
		return "You have already guessed that number.";
	} else {
		this.pastGuesses.push(this.playersGuess);
	} 

	if(this.pastGuesses.length === 5){		
	//technically, you shouldnt be able to guess if you've already hit 5 guesses before this attempt;
		return "You Lose.";
	} else if(this.difference() < 10){		
	//need to call the difference method to get the value
		return "You're burning up!";
	} else if(this.difference() < 25){
		return "You're lukewarm.";
	} else if(this.difference() < 50){
		return "You're a bit chilly.";
	} else if(this.difference() < 100){
		return "You're ice cold!";
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