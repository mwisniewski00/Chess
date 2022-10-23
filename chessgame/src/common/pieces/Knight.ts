import Piece from "./_Interface";

class Knight extends Piece {
    type: string = "Knight";

    canMove(column: string, row: number): boolean {
        if(this.columnDifference(column) ==  2 && this.rowDifference(row) == 1){
            return true;
        } 
        
        if(this.columnDifference(column) ==  1 && this.rowDifference(row) == 2){
            return true;
        }
        return false;
    }
}

export default Knight;
