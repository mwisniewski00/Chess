const pieces = {
    "K": "King",
    "Q": "Queen",
    "N": "Knight",
    "R": "Rook",
    "P": "Pawn",
    "B": "Bishop"
}

class Piece {
    type: string;
    color: boolean; // true - white | false - black
    name: string

    constructor(type: string){
        
        if(type.length != 1){
            return;
        }

        if (type.toUpperCase() === type) {
            this.color = true;
        }else {
            this.color = false;
        }
        
        this.name = pieces[type.toUpperCase()]
    }
}