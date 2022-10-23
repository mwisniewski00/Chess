import Piece from "./_Interface";

class Rook extends Piece {
    type: string = "Rook";

    canMove(column: string, row: number): boolean {

        if(this.row == row && this.column != column){
            return true;
        } 
        if(this.row != row && this.column == column){
            return true;
        }

        return false;
    }
}

export default Rook;
