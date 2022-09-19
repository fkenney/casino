import{shuffleDeck,buildDeck} from './deck.js';

let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let canHit = true; 
let deck = buildDeck();
const DEALER_BOARD = document.getElementById('dealer-cards');
const PLAYER_BOARD = document.getElementById('your-cards')
deck = shuffleDeck(deck);
startGame();


function startGame(){
    hidden = deck.pop();
    dealerSum += getValue(hidden);

    let card = deck.pop();
    let cardImg = document.createElement('img');
    cardImg.src ="./cards/"+card+".png";
    dealerSum += getValue(card);
    dealerAceCount+= checkAce(card)
    DEALER_BOARD.append(cardImg)

    for (let i = 0; i < 2; i++){
        let card = deck.pop();
        let cardImg = document.createElement('img');
        cardImg.src ="./cards/"+card+".png";
        yourSum += getValue(card);
        yourAceCount+= checkAce(card);
        PLAYER_BOARD.append(cardImg);
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    displayResults();
    if(yourSum == 21){
        stay();
    }

}

function getValue(card){
    let data = card.split("-");
    let value = data[0];

    if(isNaN(value)){
        if(value == "A"){
            return 11;
        }
            return 10;
    }
    return parseInt(value);
}

function checkAce(card){
    return card[0] == "A"? 1 : 0;
}

function hit(){
    if(!canHit){
        return;
    }
    let card = deck.pop();
    let cardImg = document.createElement('img');
    cardImg.src ="./cards/"+card+".png";
    yourSum += getValue(card);
    yourAceCount+= checkAce(card);
    PLAYER_BOARD.append(cardImg);
    
    if (reduceAce(yourSum, yourAceCount) > 21){
        canHit = false;
        document.getElementById('player-bust').innerText = " (Bust)"
        stay();
    }
    displayResults()
}

function reduceAce(sum, aceCount){
    while(sum > 21 && aceCount > 0){
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}

function stay(){
    if(yourSum != 21){
        while (dealerSum < 17){
            let card = deck.pop();
            let cardImg = document.createElement('img');
            cardImg.src ="./cards/"+card+".png";
            dealerSum += getValue(card);
            dealerAceCount+= checkAce(card)
            DEALER_BOARD.append(cardImg)
        }
        document.getElementById("hidden").src = "./cards/"+ hidden+".png";
    }    
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        yourSum = reduceAce(yourSum, yourAceCount);
        canHit = false;
        let message = "";
    if(yourSum > 21){

        message = "You Lose!";

    }else if(dealerSum > 21){
        document.getElementById('dealer-bust').innerText = " (Bust)"
        message = "You Win!"

    }else if(yourSum == dealerSum){
        message = "Tie!"
    }else if( yourSum > dealerSum){

        message = "You Win!";
    }else{
        message = "Your Lose!";
    }
    document.getElementById("results").innerText = message;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
}

function displayResults(){
    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
    document.getElementById("dealer-sum").innerText = reduceAce((dealerSum - getValue(hidden)), dealerAceCount);
}