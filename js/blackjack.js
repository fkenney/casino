import{shuffleDeck,buildDeck} from './deck.js';
let blackjack = false;
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

function dealCard(player){
    //create card to add
    return new Promise(function(resolve){
        setTimeout(()=>{
            let card = deck.pop();
            let cardImg = document.createElement('img');
            cardImg.src ="../cards/"+card+".png";
            if (player == "dealer"){
                dealerSum += getValue(card)
                dealerAceCount+= checkAce(card)
                DEALER_BOARD.append(cardImg)
                displayResults();
            }
            if( player == "player"){
                yourSum += getValue(card);
                yourAceCount+= checkAce(card);
                PLAYER_BOARD.append(cardImg);
                displayResults();
            }
           resolve();
        }, 1000)
    })
}

async function startGame(){
    hidden = deck.pop();
    dealerSum += getValue(hidden);
  
    await dealCard("dealer");
    await dealCard("player");
    await dealCard("player");


    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    displayResults();

    if(yourSum == 21){
        blackjack = true;
        await stay();
        alert("Blackjack!");
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

async function hit(){
    if(!canHit){
        return;
    }
    await dealCard("player")
    
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

async function stay(){
 
    while (dealerSum < 17){
        await dealCard("dealer")
    }
    document.getElementById("hidden").src = "../cards/"+ hidden+".png";

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    canHit = false;
    let message = "";
    if(yourSum > 21){

        message = " - You Lose!";

    }else if(dealerSum > 21){
        document.getElementById('dealer-bust').innerText = " (Bust)"
        message = " - You Win!"

    }else if(yourSum == dealerSum){
        message = " - Tie!"
    }else if( yourSum > dealerSum){

        message = " - You Win!";
    }else{
        message = " - Your Lose!";
    }
    document.getElementById("results").innerText = message;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("dealer-sum").innerText = dealerSum;
}

function displayResults(){
    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
    document.getElementById("dealer-sum").innerText = reduceAce((dealerSum - getValue(hidden)), dealerAceCount);
}