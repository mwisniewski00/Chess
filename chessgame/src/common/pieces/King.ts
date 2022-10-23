import Piece from "./_Interface";
class King extends Piece {
    type: string = "King";

    canMove(column: string, row: number): boolean {

        if(this.rowDifference(row) <= 0 && this.columnDifference(column) <= 0){
            return false
        }

        if (this.rowDifference(row) <= 1 && this.columnDifference(column) <= 1){
            return true
        }
        return false;
    }
}

export default King;
