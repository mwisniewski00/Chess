import Piece from "./_Interface";

class Bishop extends Piece {
    type: string = "Bishop";

    canMove(column: string, row: number): boolean {

        if(this.columnDifference(column) == this.rowDifference(row) && this.row != row){
            return true;
        } 

        return false;
    }
}

export default Bishop;
