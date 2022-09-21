import { buildDeck, shuffleDeck } from './deck.js';

const NUM_OF_DECKS = 8;
const BANKER_BOARD = document.getElementById('banker');
const PLAYER_BOARD = document.getElementById('player');
const BANKER_POINTS = document.getElementById('banker-points');
const PLAYER_POINTS = document.getElementById('player-points');
const RESULT_MESSAGE = document.getElementById('result');
const PLAY_AGAIN = document.getElementById('playAgain');
const BET_BUTTONS = document.getElementById('betButtons');

let shoe = [];
let playerHand = [];
let bankerHand = [];
let playerPoints = 0;
let bankerPoints = 0;


// Builds shoe with 8 decks
for (let i = 0; i < NUM_OF_DECKS; i++) {
    shoe.push(buildDeck())
}

shoe = [].concat.apply([], shoe)

// shuffle shoe
shuffleDeck(shoe);


function dealCard(hand) {
    //create card to add
    return new Promise(function (resolve) {
        setTimeout(() => {
            let card = shoe.pop();
            let cardImg = document.createElement('img');
            cardImg.src = "./cards/" + card + ".png";
            if (hand == "banker") {
                bankerPoints += getValue(card);
                BANKER_BOARD.append(cardImg);
                bankerHand.push(card);
                BANKER_POINTS.innerText = `Points : ${calculatePoints(bankerPoints)}`
            }
            if (hand == "player") {
                playerPoints += getValue(card)
                PLAYER_BOARD.append(cardImg)
                playerHand.push(card);
                PLAYER_POINTS.innerText = `Points : ${calculatePoints(playerPoints)}`
            }
            resolve();
        }, 1000)
    })
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];
    if (isNaN(value)) {
        return value == "A" ? 1 : 0;
    } else if (value == "10") {
        return 0;
    } else {
        return parseInt(value);
    }
}

function calculatePoints(sum) {
    if (sum >= 10) {
        sum = sum % 10;
    }
    return sum;
}

function playerGetsThirdCard() {
    let points = calculatePoints(playerPoints);
    return points < 6 ? true : false;
}

function bankerGetsThirdCard() {
    let bankerDraws = false;
    let points = calculatePoints(bankerPoints);

    let playerLastCard = getValue(playerHand[playerHand.length - 1]);

    if (playerHand.length == 2 && calculatePoints(bankerPoints) < 6) {
        return true;
    }
    else if (playerHand.length == 3) {
        switch (playerLastCard) {
            case 2:
            case 3:
                bankerDraws = points < 5;
                break;
            case 4:
            case 5:
                bankerDraws = points < 6;
                break;
            case 6:
            case 7:
                bankerDraws = points < 7;
                break;
            case 8:
                bankerDraws = points < 3;
                break;
            case 0:
            case 1:
            case 9:
                bankerDraws = points < 4;
        }
    }
    return bankerDraws;
}

async function startGame(bet) {
    BET_BUTTONS.style.display = "none";
    RESULT_MESSAGE = `You bet ${bet}`;
    await dealCard("player")
    await dealCard("banker")
    await dealCard("player")
    await dealCard("banker")

    if (playerGetsThirdCard()) {
        await dealCard("player")
    }

    if(bankerGetsThirdCard()){
        await dealCard("banker")
    }

    RESULT_MESSAGE.innerText = results();
    PLAY_AGAIN.style.display = "initial";
}

function results(){
    let playerScore = calculatePoints(playerPoints);
    let bankerScore = calculatePoints(bankerPoints);
    let result = '';

    if(playerHand.length ==2 && (player == 8 || player == 9) && playerScore != bankerScore){
        result = "Player Wins!"
    }else if((bankerHand.length ==2 && bankerScore == 8 || bankerScore == 9 ) && playerScore != bankerPoints){
        result = "Banker Wins!"
    }else if(playerScore == bankerScore){
        result = "Tie!"
    }else if(bankerScore > playerScore){
        result = "Banker Wins!"
    }else{
        result = "Player Wins!"
    }

    return result;
}
function test(){
    alert('this is a test')
}