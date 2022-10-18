import Piece from "./_Interface";

class Pawn extends Piece {
    type: string = "Pawn";

    canMove(column: string, row: number): boolean {
        if(this.column != column){
            return false;
        }

        if (this.isWhite){
            if(this.row + 1 == row){
                return true;
            } 
            if(this.row + 2 == row && !this.isMoved){
                return true
            }
        }
        else {
            if(this.row - 1 == row){
                return true;
            } 
            if(this.row - 2 == row && !this.isMoved){
                return true
            }
        }

        return false;
    }
}

export default Pawn;
