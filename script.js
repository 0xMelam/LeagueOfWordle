import { champions } from "./champions.js";

const numberOfGuesses = 5;
let guessesRemaining = numberOfGuesses;
let currentGuess = [];
let nextLetter = 0;
let correctChampion = champions[Math.floor(Math.random()*champions.length)];

console.log(correctChampion);


//creating the game board

function initBoard(){
    let board = document.getElementById("game-board");

    for (let i = 0; i < numberOfGuesses; i++){
        let row = document.createElement("div");
        row.className = "letter-row";

        for(let j = 0; j<correctChampion.length; j++){
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }
        board.appendChild(row);
    }
}
initBoard();

//listening to user's keyboard input

document.addEventListener("keyup", (e) =>{
    if(guessesRemaining === 0){
        return
    }

    let pressedKey = String(e.key);
    
    if(pressedKey === "Backspace" && nextLetter !== 0){
        deleteLetter();
        return;
    }

    if(pressedKey === "Enter"){
        checkGuess();
        return
    }

    //checking that the key pressed was an alphabetical key representing a single letter. If that' not the case, we ignore it.

    let found = pressedKey.match(/[a-z]/gi)

    if(!found || found.length > 1){
        return
    }else{
        insertLetter(pressedKey);
    }
})



//Checks the row, and deletes the last letter typed

function deleteLetter(){
    let row = document.getElementsByClassName("letter-row")[5-guessesRemaining];
    let box = row.children[nextLetter-1];
    box.textContent ="";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -=1;
}

//checks if the letter is in the champion's name and puts it in the box in the appropriate row.

function insertLetter(pressedKey){
    if(nextLetter === correctChampion.length){
        return
    }
    pressedKey = pressedKey.toLowerCase();
    
    let row = document.getElementsByClassName("letter-row")[5-guessesRemaining]
    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box")
    currentGuess.push(pressedKey);
    nextLetter +=1;
}

//function checkGuessDescription:

function checkGuess(){
    let row = document.getElementsByClassName("letter-row")[5-guessesRemaining];
    let guessString ='';
    let rightGuess = Array.from(correctChampion);

    for(const val of currentGuess){
        guessString +=val;
    }

    if(guessString.length != correctChampion.length){
        toastr.error("Not enough letters!");
        return;
    }

    if(!champions.includes(guessString)){
        toastr.error("Champion is not yet released :p ");
        return
    }

    for(let i=0; i<correctChampion.length; i++){
        let letterColor ='';
        let box = row.children[i];
        let letter = currentGuess[i];

        let letterPosition = rightGuess.indexOf(currentGuess[i]);

        if(letterPosition === -1){
            letterColor = 'grey';
        }else{
            if(currentGuess[i] === rightGuess[i]){
                letterColor ='green';
            }else{
                letterColor = 'yellow';
            }

            rightGuess[letterPosition] = '#';
        }

        let delay = 250 * i;
        setTimeout(()=>{
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor)
        }, delay);
    }
    if(guessString === correctChampion){
        toastr.success("Correct! Game Over");
        guessesRemaining = 0;
        return
    }else{
        guessesRemaining -=1;
        currentGuess = [];
        nextLetter = 0;

        if(guessesRemaining === 0){
            toastr.error("You have run out of guesses! Game Over!")
            toastr.info(`The correct champion was: "${correctChampion}"`)
        }
    }
}

function shadeKeyBoard(letter,color){
    for(const elem of document.getElementsByClassName("keyboard-button")){
        if(elem.textContent === letter){
            let oldColor = elem.style.backgroundColor;
            if (oldColor === 'green'){
                return
            }

            if(oldColor === 'yellow' && color !== 'green'){
                return
            }

            elem.style.backgroundColor = color;
        }
    }
}

//adding animation

const animateCSS = (element, animation, prefix ='animate__') => new Promise((resolve, reject) =>{
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty('--animate-duration', '0.3s');

    node.classList.add(`${prefix}animated`,animationName);

    function handleAnimationEnd(event){
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once:true});
});