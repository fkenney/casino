
let buildDeck =function (){
    let deck = [];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let type = ["C", "D", "H", "S"];
    
    for (let i = 0; i < type.length; i ++){
        for(let j = 0; j < values.length; j++){
            deck.push(`${values[j]}-${type[i]}`)
        }
    }
    return deck;
}

let shuffleDeck = function (deck){
    for(let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random()*deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
   
}

export {buildDeck, shuffleDeck}
